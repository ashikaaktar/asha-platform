"use client";

import React from "react";

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  driftX: number;
}

// 28 static-hydrated sparkling particles & luminous grains (ছোট ছোট আলোকিত দানা)
const PARTICLES: Particle[] = [
  { id: 1, left: 8, top: 22, size: 2.4, duration: 7, delay: 0.2, color: "#38BDF8", driftX: 20 },
  { id: 2, left: 16, top: 45, size: 1.8, duration: 8.5, delay: 1.1, color: "#C084FC", driftX: -15 },
  { id: 3, left: 23, top: 14, size: 2.8, duration: 6.5, delay: 2.3, color: "#FFFFFF", driftX: 25 },
  { id: 4, left: 32, top: 62, size: 2.0, duration: 9, delay: 0.7, color: "#A855F7", driftX: -20 },
  { id: 5, left: 41, top: 28, size: 2.5, duration: 7.5, delay: 1.8, color: "#38BDF8", driftX: 18 },
  { id: 6, left: 49, top: 78, size: 1.6, duration: 10, delay: 0.4, color: "#C084FC", driftX: -25 },
  { id: 7, left: 58, top: 18, size: 2.2, duration: 8, delay: 2.8, color: "#8B35FF", driftX: 22 },
  { id: 8, left: 66, top: 52, size: 2.6, duration: 7.2, delay: 1.3, color: "#38BDF8", driftX: -18 },
  { id: 9, left: 74, top: 32, size: 1.9, duration: 9.2, delay: 0.5, color: "#FFFFFF", driftX: 15 },
  { id: 10, left: 83, top: 68, size: 2.3, duration: 8.2, delay: 2.1, color: "#C084FC", driftX: -22 },
  { id: 11, left: 92, top: 24, size: 2.0, duration: 7.8, delay: 1.6, color: "#38BDF8", driftX: 18 },
  { id: 12, left: 12, top: 72, size: 2.5, duration: 8.8, delay: 3.2, color: "#A855F7", driftX: -15 },
  { id: 13, left: 27, top: 88, size: 1.7, duration: 9.5, delay: 0.9, color: "#38BDF8", driftX: 20 },
  { id: 14, left: 37, top: 40, size: 2.4, duration: 7.0, delay: 2.5, color: "#FFFFFF", driftX: -20 },
  { id: 15, left: 53, top: 92, size: 2.1, duration: 8.6, delay: 1.4, color: "#C084FC", driftX: 15 },
  { id: 16, left: 62, top: 36, size: 1.8, duration: 9.8, delay: 3.0, color: "#8B35FF", driftX: -18 },
  { id: 17, left: 71, top: 82, size: 2.7, duration: 6.8, delay: 0.3, color: "#38BDF8", driftX: 24 },
  { id: 18, left: 79, top: 12, size: 2.2, duration: 8.4, delay: 2.0, color: "#FFFFFF", driftX: -16 },
  { id: 19, left: 88, top: 56, size: 1.9, duration: 9.0, delay: 1.7, color: "#C084FC", driftX: 20 },
  { id: 20, left: 96, top: 84, size: 2.3, duration: 7.6, delay: 2.7, color: "#38BDF8", driftX: -22 },
  { id: 21, left: 5, top: 58, size: 1.5, duration: 10.5, delay: 1.0, color: "#A855F7", driftX: 16 },
  { id: 22, left: 19, top: 30, size: 2.6, duration: 7.4, delay: 2.9, color: "#38BDF8", driftX: -20 },
  { id: 23, left: 45, top: 10, size: 2.0, duration: 8.2, delay: 0.8, color: "#FFFFFF", driftX: 22 },
  { id: 24, left: 55, top: 64, size: 2.4, duration: 7.9, delay: 3.4, color: "#C084FC", driftX: -18 },
  { id: 25, left: 68, top: 95, size: 1.8, duration: 9.1, delay: 1.5, color: "#38BDF8", driftX: 18 },
  { id: 26, left: 86, top: 42, size: 2.5, duration: 6.9, delay: 2.2, color: "#8B35FF", driftX: -25 },
  { id: 27, left: 34, top: 96, size: 2.2, duration: 8.7, delay: 0.6, color: "#FFFFFF", driftX: 16 },
  { id: 28, left: 94, top: 48, size: 1.7, duration: 10.0, delay: 3.1, color: "#C084FC", driftX: -14 },
];

// Twinkling 4-Point Stars
const STARS = [
  { x: 14, y: 18, s: 13, d: "0s", c: "#38BDF8" },
  { x: 86, y: 15, s: 15, d: "1.4s", c: "#C084FC" },
  { x: 25, y: 55, s: 12, d: "2.5s", c: "#FFFFFF" },
  { x: 78, y: 65, s: 14, d: "0.9s", c: "#38BDF8" },
  { x: 48, y: 84, s: 11, d: "2.1s", c: "#A855F7" },
  { x: 64, y: 28, s: 13, d: "3.2s", c: "#38BDF8" },
  { x: 92, y: 76, s: 12, d: "1.7s", c: "#FFFFFF" },
];

