"use client";

import { useState, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  initialQuery: string;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function SearchBar({ initialQuery, onSearch, onClear }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }, [query, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onClear();
    inputRef.current?.focus();
  }, [onClear]);

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <button
        onClick={handleSubmit}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors z-10"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-gray-400" />
      </button>

      <Input
        ref={inputRef}
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-12 pr-10 py-5 text-base rounded-xl border-gray-200 focus:border-blue-400 bg-white/95 backdrop-blur-sm shadow-lg w-full"
      />

      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
