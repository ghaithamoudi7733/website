"use client";

import React, { useState } from "react";
import Icon from "./Icons";
import { MATHEMATICS_MODULES, type MathModule, type YearData, getModuleNotes } from "@/data/mathematics";

interface MathematicsModuleGridProps {
  onModuleSelect: (module: MathModule) => void;
}

export default function MathematicsModuleGrid({ onModuleSelect }: MathematicsModuleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

function ModuleCard({ module, onSelect, index }: ModuleCardProps) {
  return (
    <button
      onClick={onSelect}
      className="group relative w-full text-left animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card Container */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-deep-olive/10 overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-deep-olive/5">
        {/* Faint Mathematical Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
          <Icon 
            name={module.watermark} 
            size={200} 
            className="text-deep-olive"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Module Code Badge */}
          <div className="mb-4">
            <span 
              className="text-4xl font-serif font-bold text-deep-olive tracking-tight"
              style={{ color: module.accentColor }}
            >
              {module.code}
            </span>
          </div>

          {/* Module Name */}
          <h3 className="font-sans font-semibold text-deep-olive mb-2 text-sm uppercase tracking-wider">
            {module.name}
          </h3>

          {/* Description */}
          <p className="text-deep-olive/60 text-sm mb-4 line-clamp-2">
            {module.description}
          </p>

          {/* Topic Count */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-deep-olive/40">
              {module.topics.length} topics
            </span>
            
            {/* Chevron Button */}
            <div className="w-10 h-10 rounded-full border border-deep-olive/20 flex items-center justify-center transition-all duration-300 group-hover:bg-deep-olive group-hover:border-deep-olive">
              <Icon 
                name="chevron-right" 
                size={20} 
                className="text-deep-olive/50 group-hover:text-cream transition-colors duration-300"
              />
            </div>
          </div>
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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

  if (!isOpen || !module) return null;

  const years = module.years;
  const notes = getModuleNotes(module.code);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-deep-olive/30 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-scale">
        {/* Modal Card */}
        <div className="bg-cream/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-deep-olive/10 overflow-hidden">
          
          {/* Header */}
          <div className="relative p-6 border-b border-deep-olive/10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span 
                    className="text-3xl font-serif font-bold"
                    style={{ color: module.accentColor }}
                  >
                    {module.code}
                  </span>
                  <span className="text-deep-olive/60 text-sm">|</span>
                  <span className="text-deep-olive/80 font-medium">{module.fullName}</span>
                </div>
                <p className="text-deep-olive/50 text-sm">
                  {module.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-deep-olive/5 transition-colors duration-200"
              >
                <Icon name="x-icon" size={24} className="text-deep-olive/60" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveTab("papers")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "papers"
                    ? "bg-deep-olive text-cream"
                    : "text-deep-olive/60 hover:text-deep-olive hover:bg-deep-olive/5"
                }`}
              >
                Past Papers
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "notes"
                    ? "bg-deep-olive text-cream"
                    : "text-deep-olive/60 hover:text-deep-olive hover:bg-deep-olive/5"
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
                  <h4 className="text-xs font-semibold text-deep-olive/50 uppercase tracking-wider mb-3">
                    Select Year
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {years.map((yearData) => (
                      <button
                        key={yearData.year}
                        onClick={() => setSelectedYear(yearData.year)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedYear === yearData.year
                            ? "bg-deep-olive text-white"
                            : "bg-white border border-deep-olive/20 text-deep-olive hover:border-deep-olive/40"
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
                    <h4 className="text-xs font-semibold text-deep-olive/50 uppercase tracking-wider mb-3">
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
                  <div className="text-center py-8 text-deep-olive/40">
                    <Icon name="file-text" size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Select a year to view available papers</p>
                  </div>
                )}
              </div>
            ) : (
              /* Notes Tab */
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <button
                    key={note.title}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-deep-olive/10 hover:border-deep-olive/20 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-deep-olive/5 flex items-center justify-center">
                      <Icon 
                        name="document-notes" 
                        size={24} 
                        className="text-deep-olive/40 group-hover:text-deep-olive transition-colors duration-200"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h5 className="font-medium text-deep-olive text-sm">
                        {note.title}
                      </h5>
                      <span className="text-xs text-deep-olive/40">
                        {note.pages} pages
                      </span>
                    </div>
                    <Icon 
                      name="arrow" 
                      size={16} 
                      className="text-deep-olive/20 group-hover:text-deep-olive/40 transition-colors duration-200"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-deep-olive/10 bg-deep-olive/[0.02]">
            <div className="flex items-center justify-between text-xs text-deep-olive/40">
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
    <div className="border border-deep-olive/10 rounded-xl overflow-hidden bg-white/50">
      {/* Series Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-deep-olive/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-deep-olive/5 flex items-center justify-center">
            <Icon 
              name={series.name === "January" ? "snow" : series.name === "June" ? "sun" : "leaf"} 
              size={20} 
              className="text-deep-olive/50"
            />
          </div>
          <div className="text-left">
            <span className="font-medium text-deep-olive text-sm">{series.name}</span>
            <span className="text-xs text-deep-olive/40 block">
              2 documents
            </span>
          </div>
        </div>
        <Icon 
          name="chevron-down" 
          size={16} 
          className={`text-deep-olive/40 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
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
    <button className="flex items-center gap-3 p-3 rounded-lg bg-white border border-deep-olive/10 hover:border-deep-olive/30 hover:shadow-sm transition-all duration-200 group">
      <div className="w-10 h-10 rounded-lg bg-deep-olive/5 flex items-center justify-center flex-shrink-0 group-hover:bg-deep-olive group-hover:text-cream transition-colors duration-200">
        <Icon 
          name={iconName} 
          size={24} 
          className="text-deep-olive/50 group-hover:text-cream transition-colors duration-200"
        />
      </div>
      <div className="text-left">
        <span className="font-medium text-deep-olive text-sm block">{type}</span>
        <span className="text-xs text-deep-olive/40">{size}</span>
      </div>
    </button>
  );
}
