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
  ChevronRight,
  Lock,
  CheckCircle
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
    <aside className="w-[300px] shrink-0 border-l border-slate-200 bg-white hidden md:flex flex-col h-full overflow-hidden select-none shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* Top Mini Header stats bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          {/* Flame streak */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-600 text-[10px] font-bold shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>{stats.streak.toString().padStart(2, "0")} ngày</span>
          </div>

          {/* XP tally */}
          <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg text-indigo-600 text-[10px] font-bold shadow-sm">
            <Zap className="w-3 h-3 text-indigo-500" />
            <span>{(stats.xp).toLocaleString()} XP</span>
          </div>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
            <Bell className="w-4 h-4" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-[10px] shadow-sm uppercase">
            {fullName.substring(0, 2)}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
        
        {/* Section 1: Thống kê học tập */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Thống kê học tập
          </h3>

          {/* Streak Card custom */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 flex items-center gap-4 shadow-sm group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm">
              <Flame className="w-5 h-5 animate-bounce fill-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Chuỗi học tập liên tục
              </div>
              <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 tracking-tight">
                {stats.streak.toString().padStart(2, "0")} NGÀY
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
                Hãy giữ vững phong độ nhé!
              </p>
            </div>
          </div>

          {/* Stats detailed list */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Stat 1 */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white border-slate-200 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all justify-between h-[60px] shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[9px]">Thời gian học</span>
              </div>
              <span className="text-xs font-bold text-slate-800">4.5 giờ</span>
            </div>

            {/* Stat 2 */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white border-slate-200 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all justify-between h-[60px] shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[9px]">Kinh nghiệm (XP)</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{(stats.xp + 680).toLocaleString()} XP</span>
            </div>

            {/* Stat 3 */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white border-slate-200 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all justify-between h-[60px] shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px]">Kim cương</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{stats.diamonds} 💎</span>
            </div>

            {/* Stat 4 */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white border-slate-200 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all justify-between h-[60px] shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[9px]">Phát âm TB</span>
              </div>
              <span className="text-xs font-bold text-slate-800">83%</span>
            </div>
          </div>
        </div>

        {isLoggedIn ? (
          <>
            {/* Section 2: Nhiệm vụ */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Nhiệm vụ hôm nay
              </h3>
              <div className="space-y-2">
                {/* Task 1 */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between group cursor-pointer hover:bg-emerald-100 transition-colors shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800">Hoàn thành 1 bài học SGK</span>
                  </div>
                  <span className="text-emerald-600 font-black text-[10px]">1/1</span>
                </div>

                {/* Task 2 */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md flex items-center justify-between group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                      <span className="text-[9px] font-bold">2</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">Luyện phát âm AI 5 phút</span>
                  </div>
                  <span className="text-slate-400 font-black text-[10px]">2/5</span>
                </div>

                {/* Task 3 */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer group hover:border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <span className="text-[9px] font-bold">3</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">Tích lũy 100 điểm XP hôm nay</span>
                    </div>
                    <span className="text-slate-400 font-black text-[10px]">80/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-indigo-500 w-[80%] rounded-full shadow-inner" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: AI Coach gợi ý */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 space-y-3 shadow-sm group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <h4 className="text-[10px] font-black uppercase tracking-wider">AI Coach Gợi Ý</h4>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                &ldquo;Bạn phát âm âm <b className="text-indigo-600">/th/</b> đã tốt hơn hôm qua! Hãy thử luyện thêm các âm cuối để cải thiện độ tự nhiên nhé.&rdquo;
              </p>
              <div className="pt-1 flex justify-end">
                <Link 
                  href="/ai-practice" 
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-[9px] font-bold flex items-center gap-1 shadow-md shadow-indigo-500/20 active:scale-95"
                >
                  <span>Luyện tập ngay</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Section 4: Bảng xếp hạng mini */}
            <div className="space-y-3 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Bảng xếp hạng
                </h3>
                <Link href="/history" className="text-[9px] font-bold text-indigo-600 hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-2">
                {/* Current user anchored */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-500 w-4 text-center">-</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-[9px] shadow-sm">
                      {fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[11px] font-black text-indigo-700">{fullName}</span>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600">{(stats.xp).toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 space-y-3 border border-slate-200 rounded-2xl bg-slate-50 shadow-inner">
            <Lock className="w-8 h-8 text-slate-400" />
            <p className="text-[11px] text-slate-500 font-medium px-6 text-center leading-relaxed">
              Vui lòng đăng nhập để xem tiến trình học tập, nhận nhiệm vụ và xếp hạng.
            </p>
            <Link href="/auth" className="px-4 py-2 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95">
              Đăng Nhập Ngay
            </Link>
          </div>
        )}

      </div>
    </aside>
  );
}
