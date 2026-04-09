"use client";

import React, { useState, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface GeneticsCalculatorProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

type ParentGenotype = "AA" | "Aa" | "aa";
type CrossType = "monohybrid" | "dihybrid";

interface PunnettResult {
  genotype: string;
  phenotype: string;
  probability: number;
  count: number;
}

const BIOLOGY_THEME = SUBJECT_THEMES.biology;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

const PUNNETT_COLORS: Record<string, string> = {
  "A": "#0047AB",  // Dominant - blue
  "a": "#74B9FF",  // Recessive - light blue
  "B": "#228B22",  // Second trait dominant - green
  "b": "#90EE90",  // Second trait recessive - light green
};

export default function GeneticsCalculator({ 
  theme = BIOLOGY_THEME, 
  onClose, 
  isVisible 
}: GeneticsCalculatorProps) {
  const [crossType, setCrossType] = useState<CrossType>("monohybrid");
  const [parent1, setParent1] = useState<ParentGenotype>("Aa");
  const [parent2, setParent2] = useState<ParentGenotype>("Aa");
  const [dihybridP1, setDihybridP1] = useState("AaBb");
  const [dihybridP2, setDihybridP2] = useState("AaBb");
  const [traitName, setTraitName] = useState("");
  const [dominantPhenotype, setDominantPhenotype] = useState("Dominant");
  const [recessivePhenotype, setRecessivePhenotype] = useState("Recessive");

  // Calculate monohybrid cross
  const calculateMonohybrid = useCallback((): PunnettResult[] => {
    const p1Alleles = parent1.split("");
    const p2Alleles = parent2.split("");
    
    const offspring: Record<string, { genotype: string; count: number }> = {};
    
    p1Alleles.forEach(a1 => {
      p2Alleles.forEach(a2 => {
        const genotype = [a1, a2].sort().join("");
        offspring[genotype] = {
          genotype,
          count: (offspring[genotype]?.count || 0) + 1
        };
      });
    });

    return Object.values(offspring).map(o => ({
      ...o,
      phenotype: o.genotype.includes("A") ? dominantPhenotype : recessivePhenotype,
      probability: (o.count / 4) * 100
    }));
  }, [parent1, parent2, dominantPhenotype, recessivePhenotype]);

  // Calculate dihybrid cross
  const calculateDihybrid = useCallback((): PunnettResult[] => {
    const p1Gametes = generateGametes(dihybridP1);
    const p2Gametes = generateGametes(dihybridP2);
    
    const offspring: Record<string, { genotype: string; count: number }> = {};
    
    p1Gametes.forEach(g1 => {
      p2Gametes.forEach(g2 => {
        const genotype = combineGenotypes(g1, g2);
        offspring[genotype] = {
          genotype,
          count: (offspring[genotype]?.count || 0) + 1
        };
      });
    });

    return Object.values(offspring).map(o => ({
      ...o,
      phenotype: getDihybridPhenotype(o.genotype),
      probability: (o.count / 16) * 100
    }));
  }, [dihybridP1, dihybridP2]);

  const generateGametes = (genotype: string): string[] => {
    if (genotype.length !== 4) return [];
    const pairs = [
      [genotype[0], genotype[2]],
      [genotype[0], genotype[3]],
      [genotype[1], genotype[2]],
      [genotype[1], genotype[3]]
    ];
    return pairs.map(p => p.join(""));
  };

  const combineGenotypes = (g1: string, g2: string): string => {
    const a = [g1[0], g2[0]].sort().join("");
    const b = [g1[1], g2[1]].sort().join("");
    return a + b;
  };

  const getDihybridPhenotype = (genotype: string): string => {
    const hasA = genotype.includes("A");
    const hasB = genotype.includes("B");
    const parts = [];
    if (hasA) parts.push("A-");
    else parts.push("aa");
    if (hasB) parts.push("B-");
    else parts.push("bb");
    return parts.join(" ");
  };

  const results = crossType === "monohybrid" ? calculateMonohybrid() : calculateDihybrid();
  const totalCombinations = crossType === "monohybrid" ? 4 : 16;

  // Generate Punnett square grid
  const getPunnettGrid = () => {
    if (crossType === "monohybrid") {
      const p1Alleles = parent1.split("");
      const p2Alleles = parent2.split("");
      
      return {
        headers: { row: p1Alleles, col: p2Alleles },
        grid: p1Alleles.map(a1 => 
          p2Alleles.map(a2 => [a1, a2].sort().join(""))
        )
      };
    } else {
      const p1Gametes = generateGametes(dihybridP1);
      const p2Gametes = generateGametes(dihybridP2);
      
      return {
        headers: { row: p1Gametes, col: p2Gametes },
        grid: p1Gametes.map(g1 => 
          p2Gametes.map(g2 => combineGenotypes(g1, g2))
        )
      };
    }
  };

  const punnett = getPunnettGrid();

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex animate-fade-in"
      style={{ backgroundColor: "rgba(26, 28, 22, 0.5)" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative flex w-full h-full max-w-6xl mx-auto p-4 lg:p-8 animate-fade-in-scale">
        {/* Sidebar Controls */}
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
                  <Icon name="dna" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Genetics Calculator
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Punnett square & probability
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Cross Type */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Cross Type
            </label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setCrossType("monohybrid")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                  crossType === "monohybrid" ? "text-white" : "bg-white"
                }`}
                style={{ 
                  backgroundColor: crossType === "monohybrid" ? theme.primary : "white",
                  borderColor: `${theme.primary}30`,
                  color: crossType === "monohybrid" ? "white" : TEXT_DARK
                }}
              >
                Monohybrid
              </button>
              <button
                onClick={() => setCrossType("dihybrid")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                  crossType === "dihybrid" ? "text-white" : "bg-white"
                }`}
                style={{ 
                  backgroundColor: crossType === "dihybrid" ? theme.primary : "white",
                  borderColor: `${theme.primary}30`,
                  color: crossType === "dihybrid" ? "white" : TEXT_DARK
                }}
              >
                Dihybrid
              </button>
            </div>
          </div>

          {/* Parent Genotypes */}
          <div className="p-4 border-b space-y-4" style={{ borderColor: `${theme.primary}10` }}>
            {crossType === "monohybrid" ? (
              <>
                <div>
                  <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Parent 1 Genotype
                  </label>
                  <select
                    value={parent1}
                    onChange={(e) => setParent1(e.target.value as ParentGenotype)}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm border"
                    style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
                  >
                    <option value="AA">AA (homozygous dominant)</option>
                    <option value="Aa">Aa (heterozygous)</option>
                    <option value="aa">aa (homozygous recessive)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Parent 2 Genotype
                  </label>
                  <select
                    value={parent2}
                    onChange={(e) => setParent2(e.target.value as ParentGenotype)}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm border"
                    style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
                  >
                    <option value="AA">AA (homozygous dominant)</option>
                    <option value="Aa">Aa (heterozygous)</option>
                    <option value="aa">aa (homozygous recessive)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Parent 1 (e.g., AaBb)
                  </label>
                  <input
                    type="text"
                    value={dihybridP1}
                    onChange={(e) => setDihybridP1(e.target.value.toUpperCase().slice(0, 4))}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm border font-mono"
                    style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
                  />
                </div>
                <div>
                  <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Parent 2 (e.g., AaBb)
                  </label>
                  <input
                    type="text"
                    value={dihybridP2}
                    onChange={(e) => setDihybridP2(e.target.value.toUpperCase().slice(0, 4))}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm border font-mono"
                    style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Phenotype Labels */}
          <div className="p-4 border-b space-y-3" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Phenotype Labels
            </h3>
            <div>
              <input
                type="text"
                value={dominantPhenotype}
                onChange={(e) => setDominantPhenotype(e.target.value)}
                placeholder="Dominant phenotype"
                className="w-full px-3 py-2 rounded-lg text-sm border"
                style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
              />
            </div>
            <div>
              <input
                type="text"
                value={recessivePhenotype}
                onChange={(e) => setRecessivePhenotype(e.target.value)}
                placeholder="Recessive phenotype"
                className="w-full px-3 py-2 rounded-lg text-sm border"
                style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Offspring Summary
            </h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-xl border"
                  style={{ borderColor: `${theme.primary}20`, backgroundColor: `${theme.primary}05` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold" style={{ color: theme.primary }}>
                      {result.genotype}
                    </span>
                    <span className="text-sm font-bold" style={{ color: TEXT_DARK }}>
                      {result.probability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                    {result.phenotype}
                  </div>
                  <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.primary}10` }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.probability}%`, backgroundColor: theme.primary }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Area - Punnett Square */}
        <div 
          className="flex-1 rounded-2xl shadow-2xl overflow-hidden border flex flex-col"
          style={{ 
            backgroundColor: BG_COLOR,
            borderColor: `${theme.primary}20`
          }}
        >
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              {/* Punnett Square */}
              <div className="grid" style={{ gridTemplateColumns: `auto repeat(${punnett.headers.col.length}, 1fr)` }}>
                {/* Top-left corner */}
                <div className="w-12 h-12" />
                
                {/* Column headers (Parent 2 gametes) */}
                {punnett.headers.col.map((allele, i) => (
                  <div 
                    key={i}
                    className="w-16 h-12 flex items-center justify-center font-mono font-bold text-lg"
                    style={{ color: theme.primary }}
                  >
                    {allele}
                  </div>
                ))}
                
                {/* Grid rows */}
                {punnett.grid.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {/* Row header */}
                    <div 
                      className="w-12 h-16 flex items-center justify-center font-mono font-bold text-lg"
                      style={{ color: theme.primary }}
                    >
                      {punnett.headers.row[rowIndex]}
                    </div>
                    
                    {/* Grid cells */}
                    {row.map((genotype, colIndex) => (
                      <div 
                        key={colIndex}
                        className="w-16 h-16 flex items-center justify-center border-2 rounded-lg m-1 font-mono font-bold"
                        style={{ 
                          borderColor: `${theme.primary}30`,
                          backgroundColor: `${theme.primary}08`,
                          color: theme.primary
                        }}
                      >
                        {genotype}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: PUNNETT_COLORS["A"] }}
                  />
                  <span style={{ color: TEXT_DARK }}>Dominant allele (A)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: PUNNETT_COLORS["a"] }}
                  />
                  <span style={{ color: TEXT_DARK }}>Recessive allele (a)</span>
                </div>
              </div>
              
              {/* Parent labels */}
              <div className="mt-4 flex justify-between text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                <span>Parent 1 (Gametes: {punnett.headers.row.join(", ")})</span>
                <span>Parent 2 (Gametes: {punnett.headers.col.join(", ")})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
