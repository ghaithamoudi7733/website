"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Icon from "./Icons";
import { type Subject, SUBJECT_THEMES } from "@/data/vault";
import MathematicsModuleGrid, { ModuleModal } from "./MathematicsModuleGrid";
import { type MathModule } from "@/data/mathematics";
import dynamic from "next/dynamic";

interface SubjectPageProps {
  subject: Subject;
}

// Near-black olive for maximum contrast
const HEADER_DARK = "#1A1C16";
const TEXT_DARK = "#2F3327";

type TabType = "topics" | "interactive";

// Lazy load interactive tools for performance - ALL subjects
const LazyGraphingCalculator = dynamic(() => import("./GraphingCalculator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.mathematics.primary }}>Loading calculator...</div>
    </div>
  )
});

const LazyEquationSolver = dynamic(() => import("./EquationSolver"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.mathematics.primary }}>Loading solver...</div>
    </div>
  )
});

const LazyStatisticalDistributions = dynamic(() => import("./StatisticalDistributions"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.mathematics.primary }}>Loading statistics...</div>
    </div>
  )
});

// Physics tools
const LazyProjectileSimulator = dynamic(() => import("./ProjectileSimulator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.physics.primary }}>Loading simulator...</div>
    </div>
  )
});

const LazyCircuitBuilder = dynamic(() => import("./CircuitBuilder"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.physics.primary }}>Loading circuit...</div>
    </div>
  )
});

// Biology tools
const LazyCellDivisionSimulator = dynamic(() => import("./CellDivisionSimulator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.biology.primary }}>Loading simulator...</div>
    </div>
  )
});

const LazyGeneticsCalculator = dynamic(() => import("./GeneticsCalculator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.biology.primary }}>Loading calculator...</div>
    </div>
  )
});

// Chemistry tools
const LazyPeriodicTableExplorer = dynamic(() => import("./PeriodicTableExplorer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.chemistry.primary }}>Loading periodic table...</div>
    </div>
  )
});

// Additional Physics tools
const LazyWaveInterferenceSimulator = dynamic(() => import("./WaveInterferenceSimulator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse" style={{ color: SUBJECT_THEMES.physics.primary }}>Loading wave simulator...</div>
    </div>
  )
});

