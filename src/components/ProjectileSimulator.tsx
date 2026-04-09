"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface ProjectileSimulatorProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
}

const PHYSICS_THEME = SUBJECT_THEMES.physics;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

export default function ProjectileSimulator({ 
  theme = PHYSICS_THEME, 
  onClose, 
  isVisible 
}: ProjectileSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [velocity, setVelocity] = useState(50); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [height, setHeight] = useState(0); // initial height
  const [gravity, setGravity] = useState(9.8); // m/s²
  const [isAnimating, setIsAnimating] = useState(false);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  const g = gravity;
  const v0 = velocity;
  const theta = (angle * Math.PI) / 180;
  const y0 = height;

  // Calculate trajectory
  const calculateTrajectory = useCallback((): TrajectoryPoint[] => {
    const points: TrajectoryPoint[] = [];
    const dt = 0.05;
    let t = 0;
    
    while (t < 20) {
      const x = v0 * Math.cos(theta) * t;
      const y = y0 + v0 * Math.sin(theta) * t - 0.5 * g * t * t;
      
      if (y < 0 && t > 0) {
        // Find exact landing point
        const tLand = (v0 * Math.sin(theta) + Math.sqrt(v0 * v0 * Math.sin(theta) * Math.sin(theta) + 2 * g * y0)) / g;
        const xLand = v0 * Math.cos(theta) * tLand;
        points.push({ x: xLand, y: 0, t: tLand });
        break;
      }
      
      points.push({ x, y, t });
      t += dt;
    }
    
    return points;
  }, [v0, theta, y0, g]);

  // Calculate flight stats
  const maxHeight = y0 + (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * g);
  const range = (v0 * v0 * Math.sin(2 * theta)) / g + (v0 * Math.cos(theta) * Math.sqrt(2 * y0 / g));
  const flightTime = (2 * v0 * Math.sin(theta)) / g;

  // Draw the simulation
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height: h } = canvas;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    
    // Clear canvas
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, h);

    // Calculate scale to fit trajectory
    const allPoints = calculateTrajectory();
    const maxX = Math.max(range * 1.1, 50);
    const maxY = Math.max(maxHeight * 1.2, 30);
    
    const scaleX = (width - padding.left - padding.right) / maxX;
    const scaleY = (h - padding.top - padding.bottom) / maxY;
    
    const toCanvasX = (x: number) => padding.left + x * scaleX;
    const toCanvasY = (y: number) => h - padding.bottom - y * scaleY;

    // Draw grid
    ctx.strokeStyle = "#3B3F30";
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 1;

    // Vertical grid
    for (let x = 0; x <= maxX; x += 10) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), padding.top);
      ctx.lineTo(toCanvasX(x), h - padding.bottom);
      ctx.stroke();
    }

    // Horizontal grid
    for (let y = 0; y <= maxY; y += 10) {
      ctx.beginPath();
      ctx.moveTo(padding.left, toCanvasY(y));
      ctx.lineTo(width - padding.right, toCanvasY(y));
      ctx.stroke();
    }

    // Draw axes
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3B3F30";
    
    // X-axis (ground)
    ctx.beginPath();
    ctx.moveTo(padding.left, toCanvasY(0));
    ctx.lineTo(width - padding.right, toCanvasY(0));
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding.top);
    ctx.lineTo(toCanvasX(0), h - padding.bottom);
    ctx.stroke();

    // Draw trajectory path
    if (allPoints.length > 1) {
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      allPoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(toCanvasX(point.x), toCanvasY(point.y));
        } else {
          ctx.lineTo(toCanvasX(point.x), toCanvasY(point.y));
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw animated projectile
    if (isAnimating && allPoints.length > 0) {
      const point = allPoints[Math.min(currentPoint, allPoints.length - 1)];
      
      // Trail
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(0), toCanvasY(y0));
      for (let i = 0; i <= Math.min(currentPoint, allPoints.length - 1); i++) {
        ctx.lineTo(toCanvasX(allPoints[i].x), toCanvasY(allPoints[i].y));
      }
      ctx.stroke();

      // Projectile
      ctx.globalAlpha = 1;
      ctx.fillStyle = theme.primary;
      ctx.beginPath();
      ctx.arc(toCanvasX(point.x), toCanvasY(point.y), 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow effect
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = theme.primary;
      ctx.beginPath();
      ctx.arc(toCanvasX(point.x), toCanvasY(point.y), 16, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Static projectile at start
      ctx.globalAlpha = 1;
      ctx.fillStyle = theme.primary;
      ctx.beginPath();
      ctx.arc(toCanvasX(0), toCanvasY(y0), 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw launch angle arc
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(toCanvasX(0), toCanvasY(y0), 30, -theta, 0);
    ctx.stroke();

    // Labels
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#3B3F30";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    
    // X-axis labels
    for (let x = 0; x <= maxX; x += 20) {
      ctx.fillText(`${x}m`, toCanvasX(x), h - padding.bottom + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = "right";
    for (let y = 0; y <= maxY; y += 20) {
      ctx.fillText(`${y}m`, padding.left - 10, toCanvasY(y) + 4);
    }

    // Axis titles
    ctx.textAlign = "center";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("Distance (m)", width / 2, h - 15);
    
    ctx.save();
    ctx.translate(15, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Height (m)", 0, 0);
    ctx.restore();
  }, [calculateTrajectory, currentPoint, isAnimating, maxHeight, range, theme.primary, y0, theta]);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;
    
    if (isAnimating) {
      const animate = () => {
        setCurrentPoint(prev => {
          if (prev >= trajectory.length - 1) {
            setIsAnimating(false);
            return prev;
          }
          return prev + 2;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, trajectory.length, isVisible]);

  // Redraw on parameter changes
  useEffect(() => {
    if (isVisible) {
      const newTrajectory = calculateTrajectory();
      setTrajectory(newTrajectory);
      setCurrentPoint(0);
      draw();
    }
  }, [calculateTrajectory, draw, isVisible]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("projectile-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible]);

  const startAnimation = () => {
    setCurrentPoint(0);
    setIsAnimating(true);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const reset = () => {
    setIsAnimating(false);
    setCurrentPoint(0);
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
                  <Icon name="move" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Projectile Motion
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Trajectory simulator
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-b space-y-4" style={{ borderColor: `${theme.primary}10` }}>
            {/* Initial Velocity */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                Initial Velocity (v₀)
              </label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-16 text-right" style={{ color: theme.primary }}>
                  {velocity} m/s
                </span>
              </div>
            </div>

            {/* Launch Angle */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                Launch Angle (θ)
              </label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-16 text-right" style={{ color: theme.primary }}>
                  {angle}°
                </span>
              </div>
            </div>

            {/* Initial Height */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                Initial Height (h₀)
              </label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-16 text-right" style={{ color: theme.primary }}>
                  {height} m
                </span>
              </div>
            </div>

            {/* Gravity */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                Gravity (g)
              </label>
              <div className="flex items-center gap-3 mt-2">
                <select
                  value={gravity}
                  onChange={(e) => setGravity(Number(e.target.value))}
                  className="flex-1 px-3 py-2 rounded-lg text-sm border"
                  style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
                >
                  <option value={9.8}>Earth (9.8 m/s²)</option>
                  <option value={1.6}>Moon (1.6 m/s²)</option>
                  <option value={3.7}>Mars (3.7 m/s²)</option>
                  <option value={24.8}>Jupiter (24.8 m/s²)</option>
                  <option value={0}>Zero G (0 m/s²)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Calculated Values
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border" style={{ borderColor: `${theme.primary}20` }}>
                <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Max Height</span>
                <div className="text-lg font-mono font-bold" style={{ color: theme.primary }}>
                  {maxHeight.toFixed(2)} m
                </div>
              </div>
              <div className="p-3 rounded-xl border" style={{ borderColor: `${theme.primary}20` }}>
                <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Range</span>
                <div className="text-lg font-mono font-bold" style={{ color: theme.primary }}>
                  {range.toFixed(2)} m
                </div>
              </div>
              <div className="p-3 rounded-xl border" style={{ borderColor: `${theme.primary}20` }}>
                <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Flight Time</span>
                <div className="text-lg font-mono font-bold" style={{ color: theme.primary }}>
                  {flightTime.toFixed(2)} s
                </div>
              </div>
              <div className="p-3 rounded-xl border" style={{ borderColor: `${theme.primary}20` }}>
                <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Vx (horizontal)</span>
                <div className="text-lg font-mono font-bold" style={{ color: theme.primary }}>
                  {(v0 * Math.cos(theta)).toFixed(2)} m/s
                </div>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="p-4 mt-auto">
            <div className="flex gap-2">
              <button
                onClick={isAnimating ? stopAnimation : startAnimation}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                {isAnimating ? "Pause" : "Launch"}
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
                style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          id="projectile-container"
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
            y = h₀ + v₀sin(θ)t - ½gt²
          </div>
        </div>
      </div>
    </div>
  );
}
