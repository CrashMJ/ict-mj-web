// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useEffect, useRef, useState } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";
// import "videojs-contrib-quality-levels";
// import "videojs-hls-quality-selector";
// import { API_BASE_URL } from "../../../../config";

// type Props = {
//   videoId: string;
//   phone: string;
//   userName?: string;
// };

// const VideoPlayerBunny: React.FC<Props> = ({ videoId, phone, userName }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const playerRef = useRef<any>(null);

//   const [speed, setSpeed] = useState(1);
//   const [pos1, setPos1] = useState({ top: "10%", left: "10%" });
//   const [pos2, setPos2] = useState({ top: "70%", left: "70%" });

//   // 🎯 Init player
//   useEffect(() => {
//     if (!videoRef.current) return;

//     if (playerRef.current) {
//       playerRef.current.dispose();
//     }

//     fetch(`${API_BASE_URL}api/video-buy/video/fieldId/get/${videoId}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log('DATA', data)
//         playerRef.current = videojs(videoRef.current!, {
//           autoplay: true,
//           controls: true,
//           responsive: true,
//           fluid: true,
//           preload: "auto",
//           playbackRates: [0.5, 1, 1.5, 2],
//           html5: {
//             vhs: {
//               overrideNative: true,
//               enableLowInitialPlaylist: true,
//             },
//           },
//           controlBar: {
//             children: [
//               "playToggle",
//               "progressControl",
//               "volumePanel",
//               "qualitySelector",
//               "fullscreenToggle",
//             ],
//           },
//           sources: [
//             {
//               src: data.hls, // 🔥 Bunny signed HLS URL
//               type: "application/x-mpegURL",
//             },
//           ],
//         });

//         // Quality selector
//         playerRef.current.ready(() => {
//           try {
//             playerRef.current.hlsQualitySelector({
//               displayCurrentQuality: true,
//             });
//           } catch (e) {
//             console.warn("Quality selector error", e);
//           }
//         });

//         // Disable PiP
//         videoRef.current!.disablePictureInPicture = true;
//       });

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.dispose();
//       }
//     };
//   }, [videoId]);

//   // 🔁 Move watermark every 5 minutes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setPos1({
//         top: `${Math.random() * 80 + 5}%`,
//         left: `${Math.random() * 80 + 5}%`,
//       });
//       setPos2({
//         top: `${Math.random() * 80 + 5}%`,
//         left: `${Math.random() * 80 + 5}%`,
//       });
//     }, 300000);

//     return () => clearInterval(interval);
//   }, []);

//   // ⏩ Speed change
//   const handleSpeedChange = (e: any) => {
//     const value = parseFloat(e.target.value);
//     setSpeed(value);
//     playerRef.current?.playbackRate(value);
//   };

//   return (
//     <div
//       data-vjs-player
//       style={{
//         position: "relative",
//         maxWidth: "900px",
//         margin: "0 auto",
//       }}
//     >
//       <video
//         ref={videoRef}
//         className="video-js vjs-default-skin"
//         playsInline
//         controlsList="nodownload noremoteplayback"
//         disablePictureInPicture
//       />

//       {/* 🛡️ Watermark - Username */}
//       <div
//         style={{
//           position: "absolute",
//           top: pos1.top,
//           left: pos1.left,
//           opacity: 0.25,
//           background: "rgba(0,0,0,0.5)",
//           color: "#fff",
//           padding: "5px 10px",
//           fontSize: "12px",
//           borderRadius: "5px",
//           pointerEvents: "none",
//           userSelect: "none",
//           transition: "top 0.5s, left 0.5s",
//         }}
//       >
//         {userName || "ICT KATHURUSINGHE"}
//       </div>

//       {/* 🛡️ Watermark - Phone */}
//       <div
//         style={{
//           position: "absolute",
//           top: pos2.top,
//           left: pos2.left,
//           opacity: 0.25,
//           background: "rgba(0,0,0,0.5)",
//           color: "#fff",
//           padding: "5px 10px",
//           fontSize: "12px",
//           borderRadius: "5px",
//           pointerEvents: "none",
//           userSelect: "none",
//           transition: "top 0.5s, left 0.5s",
//         }}
//       >
//         {phone}
//       </div>

