/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import "videojs-http-source-selector"; // Import the plugin
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector"; // Import HLS quality selector plugin
import { API_BASE_URL } from "../../../../config";

type Props = {
    videoId: any; // URL or video ID of the YouTube video
    phone: any;
};

//------------Google Drive Uploaded Video Player----------------------//
const VideoPlayerGDrive: React.FC<Props> = ({ videoId,phone }) => {
    console.log('videoId',videoId, phone) 

const videoRef = useRef<HTMLVideoElement | null>(null);
const [position1, setPosition1] = useState({ top: "10%", left: "10%" });
const [position2, setPosition2] = useState({ top: "70%", left: "70%" });
const playerRef = useRef<any>(null);
const [speed, setSpeed] = useState(1); // Default speed (1x)


// const videoSources: Record<"1080p" | "720p" | "480p", string> = {
//   "1080p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=1080p`,
//   "720p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=720p`,
//   "480p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=480p`,
// };

const videoSources = {
  "1080p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=1080p`,
  "720p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=720p`,
  "480p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=480p`,
  "360p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=360p`,
  "240p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=240p`,
  "144p": `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}?quality=144p`,
};

// const [quality, setQuality] = useState<keyof typeof videoSources>("1080p");



// Use the correct type for indexing
// const videoSrc = videoSources[quality];

useEffect(() => {
  if (videoRef.current) {
    if (playerRef.current) {
      playerRef.current.dispose();
    }
    playerRef.current = videojs(videoRef.current, {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      preload: "auto", // Preload the video for faster scrubbing
      html5: {
          vhs: { 
            overrideNative: true,
            goalBufferLength: 60, // Keep 60 seconds of video in buffer
            maxBufferLength: 120, // Cache up to 120 seconds
           },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
      // Increase the buffer size so it downloads more ahead of time
      controlBar: {
        children: [
          'playToggle',
          'progressControl',
          'volumePanel',
          'qualitySelector',
          'fullscreenToggle',
        ],
      },
      sources: [
        {
          src: `${API_BASE_URL}api/video-buy/fieldId/get/${videoId}`,
          type: "video/mp4",
          // label: quality,
        },
      ],
    });

    // Ensure player is ready before interacting with it
    playerRef.current.ready(() => {
      console.log("Player is ready");
    })
    // Add quality selector safely
  // playerRef.current?.ready(() => {
  //   try {
  //     playerRef.current.hlsQualitySelector({ displayCurrentQuality: true });
  //   } catch (e) {
  //     console.warn("HLS quality selector not loaded", e);
  //   }
  // });


    // playerRef.current.hlsQualitySelector({ displayCurrentQuality: true });
    //   playerRef.current = playerRef;

    // Disable Picture-in-Picture via native attributes
      const videoElement = videoRef.current as HTMLVideoElement;
      if (videoElement) {
        videoElement.disablePictureInPicture = true;
      }
  }
    // Move both watermarks every 3 seconds
    const interval = setInterval(() => {
      setPosition1({
        top: `${Math.random() * 80 + 5}%`,
        left: `${Math.random() * 80 + 5}%`,
      });

      setPosition2({
        top: `${Math.random() * 80 + 5}%`,
        left: `${Math.random() * 80 + 5}%`,
      });
    }, 600000);

    return () => {
      if (playerRef.current) {playerRef.current.dispose();}
      clearInterval(interval);
    };
  }, [videoId]);

  // Handle quality change
  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuality = event.target.value as keyof typeof videoSources;
    // setQuality(newQuality);
    // if (playerRef.current) {
    //   const currentTime = playerRef.current.currentTime() || 0;
    // playerRef.current.src({
    //   src: videoSources[newQuality],
    //   type: "video/mp4",
    // });
    // playerRef.current.load();

    // playerRef.current.ready(() => {
    //   playerRef.current.currentTime(currentTime);
    //   playerRef.current.play();
    // });
  // }
  };

  const skipTime = (seconds: number) => {
    if (playerRef.current && playerRef.current.readyState() > 0) {
      const currentTime = playerRef.current.currentTime();
      const newTime = Math.max(0, Math.min(currentTime + seconds, playerRef.current.duration())); 
      playerRef.current.currentTime(newTime);
    } else {
      console.warn("Player is not ready or the video duration is unknown.");
    }
  };

  // 🚀 Change playback speed
  const handleSpeedChange = (e: any) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        skipTime(-10);
      } else if (event.key === "ArrowRight") {
        skipTime(10);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  return (
    <div data-vjs-player style={{ position: "relative", maxWidth: "700px", margin: "5px auto" }}>
      <video
        id="video-player"
        ref={videoRef}
        className="video-js vjs-default-skin"
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        preload="auto"

      />

      {/* Skip Buttons */}
      {/* <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button 
          onClick={() => skipTime(-10)} 
          style={{ marginRight: "10px", padding: "5px 10px", cursor: "pointer" }}
        >
          ⏪ Skip Back 10s
        </button>
        <button 
          onClick={() => skipTime(10)} 
          style={{ padding: "5px 10px", cursor: "pointer" }}
        >
          ⏩ Skip Forward 10s
        </button>
      </div> */}

      <div className="mt-5">
        <div className="row d-flex align-items-center">
          <div className="col-4">
            <label htmlFor="speedSelector" className="form-label">⏩ Select Playback Speed</label>
          </div>
          <div className="col-8">
            <select 
              id="speedSelector" 
              className="form-select" 
              onChange={handleSpeedChange} 
              value={speed}
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x (Normal)</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
          
        </div>
      </div>

      {/* Quality Selector */}
      {/* <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
        <label htmlFor="quality-selector" style={{ color: "white", fontSize: "14px" }}>
          Quality:
        </label>
        <select
          id="quality-selector"
          value={quality}
          onChange={handleQualityChange}
          style={{ padding: "5px", fontSize: "14px", backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
        >
          <option value="1080p">1080p</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
          <option value="360p">360p</option>
          <option value="240p">240p</option>
          <option value="144p">144p</option>
        </select>
      </div> */}
      
      {/* Watermark 1 - Jude Katurusinghe */}
      <div
        style={{
          position: "absolute",
          top: position1.top,
          left: position1.left,
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          opacity: 0.3,
          padding: "5px 10px",
          fontSize: "12px",
          borderRadius: "5px",
          pointerEvents: "none",
          userSelect: "none",
          transition: "top 0.5s ease, left 0.5s ease",
        }}
      >
        Jude Katurusinghe
      </div>

      {/* Watermark 2 - Phone */}
      <div
        style={{
          position: "absolute",
          top: position2.top,
          left: position2.left,
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          opacity: 0.3,
          padding: "5px 10px",
          fontSize: "12px",
          borderRadius: "5px",
          pointerEvents: "none",
          userSelect: "none",
          transition: "top 0.5s ease, left 0.5s ease",
        }}
      >
        {phone}
      </div>
    </div>
  )
};

export { VideoPlayerGDrive };
