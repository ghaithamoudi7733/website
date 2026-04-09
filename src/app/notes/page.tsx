"use client";

import Navigation from "@/components/Navigation";
import SearchModal from "@/components/Search";
import Icon from "@/components/Icons";
import { getAllSubjects } from "@/data/vault";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export default function NotesPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const subjects = getAllSubjects();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <Navigation onSearchClick={() => setIsSearchOpen(true)} />
      <main className="min-h-screen bg-warm-beige pt-24 lg:pt-28">
        {/* Hero */}
        <section className="section-padding pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-deep-olive/60 mb-6">
              <Link href="/" className="hover:text-deep-olive transition-colors duration-300">
                Vault
              </Link>
              <span>/</span>
              <span className="text-deep-olive">Notes Repository</span>
            </nav>
            <h1 className="font-serif text-4xl lg:text-5xl text-deep-olive mb-4">
              All Notes
            </h1>
            <p className="text-lg text-deep-olive/70 max-w-2xl">
              Comprehensive collection of academic notes across all subjects.
              Organized for efficient learning and revision.
            </p>
          </div>
        </section>

        {/* Subject Sections */}
        <section className="section-padding pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {subjects.map((subject) => (
              <div key={subject.id} className="border-t border-glass-border pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${subject.accentColor}20` }}
                  >
                    <Icon name={subject.icon} size={24} color={subject.accentColor} />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-deep-olive">
                      {subject.name}
                    </h2>
                    <p className="text-sm text-deep-olive/60">
                      {subject.topics.length} topics available
                    </p>
                  </div>
                  <Link
                    href={`/subject/${subject.slug}`}
                    className="ml-auto px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: `${subject.accentColor}20`,
                      color: subject.accentColor,
                    }}
                  >
                    View Subject
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="glass rounded-xl p-4 card-hover cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${subject.accentColor}15` }}
                        >
                          <Icon name={topic.icon} size={20} color={subject.accentColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-deep-olive text-sm mb-1 group-hover:text-deep-olive transition-colors duration-300">
                            {topic.title}
                          </h3>
                          <p className="text-xs text-deep-olive/50 line-clamp-2">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
