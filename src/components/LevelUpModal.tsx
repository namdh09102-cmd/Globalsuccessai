"use client";

import React, { useEffect, useState } from "react";
import Confetti from "./Confetti";

const LEVEL_THRESHOLDS = [500, 1200, 2500, 5000, 10000];

export default function LevelUpModal() {
  const [levelUpData, setLevelUpData] = useState<{ level: number; xp: number } | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => {
    let lastLevel = getLevelFromXP(0);
    
    // Initial load to set baseline
    const stored = localStorage.getItem("gsa-student-stats");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        lastLevel = getLevelFromXP(parsed.xp || 0);
      } catch (e) {}
    }

    const checkLevelUp = () => {
      const currentStored = localStorage.getItem("gsa-student-stats");
      if (currentStored) {
        try {
          const parsed = JSON.parse(currentStored);
          const currentXP = parsed.xp || 0;
          const currentLevel = getLevelFromXP(currentXP);

          if (currentLevel > lastLevel) {
            // Leveled up!
            setLevelUpData({ level: currentLevel, xp: currentXP });
            setConfettiTrigger(prev => prev + 1);
            lastLevel = currentLevel;
          }
        } catch (e) {}
      }
    };

    window.addEventListener("stats-updated", checkLevelUp);
    return () => window.removeEventListener("stats-updated", checkLevelUp);
  }, []);

  const getLevelFromXP = (xp: number) => {
    let level = 1;
    for (const threshold of LEVEL_THRESHOLDS) {
      if (xp >= threshold) {
        level++;
      } else {
        break;
      }
    }
    return level;
  };

  if (!levelUpData) return null;

  return (
    <>
      <Confetti trigger={confettiTrigger} />
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        {/* Backdrop burst */}
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-pop-custom" />
        
        {/* Modal Content */}
        <div className="relative bg-white rounded-[24px] border-[4px] border-xp p-10 text-center shadow-[0_10px_0_var(--c-xp-dark)] max-w-md w-full animate-bounce-custom flex flex-col items-center">
          <div className="absolute -top-16 text-8xl animate-wiggle-custom">🚀</div>
          
          <h2 className="text-primary-dark font-fredoka text-[48px] uppercase leading-none mt-8 tracking-wide drop-shadow-md">
            Level Up!
          </h2>
          
          <div className="mt-4 bg-xp-light border-[2px] border-xp-dark rounded-[999px] px-6 py-2 text-xp-text font-nunito font-black text-xl shadow-inner">
            Cấp {levelUpData.level}
          </div>
          
          <p className="mt-4 text-text-body font-nunito font-bold text-sm">
            Chúc mừng! Bạn đã đạt {levelUpData.xp.toLocaleString()} XP và chính thức thăng cấp!
          </p>

          <button
            onClick={() => setLevelUpData(null)}
            className="mt-8 bg-success hover:bg-success-dark text-white font-fredoka text-xl px-10 py-3 rounded-[18px] border-[2px] border-success-dark shadow-[0_5px_0_var(--c-success-dark)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider"
          >
            Tiếp Tục
          </button>
        </div>
      </div>
    </>
  );
}
