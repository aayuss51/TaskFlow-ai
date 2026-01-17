import { AITaskSuggestion, TaskPriority } from '../types/task';

// Mock AI service - in production, this would call OpenAI API
export class AIService {
  static async generateTaskSuggestions(context: string): Promise<AITaskSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: AITaskSuggestion[] = [
      {
        id: 'ai-1',
        title: 'Optimize database queries',
        description: 'Review and optimize slow-running database queries for better performance',
        priority: 'high',
        estimatedTime: 120,
        tags: ['database', 'performance'],
      },
      {
        id: 'ai-2',
        title: 'Add error logging',
        description: 'Implement comprehensive error logging and monitoring',
        priority: 'medium',
        estimatedTime: 90,
        tags: ['monitoring', 'debugging'],
      },
      {
        id: 'ai-3',
        title: 'Update dependencies',
        description: 'Review and update outdated npm packages for security',
        priority: 'medium',
        estimatedTime: 60,
        tags: ['maintenance', 'security'],
      },
      {
        id: 'ai-4',
        title: 'Write unit tests',
        description: 'Increase test coverage for core functionality',
        priority: 'low',
        estimatedTime: 180,
        tags: ['testing', 'quality'],
      },
    ];

    return suggestions;
  }

  static async improveTaskDescription(title: string, description?: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const improvements = [
      `Break down "${title}" into smaller, actionable steps with clear acceptance criteria`,
      `Consider the impact and dependencies when working on "${title}"`,
      `Ensure proper testing and documentation for "${title}"`,
      `Review similar implementations before starting "${title}"`,
    ];

    return improvements[Math.floor(Math.random() * improvements.length)];
  }

  static async suggestNextActions(completedTask: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      'Review and test the implementation',
      'Update related documentation',
      'Notify team members of completion',
      'Plan follow-up tasks if needed',
    ];
  }
}