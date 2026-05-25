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
  const [gradeLevel, setGradeLevel] = useState("primary");
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
          if (parsed.gradeLevel) setGradeLevel(parsed.gradeLevel);
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
            {/* --- PRIMARY RIGHT PANEL --- */}
            {gradeLevel === "primary" && (
              <div className="space-y-4">
                {/* Bảng Vàng (Leaderboard) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-xp-dark" />
                    <h3 className="text-[14px] font-black text-text-muted uppercase tracking-widest font-fredoka">
                      Bảng Vàng
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white border-2 border-[#FFE4B5] rounded-[16px] p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center font-black text-[10px]">1</div>
                        <span className="text-[12px] font-nunito font-bold text-[#555]">Minh Anh</span>
                      </div>
                      <span className="text-[12px] font-nunito font-extrabold text-[#E67E22]">3,660</span>
                    </div>
                    <div className="flex items-center justify-between bg-white border-2 border-[#FFE4B5] rounded-[16px] p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#4ECDC4] text-white flex items-center justify-center font-black text-[10px]">2</div>
                        <span className="text-[12px] font-nunito font-bold text-[#555]">Bảo Trâm</span>
                      </div>
                      <span className="text-[12px] font-nunito font-extrabold text-[#E67E22]">2,460</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#FFD166] border-2 border-[#FFB347] rounded-[16px] p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#C0392B] text-white flex items-center justify-center font-black text-[10px]">6</div>
                        <span className="text-[12px] font-nunito font-bold text-[#555]">Mình</span>
                      </div>
                      <span className="text-[12px] font-nunito font-extrabold text-[#E67E22]">{stats.xp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Nhạc Học */}
                <div className="bg-[#FFF8DC] border-2 border-[#FFE4B5] rounded-[16px] p-4 shadow-sm mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-[#F0A500]" />
                    <h3 className="text-[12px] font-black text-text-muted uppercase font-fredoka">
                      Nhạc học
                    </h3>
                  </div>
                  <p className="text-[11px] font-nunito font-bold text-[#555] mb-3">Kids Focus</p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-white border-2 border-[#FFE4B5] flex items-center justify-center text-text-muted hover:scale-105 active:scale-95 transition-transform">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-[#FF6B6B] border-2 border-[#E63946] flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-transform">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white border-2 border-[#FFE4B5] flex items-center justify-center text-text-muted hover:scale-105 active:scale-95 transition-transform">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- MIDDLE RIGHT PANEL --- */}
            {gradeLevel === "middle" && (
              <div className="space-y-6">
                {/* Leaderboard */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <h3 className="text-[12px] font-black text-text-muted uppercase tracking-widest">
                      LEADERBOARD
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-card border-[1.5px] border-[rgba(0,0,0,0.08)] rounded-[12px] p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px]">1</div>
                        <span className="text-[12px] font-nunito font-bold text-text-body">Minh Anh</span>
                      </div>
                      <span className="text-[12px] font-nunito font-black text-primary">3,660</span>
                    </div>
                    <div className="flex items-center justify-between bg-card border-[1.5px] border-[rgba(0,0,0,0.08)] rounded-[12px] p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-xp text-white flex items-center justify-center font-black text-[10px]">2</div>
                        <span className="text-[12px] font-nunito font-bold text-text-body">Bảo Trâm</span>
                      </div>
                      <span className="text-[12px] font-nunito font-black text-primary">2,460</span>
                    </div>
                    <div className="flex items-center justify-between bg-primary-light border-[1.5px] border-primary-dark rounded-[12px] p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-dark text-white flex items-center justify-center font-black text-[10px]">6</div>
                        <span className="text-[12px] font-nunito font-bold text-primary-dark">Tôi</span>
                      </div>
                      <span className="text-[12px] font-nunito font-black text-primary-dark">{stats.xp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Kỹ năng yếu */}
                <div className="bg-card border-[1.5px] border-[rgba(0,0,0,0.08)] rounded-[12px] p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h3 className="text-[12px] font-black text-text-muted uppercase">
                      Kỹ năng yếu
                    </h3>
                  </div>
                  <p className="text-[13px] font-nunito font-bold text-text-body mb-3">Pronunciation: <span className="text-red-500">67%</span></p>
                  <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-[8px] text-[12px] font-bold transition-colors">
                    Luyện thêm →
                  </button>
                </div>
              </div>
            )}

            {/* --- HIGH RIGHT PANEL --- */}
            {gradeLevel === "high" && (
              <div className="space-y-6">
                {/* Kỹ Năng */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <h3 className="text-[12px] font-black text-text-muted uppercase tracking-widest font-inter">
                      KỸ NĂNG
                    </h3>
                  </div>
                  <div className="space-y-3 font-inter">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-text-body">
                        <span>Speaking</span>
                        <span>83%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[83%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-text-body">
                        <span>Listening</span>
                        <span>71%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[71%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-text-body">
                        <span>Reading</span>
                        <span>58%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-[58%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-text-body">
                        <span>Writing</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 w-[42%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Coach */}
                <div className="bg-primary-light border border-primary-dark rounded-[8px] p-4 shadow-sm font-inter">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🤖</span>
                    <h3 className="text-[12px] font-black text-primary-dark uppercase">
                      AI Coach gợi ý
                    </h3>
                  </div>
                  <p className="text-[11px] font-medium text-primary-text mb-4 leading-relaxed">
                    "Tập trung Writing tuần này — kỹ năng yếu nhất của bạn."
                  </p>
                  <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-[6px] text-[11px] font-bold transition-colors">
                    Lên kế hoạch →
                  </button>
                </div>
              </div>
            )}
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
              Đăng nhập / Đăng ký
            </Link>
          </div>
        )}

      </div>
    </aside>
  );
}
