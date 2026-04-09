"use client";

import React, { useState } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface PeriodicTableExplorerProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

interface Element {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: "alkali-metal" | "alkaline-earth" | "transition" | "metalloid" | "nonmetal" | "halogen" | "noble-gas" | "lanthanide" | "actinide";
  electronConfig: string;
  electronegativity: number | null;
  group: number;
  period: number;
  description: string;
}

const CHEMISTRY_THEME = SUBJECT_THEMES.chemistry;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

const ELEMENTS: Element[] = [
  { number: 1, symbol: "H", name: "Hydrogen", mass: 1.008, category: "nonmetal", electronConfig: "1s¹", electronegativity: 2.20, group: 1, period: 1, description: "The lightest and most abundant element in the universe. Essential for water and organic compounds." },
  { number: 2, symbol: "He", name: "Helium", mass: 4.003, category: "noble-gas", electronConfig: "1s²", electronegativity: null, group: 18, period: 1, description: "A colorless, odorless, tasteless noble gas. Used in balloons and as a cooling medium." },
  { number: 3, symbol: "Li", name: "Lithium", mass: 6.941, category: "alkali-metal", electronConfig: "[He] 2s¹", electronegativity: 0.98, group: 1, period: 2, description: "Soft, silvery-white alkali metal. Used in rechargeable batteries and psychiatric medications." },
  { number: 4, symbol: "Be", name: "Beryllium", mass: 9.012, category: "alkaline-earth", electronConfig: "[He] 2s²", electronegativity: 1.57, group: 2, period: 2, description: "Steel-gray, strong, lightweight metal. Used in aerospace applications and X-ray windows." },
  { number: 5, symbol: "B", name: "Boron", mass: 10.811, category: "metalloid", electronConfig: "[He] 2s² 2p¹", electronegativity: 2.04, group: 13, period: 2, description: "A metalloid essential for plant growth. Used in borosilicate glass and cleaning products." },
  { number: 6, symbol: "C", name: "Carbon", mass: 12.011, category: "nonmetal", electronConfig: "[He] 2s² 2p²", electronegativity: 2.55, group: 14, period: 2, description: "The basis of organic chemistry. Exists as diamond, graphite, and amorphous forms." },
  { number: 7, symbol: "N", name: "Nitrogen", mass: 14.007, category: "nonmetal", electronConfig: "[He] 2s² 2p³", electronegativity: 3.04, group: 15, period: 2, description: "Makes up 78% of Earth's atmosphere. Essential for proteins and DNA." },
  { number: 8, symbol: "O", name: "Oxygen", mass: 15.999, category: "nonmetal", electronConfig: "[He] 2s² 2p⁴", electronegativity: 3.44, group: 16, period: 2, description: "Essential for respiration and combustion. Makes up 21% of Earth's atmosphere." },
  { number: 9, symbol: "F", name: "Fluorine", mass: 18.998, category: "halogen", electronConfig: "[He] 2s² 2p⁵", electronegativity: 3.98, group: 17, period: 2, description: "The most electronegative and reactive element. Used in toothpaste and refrigerants." },
  { number: 10, symbol: "Ne", name: "Neon", mass: 20.180, category: "noble-gas", electronConfig: "[He] 2s² 2p⁶", electronegativity: null, group: 18, period: 2, description: "Colorless noble gas that produces reddish-orange light in discharge tubes." },
  { number: 11, symbol: "Na", name: "Sodium", mass: 22.990, category: "alkali-metal", electronConfig: "[Ne] 3s¹", electronegativity: 0.93, group: 1, period: 3, description: "Soft, silvery-white alkali metal. Essential for nerve function and found in table salt." },
  { number: 12, symbol: "Mg", name: "Magnesium", mass: 24.305, category: "alkaline-earth", electronConfig: "[Ne] 3s²", electronegativity: 1.31, group: 2, period: 3, description: "Light, silvery-white metal. Used in alloys and essential for chlorophyll and bones." },
  { number: 13, symbol: "Al", name: "Aluminum", mass: 26.982, category: "metalloid", electronConfig: "[Ne] 3s² 3p¹", electronegativity: 1.61, group: 13, period: 3, description: "Lightweight, corrosion-resistant metal. Most abundant metal in Earth's crust." },
  { number: 14, symbol: "Si", name: "Silicon", mass: 28.086, category: "metalloid", electronConfig: "[Ne] 3s² 3p²", electronegativity: 1.90, group: 14, period: 3, description: "A semiconductor metalloid. Essential for computer chips and glass production." },
  { number: 15, symbol: "P", name: "Phosphorus", mass: 30.974, category: "nonmetal", electronConfig: "[Ne] 3s² 3p³", electronegativity: 2.19, group: 15, period: 3, description: "Essential for DNA, ATP, and bones. Exists as white, red, and black allotropes." },
  { number: 16, symbol: "S", name: "Sulfur", mass: 32.065, category: "nonmetal", electronConfig: "[Ne] 3s² 3p⁴", electronegativity: 2.58, group: 16, period: 3, description: "Yellow, brittle nonmetal. Used in fertilizers, gunpowder, and rubber vulcanization." },
  { number: 17, symbol: "Cl", name: "Chlorine", mass: 35.453, category: "halogen", electronConfig: "[Ne] 3s² 3p⁵", electronegativity: 3.16, group: 17, period: 3, description: "Greenish-yellow gas. Used for water disinfection and in PVC production." },
  { number: 18, symbol: "Ar", name: "Argon", mass: 39.948, category: "noble-gas", electronConfig: "[Ne] 3s² 3p⁶", electronegativity: null, group: 18, period: 3, description: "Colorless, odorless noble gas. Used in welding and incandescent light bulbs." },
  { number: 19, symbol: "K", name: "Potassium", mass: 39.098, category: "alkali-metal", electronConfig: "[Ar] 4s¹", electronegativity: 0.82, group: 1, period: 4, description: "Soft, silvery-white alkali metal. Essential for nerve function and plant growth." },
  { number: 20, symbol: "Ca", name: "Calcium", mass: 40.078, category: "alkaline-earth", electronConfig: "[Ar] 4s²", electronegativity: 1.00, group: 2, period: 4, description: "Essential for bones, teeth, and muscle function. Fifth most abundant element in Earth's crust." },
  // Transition metals sample
  { number: 26, symbol: "Fe", name: "Iron", mass: 55.845, category: "transition", electronConfig: "[Ar] 3d⁶ 4s²", electronegativity: 1.83, group: 8, period: 4, description: "Most common element on Earth by mass. Essential for blood and steel production." },
  { number: 29, symbol: "Cu", name: "Copper", mass: 63.546, category: "transition", electronConfig: "[Ar] 3d¹⁰ 4s¹", electronegativity: 1.90, group: 11, period: 4, description: "Excellent conductor of heat and electricity. Used in wiring and coins." },
  { number: 30, symbol: "Zn", name: "Zinc", mass: 65.380, category: "transition", electronConfig: "[Ar] 3d¹⁰ 4s²", electronegativity: 1.65, group: 12, period: 4, description: "Used in galvanizing steel and in alloys like brass. Essential for immune function." },
  { number: 47, symbol: "Ag", name: "Silver", mass: 107.868, category: "transition", electronConfig: "[Kr] 4d¹⁰ 5s¹", electronegativity: 1.93, group: 11, period: 5, description: "Highest electrical and thermal conductivity of all metals. Used in jewelry and electronics." },
  { number: 79, symbol: "Au", name: "Gold", mass: 196.967, category: "transition", electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", electronegativity: 2.54, group: 11, period: 6, description: "Highly unreactive precious metal. Used in jewelry, electronics, and as a monetary standard." },
  { number: 80, symbol: "Hg", name: "Mercury", mass: 200.590, category: "transition", electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", electronegativity: 2.00, group: 12, period: 6, description: "Only metal that is liquid at room temperature. Used in thermometers and fluorescent lamps." },
  { number: 82, symbol: "Pb", name: "Lead", mass: 207.200, category: "metalloid", electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", electronegativity: 2.33, group: 14, period: 6, description: "Soft, malleable metal. Once used in pipes and paint, now mainly in batteries." },
  { number: 92, symbol: "U", name: "Uranium", mass: 238.029, category: "actinide", electronConfig: "[Rn] 5f³ 6d¹ 7s²", electronegativity: 1.38, group: 3, period: 7, description: "Heavy metal used as nuclear fuel. Radioactive with a very long half-life." },
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "alkali-metal": { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  "alkaline-earth": { bg: "#FFD93D20", border: "#FFD93D", text: "#B8860B" },
  "transition": { bg: "#FF9F4320", border: "#FF9F43", text: "#D2691E" },
  "metalloid": { bg: "#A8E6CF20", border: "#A8E6CF", text: "#2E8B57" },
  "nonmetal": { bg: "#74B9FF20", border: "#74B9FF", text: "#0047AB" },
  "halogen": { bg: "#DDA0DD20", border: "#DDA0DD", text: "#8B008B" },
  "noble-gas": { bg: "#BDC3C720", border: "#BDC3C7", text: "#2C3E50" },
  "lanthanide": { bg: "#FF69B420", border: "#FF69B4", text: "#C71585" },
  "actinide": { bg: "#F39C1220", border: "#F39C12", text: "#D35400" },
};

const CATEGORY_NAMES: Record<string, string> = {
  "alkali-metal": "Alkali Metals",
  "alkaline-earth": "Alkaline Earth",
  "transition": "Transition Metals",
  "metalloid": "Metalloids",
  "nonmetal": "Nonmetals",
  "halogen": "Halogens",
  "noble-gas": "Noble Gases",
  "lanthanide": "Lanthanides",
  "actinide": "Actinides",
};

export default function PeriodicTableExplorer({ 
  theme = CHEMISTRY_THEME, 
  onClose, 
  isVisible 
}: PeriodicTableExplorerProps) {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredElements = ELEMENTS.filter(el => {
    if (filter && el.category !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return el.name.toLowerCase().includes(s) || 
             el.symbol.toLowerCase().includes(s) ||
             el.number.toString().includes(s);
    }
    return true;
  });

  const getElementPosition = (element: Element) => {
    // Simplified periodic table positioning
    const row = element.period;
    let col = element.group;
    
    // Adjust for first period
    if (row === 1) {
      if (element.number === 1) return { row: 1, col: 1 };
      if (element.number === 2) return { row: 1, col: 18 };
    }
    
    // Adjust for periods 2-3
    if (row === 2 || row === 3) {
      if (element.group >= 13) col = element.group; // Keep position
    }
    
    // Handle transition metals (simplified)
    if (row >= 4 && element.category === "transition") {
      // Simplified: place in transition area
      col = element.group;
    }
    
    return { row, col };
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex animate-fade-in"
      style={{ backgroundColor: "rgba(26, 28, 22, 0.5)" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative flex w-full h-full max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in-scale">
        {/* Sidebar */}
        <div 
          className="w-80 flex-shrink-0 flex flex-col rounded-2xl shadow-2xl overflow-hidden border mr-4"
          style={{ 
            backgroundColor: "rgba(253, 251, 247, 0.98)",
            borderColor: `${theme.primary}20`,
            backdropFilter: "blur(20px)"
          }}
        >
          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}15` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: theme.light }}
                >
                  <Icon name="flask-conical" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Periodic Table
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Interactive element explorer
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <div className="relative">
              <Icon name="search" size={16} color="#999" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search elements..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm border focus:outline-none"
                style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                  filter === null ? "bg-[#6A0DAD] text-white" : ""
                }`}
                style={{ 
                  borderColor: filter === null ? "#6A0DAD" : `${theme.primary}30`,
                  color: filter === null ? "white" : TEXT_DARK
                }}
              >
                All
              </button>
              {Object.entries(CATEGORY_NAMES).slice(0, 7).map(([cat, name]) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200`}
                  style={{ 
                    borderColor: filter === cat ? CATEGORY_COLORS[cat].border : `${theme.primary}30`,
                    backgroundColor: filter === cat ? CATEGORY_COLORS[cat].bg : "white",
                    color: filter === cat ? CATEGORY_COLORS[cat].text : TEXT_DARK
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Element Details */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedElement ? (
              <div className="animate-fade-in">
                <div 
                  className="p-6 rounded-xl border-2 mb-4 text-center"
                  style={{ 
                    borderColor: CATEGORY_COLORS[selectedElement.category]?.border || theme.primary,
                    backgroundColor: CATEGORY_COLORS[selectedElement.category]?.bg || `${theme.primary}10`
                  }}
                >
                  <span 
                    className="text-sm font-bold block mb-1"
                    style={{ color: CATEGORY_COLORS[selectedElement.category]?.text }}
                  >
                    {selectedElement.number}
                  </span>
                  <span 
                    className="text-4xl font-serif font-bold block mb-1"
                    style={{ color: TEXT_DARK }}
                  >
                    {selectedElement.symbol}
                  </span>
                  <span className="text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    {selectedElement.name}
                  </span>
                  <span className="text-sm block mt-1" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                    {selectedElement.mass.toFixed(3)} u
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                    <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Category</span>
                    <div className="text-sm font-semibold" style={{ color: theme.primary }}>
                      {CATEGORY_NAMES[selectedElement.category]}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                    <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Electron Configuration</span>
                    <div className="text-sm font-mono font-semibold" style={{ color: TEXT_DARK }}>
                      {selectedElement.electronConfig}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                    <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Electronegativity</span>
                    <div className="text-sm font-semibold" style={{ color: TEXT_DARK }}>
                      {selectedElement.electronegativity?.toFixed(2) || "N/A"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                    <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Description</span>
                    <p className="text-sm mt-1" style={{ color: TEXT_DARK }}>
                      {selectedElement.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: "rgba(47, 51, 39, 0.4)" }}>
                <Icon name="flask-conical" size={48} color={theme.primary} />
                <p className="mt-4 text-sm">Select an element to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Periodic Table Grid */}
        <div 
          className="flex-1 rounded-2xl shadow-2xl overflow-hidden border p-4 overflow-auto"
          style={{ 
            backgroundColor: BG_COLOR,
            borderColor: `${theme.primary}20`
          }}
        >
          {/* Simplified Periodic Table Layout */}
          <div className="min-w-max">
            {/* Period 1 */}
            <div className="flex gap-1 mb-1">
              <ElementCard element={ELEMENTS[0]} onClick={() => setSelectedElement(ELEMENTS[0])} selected={selectedElement?.symbol === "H"} />
              <div className="w-[17rem]" /> {/* Spacer */}
              <ElementCard element={ELEMENTS[1]} onClick={() => setSelectedElement(ELEMENTS[1])} selected={selectedElement?.symbol === "He"} />
            </div>

            {/* Period 2 */}
            <div className="flex gap-1 mb-1">
              {ELEMENTS.slice(2, 4).map(el => (
                <ElementCard key={el.symbol} element={el} onClick={() => setSelectedElement(el)} selected={selectedElement?.symbol === el.symbol} />
              ))}
              <div className="w-[14rem]" />
              {ELEMENTS.slice(4, 10).map(el => (
                <ElementCard key={el.symbol} element={el} onClick={() => setSelectedElement(el)} selected={selectedElement?.symbol === el.symbol} />
              ))}
            </div>

            {/* Period 3 */}
            <div className="flex gap-1 mb-1">
              {ELEMENTS.slice(10, 12).map(el => (
                <ElementCard key={el.symbol} element={el} onClick={() => setSelectedElement(el)} selected={selectedElement?.symbol === el.symbol} />
              ))}
              <div className="w-[14rem]" />
              {ELEMENTS.slice(12, 18).map(el => (
                <ElementCard key={el.symbol} element={el} onClick={() => setSelectedElement(el)} selected={selectedElement?.symbol === el.symbol} />
              ))}
            </div>

            {/* Period 4 - Sample transition metals */}
            <div className="flex gap-1 mb-1">
              {ELEMENTS.slice(18, 20).map(el => (
                <ElementCard key={el.symbol} element={el} onClick={() => setSelectedElement(el)} selected={selectedElement?.symbol === el.symbol} />
              ))}
              <div className="flex gap-1">
                {ELEMENTS.filter(e => e.category === "transition").slice(0, 6).map(el => (
                  <ElementCard key={el.symbol} element={el} onClick={() => setSelectedElement(el)} selected={selectedElement?.symbol === el.symbol} />
                ))}
              </div>
            </div>

            {/* Lanthanides & Actinides Label */}
            <div className="mt-4 flex gap-1">
              <div className="w-32" />
              <div 
                className="px-4 py-2 rounded-lg text-xs font-semibold text-center"
                style={{ backgroundColor: "#FF69B420", color: "#C71585" }}
              >
                Lanthanides 57-71
              </div>
              <div 
                className="px-4 py-2 rounded-lg text-xs font-semibold text-center"
                style={{ backgroundColor: "#F39C1220", color: "#D35400" }}
              >
                Actinides 89-103
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
            {Object.entries(CATEGORY_NAMES).slice(0, 7).map(([cat, name]) => (
              <div key={cat} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ 
                    backgroundColor: CATEGORY_COLORS[cat].bg,
                    border: `1px solid ${CATEGORY_COLORS[cat].border}`
                  }}
                />
                <span style={{ color: TEXT_DARK }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Element Card Component
function ElementCard({ 
  element, 
  onClick, 
  selected 
}: { 
  element: Element; 
  onClick: () => void; 
  selected: boolean;
}) {
  const colors = CATEGORY_COLORS[element.category] || CATEGORY_COLORS["nonmetal"];
  
  return (
    <button
      onClick={onClick}
      className={`w-14 h-16 rounded-lg border-2 flex flex-col items-center justify-center p-1 transition-all duration-200 hover:scale-105 ${
        selected ? "ring-2 ring-offset-1" : ""
      }`}
      style={{ 
        borderColor: colors.border,
        backgroundColor: colors.bg,
        ["--tw-ring-color"]: colors.border
      } as React.CSSProperties}
    >
      <span className="text-xs font-bold" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
        {element.number}
      </span>
      <span className="text-base font-bold font-serif" style={{ color: colors.text }}>
        {element.symbol}
      </span>
    </button>
  );
}
