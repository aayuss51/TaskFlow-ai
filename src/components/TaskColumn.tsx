import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '../types/task';
import { Plus, Circle } from 'lucide-react';

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

const columnConfig = {
  todo: { color: 'border-gray-300', bgColor: 'bg-gray-50', icon: Circle },
  'in-progress': { color: 'border-blue-300', bgColor: 'bg-blue-50', icon: Circle },
  review: { color: 'border-yellow-300', bgColor: 'bg-yellow-50', icon: Circle },
  completed: { color: 'border-green-300', bgColor: 'bg-green-50', icon: Circle },
};

export function TaskColumn({ 
  id, 
  title, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onCompleteTask 
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfig[id];

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col bg-white rounded-xl p-4 border-2 transition-all duration-200
        ${isOver ? `${config.color} ${config.bgColor}` : 'border-gray-200'}
        min-h-[600px]
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(id)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add task"
        >
          <Plus className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-3">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onComplete={onCompleteTask}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Circle className="w-12 h-12 mb-3" />
            <p className="text-sm">No tasks yet</p>
            <button
              onClick={() => onAddTask(id)}
              className="text-blue-500 hover:text-blue-600 text-sm mt-2"
            >
              Add your first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}