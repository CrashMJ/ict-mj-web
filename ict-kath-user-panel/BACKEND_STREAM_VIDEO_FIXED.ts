// Fixed Backend Video Streaming Endpoint
// Replace your existing streamVideo method with this code

import { Get, Param, Res, Req, Query, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

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

    // ✅ Step 1 — Serve from cache if available (with full range support)
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

    // ✅ Step 3 — Transcode to cache file first, then serve with range support
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

    // Wait for transcoding to complete, then serve with range support
    return new Promise((resolve, reject) => {
      ffmpeg.on('close', async (code: number) => {
        if (code !== 0) {
          console.error(`❌ FFmpeg failed with code ${code}`);
          if (!res.headersSent) {
            res.status(500).json({ message: 'Transcoding failed' });
          }
          return reject(new Error('Transcoding failed'));
        }
        console.log(`✅ FFmpeg finished with code ${code}`);
        
        // Now serve the cached file with full range support
        try {
          await this.serveFileWithRange(req, res, cacheFile);
          resolve(null);
        } catch (error) {
          if (!res.headersSent) {
            res.status(500).json({ message: 'Error serving video' });
          }
          reject(error);
        }
      });

      ffmpeg.on('error', (error: Error) => {
        console.error('FFmpeg error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'FFmpeg error' });
        }
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error streaming video:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

// ✅ Helper method to serve file with HTTP range support
private serveFileWithRange(req: any, res: any, filePath: string) {
  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Set common headers
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', fileSize);

    // If no range header, serve entire file (200 OK)
    if (!range) {
      res.status(200);
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (error) => {
        console.error('File stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error reading file' });
        }
      });
      return fileStream.pipe(res);
    }

    // Parse range header (format: "bytes=start-end")
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    // Validate range
    if (start >= fileSize || end >= fileSize || start < 0 || end < start) {
      res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
      return res.end();
    }

    // Set range response headers (206 Partial Content)
    res.status(206); // Partial Content
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', chunksize);

    // Create read stream for the requested range
    const fileStream = fs.createReadStream(filePath, { start, end });
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error reading file' });
      }
    });
    return fileStream.pipe(res);
  } catch (error) {
    console.error('Error in serveFileWithRange:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error serving file' });
    }
  }
}

