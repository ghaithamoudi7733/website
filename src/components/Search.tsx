"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Icon from "./Icons";
import { searchResources, type Subject } from "@/data/vault";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ subject: Subject; item: any; category: string }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchResources(query);
      setResults(searchResults.slice(0, 10));
    } else {
      setResults([]);
    }
    setSelectedIndex(-1);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp" && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        const selected = results[selectedIndex];
        if (selected) {
          window.location.href = `/subject/${selected.subject.slug}`;
        }
      }
    },
    [results, selectedIndex, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case "notes":
        return "book";
      case "past_paper":
        return "file-text";
      case "interactive":
        return "play-circle";
      default:
        return "book";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] animate-fade-in">
      <div
        className="absolute inset-0 bg-deep-olive/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 animate-fade-in-up">
        <div className="glass-strong rounded-2xl shadow-2xl overflow-hidden border border-glass-border">
          {/* Search Input */}
          <div className="flex items-center gap-4 p-4 border-b border-glass-border">
            <Icon name="search" size={24} className="text-deep-olive/40" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, papers, or resources..."
              className="flex-1 bg-transparent text-lg text-deep-olive placeholder:text-deep-olive/40 outline-none"
            />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-deep-olive/5 transition-colors duration-200"
            >
              <Icon name="x-icon" size={20} className="text-deep-olive/60" />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.map((result, index) => (
                <a
                  key={`${result.subject.id}-${result.item.id}`}
                  href={`/subject/${result.subject.slug}`}
                  className={`flex items-start gap-4 p-4 border-b border-glass-border transition-all duration-200 ${
                    index === selectedIndex
                      ? "bg-deep-olive/5"
                      : "hover:bg-deep-olive/5"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${result.subject.accentColor}20` }}
                  >
                    <Icon
                      name={getIconForType(result.item.type)}
                      size={20}
                      color={result.subject.accentColor}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-deep-olive truncate">
                        {result.item.title}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${result.subject.accentColor}20`,
                          color: result.subject.accentColor,
                        }}
                      >
                        {result.subject.name}
                      </span>
                    </div>
                    <p className="text-xs text-deep-olive/60 truncate">
                      {result.item.description}
                    </p>
                    <span className="text-xs text-deep-olive/40 mt-1 block">
                      {result.category}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Empty State */}
          {query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <Icon name="search" size={48} className="text-deep-olive/20 mx-auto mb-4" />
              <p className="text-deep-olive/60">
                No results found for &quot;{query}&quot;
              </p>
            </div>
          )}

          {/* Initial State - Popular Searches */}
          {query.length < 2 && (
            <div className="p-6">
              <h4 className="text-xs font-semibold tracking-wider text-deep-olive/50 uppercase mb-4">
                Popular Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Mechanics", "Genetics", "Organic Chemistry", "Calculus", "Programming"].map(
                  (topic) => (
                    <button
                      key={topic}
                      onClick={() => setQuery(topic)}
                      className="px-3 py-1.5 rounded-lg bg-deep-olive/5 text-sm text-deep-olive/70 hover:bg-deep-olive/10 hover:text-deep-olive transition-all duration-200"
                    >
                      {topic}
                    </button>
                  )
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-glass-border flex items-center justify-between text-xs text-deep-olive/40">
                <span>Press ↑↓ to navigate</span>
                <span>Press Enter to select</span>
                <span>ESC to close</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
