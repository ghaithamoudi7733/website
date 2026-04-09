"use client";

import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icons";
import { MATHEMATICS_MODULES, type MathModule, type YearData, getModuleNotes } from "@/data/mathematics";

interface MathematicsModuleGridProps {
  onModuleSelect: (module: MathModule) => void;
}

export default function MathematicsModuleGrid({ onModuleSelect }: MathematicsModuleGridProps) {
  return (
    // 3-column grid for 6 cards (3x2 layout) - optimal for remaining modules
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MATHEMATICS_MODULES.map((module, index) => (
        <ModuleCard
          key={module.id}
          module={module}
          onSelect={() => onModuleSelect(module)}
          index={index}
        />
      ))}
    </div>
  );
}

interface ModuleCardProps {
  module: MathModule;
  onSelect: () => void;
  index: number;
}

// Deep Charcoal-Olive for high contrast text - WCAG AA compliant
const TEXT_DARK = "#2F3327";
const HEADER_DARK = "#1A1C16";
const MUTED_GOLD = "#B8A47C";

function ModuleCard({ module, onSelect, index }: ModuleCardProps) {
  return (
    <button
      onClick={onSelect}
      className="group relative w-full text-left animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card Container - 20% opacity olive border for clear definition against beige background */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-[#3B3F30]/20 overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-[#3B3F30]/10">
        
        {/* Muted Gold/Bronze Watermark Background - visible but not distracting */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-500">
          <Icon 
            name={module.watermark} 
            size={200} 
            color={MUTED_GOLD}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Module Code Badge - Serif font, significantly darker as primary visual anchor */}
          <div className="mb-4">
            <span 
              className="text-4xl font-serif font-bold tracking-tight"
              style={{ color: HEADER_DARK }}
            >
              {module.code}
            </span>
          </div>

          {/* Module Name */}
          <h3 
            className="font-sans font-semibold mb-2 text-sm uppercase tracking-wider"
            style={{ color: TEXT_DARK }}
          >
            {module.name}
          </h3>

          {/* Description - Deep Charcoal-Olive for WCAG AA compliance */}
          <p 
            className="text-sm mb-4 line-clamp-2 font-medium"
            style={{ color: TEXT_DARK }}
          >
            {module.description}
          </p>

          {/* Topic Count - matches description darkness for consistency */}
          <div className="flex items-center justify-between">
            <span 
              className="text-xs font-medium"
              style={{ color: TEXT_DARK }}
            >
              {module.topics.length} topics
            </span>
            
            {/* Chevron Button - Enhanced hover states */}
            {/* State 1: 5% olive bg + 25% border */}
            {/* State 2: solid olive bg + white icon on hover */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border bg-[#3B3F30]/5 border-[#3B3F30]/25 group-hover:bg-[#3B3F30] group-hover:border-[#3B3F30]"
            >
              <div className="text-[#2F3327] group-hover:text-white transition-colors duration-300">
                <Icon name="chevron-right" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        />
      </div>
    </button>
  );
}

interface ModuleModalProps {
  module: MathModule | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModuleModal({ module, isOpen, onClose }: ModuleModalProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"papers" | "notes">("papers");
  const [expandedSeries, setExpandedSeries] = useState<string | null>("June");
  
  // Ref for the modal container to detect clicks outside
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close if clicking the backdrop (not the modal content)
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !module) return null;

  const years = module.years;
  const notes = getModuleNotes(module.code);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur - click to close */}
      <div className="absolute inset-0 bg-[#1A1C16]/40 backdrop-blur-sm" />

      {/* Modal Container - click-away protection */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-scale"
      >
        {/* Modal Card */}
        <div className="bg-cream/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#3B3F30]/15 overflow-hidden">
          
          {/* Header - Near-black olive for maximum impact */}
          <div className="relative p-6 border-b border-[#3B3F30]/10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span 
                    className="text-3xl font-serif font-bold"
                    style={{ color: HEADER_DARK }}
                  >
                    {module.code}
                  </span>
                  <span className="text-[#3B3F30]/50 text-sm">|</span>
                  <span className="font-medium" style={{ color: TEXT_DARK }}>{module.fullName}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: TEXT_DARK }}>
                  {module.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#3B3F30]/10 transition-colors duration-200"
                aria-label="Close modal"
              >
                <Icon name="x-icon" size={24} color={TEXT_DARK} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveTab("papers")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "papers"
                    ? "bg-[#3B3F30] text-white"
                    : "text-[#2F3327] hover:bg-[#3B3F30]/10"
                }`}
              >
                Past Papers
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "notes"
                    ? "bg-[#3B3F30] text-white"
                    : "text-[#2F3327] hover:bg-[#3B3F30]/10"
                }`}
              >
                Revision Notes
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === "papers" ? (
              <div className="space-y-6">
                {/* Year Selection Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: TEXT_DARK }}>
                    Select Year
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {years.map((yearData) => (
                      <button
                        key={yearData.year}
                        onClick={() => setSelectedYear(yearData.year)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          selectedYear === yearData.year
                            ? "bg-[#3B3F30] text-white"
                            : "bg-white border border-[#3B3F30]/20 text-[#2F3327] hover:border-[#3B3F30]/40"
                        }`}
                      >
                        {yearData.year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Series Selection */}
                {selectedYear && (
                  <div className="animate-fade-in">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: TEXT_DARK }}>
                      Exam Series — {selectedYear}
                    </h4>
                    <div className="space-y-3">
                      {years
                        .find((y) => y.year === selectedYear)
                        ?.series.filter((s) => s.available)
                        .map((series) => (
                          <SeriesAccordion
                            key={series.name}
                            series={series}
                            isExpanded={expandedSeries === series.name}
                            onToggle={() => setExpandedSeries(
                              expandedSeries === series.name ? null : series.name
                            )}
                            moduleCode={module.code}
                            year={selectedYear}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Prompt if no year selected */}
                {!selectedYear && (
                  <div className="text-center py-8" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    <div className="mx-auto mb-4 opacity-40">
                      <Icon name="file-text" size={48} color={TEXT_DARK} />
                    </div>
                    <p className="text-sm font-medium">Select a year to view available papers</p>
                  </div>
                )}
              </div>
            ) : (
              /* Notes Tab */
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <button
                    key={note.title}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-[#3B3F30]/15 hover:border-[#3B3F30]/30 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#3B3F30]/5 flex items-center justify-center">
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                        <Icon name="document-notes" size={24} color={TEXT_DARK} />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h5 className="font-semibold text-sm" style={{ color: TEXT_DARK }}>
                        {note.title}
                      </h5>
                      <span className="text-xs font-medium" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                        {note.pages} pages
                      </span>
                    </div>
                    <div className="opacity-30 group-hover:opacity-100 transition-opacity duration-200">
                      <Icon name="arrow" size={16} color={TEXT_DARK} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#3B3F30]/10 bg-[#3B3F30]/[0.02]">
            <div className="flex items-center justify-between text-xs font-medium" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
              <span>Logic Vault Mathematics</span>
              <span>{module.code} • {module.years.length} years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeriesAccordionProps {
  series: YearData["series"][0];
  isExpanded: boolean;
  onToggle: () => void;
  moduleCode: string;
  year: number;
}

function SeriesAccordion({ series, isExpanded, onToggle, moduleCode, year }: SeriesAccordionProps) {
  return (
    <div className="border border-[#3B3F30]/15 rounded-xl overflow-hidden bg-white/50">
      {/* Series Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[#3B3F30]/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3B3F30]/5 flex items-center justify-center">
            <Icon 
              name={series.name === "January" ? "snow" : series.name === "June" ? "sun" : "leaf"} 
              size={20} 
              color={TEXT_DARK}
            />
          </div>
          <div className="text-left">
            <span className="font-semibold text-sm" style={{ color: TEXT_DARK }}>{series.name}</span>
            <span className="text-xs block" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
              2 documents
            </span>
          </div>
        </div>
        <div className={`opacity-50 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
          <Icon name="chevron-down" size={16} color={TEXT_DARK} />
        </div>
      </button>

      {/* Document Buttons */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <DocumentButton
              type="QP"
              label="Question Paper"
              size={series.documents.QP?.size || "2.4 MB"}
            />
            <DocumentButton
              type="MS"
              label="Mark Scheme"
              size={series.documents.MS?.size || "1.8 MB"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface DocumentButtonProps {
  type: "QP" | "MS";
  label: string;
  size: string;
}

function DocumentButton({ type, label, size }: DocumentButtonProps) {
  const iconName = type === "QP" ? "document-qp" : "document-ms";
  
  return (
    <button className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#3B3F30]/15 hover:border-[#3B3F30]/35 hover:shadow-sm transition-all duration-200 group">
      <div className="w-10 h-10 rounded-lg bg-[#3B3F30]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B3F30] transition-colors duration-200">
        <div className="opacity-60 group-hover:opacity-100 group-hover:text-white transition-all duration-200">
          <Icon name={iconName} size={24} color={TEXT_DARK} />
        </div>
      </div>
      <div className="text-left">
        <span className="font-semibold text-sm block" style={{ color: TEXT_DARK }}>{type}</span>
        <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>{size}</span>
      </div>
    </button>
  );
}
