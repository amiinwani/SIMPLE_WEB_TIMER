import React, { useEffect } from 'react';
import styles from './TimerDisplay.module.css';

interface TimerDisplayProps {
    timeLeft: number;
    isActive: boolean;
    isFinished: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    formatTime: (seconds: number) => string;
}

export default function TimerDisplay({
    timeLeft,
    isActive,
    isFinished,
    onStart,
    onPause,
    onReset,
    formatTime
}: TimerDisplayProps) {

    const timeString = formatTime(timeLeft);

    return (
        <div className={styles.container}>
            <div className={`${styles.timer} ${isFinished ? styles.finished : ''}`}>
                {timeString}
            </div>

            <div className={styles.controls}>
                {!isActive && !isFinished && (
                    <button onClick={onStart} className={styles.button}>Start</button>
                )}
                {isActive && (
                    <button onClick={onPause} className={styles.button}>Pause</button>
                )}
                {(isActive || isFinished || timeLeft !== 25 * 60) && ( // Basic check for reset visibility
                    <button onClick={onReset} className={`${styles.button} ${styles.reset}`}>Reset</button>
                )}
            </div>
        </div>
    );
}
