
import * as React from "react";
import { APP } from "@/utils";

const CabboSplashIllustration = ({ className }) => {
  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="bgGlow" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.10" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <ellipse
        cx="160"
        cy="130"
        rx="120"
        ry="80"
        fill="url(#bgGlow)"
      />

      {/* Abstract cityscape - subtle rectangles */}
      <g opacity="0.10">
        <rect x="40" y="120" width="18" height="60" rx="4" fill="#2563EB" />
        <rect x="70" y="100" width="14" height="80" rx="4" fill="#3B82F6" />
        <rect x="100" y="140" width="10" height="40" rx="4" fill="#60A5FA" />
        <rect x="240" y="110" width="20" height="70" rx="4" fill="#2563EB" />
        <rect x="265" y="90" width="14" height="90" rx="4" fill="#3B82F6" />
      </g>

      {/* Centered cab */}
      <g
        transform="translate(160 150)"
        filter="url(#shadow)"
      >
        {/* Body */}
        <rect
          x="-44"
          y="-16"
          width="88"
          height="32"
          rx="14"
          fill="white"
        />

        {/* Cabin */}
        <path
          d="M-18 -28H18C25 -28 32 -22 36 -12L38 -6H-38L-36 -12C-32 -22 -25 -28 -18 -28Z"
          fill="#E0F2FE"
        />

        {/* Windshield */}
        <path
          d="M-8 -22H8C15 -22 20 -18 24 -10H-24C-20 -18 -15 -22 -8 -22Z"
          fill="#BFDBFE"
        />

        {/* Accent strip */}
        <rect
          x="-44"
          y="-2"
          width="88"
          height="7"
          rx="4"
          fill="#2563EB"
        />

        {/* Wheels */}
        <circle cx="-26" cy="18" r="8" fill="#111827" />
        <circle cx="26" cy="18" r="8" fill="#111827" />

        {/* Wheel hubs */}
        <circle cx="-26" cy="18" r="3" fill="#9CA3AF" />
        <circle cx="26" cy="18" r="3" fill="#9CA3AF" />

        {/* Headlight */}
        <rect
          x="40"
          y="-2"
          width="4"
          height="8"
          rx="2"
          fill="#FDE68A"
        />
      </g>

      {/* Minimal motion streaks */}
      <g opacity="0.13">
        <rect
          x="120"
          y="170"
          width="24"
          height="4"
          rx="2"
          fill="#60A5FA"
        />
        <rect
          x="180"
          y="170"
          width="18"
          height="4"
          rx="2"
          fill="#60A5FA"
        />
      </g>

      {/* CABBO wordmark */}
      <text
        x="160"
        y="240"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        letterSpacing="0.08em"
        fill="#111827"
        fontFamily="Satoshi, Inter, sans-serif"
      >
        {APP.name}
      </text>
    </svg>
  );
};

export { CabboSplashIllustration };