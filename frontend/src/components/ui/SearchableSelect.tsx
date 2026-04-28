'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, Loader2, PlusCircle } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  onQuickAdd?: () => void;
  quickAddLabel?: string;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  onSearch,
  placeholder = 'Select option...',
  isLoading = false,
  onQuickAdd,
  quickAddLabel = 'Add New',
  className = ''
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setTimeout(() => inputRef.current?.focus(), 10);
        }}
        className="w-full h-11 px-4 flex items-center justify-between bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl transition-all outline-none"
      >
        <span className={`text-sm font-medium truncate ${!selectedOption ? 'text-zinc-400' : 'text-zinc-900'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-zinc-50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-4 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-lg text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {isLoading ? (
              <div className="p-4 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Searching...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No results found</p>
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full p-3 flex items-center justify-between rounded-xl text-left transition-all group ${value === option.id ? 'bg-zinc-950 text-white' : 'hover:bg-zinc-50 text-zinc-900'
                    }`}
                >
                  <div>
                    <p className="text-sm font-bold truncate">{option.label}</p>
                    {option.subLabel && (
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${value === option.id ? 'text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-500'
                        }`}>
                        {option.subLabel}
                      </p>
                    )}
                  </div>
                  {value === option.id && <Check className="h-4 w-4" />}
                </button>
              ))
            )}
          </div>

          {onQuickAdd && (
            <button
              type="button"
              onClick={() => {
                onQuickAdd();
                setIsOpen(false);
              }}
              className="w-full p-4 flex items-center justify-center gap-2 bg-zinc-50 border-t cursor-pointer border-zinc-100 hover:bg-zinc-100 transition-all text-xs font-black text-zinc-900 uppercase tracking-widest"
            >
              <PlusCircle className="h-4 w-4" /> {quickAddLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
