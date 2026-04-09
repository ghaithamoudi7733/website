"use client";

import React from "react";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

const iconPaths: Record<string, React.ReactNode> = {
  atom: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="8" />
      <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(120 50 50)" />
    </g>
  ),
  leaf: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 85 Q25 65 25 35 Q25 15 50 15 Q75 15 75 35 Q75 65 50 85" />
      <path d="M50 85 L50 50" />
      <path d="M35 40 Q50 45 50 50" />
      <path d="M65 35 Q50 40 50 50" />
    </g>
  ),
  "flask-conical": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M35 20 L65 20 L55 50 L65 80 L35 80 L45 50 Z" />
      <path d="M40 55 L60 55" />
      <path d="M42 65 L58 65" />
      <path d="M38 45 L62 45" />
    </g>
  ),
  calculator: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="15" width="50" height="70" rx="4" />
      <rect x="30" y="22" width="40" height="12" />
      <circle cx="37" cy="42" r="3" />
      <circle cx="50" cy="42" r="3" />
      <circle cx="63" cy="42" r="3" />
      <circle cx="37" cy="55" r="3" />
      <circle cx="50" cy="55" r="3" />
      <circle cx="63" cy="55" r="3" />
      <circle cx="37" cy="68" r="3" />
      <circle cx="50" cy="68" r="3" />
      <circle cx="63" cy="68" r="3" />
      <rect x="30" y="75" width="40" height="6" rx="2" />
    </g>
  ),
  cpu: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="30" width="40" height="40" rx="2" />
      <rect x="38" y="38" width="24" height="24" />
      <path d="M30 42 L22 42" />
      <path d="M30 50 L22 50" />
      <path d="M30 58 L22 58" />
      <path d="M70 42 L78 42" />
      <path d="M70 50 L78 50" />
      <path d="M70 58 L78 58" />
      <path d="M42 30 L42 22" />
      <path d="M50 30 L50 22" />
      <path d="M58 30 L58 22" />
      <path d="M42 70 L42 78" />
      <path d="M50 70 L50 78" />
      <path d="M58 70 L58 78" />
    </g>
  ),
  move: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 20 L50 35" />
      <path d="M50 65 L50 80" />
      <path d="M20 50 L35 50" />
      <path d="M65 50 L80 50" />
      <circle cx="50" cy="50" r="15" />
    </g>
  ),
  zap: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="55,15 35,55 50,55 45,85 65,45 50,45" />
    </g>
  ),
  flame: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 15 Q65 35 60 55 Q65 70 50 85 Q35 70 40 55 Q35 35 50 15" />
      <path d="M50 35 Q55 45 52 55 Q55 65 50 72" />
    </g>
  ),
  waves: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 40 Q30 25 50 40 Q70 55 85 40" />
      <path d="M15 55 Q30 40 50 55 Q70 70 85 55" />
      <path d="M15 70 Q30 55 50 70 Q70 85 85 70" />
    </g>
  ),
  orbit: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="50" cy="50" rx="30" ry="12" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="6" />
      <circle cx="72" cy="28" r="4" />
    </g>
  ),
  microscope: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 70 L50 85" />
      <path d="M40 85 L60 85" />
      <path d="M35 70 L65 70" />
      <rect x="42" y="35" width="16" height="35" rx="2" />
      <circle cx="50" cy="25" r="12" />
      <line x1="45" y1="25" x2="55" y2="25" />
    </g>
  ),
  dna: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 20 Q50 35 70 20" />
      <path d="M30 30 Q50 45 70 30" />
      <path d="M30 40 Q50 55 70 40" />
      <path d="M30 50 Q50 65 70 50" />
      <path d="M30 60 Q50 75 70 60" />
      <path d="M30 70 Q50 85 70 70" />
      <line x1="30" y1="20" x2="30" y2="80" />
      <line x1="70" y1="20" x2="70" y2="80" />
    </g>
  ),
  trees: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M35 85 L35 55 L25 45 L35 25 L45 45 L35 55" />
      <path d="M65 85 L65 60 L55 50 L65 35 L75 50 L65 60" />
      <line x1="15" y1="85" x2="85" y2="85" />
    </g>
  ),
  "heart-pulse": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 75 Q20 50 20 35 Q20 20 35 20 Q50 20 50 35 Q50 20 65 20 Q80 20 80 35 Q80 50 50 75" />
      <path d="M20 50 L30 50 L35 35 L40 60 L45 45 L50 50 L80 50" />
    </g>
  ),
  "git-branch": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="35" y1="20" x2="35" y2="45" />
      <circle cx="35" cy="20" r="6" />
      <circle cx="65" cy="50" r="6" />
      <circle cx="35" cy="80" r="6" />
      <path d="M35 45 Q50 45 50 50 Q50 55 65 55" />
    </g>
  ),
  hexagon: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" />
      <circle cx="50" cy="50" r="15" />
    </g>
  ),
  triangle: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="50,15 85,75 15,75" />
      <circle cx="50" cy="55" r="8" />
    </g>
  ),
  activity: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 50 L30 50 L40 25 L50 75 L60 50 L70 50 L85 50" />
    </g>
  ),
  search: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="45" cy="45" r="20" />
      <line x1="60" y1="60" x2="80" y2="80" />
    </g>
  ),
  molecule: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="35" r="8" />
      <circle cx="35" cy="60" r="8" />
      <circle cx="65" cy="60" r="8" />
      <line x1="45" y1="41" x2="40" y2="54" />
      <line x1="55" y1="41" x2="60" y2="54" />
      <line x1="43" y1="60" x2="57" y2="60" />
    </g>
  ),
  function: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 20 L25 55 Q25 75 40 75 L60 75" />
      <path d="M40 20 L40 50" />
      <path d="M60 20 L60 50" />
      <path d="M40 35 L60 35" />
      <text x="70" y="75" fontSize="20" fill="currentColor" stroke="none">f(x)</text>
    </g>
  ),
  "trending-up": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 70 L40 50 L55 60 L80 30" />
      <polyline points="65,30 80,30 80,45" />
      <line x1="15" y1="75" x2="85" y2="75" />
    </g>
  ),
  square: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="20" width="60" height="60" />
      <line x1="20" y1="50" x2="80" y2="50" />
      <line x1="50" y1="20" x2="50" y2="80" />
    </g>
  ),
  circle: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="30" />
      <line x1="50" y1="20" x2="50" y2="80" />
      <line x1="20" y1="50" x2="80" y2="50" />
    </g>
  ),
  "bar-chart": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="15" y1="75" x2="85" y2="75" />
      <rect x="25" y="45" width="10" height="30" />
      <rect x="45" y="30" width="10" height="45" />
      <rect x="65" y="55" width="10" height="20" />
    </g>
  ),
  code: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="30,35 15,50 30,65" />
      <polyline points="70,35 85,50 70,65" />
      <line x1="40" y1="70" x2="60" y2="30" />
    </g>
  ),
  database: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="50" cy="25" rx="25" ry="8" />
      <path d="M25 25 L25 65" />
      <path d="M75 25 L75 65" />
      <ellipse cx="50" cy="45" rx="25" ry="8" />
      <ellipse cx="50" cy="65" rx="25" ry="8" />
    </g>
  ),
  network: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="25" r="8" />
      <circle cx="25" cy="65" r="8" />
      <circle cx="75" cy="65" r="8" />
      <line x1="45" y1="32" x2="30" y2="58" />
      <line x1="55" y1="32" x2="70" y2="58" />
      <line x1="33" y1="65" x2="67" y2="65" />
    </g>
  ),
  workflow: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="20" width="20" height="12" rx="2" />
      <rect x="30" y="44" width="20" height="12" rx="2" />
      <rect x="30" y="68" width="20" height="12" rx="2" />
      <line x1="50" y1="26" x2="60" y2="26" />
      <line x1="60" y1="26" x2="60" y2="50" />
      <line x1="60" y1="50" x2="50" y2="50" />
      <line x1="50" y1="74" x2="60" y2="74" />
      <line x1="60" y1="56" x2="60" y2="74" />
    </g>
  ),
  globe: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="30" />
      <ellipse cx="50" cy="50" rx="12" ry="30" />
      <path d="M25 35 Q50 45 75 35" />
      <path d="M25 65 Q50 55 75 65" />
    </g>
  ),
  "file-text": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 15 L60 15 L70 25 L70 85 L30 85 Z" />
      <polyline points="60,15 60,25 70,25" />
      <line x1="40" y1="40" x2="60" y2="40" />
      <line x1="40" y1="55" x2="60" y2="55" />
      <line x1="40" y1="70" x2="50" y2="70" />
    </g>
  ),
  "play-circle": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="30" />
      <polygon points="42,35 65,50 42,65" />
    </g>
  ),
  "chevron-down": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="25,40 50,60 75,40" />
    </g>
  ),
  "x-icon": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="35" y1="35" x2="65" y2="65" />
      <line x1="65" y1="35" x2="35" y2="65" />
    </g>
  ),
  menu: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="20" y1="35" x2="80" y2="35" />
      <line x1="20" y1="50" x2="80" y2="50" />
      <line x1="20" y1="65" x2="80" y2="65" />
    </g>
  ),
  vault: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="30" width="50" height="40" rx="4" />
      <circle cx="50" cy="50" r="10" />
      <line x1="50" y1="47" x2="50" y2="53" />
      <line x1="47" y1="50" x2="53" y2="50" />
      <line x1="35" y1="20" x2="35" y2="30" />
      <line x1="65" y1="20" x2="65" y2="30" />
    </g>
  ),
  book: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 20 L25 75 Q40 75 50 65 Q60 75 75 75 L75 20" />
      <line x1="25" y1="30" x2="75" y2="30" />
    </g>
  ),
  arrow: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="30" y1="50" x2="70" y2="50" />
      <polyline points="60,40 70,50 60,60" />
    </g>
  ),
  // Mathematical Watermarks for EmeraldMath-style cards
  integral: (
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M55 20 Q45 20 45 30 L45 70 Q45 80 55 80" />
      <path d="M40 25 L30 25" />
      <path d="M40 75 L30 75" />
    </g>
  ),
  derivative: (
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <text x="25" y="65" fontSize="35" fill="currentColor" stroke="none" fontStyle="italic">∂</text>
      <path d="M65 25 L75 25" />
      <line x1="70" y1="20" x2="70" y2="30" />
      <line x1="65" y1="55" x2="75" y2="65" />
    </g>
  ),
  sigma: (
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="35,25 65,25 40,50 65,50 35,75 65,75" />
    </g>
  ),
  infinity: (
    <g stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M35 50 Q45 35 50 50 Q55 65 65 50 Q70 35 65 50 Q60 65 50 50 Q45 35 35 50" />
    </g>
  ),
  distribution: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 60 Q30 20 50 50 Q70 80 85 60" />
      <line x1="15" y1="75" x2="85" y2="75" />
      <line x1="50" y1="50" x2="50" y2="75" />
    </g>
  ),
  "chi-square": (
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <text x="30" y="65" fontSize="30" fill="currentColor" stroke="none" fontFamily="serif">χ²</text>
    </g>
  ),
  velocity: (
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <text x="20" y="60" fontSize="24" fill="currentColor" stroke="none" fontStyle="italic">v</text>
      <path d="M50 40 L75 40" />
      <polygon points="70,35 75,40 70,45" />
      <line x1="50" y1="70" x2="75" y2="70" strokeDasharray="5,3" />
    </g>
  ),
  acceleration: (
    <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <text x="20" y="60" fontSize="24" fill="currentColor" stroke="none" fontStyle="italic">a</text>
      <path d="M50 35 L80 35" />
      <polygon points="75,30 80,35 75,40" />
      <polygon points="75,55 80,60 75,65" />
      <line x1="50" y1="60" x2="80" y2="60" />
    </g>
  ),
  "chevron-right": (
    <g stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="40,35 60,50 40,65" />
    </g>
  ),
  "document-qp": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="15" width="50" height="70" rx="3" />
      <text x="50" y="45" fontSize="16" fill="currentColor" stroke="none" textAnchor="middle" fontWeight="bold">QP</text>
      <line x1="30" y1="55" x2="70" y2="55" />
      <line x1="30" y1="65" x2="60" y2="65" />
    </g>
  ),
  snow: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 20 L50 80" />
      <path d="M20 50 L80 50" />
      <path d="M28 28 L72 72" />
      <path d="M72 28 L28 72" />
      <circle cx="50" cy="50" r="8" />
    </g>
  ),
  sun: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="15" />
      <line x1="50" y1="20" x2="50" y2="10" />
      <line x1="50" y1="80" x2="50" y2="90" />
      <line x1="20" y1="50" x2="10" y2="50" />
      <line x1="80" y1="50" x2="90" y2="50" />
      <line x1="28" y1="28" x2="22" y2="22" />
      <line x1="72" y1="72" x2="78" y2="78" />
      <line x1="28" y1="72" x2="22" y2="78" />
      <line x1="72" y1="28" x2="78" y2="22" />
    </g>
  ),
  "document-ms": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="15" width="50" height="70" rx="3" />
      <text x="50" y="45" fontSize="16" fill="currentColor" stroke="none" textAnchor="middle" fontWeight="bold">MS</text>
      <path d="M35 55 L45 65 L65 45" strokeWidth="2" />
    </g>
  ),
  "document-notes": (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="15" width="50" height="70" rx="3" />
      <text x="50" y="45" fontSize="12" fill="currentColor" stroke="none" textAnchor="middle" fontWeight="bold">NOTES</text>
      <line x1="30" y1="55" x2="70" y2="55" />
      <line x1="30" y1="62" x2="60" y2="62" />
      <line x1="30" y1="69" x2="50" y2="69" />
    </g>
  ),
  eye: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 35 Q65 35 75 50 Q65 65 50 65 Q35 65 25 50 Q35 35 50 35" />
      <circle cx="50" cy="50" r="8" />
    </g>
  ),
  download: (
    <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 25 L50 55" />
      <polyline points="35,45 50,55 65,45" />
      <path d="M35 65 L65 65" />
    </g>
  )
};

export default function Icon({ name, size = 24, className = "", color }: IconProps) {
  const svgContent = iconPaths[name] || iconPaths["vault"];
  
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ color: color || "currentColor" }}
      aria-hidden="true"
    >
      {svgContent}
    </svg>
  );
}
