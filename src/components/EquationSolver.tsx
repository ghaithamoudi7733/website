"use client";

import React, { useState, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface EquationSolverProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

interface Solution {
  variable: string;
  value: string;
  steps: Step[];
}

interface Step {
  description: string;
  math: string;
}

interface HistoryItem {
  id: string;
  equation: string;
  solution: string;
  timestamp: Date;
}

const MATH_THEME = SUBJECT_THEMES.mathematics;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

// Parse and solve simple equations
const solveEquation = (eq: string): Solution | null => {
  // Clean up the input
  const clean = eq.replace(/\s+/g, "").toLowerCase();
  
  // Check for quadratic (ax^2 + bx + c = 0)
  const quadraticMatch = clean.match(/^([+-]?\d*\.?\d*)x\^2([+-]\d+\.?\d*)x([+-]\d+\.?\d*)=0$/);
  if (quadraticMatch) {
    const a = parseFloat(quadraticMatch[1]) || 1;
    const b = parseFloat(quadraticMatch[2]) || 0;
    const c = parseFloat(quadraticMatch[3]) || 0;
    
    const discriminant = b * b - 4 * a * c;
    const steps: Step[] = [
      { description: "Identify coefficients", math: `a = ${a}, b = ${b}, c = ${c}` },
      { description: "Calculate discriminant", math: `Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}` },
    ];
    
    if (discriminant < 0) {
      steps.push({ description: "No real solutions (discriminant < 0)", math: "No real roots" });
      return { variable: "x", value: "No real solutions", steps };
    }
    
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    
    steps.push({ description: "Apply quadratic formula", math: `x = (-b ± √Δ) / 2a` });
    steps.push({ description: "Calculate solutions", math: `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}` });
    
    return { variable: "x", value: `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`, steps };
  }
  
  // Check for linear (ax + b = c)
  const linearMatch = clean.match(/^([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)=([+-]?\d+\.?\d*)$/);
  if (linearMatch) {
    const a = parseFloat(linearMatch[1]) || 1;
    const b = parseFloat(linearMatch[2]) || 0;
    const c = parseFloat(linearMatch[3]) || 0;
    
    const steps: Step[] = [
      { description: "Original equation", math: `${a}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)} = ${c}` },
      { description: "Subtract from both sides", math: `${a}x = ${c} ${b >= 0 ? "- " + b : "+ " + Math.abs(b)} = ${c - b}` },
      { description: "Divide by coefficient", math: `x = ${c - b} / ${a} = ${((c - b) / a).toFixed(3)}` },
    ];
    
    return { variable: "x", value: `${((c - b) / a).toFixed(3)}`, steps };
  }
  
  // Simple numeric evaluation
  try {
    // Replace math functions
    let processed = clean
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/pi/gi, "Math.PI")
      .replace(/\^/g, "**");
    
    // Remove any remaining variable assignments
    processed = processed.replace(/[a-z]=/g, "");
    
    const result = new Function("return " + processed)();
    
    return {
      variable: "result",
      value: Number(result).toFixed(6).replace(/\.?0+$/, ""),
      steps: [{ description: "Evaluate expression", math: `= ${processed}` }, { description: "Result", math: `${result}` }]
    };
  } catch {
    return null;
  }
};

export default function EquationSolver({ 
  theme = MATH_THEME, 
  onClose, 
  isVisible 
}: EquationSolverProps) {
  const [input, setInput] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const solve = useCallback(() => {
    if (!input.trim()) return;
    
    const result = solveEquation(input);
    setSolution(result);
    
    if (result) {
      setHistory(prev => [{
        id: Date.now().toString(),
        equation: input,
        solution: result.value,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    }
  }, [input]);
  
  const loadFromHistory = (item: HistoryItem) => {
    setInput(item.equation);
    setShowHistory(false);
  };
  
  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
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
        {/* Sidebar - Equation Input & History */}
        <div 
          className="w-96 flex-shrink-0 flex flex-col rounded-2xl shadow-2xl overflow-hidden border mr-4"
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
                  <Icon name="radical" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Equation Solver
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    Step-by-step solutions
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Enter Equation
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), solve())}
              placeholder="e.g., 2x^2 + 3x - 5 = 0&#10;or: 3x + 7 = 22"
              className="w-full h-24 px-3 py-2 rounded-lg text-sm font-mono border resize-none focus:outline-none focus:ring-2"
              style={{ 
                borderColor: `${theme.primary}30`,
                color: TEXT_DARK,
                backgroundColor: "rgba(255,255,255,0.8)"
              }}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={solve}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: theme.primary }}
              >
                Solve
              </button>
              <button
                onClick={() => { setInput(""); setSolution(null); }}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200"
                style={{ borderColor: `${theme.primary}30`, color: TEXT_DARK }}
              >
                Clear
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: "rgba(47, 51, 39, 0.4)" }}>
              Supports: quadratics (ax²+bx+c=0), linear, expressions
            </p>
          </div>
          
          {/* History Toggle */}
          <div className="p-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:shadow-sm"
              style={{ borderColor: `${theme.primary}20` }}
            >
              <span className="text-sm font-semibold" style={{ color: TEXT_DARK }}>
                History ({history.length})
              </span>
              <div className={`transition-transform duration-200 ${showHistory ? "rotate-180" : ""}`}>
                <Icon name="chevron-down" size={16} color={TEXT_DARK} />
              </div>
            </button>
            
            {showHistory && (
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto animate-fade-in">
                {history.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: "rgba(47, 51, 39, 0.4)" }}>
                    No history yet
                  </p>
                ) : (
                  <>
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-all duration-200"
                        style={{ borderColor: `${theme.primary}15` }}
                      >
                        <div className="font-mono text-sm truncate" style={{ color: TEXT_DARK }}>
                          {item.equation}
                        </div>
                        <div className="text-xs mt-1" style={{ color: theme.primary }}>
                          = {item.solution}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={clearHistory}
                      className="w-full py-2 text-xs font-semibold rounded-lg border transition-all duration-200"
                      style={{ borderColor: "#DC262620", color: "#DC2626" }}
                    >
                      Clear History
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Main Solution Area */}
        <div 
          className="flex-1 rounded-2xl shadow-2xl overflow-hidden border relative flex flex-col"
          style={{ 
            backgroundColor: "rgba(253, 251, 247, 0.98)",
            borderColor: `${theme.primary}20`,
            backdropFilter: "blur(20px)"
          }}
        >
          {/* Header */}
          <div 
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: `${theme.primary}10`, backgroundColor: theme.light }}
          >
            <h3 className="font-semibold" style={{ color: TEXT_DARK }}>
              Solution Steps
            </h3>
            {solution && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
                Solved
              </span>
            )}
          </div>
          
          {/* Solution Display */}
          <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: BG_COLOR }}>
            {!solution ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${theme.primary}10` }}
                >
                  <Icon name="radical" size={32} color={theme.primary} />
                </div>
                <p className="text-sm font-medium" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                  Enter an equation and click Solve to see step-by-step working
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2 text-xs" style={{ color: "rgba(47, 51, 39, 0.4)" }}>
                  <div className="px-3 py-2 rounded border" style={{ borderColor: `${theme.primary}20` }}>2x² + 3x - 5 = 0</div>
                  <div className="px-3 py-2 rounded border" style={{ borderColor: `${theme.primary}20` }}>3x + 7 = 22</div>
                  <div className="px-3 py-2 rounded border" style={{ borderColor: `${theme.primary}20` }}>sin(π/4)</div>
                  <div className="px-3 py-2 rounded border" style={{ borderColor: `${theme.primary}20` }}>sqrt(16) + 5</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Final Answer */}
                <div 
                  className="p-6 rounded-xl border-2 text-center"
                  style={{ borderColor: `${theme.primary}40`, backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <p className="text-sm mb-2" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                    Final Answer
                  </p>
                  <p className="text-3xl font-serif font-bold" style={{ color: theme.primary }}>
                    {solution.variable} = {solution.value}
                  </p>
                </div>
                
                {/* Steps */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                    Working Steps
                  </h4>
                  {solution.steps.map((step, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl border flex items-start gap-4"
                      style={{ borderColor: `${theme.primary}15`, backgroundColor: "rgba(255,255,255,0.9)" }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{ backgroundColor: theme.light, color: theme.primary }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                          {step.description}
                        </p>
                        <p className="font-mono text-lg" style={{ color: TEXT_DARK }}>
                          {step.math}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
