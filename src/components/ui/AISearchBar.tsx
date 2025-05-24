
import React, { useState } from 'react';
import { Search, Bot, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  onAIAnalyze?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const AISearchBar: React.FC<AISearchBarProps> = ({
  onSearch,
  onAIAnalyze,
  className,
  placeholder = 'Search or ask AI...'
}) => {
  const [query, setQuery] = useState('');
  const [isAIMode, setIsAIMode] = useState(true); // Default to AI mode for study plans
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (isAIMode && onAIAnalyze) {
      onAIAnalyze(query);
    } else {
      onSearch(query);
    }
  };

  const toggleMode = () => {
    setIsAIMode(!isAIMode);
    setQuery('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        'relative flex items-center transition-all duration-300',
        isFocused ? 'w-full' : 'w-full',
        className
      )}
    >
      <div className="relative w-full flex">
        {/* Mode Toggle Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleMode}
          className={cn(
            'rounded-r-none border-r border-slate-200 px-4 py-3',
            isAIMode 
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          )}
        >
          {isAIMode ? (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="hidden sm:inline text-sm font-medium">AI Study Planner</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Search</span>
            </div>
          )}
        </Button>

        {/* Input Field */}
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isAIMode ? 'Describe your study goals and subjects...' : placeholder}
            className={cn(
              'rounded-l-none rounded-r-none text-sm bg-white h-12',
              'border-l-0 border-r-0 border border-slate-200 focus:border-blue-400',
              'shadow-sm focus:ring-1 focus:ring-blue-400',
              'transition-all duration-300 ease-in-out px-4',
              'placeholder:text-slate-400 focus:placeholder:text-slate-500',
              isAIMode && 'bg-blue-50/30 border-blue-200'
            )}
          />
          
          {/* Clear Button */}
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Analyze Button */}
        <Button
          type="submit"
          disabled={!query.trim()}
          className={cn(
            'rounded-l-none px-6 py-3 h-12',
            isAIMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-[#8A0303] hover:bg-[#6a0202] text-white'
          )}
        >
          {isAIMode ? (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Analyze</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="font-medium">Search</span>
            </div>
          )}
        </Button>
      </div>

      {/* Mode Indicator */}
      <div className="absolute -bottom-8 left-0 text-xs text-slate-500">
        {isAIMode ? 'AI will create your personalized study plan' : 'Search through our content'}
      </div>
    </form>
  );
};

export default AISearchBar;
