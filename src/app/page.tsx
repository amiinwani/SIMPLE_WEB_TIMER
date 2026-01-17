'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Task } from '@/types';
import TaskInput from '@/components/TaskInput';
import TimerDisplay from '@/components/TimerDisplay';
import NotificationSettings from '@/components/NotificationSettings';
import { useTimer } from '@/hooks/useTimer';
import styles from './page.module.css';

export default function Home() {
  const [task, setTask] = useState<Task | null>(null);

  // Notification Settings State
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notifyFrequency, setNotifyFrequency] = useState(5); // Minutes
  const [notifyTemplate, setNotifyTemplate] = useState('Focus on: {{task}}');

  const {
    timeLeft,
    isActive,
    isFinished,
    start,
    pause,
    reset,
    addTime,
    formatTime
  } = useTimer();

  // persistent audio object
  const alarmAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // simple beep sound data URI
    alarmAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    alarmAudio.current.volume = 0.5;
  }, []);

  // Handle Alarm
  useEffect(() => {
    if (isFinished && alarmAudio.current) {
      alarmAudio.current.play().catch(e => console.log("Audio play failed", e));
      if (notifyEnabled) {
        new Notification("Time's Up!", {
          body: task ? `Finished: ${task.text}` : "Timer Finished",
          requireInteraction: true
        });
      }
    }
  }, [isFinished, notifyEnabled, task]);

  // Handle Periodic Notifications
  useEffect(() => {
    if (isActive && notifyEnabled && timeLeft > 0) {
      const frequencySeconds = notifyFrequency * 60;
      // Trigger if timeLeft is a multiple of frequency (and not the start time)
      // Check if (duration - timeLeft) % frequency == 0?
      // Actually simpler: if timeLeft % frequency == 0.
      if (timeLeft % frequencySeconds === 0 && timeLeft !== 25 * 60) {
        const bodyText = notifyTemplate.replace('{{task}}', task?.text || 'Task');
        new Notification("Stay Focused", { body: bodyText });
      }
    }
  }, [isActive, timeLeft, notifyEnabled, notifyFrequency, notifyTemplate, task]);

  // Dynamic Title Logic - Fixed to avoid re-render loops
  const timerDataRef = useRef({ timeLeft, task });

  useEffect(() => {
    timerDataRef.current = { timeLeft, task };
  }, [timeLeft, task]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const baseTitle = "Simple Web Timer";

    if (isActive) {
      let showTime = true;
      // Update immediately
      const updateTitle = () => {
        const currentLeft = timerDataRef.current.timeLeft;
        const currentTask = timerDataRef.current.task;
        const timeStr = formatTime(currentLeft);
        const taskStr = currentTask?.text || "Focus";
        document.title = showTime ? `⏳ ${timeStr}` : `🎯 ${taskStr}`;
        showTime = !showTime;
      };

      updateTitle(); // Initial call
      interval = setInterval(updateTitle, 2000); // Toggle every 2 seconds
    } else {
      document.title = baseTitle;
    }

    return () => clearInterval(interval);
  }, [isActive, formatTime]);


  return (
    <main className={styles.main}>
      <NotificationSettings
        frequency={notifyFrequency}
        setFrequency={setNotifyFrequency}
        messageTemplate={notifyTemplate}
        setMessageTemplate={setNotifyTemplate}
        enabled={notifyEnabled}
        setEnabled={setNotifyEnabled}
      />

      <div className={styles.content}>
        <TaskInput task={task} setTask={setTask} />

        <TimerDisplay
          timeLeft={timeLeft}
          isActive={isActive}
          isFinished={isFinished}
          onStart={start}
          onPause={pause}
          onReset={() => reset()}
          onAddTime={addTime}
          formatTime={formatTime}
        />
      </div>

      <div className={styles.footer}>
        <p>Simple Web Timer • Zen Mode</p>
      </div>
    </main>
  );
}
