"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface WaveInterferenceSimulatorProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

const PHYSICS_THEME = SUBJECT_THEMES.physics;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

export default function WaveInterferenceSimulator({ 
  theme = PHYSICS_THEME, 
  onClose, 
  isVisible 
}: WaveInterferenceSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [sources, setSources] = useState([
    { id: 1, x: 250, y: 200, amplitude: 50, frequency: 0.05, phase: 0, enabled: true },
    { id: 2, x: 550, y: 200, amplitude: 50, frequency: 0.05, phase: 0, enabled: true },
  ]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const [selectedSource, setSelectedSource] = useState<number | null>(1);

  const activeSource = sources.find(s => s.id === selectedSource);

  // Draw the wave interference
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;

    // Clear canvas
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "#3B3F30";
      ctx.globalAlpha = 0.05;
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Calculate wave interference pattern
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const enabledSources = sources.filter(s => s.enabled);
    
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        let amplitude = 0;
        
        enabledSources.forEach(source => {
          const dx = x - source.x;
          const dy = y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            const wave = (source.amplitude / (1 + distance * 0.01)) * 
                        Math.cos(source.frequency * distance - time + source.phase);
            amplitude += wave;
          }
        });

        // Map amplitude to color (constructive = bright, destructive = dark)
        const normalized = Math.max(-100, Math.min(100, amplitude)) / 100;
        const intensity = Math.floor(128 + normalized * 127);
        
        // Blue-green color scheme
        const r = Math.floor(intensity * 0.3);
        const g = Math.floor(intensity * 0.7);
        const b = Math.floor(intensity * 1.2);
        
        // Fill 2x2 block
        for (let dy = 0; dy < 2 && y + dy < height; dy++) {
          for (let dx = 0; dx < 2 && x + dx < width; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            data[idx] = Math.min(255, r);
            data[idx + 1] = Math.min(255, g);
            data[idx + 2] = Math.min(255, b);
            data[idx + 3] = 255;
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);

    // Draw wave sources
    sources.forEach(source => {
      const isSelected = selectedSource === source.id;
      
      ctx.globalAlpha = source.enabled ? 1 : 0.3;
      
      // Outer glow
      if (isSelected) {
        ctx.fillStyle = theme.primary;
        ctx.beginPath();
        ctx.arc(source.x, source.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.3;
      }
      
      // Source dot
      ctx.fillStyle = source.enabled ? theme.primary : "#999";
      ctx.beginPath();
      ctx.arc(source.x, source.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Label
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = TEXT_DARK;
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`S${source.id}`, source.x, source.y + 25);
      ctx.globalAlpha = 1;
    });

    // Draw legend
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(10, 10, 150, 60);
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 150, 60);
    
    ctx.fillStyle = TEXT_DARK;
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Wave Interference", 20, 28);
    ctx.fillText(`Time: ${(time * 0.1).toFixed(1)}s`, 20, 45);
    ctx.fillText(`Sources: ${enabledSources.length}`, 20, 62);
  }, [sources, time, showGrid, theme.primary, selectedSource]);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;
    
    if (isPlaying) {
      const animate = () => {
        setTime(prev => prev + 0.2);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isVisible]);

  // Redraw when state changes
  useEffect(() => {
    if (isVisible) {
      draw();
    }
  }, [draw, isVisible]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("wave-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible]);

  const updateSource = (id: number, updates: Partial<typeof sources[0]>) => {
    setSources(sources.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleSource = (id: number) => {
    setSources(sources.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
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
                  <Icon name="waves" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Wave Interference
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Superposition simulator
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Source Controls */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Wave Sources
            </h3>
            <div className="space-y-3">
              {sources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
                    selectedSource === source.id ? "ring-2" : ""
                  }`}
                  style={{ 
                    borderColor: `${theme.primary}20`,
                    backgroundColor: selectedSource === source.id ? `${theme.primary}08` : "white",
                    opacity: source.enabled ? 1 : 0.5,
                    ringColor: theme.primary
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="text-sm font-semibold" style={{ color: TEXT_DARK }}>
                        Source {source.id}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={source.enabled}
                      onChange={() => toggleSource(source.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                      style={{ accentColor: theme.primary }}
                    />
                  </div>
                  <div className="text-xs mt-1" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    f={source.frequency.toFixed(2)}, A={source.amplitude}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Source Parameters */}
          {activeSource && (
            <div className="p-4 border-b space-y-4" style={{ borderColor: `${theme.primary}10` }}>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                Source {selectedSource} Parameters
              </h3>
              
              {/* Frequency */}
              <div>
                <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                  Frequency (Hz)
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="0.01"
                    max="0.2"
                    step="0.01"
                    value={activeSource.frequency}
                    onChange={(e) => updateSource(activeSource.id, { frequency: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-16 text-right" style={{ color: theme.primary }}>
                    {activeSource.frequency.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Amplitude */}
              <div>
                <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                  Amplitude
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={activeSource.amplitude}
                    onChange={(e) => updateSource(activeSource.id, { amplitude: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-16 text-right" style={{ color: theme.primary }}>
                    {activeSource.amplitude}
                  </span>
                </div>
              </div>

              {/* Phase */}
              <div>
                <label className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                  Phase Offset (rad)
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.1"
                    value={activeSource.phase}
                    onChange={(e) => updateSource(activeSource.id, { phase: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-16 text-right" style={{ color: theme.primary }}>
                    {activeSource.phase.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: theme.primary }}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => setTime(0)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200"
                style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* View Options */}
          <div className="p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded"
                style={{ accentColor: theme.primary }}
              />
              <span className="text-sm" style={{ color: TEXT_DARK }}>Show grid</span>
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 p-4 border-t overflow-y-auto" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Physics Notes
            </h3>
            <div className="text-xs space-y-2" style={{ color: TEXT_DARK }}>
              <p>
                <strong>Constructive interference:</strong> Waves add together (bright regions)
              </p>
              <p>
                <strong>Destructive interference:</strong> Waves cancel out (dark regions)
              </p>
              <p>
                <strong>Coherent sources:</strong> Same frequency, constant phase difference
              </p>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          id="wave-container"
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
            className="w-full h-full"
          />
          
          {/* Info overlay */}
          <div 
            className="absolute bottom-4 left-4 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "rgba(47, 51, 39, 0.6)"
            }}
          >
            Real-time interference pattern
          </div>
        </div>
      </div>
    </div>
  );
}