//       {/* ⏩ Speed Control */}
//       <div className="mt-3">
//         <label className="form-label">Playback Speed</label>
//         <select
//           className="form-select"
//           value={speed}
//           onChange={handleSpeedChange}
//         >
//           <option value="0.5">0.5x</option>
//           <option value="1">1x (Normal)</option>
//           <option value="1.5">1.5x</option>
//           <option value="2">2x</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayerBunny;
import React, { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../../../../config";

type Props = {
  videoId: string;
  phone: string;
  userName?: string;
};

const VideoPlayerBunny: React.FC<Props> = ({ videoId, phone, userName }) => {
  const [embedUrl, setEmbedUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false); // Track state
  const [pos1, setPos1] = useState({ top: "15%", left: "10%" });
  const [pos2, setPos2] = useState({ top: "75%", left: "60%" });

  useEffect(() => {
    fetch(`${API_BASE_URL}api/video-buy/video/fieldId/get/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.embedUrl) setEmbedUrl(data.embedUrl);
      })
      .catch((err) => console.error("Error fetching video URL:", err));
  }, [videoId]);

  // Sync state with browser full-screen changes (Esc key, etc.)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos1({
        top: `${Math.random() * 70 + 10}%`,
        left: `${Math.random() * 70 + 10}%`,
      });
      setPos2({
        top: `${Math.random() * 70 + 10}%`,
        left: `${Math.random() * 70 + 10}%`,
      });
    }, 45000); 
    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Full-screen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!embedUrl) return <div className="text-muted text-center p-5">Loading Bunny Video...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
      {/* Container for Video + Watermarks */}
      <div 
        ref={containerRef}
        style={{ 
          position: "relative", 
          width: "100%", 
          backgroundColor: "#000",
          borderRadius: isFullScreen ? "0" : "8px", // Remove radius in FS
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            src={embedUrl}
            style={{
              position: "absolute",
              top: 0, left: 0, width: "100%", height: "100%",
              border: "none",
            }}
            allow="autoplay; fullscreen; encrypted-media;"
            title="Bunny Video Player"
          />

          {/* Watermarks */}
          <div style={{
            position: "absolute",
            top: pos1.top,
            left: pos1.left,
            opacity: 0.4,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "5px 12px",
            fontSize: isFullScreen ? "22px" : "clamp(12px, 2vw, 18px)", // Bigger in FS
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 2147483647,
            transition: "all 1.2s ease-in-out",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            {userName || "ICT KATHURUSINGHE"}
          </div>

          <div style={{
            position: "absolute",
            top: pos2.top,
            left: pos2.left,
            opacity: 0.4,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "5px 12px",
            fontSize: isFullScreen ? "22px" : "clamp(12px, 2vw, 18px)",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 2147483647,
            transition: "all 1.2s ease-in-out",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            {phone}
          </div>

          {/* Optional: Small Floating Exit Button inside full screen (Top Right) */}
          {isFullScreen && (
            <button 
              onClick={toggleFullScreen}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 2147483647,
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                padding: "10px 15px",
                borderRadius: "50px",
                cursor: "pointer",
                backdropFilter: "blur(5px)"
              }}
            >
              <i className="bi bi-x-lg me-2"></i> Exit Full Screen
            </button>
          )}
        </div>
      </div>

      {/* Styled Control Bar (Visible only when NOT in full screen) */}
      {!isFullScreen && (
        <div 
          className="d-flex justify-content-end align-items-center mt-2 p-2"
          style={{ 
            backgroundColor: "#f8f9fa", 
            borderRadius: "6px",
            border: "1px solid #e9ecef" 
          }}
        >
          <span className="me-auto text-muted small ps-2">
            <i className="bi bi-shield-check text-success me-1"></i> Secure Stream
          </span>
          <button 
            className="btn btn-dark btn-sm d-flex align-items-center shadow-sm"
            onClick={toggleFullScreen}
          >
            <i className="bi bi-fullscreen me-2"></i>
            Full Screen
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerBunny;


