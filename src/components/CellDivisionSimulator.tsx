"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface CellDivisionSimulatorProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

const BIOLOGY_THEME = SUBJECT_THEMES.biology;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

type Phase = "interphase" | "prophase" | "metaphase" | "anaphase" | "telophase" | "cytokinesis";
type DivisionType = "mitosis" | "meiosis";

interface Chromosome {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  paired: boolean;
  split: boolean;
  color: string;
}

const PHASES: Phase[] = ["interphase", "prophase", "metaphase", "anaphase", "telophase", "cytokinesis"];

const PHASE_INFO: Record<Phase, { name: string; description: string; duration: string }> = {
  interphase: { 
    name: "Interphase", 
    description: "Cell grows, replicates DNA, and prepares for division. Chromosomes are thin and dispersed.",
    duration: "Longest phase (~90% of cycle)"
  },
  prophase: { 
    name: "Prophase", 
    description: "Chromosomes condense and become visible. Nuclear envelope begins to break down.",
    duration: "1-2 hours"
  },
  metaphase: { 
    name: "Metaphase", 
    description: "Chromosomes align at the cell's equator (metaphase plate). Spindle fibers attach.",
    duration: "20-30 minutes"
  },
  anaphase: { 
    name: "Anaphase", 
    description: "Sister chromatids separate and move to opposite poles of the cell.",
    duration: "2-3 minutes (shortest phase)"
  },
  telophase: { 
    name: "Telophase", 
    description: "Two new nuclei form. Chromosomes decondense. Cell prepares to divide.",
    duration: "1-2 hours"
  },
  cytokinesis: { 
    name: "Cytokinesis", 
    description: "Cytoplasm divides, forming two separate daughter cells.",
    duration: "1 hour"
  }
};

