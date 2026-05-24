"use client";

import React, { useState, useEffect } from "react";
import {
  Flame, Zap, Sparkles, BookOpen, ArrowRight, Play, Trophy, CheckCircle, TrendingUp, Mic, Gamepad2, Clock, Target
} from "lucide-react";
import Link from "next/link";

interface StudentStats {
  xp: number;
  diamonds: number;
  streak: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StudentStats>({ xp: 0, diamonds: 0, streak: 0 });
  const [gradeLevel, setGradeLevel] = useState("primary");
  const [fullName, setFullName] = useState("Nam");

  useEffect(() => {
    const loadState = () => {
      const storedStats = localStorage.getItem("gsa-student-stats");
      if (storedStats) {
        try { setStats(JSON.parse(storedStats)); } catch (e) {}
      }
      const storedUser = localStorage.getItem("gsa-current-user");
      if (storedUser) {
        try { 
          const u = JSON.parse(storedUser); 
          if (u.gradeLevel) setGradeLevel(u.gradeLevel);
          if (u.name) setFullName(u.name.split(" ")[0] || "Bạn");
        } catch (e) {}
      }
    };
    loadState();
    window.addEventListener("stats-updated", loadState);
    window.addEventListener("auth-changed", loadState);
    return () => {
      window.removeEventListener("stats-updated", loadState);
      window.removeEventListener("auth-changed", loadState);
    };
  }, []);

