import { useEffect, useRef } from "react";

const useSocket = (): void => {
  const socketCreated = useRef<boolean>(false);

  useEffect(() => {
    const initializeSocket = async (): Promise<void> => {
      if (socketCreated.current) return;

      try {
        const socketServerUrl = process.env.NEXT_PUBLIC__SOCKET_SERVER;
        if (!socketServerUrl) {
          throw new Error("Socket server URL not configured");
        }

        await fetch(socketServerUrl);
        socketCreated.current = true;
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    initializeSocket();
  }, []);
};

export default useSocket;