export default function CellDivisionSimulator({ 
  theme = BIOLOGY_THEME, 
  onClose, 
  isVisible 
}: CellDivisionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [divisionType, setDivisionType] = useState<DivisionType>("mitosis");
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [chromosomes, setChromosomes] = useState<Chromosome[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  const currentPhase = PHASES[currentPhaseIndex];

  // Initialize chromosomes
  useEffect(() => {
    const initialChromosomes: Chromosome[] = [];
    const colors = ["#0047AB", "#6A0DAD", "#2F4F4F", "#8B0000"];
    
    if (divisionType === "mitosis") {
      // 4 pairs of chromosomes for mitosis
      for (let i = 0; i < 4; i++) {
        initialChromosomes.push({
          id: i,
          x: 0,
          y: 0,
          rotation: Math.random() * Math.PI * 2,
          size: 30 + Math.random() * 20,
          paired: false,
          split: false,
          color: colors[i % colors.length]
        });
      }
    } else {
      // Meiosis has 2 rounds of division
      for (let i = 0; i < 4; i++) {
        initialChromosomes.push({
          id: i,
          x: 0,
          y: 0,
          rotation: Math.random() * Math.PI * 2,
          size: 30 + Math.random() * 20,
          paired: true,
          split: false,
          color: colors[i % colors.length]
        });
      }
    }
    setChromosomes(initialChromosomes);
    setCurrentPhaseIndex(0);
  }, [divisionType]);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;
    
    if (isPlaying) {
      const animate = () => {
        setCurrentPhaseIndex(prev => {
          if (prev >= PHASES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
        animationRef.current = window.setTimeout(() => {
          requestAnimationFrame(animate);
        }, 2000);
      };
      animationRef.current = window.setTimeout(() => {
        requestAnimationFrame(animate);
      }, 2000);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, isVisible]);

  // Draw the cell and chromosomes
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Draw cell membrane(s)
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.6;

    if (currentPhase === "cytokinesis" || (divisionType === "meiosis" && currentPhaseIndex >= 4)) {
      // Two cells forming
      ctx.beginPath();
      ctx.ellipse(centerX - 80, centerY, 90, 140, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(centerX + 80, centerY, 90, 140, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Single cell
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 160, 150, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw spindle fibers in metaphase/anaphase
    if (currentPhase === "metaphase" || currentPhase === "anaphase") {
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.setLineDash([5, 5]);
      
      const poles = [
        { x: centerX - 120, y: centerY },
        { x: centerX + 120, y: centerY }
      ];
      
      chromosomes.forEach(chrom => {
        const x = chrom.x + centerX;
        const y = chrom.y + centerY;
        
        poles.forEach(pole => {
          ctx.beginPath();
          ctx.moveTo(pole.x, pole.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        });
      });
      
      ctx.setLineDash([]);
    }

    // Draw nuclear envelope (breaks down in prophase, reforms in telophase)
    if (currentPhase !== "prophase" && currentPhase !== "metaphase" && currentPhase !== "anaphase") {
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      
      if (currentPhase === "cytokinesis") {
        ctx.beginPath();
        ctx.ellipse(centerX - 80, centerY, 70, 100, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(centerX + 80, centerY, 70, 100, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 120, 100, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }

    // Draw chromosomes
    ctx.globalAlpha = 1;
    
    chromosomes.forEach((chrom, index) => {
      // Calculate position based on phase
      let x = chrom.x;
      let y = chrom.y;
      let paired = chrom.paired;
      let split = chrom.split;
      
      switch (currentPhase) {
        case "interphase":
          // Scattered randomly in nucleus
          x = (Math.sin(index * 2 + chrom.rotation) * 80);
          y = (Math.cos(index * 2.5) * 60);
          paired = false;
          break;
        case "prophase":
          // Condensing - more compact
          x = (Math.sin(index * 2) * 40);
          y = (Math.cos(index * 2.5) * 40);
          paired = divisionType === "meiosis";
          break;
        case "metaphase":
          // Aligned at equator
          x = ((index - 1.5) * 40);
          y = 0;
          paired = divisionType === "meiosis";
          break;
        case "anaphase":
          // Moving to poles
          const direction = index % 2 === 0 ? -1 : 1;
          x = ((index - 1.5) * 40) + direction * 60;
          y = (index % 2 === 0 ? -10 : 10);
          split = true;
          paired = false;
          break;
        case "telophase":
          // At poles
          const pole = index < 2 ? -1 : 1;
          x = 80 * pole + ((index % 2 - 0.5) * 30);
          y = ((index % 2) * 40 - 20);
          split = true;
          paired = false;
          break;
        case "cytokinesis":
          // In separate cells
          const cellX = index < 2 ? -80 : 80;
          x = cellX + ((index % 2 - 0.5) * 40);
          y = ((index % 2) * 60 - 30);
          split = true;
          paired = false;
          break;
      }
      
      const posX = x + centerX;
      const posY = y + centerY;
      
      // Draw chromosome(s)
      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(chrom.rotation + (currentPhase === "prophase" ? 0 : index * 0.3));
      
      if (paired && !split) {
        // Draw homologous pair (for meiosis)
        drawChromosomeShape(ctx, -8, 0, chrom.size, chrom.color, false);
        drawChromosomeShape(ctx, 8, 0, chrom.size, chrom.color, false);
      } else if (split) {
        // Draw split chromatids
        drawChromosomeShape(ctx, -3, 0, chrom.size * 0.9, chrom.color, true);
        drawChromosomeShape(ctx, 3, 0, chrom.size * 0.9, chrom.color, true);
      } else {
        // Single chromosome
        drawChromosomeShape(ctx, 0, 0, chrom.size, chrom.color, false);
      }
      
      ctx.restore();
      
      // Draw label
      if (showLabels) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = TEXT_DARK;
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Chr ${chrom.id + 1}`, posX, posY + chrom.size + 15);
        ctx.globalAlpha = 1;
      }
    });

    // Phase label
    if (showLabels) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = theme.primary;
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(PHASE_INFO[currentPhase].name, centerX, 30);
      ctx.globalAlpha = 1;
    }
  }, [chromosomes, currentPhase, showLabels, theme.primary, divisionType, currentPhaseIndex]);

  // Redraw when state changes
  useEffect(() => {
    if (isVisible) {
      draw();
    }
  }, [draw, isVisible]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("cell-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhaseIndex(0);
  };
  const handleNext = () => {
    if (currentPhaseIndex < PHASES.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    }
  };
  const handlePrev = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1);
    }
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
      <div className="relative flex w-full h-full max-w-6xl mx-auto p-4 lg:p-8 animate-fade-in-scale">
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
                  <Icon name="microscope" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Cell Division
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Mitosis & Meiosis Simulator
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Division Type Selector */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Division Type
            </label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setDivisionType("mitosis")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                  divisionType === "mitosis" 
                    ? "text-white" 
                    : "bg-white"
                }`}
                style={{ 
                  backgroundColor: divisionType === "mitosis" ? theme.primary : "white",
                  borderColor: `${theme.primary}30`,
                  color: divisionType === "mitosis" ? "white" : TEXT_DARK
                }}
              >
                Mitosis
              </button>
              <button
                onClick={() => setDivisionType("meiosis")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                  divisionType === "meiosis" 
                    ? "text-white" 
                    : "bg-white"
                }`}
                style={{ 
                  backgroundColor: divisionType === "meiosis" ? theme.primary : "white",
                  borderColor: `${theme.primary}30`,
                  color: divisionType === "meiosis" ? "white" : TEXT_DARK
                }}
              >
                Meiosis
              </button>
            </div>
          </div>

          {/* Phase Info */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                Current Phase
              </span>
              <span className="text-xs" style={{ color: theme.primary }}>
                {currentPhaseIndex + 1} / {PHASES.length}
              </span>
            </div>
            <div 
              className="p-3 rounded-xl mb-3"
              style={{ backgroundColor: `${theme.primary}08`, border: `1px solid ${theme.primary}15` }}
            >
              <h3 className="font-semibold mb-1" style={{ color: theme.primary }}>
                {PHASE_INFO[currentPhase].name}
              </h3>
              <p className="text-xs mb-2" style={{ color: TEXT_DARK }}>
                {PHASE_INFO[currentPhase].description}
              </p>
              <span className="text-xs italic" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                Duration: {PHASE_INFO[currentPhase].duration}
              </span>
            </div>
            
            {/* Phase Progress */}
            <div className="flex gap-1">
              {PHASES.map((phase, index) => (
                <button
                  key={phase}
                  onClick={() => setCurrentPhaseIndex(index)}
                  className="flex-1 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: index <= currentPhaseIndex ? theme.primary : `${theme.primary}20`
                  }}
                  title={PHASE_INFO[phase].name}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={handlePrev}
                disabled={currentPhaseIndex === 0}
                className="p-2 rounded-lg border transition-all duration-200 disabled:opacity-30"
                style={{ borderColor: `${theme.primary}30` }}
              >
                <Icon name="chevron-left" size={20} color={theme.primary} />
              </button>
              <button
                onClick={handlePlay}
                className="col-span-2 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: theme.primary }}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={handleNext}
                disabled={currentPhaseIndex === PHASES.length - 1}
                className="p-2 rounded-lg border transition-all duration-200 disabled:opacity-30"
                style={{ borderColor: `${theme.primary}30` }}
              >
                <Icon name="chevron-right" size={20} color={theme.primary} />
              </button>
            </div>
            
            <button
              onClick={handleReset}
              className="w-full py-2 rounded-lg text-sm font-semibold border transition-all duration-200"
              style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
            >
              Reset Simulation
            </button>
            
            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded"
                style={{ accentColor: theme.primary }}
              />
              <span className="text-sm" style={{ color: TEXT_DARK }}>Show labels</span>
            </label>
          </div>

          {/* Key Differences */}
          <div className="flex-1 p-4 border-t overflow-y-auto" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Key Differences
            </h3>
            <div className="space-y-2 text-xs" style={{ color: TEXT_DARK }}>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(0, 71, 171, 0.05)" }}>
                <strong style={{ color: theme.primary }}>Mitosis:</strong> 1 division → 2 identical daughter cells (diploid)
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(0, 71, 171, 0.05)" }}>
                <strong style={{ color: theme.primary }}>Meiosis:</strong> 2 divisions → 4 genetically different cells (haploid)
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          id="cell-container"
          className="flex-1 rounded-2xl shadow-2xl overflow-hidden border relative flex items-center justify-center"
          style={{ 
            backgroundColor: BG_COLOR,
            borderColor: `${theme.primary}20`
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to draw chromosome shape
function drawChromosomeShape(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  size: number, 
  color: string,
  split: boolean
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  
  if (split) {
    // Draw V-shape (separated chromatids)
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.lineTo(x - size * 0.3, y - size * 0.5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.lineTo(x + size * 0.3, y - size * 0.5);
    ctx.stroke();
    
    // Centromere
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y + size * 0.3, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Draw X-shape (joined chromatids)
    ctx.beginPath();
    ctx.moveTo(x - size * 0.2, y - size * 0.5);
    ctx.quadraticCurveTo(x, y, x + size * 0.2, y + size * 0.5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + size * 0.2, y - size * 0.5);
    ctx.quadraticCurveTo(x, y, x - size * 0.2, y + size * 0.5);
    ctx.stroke();
    
    // Centromere
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
