
import React, { useState } from 'react';
import { Search, Bot, X, Sparkles, Brain, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  onAIAnalyze?: (query: string) => void;
  onModeChange?: (isAIMode: boolean) => void;
  className?: string;
  placeholder?: string;
}

const AISearchBar: React.FC<AISearchBarProps> = ({
  onSearch,
  onAIAnalyze,
  onModeChange,
  className,
  placeholder = 'Search or ask AI...'
}) => {
  const [query, setQuery] = useState('');
  const [isAIMode, setIsAIMode] = useState(true);
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
    const newMode = !isAIMode;
    setIsAIMode(newMode);
    setQuery('');
    onModeChange?.(newMode);
  };

  return (
    <div className={cn('relative w-full max-w-4xl mx-auto', className)}>
      {/* Animated Background Glow */}
      <div className={cn(
        'absolute inset-0 rounded-2xl transition-all duration-700 ease-out',
        isAIMode 
          ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl' 
          : 'bg-gradient-to-r from-gray-400/10 via-slate-400/10 to-gray-400/10 blur-lg'
      )} />
      
      <div className={cn(
        'relative flex flex-col gap-3 p-4 transition-all duration-500 ease-out',
        'bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border',
        isFocused 
          ? 'shadow-2xl border-blue-300/50 scale-[1.02]' 
          : 'shadow-md border-gray-200/50',
        isAIMode && 'border-blue-200/70'
      )}>
        
        {/* Mode Toggle Row */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className={cn(
              'rounded-xl h-10 px-4 transition-all duration-300 ease-out border-0',
              'hover:scale-105 transform-gpu',
              isAIMode 
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg' 
                : 'bg-gradient-to-r from-gray-500 to-slate-600 text-white hover:shadow-md'
            )}
          >
            <div className="flex items-center gap-2">
              {isAIMode ? (
                <>
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Study Planner</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">Search</span>
                </>
              )}
            </div>
          </Button>

          {/* Mode Indicator */}
          <div className={cn(
            'text-xs font-medium transition-all duration-500',
            isAIMode ? 'text-blue-600' : 'text-slate-600'
          )}>
            {isAIMode ? (
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>Create personalized study plans</span>
              </div>
            ) : (
              'Search content library'
            )}
          </div>
        </div>

        {/* Input and Submit Row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isAIMode ? 'Describe your study goals and subjects...' : placeholder}
              className={cn(
                'border-2 bg-white h-12 px-4 rounded-xl',
                'focus:ring-0 focus:outline-none transition-all duration-300',
                'placeholder:text-slate-400 focus:placeholder:text-slate-500',
                'text-base font-medium resize-none',
                isAIMode 
                  ? 'border-blue-200 focus:border-blue-400' 
                  : 'border-gray-200 focus:border-gray-400'
              )}
            />
            
            {/* Clear Button */}
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Send/Analyze Button */}
          <Button
            type="submit"
            disabled={!query.trim()}
            className={cn(
              'rounded-xl h-12 w-12 p-0 transition-all duration-300 ease-out',
              'hover:scale-110 transform-gpu disabled:scale-100 disabled:opacity-50',
              'flex items-center justify-center',
              isAIMode 
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-lg text-white' 
                : 'bg-gradient-to-r from-[#8A0303] to-[#6a0202] hover:shadow-md text-white'
            )}
          >
            {isAIMode ? (
              <Send className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AISearchBar;
