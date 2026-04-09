"use client";

import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icons";
import { MATHEMATICS_MODULES, type MathModule, type YearData, getModuleNotes } from "@/data/mathematics";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface MathematicsModuleGridProps {
  onModuleSelect: (module: MathModule) => void;
  theme?: SubjectTheme;
}

// Mathematics uses Crimson Red theme
const MATH_THEME = SUBJECT_THEMES.mathematics;

export default function MathematicsModuleGrid({ onModuleSelect, theme = MATH_THEME }: MathematicsModuleGridProps) {
  return (
    // 3-column grid for 6 cards (3x2 layout) - optimal for remaining modules
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MATHEMATICS_MODULES.map((module, index) => (
        <ModuleCard
          key={module.id}
          module={module}
          onSelect={() => onModuleSelect(module)}
          index={index}
          theme={theme}
        />
      ))}
    </div>
  );
}

interface ModuleCardProps {
  module: MathModule;
  onSelect: () => void;
  index: number;
  theme: SubjectTheme;
}

// Deep Charcoal for high contrast text - WCAG AA compliant
const TEXT_DARK = "#2F3327";
const HEADER_DARK = "#1A1C16";

function ModuleCard({ module, onSelect, index, theme }: ModuleCardProps) {
  return (
    <button
      onClick={onSelect}
      className="group relative w-full text-left animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card Container - Subject theme border color */}
      <div 
        className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 border overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"
        style={{ 
          borderColor: `${theme.primary}30`,
          boxShadow: `0 0 0 0 ${theme.primary}00`,
        }}
      >
        
        {/* Watermark Background - Subject theme color at low opacity */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500"
        >
          <Icon 
            name={module.watermark} 
            size={200} 
            color={theme.primary}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Module Code Badge - Subject theme color */}
          <div className="mb-4">
            <span 
              className="text-4xl font-serif font-bold tracking-tight"
              style={{ color: theme.primary }}
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

          {/* Description - Deep Charcoal for WCAG AA compliance */}
          <p 
            className="text-sm mb-4 line-clamp-2 font-medium"
            style={{ color: TEXT_DARK }}
          >
            {module.description}
          </p>

          {/* Topic Count and Button */}
          <div className="flex items-center justify-between">
            <span 
              className="text-xs font-medium"
              style={{ color: TEXT_DARK }}
            >
              {module.topics.length} topics
            </span>
            
            {/* Chevron Button - Enhanced hover states per requirements */}
            {/* State 1: 5% olive bg + border | State 2: solid olive bg + white arrow */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border group-hover:bg-[#3B3F30] group-hover:border-[#3B3F30]"
              style={{
                backgroundColor: `${theme.primary}10`,
                borderColor: `${theme.primary}30`,
              }}
            >
              <div style={{ color: theme.primary }} className="group-hover:text-white transition-colors duration-300">
                <Icon name="chevron-right" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Gradient Overlay - Subject theme tint */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${theme.light}40 100%)`
          }}
        />
      </div>
    </button>
  );
}

interface ModuleModalProps {
  module: MathModule | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: SubjectTheme;
}

export function ModuleModal({ module, isOpen, onClose, theme = MATH_THEME }: ModuleModalProps) {
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
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
        <div 
          className="rounded-3xl shadow-2xl overflow-hidden border"
          style={{ 
            backgroundColor: "rgba(253, 251, 247, 0.98)",
            borderColor: `${theme.primary}20`,
            backdropFilter: "blur(20px)"
          }}
        >
          
          {/* Header - Subject theme color */}
          <div 
            className="relative p-6"
            style={{ 
              backgroundColor: theme.primary,
              borderBottom: `1px solid ${theme.primary}40`
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span 
                    className="text-3xl font-serif font-bold text-white"
                  >
                    {module.code}
                  </span>
                  <span className="text-white/60 text-sm">|</span>
                  <span className="font-medium text-white/90">{module.fullName}</span>
                </div>
                <p className="text-sm font-medium text-white/80">
                  {module.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="Close modal"
              >
                <Icon name="x-icon" size={24} color="white" />
              </button>
            </div>

            {/* Tab Navigation - White text on colored background */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveTab("papers")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "papers"
                    ? "bg-white text-gray-900"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Past Papers
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "notes"
                    ? "bg-white text-gray-900"
                    : "bg-white/20 text-white hover:bg-white/30"
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
                  <h4 
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: TEXT_DARK }}
                  >
                    Select Year
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {years.map((yearData) => (
                      <button
                        key={yearData.year}
                        onClick={() => setSelectedYear(yearData.year)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          selectedYear === yearData.year
                            ? "text-white"
                            : "border hover:border-opacity-60"
                        }`}
                        style={{
                          backgroundColor: selectedYear === yearData.year ? theme.primary : "white",
                          borderColor: selectedYear === yearData.year ? theme.primary : `${theme.primary}40`,
                          color: selectedYear === yearData.year ? "white" : TEXT_DARK,
                        }}
                      >
                        {yearData.year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Series Selection */}
                {selectedYear && (
                  <div className="animate-fade-in">
                    <h4 
                      className="text-xs font-bold uppercase tracking-wider mb-3"
                      style={{ color: TEXT_DARK }}
                    >
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
                            theme={theme}
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
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border hover:shadow-sm transition-all duration-200 group"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      borderColor: `${theme.primary}20`,
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: theme.light }}
                    >
                      <div style={{ color: theme.primary }}>
                        <Icon name="document-notes" size={24} />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h5 
                        className="font-semibold text-sm"
                        style={{ color: TEXT_DARK }}
                      >
                        {note.title}
                      </h5>
                      <span className="text-xs font-medium" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                        {note.pages} pages
                      </span>
                    </div>
                    <div style={{ color: theme.primary }}>
                      <Icon name="arrow" size={16} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div 
            className="p-4 border-t"
            style={{ 
              borderColor: `${theme.primary}15`,
              backgroundColor: `${theme.primary}05`
            }}
          >
            <div 
              className="flex items-center justify-between text-xs font-medium"
              style={{ color: "rgba(47, 51, 39, 0.5)" }}
            >
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
  theme: SubjectTheme;
}

function SeriesAccordion({ series, isExpanded, onToggle, theme }: SeriesAccordionProps) {
  return (
    <div 
      className="border rounded-xl overflow-hidden bg-white/50"
      style={{ borderColor: `${theme.primary}15` }}
    >
      {/* Series Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: theme.light }}
          >
            <Icon 
              name={series.name === "January" ? "snow" : series.name === "June" ? "sun" : "leaf"} 
              size={20} 
              color={theme.primary}
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

      {/* Dual-Action Document Buttons */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-3">
            {/* Question Paper with View + Download */}
            <div className="flex gap-2">
              <ViewButton type="QP" label="Question Paper" size={series.documents.QP?.size || "2.4 MB"} theme={theme} />
              <DownloadButton type="QP" label="QP" size={series.documents.QP?.size || "2.4 MB"} theme={theme} />
            </div>
            {/* Mark Scheme with View + Download */}
            <div className="flex gap-2">
              <ViewButton type="MS" label="Mark Scheme" size={series.documents.MS?.size || "1.8 MB"} theme={theme} />
              <DownloadButton type="MS" label="MS" size={series.documents.MS?.size || "1.8 MB"} theme={theme} />
            </div>
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
  theme: SubjectTheme;
}

// View Button - Outline style with Eye icon
function ViewButton({ type, label, size, theme }: DocumentButtonProps) {
  const iconName = type === "QP" ? "document-qp" : "document-ms";
  
  return (
    <button 
      className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-white border hover:shadow-sm transition-all duration-200 group"
      style={{ borderColor: `${theme.primary}30` }}
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-50 transition-colors duration-200"
      >
        <Icon name={iconName} size={24} color={theme.primary} />
      </div>
      <div className="text-left flex-1">
        <span className="font-semibold text-sm block" style={{ color: TEXT_DARK }}>{label}</span>
        <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>{size}</span>
      </div>
      <div 
        className="p-2 rounded-lg border group-hover:bg-gray-50 transition-all duration-200"
        style={{ borderColor: `${theme.primary}30` }}
      >
        <Icon name="eye" size={16} color={theme.primary} />
      </div>
    </button>
  );
}

// Download Button - Solid style with Download icon
function DownloadButton({ type, label, size, theme }: DocumentButtonProps) {
  return (
    <button 
      className="flex items-center justify-center p-3 rounded-lg text-white hover:shadow-md transition-all duration-200"
      style={{ backgroundColor: theme.primary }}
      title={`Download ${label}`}
    >
      <Icon name="download" size={20} color="white" />
    </button>
  );
}
