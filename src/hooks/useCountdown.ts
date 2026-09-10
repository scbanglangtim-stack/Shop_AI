// src/hooks/useCountdown.ts
// Custom Hook tách biệt hoàn toàn Logic đếm ngược thời gian (Chương 3.4 & Sprint 3)
import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (initialSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    // Dọn dẹp RAM tránh Memory Leak khi component unmount
    return () => clearInterval(timer);
  }, [timeLeft]);

  const reset = useCallback(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  // Format sang chuỗi MM:SS
  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    seconds: timeLeft,
    formattedTime: formatTime(),
    isFinished: timeLeft === 0,
    reset,
  };
};
