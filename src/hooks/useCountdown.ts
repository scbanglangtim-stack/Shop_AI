// src/hooks/useCountdown.ts
// Custom Hook tách biệt hoàn toàn Logic đếm ngược thời gian (Chương 3.4 & Sprint 3)
import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    // Dọn dẹp RAM tránh Memory Leak khi component unmount
    return () => clearInterval(interval);
  }, [seconds]);

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  // Format sang chuỗi MM:SS hiển thị đẹp mắt
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    seconds,
    formattedTime: formatTime(),
    isFinished: seconds === 0,
    reset,
  };
};
