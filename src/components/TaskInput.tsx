import React, { useState } from 'react';
import styles from './TaskInput.module.css';
import { Task, SubTask } from '@/types';

interface TaskInputProps {
    task: Task | null;
    setTask: (task: Task | null) => void;
}

export default function TaskInput({ task, setTask }: TaskInputProps) {
    const [mainTaskInput, setMainTaskInput] = useState('');
    const [subTaskInput, setSubTaskInput] = useState('');

    const handleSetMainTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mainTaskInput.trim()) return;
        setTask({
            id: crypto.randomUUID(),
            text: mainTaskInput,
            completed: false,
            subTasks: []
        });
    };

    const handleAddSubTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || !subTaskInput.trim()) return;
        const newSubTask: SubTask = {
            id: crypto.randomUUID(),
            text: subTaskInput,
            completed: false
        };
        setTask({
            ...task,
            subTasks: [...task.subTasks, newSubTask]
        });
        setSubTaskInput('');
    };

    const toggleSubTask = (subTaskId: string) => {
        if (!task) return;
        const updatedSubTasks = task.subTasks.map(st =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
        );
        setTask({ ...task, subTasks: updatedSubTasks });
    };

    const removeSubTask = (subTaskId: string) => {
        if (!task) return;
        const updatedSubTasks = task.subTasks.filter(st => st.id !== subTaskId);
        setTask({ ...task, subTasks: updatedSubTasks });
    }

    const clearTask = () => {
        setTask(null);
        setMainTaskInput('');
    }

    if (task) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.mainTask}>{task.text}</h2>
                    <button onClick={clearTask} className={styles.clearBtn} aria-label="Clear task">×</button>
                </div>

                <div className={styles.subTasksContainer}>
                    <ul className={styles.subTaskList}>
                        {task.subTasks.map(st => (
                            <li key={st.id} className={styles.subTaskItem}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={st.completed}
                                        onChange={() => toggleSubTask(st.id)}
                                        className={styles.checkbox}
                                    />
                                    <span className={st.completed ? styles.completedText : ''}>{st.text}</span>
                                </label>
                                <button onClick={() => removeSubTask(st.id)} className={styles.removeBtn}>×</button>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={handleAddSubTask} className={styles.subTaskForm}>
                        <input
                            type="text"
                            value={subTaskInput}
                            onChange={(e) => setSubTaskInput(e.target.value)}
                            placeholder="Add a sub-goal..."
                            className={styles.input}
                        />
                        <button type="submit" className={styles.addBtn}>+</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSetMainTask} className={styles.mainTaskForm}>
                <input
                    type="text"
                    value={mainTaskInput}
                    onChange={(e) => setMainTaskInput(e.target.value)}
                    placeholder="What is your main focus?"
                    className={`${styles.input} ${styles.mainInput}`}
                    autoFocus
                />
            </form>
        </div>
    );
}
