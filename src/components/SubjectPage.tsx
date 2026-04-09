"use client";

import React, { useState } from "react";
import Link from "next/link";
import Icon from "./Icons";
import { type Subject } from "@/data/vault";

interface SubjectPageProps {
  subject: Subject;
}

export default function SubjectPage({ subject }: SubjectPageProps) {
  const [activeTab, setActiveTab] = useState<"topics" | "papers" | "interactive">("topics");

  return (
    <main className="min-h-screen bg-warm-beige">
      {/* Hero Section */}
      <section
        className="relative pt-32 lg:pt-40 pb-16 overflow-hidden"
        style={{ backgroundColor: `${subject.accentColor}08` }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 right-[10%] w-64 h-64 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: subject.accentColor }}
          />
          <div
            className="absolute bottom-0 left-[5%] w-48 h-48 rounded-full blur-2xl opacity-20"
            style={{ backgroundColor: subject.accentColor }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-deep-olive/60 mb-8 animate-fade-in-up">
            <Link href="/" className="hover:text-deep-olive transition-colors duration-300">
              Vault
            </Link>
            <span>/</span>
            <span className="text-deep-olive">{subject.name}</span>
          </nav>

          {/* Subject Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
            {/* Icon Block */}
            <div
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center mb-6 lg:mb-0 animate-fade-in-up"
              style={{ backgroundColor: `${subject.accentColor}20` }}
            >
              <Icon name={subject.icon} size={64} color={subject.accentColor} />
            </div>

            {/* Title Block */}
            <div className="flex-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h1 className="font-serif text-4xl lg:text-6xl text-deep-olive mb-4">
                {subject.name}
              </h1>
              <p className="text-lg text-deep-olive/70 max-w-2xl leading-relaxed mb-6">
                {subject.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-deep-olive/60">
                <span className="flex items-center gap-2">
                  <Icon name="book" size={16} />
                  {subject.topics.length} Topics
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="file-text" size={16} />
                  {subject.pastPapers.length} Past Papers
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="play-circle" size={16} />
                  {subject.resources.length} Interactive
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 lg:top-20 z-30 glass border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: "topics", label: "Topics & Notes", icon: "book" },
              { id: "papers", label: "Past Papers", icon: "file-text" },
              { id: "interactive", label: "Interactive", icon: "play-circle" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "text-deep-olive"
                    : "text-deep-olive/60 hover:text-deep-olive"
                }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                    style={{ backgroundColor: subject.accentColor }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Topics Tab */}
          {activeTab === "topics" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subject.topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="glass rounded-xl p-6 card-hover group cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${subject.accentColor}20` }}
                      >
                        <Icon name={topic.icon} size={24} color={subject.accentColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg text-deep-olive mb-2 group-hover:text-deep-olive transition-colors duration-300">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-deep-olive/60 line-clamp-2">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-deep-olive/40 px-2 py-1 rounded bg-deep-olive/5">
                        Notes
                      </span>
                      <Icon
                        name="arrow"
                        size={16}
                        className="text-deep-olive/30 group-hover:text-deep-olive/60 transition-all duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Papers Tab */}
          {activeTab === "papers" && (
            <div className="animate-fade-in">
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-cream border-b border-glass-border">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-deep-olive/70">
                        Paper
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-deep-olive/70">
                        Year
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-deep-olive/70">
                        Difficulty
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-deep-olive/70">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.pastPapers.map((paper, index) => (
                      <tr
                        key={paper.id}
                        className="border-b border-glass-border last:border-b-0 hover:bg-deep-olive/5 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon
                              name="file-text"
                              size={20}
                              color={subject.accentColor}
                            />
                            <span className="font-medium text-deep-olive">
                              {paper.title}
                            </span>
                          </div>
                          <span className="text-xs text-deep-olive/50 block mt-1">
                            {paper.description}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-deep-olive/70">{paper.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${subject.accentColor}20`,
                              color: subject.accentColor,
                            }}
                          >
                            {paper.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
                            style={{
                              backgroundColor: subject.accentColor,
                              color: "white",
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interactive Tab */}
          {activeTab === "interactive" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subject.resources.map((resource, index) => (
                  <div
                    key={resource.id}
                    className="glass rounded-xl overflow-hidden card-hover group cursor-pointer"
                  >
                    <div
                      className="h-40 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: `${subject.accentColor}15` }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${subject.accentColor}20, transparent)`,
                        }}
                      />
                      <Icon
                        name={resource.icon}
                        size={48}
                        color={subject.accentColor}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-lg text-deep-olive mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-deep-olive/60 mb-4">
                        {resource.description}
                      </p>
                      <button
                        className="w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-80"
                        style={{
                          backgroundColor: `${subject.accentColor}20`,
                          color: subject.accentColor,
                        }}
                      >
                        <Icon name="play-circle" size={16} />
                        Launch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Subjects */}
      <section className="section-padding pt-0 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-deep-olive mb-6">Related Subjects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Physics", color: "#8B9D77", icon: "atom", slug: "physics" },
              { name: "Biology", color: "#A4B494", icon: "leaf", slug: "biology" },
              { name: "Chemistry", color: "#9B8B7A", icon: "flask-conical", slug: "chemistry" },
              { name: "Mathematics", color: "#C9B896", icon: "calculator", slug: "mathematics" },
              { name: "IT", color: "#7A8B9D", icon: "cpu", slug: "information-technology" },
            ]
              .filter((s) => s.slug !== subject.slug)
              .slice(0, 4)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/subject/${related.slug}`}
                  className="glass rounded-xl p-4 card-hover group flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${related.color}20` }}
                  >
                    <Icon name={related.icon} size={20} color={related.color} />
                  </div>
                  <span className="font-medium text-deep-olive text-sm">
                    {related.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
