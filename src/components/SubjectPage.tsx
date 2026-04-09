"use client";

import React, { useState } from "react";
import Link from "next/link";
import Icon from "./Icons";
import { type Subject, SUBJECT_THEMES } from "@/data/vault";
import MathematicsModuleGrid, { ModuleModal } from "./MathematicsModuleGrid";
import { type MathModule } from "@/data/mathematics";

interface SubjectPageProps {
  subject: Subject;
}

// Near-black olive for maximum contrast
const HEADER_DARK = "#1A1C16";
const TEXT_DARK = "#2F3327";

type TabType = "topics" | "papers" | "interactive";

export default function SubjectPage({ subject }: SubjectPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [selectedModule, setSelectedModule] = useState<MathModule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle Mathematics module selection
  const handleModuleSelect = (module: MathModule) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedModule(null), 300);
  };

  // Check if this is the Mathematics subject
  const isMathematics = subject.id === "mathematics";

  // Get subject theme
  const subjectTheme = subject.id === "mathematics" ? SUBJECT_THEMES.mathematics :
                       subject.id === "biology" ? SUBJECT_THEMES.biology :
                       subject.id === "chemistry" ? SUBJECT_THEMES.chemistry :
                       SUBJECT_THEMES.physics;

  // Build tabs based on subject type
  const getTabs = () => {
    const baseTabs: Array<{ id: TabType; label: string; icon: string }> = [
      { 
        id: "topics", 
        label: isMathematics ? "Module Grid" : "Topics & Notes", 
        icon: isMathematics ? "calculator" : "book" 
      },
    ];
    
    // Only add "Past Papers" tab for non-Mathematics subjects
    // (Mathematics papers are accessed inside modules via modal)
    if (!isMathematics) {
      baseTabs.push({ id: "papers", label: "Past Papers", icon: "file-text" });
    }
    
    // Always add Interactive
    baseTabs.push({ id: "interactive", label: "Interactive", icon: "play-circle" });
    
    return baseTabs;
  };

  const tabs = getTabs();

  return (
    <main className="min-h-screen bg-warm-beige">
      {/* Hero Section - Mathematics A-Level Vault */}
      <section
        className="relative pt-32 lg:pt-40 pb-16 overflow-hidden border-b border-[#3B3F30]/10"
        style={{ backgroundColor: isMathematics ? "#E6E0D0" : `${subject.accentColor}08` }}
      >
        {/* Decorative Elements - EmeraldMath Style */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Olive ambient glow at 5% opacity for professional atmosphere */}
          <div
            className="absolute top-20 right-[10%] w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: "#3B3F30", opacity: isMathematics ? 0.05 : 0.3 }}
          />
          <div
            className="absolute bottom-0 left-[5%] w-48 h-48 rounded-full blur-2xl"
            style={{ backgroundColor: "#3B3F30", opacity: isMathematics ? 0.05 : 0.2 }}
          />
          {/* Micro dot grid pattern for EmeraldMath aesthetic */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle, ${subject.accentColor} 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-medium mb-8 animate-fade-in-up" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
            <Link href="/" className="hover:text-[#2F3327] transition-colors duration-300">
              Vault
            </Link>
            <span>/</span>
            <span style={{ color: TEXT_DARK }}>{subject.name}</span>
          </nav>

          {/* Subject Header - Near-black olive for maximum impact */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
            {/* Icon Block - Calculator with enhanced stroke weight */}
            <div
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center mb-6 lg:mb-0 animate-fade-in-up border border-[#3B3F30]/10"
              style={{ backgroundColor: isMathematics ? "rgba(201, 184, 150, 0.15)" : `${subject.accentColor}20` }}
            >
              <Icon 
                name={subject.icon} 
                size={64} 
                color={isMathematics ? "#3B3F30" : subject.accentColor}
              />
            </div>

            {/* Title Block */}
            <div className="flex-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h1 
                className="font-serif text-4xl lg:text-6xl mb-4"
                style={{ color: HEADER_DARK }}
              >
                {subject.name}
              </h1>
              <p 
                className="text-lg max-w-2xl leading-relaxed mb-6 font-medium"
                style={{ color: TEXT_DARK }}
              >
                {isMathematics 
                  ? "A comprehensive archive of Pure Mathematics (P1-P4), Statistics (S1), and Mechanics (M1), featuring structured past papers, mark schemes, and curated revision notes."
                  : subject.description
                }
              </p>
              {/* Stats Bar - Accurate data for Mathematics Vault */}
              <div className="flex flex-wrap gap-4 text-sm font-semibold" style={{ color: "#2F3327" }}>
                <span className="flex items-center gap-2">
                  <Icon name="book" size={16} color="#3B3F30" />
                  6 Modules
                </span>
                {isMathematics && (
                  <>
                    <span className="flex items-center gap-2">
                      <Icon name="file-text" size={16} color="#3B3F30" />
                      124 Past Papers
                    </span>
                    <span className="flex items-center gap-2">
                      <Icon name="document-notes" size={16} color="#3B3F30" />
                      Notes Vault
                    </span>
                  </>
                )}
                {!isMathematics && (
                  <>
                    <span className="flex items-center gap-2">
                      <Icon name="file-text" size={16} color="#3B3F30" />
                      {subject.pastPapers.length} Past Papers
                    </span>
                    <span className="flex items-center gap-2">
                      <Icon name="play-circle" size={16} color="#3B3F30" />
                      {subject.resources.length} Interactive
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 lg:top-20 z-30 glass border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "text-[#1A1C16]"
                    : "text-[#2F3327]/60 hover:text-[#2F3327]"
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
          {/* Topics Tab - Shows EmeraldMath Grid for Mathematics */}
          {activeTab === "topics" && (
            <div className="animate-fade-in">
              {isMathematics ? (
                <>
                  {/* Section Header - Near-black for maximum impact */}
                  <div className="mb-8">
                    <h2 
                      className="font-serif text-2xl mb-2"
                      style={{ color: HEADER_DARK }}
                    >
                      Select a Module
                    </h2>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: TEXT_DARK }}
                    >
                      Choose a module to access past papers and revision notes organized by exam series.
                    </p>
                  </div>
                  <MathematicsModuleGrid 
                    onModuleSelect={handleModuleSelect}
                    theme={subjectTheme}
                  />
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subject.topics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className="glass rounded-xl p-6 card-hover group cursor-pointer border border-[#3B3F30]/20"
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
                          <h3 
                            className="font-serif text-lg mb-2 group-hover:text-[#1A1C16] transition-colors duration-300"
                            style={{ color: HEADER_DARK }}
                          >
                            {topic.title}
                          </h3>
                          <p 
                            className="text-sm line-clamp-2 font-medium"
                            style={{ color: TEXT_DARK }}
                          >
                            {topic.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span 
                          className="text-xs font-semibold px-2 py-1 rounded bg-[#3B3F30]/5"
                          style={{ color: TEXT_DARK }}
                        >
                          Notes
                        </span>
                        <div className="opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                          <Icon name="arrow" size={16} color="#3B3F30" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Papers Tab - Only for non-Mathematics subjects */}
          {activeTab === "papers" && !isMathematics && (
            <div className="animate-fade-in">
              <div className="glass rounded-xl overflow-hidden border border-[#3B3F30]/20">
                <table className="w-full">
                  <thead className="bg-cream border-b border-[#3B3F30]/10">
                    <tr>
                      <th 
                        className="text-left px-6 py-4 text-sm font-bold"
                        style={{ color: TEXT_DARK }}
                      >
                        Paper
                      </th>
                      <th 
                        className="text-left px-6 py-4 text-sm font-bold"
                        style={{ color: TEXT_DARK }}
                      >
                        Year
                      </th>
                      <th 
                        className="text-left px-6 py-4 text-sm font-bold"
                        style={{ color: TEXT_DARK }}
                      >
                        Difficulty
                      </th>
                      <th 
                        className="text-right px-6 py-4 text-sm font-bold"
                        style={{ color: TEXT_DARK }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.pastPapers.map((paper, index) => (
                      <tr
                        key={paper.id}
                        className="border-b border-[#3B3F30]/10 last:border-b-0 hover:bg-[#3B3F30]/5 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon
                              name="file-text"
                              size={20}
                              color={subject.accentColor}
                            />
                            <span 
                              className="font-semibold"
                              style={{ color: TEXT_DARK }}
                            >
                              {paper.title}
                            </span>
                          </div>
                          <span 
                            className="text-xs block mt-1 font-medium"
                            style={{ color: "rgba(47, 51, 39, 0.6)" }}
                          >
                            {paper.description}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="text-sm font-medium"
                            style={{ color: "rgba(47, 51, 39, 0.8)" }}
                          >
                            {paper.date}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-xs px-2 py-1 rounded-full font-semibold"
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
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                            style={{
                              backgroundColor: "#3B3F30",
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
                    className="glass rounded-xl overflow-hidden card-hover group cursor-pointer border border-[#3B3F30]/20"
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
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        <Icon name={resource.icon} size={48} color={subject.accentColor} />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 
                        className="font-serif text-lg mb-2"
                        style={{ color: HEADER_DARK }}
                      >
                        {resource.title}
                      </h3>
                      <p 
                        className="text-sm mb-4 font-medium"
                        style={{ color: TEXT_DARK }}
                      >
                        {resource.description}
                      </p>
                      <button
                        className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
                        style={{
                          backgroundColor: `${subject.accentColor}20`,
                          color: "#2F3327",
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
      <section className="section-padding pt-0 border-t border-[#3B3F30]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="font-serif text-2xl mb-6"
            style={{ color: HEADER_DARK }}
          >
            Related Subjects
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { name: "Physics", theme: SUBJECT_THEMES.physics, icon: "atom", slug: "physics" },
              { name: "Biology", theme: SUBJECT_THEMES.biology, icon: "leaf", slug: "biology" },
              { name: "Chemistry", theme: SUBJECT_THEMES.chemistry, icon: "flask-conical", slug: "chemistry" },
              { name: "Mathematics", theme: SUBJECT_THEMES.mathematics, icon: "calculator", slug: "mathematics" },
            ]
              .filter((s) => s.slug !== subject.slug)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/subject/${related.slug}`}
                  className="glass rounded-xl p-4 card-hover group flex items-center gap-3 border border-[#3B3F30]/20"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${related.theme.primary}20` }}
                  >
                    <Icon name={related.icon} size={20} color={related.theme.primary} />
                  </div>
                  <span 
                    className="font-semibold text-sm"
                    style={{ color: TEXT_DARK }}
                  >
                    {related.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Module Modal for Mathematics */}
      {isMathematics && (
        <ModuleModal
          module={selectedModule}
          isOpen={isModalOpen}
          onClose={closeModal}
          theme={subjectTheme}
        />
      )}
    </main>
  );
}
