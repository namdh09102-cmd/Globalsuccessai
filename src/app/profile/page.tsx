"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Sparkles, 
  Award, 
  Gem, 
  Heart, 
  Check, 
  Save, 
  GraduationCap, 
  School, 
  Settings, 
  Trophy, 
  BookOpen, 
  Star,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BadgeGrid from "@/components/BadgeGrid";

interface StudentStats {
  xp: number;
  diamonds: number;
  streak: number;
}

interface UserProfile {
  fullName: string;
  school: string;
  grade: string;
}

export default function ProfilePage() {
  // 1. Quản lý thông tin hồ sơ
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Khánh Tân",
    school: "THPT Chuyên Nguyễn Huệ",
    grade: "Lớp 11"
  });

  // 2. Quản lý chỉ số stats học sinh
  const [stats, setStats] = useState<StudentStats>({
    xp: 0,
    diamonds: 0,
    streak: 0
  });

  // 3. Quản lý điểm số kỹ năng phân tích bằng AI
  const [skillScores, setSkillScores] = useState({
    pronunciation: 0,
    dictation: 0,
    grammar: 0,
    vocabulary: 0,
    fluency: 0
  });

  // Trạng thái lưu thông báo thành công
  const [isSavedNotification, setIsSavedNotification] = useState(false);

  // Load dữ liệu từ localStorage
  useEffect(() => {
    // A. Load Stats
    const loadStats = () => {
      const storedStats = localStorage.getItem("gsa-student-stats");
      if (storedStats) {
        try {
          const parsed = JSON.parse(storedStats);
          setStats({
            xp: parsed.xp ?? 0,
            diamonds: parsed.diamonds ?? 0,
            streak: parsed.streak ?? 0
          });
        } catch (e) {}
      }
    };
    loadStats();
    window.addEventListener("stats-updated", loadStats);

    // B. Load User Profile
    const storedProfile = localStorage.getItem("gsa-user-profile");
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (e) {}
    }

    // C. Tính toán/Đồng bộ điểm số kỹ năng từ kết quả thực tế
    const syncSkills = () => {
      // Đọc điểm trung bình phát âm từ gsa-pronunciation-accuracy
      const storedAccuracy = localStorage.getItem("gsa-pronunciation-accuracy");
      let pronScore = 0;
      if (storedAccuracy) {
        const parsed = parseInt(storedAccuracy, 10);
        if (!isNaN(parsed)) pronScore = parsed;
      }

      // Đọc điểm trung bình nghe chép từ logs
      const storedLogs = localStorage.getItem("gsa-learning-logs");
      let dictScore = 0;
      let gramScore = 0;
      let vocabScore = 0;
      let fluScore = 0;

      if (storedLogs) {
        try {
          const logs = JSON.parse(storedLogs);
          
          // Dictation
          const dictationLogs = logs.filter((log: any) => log.type === "dictation");
          if (dictationLogs.length > 0) {
            const sum = dictationLogs.reduce((acc: number, log: any) => acc + log.score, 0);
            dictScore = Math.round(sum / dictationLogs.length);
          }

          // Grammar
          const grammarLogs = logs.filter((log: any) => log.type === "grammar");
          if (grammarLogs.length > 0) {
            const sum = grammarLogs.reduce((acc: number, log: any) => acc + log.score, 0);
            gramScore = Math.round(sum / grammarLogs.length);
          }

          // Vocabulary
          const vocabularyLogs = logs.filter((log: any) => log.type === "vocabulary");
          if (vocabularyLogs.length > 0) {
            const sum = vocabularyLogs.reduce((acc: number, log: any) => acc + log.score, 0);
            vocabScore = Math.round(sum / vocabularyLogs.length);
          }

          // Speaking / Fluency (Lấy trung bình từ log hoặc gsa-speaking-scores)
          const speakingLogs = logs.filter((log: any) => log.type === "speaking");
          if (speakingLogs.length > 0) {
            const sum = speakingLogs.reduce((acc: number, log: any) => acc + log.score, 0);
            fluScore = Math.round((sum / speakingLogs.length) * 0.95); // Phản xạ thường thấp hơn phát âm chuẩn 1 chút
          }
        } catch (e) {}
      }

      setSkillScores({
        pronunciation: Math.min(100, Math.max(0, pronScore)),
        dictation: Math.min(100, Math.max(0, dictScore)),
        grammar: Math.min(100, Math.max(0, gramScore)),
        vocabulary: Math.min(100, Math.max(0, vocabScore)),
        fluency: Math.min(100, Math.max(0, fluScore))
      });
    };
    syncSkills();

    return () => {
      window.removeEventListener("stats-updated", loadStats);
    };
  }, []);

  // Xử lý lưu hồ sơ
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("gsa-user-profile", JSON.stringify(profile));
    
    // Phát sự kiện cập nhật để RightPanel / Sidebar nhận biết thay đổi nếu cần
    window.dispatchEvent(new Event("profile-updated"));

    setIsSavedNotification(true);
    setTimeout(() => setIsSavedNotification(false), 3000);
  };

  // SVG Radar Chart Math
  const getCoordinates = (index: number, value: number) => {
    // 5 đỉnh tương ứng 5 kỹ năng (đỉnh đầu tiên ở 12h, góc -90 độ hay -Math.PI / 2)
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = 160 + 100 * value * Math.cos(angle);
    const y = 160 + 100 * value * Math.sin(angle);
    return { x, y };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    // Đẩy chữ ra ngoài bán kính R=100
    const x = 160 + 128 * Math.cos(angle);
    const y = 160 + 128 * Math.sin(angle);
    return { x, y };
  };

  // Đa giác lưới đa giác đồng tâm (levels: 20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getLevelPath = (level: number) => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const { x, y } = getCoordinates(i, level);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  // Đa giác phủ điểm số của học sinh
  const getStudentPath = () => {
    const points = [];
    const values = [
      skillScores.pronunciation / 100,
      skillScores.dictation / 100,
      skillScores.grammar / 100,
      skillScores.vocabulary / 100,
      skillScores.fluency / 100
    ];
    for (let i = 0; i < 5; i++) {
      const { x, y } = getCoordinates(i, values[i]);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  // Mảng các đỉnh và nhãn
  const skillDetails = [
    { name: "Phát âm (Pronunciation)", val: skillScores.pronunciation, label: "Phát âm" },
    { name: "Nghe chép (Dictation)", val: skillScores.dictation, label: "Nghe chép" },
    { name: "Ngữ pháp (Grammar)", val: skillScores.grammar, label: "Ngữ pháp" },
    { name: "Từ vựng (Vocabulary)", val: skillScores.vocabulary, label: "Từ vựng" },
    { name: "Phản xạ (Fluency)", val: skillScores.fluency, label: "Phản xạ" }
  ];

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none relative">
      {/* Toast báo lưu thành công */}
      <AnimatePresence>
        {isSavedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-55 bg-teal-500 text-text-head font-extrabold text-xs px-4 py-3 rounded-[var(--radius-card)] shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center gap-2 border border-teal-400/35"
          >
            <div className="w-5 h-5 rounded-full bg-card/20 flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
            <span>Đã cập nhật hồ sơ thành công!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header lớn */}
      <div className="border-b border-[rgba(0,0,0,0.1)] pb-5">
        <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-1 font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>Học bạ điện tử K-12</span>
        </div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-500 tracking-tight">
          Hồ Sơ Học Viên & Phân Tích Kỹ Năng
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Theo dõi điểm số kỹ năng AI, chỉ số cúp học tập và tinh chỉnh thông tin tài khoản của bạn.
        </p>
      </div>

      {/* Grid Bento Box 3 Cột */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        
        {/* ================= CỘT TRÁI (LỚN - 2 Cột) ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PHÂN HỆ 1: THẺ DANH VỌNG HỌC VIÊN (Student Identity - Bento Card #1) */}
          <motion.div 
            variants={cardVariants}
            className="relative overflow-hidden rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all duration-300 hover:border-slate-300/80"
          >
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Bên trái: Avatar & Thông tin */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center text-center sm:text-left gap-5 relative z-10">
              {/* Avatar với viền phát sáng gradient lấp lánh */}
              <div className="relative">
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-600 to-blue-400 opacity-75 blur animate-pulse" />
                <div className="w-18 h-18 rounded-full bg-page border-2 border-slate-900 flex items-center justify-center text-text-head relative z-10 shadow-lg">
                  <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600 to-blue-600">
                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "K"}
                  </span>
                </div>
                {/* Đốm sáng neon nhỏ ở chân avatar */}
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-teal-500 border border-slate-900 flex items-center justify-center z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-card animate-ping" />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col items-center sm:items-start">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-black text-text-head tracking-wide">
                    {profile.fullName || "Khánh Tân"}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-primary-light text-primary border border-primary-dark shadow-sm">
                    Lớp {profile.grade ? profile.grade.replace("Lớp ", "") : "11"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                  <School className="w-3.5 h-3.5 text-text-muted" />
                  <span>{profile.school || "THPT Chuyên Nguyễn Huệ"}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-text-muted font-extrabold uppercase tracking-wide">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Danh hiệu: Chiến Binh Tiếng Anh</span>
                </div>
              </div>
            </div>

            {/* Bên phải: Badge VIP vàng Gold */}
            <div className="relative z-10 shrink-0">
              <div className="absolute inset-0 bg-amber-500/10 rounded-[var(--radius-card)] blur-lg pointer-events-none" />
              <div className="px-4 py-3 rounded-[var(--radius-card)] bg-gradient-to-b from-amber-400/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center shadow-lg relative z-10 hover:border-amber-400/50 transition-colors duration-300">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-amber-600 font-black text-xs uppercase tracking-widest">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-600 animate-spin-slow" />
                  <span>Thành viên PRO</span>
                </div>
                <span className="text-[9px] text-amber-500/80 font-bold block tracking-wider font-mono">
                  Hạn dùng: 31/12/2026
                </span>
              </div>
            </div>

          </motion.div>

          {/* PHÂN HỆ 3: BIỂU ĐỒ RADAR PHÂN TÍCH KỸ NĂNG (AI Skill Radar - Bento Card #3) */}
          <motion.div 
            variants={cardVariants}
            className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl relative overflow-hidden group hover:border-slate-300/80 transition-all duration-300"
          >
            {/* Glow hiệu ứng nền */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[var(--radius-btn)] bg-primary-light border border-primary-dark flex items-center justify-center text-primary">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-head">Đánh Giá Kỹ Năng Chuyên Sâu</h3>
                  <p className="text-[10px] text-text-muted font-medium">Báo cáo năng lực học tập tự động tổng hợp bằng AI</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-primary-light text-primary border border-primary-dark tracking-wider uppercase">
                AI Radar Chart
              </span>
            </div>

            {/* Layout chia 2: Biểu đồ SVG bên trái & Mô tả điểm chi tiết bên phải */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              
              {/* SVG Radar Chart (Cột trái trong grid) */}
              <div className="md:col-span-3 flex justify-center items-center relative">
                
                {/* SVG Tự vẽ chuẩn xác mạng nhện */}
                <svg 
                  width="290" 
                  height="290" 
                  viewBox="0 0 320 320" 
                  className="overflow-visible font-sans"
                >
                  <defs>
                    {/* Gradient tím indigo cực đẹp cho vùng phủ đa giác */}
                    <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                      <stop offset="60%" stopColor="#6366F1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.65" />
                    </radialGradient>
                    {/* Bộ lọc phát sáng neon cho các đỉnh chấm tròn */}
                    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* A. Vẽ các lưới đa giác đồng tâm (Levels: 20%, 40%, 60%, 80%, 100%) */}
                  {levels.map((level, idx) => (
                    <polygon
                      key={idx}
                      points={getLevelPath(level)}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray={level < 1.0 ? "2 3" : "none"}
                      className={level === 1.0 ? "stroke-slate-800/80" : "stroke-slate-900/60"}
                    />
                  ))}

                  {/* B. Vẽ các trục nối từ tâm ra 5 góc */}
                  {[0, 1, 2, 3, 4].map((i) => {
                    const outer = getCoordinates(i, 1.0);
                    return (
                      <line
                        key={i}
                        x1="160"
                        y1="160"
                        x2={outer.x}
                        y2={outer.y}
                        stroke="#1e293b"
                        strokeWidth="1"
                        className="stroke-slate-800/40"
                      />
                    );
                  })}

                  {/* C. Vẽ Vùng đa giác điểm số của học sinh */}
                  <polygon
                    points={getStudentPath()}
                    fill="url(#radarGrad)"
                    stroke="#8B5CF6"
                    strokeWidth="2.5"
                    fillOpacity="0.45"
                    className="drop-shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all duration-500"
                  />

                  {/* D. Vẽ nhãn văn bản cho các kỹ năng */}
                  {skillDetails.map((detail, i) => {
                    const labelPos = getLabelCoordinates(i);
                    // Căn chỉnh text-anchor linh hoạt dựa trên vị trí góc x
                    let anchor: "middle" | "start" | "end" = "middle";
                    if (labelPos.x > 170) anchor = "start";
                    else if (labelPos.x < 150) anchor = "end";

                    // Chỉnh chiều cao nhỏ cho chữ
                    let dy = "3";
                    if (labelPos.y < 130) dy = "-2";
                    else if (labelPos.y > 190) dy = "8";

                    return (
                      <g key={i}>
                        <text
                          x={labelPos.x}
                          y={labelPos.y}
                          dy={dy}
                          textAnchor={anchor}
                          className="fill-slate-400 font-extrabold text-[10px] tracking-wide select-none"
                        >
                          {detail.label}
                        </text>
                        <text
                          x={labelPos.x}
                          y={labelPos.y + 11}
                          dy={dy}
                          textAnchor={anchor}
                          className="fill-indigo-400 font-black text-[9px] font-mono select-none"
                        >
                          {detail.val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* E. Vẽ các chấm đỉnh tròn phát sáng neon cực đẹp */}
                  {skillDetails.map((detail, i) => {
                    const values = [
                      skillScores.pronunciation / 100,
                      skillScores.dictation / 100,
                      skillScores.grammar / 100,
                      skillScores.vocabulary / 100,
                      skillScores.fluency / 100
                    ];
                    const pos = getCoordinates(i, values[i]);
                    return (
                      <circle
                        key={i}
                        cx={pos.x}
                        cy={pos.y}
                        r="4"
                        fill="#A78BFA"
                        stroke="#FFF"
                        strokeWidth="1.5"
                        filter="url(#neonGlow)"
                        className="transition-all duration-500 hover:scale-125"
                      />
                    );
                  })}
                </svg>

              </div>

              {/* Danh sách điểm số chi tiết dạng Bar nhỏ bên phải (Cột phải trong grid) */}
              <div className="md:col-span-2 space-y-4 relative z-10">
                <span className="text-[10px] font-black tracking-widest text-text-muted uppercase font-mono block">
                  Chỉ số năng lực
                </span>
                
                <div className="space-y-3.5">
                  {skillDetails.map((skill, idx) => {
                    // Màu sắc tương ứng với các kỹ năng
                    const barColors = [
                      "from-indigo-600 to-indigo-500 shadow-indigo-950/20",
                      "from-blue-600 to-indigo-500 shadow-blue-950/20",
                      "from-indigo-600 to-indigo-500 shadow-indigo-950/20",
                      "from-pink-600 to-rose-500 shadow-pink-950/20",
                      "from-teal-600 to-teal-500 shadow-teal-950/20"
                    ];

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-text-body">{skill.name}</span>
                          <span className="text-primary font-mono">{skill.val}/100</span>
                        </div>
                        {/* Progress Bar kính mờ */}
                        <div className="h-2 rounded-full bg-page border border-slate-900 overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.val}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${barColors[idx % barColors.length]} shadow-lg`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </motion.div>

        </div>

        {/* ================= CỘT PHẢI (NHỎ - 1 Cột) ================= */}
        <div className="space-y-6">
          
          {/* PHÂN HỆ 2: CHỈ SỐ KIM CƯƠNG & NĂNG LƯỢNG (Currency Matrix - Bento Card #2) */}
          <motion.div 
            variants={cardVariants}
            className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.1)] pb-3">
              <Trophy className="w-4.5 h-4.5 text-amber-600" />
              <h3 className="text-xs font-black uppercase text-text-muted tracking-wider">
                Kho báu & Sinh mệnh
              </h3>
            </div>

            {/* Matrix 3 ô dọc cao cấp */}
            <div className="grid grid-cols-1 gap-3">
              
              {/* Ô 1: Cúp Tuần */}
              <div className="p-3.5 rounded-[var(--radius-card)] bg-page border border-[rgba(0,0,0,0.1)] hover:border-slate-300/60 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">Cúp Tuần</span>
                    <span className="text-xs font-bold text-text-body">Bảng Xếp Hạng</span>
                  </div>
                </div>
                <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-mono tracking-tight animate-pulse">
                  3 🏆
                </span>
              </div>

              {/* Ô 2: Kim Cương */}
              <div className="p-3.5 rounded-[var(--radius-card)] bg-page border border-[rgba(0,0,0,0.1)] hover:border-slate-300/60 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-blue-500/10 border border-blue-300 flex items-center justify-center text-blue-600 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                    <Gem className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">Kim Cương</span>
                    <span className="text-xs font-bold text-text-body">Quy đổi vật phẩm</span>
                  </div>
                </div>
                <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 font-mono tracking-tight">
                  {stats.diamonds} 💎
                </span>
              </div>

              {/* Ô 3: Sinh mệnh / Trái tim */}
              <div className="p-3.5 rounded-[var(--radius-card)] bg-page border border-[rgba(0,0,0,0.1)] hover:border-slate-300/60 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-card)] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">Sinh Mệnh</span>
                    <span className="text-xs font-bold text-text-body">Phòng Luyện Lớp</span>
                  </div>
                </div>
                {/* 5 Trái tim neon phát sáng */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className="w-3.5 h-3.5 text-rose-500 fill-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]" 
                    />
                  ))}
                </div>
              </div>

            </div>

          </motion.div>

          {/* PHÂN HỆ 4: FORM THAY ĐỔI THÔNG TIN (Account Settings - Bento Card #4) */}
          <motion.div 
            variants={cardVariants}
            className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-5 shadow-xl relative overflow-hidden group hover:border-slate-300/80 transition-all duration-300"
          >
            {/* Ambient Glow */}
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.1)] pb-3 mb-4">
              <Settings className="w-4.5 h-4.5 text-text-muted" />
              <h3 className="text-xs font-black uppercase text-text-muted tracking-wider">
                Thiết Lập Tài Khoản
              </h3>
            </div>

            {/* Form cập nhật thông tin */}
            <form onSubmit={handleSaveProfile} className="space-y-4 relative z-10">
              
              {/* Field 1: Họ và tên */}
              <div className="space-y-1">
                <label className="text-[10px] text-text-muted font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <User className="w-3 h-3 text-text-muted" />
                  <span>Họ và tên</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Khánh Tân"
                  className="w-full px-3.5 py-2.5 rounded-[var(--radius-card)] bg-page text-xs font-bold text-text-head border border-[rgba(0,0,0,0.1)] focus:border-indigo-500/85 focus:ring-1 focus:ring-indigo-500/40 outline-none transition-all placeholder-slate-700"
                />
              </div>

              {/* Field 2: Trường học */}
              <div className="space-y-1">
                <label className="text-[10px] text-text-muted font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <School className="w-3 h-3 text-text-muted" />
                  <span>Trường học</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.school}
                  onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                  placeholder="Ví dụ: THPT Chuyên Nguyễn Huệ"
                  className="w-full px-3.5 py-2.5 rounded-[var(--radius-card)] bg-page text-xs font-bold text-text-head border border-[rgba(0,0,0,0.1)] focus:border-indigo-500/85 focus:ring-1 focus:ring-indigo-500/40 outline-none transition-all placeholder-slate-700"
                />
              </div>

              {/* Field 3: Khối lớp hiện tại (Dropdown select Lớp 1 - Lớp 12) */}
              <div className="space-y-1">
                <label className="text-[10px] text-text-muted font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-text-muted" />
                  <span>Khối lớp hiện tại</span>
                </label>
                <select
                  value={profile.grade}
                  onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[var(--radius-card)] bg-page text-xs font-bold text-text-head border border-[rgba(0,0,0,0.1)] focus:border-indigo-500/85 focus:ring-1 focus:ring-indigo-500/40 outline-none transition-all"
                >
                  {[...Array(12)].map((_, i) => {
                    const gradeStr = `Lớp ${i + 1}`;
                    return (
                      <option key={i} value={gradeStr} className="bg-card">
                        {gradeStr}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Nút bấm 3D cơ học Nhấn lún sướng tay */}
              <button className="w-full py-2.5 rounded-[var(--radius-btn)] bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] hover:bg-primary text-white font-black text-xs transition-all duration-100 flex items-center justify-center gap-1.5 shadow-[0_4px_0_#312e81] active:translate-y-[4px] active:shadow-none select-none relative overflow-hidden"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Cập Nhật Hồ Sơ</span>
              </button>

            </form>
          </motion.div>

          <BadgeGrid />
        </div>

      </motion.div>
    </div>
  );
}
