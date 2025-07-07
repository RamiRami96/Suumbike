import { useState, useEffect, useCallback, useRef } from "react";

export function useRoomTimer(participant: any) {
  const [seconds, setSeconds] = useState(0);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    
    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1;
        if (newSeconds >= 10) {
          setIsBtnDisabled(false);
          clearTimer();
        }
        return newSeconds;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => {
    if (participant && isBtnDisabled && seconds < 10) {
      startTimer();
    } else if (!participant || !isBtnDisabled) {
      clearTimer();
    }

    return clearTimer;
  }, [participant, isBtnDisabled, seconds, startTimer, clearTimer]);

  useEffect(() => {
    setSeconds(0);
    setIsBtnDisabled(true);
  }, [participant]);

  return {
    isBtnDisabled,
    seconds,
  };
}
