// components/SearchBarWithSuggestions.tsx
"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { searchSuggestions } from "@/services/search.service";
import { useState, useEffect, useRef, useCallback } from "react";
// import { useDebounce } from "@/hooks/useDebounce"; // আমরা আলাদা হুক বানাবো
// import { searchSuggestions } from "@/services/search.service";

export default function SearchBarWithSuggestions() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce value: 400ms পরে API কল হবে
  const debouncedQuery = useDebounce(query, 400);

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    console.log(
      "fetchSuggestions called with:",
      searchTerm,
      "length:",
      searchTerm?.length,
    );

    if (searchTerm.length < 2) {
      console.log("Search term too short, clearing suggestions");
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Calling searchSuggestions API...");
      const res = await searchSuggestions({ q: searchTerm });
      console.log("API response:", res);

      const suggestionsList = res.suggestions || [];
      console.log("Setting suggestions:", suggestionsList);

      setSuggestions(suggestionsList);
      const shouldOpen = suggestionsList.length > 0;
      console.log("Opening dropdown?", shouldOpen);
      setIsOpen(shouldOpen);
    } catch (err) {
      console.error("Suggestion error:", err);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  // কিবোর্ড নেভিগেশন (Arrow up/down, Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        onSelectSuggestion(suggestions[selectedIndex].title);
      } else if (query.trim()) {
        onSelectSuggestion(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const onSelectSuggestion = (value: string) => {
    setQuery(value);
    setIsOpen(false);
    setSelectedIndex(-1);
    // এখানে ঐ ভ্যালু দিয়ে মূল সার্চ ট্রিগার করবেন
    // e.g., router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() =>
          debouncedQuery.length >= 2 &&
          suggestions.length > 0 &&
          setIsOpen(true)
        }
        placeholder="Search ideas..."
        className="w-full rounded-2xl border border-zinc-200 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      />
      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-zinc-200 bg-white shadow-lg"
        >
          {suggestions.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectSuggestion(item.title)}
              className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                idx === selectedIndex ? "bg-zinc-100" : "hover:bg-zinc-50"
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
