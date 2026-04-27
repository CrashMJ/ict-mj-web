/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";

const useDetectScreenRecording = () => {
  const [isScreenRecording, setIsScreenRecording] = useState(false);


  useEffect(() => {
    let frameCount = 0;
    let startTime = performance.now();

    const checkFrameRate = () => {
      frameCount++;
      const elapsed = performance.now() - startTime;

      if (elapsed >= 1000) {
        const fps = (frameCount / elapsed) * 1000;
        console.log('FPS', fps)
        if (fps < 15) { // Assuming <15 FPS might indicate screen recording
          setIsScreenRecording(true);
        } else {
          setIsScreenRecording(false);
        }
        frameCount = 0;
        startTime = performance.now();
      }

      requestAnimationFrame(checkFrameRate);
    };

    checkFrameRate();
  }, []);

  return isScreenRecording;
};

export { useDetectScreenRecording };
