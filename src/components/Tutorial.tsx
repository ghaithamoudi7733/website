"use client";

import React, { useState, useEffect } from "react";
import { SUBJECT_THEMES, type SubjectTheme } from "@/data/vault";
import Icon from "./Icons";

interface TutorialProps {
  theme?: SubjectTheme;
  toolName: string;
  steps: TutorialStep[];
  onComplete: () => void;
  isVisible: boolean;
}

export interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  highlight?: string;
}

const TEXT_DARK = "#2F3327";

export default function Tutorial({
  theme = SUBJECT_THEMES.mathematics,
  toolName,
  steps,
  onComplete,
  isVisible
}: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);

  useEffect(() => {
    // Check localStorage only on client side
    const tutorialKey = `tutorial_${toolName}`;
    const stored = typeof window !== "undefined" ? localStorage.getItem(tutorialKey) : null;
    setHasSeenTutorial(stored === "true");
    
    if (isVisible && stored !== "true") {
      setCurrentStep(0);
    }
  }, [isVisible, toolName]);

  if (!isVisible || hasSeenTutorial) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    localStorage.setItem(`tutorial_${toolName}`, "true");
    setHasSeenTutorial(true);
    onComplete();
  };

  const skipTutorial = () => {
    localStorage.setItem(`tutorial_${toolName}`, "true");
    setHasSeenTutorial(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem(`tutorial_${toolName}`);
    setHasSeenTutorial(false);
    setCurrentStep(0);
  };

  const step = steps[currentStep];

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "rgba(26, 28, 22, 0.7)" }}
    >
      <div 
        className="relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden border animate-fade-in-scale"
        style={{ 
          backgroundColor: "rgba(253, 251, 247, 0.98)",
          borderColor: `${theme.primary}30`,
          backdropFilter: "blur(20px)"
        }}
      >
        {/* Header with progress */}
        <div 
          className="p-6 border-b"
          style={{ borderColor: `${theme.primary}15`, backgroundColor: theme.light }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
              >
                <Icon name="book" size={20} color={theme.primary} />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold" style={{ color: TEXT_DARK }}>
                  Welcome to {toolName}
                </h2>
                <p className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
                  Quick tutorial to get you started
                </p>
              </div>
            </div>
            <button 
              onClick={skipTutorial}
              className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors"
              style={{ color: "rgba(47, 51, 39, 0.5)" }}
            >
              Skip
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: idx <= currentStep ? theme.primary : `${theme.primary}20`
                }}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300"
              style={{ backgroundColor: theme.light }}
            >
              <Icon name={step.icon} size={40} color={theme.primary} />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: TEXT_DARK }}>
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(47, 51, 39, 0.7)" }}>
              {step.description}
            </p>
          </div>

          {step.highlight && (
            <div 
              className="p-4 rounded-xl border mb-4"
              style={{ borderColor: `${theme.primary}20`, backgroundColor: theme.light }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.primary }}
                >
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-xs font-medium" style={{ color: theme.primary }}>
                  {step.highlight}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div 
          className="p-4 border-t flex items-center justify-between"
          style={{ borderColor: `${theme.primary}10` }}
        >
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              borderColor: currentStep === 0 ? "transparent" : `${theme.primary}30`,
              color: TEXT_DARK
            }}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "rgba(47, 51, 39, 0.5)" }}>
              {currentStep + 1} / {steps.length}
            </span>
          </div>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: theme.primary }}
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>

        {/* Reset button (for testing) */}
        <button 
          onClick={resetTutorial}
          className="absolute bottom-2 right-2 text-[10px] opacity-0 hover:opacity-50 transition-opacity"
          style={{ color: "rgba(47, 51, 39, 0.3)" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
