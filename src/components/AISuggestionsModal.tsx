import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Clock, Tag } from 'lucide-react';
import { AITaskSuggestion } from '../types/task';
import { AIService } from '../services/aiService';

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuggestion: (suggestion: AITaskSuggestion) => void;
}

export function AISuggestionsModal({ isOpen, onClose, onAddSuggestion }: AISuggestionsModalProps) {
  const [suggestions, setSuggestions] = useState<AITaskSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [isOpen]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const aiSuggestions = await AIService.generateTaskSuggestions('productivity workflow');
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Failed to load AI suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestion = (suggestion: AITaskSuggestion) => {
    onAddSuggestion(suggestion);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">AI Task Suggestions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">AI is generating personalized task suggestions...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No more suggestions available</p>
                <button
                  onClick={loadSuggestions}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate New Suggestions
                </button>
              </div>
            ) : (
              suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                    <button
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      suggestion.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {suggestion.priority.toUpperCase()}
                    </span>
                    
                    {suggestion.estimatedTime && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{suggestion.estimatedTime}m</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{suggestion.tags.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            AI suggestions are based on productivity best practices and your current workflow
          </p>
        </div>
      </div>
    </div>
  );
}