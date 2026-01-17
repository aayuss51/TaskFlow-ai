import React from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags: string[];
  onAISuggestions: () => void;
  isLoadingAI: boolean;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  allTags,
  onAISuggestions,
  isLoadingAI,
}: SearchAndFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* AI Suggestions Button */}
        <button
          onClick={onAISuggestions}
          disabled={isLoadingAI}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isLoadingAI ? 'animate-spin' : ''}`} />
          <span>{isLoadingAI ? 'Generating...' : 'AI Suggestions'}</span>
        </button>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm transition-all
                  ${selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="w-3 h-3 inline ml-1" />
                )}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => onTagsChange([])}
              className="text-sm text-blue-600 hover:text-blue-700 mt-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}