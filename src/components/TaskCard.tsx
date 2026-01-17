import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  AlertCircle,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { Task, TaskPriority } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const priorityConfig = {
  low: { color: 'text-blue-500', bg: 'bg-blue-50', icon: Flag },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-50', icon: Flag },
  high: { color: 'text-orange-500', bg: 'bg-orange-50', icon: Flag },
  urgent: { color: 'text-red-500', bg: 'bg-red-50', icon: AlertCircle },
};

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityInfo = priorityConfig[task.priority];
  const PriorityIcon = priorityInfo.icon;
  const isOverdue = task.dueDate && new Date() > task.dueDate && task.status !== 'completed';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative bg-white rounded-xl p-4 shadow-sm border border-gray-100
        hover:shadow-md hover:border-gray-200 transition-all duration-200
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-105 rotate-2' : ''}
        ${isOverdue ? 'ring-2 ring-red-200' : ''}
      `}
    >
      {/* Priority Indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${
        task.priority === 'urgent' ? 'bg-red-500' :
        task.priority === 'high' ? 'bg-orange-500' :
        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
      }`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <PriorityIcon className={`w-4 h-4 ${priorityInfo.color}`} />
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityInfo.bg} ${priorityInfo.color}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>

        {showMenu && (
          <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border z-10 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
                setShowMenu(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 w-full text-left"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id);
                setShowMenu(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 w-full text-left"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
                setShowMenu(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 w-full text-left"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{task.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{format(task.dueDate, 'MMM dd')}</span>
            </div>
          )}
          {task.estimatedTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{task.estimatedTime}m</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}