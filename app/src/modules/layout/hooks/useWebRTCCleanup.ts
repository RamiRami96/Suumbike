import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useWebRTCCleanup() {
  const pathname = usePathname();

  const cleanupWebRTCStreams = () => {  
    try {
      // Get all video elements
      const videoElements = document.querySelectorAll('video');
      
      videoElements.forEach((video) => {
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          
          // Stop all tracks in the stream
          stream.getTracks().forEach((track) => {
            console.log('🛑 Stopping track:', track.kind, track.id);
            track.stop();
          });
          
          // Clear the video source
          video.srcObject = null;
        }
      });

      // Also try to clean up any RTCPeerConnections
      if (typeof window !== 'undefined') {
        // Force garbage collection if available
        if ('gc' in window) {
          try {
            (window as any).gc();
          } catch (e) {
            // GC not available or failed
          }
        }
      }

      console.log('✅ WebRTC streams cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning up WebRTC streams:', error);
    }
  };

  // Monitor URL changes
  useEffect(() => {
    const isRoomPage = pathname.startsWith('/room');

    if (!isRoomPage) {
      cleanupWebRTCStreams();
    }

  }, [pathname]);

} 