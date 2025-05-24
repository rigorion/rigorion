
import React, { useState } from 'react';
import { Search, Bot, X, Sparkles, Brain, Zap } from 'lucide-react';
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
    <div className={cn('relative w-full max-w-2xl mx-auto', className)}>
      {/* Animated Background Glow */}
      <div className={cn(
        'absolute inset-0 rounded-full transition-all duration-700 ease-out',
        isAIMode 
          ? 'bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 blur-xl animate-pulse' 
          : 'bg-gradient-to-r from-gray-400/15 via-slate-400/15 to-gray-400/15 blur-lg'
      )} />
      
      <form 
        onSubmit={handleSubmit}
        className={cn(
          'relative flex items-center transition-all duration-500 ease-out',
          'bg-white/95 backdrop-blur-sm rounded-full shadow-lg border',
          isFocused 
            ? 'shadow-2xl border-blue-300/50 scale-105' 
            : 'shadow-md border-gray-200/50',
          isAIMode && 'border-blue-200/70'
        )}
      >
        {/* Mode Toggle Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleMode}
          className={cn(
            'rounded-full h-14 px-6 transition-all duration-500 ease-out border-0',
            'hover:scale-110 transform-gpu',
            isAIMode 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg' 
              : 'bg-gradient-to-r from-gray-500 to-slate-600 text-white hover:from-gray-600 hover:to-slate-700 shadow-md'
          )}
        >
          {isAIMode ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-5 w-5" />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="hidden sm:inline font-semibold">AI Study Planner</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold">Search</span>
            </div>
          )}
        </Button>

        {/* Input Field */}
        <div className="relative flex-1 px-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isAIMode ? 'Describe your study goals and subjects...' : placeholder}
            className={cn(
              'border-0 bg-transparent text-base h-14 px-4 rounded-full',
              'focus:ring-0 focus:outline-none transition-all duration-300',
              'placeholder:text-slate-400 focus:placeholder:text-slate-500',
              'font-medium'
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

        {/* Analyze Button */}
        <Button
          type="submit"
          disabled={!query.trim()}
          className={cn(
            'rounded-full h-14 px-6 transition-all duration-500 ease-out',
            'hover:scale-110 transform-gpu disabled:scale-100 disabled:opacity-50',
            isAIMode 
              ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg' 
              : 'bg-gradient-to-r from-[#8A0303] to-[#6a0202] hover:from-[#6a0202] hover:to-[#4a0101] text-white shadow-md'
          )}
        >
          {isAIMode ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap className="h-5 w-5" />
                <div className="absolute inset-0 animate-ping">
                  <Zap className="h-5 w-5 opacity-30" />
                </div>
              </div>
              <span className="font-bold">Analyze</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5" />
              <span className="font-bold">Search</span>
            </div>
          )}
        </Button>
      </form>

      {/* Mode Indicator */}
      <div className={cn(
        'absolute -bottom-10 left-0 right-0 text-center transition-all duration-500',
        'text-sm font-medium',
        isAIMode ? 'text-blue-600' : 'text-slate-600'
      )}>
        {isAIMode ? (
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI will create your personalized study plan</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
        ) : (
          'Search through our content library'
        )}
      </div>
    </div>
  );
};

export default AISearchBar;
