import { useState, useEffect, useRef } from "react";
import { Video } from "./styles";

export default function FrontCamera() {
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

  return <Video ref={videoRef} autoPlay />;
}
