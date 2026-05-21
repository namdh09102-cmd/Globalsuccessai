"use client";

import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Sparkles, 
  Volume2, 
  Clock,
  Zap,
  Bell,
  Check,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface StudentStats {
  xp: number;
  diamonds: number;
  streak: number;
}

export default function RightPanel() {
  const [stats, setStats] = useState<StudentStats>({ xp: 560, diamonds: 15, streak: 5 });
  const [fullName, setFullName] = useState("Khánh Tân");

  const loadStats = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gsa-student-stats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStats({
            xp: parsed.xp || 560,
            diamonds: parsed.diamonds || 15,
            streak: parsed.streak || 5
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        const defaultStats = { xp: 560, diamonds: 15, streak: 5 };
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
            return;
          }
        } catch (e) {}
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
    <aside className="w-[300px] shrink-0 border-l border-slate-800/60 bg-[#070A13] hidden md:flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Mini Header stats bar */}
      <div className="p-4 border-b border-slate-850/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Flame streak */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-500 text-[10px] font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>{stats.streak.toString().padStart(2, "0")} ngày</span>
          </div>

          {/* XP tally */}
          <div className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-lg text-violet-400 text-[10px] font-bold">
            <Zap className="w-3 h-3 text-violet-400" />
            <span>{(stats.xp).toLocaleString()} XP</span>
          </div>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 border border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm uppercase">
            {fullName.substring(0, 2)}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
        
        {/* Section 1: Thống kê học tập */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Thống kê học tập
          </h3>

          {/* Streak Card custom */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/5 to-orange-600/5 p-4 flex items-center gap-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent blur-xl pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-md">
              <Flame className="w-5 h-5 animate-bounce fill-amber-500" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Chuỗi học tập liên tục
              </div>
              <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight">
                {stats.streak.toString().padStart(2, "0")} NGÀY
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Hãy giữ vững phong độ nhé!
              </p>
            </div>
          </div>

          {/* Stats detailed list */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Stat 1 */}
            <div className="p-2.5 rounded-xl border border-slate-850/50 bg-slate-800/10 flex flex-col justify-between h-[60px]">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[9px]">Thời gian học</span>
              </div>
              <span className="text-xs font-bold text-slate-200">4.5 giờ</span>
            </div>

            {/* Stat 2 */}
            <div className="p-2.5 rounded-xl border border-slate-850/50 bg-slate-800/10 flex flex-col justify-between h-[60px]">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[9px]">Kinh nghiệm (XP)</span>
              </div>
              <span className="text-xs font-bold text-slate-200">{(stats.xp + 680).toLocaleString()} XP</span>
            </div>

            {/* Stat 3 */}
            <div className="p-2.5 rounded-xl border border-slate-850/50 bg-slate-800/10 flex flex-col justify-between h-[60px]">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9px]">Kim cương</span>
              </div>
              <span className="text-xs font-bold text-slate-200">{stats.diamonds} 💎</span>
            </div>

            {/* Stat 4 */}
            <div className="p-2.5 rounded-xl border border-slate-850/50 bg-slate-800/10 flex flex-col justify-between h-[60px]">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[9px]">Phát âm TB</span>
              </div>
              <span className="text-xs font-bold text-slate-200">83%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Nhiệm vụ hôm nay */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Nhiệm vụ hôm nay
          </h3>

          <div className="space-y-3 p-4 rounded-2xl border border-slate-850/50 bg-slate-800/10">
            {/* Task 1: Complete 1 SGK lesson */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Hoàn thành 1 bài học SGK</span>
                </div>
                <span className="text-emerald-400 font-bold">1/1</span>
              </div>
              <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
            </div>

            {/* Task 2: Speaking AI for 5 mins */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">
                    2
                  </div>
                  <span>Luyện phát âm AI 5 phút</span>
                </div>
                <span className="text-slate-400 font-bold">2/5</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[40%]" />
              </div>
            </div>

            {/* Task 3: Accrue 100 XP */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">
                    3
                  </div>
                  <span>Tích lũy 100 điểm XP hôm nay</span>
                </div>
                <span className="text-slate-400 font-bold">80/100</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-[80%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Coach gợi ý */}
        <div className="rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-[#121626] to-[#151930] p-4 space-y-3 shadow-lg shadow-indigo-950/20">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider">AI Coach Gợi Ý</h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            &ldquo;Bạn phát âm âm <b className="text-indigo-300">/th/</b> đã tốt hơn hôm qua! Hãy thử luyện thêm các âm cuối để cải thiện độ tự nhiên nhé.&rdquo;
          </p>
          <div className="pt-1 flex justify-end">
            <Link 
              href="/ai-practice" 
              className="px-3 py-1.5 rounded-lg bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-400 hover:text-indigo-300 transition-colors text-[9px] font-bold flex items-center gap-1 border border-indigo-500/20"
            >
              <span>Luyện tập ngay</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Section 4: Bảng xếp hạng mini */}
        <div className="space-y-3 pb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Bảng xếp hạng
            </h3>
            <Link href="/history" className="text-[9px] font-bold text-indigo-400 hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-2">
            {/* Current user anchored */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-xs shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-400 w-4 text-center">-</span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-[9px] shadow-inner">KT</div>
                <span className="text-[11px] font-black text-indigo-300">Khánh Tân</span>
              </div>
              <span className="text-[10px] font-black text-indigo-400">{(stats.xp).toLocaleString()} XP</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
