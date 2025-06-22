
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AISearchBarProps {
  onAIAnalyze?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const AISearchBar: React.FC<AISearchBarProps> = ({
  onAIAnalyze,
  className,
  placeholder = 'Describe your study goals and subjects...'
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (onAIAnalyze) {
      onAIAnalyze(query);
      setQuery(''); // Clear input after submission
    }
  };

  return (
    <div className={cn('relative w-full max-w-6xl mx-auto', className)}>
      <div className="relative flex flex-col gap-3 p-4">
        
        {/* AI Mode Header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="font-semibold bg-gradient-to-r from-[#8A0303] to-red-600 bg-clip-text text-transparent text-sm">
            SAT AI Study Planner
          </h3>
          <Sparkles className="h-4 w-4 text-red-500 animate-pulse" />
        </div>

        {/* Input and Submit Row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={cn(
                'border bg-transparent h-12 px-5 rounded-full text-base',
                'focus:ring-0 focus:outline-none focus:ring-offset-0 transition-all duration-300',
                'placeholder:text-gray-400 focus:placeholder:text-gray-500',
                'font-medium resize-none',
                'border-gray-300 focus:border-[#8A0303] focus-visible:ring-0 focus-visible:ring-offset-0'
              )}
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!query.trim()}
            className={cn(
              'rounded-full h-12 w-12 p-0 transition-all duration-300 ease-out',
              'hover:scale-110 transform-gpu disabled:scale-100 disabled:opacity-50',
              'flex items-center justify-center',
              'bg-white hover:bg-gray-50 text-[#8A0303] border border-[#8A0303] hover:border-[#6b0202]'
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AISearchBar;
