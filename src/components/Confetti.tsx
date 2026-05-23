"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle";
  rotation: number;
  speed: number;
  delay: number;
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD166", "#6BCB77", "#9B7FE8", "#FF6B9D"];

export default function Confetti({ trigger, onComplete }: { trigger: number, onComplete?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 80; i++) {
        newParticles.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 60, // Top center spread
          y: -10,
          size: Math.floor(Math.random() * (14 - 6 + 1) + 6), // 6px to 14px
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as "circle" | "square" | "triangle",
          rotation: Math.random() * 360,
          speed: 1 + Math.random() * 1.5,
          delay: Math.random() * 0.5
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 3000); // Wait for animations to finish

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => {
        const isTriangle = p.shape === "triangle";
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: `${p.y}%`,
              left: `${p.x}%`,
              width: isTriangle ? "0" : `${p.size}px`,
              height: isTriangle ? "0" : `${p.size}px`,
              backgroundColor: isTriangle ? "transparent" : p.color,
              borderLeft: isTriangle ? `${p.size / 2}px solid transparent` : "none",
              borderRight: isTriangle ? `${p.size / 2}px solid transparent` : "none",
              borderBottom: isTriangle ? `${p.size}px solid ${p.color}` : "none",
              borderRadius: p.shape === "circle" ? "50%" : "0",
              animation: `confettiFall ${2.5 / p.speed}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
              transform: `rotate(${p.rotation}deg)`
            }}
          />
        );
      })}
    </div>
  );
}
