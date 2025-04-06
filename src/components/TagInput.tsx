
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  suggestions?: string[];
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags, suggestions = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (inputValue.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter(
        (suggestion) => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
          !tags.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, tags]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };
  
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 rounded-md border px-3 py-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 rounded-full p-1 hover:bg-primary/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        ))}
        
        <div className="relative flex-1 min-w-24">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim() && filteredSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
            placeholder={tags.length > 0 ? "" : "Ajouter des tags..."}
          />
          
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 z-10 mt-1 w-full rounded-md border bg-background shadow-md"
            >
              <ul className="py-1 max-h-60 overflow-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => addTag(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", !inputValue && "opacity-50")}
          disabled={!inputValue}
          onClick={() => addTag(inputValue)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
