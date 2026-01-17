export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  estimatedTime?: number; // in minutes
  completedAt?: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

export interface AITaskSuggestion {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedTime?: number;
  tags: string[];
}