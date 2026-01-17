import { useState, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { useLocalStorage } from './useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new product landing page',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['design', 'frontend'],
    estimatedTime: 120,
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up JWT authentication with refresh tokens',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['backend', 'security'],
    estimatedTime: 180,
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples',
    status: 'review',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['documentation'],
    estimatedTime: 90,
  },
  {
    id: '4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'completed',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
    tags: ['devops'],
    estimatedTime: 240,
  },
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    updateTask(id, { 
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : undefined
    });
  }, [updateTask]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => task.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)));

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    allTags,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}