export default function FloatingAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-[60] select-none"
    >
      {/* ----------------------------------------------------------------- */}
      {/* 1. DEEP NAVY BLUE & ROYAL PURPLE AMBIENT LIGHTING MESH            */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-[#1E1B4B]/35 to-[#3B82F6]/15 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#0284C7]/15 blur-[130px]" />
      <div className="absolute bottom-10 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#6D28D9]/25 to-[#0F172A]/30 blur-[120px]" />

      {/* ----------------------------------------------------------------- */}
      {/* 2. ELEGANT GLOWING BIRDS (মাঝে মাঝে পাখির মতো উড়ে ঘুড়ে বেড়াবে)  */}
      {/* ----------------------------------------------------------------- */}
      {/* Bird 1: High Soaring (Left to Right) */}
      <div className="absolute top-0 left-0 animate-fly-1 opacity-90 drop-shadow-[0_0_12px_rgba(56,189,248,0.85)]">
        <svg viewBox="0 0 64 40" className="w-10 h-7 sm:w-12 sm:h-8">
          <defs>
            <linearGradient id="birdGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#8B35FF" />
            </linearGradient>
          </defs>
          {/* Bird Body & Head */}
          <ellipse cx="28" cy="20" rx="8" ry="3" fill="#FFFFFF" opacity="0.95" />
          <polygon points="35,20 42,20.5 35,22" fill="#38BDF8" />
          {/* Swallow Tail */}
          <polygon points="21,20 12,14 17,20 12,26" fill="url(#birdGrad1)" opacity="0.9" />
          {/* Left Wing (Upper Flap) */}
          <path
            d="M 26 19 C 20 8, 10 2, 2 5 C 10 14, 20 18, 26 19 Z"
            fill="url(#birdGrad1)"
            className="animate-wing-left"
          />
          {/* Right Wing (Lower Flap) */}
          <path
            d="M 26 21 C 20 32, 10 38, 2 35 C 10 26, 20 22, 26 21 Z"
            fill="url(#birdGrad1)"
            className="animate-wing-right"
          />
        </svg>
      </div>

      {/* Bird 2: Companion Soaring slightly behind Bird 1 */}
      <div className="absolute top-0 left-0 animate-fly-follower opacity-80 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]">
        <svg viewBox="0 0 64 40" className="w-8 h-6 sm:w-9 sm:h-7">
          <defs>
            <linearGradient id="birdGradFollower" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <ellipse cx="28" cy="20" rx="6.5" ry="2.5" fill="#FFFFFF" opacity="0.9" />
          <polygon points="34,20 40,20.5 34,21.5" fill="#38BDF8" />
          <polygon points="22,20 14,15 18,20 14,25" fill="url(#birdGradFollower)" />
          <path
            d="M 26 19 C 20 8, 10 2, 2 5 C 10 14, 20 18, 26 19 Z"
            fill="url(#birdGradFollower)"
            className="animate-wing-left"
          />
          <path
            d="M 26 21 C 20 32, 10 38, 2 35 C 10 26, 20 22, 26 21 Z"
            fill="url(#birdGradFollower)"
            className="animate-wing-right"
          />
        </svg>
      </div>

      {/* Bird 3: Mid-Height Cross (Right to Left) */}
      <div className="absolute top-0 left-0 animate-fly-2 opacity-85 drop-shadow-[0_0_12px_rgba(168,85,247,0.85)]">
        <svg viewBox="0 0 64 40" className="w-10 h-7 sm:w-11 sm:h-8">
          <defs>
            <linearGradient id="birdGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B35FF" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <ellipse cx="28" cy="20" rx="7.5" ry="2.8" fill="#FFFFFF" opacity="0.95" />
          <polygon points="35,20 42,20.5 35,22" fill="#8B35FF" />
          <polygon points="21,20 12,14 17,20 12,26" fill="url(#birdGrad2)" />
          <path
            d="M 26 19 C 20 8, 10 2, 2 5 C 10 14, 20 18, 26 19 Z"
            fill="url(#birdGrad2)"
            className="animate-wing-left"
          />
          <path
            d="M 26 21 C 20 32, 10 38, 2 35 C 10 26, 20 22, 26 21 Z"
            fill="url(#birdGrad2)"
            className="animate-wing-right"
          />
        </svg>
      </div>

      {/* Bird 4: Diagonal Soar (Bottom Left to Top Right) */}
      <div className="absolute top-0 left-0 animate-fly-3 opacity-80 drop-shadow-[0_0_10px_rgba(56,189,248,0.75)]">
        <svg viewBox="0 0 64 40" className="w-9 h-6 sm:w-10 sm:h-7">
          <defs>
            <linearGradient id="birdGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <ellipse cx="28" cy="20" rx="7" ry="2.6" fill="#FFFFFF" opacity="0.9" />
          <polygon points="35,20 41,20.5 35,21.5" fill="#38BDF8" />
          <polygon points="21,20 13,15 17,20 13,25" fill="url(#birdGrad3)" />
          <path
            d="M 26 19 C 20 8, 10 2, 2 5 C 10 14, 20 18, 26 19 Z"
            fill="url(#birdGrad3)"
            className="animate-wing-left"
          />
          <path
            d="M 26 21 C 20 32, 10 38, 2 35 C 10 26, 20 22, 26 21 Z"
            fill="url(#birdGrad3)"
            className="animate-wing-right"
          />
        </svg>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. FLOATING SPARKLING PARTICLES & GRAINS (ছোট ছোট আলোকিত দানা)   */}
      {/* ----------------------------------------------------------------- */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-particle-drift"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--drift-x" as any]: `${p.driftX}px`,
          }}
        />
      ))}

      {/* ----------------------------------------------------------------- */}
      {/* 4. TWINKLING 4-POINT STAR GEMS                                    */}
      {/* ----------------------------------------------------------------- */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.s}px`,
            height: `${star.s}px`,
            animationDelay: star.d,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full drop-shadow-[0_0_6px_currentColor]"
            style={{ color: star.c }}
            fill="currentColor"
          >
            <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
