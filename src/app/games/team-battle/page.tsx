"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import Confetti from "@/components/Confetti";

export default function TeamBattle() {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [redScore, setRedScore] = useState(500); // Out of 1000 total (middle is 500)
  const [winner, setWinner] = useState<"Red" | "Blue" | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [showConsolation, setShowConsolation] = useState(false);

  // Simulation
  useEffect(() => {
    if (started && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (started && countdown === 0 && !winner) {
      const interval = setInterval(() => {
        setRedScore(prev => {
          // Random walk with slight bias or equal chance
          const jump = (Math.random() - 0.5) * 50;
          const next = prev + jump;
          
          if (next >= 1000 && !winner) {
            setWinner("Red");
            setConfettiTrigger(p => p + 1);
            clearInterval(interval);
          } else if (next <= 0 && !winner) {
            setWinner("Blue");
            setConfettiTrigger(p => p + 1);
            clearInterval(interval);
          }
          
          // clamp
          return Math.max(0, Math.min(1000, next));
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started, countdown, winner]);

  const handleCheer = () => {
    // Play cheer sound
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);

    // Give slight boost to blue (assuming user is blue for this demo)
    if (winner === null) {
      setRedScore(prev => Math.max(0, prev - 20));
    }
  };

  const winPercentageRed = (redScore / 1000) * 100;

  return (
    <div className="h-full flex flex-col bg-card rounded-[24px] overflow-hidden border-[4px] border-teal-500 relative">
      <Confetti trigger={confettiTrigger} />
      
      {/* Header */}
      <div className="bg-teal-500 text-white p-4 flex items-center justify-between z-10 shrink-0">
        <Link href="/games" className="flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito font-bold text-sm">Thoát</span>
        </Link>
        <h1 className="font-fredoka text-xl uppercase tracking-wider flex items-center gap-2">
          <Users className="w-5 h-5" /> Đội Đấu Đội
        </h1>
        <div className="w-16" />
      </div>

      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-teal-50/50 p-6">
          <div className="text-8xl mb-6 animate-bounce-custom">⚔️</div>
          <h2 className="text-4xl font-fredoka uppercase text-teal-800 mb-8 text-center">Đại Chiến 2 Phe</h2>
          <div className="flex gap-8 mb-10 w-full max-w-md">
            <div className="flex-1 bg-red-100 border-[3px] border-red-500 rounded-2xl p-6 text-center shadow-md">
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-fredoka text-xl text-red-700 uppercase">Đội Đỏ</h3>
            </div>
            <div className="flex-1 bg-blue-100 border-[3px] border-blue-500 rounded-2xl p-6 text-center shadow-md relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded">Bạn ở đây</div>
              <div className="text-4xl mb-2">💧</div>
              <h3 className="font-fredoka text-xl text-blue-700 uppercase">Đội Xanh</h3>
            </div>
          </div>
          <button 
            onClick={() => setStarted(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-full font-fredoka text-2xl uppercase tracking-widest shadow-[0_6px_0_#0f766e] active:translate-y-2 active:shadow-none transition-all"
          >
            Vào Trận
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative bg-page">
          
          {/* Countdown Overlay */}
          {countdown > 0 && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="text-9xl font-fredoka text-white animate-pop-custom">{countdown}</span>
            </div>
          )}

          {/* Tug of war bar */}
          <div className="w-full h-12 bg-white flex relative border-b-[4px] border-[rgba(0,0,0,0.1)] shrink-0">
            {/* Red side */}
            <div 
              className="h-full bg-red-500 transition-all duration-300 relative"
              style={{ width: `${winPercentageRed}%` }}
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px' }} />
            </div>
            {/* Blue side */}
            <div 
              className="h-full bg-blue-500 transition-all duration-300 relative"
              style={{ width: `${100 - winPercentageRed}%` }}
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(-45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px' }} />
            </div>
            
            {/* Center indicator */}
            <div className="absolute top-0 bottom-0 w-2 bg-yellow-400 left-[50%] -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(250,204,21,1)]" />
            
            {/* Marker moving */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-gray-800 z-20 flex items-center justify-center shadow-lg transition-all duration-300"
              style={{ left: `calc(${winPercentageRed}% - 16px)` }}
            >
              ⚔️
            </div>
          </div>

          {/* Main Play Area */}
          <div className="flex-1 flex flex-col md:flex-row relative">
            {/* Red Team Area */}
            <div className="flex-1 bg-red-50 p-6 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-[rgba(0,0,0,0.1)] relative">
              <span className="absolute top-4 left-4 font-fredoka text-2xl text-red-300 opacity-50 uppercase">Đội Đỏ</span>
              <div className="grid grid-cols-3 gap-4 opacity-50 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-white rounded-full border-2 border-red-200 flex items-center justify-center text-xl shadow-sm animate-float-custom" style={{ animationDelay: `${i * 0.2}s` }}>
                    {['🧑', '👧', '👦', '👨', '👩'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
            </div>

            {/* Blue Team Area (You) */}
            <div className="flex-1 bg-blue-50 p-6 flex flex-col items-center justify-center relative">
              <span className="absolute top-4 right-4 font-fredoka text-2xl text-blue-300 opacity-50 uppercase">Đội Xanh</span>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(8)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={handleCheer}
                    className="w-12 h-12 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center text-xl shadow-sm hover:scale-110 active:scale-95 transition-transform animate-float-custom" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {['🧑', '👧', '👦', '👨', '👩'][Math.floor(Math.random() * 5)]}
                  </button>
                ))}
                {/* You */}
                <button 
                  onClick={handleCheer}
                  className="w-12 h-12 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xl shadow-[0_4px_0_#1d4ed8] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all z-10"
                >
                  🦖
                </button>
              </div>
              <p className="mt-8 text-sm font-nunito font-bold text-blue-600 text-center bg-blue-100 px-4 py-2 rounded-full">
                Nhấp vào avatar để Cổ Vũ đội nhà! 👏
              </p>
            </div>

            {/* Winner / Consolation Overlay */}
            {winner && (
              <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center backdrop-blur-sm animate-fade-in-up p-4">
                {!showConsolation ? (
                  <div className="bg-white rounded-[24px] border-[4px] border-primary-dark p-8 max-w-md w-full text-center shadow-2xl">
                    <span className="text-8xl mb-4 animate-bounce-custom">
                      {winner === "Blue" ? "🏆" : "😭"}
                    </span>
                    <h2 className={`text-4xl font-fredoka uppercase mb-2 ${winner === "Blue" ? "text-blue-600" : "text-red-600"}`}>
                      Đội {winner === "Blue" ? "Xanh" : "Đỏ"} Thắng!
                    </h2>
                    
                    {winner === "Blue" ? (
                      <p className="font-nunito font-bold text-text-body mb-6">
                        Tuyệt vời! Đội bạn đã áp đảo đối thủ! +100 XP
                      </p>
                    ) : (
                      <p className="font-nunito font-bold text-text-body mb-6">
                        Đội Xanh đã thua cuộc... Nhưng đừng lo!
                      </p>
                    )}

                    <div className="flex gap-4">
                      {winner === "Blue" ? (
                        <Link href="/games" className="flex-1 py-3 rounded-xl font-fredoka text-white bg-blue-500 shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all uppercase">
                          Nhận Thưởng
                        </Link>
                      ) : (
                        <button 
                          onClick={() => setShowConsolation(true)}
                          className="flex-1 py-3 rounded-xl font-fredoka text-white bg-amber-500 shadow-[0_4px_0_#d97706] hover:translate-y-0.5 transition-all uppercase"
                        >
                          Làm Nhiệm Vụ Gỡ Điểm
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-[24px] border-[4px] border-amber-500 p-8 max-w-md w-full text-center shadow-2xl animate-pop-custom">
                    <h2 className="text-2xl font-fredoka uppercase mb-4 text-amber-600">Nhiệm Vụ Gỡ Điểm</h2>
                    <p className="font-nunito font-bold text-sm text-text-muted mb-6">
                      Trả lời đúng 3 câu hỏi để nhận phần quà an ủi 20 XP.
                    </p>
                    <div className="space-y-3 mb-6">
                      <button className="w-full p-3 bg-page border-2 border-[rgba(0,0,0,0.1)] rounded-xl font-nunito font-bold hover:bg-amber-50 transition-colors">Câu hỏi 1...</button>
                      <button className="w-full p-3 bg-page border-2 border-[rgba(0,0,0,0.1)] rounded-xl font-nunito font-bold hover:bg-amber-50 transition-colors">Câu hỏi 2...</button>
                      <button className="w-full p-3 bg-page border-2 border-[rgba(0,0,0,0.1)] rounded-xl font-nunito font-bold hover:bg-amber-50 transition-colors">Câu hỏi 3...</button>
                    </div>
                    <Link href="/games" className="inline-block px-8 py-3 rounded-xl font-fredoka text-text-muted bg-page hover:bg-gray-200 transition-colors uppercase">
                      Bỏ qua
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