export default function SubjectPage({ subject }: SubjectPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [selectedModule, setSelectedModule] = useState<MathModule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

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

  // Handle interactive tool activation - now for ALL subjects
  const activateTool = useCallback((toolId: string) => {
    setActiveTool(toolId);
  }, []);

  const deactivateTool = useCallback(() => {
    setActiveTool(null);
  }, []);
  
  // Get the active tool component - now handles ALL subjects
  const renderActiveTool = () => {
    if (!activeTool) return null;

    // Mathematics tools
    if (activeTool === "math-sim-1") {
      return <LazyGraphingCalculator theme={SUBJECT_THEMES.mathematics} isVisible={true} onClose={deactivateTool} />;
    }
    if (activeTool === "math-sim-2") {
      return <LazyEquationSolver theme={SUBJECT_THEMES.mathematics} isVisible={true} onClose={deactivateTool} />;
    }
    if (activeTool === "math-sim-3") {
      return <LazyStatisticalDistributions theme={SUBJECT_THEMES.mathematics} isVisible={true} onClose={deactivateTool} />;
    }

    // Physics tools
    if (activeTool === "sim-1") {
      return <LazyProjectileSimulator theme={SUBJECT_THEMES.physics} isVisible={true} onClose={deactivateTool} />;
    }
    if (activeTool === "sim-2") {
      return <LazyCircuitBuilder theme={SUBJECT_THEMES.physics} isVisible={true} onClose={deactivateTool} />;
    }
    if (activeTool === "sim-3") {
      return <LazyWaveInterferenceSimulator theme={SUBJECT_THEMES.physics} isVisible={true} onClose={deactivateTool} />;
    }

    // Biology tools
    if (activeTool === "bio-sim-1") {
      return <LazyCellDivisionSimulator theme={SUBJECT_THEMES.biology} isVisible={true} onClose={deactivateTool} />;
    }
    if (activeTool === "bio-sim-2") {
      return <LazyGeneticsCalculator theme={SUBJECT_THEMES.biology} isVisible={true} onClose={deactivateTool} />;
    }

    // Chemistry tools
    if (activeTool === "chem-sim-1") {
      return <LazyPeriodicTableExplorer theme={SUBJECT_THEMES.chemistry} isVisible={true} onClose={deactivateTool} />;
    }

    return null;
  };

  // Get subject theme
  const subjectTheme = subject.id === "mathematics" ? SUBJECT_THEMES.mathematics :
                       subject.id === "biology" ? SUBJECT_THEMES.biology :
                       subject.id === "chemistry" ? SUBJECT_THEMES.chemistry :
                       SUBJECT_THEMES.physics;

  // Build tabs - only Topics and Interactive
  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { 
      id: "topics", 
      label: isMathematics ? "Module Grid" : "Topics & Notes", 
      icon: isMathematics ? "calculator" : "book" 
    },
    { 
      id: "interactive", 
      label: "Interactive Tools", 
      icon: "play-circle" 
    },
  ];

  return (
    <main className="min-h-screen bg-warm-beige">
      {/* Hero Section */}
      <section
        className="relative pt-32 lg:pt-40 pb-16 overflow-hidden border-b border-[#3B3F30]/10"
        style={{ backgroundColor: isMathematics ? "#E6E0D0" : `${subject.accentColor}08` }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 right-[10%] w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: "#3B3F30", opacity: isMathematics ? 0.05 : 0.3 }}
          />
          <div
            className="absolute bottom-0 left-[5%] w-48 h-48 rounded-full blur-2xl"
            style={{ backgroundColor: "#3B3F30", opacity: isMathematics ? 0.05 : 0.2 }}
          />
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

          {/* Subject Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
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
              <div className="flex flex-wrap gap-4 text-sm font-semibold" style={{ color: "#2F3327" }}>
                <span className="flex items-center gap-2">
                  <Icon name="book" size={16} color="#3B3F30" />
                  {isMathematics ? "6 Modules" : `${subject.topics.length} Topics`}
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="play-circle" size={16} color="#3B3F30" />
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
          {/* Topics Tab */}
          {activeTab === "topics" && (
            <div className="animate-fade-in">
              {isMathematics ? (
                <>
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

          {/* Interactive Tab - NOW FOR ALL SUBJECTS */}
          {activeTab === "interactive" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subject.resources.map((resource) => {
                  // ALL tools are now clickable
                  const isClickable = true;
                  
                  return (
                    <div
                      key={resource.id}
                      onClick={() => activateTool(resource.id)}
                      className="glass rounded-xl overflow-hidden card-hover border transition-all duration-300 cursor-pointer group hover:shadow-xl"
                      style={{ 
                        borderColor: `${subjectTheme.primary}20`,
                        borderWidth: "1px"
                      }}
                    >
                      <div
                        className="h-40 flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: `${subjectTheme.primary}10` }}
                      >
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${subjectTheme.primary}15, transparent)`,
                          }}
                        />
                        <div className="transition-transform duration-300 group-hover:scale-110">
                          <Icon name={resource.icon} size={48} color={subjectTheme.primary} />
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
                          className="text-sm font-medium"
                          style={{ color: TEXT_DARK }}
                        >
                          {resource.description}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: subjectTheme.primary }}>
                          <span className="font-semibold">Click to launch</span>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${subjectTheme.primary}20` }}>
                            <Icon name="arrow" size={12} color={subjectTheme.primary} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

      {/* Active Interactive Tool - Now for ALL subjects */}
      {renderActiveTool()}
    </main>
  );
}
