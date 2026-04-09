"use client";

import React from "react";
import Link from "next/link";
import Icon from "./Icons";
import { getAllSubjects } from "@/data/vault";

interface HeroProps {
  onSearchClick: () => void;
}

export default function Hero({ onSearchClick }: HeroProps) {
  const subjects = getAllSubjects();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center section-padding pt-32 lg:pt-40 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-deep-olive/5 animate-pulse" />
        <div className="absolute top-40 right-[15%] w-48 h-48 border border-muted-gold/20 rounded-full" />
        <div className="absolute bottom-32 left-[20%] w-64 h-32 border border-deep-olive/10 rotate-12 rounded-2xl" />
        <div className="absolute bottom-20 right-[10%] w-24 h-24 bg-cream/50 rounded-lg transform rotate-45" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-muted-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-deep-olive/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-deep-olive/70">
            <span className="w-2 h-2 rounded-full bg-[#8B9D77] animate-pulse" />
            <span>Academic Excellence Platform</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-deep-olive leading-tight tracking-tight">
            <span className="block">The Logic Vault</span>
            <span className="block text-deep-olive/60 mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Knowledge Repository
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-lg text-deep-olive/70 leading-relaxed">
            Premium academic resources for Physics, Biology, Chemistry, 
            and Mathematics. Curated for excellence.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={onSearchClick}
            className="group relative w-full max-w-xl"
          >
            <div className="absolute inset-0 bg-muted-gold/20 rounded-full blur-xl group-hover:bg-muted-gold/30 transition-all duration-300" />
            <div className="relative glass-strong rounded-full px-6 py-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              <Icon name="search" size={24} className="text-deep-olive/50" />
              <span className="text-deep-olive/50 text-lg">Search the vault...</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-deep-olive/40 px-2 py-1 rounded bg-deep-olive/5">⌘K</span>
              </div>
            </div>
          </button>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {subjects.map((subject, index) => (
            <Link
              key={subject.id}
              href={`/subject/${subject.slug}`}
              className="group relative"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted-gold/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative glass rounded-2xl p-6 card-hover h-full flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${subject.accentColor}20` }}
                >
                  <Icon
                    name={subject.icon}
                    size={32}
                    color={subject.accentColor}
                  />
                </div>
                <h3 className="font-serif text-lg text-deep-olive mb-2 group-hover:text-deep-olive transition-colors duration-300">
                  {subject.name}
                </h3>
                <p className="text-xs text-deep-olive/50 line-clamp-2">
                  {subject.topics.length} topics
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="book" size={20} className="text-muted-gold" />
            </div>
            <span className="block text-3xl font-serif text-deep-olive">
              {subjects.reduce((acc, s) => acc + s.topics.length, 0).toLocaleString()}+
            </span>
            <span className="text-sm text-deep-olive/60">Topics</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="file-text" size={20} className="text-muted-gold" />
            </div>
            <span className="block text-3xl font-serif text-deep-olive">
              {subjects.reduce((acc, s) => acc + s.pastPapers.length, 0).toLocaleString()}+
            </span>
            <span className="text-sm text-deep-olive/60">Past Papers</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="play-circle" size={20} className="text-muted-gold" />
            </div>
            <span className="block text-3xl font-serif text-deep-olive">
              {subjects.reduce((acc, s) => acc + s.resources.length, 0).toLocaleString()}+
            </span>
            <span className="text-sm text-deep-olive/60">Interactive</span>
          </div>
          <div className="text-center hidden sm:block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="vault" size={20} className="text-muted-gold" />
            </div>
            <span className="block text-3xl font-serif text-deep-olive">
              {subjects.length}
            </span>
            <span className="text-sm text-deep-olive/60">Subjects</span>
          </div>
        </div>
      </div>
    </section>
  );
}
