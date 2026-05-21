"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Award, 
  Flame, 
  Mic, 
  BookOpen, 
  Volume2, 
  Star, 
  Lock, 
  Crown, 
  Sparkles, 
  ChevronRight, 
  History,
  TrendingUp,
  GraduationCap,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

// Định nghĩa kiểu dữ liệu
interface StudentStats {
  xp: number;
  diamonds: number;
  streak: number;
}

interface LeaderboardUser {
  name: string;
  class: string;
  xp: number;
  streak: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  glowColor: string;
  borderColor: string;
  neonShadow: string;
  unlocked: boolean;
  requirement: string;
}

interface LearningLogItem {
  lessonTitle: string;
  type: "speaking" | "dictation" | "quiz" | "vocabulary" | "grammar";
  score: number;
  xpEarned: number;
  timeAgo: string;
  passed: boolean;
}

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const badgeContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const badgeVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 12
    }
  }
};

export default function HistoryPage() {
  const [stats, setStats] = useState<StudentStats>({ xp: 560, diamonds: 15, streak: 5 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [learningLogs, setLearningLogs] = useState<LearningLogItem[]>([]);

  // Đọc stats & sinh dữ liệu bảng xếp hạng động
  useEffect(() => {
    // 1. Đọc stats từ localStorage
    const loadStats = () => {
      const storedStats = localStorage.getItem("gsa-student-stats");
      let currentStats = { xp: 560, diamonds: 15, streak: 5 };
      if (storedStats) {
        try {
          currentStats = JSON.parse(storedStats);
          setStats(currentStats);
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Dựng bảng xếp hạng động
      const otherStudents: LeaderboardUser[] = [];

      const currentUser: LeaderboardUser = {
        name: "Khánh Tân",
        class: "11A3",
        xp: currentStats.xp,
        streak: currentStats.streak,
        badgesCount: currentStats.streak >= 5 ? 2 : 1, // Dynamic badges count
        isCurrentUser: true
      };

      // Ghép và sắp xếp theo XP giảm dần
      const merged = [...otherStudents, currentUser].sort((a, b) => b.xp - a.xp);
      setLeaderboard(merged);
    };

    loadStats();
    window.addEventListener("stats-updated", loadStats);

    // 3. Dựng Nhật ký luyện tập chuyên sâu giả lập
    const defaultLogs: LearningLogItem[] = [];
    setLearningLogs(defaultLogs);

    return () => {
      window.removeEventListener("stats-updated", loadStats);
    };
  }, []);

  // Danh sách 6 Huy hiệu danh giá dưới dạng các icon Neon 3D phát sáng
  const [avgSpeakingScore, setAvgSpeakingScore] = useState<number>(92);
  const [unlockedBadgesCount, setUnlockedBadgesCount] = useState<number>(2);

  // Đọc stats & sinh dữ liệu bảng xếp hạng động
  useEffect(() => {
    // 1. Đọc stats từ localStorage
    const loadStats = () => {
      const storedStats = localStorage.getItem("gsa-student-stats");
      let currentStats = { xp: 560, diamonds: 15, streak: 5 };
      if (storedStats) {
        try {
          currentStats = JSON.parse(storedStats);
          setStats(currentStats);
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Tính điểm nói trung bình thực tế
      const storedAccuracy = localStorage.getItem("gsa-pronunciation-accuracy");
      let currentAvgScore = 92;
      if (storedAccuracy) {
        currentAvgScore = parseInt(storedAccuracy, 10) || 92;
      } else {
        const storedSpeakingScores = localStorage.getItem("gsa-speaking-scores");
        if (storedSpeakingScores) {
          try {
            const scores = JSON.parse(storedSpeakingScores) as number[];
            if (scores.length > 0) {
              currentAvgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            }
          } catch (e) {}
        }
      }
      setAvgSpeakingScore(currentAvgScore);

      // 3. Đọc logs từ localStorage để tính toán các huy hiệu mở khóa động
      const defaultLogs: LearningLogItem[] = [];

      const storedLogs = localStorage.getItem("gsa-learning-logs");
      let currentLogs = defaultLogs;
      if (storedLogs) {
        try {
          const parsedLogs = JSON.parse(storedLogs) as LearningLogItem[];
          if (parsedLogs.length > 0) {
            // Chuẩn hóa định dạng thời gian của các log cũ
            const formattedParsed = parsedLogs.map(log => ({
              ...log,
              timeAgo: log.timeAgo || "Vừa xong"
            }));
            const combined = [...formattedParsed, ...defaultLogs];
            const unique = combined.filter((item, index, self) => 
              index === self.findIndex((t) => t.lessonTitle === item.lessonTitle)
            );
            currentLogs = unique.slice(0, 7);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLearningLogs(currentLogs);

      // 4. Tính toán số lượng huy hiệu mở khóa của Khánh Tân
      let unlockedCount = 0;
      if (currentStats.streak >= 5) unlockedCount++; // Chiến binh chuyên cần
      if (currentAvgScore >= 90) unlockedCount++; // Thần sấm phát âm
      if (currentLogs.some(log => log.type === "vocabulary" && log.score === 100)) unlockedCount++; // Sát thủ từ vựng
      if (currentLogs.some(log => log.type === "dictation" && log.score === 100)) unlockedCount++; // Vua nghe hiểu
      if (currentLogs.some(log => log.type === "quiz" && log.score >= 90)) unlockedCount++; // Nhà thông thái
      if (currentStats.xp >= 5000) unlockedCount++; // Nhà vô địch học thuật
      
      // Đảm bảo tối thiểu 1 (Thần Sấm Phát Âm mặc định)
      const finalCount = Math.max(1, unlockedCount);
      setUnlockedBadgesCount(finalCount);

      // 5. Dựng bảng xếp hạng động
      const otherStudents: LeaderboardUser[] = [];

      const currentUser: LeaderboardUser = {
        name: "Khánh Tân",
        class: "11A3",
        xp: currentStats.xp,
        streak: currentStats.streak,
        badgesCount: finalCount,
        isCurrentUser: true
      };

      // Ghép và sắp xếp theo XP giảm dần
      const merged = [...otherStudents, currentUser].sort((a, b) => b.xp - a.xp);
      setLeaderboard(merged);
    };

    loadStats();
    window.addEventListener("stats-updated", loadStats);

    return () => {
      window.removeEventListener("stats-updated", loadStats);
    };
  }, []);

  // Danh sách 6 Huy hiệu danh giá dưới dạng các icon Neon 3D phát sáng
  const badges: BadgeItem[] = [
    {
      id: "streak-warrior",
      name: "Chiến Binh Chuyên Cần",
      description: "Dành cho học viên chăm chỉ học tập liên tục.",
      icon: Flame,
      glowColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      borderColor: "group-hover:border-amber-400/40",
      neonShadow: "shadow-amber-500/20",
      unlocked: stats.streak >= 5, // Mở khóa động nếu streak >= 5 ngày
      requirement: "Chuỗi Streak >= 5 ngày"
    },
    {
      id: "pronunciation-thunder",
      name: "Thần Sấm Phát Âm",
      description: "Phát âm chuẩn xác vượt trội dưới sự đánh giá của AI Coach.",
      icon: Mic,
      glowColor: "text-violet-400 bg-violet-500/10 border-violet-500/30",
      borderColor: "group-hover:border-violet-400/40",
      neonShadow: "shadow-violet-500/20",
      unlocked: avgSpeakingScore >= 90, // Mở khóa động nếu Độ chính xác phát âm TB >= 90%
      requirement: "Phát âm TB >= 90%"
    },
    {
      id: "vocab-slayer",
      name: "Sát Thủ Từ Vựng",
      description: "Thuộc lòng và viết chính xác toàn bộ từ vựng cốt lõi.",
      icon: BookOpen,
      glowColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      borderColor: "group-hover:border-emerald-400/40",
      neonShadow: "shadow-emerald-500/20",
      unlocked: learningLogs.some(log => log.type === "vocabulary" && log.score === 100),
      requirement: "Đúng 100% từ vựng SGK"
    },
    {
      id: "dictation-king",
      name: "Vua Nghe Hiểu",
      description: "Khả năng nghe chép chính tả tiếng Anh xuất sắc.",
      icon: Volume2,
      glowColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      borderColor: "group-hover:border-blue-400/40",
      neonShadow: "shadow-blue-500/20",
      unlocked: learningLogs.some(log => log.type === "dictation" && log.score === 100),
      requirement: "Đạt 100% Dictation"
    },
    {
      id: "wise-scholar",
      name: "Nhà Thông Thái",
      description: "Vượt qua các bài kiểm tra trắc nghiệm cực kỳ nhanh gọn.",
      icon: Star,
      glowColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
      borderColor: "group-hover:border-yellow-400/40",
      neonShadow: "shadow-yellow-500/20",
      unlocked: learningLogs.some(log => log.type === "quiz" && log.score >= 90),
      requirement: "Đạt >= 90% trắc nghiệm Quiz"
    },
    {
      id: "grand-champion",
      name: "Nhà Vô Địch Học Thuật",
      description: "Học sinh đạt tích lũy điểm cao nhất lớp.",
      icon: Crown,
      glowColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
      borderColor: "group-hover:border-yellow-400/40",
      neonShadow: "shadow-yellow-500/20",
      unlocked: stats.xp >= 5000,
      requirement: "Tích lũy >= 5,000 XP"
    }
  ];

  const top3 = leaderboard.slice(0, 3);
  const remainingRanks = leaderboard.slice(3);

  const podiumOrder = [
    top3[1], // Top 2
    top3[0], // Top 1
    top3[2]  // Top 3
  ];

  // Variants cho các hàng trong bảng nhật ký học tập
  const tableRowVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    })
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="border-b border-slate-800/40 pb-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>Bảng Vàng Học Viên K-12</span>
        </div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
          Thi Đua & Thành Tích
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Thi đua giành vị trí dẫn đầu lớp học và mở khóa các huy hiệu vinh dự cao quý.
        </p>
      </div>

      {/* Bento Grid 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PHÂN HỆ 1: BẢNG VÀNG TIẾN BỘ (Leaderboard Grid - col-span-2) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800/80 bg-[#151B2B] p-6 shadow-xl space-y-6 hover:border-slate-700/30 transition-all duration-300">
          
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-md">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">Bảng Thi Đua Học Tập Tuần Tuần 🏆</h2>
                <p className="text-[10px] text-slate-500">Cập nhật vị trí xếp hạng học tập thời gian thực</p>
              </div>
            </div>
            <span className="text-[9px] font-black bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-lg uppercase tracking-wider shadow">
              Tuần này
            </span>
          </div>

          {/* Bục Vinh Quang Top 3 */}
          {podiumOrder[0] && (
            <div className="grid grid-cols-3 gap-4 pt-4 pb-2 items-end max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 via-transparent to-transparent blur-xl rounded-3xl pointer-events-none" />
              
              {podiumOrder.map((student, idx) => {
                if (!student) return null;
                const isTop1 = student.xp === top3[0]?.xp;
                const isTop2 = student.xp === top3[1]?.xp;
                const isTop3 = student.xp === top3[2]?.xp;
                
                let rankBadge = "🥉";
                let borderColor = "border-amber-700/30 bg-amber-900/5 text-amber-500";
                let heightClass = "h-24";

                if (isTop1) {
                  rankBadge = "👑";
                  borderColor = "border-yellow-500/40 bg-yellow-950/20 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]";
                  heightClass = "h-32";
                } else if (isTop2) {
                  rankBadge = "🥈";
                  borderColor = "border-slate-400/30 bg-slate-850/30 text-slate-350";
                  heightClass = "h-28";
                }

                // Check highlight Khánh Tân trên bục vinh quang (nếu lọt Top 3)
                const isUserHighlight = student.isCurrentUser;

                return (
                  <motion.div
                    key={student.name}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: idx * 0.1 }}
                    className="flex flex-col items-center text-center relative group"
                  >
                    {/* Avatar tròn với vương miện */}
                    <div className="relative mb-2">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-sm shadow-lg shadow-black/40 border-2 relative z-10 transition-transform duration-300 group-hover:scale-105 ${
                        isTop1 
                          ? "bg-gradient-to-tr from-yellow-500 to-amber-600 border-yellow-400 ring-2 ring-yellow-400/30"
                          : isTop2
                          ? "bg-gradient-to-tr from-slate-400 to-slate-600 border-slate-300"
                          : "bg-gradient-to-tr from-amber-600 to-amber-800 border-amber-500"
                      }`}>
                        {student.name.split(" ").slice(-1)[0][0]}
                      </div>
                      
                      {/* Badge Top 1 2 3 */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xl drop-shadow z-20 animate-bounce">
                        {rankBadge}
                      </div>
                    </div>

                    {/* Bục */}
                    <div className={`w-full rounded-t-2xl border-t border-x flex flex-col justify-between p-3 select-none transition-all duration-300 relative ${heightClass} ${borderColor} ${
                      isUserHighlight ? "ring-2 ring-violet-500 bg-violet-950/30 shadow-[0_0_20px_rgba(139,92,246,0.4)] border-violet-500/50" : ""
                    }`}>
                      <div className="space-y-1">
                        <span className={`text-[10px] md:text-xs font-black truncate block max-w-full ${isUserHighlight ? "text-violet-400" : "text-slate-200"}`}>
                          {student.name}
                        </span>
                        <span className="text-[8px] font-bold text-slate-500 block uppercase">Lớp {student.class}</span>
                      </div>

                      <div className="pt-2">
                        <span className="text-xs md:text-sm font-black block tracking-tight">{student.xp.toLocaleString()}</span>
                        <span className="text-[7px] font-bold tracking-widest text-slate-500 uppercase">XP</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Danh sách xếp hạng từ hạng 4 trở xuống */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1"
          >
            {remainingRanks.map((student, index) => {
              const rank = index + 4;
              // Check highlight Khánh Tân
              const isUserHighlight = student.isCurrentUser;

              return (
                <motion.div
                  key={student.name}
                  variants={itemVariants}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group ${
                    isUserHighlight
                      ? "ring-2 ring-violet-500 bg-violet-950/30 shadow-[0_0_20px_rgba(139,92,246,0.4)] border-violet-500/50 translate-x-1"
                      : "bg-[#0B0F19]/40 border-slate-850 hover:bg-slate-800/10 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <span className="w-5 text-center text-xs font-black text-slate-500 group-hover:text-indigo-400 transition-colors">
                      #{rank}
                    </span>

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-inner relative transition-transform duration-300 group-hover:scale-105 ${
                      isUserHighlight 
                        ? "bg-gradient-to-tr from-violet-500 to-indigo-600 border border-violet-400/30"
                        : "bg-slate-800 border border-slate-850"
                    }`}>
                      {student.name.split(" ").slice(-1)[0][0]}
                      {isUserHighlight && <div className="absolute bottom-[-1px] right-[-1px] w-2 h-2 bg-emerald-500 rounded-full border border-[#151B2B]" />}
                    </div>

                    {/* Name & Class */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black truncate ${isUserHighlight ? "text-violet-400 font-extrabold" : "text-slate-200"}`}>
                          {student.name}
                        </span>
                        {isUserHighlight && (
                          <span className="text-[7px] font-black bg-violet-500/20 text-violet-400 px-1 py-0.2 rounded border border-violet-500/30 uppercase tracking-widest">
                            Bạn
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-550 block">Lớp {student.class}</span>
                    </div>
                  </div>

                  {/* XP & Streak details */}
                  <div className="flex items-center gap-5 text-right">
                    <div className="hidden sm:flex items-center gap-3">
                      {/* Badges count */}
                      <div className="flex items-center gap-0.5 bg-slate-900/60 border border-slate-850 px-2 py-0.5 rounded-lg text-[9px] text-slate-450 font-bold">
                        <Award className="w-3 h-3 text-indigo-400" />
                        <span>{student.badgesCount} danh hiệu</span>
                      </div>
                      
                      {/* Streak */}
                      <div className="flex items-center gap-0.5 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-lg text-[9px] text-amber-500 font-bold animate-pulse">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        <span>{student.streak} ngày</span>
                      </div>
                    </div>

                    <div className="min-w-[60px]">
                      <span className="text-xs font-black text-slate-100 block">{student.xp.toLocaleString()}</span>
                      <span className="text-[7px] font-bold tracking-widest text-slate-500 uppercase block">XP</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Khích lệ người dùng */}
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[10px] md:text-xs font-bold text-indigo-400">
              ⚡ Hãy chăm chỉ tích lũy thêm XP để thăng hạng vượt qua các bạn học khác trên Bảng Vàng! Luyện tập ngay nào!
            </p>
            <button 
              onClick={() => window.location.href = "/learn"} 
              className="text-[10px] font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 rounded-xl hover:scale-102 active:scale-95 transition-all shadow-md shrink-0"
            >
              Học ngay
            </button>
          </div>

        </div>

        {/* PHÂN HỆ 2: BẢNG TÀNG HUY HIỆU (Badges Collection - col-span-1) */}
        <div className="rounded-3xl border border-slate-800/80 bg-[#151B2B] p-6 shadow-xl space-y-6 hover:border-slate-700/30 transition-all duration-300 flex flex-col justify-between">
          
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2.5 border-b border-slate-800/40 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">Bộ Sưu Tập Danh Hiệu 🎖️</h2>
                <p className="text-[10px] text-slate-500">Bộ sưu tập huy hiệu cao quý của bạn</p>
              </div>
            </div>

            {/* Lưới Grid 2x3 hiển thị 6 Huy hiệu danh giá */}
            <motion.div 
              variants={badgeContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 pt-2"
            >
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.id}
                    variants={badgeVariants}
                    className={`relative rounded-2xl border p-3 flex flex-col justify-between min-h-[145px] transition-all duration-300 group shadow-md hover:scale-[1.02] ${
                      badge.unlocked
                        ? `${badge.glowColor} ${badge.neonShadow} cursor-pointer`
                        : "border-slate-900 bg-slate-900/30 overflow-hidden"
                    }`}
                  >
                    {/* Glassmorphism lock overlay cho các huy hiệu chưa đạt */}
                    {!badge.unlocked && (
                      <div className="absolute inset-0 bg-[#0B0F19]/65 backdrop-blur-[2.5px] rounded-2xl flex flex-col items-center justify-center p-3 text-center z-10 border border-slate-900/60 transition-all duration-300 group-hover:bg-[#0B0F19]/50">
                        <div className="w-8 h-8 rounded-xl bg-slate-950/80 border border-slate-800/60 flex items-center justify-center text-slate-450 mb-1.5 shadow-md">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Chưa đạt</span>
                        <span className="text-[9px] font-black text-violet-400 max-w-[95%] leading-tight text-center break-words">
                          {badge.requirement}
                        </span>
                      </div>
                    )}

                    {/* Badge Content */}
                    <div className={`flex flex-col justify-between h-full ${!badge.unlocked ? "opacity-30 blur-[0.5px]" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        {/* Icon Neon 3D phát sáng */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-105 shadow-inner ${
                          badge.unlocked
                            ? `text-white bg-gradient-to-tr from-violet-600 to-indigo-600 border-violet-400/25`
                            : "bg-slate-800 border-slate-850 text-slate-650"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-1 mt-3">
                        <h3 className={`text-[11px] font-black leading-tight truncate ${
                          badge.unlocked ? "text-slate-100 group-hover:text-indigo-400 transition-colors" : "text-slate-650"
                        }`}>
                          {badge.name}
                        </h3>
                        
                        <p className="text-[8px] text-slate-400 leading-normal line-clamp-2">
                          {badge.description}
                        </p>
                      </div>

                      {/* Neon bottom line */}
                      {badge.unlocked && (
                        <div className="w-[80%] mx-auto h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-30 group-hover:opacity-100 transition-all duration-300 mt-2" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Thống kê chung huy hiệu */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/40 mt-4 bg-slate-900/10 p-2.5 rounded-2xl select-none">
            <div className="text-center space-y-0.5">
              <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider">Đã mở khóa</span>
              <span className="text-xs font-black text-emerald-400">
                {unlockedBadgesCount} / 6 Danh hiệu
              </span>
            </div>
            <div className="text-center space-y-0.5 border-l border-slate-800/60">
              <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider">Độ hoàn thành</span>
              <span className="text-xs font-black text-indigo-400">
                {Math.round((unlockedBadgesCount / 6) * 100)}%
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* PHÂN HỆ 3: NHẬT KÝ LUYỆN TẬP CHUYÊN SÂU (Learning Log - Hàng ngang đáy trang) */}
      <div className="rounded-3xl border border-slate-800/80 bg-[#151B2B] p-6 shadow-xl space-y-4 hover:border-slate-700/30 transition-all duration-300">
        
        <div className="flex items-center gap-2.5 border-b border-slate-800/40 pb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-md">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Nhật Ký Luyện Tập Chuyên Sâu</h2>
            <p className="text-[10px] text-slate-550">Lịch sử và tiến độ hoàn thành các kỹ năng học tập gần nhất</p>
          </div>
        </div>

        {/* Bảng nhật ký tối giản */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-850/60 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-3 px-4">Bài học</th>
                <th className="py-3 px-4">Hình thức</th>
                <th className="py-3 px-4 text-center">Kết quả</th>
                <th className="py-3 px-4">Đánh giá</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4 text-right">Phần thưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/30 text-xs">
              {learningLogs.map((log, idx) => (
                <motion.tr 
                  key={idx} 
                  custom={idx}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  className="hover:bg-slate-800/10 transition-colors duration-200 group"
                >
                  <td className="py-3 px-4 font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {log.lessonTitle}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-black tracking-wider text-slate-400">
                    <span className={`px-2 py-0.5 rounded-lg border text-[9px] ${
                      log.type === "speaking" 
                        ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                        : log.type === "dictation"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : log.type === "quiz"
                        ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-center text-sm tracking-tight text-slate-200">
                    {log.score}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {log.passed ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đạt</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-500 text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15 w-fit">
                        <AlertCircle className="w-3 h-3 animate-pulse" />
                        <span>Chưa Đạt</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-450 font-medium">
                    {log.timeAgo}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-indigo-400">
                    +{log.xpEarned} XP
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
