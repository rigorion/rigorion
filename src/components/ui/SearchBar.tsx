import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  className,
  placeholder = 'Search modules...'
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        'relative flex items-center transition-all duration-300',
        isFocused ? 'w-64 md:w-80' : 'w-48 md:w-64',
        className
      )}
    >
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full py-2 pl-10 pr-4 rounded-full text-sm bg-white',
            'border border-slate-200 focus:border-blue-light',
            'shadow-sm focus:ring-1 focus:ring-blue-light',
            'transition-all duration-300 ease-in-out',
            'placeholder:text-slate-400 focus:placeholder:text-slate-500'
          )}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={16} />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
