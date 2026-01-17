import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialDurationSeconds: number = 25 * 60) => {
    const [timeLeft, setTimeLeft] = useState(initialDurationSeconds);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
        if (timeLeft > 0) {
            setIsActive(true);
            setIsFinished(false);
        }
    }, [timeLeft]);

    const pause = useCallback(() => {
        setIsActive(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    const reset = useCallback((newDuration?: number) => {
        pause();
        setIsFinished(false);
        setTimeLeft(newDuration || initialDurationSeconds);
    }, [initialDurationSeconds, pause]);

    const setDuration = useCallback((seconds: number) => {
        reset(seconds);
    }, [reset]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setIsActive(false);
                        setIsFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsFinished(true);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    // Format time for display (MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return {
        timeLeft,
        isActive,
        isFinished,
        start,
        pause,
        reset,
        setDuration,
        formatTime
    };
};
