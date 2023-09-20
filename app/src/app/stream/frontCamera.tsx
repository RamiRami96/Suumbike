"use client";
import { useState, useEffect, useRef, memo } from "react";

const FrontCamera = memo(function FrontCamera() {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(stream);
      } catch (error) {
        console.error("Error accessing user media:", error);
      }
    }
    setupCamera();
  }, []);

  useEffect(() => {
    if (!stream || !videoRef.current) return;

    videoRef.current.srcObject = stream;

    return () => {
      stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
    <div className={stream ? " " : "animate-pulse"}>
      <video
        className="h-20 border border-pink-400 rounded-2xl w-[106px] bg-pink-400"
        ref={videoRef}
        autoPlay
      />
    </div>
  );
});

export default FrontCamera;
