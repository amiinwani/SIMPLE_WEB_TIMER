import React, { useEffect } from 'react';
import styles from './TimerDisplay.module.css';

interface TimerDisplayProps {
    timeLeft: number;
    isActive: boolean;
    isFinished: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: (newDuration?: number) => void;
    onAddTime: (seconds: number) => void;
    formatTime: (seconds: number) => string;
}

export default function TimerDisplay({
    timeLeft,
    isActive,
    isFinished,
    onStart,
    onPause,
    onReset,
    onAddTime,
    formatTime
}: TimerDisplayProps) {

    const [isEditing, setIsEditing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const timeString = formatTime(timeLeft);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleTimeClick = () => {
        if (!isActive && !isFinished) {
            setIsEditing(true);
            setInputValue(formatTime(timeLeft)); // Pre-fill with current time
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        setIsEditing(false);

        const trimmed = inputValue.trim();
        // Parse "MM" or "MM:SS"
        let seconds = 0;

        if (trimmed.includes(':')) {
            const parts = trimmed.split(':');
            const m = parseInt(parts[0], 10) || 0;
            const s = parseInt(parts[1], 10) || 0;
            seconds = m * 60 + s;
        } else {
            const val = parseInt(trimmed, 10);
            if (!isNaN(val)) {
                // Treat as minutes if just a number
                seconds = val * 60;
            } else {
                // Invalid, just return
                return;
            }
        }

        if (seconds > 0) {
            onReset(seconds); // Use onReset which maps to reset(seconds)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleInputConfirm();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.timerWrapper}>
                {!isActive && !isFinished && !isEditing && (
                    <button onClick={() => onAddTime(-60)} className={styles.adjustBtn} aria-label="Decrease time">-</button>
                )}

                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputConfirm}
                        onKeyDown={handleKeyDown}
                        className={styles.timerInput}
                        aria-label="Set timer duration"
                    />
                ) : (
                    <div
                        className={`${styles.timer} ${isFinished ? styles.finished : ''} ${!isActive && !isFinished ? styles.editable : ''}`}
                        onClick={handleTimeClick}
                        title={!isActive && !isFinished ? "Click to edit time" : ""}
                    >
                        {timeString}
                    </div>
                )}

                {!isActive && !isFinished && !isEditing && (
                    <button onClick={() => onAddTime(60)} className={styles.adjustBtn} aria-label="Increase time">+</button>
                )}
            </div>

            <div className={styles.controls}>
                {!isActive && !isFinished && (
                    <button onClick={onStart} className={styles.button}>Start</button>
                )}
                {isActive && (
                    <button onClick={onPause} className={styles.button}>Pause</button>
                )}
                {(isActive || isFinished || timeLeft !== 25 * 60) && (
                    <button onClick={() => onReset()} className={`${styles.button} ${styles.reset}`}>Reset</button>
                )}
            </div>
        </div>
    );
}
