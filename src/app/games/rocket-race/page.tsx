"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Flag } from "lucide-react";
import Confetti from "@/components/Confetti";

const ROCKETS = [
  { id: 1, name: "Đội Đỏ", emoji: "🚀", color: "bg-red-500", text: "text-red-500" },
  { id: 2, name: "Đội Xanh", emoji: "🛸", color: "bg-blue-500", text: "text-blue-500" },
  { id: 3, name: "Đội Vàng", emoji: "🚁", color: "bg-yellow-500", text: "text-yellow-500" },
  { id: 4, name: "Đội Tím", emoji: "🛰️", color: "bg-purple-500", text: "text-purple-500" },
  { id: 5, name: "Đội Lục", emoji: "☄️", color: "bg-green-500", text: "text-green-500" },
];

export default function RocketRace() {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [winner, setWinner] = useState<number | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (type: "whoosh" | "fanfare") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "whoosh") {
      // Wind/whoosh noise approximation using a low frequency sweep
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === "fanfare") {
      osc.type = "square";
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.2); // C#5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.4); // E5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1);
    }
  };

  // Start sequence
  useEffect(() => {
    if (started && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (started && countdown === 0 && winner === null) {
      // Simulation of race
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = { ...prev };
          let isWon = false;
          let winId = null;

          for (let i = 1; i <= 5; i++) {
            // My team is ID 1. Allow user to answer to boost it? 
            // We simulate others. User team advances randomly here unless we hook up questions.
            // Let's just simulate all for now.
            const jump = Math.random() * 5;
            next[i] = Math.min((next[i] || 0) + jump, 100);
            
            if (next[i] >= 100 && !isWon) {
              isWon = true;
              winId = i;
            }
          }

          if (isWon && winId !== null) {
            setWinner(winId);
            playSound("fanfare");
            setConfettiTrigger(prev => prev + 1);
            clearInterval(interval);
          } else {
            // Occasional whoosh
            if (Math.random() > 0.8) playSound("whoosh");
          }

          return next;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [started, countdown, winner]);

  const handleCorrectAnswer = () => {
    if (winner !== null || countdown > 0) return;
    playSound("whoosh");
    setProgress(prev => {
      const next = { ...prev };
      next[1] = Math.min((next[1] || 0) + 15, 100); // Massive boost
      if (next[1] >= 100 && winner === null) {
        setWinner(1);
        playSound("fanfare");
        setConfettiTrigger(prev => prev + 1);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-[24px] overflow-hidden border-[4px] border-slate-700 relative text-white">
      <Confetti trigger={confettiTrigger} />
      
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between z-10 shrink-0 border-b-2 border-slate-700">
        <Link href="/games" className="flex items-center gap-2 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito font-bold text-sm">Thoát</span>
        </Link>
        <h1 className="font-fredoka text-xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
          Đua Tên Lửa (Live)
        </h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Starry background */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Start Overlay */}
        {!started && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-8xl mb-6 animate-bounce-custom">🚀</div>
            <h2 className="text-4xl font-fredoka uppercase mb-8">Sẵn sàng đua?</h2>
            <button 
              onClick={() => setStarted(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-full font-fredoka text-2xl uppercase tracking-widest shadow-[0_6px_0_#991b1b] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3"
            >
              <Play className="w-8 h-8 fill-current" />
              Bắt Đầu Ngay
            </button>
          </div>
        )}

        {/* Countdown Overlay */}
        {started && countdown > 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-9xl font-fredoka animate-pop-custom">{countdown}</span>
          </div>
        )}

        {/* Winner Overlay */}
        {winner !== null && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in-up">
            <span className="text-8xl mb-4 animate-wiggle-custom">{ROCKETS.find(r => r.id === winner)?.emoji}</span>
            <h2 className="text-5xl font-fredoka uppercase mb-2">
              <span className={ROCKETS.find(r => r.id === winner)?.text}>{ROCKETS.find(r => r.id === winner)?.name}</span> Chiến Thắng!
            </h2>
            <button 
              onClick={() => {
                setStarted(false); setCountdown(3); setProgress({1:0, 2:0, 3:0, 4:0, 5:0}); setWinner(null);
              }}
              className="mt-8 bg-white text-slate-900 font-black px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors uppercase"
            >
              Đua Lại
            </button>
          </div>
        )}

        {/* Tracks */}
        <div className="flex-1 p-6 flex flex-col gap-4 relative z-10 justify-center">
          
          {/* Finish Line Indicator */}
          <div className="absolute right-6 top-6 bottom-6 w-8 border-l-4 border-dashed border-white/30 flex flex-col items-center justify-between py-4">
            <Flag className="w-6 h-6 text-white/50" />
            <Flag className="w-6 h-6 text-white/50" />
            <Flag className="w-6 h-6 text-white/50" />
          </div>

          {ROCKETS.map(rocket => (
            <div key={rocket.id} className="relative w-full h-16 bg-slate-800/50 rounded-full border-2 border-slate-700/50 flex items-center px-4">
              {/* Rocket Container moving horizontally */}
              <div 
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 transition-all duration-300 ease-out"
                style={{ left: `calc(${progress[rocket.id] || 0}% - 40px)` }}
              >
                <div className={`w-12 h-12 rounded-full ${rocket.color} flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,255,255,0.2)] border-2 border-white/20`}>
                  {rocket.emoji}
                </div>
              </div>
              {/* Name fixed left */}
              <div className="absolute left-6 font-nunito font-black text-white/30 uppercase text-xs tracking-widest">
                {rocket.name} {rocket.id === 1 && "(Bạn)"}
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel for "Bạn" (Team 1) */}
        {started && countdown === 0 && winner === null && (
          <div className="bg-slate-800 p-6 flex items-center justify-between border-t-2 border-slate-700 z-20">
            <div className="flex-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Câu hỏi tăng tốc</p>
              <h3 className="text-xl font-fredoka">"Tên lửa" tiếng Anh là gì?</h3>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-nunito font-bold transition-colors">A. Airplane</button>
              <button onClick={handleCorrectAnswer} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-nunito font-bold transition-colors">B. Rocket</button>
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-nunito font-bold transition-colors">C. Car</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
