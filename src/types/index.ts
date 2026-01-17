export interface SubTask {
    id: string;
    text: string;
    completed: boolean;
}

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    subTasks: SubTask[];
}
