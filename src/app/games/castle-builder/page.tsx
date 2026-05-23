"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Confetti from "@/components/Confetti";

export default function CastleBuilder() {
  const [bricks, setBricks] = useState(0);
  const totalBricks = 20;
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Simulate other students answering
  useEffect(() => {
    if (bricks < totalBricks) {
      const interval = setInterval(() => {
        if (Math.random() > 0.5) {
          setBricks(prev => Math.min(prev + 1, totalBricks));
        }
      }, 2000);
      return () => clearInterval(interval);
    } else if (bricks === totalBricks && confettiTrigger === 0) {
      setConfettiTrigger(prev => prev + 1);
      // Award XP
      const storedStats = localStorage.getItem("gsa-student-stats");
      if (storedStats) {
        try {
          const stats = JSON.parse(storedStats);
          stats.xp += 20; // 20 XP for class completion
          localStorage.setItem("gsa-student-stats", JSON.stringify(stats));
          window.dispatchEvent(new Event("stats-updated"));
        } catch (e) {}
      }
    }
  }, [bricks, confettiTrigger]);

  const handleCorrectAnswer = () => {
    if (bricks < totalBricks) {
      setBricks(prev => Math.min(prev + 1, totalBricks));
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-[24px] overflow-hidden border-[4px] border-amber-500 relative">
      <Confetti trigger={confettiTrigger} />
      
      {/* Header */}
      <div className="bg-amber-500 text-white p-4 flex items-center justify-between z-10 shrink-0">
        <Link href="/games" className="flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito font-bold text-sm">Thoát</span>
        </Link>
        <h1 className="font-fredoka text-xl uppercase tracking-wider">Xây Lâu Đài (Cả lớp)</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-8">
        
        {/* Left: Building Zone */}
        <div className="flex-1 bg-blue-50/50 rounded-[20px] border-2 border-blue-100 flex flex-col items-center justify-end p-8 relative overflow-hidden">
          {/* Progress Banner */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-md border-2 border-amber-300 text-center">
            <p className="text-[10px] uppercase font-black text-amber-500 mb-1 tracking-widest">Tiến độ xây dựng</p>
            <p className="font-fredoka text-xl text-text-head">
              Lớp đã xây <span className="text-amber-500">{bricks}</span>/<span className="text-text-muted">{totalBricks}</span> viên gạch!
            </p>
          </div>

          {/* Castle Grid */}
          <div className="w-[300px] h-[300px] flex flex-wrap-reverse content-start gap-1 p-4 relative">
            {/* Draw total brick slots faintly */}
            {[...Array(totalBricks)].map((_, i) => (
              <div key={`slot-${i}`} className="w-[50px] h-[30px] border-2 border-dashed border-amber-200 rounded opacity-50" />
            ))}

            {/* Draw actual bricks on top */}
            <div className="absolute inset-4 flex flex-wrap-reverse content-start gap-1">
              {[...Array(bricks)].map((_, i) => (
                <div 
                  key={`brick-${i}`} 
                  className="w-[50px] h-[30px] bg-amber-400 border-2 border-amber-600 rounded animate-bounce-custom"
                  style={{ animationIterationCount: 1, boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)' }}
                >
                  <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }} />
                </div>
              ))}
            </div>
            
            {bricks === totalBricks && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <span className="text-6xl animate-pop-custom">🏰</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interaction Zone */}
        <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-[20px] border-[3px] border-[rgba(0,0,0,0.1)] p-6 shadow-sm">
            <h3 className="font-fredoka text-lg text-text-head mb-4 text-center">Câu hỏi mô phỏng</h3>
            <p className="font-nunito font-bold text-sm text-text-body mb-6 text-center">
              "How do you say 'Lâu đài' in English?"
            </p>
            <div className="space-y-3">
              <button onClick={handleCorrectAnswer} className="w-full p-4 rounded-xl border-2 border-[rgba(0,0,0,0.1)] hover:border-success hover:bg-success-light text-left font-nunito font-bold transition-colors">
                A. Castle
              </button>
              <button className="w-full p-4 rounded-xl border-2 border-[rgba(0,0,0,0.1)] hover:border-primary hover:bg-primary-light text-left font-nunito font-bold transition-colors">
                B. House
              </button>
              <button className="w-full p-4 rounded-xl border-2 border-[rgba(0,0,0,0.1)] hover:border-primary hover:bg-primary-light text-left font-nunito font-bold transition-colors">
                C. Building
              </button>
            </div>
          </div>
          
          {bricks === totalBricks && (
            <div className="bg-success text-white rounded-[20px] p-6 text-center shadow-lg animate-fade-in-up">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 animate-bounce-custom" />
              <h3 className="font-fredoka text-2xl mb-1">Hoàn Thành!</h3>
              <p className="font-nunito font-bold text-sm opacity-90">+20 XP cho cả lớp</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
