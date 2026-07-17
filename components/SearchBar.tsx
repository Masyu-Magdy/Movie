"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import Image from "next/image";
import { posterUrl } from "@/lib/tmdb";
import { Movie } from "@/types";

interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function SearchBar({ onFocus, onBlur }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}&page=1`,
      );
      const data = await response.json();
      setSuggestions(data.results?.slice(0, 6) || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim()) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFocused(false);
        setSuggestions([]);
        inputRef.current?.blur();
      }

      if (e.key === "ArrowDown" && suggestions.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      }

      if (e.key === "ArrowUp" && suggestions.length > 0) {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length,
        );
      }

      if (
        e.key === "Enter" &&
        selectedIndex >= 0 &&
        suggestions[selectedIndex]
      ) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        router.push(`/movie/${selected.id}`);
        setSuggestions([]);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [suggestions, selectedIndex, router]);

  function submitSearch() {
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.blur();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitSearch();
  }

  function handleSuggestionClick(movie: Movie) {
    router.push(`/movie/${movie.id}`);
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.blur();
  }

  function clearSearch() {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl w-full">
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (onFocus) onFocus();
              if (query.trim()) {
                fetchSuggestions(query);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                if (!searchRef.current?.contains(document.activeElement)) {
                  setIsFocused(false);
                  if (onBlur) onBlur();
                }
              }, 150);
            }}
            placeholder="Search for a title..."
            aria-label="Search for a movie"
            className="w-full rounded-full bg-white dark:bg-[#131A2A] border border-gray-300 dark:border-[#232B3D] pl-11 pr-12 py-2.5 text-sm text-gray-900 dark:text-[#F2F0EA] placeholder:text-gray-400 dark:placeholder:text-[#8B92A5] focus:outline-none focus:border-[#E3A857] transition-colors"
          />

          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8B92A5] w-5 h-5" />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8B92A5] hover:text-gray-700 dark:hover:text-[#F2F0EA] transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#232B3D]"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

      </motion.form>

      <AnimatePresence>
        {isFocused && (query.trim() || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white dark:bg-[#131A2A] border border-gray-200 dark:border-[#232B3D] shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="inline-block w-6 h-6 border-2 border-[#E3A857] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 dark:text-[#8B92A5] text-sm mt-2">Searching...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="py-2">
                {suggestions.map((movie, index) => (
                  <motion.li
                    key={movie.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(movie)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                      selectedIndex === index
                        ? "bg-[#E3A857]/10 border-l-2 border-[#E3A857]"
                        : "hover:bg-gray-50 dark:hover:bg-[#1A2235]"
                    }`}
                  >
                    <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-[#232B3D]">
                      {movie.poster_path ? (
                        <Image
                          src={posterUrl(movie.poster_path, "w92")!}
                          alt={movie.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-[#8B92A5] text-[8px]">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-[#F2F0EA] truncate">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#8B92A5]">
                        <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
                        {movie.vote_average > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-[#E3A857]">
                              ★ {movie.vote_average.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}

                {suggestions.length > 0 && (
                  <li
                    onClick={submitSearch}
                    className="px-4 py-3 text-center text-sm text-[#E3A857] hover:bg-[#E3A857]/10 cursor-pointer transition-colors border-t border-gray-200 dark:border-[#232B3D]"
                  >
                    View all results for "{query}"
                  </li>
                )}
              </ul>
            ) : query.trim() && !isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-[#8B92A5] text-sm">
                No results found for "{query}"
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
