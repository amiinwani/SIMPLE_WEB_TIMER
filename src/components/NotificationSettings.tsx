import React, { useState, useEffect } from 'react';
import styles from './NotificationSettings.module.css';

interface NotificationSettingsProps {
    frequency: number;
    setFrequency: (freq: number) => void;
    messageTemplate: string;
    setMessageTemplate: (msg: string) => void;
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

export default function NotificationSettings({
    frequency,
    setFrequency,
    messageTemplate,
    setMessageTemplate,
    enabled,
    setEnabled
}: NotificationSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                setEnabled(true);
            }
        }
    };

    const toggleSettings = () => setIsOpen(!isOpen);

    if (!isOpen) {
        return (
            <button onClick={toggleSettings} className={styles.settingsBtn} aria-label="Notification Settings">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Notification Settings</h3>
                    <button onClick={toggleSettings} className={styles.closeBtn}>×</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <label className={styles.label}>Enable Notifications</label>
                        {permission === 'granted' ? (
                            <div className={styles.toggle}>
                                <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={(e) => setEnabled(e.target.checked)}
                                    id="notify-toggle"
                                />
                                <label htmlFor="notify-toggle">On</label>
                            </div>
                        ) : (
                            <button onClick={requestPermission} className={styles.requestBtn}>
                                Request Permission
                            </button>
                        )}
                    </div>

                    {enabled && permission === 'granted' && (
                        <>
                            <div className={styles.section}>
                                <label className={styles.label}>Frequency (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={frequency}
                                    onChange={(e) => setFrequency(Number(e.target.value))}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.section}>
                                <label className={styles.label}>Message Template</label>
                                <input
                                    type="text"
                                    value={messageTemplate}
                                    onChange={(e) => setMessageTemplate(e.target.value)}
                                    placeholder="Focus on: {{task}}"
                                    className={styles.input}
                                />
                                <p className={styles.hint}>Use {'{{task}}'} to insert current task name.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
