# Backend Video Streaming Fix

## Issues Found:
1. **Range header requirement**: Backend returns 400 if Range header is missing, but initial video requests often don't have it
2. **No range parsing**: When Range header exists, it's not parsed or handled
3. **No 206 Partial Content**: Backend doesn't return proper HTTP 206 responses for range requests
4. **Cache streaming**: Cached files don't support range requests
5. **Live transcoding**: Can't handle range requests during live transcoding

## Fixed Backend Code:

```typescript
@Get('video-buy/fieldId/get/:fileId')
async streamVideo(
  @Param('fileId') fileId: string,
  @Res() res: any,
  @Req() req: any,
  @Query('quality') quality: string,
) {
  try {
    const cacheDir = path.join(__dirname, '../../files/video-cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const cacheFile = path.join(cacheDir, `${fileId}_${quality || 'original'}.mp4`);
    const scaleMap: Record<string, string> = {
      '480p': 'scale=854:480',
      '720p': 'scale=1280:720',
      '1080p': 'scale=1920:1080',
    };

    // ✅ Step 1 — Serve from cache if available
    if (fs.existsSync(cacheFile)) {
      console.log(`🎥 Serving cached ${quality} version for ${fileId}`);
      return this.serveFileWithRange(req, res, cacheFile);
    }

    // ✅ Step 2 — No cache, need to transcode
    console.log(`⚙️ Transcoding new ${quality} version for ${fileId}...`);
    const metadata = await fetchVideoMetadata(fileId);
    if (!metadata || !metadata.size) throw new NotFoundException('Video metadata not found');

    const videoStream = await fetchVideoFile(fileId);
    if (!videoStream) throw new NotFoundException('Video not found');

    const selectedScale = scaleMap[quality] || null;

    // ✅ Step 3 — Transcode and cache first, then serve
    // For range requests, we need the full file first
    const ffmpegArgs = [
      '-i', 'pipe:0',
      ...(selectedScale ? ['-vf', selectedScale] : []),
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart+frag_keyframe+empty_moov',
      '-f', 'mp4',
      cacheFile,
    ];

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);
    const cacheWriteStream = fs.createWriteStream(cacheFile);

    videoStream.pipe(ffmpeg.stdin);
    ffmpeg.stdout.pipe(cacheWriteStream);

    ffmpeg.stderr.on('data', (data: any) => console.log('FFmpeg:', data.toString()));

    // Wait for transcoding to complete, then serve
    return new Promise((resolve, reject) => {
      ffmpeg.on('close', async (code: number) => {
        if (code !== 0) {
          console.error(`❌ FFmpeg failed with code ${code}`);
          return reject(new Error('Transcoding failed'));
        }
        console.log(`✅ FFmpeg finished with code ${code}`);
        
        // Now serve the cached file with range support
        try {
          await this.serveFileWithRange(req, res, cacheFile);
          resolve(null);
        } catch (error) {
          reject(error);
        }
      });

      ffmpeg.on('error', (error: Error) => {
        console.error('FFmpeg error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error streaming video:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Helper method to serve file with HTTP range support
private serveFileWithRange(req: any, res: any, filePath: string) {
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Set common headers
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Length', fileSize);

  // If no range header, serve entire file
  if (!range) {
    res.setHeader('Content-Length', fileSize);
    res.status(200);
    const fileStream = fs.createReadStream(filePath);
    return fileStream.pipe(res);
  }

  // Parse range header
  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunksize = end - start + 1;

  // Validate range
  if (start >= fileSize || end >= fileSize) {
    res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
    return res.end();
  }

  // Set range response headers
  res.status(206); // Partial Content
  res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
  res.setHeader('Content-Length', chunksize);

  // Create read stream for the requested range
  const fileStream = fs.createReadStream(filePath, { start, end });
  return fileStream.pipe(res);
}
```

## Alternative: Stream while transcoding (for faster initial response)

If you want to start streaming immediately while transcoding (but without range support initially):

```typescript
@Get('video-buy/fieldId/get/:fileId')
async streamVideo(
  @Param('fileId') fileId: string,
  @Res() res: any,
  @Req() req: any,
  @Query('quality') quality: string,
) {
  try {
    const cacheDir = path.join(__dirname, '../../files/video-cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const cacheFile = path.join(cacheDir, `${fileId}_${quality || 'original'}.mp4`);
    const scaleMap: Record<string, string> = {
      '480p': 'scale=854:480',
      '720p': 'scale=1280:720',
      '1080p': 'scale=1920:1080',
    };

    // ✅ Step 1 — Serve from cache if available
    if (fs.existsSync(cacheFile)) {
      console.log(`🎥 Serving cached ${quality} version for ${fileId}`);
      return this.serveFileWithRange(req, res, cacheFile);
    }

    // ✅ Step 2 — No cache, transcode on-the-fly
    // Note: Range requests won't work during initial transcoding
    const range = req.headers.range;
    if (range) {
      // If range is requested but file doesn't exist, return 416
      res.status(416).json({ message: 'Video is still being processed. Please try again in a moment.' });
      return;
    }

    console.log(`⚙️ Transcoding new ${quality} version for ${fileId}...`);
    const metadata = await fetchVideoMetadata(fileId);
    if (!metadata || !metadata.size) throw new NotFoundException('Video metadata not found');

    const videoStream = await fetchVideoFile(fileId);
    if (!videoStream) throw new NotFoundException('Video not found');

    const selectedScale = scaleMap[quality] || null;

    // Set headers for streaming
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.status(200);

    // Transcode and stream simultaneously
    const ffmpegArgs = [
      '-i', 'pipe:0',
      ...(selectedScale ? ['-vf', selectedScale] : []),
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart+frag_keyframe+empty_moov',
      '-f', 'mp4',
      'pipe:1',
    ];

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);
    const cacheWriteStream = fs.createWriteStream(cacheFile);

    videoStream.pipe(ffmpeg.stdin);
    ffmpeg.stdout.pipe(res);
    ffmpeg.stdout.pipe(cacheWriteStream);

    ffmpeg.stderr.on('data', (data: any) => console.log('FFmpeg:', data.toString()));

    ffmpeg.on('close', (code: number) => {
      console.log(`✅ FFmpeg finished with code ${code}`);
    });

    ffmpeg.on('error', (error: Error) => {
      console.error('FFmpeg error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Transcoding error' });
      }
    });
  } catch (error) {
    console.error('Error streaming video:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

// Helper method (same as above)
private serveFileWithRange(req: any, res: any, filePath: string) {
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Length', fileSize);

  if (!range) {
    res.status(200);
    const fileStream = fs.createReadStream(filePath);
    return fileStream.pipe(res);
  }

  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunksize = end - start + 1;

  if (start >= fileSize || end >= fileSize) {
    res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
    return res.end();
  }

  res.status(206);
  res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
  res.setHeader('Content-Length', chunksize);

  const fileStream = fs.createReadStream(filePath, { start, end });
  return fileStream.pipe(res);
}
```

## Key Changes:
1. ✅ **Removed mandatory Range requirement** - Initial requests work without Range header
2. ✅ **Added range parsing** - Properly parses `bytes=start-end` format
3. ✅ **HTTP 206 Partial Content** - Returns proper status code for range requests
4. ✅ **Content-Range header** - Tells client the byte range being served
5. ✅ **File streaming with ranges** - Uses `fs.createReadStream` with start/end options
6. ✅ **Cache-first approach** - Transcodes to cache first, then serves with full range support

## Recommendation:
Use the **first approach** (transcode first, then serve) for better compatibility with video players. The second approach is faster for initial playback but won't support seeking until the file is fully transcoded.

