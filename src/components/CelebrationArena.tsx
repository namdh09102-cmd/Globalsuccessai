"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Flame, Sparkles, Zap } from "lucide-react";

interface CelebrationArenaProps {
  isOpen: boolean;
  xpReward: number;
  diamondReward: number;
  onClose: () => void;
}

export default function CelebrationArena({
  isOpen,
  xpReward,
  diamondReward,
  onClose
}: CelebrationArenaProps) {
  
  // Tự động phát âm thanh ăn mừng offline nhỏ (tùy chọn)
  useEffect(() => {
    if (isOpen) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Tần số âm thanh chiến thắng
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
          
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.12 + 0.3);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start(audioCtx.currentTime + idx * 0.12);
          osc.stop(audioCtx.currentTime + idx * 0.12 + 0.3);
        });
      } catch (e) {
        console.log("AudioContext not allowed or supported yet:", e);
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/90 backdrop-blur-md p-4"
        >
          {/* Confetti particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 400],
                  x: [0, (Math.random() - 0.5) * 100],
                  scale: [1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Central Golden Cup Card */}
          <motion.div
            initial={{ y: 100, scale: 0.9, opacity: 0 }}
            animate={{ 
              y: 0, 
              scale: 1, 
              opacity: 1,
              transition: { type: "spring", damping: 15, stiffness: 100 }
            }}
            exit={{ y: -100, scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#151B2B] p-8 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              
              {/* Animated sparkles */}
              <div className="flex justify-center gap-1 text-amber-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <Sparkles className="w-8 h-8 animate-bounce" />
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>

              {/* 3D Golden Cup Graphic constructed with CSS */}
              <div className="relative flex justify-center py-4">
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 18, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-28 h-28 relative flex items-center justify-center"
                >
                  {/* Cup Shadow */}
                  <div className="absolute bottom-0 w-16 h-2 bg-black/40 rounded-full blur-sm" />
                  
                  {/* The Golden Cup body */}
                  <div className="absolute top-2 w-20 h-16 rounded-b-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border border-amber-300/40 shadow-lg flex flex-col justify-start pt-2 items-center">
                    <Award className="w-8 h-8 text-white/90 drop-shadow" />
                    
                    {/* Handles (Left & Right) */}
                    <div className="absolute -left-3 top-2 w-4 h-8 border-[3px] border-amber-400 rounded-l-full" />
                    <div className="absolute -right-3 top-2 w-4 h-8 border-[3px] border-amber-400 rounded-r-full" />
                  </div>
                  
                  {/* Stem */}
                  <div className="absolute bottom-4 w-4 h-8 bg-gradient-to-b from-amber-400 to-amber-500" />
                  
                  {/* Base */}
                  <div className="absolute bottom-1 w-16 h-4 rounded-md bg-gradient-to-b from-amber-500 to-amber-600 shadow" />
                </motion.div>
              </div>

              {/* Victory Messages */}
              <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 uppercase">
                  XUẤT SẮC HOÀN THÀNH!
                </h2>
                <p className="text-xs text-slate-400">
                  Bạn vừa hoàn thành xuất sắc thử thách học tập hôm nay!
                </p>
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-2 gap-4 py-2">
                
                {/* XP Reward */}
                <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-600/5 flex flex-col items-center justify-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Zap className="w-5 h-5 fill-violet-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Kinh Nghiệm</span>
                  <span className="text-lg font-black text-violet-400">+{xpReward} XP</span>
                </div>

                {/* Diamond Reward */}
                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-600/5 flex flex-col items-center justify-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Flame className="w-5 h-5 fill-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Kim Cương</span>
                  <span className="text-lg font-black text-emerald-400">+{diamondReward} 💎</span>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#0F1422] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <span>TIẾP TỤC HỌC TẬP</span>
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
