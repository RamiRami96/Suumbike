import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAutoRefresh = (intervalMs: number = 15000) => {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);
};
