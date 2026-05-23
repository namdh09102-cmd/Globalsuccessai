"use client";

import React, { useState, useEffect } from "react";
import { Medal, Lock } from "lucide-react";

// 9 Badges
const BADGES = [
  { id: 1, name: "Thợ săn Điểm", color: "#FF6B6B", icon: "🎯", reqXp: 100 },
  { id: 2, name: "Vua Phát âm", color: "#4ECDC4", icon: "🎙️", reqXp: 500 },
  { id: 3, name: "Siêu trí nhớ", color: "#FFD166", icon: "🧠", reqXp: 1200 },
  { id: 4, name: "Chiến thần", color: "#9B7FE8", icon: "⚔️", reqXp: 2500 },
  { id: 5, name: "Cú đêm", color: "#3B82F6", icon: "🦉", reqXp: 5000 },
  { id: 6, name: "Lâu đài thép", color: "#F59E0B", icon: "🏰", reqXp: 7500 },
  { id: 7, name: "Tên lửa", color: "#EF4444", icon: "🚀", reqXp: 10000 },
  { id: 8, name: "Ngôi sao", color: "#FBBF24", icon: "⭐", reqXp: 15000 },
  { id: 9, name: "Huyền thoại", color: "#8B5CF6", icon: "👑", reqXp: 20000 },
];

export default function BadgeGrid() {
  const [currentXp, setCurrentXp] = useState(0);

  useEffect(() => {
    const loadXp = () => {
      const stored = localStorage.getItem("gsa-student-stats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentXp(parsed.xp || 0);
        } catch (e) {}
      }
    };
    loadXp();
    window.addEventListener("stats-updated", loadXp);
    return () => window.removeEventListener("stats-updated", loadXp);
  }, []);

  return (
    <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl relative overflow-hidden group hover:border-slate-300/80 transition-all duration-300">
      <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.1)] pb-3 mb-6">
        <Medal className="w-5 h-5 text-purple-500" />
        <h3 className="text-sm font-black uppercase text-text-muted tracking-wider">
          Bộ sưu tập Huy Hiệu
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-6 justify-items-center">
        {BADGES.map((badge) => {
          const isUnlocked = currentXp >= badge.reqXp;
          return (
            <div key={badge.id} className="flex flex-col items-center gap-2 text-center">
              <div 
                className={`relative w-20 h-24 flex items-center justify-center transition-all duration-500 ${isUnlocked ? 'hover:scale-110 drop-shadow-xl' : 'grayscale opacity-50'}`}
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  backgroundColor: isUnlocked ? badge.color : '#e2e8f0'
                }}
              >
                {/* Inner smaller hexagon for border effect */}
                <div 
                  className="absolute inset-[3px] bg-white/20 flex items-center justify-center"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  <div className="text-3xl relative z-10 drop-shadow-md">
                    {badge.icon}
                  </div>
                </div>

                {isUnlocked && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 animate-shimmer-custom" />
                )}
                
                {!isUnlocked && (
                  <div className="absolute bottom-2 right-2 bg-slate-800 text-white p-1 rounded-full z-20">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>
              
              <div>
                <span className={`block font-fredoka text-[11px] ${isUnlocked ? 'text-primary-dark' : 'text-slate-400'}`}>
                  {badge.name}
                </span>
                <span className="text-[9px] font-nunito font-bold text-text-muted">
                  {badge.reqXp} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
