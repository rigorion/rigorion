import React, { useState } from 'react';
import { Send, Sparkles, Brain } from 'lucide-react';
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
    }
  };
  return <div className={cn('relative w-full max-w-4xl mx-auto', className)}>
      {/* Animated Background Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-600/20 blur-xl transition-all duration-700 ease-out" />
      
      <div className={cn('relative flex flex-col gap-4 p-6 transition-all duration-500 ease-out', 'bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border', isFocused ? 'shadow-2xl border-red-300/50 scale-[1.02]' : 'shadow-lg border-red-200/30')}>
        
        {/* AI Mode Header */}
        <div className="flex items-center justify-center gap-3 mb-2">
          
          <h3 className="font-semibold bg-gradient-to-r from-[#8A0303] to-red-600 bg-clip-text text-transparent text-sm">SAT AI Study Planner</h3>
          <Sparkles className="h-5 w-5 text-red-500 animate-pulse" />
        </div>

        {/* Input and Submit Row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <div className="relative flex-1">
            <Input type="text" value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={placeholder} className={cn('border-2 bg-white h-14 px-6 rounded-2xl text-lg', 'focus:ring-0 focus:outline-none transition-all duration-300', 'placeholder:text-gray-400 focus:placeholder:text-gray-500', 'font-medium resize-none', 'border-red-200 focus:border-red-400')} />
          </div>

          {/* Send Button */}
          <Button type="submit" disabled={!query.trim()} className={cn('rounded-2xl h-14 w-14 p-0 transition-all duration-300 ease-out', 'hover:scale-110 transform-gpu disabled:scale-100 disabled:opacity-50', 'flex items-center justify-center shadow-lg', 'bg-gradient-to-r from-[#8A0303] to-red-600 hover:shadow-xl text-white')}>
            <Send className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </div>;
};
export default AISearchBar;