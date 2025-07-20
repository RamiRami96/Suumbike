"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export const useRoomNavigationGuard = () => {
  const router = useRouter();

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave the room?";
    return "Are you sure you want to leave the room?";
  }, []);

  useEffect(() => {
    // Add beforeunload event listener for browser back/refresh/close
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // Note: Next.js App Router doesn't have a built-in way to intercept navigation
  // The confirmation dialog in the header component handles logo clicks
  // and the beforeunload event handles browser navigation
}; 