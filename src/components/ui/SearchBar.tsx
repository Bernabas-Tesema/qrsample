import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search menu items...',
  className,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        'relative flex items-center rounded-xl border bg-white transition-all duration-200',
        focused ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        className
      )}
    >
      <Search className="ml-4 h-5 w-5 text-text-secondary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent px-3 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="mr-3 rounded-full p-1 text-text-secondary hover:bg-gray-100 hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
