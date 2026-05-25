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
  const [stats, setStats] = useState<StudentStats>({ xp: 0, diamonds: 0, streak: 0 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [learningLogs, setLearningLogs] = useState<LearningLogItem[]>([]);

  // Đọc stats & sinh dữ liệu bảng xếp hạng động
  useEffect(() => {
    // 1. Đọc stats từ localStorage
    const loadStats = () => {
      const storedStats = localStorage.getItem("gsa-student-stats");
      let currentStats = { xp: 0, diamonds: 0, streak: 0 };
      if (storedStats) {
        try {
          currentStats = JSON.parse(storedStats);
          setStats(currentStats);
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Dựng bảng xếp hạng động
      const otherStudents: LeaderboardUser[] = [
        { name: "Minh Tuấn", class: "11A3", xp: 4500, streak: 12, badgesCount: 4 },
        { name: "Hải Đăng", class: "11A1", xp: 3800, streak: 8, badgesCount: 3 },
        { name: "Thu Trang", class: "11A2", xp: 3200, streak: 5, badgesCount: 2 },
        { name: "Hoàng Bách", class: "11A4", xp: 2100, streak: 3, badgesCount: 1 },
        { name: "Diệu Linh", class: "11A1", xp: 1500, streak: 2, badgesCount: 1 }
      ];

      const currentUser: LeaderboardUser = {
        name: "Học viên",
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
      let currentStats = { xp: 0, diamonds: 0, streak: 0 };
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

      // 4. Tính toán số lượng huy hiệu mở khóa của người dùng
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
      const otherStudents: LeaderboardUser[] = [
        { name: "Minh Tuấn", class: "11A3", xp: 4500, streak: 12, badgesCount: 4 },
        { name: "Hải Đăng", class: "11A1", xp: 3800, streak: 8, badgesCount: 3 },
        { name: "Thu Trang", class: "11A2", xp: 3200, streak: 5, badgesCount: 2 },
        { name: "Hoàng Bách", class: "11A4", xp: 2100, streak: 3, badgesCount: 1 },
        { name: "Diệu Linh", class: "11A1", xp: 1500, streak: 2, badgesCount: 1 }
      ];

      const currentUser: LeaderboardUser = {
        name: "Học viên",
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
      glowColor: "text-amber-600 bg-amber-500/10 border-amber-500/30",
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
      glowColor: "text-primary bg-primary-light border-indigo-500/30",
      borderColor: "group-hover:border-indigo-400/40",
      neonShadow: "shadow-indigo-500/20",
      unlocked: avgSpeakingScore >= 90, // Mở khóa động nếu Độ chính xác phát âm TB >= 90%
      requirement: "Phát âm TB >= 90%"
    },
    {
      id: "vocab-slayer",
      name: "Sát Thủ Từ Vựng",
      description: "Thuộc lòng và viết chính xác toàn bộ từ vựng cốt lõi.",
      icon: BookOpen,
      glowColor: "text-teal-600 bg-teal-500/10 border-teal-500/30",
      borderColor: "group-hover:border-teal-400/40",
      neonShadow: "shadow-teal-500/20",
      unlocked: learningLogs.some(log => log.type === "vocabulary" && log.score === 100),
      requirement: "Đúng 100% từ vựng SGK"
    },
    {
      id: "dictation-king",
      name: "Vua Nghe Hiểu",
      description: "Khả năng nghe chép chính tả tiếng Anh xuất sắc.",
      icon: Volume2,
      glowColor: "text-blue-600 bg-blue-500/10 border-blue-500/30",
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
      <div className="border-b border-[rgba(0,0,0,0.1)] pb-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>Bảng Vàng Học Viên K-12</span>
        </div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-500">
          Thi Đua & Thành Tích
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Thi đua giành vị trí dẫn đầu lớp học và mở khóa các huy hiệu vinh dự cao quý.
        </p>
      </div>

      {/* Bento Grid 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PHÂN HỆ 1: BẢNG VÀNG TIẾN BỘ (Leaderboard Grid - col-span-2) */}
        <div className="lg:col-span-2 rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl space-y-6 hover:border-slate-300/30 transition-all duration-300">
          
          <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.1)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[var(--radius-btn)] bg-primary-light border border-primary-dark flex items-center justify-center text-primary shadow-md">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-head">Bảng Thi Đua Học Tập Tuần Tuần 🏆</h2>
                <p className="text-[10px] text-text-muted">Cập nhật vị trí xếp hạng học tập thời gian thực</p>
              </div>
            </div>
            <span className="text-[9px] font-black bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/15 border border-indigo-500/30 text-primary px-2 py-0.5 rounded-[var(--radius-btn)] uppercase tracking-wider shadow">
              Tuần này
            </span>
          </div>

          {/* Bục Vinh Quang Top 3 */}
          {podiumOrder[0] && (
            <div className="grid grid-cols-3 gap-4 pt-4 pb-2 items-end max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent blur-xl rounded-[var(--radius-card)] pointer-events-none" />
              
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
                  borderColor = "bg-gradient-to-r from-indigo-50 to-white border-l-4 border-indigo-500 text-text-head shadow-md";
                  heightClass = "h-32";
                } else if (isTop2) {
                  rankBadge = "🥈";
                  borderColor = "border-[rgba(0,0,0,0.1)] bg-page text-text-muted border-x border-t";
                  heightClass = "h-28";
                }

                // Check highlight người dùng trên bục vinh quang (nếu lọt Top 3)
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
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-text-head text-sm shadow-lg shadow-black/40 border-2 relative z-10 transition-transform duration-300 group-hover:scale-105 ${
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
                      isUserHighlight ? "ring-2 ring-indigo-500 bg-indigo-950/30 shadow-[0_0_20px_rgba(139,92,246,0.4)] border-indigo-500/50" : ""
                    }`}>
                      <div className="space-y-1">
                        <span className={`text-[10px] md:text-xs font-black truncate block max-w-full ${isUserHighlight ? "text-primary" : "text-text-head"}`}>
                          {student.name}
                        </span>
                        <span className="text-[8px] font-bold text-text-muted block uppercase">Lớp {student.class}</span>
                      </div>

                      <div className="pt-2">
                        <span className="text-xs md:text-sm font-black block tracking-tight">{student.xp.toLocaleString()}</span>
                        <span className="text-[7px] font-bold tracking-widest text-text-muted uppercase">XP</span>
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
              // Check highlight người dùng
              const isUserHighlight = student.isCurrentUser;

              return (
                <motion.div
                  key={student.name}
                  variants={itemVariants}
                  className={`flex items-center justify-between p-3 rounded-[var(--radius-card)] border transition-all duration-300 group ${
                    isUserHighlight
                      ? "ring-2 ring-indigo-500 bg-indigo-950/30 shadow-[0_0_20px_rgba(139,92,246,0.4)] border-indigo-500/50 translate-x-1"
                      : "bg-page border-[rgba(0,0,0,0.1)] hover:bg-card hover:border-[rgba(0,0,0,0.1)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <span className="w-5 text-center text-xs font-black text-text-muted group-hover:text-primary transition-colors">
                      #{rank}
                    </span>

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-[var(--radius-card)] flex items-center justify-center text-xs font-black text-text-head shadow-inner relative transition-transform duration-300 group-hover:scale-105 ${
                      isUserHighlight 
                        ? "bg-gradient-to-tr from-indigo-500 to-indigo-600 border border-indigo-400/30"
                        : "bg-card border border-[rgba(0,0,0,0.1)]"
                    }`}>
                      {student.name.split(" ").slice(-1)[0][0]}
                      {isUserHighlight && <div className="absolute bottom-[-1px] right-[-1px] w-2 h-2 bg-teal-500 rounded-full border border-[#151B2B]" />}
                    </div>

                    {/* Name & Class */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black truncate ${isUserHighlight ? "text-primary font-extrabold" : "text-text-head"}`}>
                          {student.name}
                        </span>
                        {isUserHighlight && (
                          <span className="text-[7px] font-black bg-primary/20 text-primary px-1 py-0.2 rounded border border-indigo-500/30 uppercase tracking-widest">
                            Bạn
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-text-body block">Lớp {student.class}</span>
                    </div>
                  </div>

                  {/* XP & Streak details */}
                  <div className="flex items-center gap-5 text-right">
                    <div className="hidden sm:flex items-center gap-3">
                      {/* Badges count */}
                      <div className="flex items-center gap-0.5 bg-card border border-[rgba(0,0,0,0.1)] px-2 py-0.5 rounded-[var(--radius-btn)] text-[9px] text-text-muted font-bold">
                        <Award className="w-3 h-3 text-primary" />
                        <span>{student.badgesCount} danh hiệu</span>
                      </div>
                      
                      {/* Streak */}
                      <div className="flex items-center gap-0.5 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-[var(--radius-btn)] text-[9px] text-amber-500 font-bold animate-pulse">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        <span>{student.streak} ngày</span>
                      </div>
                    </div>

                    <div className="min-w-[60px]">
                      <span className="text-xs font-black text-text-head block">{student.xp.toLocaleString()}</span>
                      <span className="text-[7px] font-bold tracking-widest text-text-muted uppercase block">XP</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Khích lệ người dùng */}
          <div className="p-4 rounded-[var(--radius-card)] bg-primary/5 border border-indigo-500/10 flex items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[10px] md:text-xs font-bold text-primary">
              ⚡ Hãy chăm chỉ tích lũy thêm XP để thăng hạng vượt qua các bạn học khác trên Bảng Vàng! Luyện tập ngay nào!
            </p>
            <button 
              onClick={() => window.location.href = "/learn"} 
              className="text-[10px] font-black text-white bg-gradient-to-r from-indigo-600 to-indigo-600 px-3 py-1.5 rounded-[var(--radius-card)] hover:scale-102 active:scale-95 transition-all shadow-md shrink-0"
            >
              Học ngay
            </button>
          </div>

        </div>

        {/* PHÂN HỆ 2: BẢNG TÀNG HUY HIỆU (Badges Collection - col-span-1) */}
        <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl space-y-6 hover:border-slate-300/30 transition-all duration-300 flex flex-col justify-between">
          
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2.5 border-b border-[rgba(0,0,0,0.1)] pb-3">
              <div className="w-8 h-8 rounded-[var(--radius-btn)] bg-teal-500/10 border border-teal-300 flex items-center justify-center text-teal-600 shadow-md">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-head">Bộ Sưu Tập Danh Hiệu 🎖️</h2>
                <p className="text-[10px] text-text-muted">Bộ sưu tập huy hiệu cao quý của bạn</p>
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
                    className={`relative rounded-[var(--radius-card)] p-3 flex flex-col justify-between min-h-[145px] transition-all duration-300 group shadow-md hover:scale-[1.02] ${
                      badge.unlocked
                        ? `${badge.glowColor} ${badge.neonShadow} border border-indigo-400 cursor-pointer`
                        : "border border-dashed border-slate-300 bg-page overflow-hidden"
                    }`}
                  >
                    {/* Glassmorphism lock overlay cho các huy hiệu chưa đạt */}
                    {!badge.unlocked && (
                      <div className="absolute inset-0 bg-page/80 backdrop-blur-[2.5px] rounded-[var(--radius-card)] flex flex-col items-center justify-center p-3 text-center z-10 border border-slate-300 transition-all duration-300 group-hover:bg-page/90">
                        <div className="w-8 h-8 rounded-[var(--radius-card)] bg-card border border-[rgba(0,0,0,0.1)] flex items-center justify-center text-text-muted mb-1.5 shadow-md">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest block mb-0.5">Chưa đạt</span>
                        <span className="text-[9px] font-black text-primary max-w-[95%] leading-tight text-center break-words">
                          {badge.requirement}
                        </span>
                      </div>
                    )}

                    {/* Badge Content */}
                    <div className={`flex flex-col justify-between h-full ${!badge.unlocked ? "opacity-30 blur-[0.5px]" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        {/* Icon Neon 3D phát sáng */}
                        <div className={`w-9 h-9 rounded-[var(--radius-card)] flex items-center justify-center border transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-105 shadow-inner ${
                          badge.unlocked
                            ? `text-white bg-gradient-to-tr from-indigo-600 to-indigo-600 border-indigo-400/25`
                            : "bg-card border-[rgba(0,0,0,0.1)] text-text-body"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-1 mt-3">
                        <h3 className={`text-[11px] font-black leading-tight truncate ${
                          badge.unlocked ? "text-text-head group-hover:text-primary transition-colors" : "text-text-body"
                        }`}>
                          {badge.name}
                        </h3>
                        
                        <p className="text-[8px] text-text-muted leading-normal line-clamp-2">
                          {badge.description}
                        </p>
                      </div>

                      {/* Neon bottom line */}
                      {badge.unlocked && (
                        <div className="w-[80%] mx-auto h-[2px] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-500 opacity-30 group-hover:opacity-100 transition-all duration-300 mt-2" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Thống kê chung huy hiệu */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[rgba(0,0,0,0.1)] mt-4 bg-card p-2.5 rounded-[var(--radius-card)] select-none">
            <div className="text-center space-y-0.5">
              <span className="text-[8px] text-text-muted font-bold block uppercase tracking-wider">Đã mở khóa</span>
              <span className="text-xs font-black text-teal-600">
                {unlockedBadgesCount} / 6 Danh hiệu
              </span>
            </div>
            <div className="text-center space-y-0.5 border-l border-[rgba(0,0,0,0.1)]">
              <span className="text-[8px] text-text-muted font-bold block uppercase tracking-wider">Độ hoàn thành</span>
              <span className="text-xs font-black text-primary">
                {Math.round((unlockedBadgesCount / 6) * 100)}%
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* PHÂN HỆ 3: NHẬT KÝ LUYỆN TẬP CHUYÊN SÂU (Learning Log - Hàng ngang đáy trang) */}
      <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl space-y-4 hover:border-slate-300/30 transition-all duration-300">
        
        <div className="flex items-center gap-2.5 border-b border-[rgba(0,0,0,0.1)] pb-3">
          <div className="w-8 h-8 rounded-[var(--radius-btn)] bg-primary-light border border-primary-dark flex items-center justify-center text-primary shadow-md">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-head">Nhật Ký Luyện Tập Chuyên Sâu</h2>
            <p className="text-[10px] text-text-body">Lịch sử và tiến độ hoàn thành các kỹ năng học tập gần nhất</p>
          </div>
        </div>

        {/* Bảng nhật ký tối giản */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.1)] text-[9px] font-bold text-text-muted uppercase tracking-widest">
                <th className="py-3 px-4">Bài học</th>
                <th className="py-3 px-4">Hình thức</th>
                <th className="py-3 px-4 text-center">Kết quả</th>
                <th className="py-3 px-4">Đánh giá</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4 text-right">Phần thưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {learningLogs.map((log, idx) => (
                <motion.tr 
                  key={idx} 
                  custom={idx}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  className="hover:bg-card transition-colors duration-200 group"
                >
                  <td className="py-3 px-4 font-bold text-text-head group-hover:text-primary transition-colors">
                    {log.lessonTitle}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-black tracking-wider text-text-muted">
                    <span className={`px-2 py-0.5 rounded-[var(--radius-btn)] border text-[9px] ${
                      log.type === "speaking" 
                        ? "bg-primary-light border-primary-dark text-primary"
                        : log.type === "dictation"
                        ? "bg-blue-500/10 border-blue-300 text-blue-600"
                        : log.type === "quiz"
                        ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        : "bg-teal-500/10 border-teal-300 text-teal-600"
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-center text-sm tracking-tight text-text-head">
                    {log.score}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {log.passed ? (
                      <span className="flex items-center gap-1 text-teal-600 text-[10px] bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/15 w-fit">
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
                  <td className="py-3 px-4 text-text-muted font-medium">
                    {log.timeAgo}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-primary">
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
