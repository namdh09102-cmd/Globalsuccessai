"use client";

import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Sparkles, 
  Volume2, 
  Clock,
  Zap,
  Bell,
  CheckCircle,
  Lock,
  Medal,
  Target,
  Trophy,
  BookOpen,
  Mic,
  Star
} from "lucide-react";
import Link from "next/link";

interface StudentStats {
  xp: number;
  diamonds: number;
  streak: number;
}

export default function RightPanel() {
  const [stats, setStats] = useState<StudentStats>({ xp: 0, diamonds: 0, streak: 0 });
  const [fullName, setFullName] = useState("Học viên");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadStats = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gsa-student-stats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStats({
            xp: parsed.xp || 0,
            diamonds: parsed.diamonds || 0,
            streak: parsed.streak || 0
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        const defaultStats = { xp: 0, diamonds: 0, streak: 0 };
        localStorage.setItem("gsa-student-stats", JSON.stringify(defaultStats));
      }
    }
  };

  const loadProfile = () => {
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("gsa-current-user");
      if (currentUserStr) {
        try {
          const parsed = JSON.parse(currentUserStr);
          if (parsed.name) {
            setFullName(parsed.name);
            setIsLoggedIn(true);
            return;
          }
        } catch (e) {}
      } else {
        setFullName("Học viên");
        setIsLoggedIn(false);
      }

      const storedProfile = localStorage.getItem("gsa-user-profile");
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          if (parsed.fullName) setFullName(parsed.fullName);
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    loadStats();
    loadProfile();
    
    if (typeof window !== "undefined") {
      window.addEventListener("stats-updated", loadStats);
      window.addEventListener("profile-updated", loadProfile);
      window.addEventListener("auth-changed", loadProfile);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("stats-updated", loadStats);
        window.removeEventListener("profile-updated", loadProfile);
        window.removeEventListener("auth-changed", loadProfile);
      }
    };
  }, []);

  return (
    <aside className="w-[320px] shrink-0 border-l-2 border-l-xp bg-[#FFF0DC] hidden xl:flex flex-col h-full overflow-hidden select-none z-10">
      
      {/* Main Scrollable Content */}
      <div className="flex-1 p-5 space-y-6 overflow-y-auto custom-scrollbar">
        
        {isLoggedIn ? (
          <>
            {/* Section 1: Nhiệm vụ */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-black text-text-muted uppercase tracking-widest font-fredoka flex items-center gap-2">
                <Medal className="w-5 h-5 text-success" />
                Nhiệm Vụ Hôm Nay
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                {/* Blue Task (Simulate interaction) */}
                <div 
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      (window as any).audioManager?.play('correctAnswer');
                      (window as any).audioManager?.play('xpEarned');
                      const e = document.getElementById('blue-task');
                      e?.classList.remove('flash-green');
                      void e?.offsetWidth; // trigger reflow
                      e?.classList.add('flash-green');
                      
                      const xp = document.getElementById('blue-xp-float');
                      xp?.classList.remove('hidden', 'float-up-fade');
                      void xp?.offsetWidth;
                      xp?.classList.add('float-up-fade');
                      setTimeout(() => xp?.classList.add('hidden'), 1000);
                    }
                  }}
                  id="blue-task"
                  className="relative rounded-[16px] border-[2.5px] border-[#4ECDC4] bg-[#EFF8FF] p-[12px_14px] flex flex-col gap-2 group cursor-pointer transition-transform shadow-sm active:scale-95"
                >
                  <div className="text-[32px] animate-float-custom" style={{ animationDelay: '0s' }}>📘</div>
                  <div className="space-y-1 mt-1">
                    <span className="text-[10px] font-nunito font-extrabold uppercase text-[#4ECDC4]">Bài học</span>
                    <p className="text-[13px] font-nunito font-bold text-[#333] leading-[1.3]">Hoàn thành 1 bài SGK</p>
                  </div>
                  <div className="mt-auto pt-2 w-full h-[7px] bg-[#E0E0E0] rounded-[999px] overflow-hidden">
                    <div className="h-full bg-[#4ECDC4] w-full transition-all duration-1000" />
                  </div>
                  {/* Floating XP */}
                  <div id="blue-xp-float" className="absolute top-0 right-4 text-emerald-500 font-fredoka text-lg hidden pointer-events-none z-10">+20 XP</div>
                  {/* Badge Done */}
                  <div className="absolute top-2 right-2 bg-[#6BCB77] text-white text-[9px] font-nunito font-extrabold px-1.5 py-0.5 rounded-[10px] shadow-sm flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 draw-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Xong!
                  </div>
                </div>

                {/* Pink Task */}
                <div className="relative rounded-[16px] border-[2.5px] border-[#FF6B9D] bg-[#FFE8F4] p-[12px_14px] flex flex-col gap-2 group hover:-translate-y-1 transition-transform shadow-sm">
                  <div className="text-[32px] animate-float-custom" style={{ animationDelay: '0.4s' }}>🎙️</div>
                  <div className="space-y-1 mt-1">
                    <span className="text-[10px] font-nunito font-extrabold uppercase text-[#FF6B9D]">Luyện nói</span>
                    <p className="text-[13px] font-nunito font-bold text-[#333] leading-[1.3]">Luyện âm cùng AI</p>
                  </div>
                  <div className="mt-auto pt-2 w-full h-[7px] bg-[#E0E0E0] rounded-[999px] overflow-hidden">
                    <div className="h-full bg-[#FF6B9D] w-[60%]" />
                  </div>
                </div>

                {/* Green Task */}
                <div className="relative rounded-[16px] border-[2.5px] border-[#6BCB77] bg-[#EDFFF0] p-[12px_14px] flex flex-col gap-2 group hover:-translate-y-1 transition-transform shadow-sm">
                  <div className="text-[32px] animate-float-custom" style={{ animationDelay: '0.8s' }}>🎧</div>
                  <div className="space-y-1 mt-1">
                    <span className="text-[10px] font-nunito font-extrabold uppercase text-[#6BCB77]">Luyện nghe</span>
                    <p className="text-[13px] font-nunito font-bold text-[#333] leading-[1.3]">Nghe và chép chính tả</p>
                  </div>
                  <div className="mt-auto pt-2 w-full h-[7px] bg-[#E0E0E0] rounded-[999px] overflow-hidden">
                    <div className="h-full bg-[#6BCB77] w-[0%]" />
                  </div>
                </div>

                {/* Orange Task */}
                <div className="relative rounded-[16px] border-[2.5px] border-[#FFD166] bg-[#FFF8E1] p-[12px_14px] flex flex-col gap-2 group hover:-translate-y-1 transition-transform shadow-sm">
                  <div className="text-[32px] animate-float-custom" style={{ animationDelay: '1.2s' }}>⚡</div>
                  <div className="space-y-1 mt-1">
                    <span className="text-[10px] font-nunito font-extrabold uppercase text-[#F0A500]">Thử thách</span>
                    <p className="text-[13px] font-nunito font-bold text-[#333] leading-[1.3]">Tích lũy 100 XP hôm nay</p>
                  </div>
                  <div className="mt-auto pt-2 w-full h-[7px] bg-[#E0E0E0] rounded-[999px] overflow-hidden">
                    <div className="h-full bg-[#FFD166] w-[80%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Bảng xếp hạng mini */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-black text-text-muted uppercase tracking-widest font-fredoka flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-xp-dark" />
                  Bảng Xếp Hạng
                </h3>
                <Link href="/games/class-king" className="text-[11px] font-black text-primary hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-2.5 relative">
                {/* Rank 1 */}
                <div className="flex items-center justify-between bg-white border-[1.5px] border-[#FFE4B5] rounded-[12px] p-[8px_10px] shadow-sm hover:scale-[1.02] transition-transform slide-highlight">
                  <div className="flex items-center gap-3">
                    <div className="w-[24px] h-[24px] rounded-full bg-[#FF6B6B] text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                      1
                    </div>
                    <span className="text-[11px] font-nunito font-bold text-[#555]">Minh Anh</span>
                  </div>
                  <span className="text-[11px] font-nunito font-extrabold text-[#E67E22]">{(stats.xp + 2400).toLocaleString()} XP</span>
                </div>

                {/* Rank 2 */}
                <div className="flex items-center justify-between bg-white border-[1.5px] border-[#FFE4B5] rounded-[12px] p-[8px_10px] shadow-sm hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-[24px] h-[24px] rounded-full bg-[#4ECDC4] text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                      2
                    </div>
                    <span className="text-[11px] font-nunito font-bold text-[#555]">Bảo Trâm</span>
                  </div>
                  <span className="text-[11px] font-nunito font-extrabold text-[#E67E22]">{(stats.xp + 1200).toLocaleString()} XP</span>
                </div>

                {/* Rank 3 */}
                <div className="flex items-center justify-between bg-white border-[1.5px] border-[#FFE4B5] rounded-[12px] p-[8px_10px] shadow-sm hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-[24px] h-[24px] rounded-full bg-[#FFB347] text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                      3
                    </div>
                    <span className="text-[11px] font-nunito font-bold text-[#555]">Tuấn Kiệt</span>
                  </div>
                  <span className="text-[11px] font-nunito font-extrabold text-[#E67E22]">{(stats.xp + 450).toLocaleString()} XP</span>
                </div>

                {/* Current User */}
                <div className="flex items-center justify-between bg-[#FFD166] border-[1.5px] border-[#FFB347] rounded-[12px] p-[8px_10px] shadow-md animate-bounce-custom">
                  <div className="flex items-center gap-3">
                    <div className="w-[24px] h-[24px] rounded-full bg-[#C0392B] text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                      Me
                    </div>
                    <span className="text-[11px] font-nunito font-bold text-[#555]">{fullName}</span>
                  </div>
                  <span className="text-[11px] font-nunito font-extrabold text-[#E67E22]">{stats.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 border-[var(--c-border)] border-[rgba(0,0,0,0.1)] rounded-[var(--radius-card)] bg-card shadow-[0_4px_0_rgba(0,0,0,0.05)] mt-4 text-center">
            <div className="w-16 h-16 rounded-full bg-page border-[var(--c-border)] border-[rgba(0,0,0,0.1)] flex items-center justify-center mb-2">
              <Lock className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-[13px] text-text-body font-bold leading-relaxed">
              Bạn cần đăng nhập để mở khóa nhiệm vụ và bảng xếp hạng! 🏰
            </p>
            <Link href="/auth" className="px-5 py-3 w-full bg-primary hover:bg-primary-dark text-white rounded-[var(--radius-btn)] text-[12px] font-black transition-all border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] active:translate-y-1 active:shadow-none uppercase tracking-wide">
              Mở khóa ngay
            </Link>
          </div>
        )}

      </div>
    </aside>
  );
}
