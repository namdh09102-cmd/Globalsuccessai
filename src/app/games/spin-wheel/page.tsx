"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";
import Confetti from "@/components/Confetti";

const SEGMENTS = [
  { label: "2x XP", color: "#FF6B6B" },
  { label: "Skin Mới", color: "#4ECDC4" },
  { label: "10 Kim cương", color: "#FFD166" },
  { label: "Trượt rồi!", color: "#A0AEC0" },
  { label: "Huy hiệu Ẩn", color: "#9B7FE8" },
  { label: "50 XP", color: "#FF6B9D" },
];

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;

    // Check XP in real scenario, mock deduct 100 XP here
    const stored = localStorage.getItem("gsa-student-stats");
    if (stored) {
      try {
        const stats = JSON.parse(stored);
        if (stats.xp < 100) {
          alert("Bạn không đủ 100 XP để quay!");
          return;
        }
        stats.xp -= 100;
        localStorage.setItem("gsa-student-stats", JSON.stringify(stats));
        window.dispatchEvent(new Event("stats-updated"));
      } catch (e) {}
    }

    setIsSpinning(true);
    setResult(null);

    // Calculate random landing segment
    const targetSegmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    // Base rotations (3 to 5 full spins)
    const extraSpins = (Math.floor(Math.random() * 3) + 3) * 360; 
    // Target angle (we need the top pointer to land on the segment)
    // Offset by segmentAngle/2 so it lands in the middle of a slice
    const targetAngle = extraSpins + (360 - (targetSegmentIndex * segmentAngle)) - (segmentAngle / 2);

    setRotation(prev => prev + targetAngle + (3600 - (prev % 360))); // ensure it always adds up clean

    setTimeout(() => {
      setIsSpinning(false);
      setResult(SEGMENTS[targetSegmentIndex].label);
      if (SEGMENTS[targetSegmentIndex].label !== "Trượt rồi!") {
        setConfettiTrigger(prev => prev + 1);
        
        // Add reward mock
        if (SEGMENTS[targetSegmentIndex].label === "50 XP") {
          const statsStr = localStorage.getItem("gsa-student-stats");
          if (statsStr) {
            try {
              const s = JSON.parse(statsStr);
              s.xp += 50;
              localStorage.setItem("gsa-student-stats", JSON.stringify(s));
              window.dispatchEvent(new Event("stats-updated"));
            } catch (e) {}
          }
        } else if (SEGMENTS[targetSegmentIndex].label === "10 Kim cương") {
          const statsStr = localStorage.getItem("gsa-student-stats");
          if (statsStr) {
            try {
              const s = JSON.parse(statsStr);
              s.diamonds += 10;
              localStorage.setItem("gsa-student-stats", JSON.stringify(s));
              window.dispatchEvent(new Event("stats-updated"));
            } catch (e) {}
          }
        }
      }
    }, 4000); // matches CSS transition duration
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-[24px] overflow-hidden border-[4px] border-purple-500 relative">
      <Confetti trigger={confettiTrigger} />
      
      {/* Header */}
      <div className="bg-purple-500 text-white p-4 flex items-center justify-between z-10 shrink-0">
        <Link href="/games" className="flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito font-bold text-sm">Thoát</span>
        </Link>
        <h1 className="font-fredoka text-xl uppercase tracking-wider flex items-center gap-2">
          <Ticket className="w-5 h-5" /> Quay May Mắn
        </h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative p-6 bg-purple-50/50">
        
        {/* Pointer */}
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-purple-700 absolute top-[10%] z-20 drop-shadow-md" />

        {/* Wheel */}
        <div 
          className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-[8px] border-white shadow-[0_10px_0_rgba(0,0,0,0.1)] overflow-hidden"
          style={{ 
            transition: 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            transform: `rotate(${rotation}deg)` 
          }}
        >
          {SEGMENTS.map((seg, i) => {
            const angle = 360 / SEGMENTS.length;
            const skew = 90 - angle;
            return (
              <div 
                key={i} 
                className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
                style={{ 
                  backgroundColor: seg.color,
                  transform: `rotate(${i * angle}deg) skewY(-${skew}deg)`,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div 
                  className="absolute bottom-0 left-0 w-full text-white font-fredoka text-[14px] md:text-lg text-center"
                  style={{
                    transform: `skewY(${skew}deg) rotate(${angle/2}deg) translateY(-80px)`,
                    transformOrigin: '0 0'
                  }}
                >
                  <span className="block drop-shadow-md w-[100px] -ml-[20px]">{seg.label}</span>
                </div>
              </div>
            );
          })}
          {/* Inner circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-[4px] border-purple-200 shadow-inner z-10 flex items-center justify-center text-2xl">
            ⭐
          </div>
        </div>

        {/* Spin Button */}
        <div className="mt-12 text-center">
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-12 py-4 rounded-full font-fredoka text-2xl shadow-[0_6px_0_#581c87] active:translate-y-2 active:shadow-none transition-all tracking-wide uppercase"
          >
            Quay Ngay (-100 XP)
          </button>
        </div>

        {/* Result Modal */}
        {result && !isSpinning && (
          <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-sm animate-fade-in-up px-4">
            <div className="bg-white rounded-[24px] border-[4px] border-purple-500 p-8 max-w-sm w-full text-center shadow-2xl animate-pop-custom">
              <div className="text-6xl mb-4">
                {result === "Trượt rồi!" ? "😢" : "🎁"}
              </div>
              <h2 className="font-fredoka text-3xl mb-2 text-primary-dark">Kết Quả!</h2>
              <p className="font-nunito font-black text-2xl text-purple-600 mb-8 bg-purple-100 py-3 rounded-xl border-2 border-purple-200">
                {result}
              </p>
              <button 
                onClick={() => setResult(null)}
                className="w-full py-3 rounded-xl font-fredoka text-white bg-purple-500 shadow-[0_4px_0_#6b21a8] hover:translate-y-0.5 hover:shadow-[0_2px_0_#6b21a8] transition-all uppercase tracking-wide text-lg"
              >
                Tiếp Tục
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
