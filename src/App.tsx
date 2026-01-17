import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskColumn } from './components/TaskColumn';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { SearchAndFilter } from './components/SearchAndFilter';
import { TaskStats } from './components/TaskStats';
import { AISuggestionsModal } from './components/AISuggestionsModal';
import { useTasks } from './hooks/useTasks';
import { Task, TaskStatus, AITaskSuggestion } from './types/task';
import { LayoutDashboard, Brain } from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];

function App() {
  const {
    tasks,
    allTasks,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    allTags,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useTasks();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [aiSuggestionsOpen, setAiSuggestionsOpen] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if we're dropping over a column
    if (COLUMNS.some(col => col.id === overId)) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        moveTask(activeId, newStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle column drops
    if (COLUMNS.some(col => col.id === overId)) {
      const newStatus = overId as TaskStatus;
      moveTask(activeId, newStatus);
    }
    
    // Handle task reordering within columns
    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId);
    
    if (activeTask && overTask && activeTask.status === overTask.status) {
      const columnTasks = tasks.filter(t => t.status === activeTask.status);
      const oldIndex = columnTasks.findIndex(t => t.id === activeId);
      const newIndex = columnTasks.findIndex(t => t.id === overId);
      
      if (oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
        // Update the order in your state management system if needed
      }
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(undefined);
    setDefaultStatus(status);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      createTask(taskData);
    }
  };

  const handleCompleteTask = (id: string) => {
    moveTask(id, 'completed');
  };

  const handleAISuggestions = () => {
    setIsLoadingAI(true);
    setTimeout(() => {
      setIsLoadingAI(false);
      setAiSuggestionsOpen(true);
    }, 500);
  };

  const handleAddAISuggestion = (suggestion: AITaskSuggestion) => {
    createTask({
      title: suggestion.title,
      description: suggestion.description,
      status: 'todo',
      priority: suggestion.priority,
      tags: suggestion.tags,
      estimatedTime: suggestion.estimatedTime,
    });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow AI</h1>
              <p className="text-sm text-gray-600">Intelligent task management with AI assistance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <TaskStats tasks={allTasks} />

        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          allTags={allTags}
          onAISuggestions={handleAISuggestions}
          isLoadingAI={isLoadingAI}
        />

        {/* Task Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLUMNS.map(column => (
              <TaskColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={getTasksByStatus(column.id)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={deleteTask}
                onCompleteTask={handleCompleteTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="rotate-3 scale-105">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onComplete={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultStatus={defaultStatus}
      />

      <AISuggestionsModal
        isOpen={aiSuggestionsOpen}
        onClose={() => setAiSuggestionsOpen(false)}
        onAddSuggestion={handleAddAISuggestion}
      />
    </div>
  );
}

export default App;