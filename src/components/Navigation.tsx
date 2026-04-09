"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icons";
import { vaultData, getAllSubjects, type Subject } from "@/data/vault";

interface NavigationProps {
  onSearchClick: () => void;
}

export default function Navigation({ onSearchClick }: NavigationProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const subjects = getAllSubjects();
  const scientific = subjects.filter(s => ["physics", "biology", "chemistry"].includes(s.id));
  const technical = subjects.filter(s => ["mathematics", "information-technology"].includes(s.id));

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-strong" : "glass"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Icon name="vault" size={32} className="text-deep-olive group-hover:text-muted-gold transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-serif font-semibold tracking-tight text-deep-olive">
                  Logic Vault
                </span>
                <span className="text-[10px] text-deep-olive/60 tracking-widest uppercase hidden sm:block">
                  Academic Repository
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isMegaMenuOpen
                    ? "bg-deep-olive/10 text-deep-olive"
                    : "text-deep-olive/80 hover:text-deep-olive hover:bg-deep-olive/5"
                }`}
              >
                <span>The Vault</span>
                <Icon
                  name="chevron-down"
                  size={16}
                  className={`transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <Link
                href="/notes"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === "/notes"
                    ? "bg-deep-olive/10 text-deep-olive"
                    : "text-deep-olive/80 hover:text-deep-olive hover:bg-deep-olive/5"
                }`}
              >
                Notes
              </Link>

              <button
                onClick={onSearchClick}
                className="ml-4 px-4 py-2 rounded-full search-input flex items-center gap-2 text-deep-olive/60 hover:text-deep-olive transition-all duration-300 min-w-[200px]"
              >
                <Icon name="search" size={16} />
                <span className="text-sm">Search...</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={onSearchClick}
                className="p-2 rounded-lg text-deep-olive/80 hover:text-deep-olive hover:bg-deep-olive/5 transition-all duration-300"
              >
                <Icon name="search" size={20} />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-deep-olive/80 hover:text-deep-olive hover:bg-deep-olive/5 transition-all duration-300"
              >
                <Icon name={isMobileMenuOpen ? "x-icon" : "menu"} size={20} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mega Menu - Desktop */}
      {isMegaMenuOpen && (
        <div
          className="fixed inset-0 top-16 lg:top-20 z-40 animate-fade-in"
          onClick={() => setIsMegaMenuOpen(false)}
        >
          <div
            className="glass-strong min-h-[400px] border-t border-glass-border animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scientific Sciences */}
                <div>
                  <h3 className="text-sm font-sans font-semibold tracking-wider text-deep-olive/60 uppercase mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8B9D77]"></span>
                    Scientific Sciences
                  </h3>
                  <ul className="space-y-1">
                    {scientific.map((subject) => (
                      <li key={subject.id}>
                        <Link
                          href={`/subject/${subject.slug}`}
                          className="group flex items-center gap-3 p-3 rounded-lg hover:bg-deep-olive/5 transition-all duration-300"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${subject.accentColor}20` }}
                          >
                            <Icon
                              name={subject.icon}
                              size={20}
                              color={subject.accentColor}
                            />
                          </div>
                          <div>
                            <span className="block text-deep-olive font-medium text-sm group-hover:text-deep-olive transition-colors duration-300">
                              {subject.name}
                            </span>
                            <span className="block text-xs text-deep-olive/50">
                              {subject.topics.length} topics
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical & Logic */}
                <div>
                  <h3 className="text-sm font-sans font-semibold tracking-wider text-deep-olive/60 uppercase mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C9B896]"></span>
                    Technical & Logic
                  </h3>
                  <ul className="space-y-1">
                    {technical.map((subject) => (
                      <li key={subject.id}>
                        <Link
                          href={`/subject/${subject.slug}`}
                          className="group flex items-center gap-3 p-3 rounded-lg hover:bg-deep-olive/5 transition-all duration-300"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${subject.accentColor}20` }}
                          >
                            <Icon
                              name={subject.icon}
                              size={20}
                              color={subject.accentColor}
                            />
                          </div>
                          <div>
                            <span className="block text-deep-olive font-medium text-sm group-hover:text-deep-olive transition-colors duration-300">
                              {subject.name}
                            </span>
                            <span className="block text-xs text-deep-olive/50">
                              {subject.topics.length} topics
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Stats */}
                <div className="hidden lg:block">
                  <h3 className="text-sm font-sans font-semibold tracking-wider text-deep-olive/60 uppercase mb-4">
                    Repository Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-off-white border border-glass-border">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="book" size={20} className="text-muted-gold" />
                        <span className="text-sm text-deep-olive/70">Total Resources</span>
                      </div>
                      <span className="text-2xl font-serif text-deep-olive">
                        {subjects.reduce((acc, s) => acc + s.topics.length + s.pastPapers.length + s.resources.length, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-off-white border border-glass-border">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="file-text" size={20} className="text-muted-gold" />
                        <span className="text-sm text-deep-olive/70">Past Papers</span>
                      </div>
                      <span className="text-2xl font-serif text-deep-olive">
                        {subjects.reduce((acc, s) => acc + s.pastPapers.length, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-off-white border border-glass-border">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="play-circle" size={20} className="text-muted-gold" />
                        <span className="text-sm text-deep-olive/70">Interactive Tools</span>
                      </div>
                      <span className="text-2xl font-serif text-deep-olive">
                        {subjects.reduce((acc, s) => acc + s.resources.length, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden animate-fade-in">
          <div
            className="glass-strong min-h-full border-t border-glass-border animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-6">
              {/* Scientific Sciences */}
              <div>
                <h3 className="text-xs font-sans font-semibold tracking-wider text-deep-olive/60 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8B9D77]"></span>
                  Scientific Sciences
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {scientific.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/subject/${subject.slug}`}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-deep-olive/5 transition-all duration-300"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${subject.accentColor}20` }}
                      >
                        <Icon name={subject.icon} size={24} color={subject.accentColor} />
                      </div>
                      <span className="text-xs text-deep-olive text-center">{subject.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Technical & Logic */}
              <div>
                <h3 className="text-xs font-sans font-semibold tracking-wider text-deep-olive/60 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C9B896]"></span>
                  Technical & Logic
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {technical.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/subject/${subject.slug}`}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-deep-olive/5 transition-all duration-300"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${subject.accentColor}20` }}
                      >
                        <Icon name={subject.icon} size={24} color={subject.accentColor} />
                      </div>
                      <span className="text-xs text-deep-olive text-center">{subject.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Notes Link */}
              <div>
                <Link
                  href="/notes"
                  className="flex items-center gap-3 p-4 rounded-lg bg-deep-olive/5 hover:bg-deep-olive/10 transition-all duration-300"
                >
                  <Icon name="book" size={24} className="text-muted-gold" />
                  <span className="text-deep-olive font-medium">View All Notes</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