  // --- PRIMARY DASHBOARD ---
  if (gradeLevel === "primary") {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 select-none font-nunito">
        <div className="bg-[#FFF8DC] border-[3px] border-[#FFE4B5] rounded-[24px] p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full border-[3px] border-[#FFE4B5] flex items-center justify-center text-3xl shadow-inner">
              🐱
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary font-fredoka tracking-wide">
                Chào {fullName} ơi! 🚀
              </h1>
              <p className="text-[#E67E22] font-extrabold text-sm mt-1">
                Hôm nay mình học gì nào?
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 bg-[#FFD166] text-[#A04000] px-3 py-1 rounded-full text-xs font-black shadow-sm">
                <Flame className="w-4 h-4 text-[#E67E22]" />
                {stats.streak} ngày — Giỏi lắm!
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[16px] font-black text-text-muted flex items-center gap-2 uppercase tracking-wide">
            <Trophy className="w-5 h-5 text-xp-dark" />
            Nhiệm vụ hôm nay
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Học Bài */}
            <div className="bg-[#E0FAF8] border-[3px] border-[#4ECDC4] rounded-[20px] p-5 shadow-sm hover:-translate-y-1 transition-transform group cursor-pointer">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform origin-bottom-left">📚</div>
              <h3 className="font-fredoka text-lg text-[#0A4F4C]">HỌC BÀI</h3>
              <p className="font-bold text-[#1A9E96] text-sm">Con mèo nhà em</p>
              <div className="mt-4 h-2.5 bg-white rounded-full overflow-hidden border border-[#4ECDC4]/50">
                <div className="h-full bg-[#4ECDC4] w-[40%]" />
              </div>
            </div>

            {/* Nói */}
            <div className="bg-[#FFE8F4] border-[3px] border-[#FF6B9D] rounded-[20px] p-5 shadow-sm hover:-translate-y-1 transition-transform group cursor-pointer">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform origin-bottom-left">🎤</div>
              <h3 className="font-fredoka text-lg text-[#7D0038]">NÓI</h3>
              <p className="font-bold text-[#C0286A] text-sm">Phát âm A-B-C</p>
              <div className="mt-4 h-2.5 bg-white rounded-full overflow-hidden border border-[#FF6B9D]/50">
                <div className="h-full bg-[#FF6B9D] w-[60%]" />
              </div>
            </div>

            {/* Kiếm XP */}
            <div className="bg-[#EDFFF0] border-[3px] border-[#6BCB77] rounded-[20px] p-5 shadow-sm hover:-translate-y-1 transition-transform group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#6BCB77] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">New</div>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform origin-bottom-left">⚡</div>
              <h3 className="font-fredoka text-lg text-[#1B5E20]">XP</h3>
              <p className="font-bold text-[#2D9E3A] text-sm">Kiếm 100 XP</p>
              <div className="mt-4 h-2.5 bg-white rounded-full overflow-hidden border border-[#6BCB77]/50">
                <div className="h-full bg-[#6BCB77] w-[20%]" />
              </div>
            </div>

            {/* May Mắn */}
            <div className="bg-[#FFF8DC] border-[3px] border-[#FFD166] rounded-[20px] p-5 shadow-sm hover:-translate-y-1 transition-transform group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FFD166] text-[#A04000] text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">New</div>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform origin-bottom-left">🎡</div>
              <h3 className="font-fredoka text-lg text-[#7A4F00]">MAY MẮN</h3>
              <p className="font-bold text-[#F0A500] text-sm">Quay vòng quay</p>
              <div className="mt-4 h-2.5 bg-white rounded-full overflow-hidden border border-[#FFD166]/50">
                <div className="h-full bg-[#FFD166] w-[0%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MIDDLE DASHBOARD ---
  if (gradeLevel === "middle") {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 select-none font-nunito">
        <div className="bg-white border-[1.5px] border-[rgba(0,0,0,0.08)] rounded-[20px] p-6 shadow-sm flex items-center gap-5">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-black shadow-md">
            KT
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-head flex items-center gap-2">
              Hey {fullName}! <Flame className="text-xp w-6 h-6 animate-pulse" />
            </h1>
            <p className="text-text-muted font-bold text-sm mt-1">
              Tiếp tục chinh phục Unit 3 nào
            </p>
            <div className="inline-flex items-center gap-1.5 mt-2 bg-xp-light text-xp-text px-3 py-1 rounded-[8px] text-xs font-bold border border-xp">
              <Flame className="w-4 h-4 text-xp" />
              {stats.streak}-day streak
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#F0FDFA] border-[1.5px] border-[#14B8A6] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-black text-[#0F766E] uppercase tracking-wider mb-1">Đang học</div>
              <h3 className="font-bold text-lg text-[#042F2E]">Unit 3: My future</h3>
              <p className="text-[#0F766E] text-xs font-bold mt-1">Speaking — Còn 2 bài</p>
            </div>
            <button className="mt-4 w-full py-2.5 bg-[#14B8A6] hover:bg-[#0F766E] text-white rounded-[10px] text-sm font-black transition-colors">
              Học tiếp →
            </button>
          </div>

          <div className="bg-[#FEF3C7] border-[1.5px] border-[#F59E0B] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-black text-[#B45309] uppercase tracking-wider mb-1">Rank Tuần</div>
              <h3 className="font-black text-3xl text-[#78350F] mt-1">#6</h3>
              <p className="text-[#B45309] text-xs font-bold mt-1">Cần +200 XP lên #5</p>
            </div>
            <div className="mt-4 w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#F59E0B]/50">
              <div className="h-full bg-[#F59E0B] w-[80%]" />
            </div>
          </div>

          <div className="bg-white border-[1.5px] border-[#3B82F6] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-black text-[#1D4ED8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Listening
              </div>
              <h3 className="font-bold text-sm text-[#1E3A8A] mt-1">Nghe chép chính tả</h3>
            </div>
            <div className="mt-4 w-full h-2.5 bg-[#EFF6FF] rounded-full overflow-hidden border border-[#BFDBFE]">
              <div className="h-full bg-[#3B82F6] w-[20%]" />
            </div>
          </div>

          <div className="bg-[#FAF5FF] border-[1.5px] border-[#A855F7] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-black text-[#7E22CE] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Challenge
              </div>
              <h3 className="font-bold text-sm text-[#4C1D95] mt-1">Tích 100 XP hôm nay</h3>
            </div>
            <div className="mt-4 w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#E9D5FF]">
              <div className="h-full bg-[#A855F7] w-[60%]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- HIGH DASHBOARD ---
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 select-none font-inter">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Tiến độ tuần này</span>
          </div>
          <div className="flex items-end gap-6 mb-2">
            <div>
              <div className="text-3xl font-black text-primary">83%</div>
              <div className="text-xs font-medium text-text-muted">Phát âm</div>
            </div>
            <div>
              <div className="text-3xl font-black text-text-head">4.5h</div>
              <div className="text-xs font-medium text-text-muted">Học tập</div>
            </div>
            <div>
              <div className="text-3xl font-black text-xp">#6</div>
              <div className="text-xs font-medium text-text-muted">Rank</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Mục tiêu</span>
          </div>
          <div>
            <div className="text-2xl font-black text-text-head">IELTS 6.5</div>
            <div className="text-sm font-medium text-text-muted mb-4">Dự kiến: T8/2025</div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-[65%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-text-muted" />
          <h2 className="text-sm font-bold text-text-head uppercase tracking-wider">Lịch học hôm nay</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[8px] border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-text-head">IELTS Writing Task 2</span>
            </div>
            <span className="text-sm font-bold text-primary">30 phút</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[8px] border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium text-text-head">Pronunciation: /θ/ /ð/</span>
            </div>
            <span className="text-sm font-bold text-primary">15 phút</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[8px] border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-text-head">Mock Speaking Test</span>
            </div>
            <span className="text-sm font-bold text-primary">20 phút</span>
          </div>
        </div>
      </div>
    </div>
  );
}
