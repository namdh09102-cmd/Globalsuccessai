"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, User } from "lucide-react";
import Confetti from "@/components/Confetti";

export default function QuickBattle() {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [winner, setWinner] = useState<"me" | "opponent" | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const targetSentence = "The human brain can generate power.";

  const playSound = (type: "ding" | "buzz") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === "ding") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  };

  useEffect(() => {
    if (started && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (started && countdown === 0 && !winner) {
      // Simulation of live scoring
      const interval = setInterval(() => {
        setOpponentScore(prev => {
          const newScore = prev + Math.floor(Math.random() * 15);
          if (newScore >= 85 && !winner) {
            setWinner("opponent");
            playSound("buzz");
          }
          return newScore > 100 ? 100 : newScore;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [started, countdown, winner]);

  const handleMicClick = () => {
    if (winner || countdown > 0) return;
    
    const newScore = score + Math.floor(Math.random() * 25 + 10);
    setScore(newScore > 100 ? 100 : newScore);
    
    if (newScore > 80) playSound("ding");
    else playSound("buzz");

    if (newScore >= 100) {
      setWinner("me");
      setConfettiTrigger(prev => prev + 1);
      
      // Award XP
      const storedStats = localStorage.getItem("gsa-student-stats");
      if (storedStats) {
        try {
          const stats = JSON.parse(storedStats);
          stats.xp += 50;
          localStorage.setItem("gsa-student-stats", JSON.stringify(stats));
          window.dispatchEvent(new Event("stats-updated"));
        } catch (e) {}
      }
    }
  };

  const getScoreColor = (s: number) => {
    if (s > 80) return "text-success";
    if (s > 50) return "text-xp-dark";
    return "text-primary";
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-[24px] overflow-hidden border-[4px] border-primary-dark relative">
      <Confetti trigger={confettiTrigger} />
      
      {/* Header */}
      <div className="bg-primary-dark text-white p-4 flex items-center justify-between z-10 shrink-0">
        <Link href="/games" className="flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito font-bold text-sm">Thoát</span>
        </Link>
        <h1 className="font-fredoka text-xl uppercase tracking-wider">Đấu Quick 1v1</h1>
        <div className="w-16" /> {/* spacer */}
      </div>

      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-8xl animate-bounce-custom">⚡</div>
          <h2 className="font-fredoka text-3xl text-text-head">Tìm Đối Thủ...</h2>
          <button 
            onClick={() => setStarted(true)}
            className="bg-primary hover:bg-primary-dark text-white font-fredoka text-xl px-10 py-4 rounded-[18px] border-[2px] border-[rgba(0,0,0,0.2)] shadow-[0_6px_0_var(--c-primary-dark)] active:translate-y-2 active:shadow-none transition-all uppercase"
          >
            Sẵn Sàng!
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative">
          
          {/* Top Target Sentence */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border-2 border-[rgba(0,0,0,0.1)] px-6 py-3 rounded-full z-20 shadow-lg text-center min-w-[300px]">
            <p className="text-[10px] font-black text-text-muted uppercase mb-1">Đọc thật to câu sau:</p>
            <p className="font-fredoka text-lg text-primary-dark">&ldquo;{targetSentence}&rdquo;</p>
          </div>

          {/* Countdown Overlay */}
          {countdown > 0 && (
            <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center backdrop-blur-sm">
              <span className="text-9xl font-fredoka text-white animate-pop-custom drop-shadow-2xl">{countdown}</span>
            </div>
          )}

          {/* Winner Overlay */}
          {winner && (
            <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center backdrop-blur-sm animate-fade-in-up">
              <span className="text-8xl mb-4 animate-wiggle-custom">
                {winner === "me" ? "🏆" : "💀"}
              </span>
              <h2 className="text-5xl font-fredoka text-white mb-2 uppercase drop-shadow-lg">
                {winner === "me" ? "Bạn Thắng!" : "Bạn Thua!"}
              </h2>
              {winner === "me" && (
                <div className="bg-xp text-xp-text font-fredoka text-xl px-6 py-2 rounded-full mb-6 border-[2px] border-xp-dark animate-float-custom">
                  +50 XP
                </div>
              )}
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setStarted(false); setCountdown(3); setScore(0); setOpponentScore(0); setWinner(null);
                  }}
                  className="bg-white text-primary-dark font-black px-6 py-3 rounded-xl hover:bg-page transition-colors"
                >
                  Chơi Lại
                </button>
                <Link href="/games" className="bg-white/20 text-white font-black px-6 py-3 rounded-xl hover:bg-white/30 transition-colors">
                  Về Lobby
                </Link>
              </div>
            </div>
          )}

          {/* Split Screen */}
          <div className="flex-1 flex flex-col md:flex-row">
            {/* My Side */}
            <div className="flex-1 border-b-[4px] md:border-b-0 md:border-r-[4px] border-[rgba(0,0,0,0.1)] bg-blue-50/50 flex flex-col items-center justify-center p-8 relative">
              <span className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded">Bạn</span>
              <div className="w-24 h-24 bg-card rounded-full border-4 border-blue-400 flex items-center justify-center text-4xl shadow-md mb-6">
                🦖
              </div>
              <div className={`text-7xl font-fredoka mb-4 transition-colors ${getScoreColor(score)}`}>
                {score}<span className="text-2xl text-text-muted">/100</span>
              </div>
              
              {/* Waveform fake */}
              <div className="flex items-center gap-1 h-12 mb-8">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-2 bg-blue-400 rounded-full animate-float-custom" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>

              <button 
                onClick={handleMicClick}
                disabled={countdown > 0 || winner !== null}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white border-[4px] border-primary-dark shadow-[0_6px_0_var(--c-primary-dark)] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 group"
              >
                <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
              <span className="text-[10px] font-bold text-text-muted mt-2 uppercase tracking-wide">Nhấn để nói (Mô phỏng)</span>
            </div>

            {/* Opponent Side */}
            <div className="flex-1 bg-rose-50/50 flex flex-col items-center justify-center p-8 relative">
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded">Đối Thủ</span>
              <div className="w-24 h-24 bg-card rounded-full border-4 border-rose-400 flex items-center justify-center text-4xl shadow-md mb-6">
                🤖
              </div>
              <div className={`text-7xl font-fredoka mb-4 transition-colors ${getScoreColor(opponentScore)}`}>
                {opponentScore}<span className="text-2xl text-text-muted">/100</span>
              </div>

              {/* Waveform fake */}
              <div className="flex items-center gap-1 h-12 mb-8 opacity-50">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-2 bg-rose-400 rounded-full animate-float-custom" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              
              <div className="text-sm font-bold text-text-muted">Đang phân tích...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
