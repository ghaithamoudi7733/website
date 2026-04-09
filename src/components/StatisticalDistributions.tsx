"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface StatisticalDistributionsProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

interface DistributionParams {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
}

interface DataPoint {
  x: number;
  probability: number;
}

const MATH_THEME = SUBJECT_THEMES.mathematics;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

// Calculate normal distribution probability density
const normalPDF = (x: number, mean: number, stdDev: number): number => {
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

// Calculate cumulative distribution function
const normalCDF = (x: number, mean: number, stdDev: number): number => {
  const z = (x - mean) / stdDev;
  // Approximation of error function
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z) / Math.sqrt(2);
  
  const t = 1 / (1 + p * absZ);
  const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);
  
  return 0.5 * (1 + sign * erf);
};

// Calculate area between two z-scores
const areaBetween = (z1: number, z2: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const erf = (z: number): number => {
    const sign = z < 0 ? -1 : 1;
    const absZ = Math.abs(z) / Math.sqrt(2);
    const t = 1 / (1 + p * absZ);
    return sign * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ));
  };
  
  return 0.5 * (erf(z2 / Math.sqrt(2)) - erf(z1 / Math.sqrt(2)));
};

export default function StatisticalDistributions({ 
  theme = MATH_THEME, 
  onClose, 
  isVisible 
}: StatisticalDistributionsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<DistributionParams>({
    mean: 0,
    stdDev: 1,
    min: -4,
    max: 4
  });
  const [hoverPoint, setHoverPoint] = useState<DataPoint | null>(null);
  const [zScores, setZScores] = useState<{ a: number; b: number }>({ a: -1, b: 1 });
  const [showArea, setShowArea] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  // Generate distribution data
  const generateData = useCallback((): DataPoint[] => {
    const points: DataPoint[] = [];
    const step = (params.max - params.min) / 200;
    for (let i = 0; i <= 200; i++) {
      const x = params.min + i * step;
      points.push({
        x,
        probability: normalPDF(x, params.mean, params.stdDev)
      });
    }
    return points;
  }, [params]);

  // Draw the distribution
  const drawDistribution = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const data = generateData();

    // Clear canvas
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Calculate scales
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const xScale = graphWidth / (params.max - params.min);
    const maxProb = Math.max(...data.map(d => d.probability));
    const yScale = graphHeight / (maxProb * 1.2);

    const toCanvasX = (x: number) => padding.left + (x - params.min) * xScale;
    const toCanvasY = (y: number) => padding.top + graphHeight - y * yScale;

    // Draw grid
    ctx.strokeStyle = "#3B3F30";
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = Math.ceil(params.min); x <= Math.floor(params.max); x++) {
      if (x === 0) continue;
      const canvasX = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(canvasX, padding.top);
      ctx.lineTo(canvasX, height - padding.bottom);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = (maxProb * 1.2 * i) / 4;
      const canvasY = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(padding.left, canvasY);
      ctx.lineTo(width - padding.right, canvasY);
      ctx.stroke();
    }

    // Draw shaded area if enabled
    if (showArea) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = theme.primary;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(Math.max(zScores.a, params.min)), toCanvasY(0));
      
      for (let x = Math.max(zScores.a, params.min); x <= Math.min(zScores.b, params.max); x += 0.05) {
        const prob = normalPDF(x, params.mean, params.stdDev);
        ctx.lineTo(toCanvasX(x), toCanvasY(prob));
      }
      
      ctx.lineTo(toCanvasX(Math.min(zScores.b, params.max)), toCanvasY(0));
      ctx.closePath();
      ctx.fill();

      // Draw vertical lines for z-scores
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      [zScores.a, zScores.b].forEach(z => {
        if (z >= params.min && z <= params.max) {
          ctx.beginPath();
          ctx.moveTo(toCanvasX(z), padding.top);
          ctx.lineTo(toCanvasX(z), height - padding.bottom);
          ctx.stroke();
        }
      });
      
      ctx.setLineDash([]);
    }

    // Draw axes
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = "#3B3F30";
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, toCanvasY(0));
    ctx.lineTo(width - padding.right, toCanvasY(0));
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding.top);
    ctx.lineTo(toCanvasX(0), height - padding.bottom);
    ctx.stroke();

    // Draw distribution curve
    ctx.globalAlpha = 1;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let firstPoint = true;
    data.forEach(point => {
      const canvasX = toCanvasX(point.x);
      const canvasY = toCanvasY(point.probability);

      if (firstPoint) {
        ctx.moveTo(canvasX, canvasY);
        firstPoint = false;
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    });
    ctx.stroke();

    // Fill under curve
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = theme.primary;
    ctx.lineTo(toCanvasX(params.max), toCanvasY(0));
    ctx.lineTo(toCanvasX(params.min), toCanvasY(0));
    ctx.closePath();
    ctx.fill();

    // Draw axis labels
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#3B3F30";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";

    // X-axis labels
    for (let x = Math.ceil(params.min); x <= Math.floor(params.max); x++) {
      if (x === 0) continue;
      const canvasX = toCanvasX(x);
      const canvasY = toCanvasY(0);
      ctx.fillText(x.toString(), canvasX, canvasY + 20);
    }

    // X-axis title
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("z-score (standard deviations)", width / 2, height - 15);

    // Y-axis labels
    ctx.textAlign = "right";
    ctx.font = "12px Inter, sans-serif";
    for (let i = 0; i <= 4; i++) {
      const y = (maxProb * 1.2 * i) / 4;
      const canvasY = toCanvasY(y);
      ctx.fillText(y.toFixed(2), padding.left - 10, canvasY + 4);
    }

    // Origin label
    ctx.textAlign = "center";
    ctx.fillText("0", toCanvasX(0), toCanvasY(0) + 20);

    // Mean marker
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(toCanvasX(params.mean), padding.top);
    ctx.lineTo(toCanvasX(params.mean), height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mean label
    ctx.fillStyle = theme.primary;
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("μ", toCanvasX(params.mean), padding.top - 10);
  }, [params, theme, zScores, showArea, canvasSize]);

  // Redraw on changes
  useEffect(() => {
    if (isVisible) {
      drawDistribution();
    }
  }, [drawDistribution, isVisible]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("stats-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: 400 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible]);

  // Handle mouse move for hover
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const graphWidth = canvas.width - padding.left - padding.right;
    const xScale = graphWidth / (params.max - params.min);

    const x = (e.clientX - rect.left - padding.left) / xScale + params.min;
    if (x >= params.min && x <= params.max) {
      const prob = normalPDF(x, params.mean, params.stdDev);
      setHoverPoint({ x, probability: prob });
    } else {
      setHoverPoint(null);
    }
  };

  // Calculate probability for area
  const area = areaBetween(
    (zScores.a - params.mean) / params.stdDev,
    (zScores.b - params.mean) / params.stdDev
  );

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
                  <Icon name="bell-curve" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Normal Distribution
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Probability & statistics
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Parameters */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Parameters
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                  Mean (μ)
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={params.mean}
                  onChange={(e) => setParams({ ...params, mean: parseFloat(e.target.value) })}
                  className="w-full mt-1"
                />
                <div className="text-sm font-mono text-center" style={{ color: theme.primary }}>
                  {params.mean.toFixed(1)}
                </div>
              </div>
              <div>
                <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                  Std Dev (σ)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={params.stdDev}
                  onChange={(e) => setParams({ ...params, stdDev: parseFloat(e.target.value) })}
                  className="w-full mt-1"
                />
                <div className="text-sm font-mono text-center" style={{ color: theme.primary }}>
                  {params.stdDev.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Z-Score Area Calculator */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="showArea"
                checked={showArea}
                onChange={(e) => setShowArea(e.target.checked)}
                className="rounded"
                style={{ accentColor: theme.primary }}
              />
              <label htmlFor="showArea" className="text-sm font-semibold" style={{ color: TEXT_DARK }}>
                Show Area Between Z-Scores
              </label>
            </div>
            
            {showArea && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                      Z₁ (lower)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={zScores.a}
                      onChange={(e) => setZScores({ ...zScores, a: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 mt-1 rounded-lg text-sm font-mono border focus:outline-none"
                      style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                      Z₂ (upper)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={zScores.b}
                      onChange={(e) => setZScores({ ...zScores, b: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 mt-1 rounded-lg text-sm font-mono border focus:outline-none"
                      style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
                    />
                  </div>
                </div>
                <div 
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: theme.light }}
                >
                  <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                    P({zScores.a.toFixed(2)} &lt; Z &lt; {zScores.b.toFixed(2)})
                  </span>
                  <div className="text-2xl font-bold font-mono mt-1" style={{ color: theme.primary }}>
                    {(area * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hover Info */}
          <div className="p-4 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Point Info
            </h3>
            {hoverPoint ? (
              <div className="p-4 rounded-xl border" style={{ borderColor: `${theme.primary}20` }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>z-score</span>
                    <div className="font-mono text-lg" style={{ color: theme.primary }}>
                      {hoverPoint.x.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>PDF</span>
                    <div className="font-mono text-lg" style={{ color: theme.primary }}>
                      {hoverPoint.probability.toFixed(4)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t" style={{ borderColor: `${theme.primary}15` }}>
                  <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Cumulative P(Z &lt; z)</span>
                  <div className="font-mono text-lg" style={{ color: theme.primary }}>
                    {(normalCDF(hoverPoint.x, params.mean, params.stdDev) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-center py-8" style={{ color: "rgba(47, 51, 39, 0.4)" }}>
                Hover over the graph to see point details
              </p>
            )}
          </div>

          {/* Common Percentiles */}
          <div className="p-4 border-t" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Common Percentiles
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { z: -1.96, label: "2.5%" },
                { z: -1, label: "16%" },
                { z: 0, label: "50%" },
                { z: 1, label: "84%" },
                { z: 1.96, label: "97.5%" },
                { z: 2.58, label: "99.5%" },
              ].map(({ z, label }) => (
                <button
                  key={z}
                  onClick={() => { setZScores({ a: -Math.abs(z), b: Math.abs(z) }); setShowArea(true); }}
                  className="px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:shadow-sm"
                  style={{ borderColor: `${theme.primary}20`, color: theme.primary }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          id="stats-container"
          className="flex-1 rounded-2xl shadow-2xl overflow-hidden border relative"
          style={{ 
            backgroundColor: BG_COLOR,
            borderColor: `${theme.primary}20`
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="w-full h-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverPoint(null)}
          />
          
          {/* Info overlay */}
          <div 
            className="absolute bottom-4 left-4 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "rgba(47, 51, 39, 0.6)"
            }}
          >
            Hover for details • Click percentiles for common ranges
          </div>
        </div>
      </div>
    </div>
  );
}
