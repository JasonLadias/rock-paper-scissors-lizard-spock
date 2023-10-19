import { useState, useEffect } from 'react';

export const useCountdown = (endTimeInSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(
    endTimeInSeconds - Math.floor(Date.now() / 1000)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const remainingTime = endTimeInSeconds - currentTimeInSeconds;

      if (remainingTime <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
      } else {
        setTimeLeft(remainingTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTimeInSeconds]);

  return timeLeft;
};



