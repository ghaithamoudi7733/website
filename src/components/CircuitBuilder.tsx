"use client";

import React, { useState, useCallback } from "react";
import Icon from "./Icons";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";

interface CircuitBuilderProps {
  theme?: SubjectTheme;
  onClose: () => void;
  isVisible: boolean;
}

interface Component {
  id: string;
  type: "battery" | "resistor" | "led" | "switch";
  value: number;
  unit: string;
  label: string;
}

interface CircuitConnection {
  from: string;
  to: string;
}

const PHYSICS_THEME = SUBJECT_THEMES.physics;
const TEXT_DARK = "#2F3327";
const BG_COLOR = "#F2E8CF";

const COMPONENT_TYPES = [
  { type: "battery", label: "Battery", icon: "zap", defaultValue: 9, unit: "V", color: "#FFD700" },
  { type: "resistor", label: "Resistor", icon: "minus", defaultValue: 100, unit: "Ω", color: "#8B4513" },
  { type: "led", label: "LED", icon: "lightbulb", defaultValue: 2, unit: "V", color: "#FF6347" },
  { type: "switch", label: "Switch", icon: "toggle-left", defaultValue: 0, unit: "", color: "#4682B4" },
] as const;

export default function CircuitBuilder({ 
  theme = PHYSICS_THEME, 
  onClose, 
  isVisible 
}: CircuitBuilderProps) {
  const [components, setComponents] = useState<Component[]>([
    { id: "bat-1", type: "battery", value: 9, unit: "V", label: "9V Battery" },
    { id: "res-1", type: "resistor", value: 330, unit: "Ω", label: "330Ω Resistor" },
    { id: "led-1", type: "led", value: 2, unit: "V", label: "Red LED" },
  ]);
  const [connections, setConnections] = useState<CircuitConnection[]>([
    { from: "bat-1", to: "res-1" },
    { from: "res-1", to: "led-1" },
    { from: "led-1", to: "bat-1" },
  ]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [switchState, setSwitchState] = useState<Record<string, boolean>>({ "bat-1": true });
  const [showCalculations, setShowCalculations] = useState(true);

  const addComponent = (type: Component["type"]) => {
    const config = COMPONENT_TYPES.find(c => c.type === type);
    if (!config) return;
    
    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type,
      value: config.defaultValue,
      unit: config.unit,
      label: `${config.defaultValue}${config.unit} ${config.label}`
    };
    
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const toggleSwitch = (id: string) => {
    setSwitchState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate circuit values (simplified series circuit)
  const calculateCircuit = useCallback(() => {
    const battery = components.find(c => c.type === "battery");
    const resistors = components.filter(c => c.type === "resistor");
    const leds = components.filter(c => c.type === "led");
    const switches = components.filter(c => c.type === "switch");
    
    const isOpen = switches.some(s => !switchState[s.id]);
    if (isOpen) return { voltage: 0, current: 0, power: 0, isOpen: true };
    
    if (!battery) return { voltage: 0, current: 0, power: 0, isOpen: false };
    
    const totalResistance = resistors.reduce((sum, r) => sum + r.value, 0) + 
                            leds.reduce((sum, l) => sum + (l.value / 0.02), 0); // LEDs as ~100Ω at 20mA
    
    const voltage = battery.value;
    const current = totalResistance > 0 ? voltage / totalResistance : 0;
    const power = voltage * current;
    
    return { voltage, current, power, isOpen: false, totalResistance };
  }, [components, switchState]);

  const circuit = calculateCircuit();

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
                  <Icon name="zap" size={24} color={theme.primary} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold" style={{ color: TEXT_DARK }}>
                    Circuit Builder
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                    DC circuit simulator
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <Icon name="x-icon" size={20} color={TEXT_DARK} />
              </button>
            </div>
          </div>

          {/* Component Palette */}
          <div className="p-4 border-b" style={{ borderColor: `${theme.primary}10` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Add Components
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {COMPONENT_TYPES.map((config) => (
                <button
                  key={config.type}
                  onClick={() => addComponent(config.type)}
                  className="p-3 rounded-xl border transition-all duration-200 hover:shadow-sm flex flex-col items-center gap-2"
                  style={{ borderColor: `${config.color}40`, backgroundColor: `${config.color}10` }}
                >
                  <Icon name={config.icon} size={20} color={config.color} />
                  <span className="text-xs font-semibold" style={{ color: config.color }}>
                    {config.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
              Circuit Components ({components.length})
            </h3>
            <div className="space-y-2">
              {components.map((comp) => {
                const config = COMPONENT_TYPES.find(c => c.type === comp.type);
                const isSwitch = comp.type === "switch";
                const isOn = switchState[comp.id] ?? true;
                
                return (
                  <div 
                    key={comp.id}
                    className={`p-3 rounded-xl border transition-all duration-200 ${selectedComponent === comp.id ? "ring-2 ring-offset-1" : ""}`}
                    style={{ 
                      borderColor: `${config?.color}30`,
                      backgroundColor: `${config?.color}05`,
                      "--tw-ring-color": config?.color
                    } as React.CSSProperties}
                    onClick={() => setSelectedComponent(comp.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name={config?.icon || "minus"} size={16} color={config?.color} />
                        <span className="text-sm font-medium" style={{ color: TEXT_DARK }}>
                          {comp.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSwitch && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSwitch(comp.id); }}
                            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                              isOn ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {isOn ? "ON" : "OFF"}
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }}
                          className="p-1 rounded hover:bg-red-50"
                        >
                          <Icon name="x-icon" size={14} color="#DC2626" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Value Editor */}
                    {selectedComponent === comp.id && !isSwitch && (
                      <div className="mt-3 pt-3 border-t animate-fade-in" style={{ borderColor: `${config?.color}20` }}>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={comp.value}
                            onChange={(e) => updateComponent(comp.id, { value: Number(e.target.value) })}
                            className="flex-1 px-2 py-1 rounded border text-sm"
                            style={{ borderColor: `${config?.color}30`, color: TEXT_DARK }}
                          />
                          <span className="text-sm font-mono" style={{ color: config?.color }}>
                            {comp.unit}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div 
          className="flex-1 rounded-2xl shadow-2xl overflow-hidden border flex flex-col"
          style={{ 
            backgroundColor: BG_COLOR,
            borderColor: `${theme.primary}20`
          }}
        >
          {/* Circuit Visualization */}
          <div className="flex-1 p-8 flex items-center justify-center relative">
            {/* Simple circuit diagram */}
            <div className="relative w-full max-w-lg aspect-square">
              {/* Circuit path visualization */}
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Circuit rectangle */}
                <rect 
                  x="50" y="50" width="200" height="200" 
                  fill="none" 
                  stroke={circuit.isOpen ? "#DC2626" : theme.primary}
                  strokeWidth="3"
                  strokeDasharray={circuit.isOpen ? "10,5" : "none"}
                  rx="10"
                />
                
                {/* Components placed around the rectangle */}
                {components.map((comp, index) => {
                  const config = COMPONENT_TYPES.find(c => c.type === comp.type);
                  const positions = [
                    { x: 150, y: 50 },    // top
                    { x: 250, y: 150 },   // right
                    { x: 150, y: 250 },   // bottom
                    { x: 50, y: 150 },    // left
                  ];
                  const pos = positions[index % 4];
                  const isOn = comp.type === "switch" ? (switchState[comp.id] ?? true) : true;
                  
                  return (
                    <g key={comp.id} transform={`translate(${pos.x}, ${pos.y})`}>
                      {/* Component circle */}
                      <circle 
                        r="25" 
                        fill={isOn ? "white" : "#e5e5e5"}
                        stroke={config?.color}
                        strokeWidth="2"
                      />
                      {/* Component icon representation */}
                      {comp.type === "battery" && (
                        <>
                          <line x1="-8" y1="0" x2="8" y2="0" stroke={config?.color} strokeWidth="3" />
                          <line x1="-4" y1="-5" x2="-4" y2="5" stroke={config?.color} strokeWidth="2" />
                          <line x1="4" y1="-8" x2="4" y2="8" stroke={config?.color} strokeWidth="2" />
                        </>
                      )}
                      {comp.type === "resistor" && (
                        <path 
                          d="M-10,0 L-7,-5 L-4,5 L-1,-5 L2,5 L5,-5 L8,0" 
                          fill="none" 
                          stroke={config?.color} 
                          strokeWidth="2"
                        />
                      )}
                      {comp.type === "led" && (
                        <>
                          <polygon points="-5,5 5,5 0,-8" fill={isOn ? "#FF6347" : "none"} stroke={config?.color} strokeWidth="2" />
                          <line x1="-5" y1="5" x2="5" y2="5" stroke={config?.color} strokeWidth="2" />
                        </>
                      )}
                      {comp.type === "switch" && (
                        <>
                          <line x1="-8" y1="0" x2="-3" y2="0" stroke={config?.color} strokeWidth="2" />
                          <line 
                            x1="-3" y1="0" 
                            x2="8" y2={isOn ? "0" : "-10"} 
                            stroke={config?.color} 
                            strokeWidth="2"
                          />
                          <circle cx="8" cy="0" r="2" fill={config?.color} />
                        </>
                      )}
                      {/* Value label */}
                      <text 
                        y="35" 
                        textAnchor="middle" 
                        fontSize="10" 
                        fill={TEXT_DARK}
                        fontWeight="600"
                      >
                        {comp.value}{comp.unit}
                      </text>
                    </g>
                  );
                })}
                
                {/* Current flow animation */}
                {!circuit.isOpen && circuit.current > 0 && (
                  <circle r="5" fill={theme.primary} opacity="0.6">
                    <animateMotion 
                      dur="2s" 
                      repeatCount="indefinite"
                      path="M 50,50 L 250,50 L 250,250 L 50,250 Z"
                    />
                  </circle>
                )}
              </svg>
              
              {/* Circuit status */}
              <div 
                className="absolute top-4 left-4 px-4 py-2 rounded-xl"
                style={{ 
                  backgroundColor: circuit.isOpen ? "rgba(220, 38, 38, 0.1)" : "rgba(34, 197, 94, 0.1)",
                  border: `1px solid ${circuit.isOpen ? "#DC2626" : "#22C55E"}`
                }}
              >
                <span className="text-sm font-semibold" style={{ color: circuit.isOpen ? "#DC2626" : "#22C55E" }}>
                  {circuit.isOpen ? "Circuit Open" : "Circuit Closed"}
                </span>
              </div>
            </div>
          </div>

          {/* Calculations Panel */}
          <div 
            className="p-4 border-t"
            style={{ borderColor: `${theme.primary}10`, backgroundColor: "rgba(255,255,255,0.5)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(47, 51, 39, 0.6)" }}>
                Circuit Analysis
              </h3>
              <button
                onClick={() => setShowCalculations(!showCalculations)}
                className="text-xs flex items-center gap-1"
                style={{ color: theme.primary }}
              >
                {showCalculations ? "Hide" : "Show"}
                <Icon name={showCalculations ? "chevron-down" : "chevron-right"} size={12} color={theme.primary} />
              </button>
            </div>
            
            {showCalculations && (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                  <span className="text-xs block mb-1" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Total Voltage</span>
                  <div className="text-2xl font-mono font-bold" style={{ color: theme.primary }}>
                    {circuit.voltage.toFixed(2)} V
                  </div>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                  <span className="text-xs block mb-1" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Current</span>
                  <div className="text-2xl font-mono font-bold" style={{ color: theme.primary }}>
                    {(circuit.current * 1000).toFixed(1)} mA
                  </div>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                  <span className="text-xs block mb-1" style={{ color: "rgba(47, 51, 39, 0.5)" }}>Power</span>
                  <div className="text-2xl font-mono font-bold" style={{ color: theme.primary }}>
                    {(circuit.power * 1000).toFixed(1)} mW
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
