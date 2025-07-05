import { useState, useEffect } from "react";

export function useRoomTimer(participant: any) {
  const [seconds, setSeconds] = useState(0);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (participant && isBtnDisabled) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        if (seconds === 10) {
          setIsBtnDisabled(false);
        }
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [participant, isBtnDisabled, seconds]);

  return {
    isBtnDisabled,
  };
}
