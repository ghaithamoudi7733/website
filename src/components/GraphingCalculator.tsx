"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface GraphingCalculatorProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

interface FunctionPlot {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const PRESETS = [
  { name: "Quadratic", expr: "x^2", color: "#8B0000" },
  { name: "Linear", expr: "2*x + 1", color: "#0047AB" },
  { name: "Cubic", expr: "x^3 - x", color: "#6A0DAD" },
  { name: "Sine", expr: "sin(x)", color: "#2F4F4F" },
  { name: "Cosine", expr: "cos(x)", color: "#8B4513" },
  { name: "Exponential", expr: "2^x", color: "#228B22" },
  { name: "Logarithm", expr: "log(x)", color: "#FF6347" },
  { name: "Tangent", expr: "tan(x)", color: "#4169E1" },
];

const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

export default function GraphingCalculator({ 
  theme = SUBJECT_THEMES.mathematics, 
  onClose,
  isVisible 
}: GraphingCalculatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functions, setFunctions] = useState<FunctionPlot[]>([
    { id: "1", expression: "x^2", color: theme.primary, visible: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [viewBox, setViewBox] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  // Math expression parser
  const evaluateExpression = (expr: string, x: number): number | null => {
    try {
      // Replace math functions with Math equivalents
      let processed = expr
        .replace(/\^/g, "**")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/abs\(/g, "Math.abs(")
        .replace(/pi/gi, "Math.PI")
        .replace(/e(?![a-z])/gi, "Math.E");
      
      // Use Function constructor for safe evaluation
      const func = new Function("x", `"use strict"; return (${processed})`);
      const result = func(x);
      
      if (isNaN(result) || !isFinite(result)) return null;
      return result;
    } catch {
      return null;
    }
  };

  // Draw the graph
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const { xMin, xMax, yMin, yMax } = viewBox;

    // Clear canvas with Oxford Beige background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Calculate scales
    const xScale = width / (xMax - xMin);
    const yScale = height / (yMax - yMin);

    // Transform functions
    const toCanvasX = (x: number) => (x - xMin) * xScale;
    const toCanvasY = (y: number) => height - (y - yMin) * yScale;

    // Draw grid
    ctx.strokeStyle = "#3B3F30";
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 1;

    // Vertical grid lines
    const xStep = Math.pow(10, Math.floor(Math.log10(xMax - xMin))) / 5;
    for (let x = Math.floor(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const canvasX = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    const yStep = Math.pow(10, Math.floor(Math.log10(yMax - yMin))) / 5;
    for (let y = Math.floor(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const canvasY = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(width, canvasY);
      ctx.stroke();
    }

    // Draw axes
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3B3F30";

    // X-axis
    const yZero = toCanvasY(0);
    if (yZero >= 0 && yZero <= height) {
      ctx.beginPath();
      ctx.moveTo(0, yZero);
      ctx.lineTo(width, yZero);
      ctx.stroke();
    }

    // Y-axis
    const xZero = toCanvasX(0);
    if (xZero >= 0 && xZero <= width) {
      ctx.beginPath();
      ctx.moveTo(xZero, 0);
      ctx.lineTo(xZero, height);
      ctx.stroke();
    }

    // Draw function plots
    functions.forEach((func) => {
      if (!func.visible) return;

      ctx.globalAlpha = 1;
      ctx.strokeStyle = func.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let firstPoint = true;
      for (let px = 0; px <= width; px += 2) {
        const x = xMin + px / xScale;
        const y = evaluateExpression(func.expression, x);

        if (y === null) {
          firstPoint = true;
          continue;
        }

        const py = toCanvasY(y);

        if (py >= -100 && py <= height + 100) {
          if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          firstPoint = true;
        }
      }
      ctx.stroke();
    });

    // Draw axis labels
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#3B3F30";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";

    // X-axis labels
    for (let x = Math.floor(xMin); x <= xMax; x++) {
      if (x === 0) continue;
      const canvasX = toCanvasX(x);
      if (canvasX >= 20 && canvasX <= width - 20) {
        const yPos = toCanvasY(0);
        const labelY = yPos >= height - 20 ? height - 10 : (yPos <= 20 ? 20 : yPos + 15);
        ctx.fillText(x.toString(), canvasX, labelY);
      }
    }

    // Y-axis labels
    ctx.textAlign = "right";
    for (let y = Math.floor(yMin); y <= yMax; y++) {
      if (y === 0) continue;
      const canvasY = toCanvasY(y);
      if (canvasY >= 20 && canvasY <= height - 20) {
        const xPos = toCanvasX(0);
        const labelX = xPos <= 30 ? 35 : (xPos >= width - 30 ? width - 10 : xPos - 10);
        ctx.fillText(y.toString(), labelX, canvasY + 4);
      }
    }

    // Origin label
    if (toCanvasX(0) > 20 && toCanvasY(0) < height - 20) {
      ctx.textAlign = "left";
      ctx.fillText("0", toCanvasX(0) + 5, toCanvasY(0) - 5);
    }
  }, [functions, viewBox, canvasSize]);

  // Redraw on changes
  useEffect(() => {
    if (isVisible) {
      drawGraph();
    }
  }, [drawGraph, isVisible]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("graph-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible]);

  // Add new function
  const addFunction = () => {
    if (!inputValue.trim()) return;
    const newFunc: FunctionPlot = {
      id: Date.now().toString(),
      expression: inputValue,
      color: theme.primary,
      visible: true
    };
    setFunctions([...functions, newFunc]);
    setInputValue("");
  };

  // Apply preset
  const applyPreset = (preset: typeof PRESETS[0]) => {
    const newFunc: FunctionPlot = {
      id: Date.now().toString(),
      expression: preset.expr,
      color: preset.color,
      visible: true
    };
    setFunctions([...functions, newFunc]);
  };

  // Remove function
  const removeFunction = (id: string) => {
    setFunctions(functions.filter(f => f.id !== id));
  };

  // Toggle function visibility
  const toggleFunction = (id: string) => {
    setFunctions(functions.map(f => 
      f.id === id ? { ...f, visible: !f.visible } : f
    ));
  };

  // Clear all functions
  const clearAll = () => {
    setFunctions([]);
  };

  // Reset view
  const resetView = () => {
    setViewBox({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  };

  // Zoom functions
  const zoomIn = () => {
    const { xMin, xMax, yMin, yMax } = viewBox;
    const factor = 0.8;
    setViewBox({
      xMin: xMin * factor,
      xMax: xMax * factor,
      yMin: yMin * factor,
      yMax: yMax * factor
    });
  };

  const zoomOut = () => {
    const { xMin, xMax, yMin, yMax } = viewBox;
    const factor = 1.25;
    setViewBox({
      xMin: xMin * factor,
      xMax: xMax * factor,
      yMin: yMin * factor,
      yMax: yMax * factor
    });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    const { width, height } = canvasSize;
    const { xMin, xMax, yMin, yMax } = viewBox;
    
    const xScale = (xMax - xMin) / width;
    const yScale = (yMax - yMin) / height;
    
    setViewBox({
      xMin: xMin - dx * xScale,
      xMax: xMax - dx * xScale,
      yMin: yMin + dy * yScale,
      yMax: yMax + dy * yScale
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex animate-fade-in"
      style={{ backgroundColor: "rgba(26, 28, 22, 0.5)" }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />

      {/* Main Container */}
      <div 
        className="relative flex w-full h-full max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in-scale"
        style={{ animationDelay: "0.1s" }}
      >
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
          <div 
            className="p-4 border-b"
            style={{ borderColor: `${theme.primary}15` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: theme.light }}
                >
                  <Icon name="trending-up" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 
                    className="font-serif text-lg font-semibold"
                    style={{ color: TEXT_DARK }}
                  >
                    Graphing Calculator
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Plot mathematical functions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <h3 
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: "rgba(47, 51, 39, 0.6)" }}
            >
              Quick Presets
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-sm"
                  style={{ 
                    backgroundColor: `${preset.color}15`,
                    color: preset.color
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Function Input */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <h3 
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: "rgba(47, 51, 39, 0.6)" }}
            >
              Add Function
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFunction()}
                placeholder="y = ..."
                className="flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: `${theme.primary}30`,
                  color: TEXT_DARK
                }}
              />
              <button
                onClick={addFunction}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: theme.primary }}
              >
                Add
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: "rgba(47, 51, 39, 0.4)" }}>
              Use x as variable. Supports: sin, cos, tan, log, sqrt
            </p>
          </div>

          {/* Function List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: "rgba(47, 51, 39, 0.6)" }}
            >
              Functions
            </h3>
            {functions.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "rgba(47, 51, 39, 0.4)" }}>
                No functions added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {functions.map((func, index) => (
                  <div 
                    key={func.id}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-sm"
                    style={{ borderColor: `${func.color}20` }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ 
                        backgroundColor: func.visible ? func.color : "#ccc" 
                      }}
                    />
                    <span 
                      className="flex-1 text-sm font-mono truncate"
                      style={{ 
                        color: func.visible ? TEXT_DARK : "rgba(47, 51, 39, 0.4)",
                        textDecoration: func.visible ? "none" : "line-through"
                      }}
                    >
                      y = {func.expression}
                    </span>
                    <button
                      onClick={() => toggleFunction(func.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon 
                        name={func.visible ? "eye" : "x-icon"} 
                        size={14} 
                        color={func.visible ? "#3B3F30" : "#999"} 
                      />
                    </button>
                    <button
                      onClick={() => removeFunction(func.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Icon name="x-icon" size={14} color="#DC2626" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div 
            className="p-4 border-t"
            style={{ borderColor: `${theme.primary}10` }}
          >
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200"
                style={{ 
                  borderColor: `${theme.primary}30`,
                  color: TEXT_DARK
                }}
              >
                Clear All
              </button>
              <button
                onClick={resetView}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: theme.primary }}
              >
                Reset View
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          id="graph-container"
          className="flex-1 rounded-2xl shadow-2xl overflow-hidden border relative"
          style={{ 
            backgroundColor: BG_COLOR,
            borderColor: `${theme.primary}20`
          }}
        >
          {/* Toolbar */}
          <div 
            className="absolute top-4 right-4 flex gap-2 z-10"
          >
            <button
              onClick={zoomIn}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 shadow-md hover:shadow-lg transition-all duration-200"
              style={{ border: `1px solid ${theme.primary}20` }}
            >
              <span className="text-lg font-semibold" style={{ color: theme.primary }}>+</span>
            </button>
            <button
              onClick={zoomOut}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 shadow-md hover:shadow-lg transition-all duration-200"
              style={{ border: `1px solid ${theme.primary}20` }}
            >
              <span className="text-lg font-semibold" style={{ color: theme.primary }}>-</span>
            </button>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Info overlay */}
          <div 
            className="absolute bottom-4 left-4 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "rgba(47, 51, 39, 0.6)"
            }}
          >
            Drag to pan • Scroll to zoom
          </div>
        </div>
      </div>
    </div>
  );
}
