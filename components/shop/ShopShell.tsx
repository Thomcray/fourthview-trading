"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  initialQuery: string;
  children: React.ReactNode;
}

export default function ShopShell({ initialQuery, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query.trim());
        router.push(`${pathname}?${params.toString()}`);
      } else {
        router.push(pathname);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, pathname, router]);

  // Sync URL → input (back/forward buttons)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const clear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <>
      {/* Inject search bar into Banner's topRight slot */}
      {children}

      {/* Or render search bar separately if preferred */}
      <div className="fixed top-4 right-4 z-50 w-64 sm:w-80">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-10 py-5 text-base rounded-xl border-gray-200 focus:border-blue-400 bg-white/95 backdrop-blur-sm shadow-lg"
          />
          {query && (
            <button
              onClick={clear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
