"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Mic, 
  Headphones, 
  BookOpen, 
  Edit3, 
  Target,
  ArrowUpRight,
  TrendingUp,
  Brain,
  Zap,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

const skillsData = [
  { id: "speaking", name: "Nói (Speaking)", icon: Mic, score: 83, color: "text-blue-600", bg: "bg-blue-500", lightBg: "bg-blue-50", border: "border-blue-200" },
  { id: "listening", name: "Nghe (Listening)", icon: Headphones, score: 71, color: "text-indigo-600", bg: "bg-indigo-500", lightBg: "bg-indigo-50", border: "border-indigo-200" },
  { id: "reading", name: "Đọc (Reading)", icon: BookOpen, score: 58, color: "text-teal-600", bg: "bg-teal-500", lightBg: "bg-teal-50", border: "border-teal-200" },
  { id: "writing", name: "Viết (Writing)", icon: Edit3, score: 42, color: "text-pink-600", bg: "bg-pink-500", lightBg: "bg-pink-50", border: "border-pink-200" },
];

export default function SkillsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Các hàm tính toán cho Radar Chart SVG
  const getCoordinates = (angleIdx: number, radiusRatio: number) => {
    const radius = 100 * radiusRatio;
    const angle = (angleIdx * 72 - 90) * (Math.PI / 180);
    return {
      x: 160 + radius * Math.cos(angle),
      y: 160 + radius * Math.sin(angle)
    };
  };

  const getLabelCoordinates = (angleIdx: number) => {
    const radius = 135; 
    const angle = (angleIdx * 72 - 90) * (Math.PI / 180);
    return {
      x: 160 + radius * Math.cos(angle),
      y: 160 + radius * Math.sin(angle)
    };
  };

  // Mock scores for 5 skills in Radar
  const radarScores = [83, 71, 65, 42, 58]; // Nói, Nghe, Ngữ pháp, Viết, Đọc
  const radarLabels = ["Nói", "Nghe", "Ngữ pháp", "Viết", "Đọc"];
  
  const getStudentPath = () => {
    return radarScores.map((score, i) => {
      const pos = getCoordinates(i, score / 100);
      return `${pos.x},${pos.y}`;
    }).join(" ");
  };

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const getLevelPath = (level: number) => {
    return [0, 1, 2, 3, 4].map((i) => {
      const pos = getCoordinates(i, level);
      return `${pos.x},${pos.y}`;
    }).join(" ");
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 bg-page h-full p-6 md:p-8 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[rgba(0,0,0,0.1)] pb-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>AI Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-500">
            Phân tích Kỹ năng Chuyên sâu
          </h1>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Báo cáo năng lực học tập dựa trên 5 kỹ năng cốt lõi. Hệ thống phân tích thời gian thực để đưa ra lộ trình cá nhân hóa tốt nhất cho bạn.
          </p>
        </div>

        {/* PHẦN 1: Radar Chart & Tổng quan (Top Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Radar Chart Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-card rounded-[16px] border border-[rgba(0,0,0,0.1)] p-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-head">Sơ đồ năng lực (Radar)</h2>
                  <p className="text-[10px] text-text-muted">Mức độ hoàn thiện 5 kỹ năng</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-200">
                LEVEL: B1 INTERMEDIATE
              </span>
            </div>

            <div className="flex justify-center items-center relative">
              <svg 
                width="320" 
                height="320" 
                viewBox="0 0 320 320" 
                className="overflow-visible font-sans"
              >
                <defs>
                  <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
                    <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4338CA" stopOpacity="0.65" />
                  </radialGradient>
                  <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Các vòng lưới */}
                {levels.map((level, idx) => (
                  <polygon
                    key={idx}
                    points={getLevelPath(level)}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray={level < 1.0 ? "2 3" : "none"}
                  />
                ))}

                {/* Các trục */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const outer = getCoordinates(i, 1.0);
                  return (
                    <line
                      key={i}
                      x1="160"
                      y1="160"
                      x2={outer.x}
                      y2={outer.y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Đa giác điểm số */}
                <polygon
                  points={getStudentPath()}
                  fill="url(#radarGrad)"
                  stroke="#4F46E5"
                  strokeWidth="2.5"
                  fillOpacity="0.45"
                  className="drop-shadow-[0_0_12px_rgba(79,70,229,0.3)] transition-all duration-1000"
                />

                {/* Label Kỹ năng */}
                {radarLabels.map((label, i) => {
                  const pos = getLabelCoordinates(i);
                  return (
                    <text
                      key={i}
                      x={pos.x}
                      y={pos.y}
                      textAnchor={pos.x < 150 ? "end" : pos.x > 170 ? "start" : "middle"}
                      alignmentBaseline="middle"
                      className="text-[12px] font-bold fill-slate-700"
                    >
                      {label}
                      <tspan x={pos.x} dy="16" className="text-[10px] fill-indigo-600 font-black">
                        {radarScores[i]}%
                      </tspan>
                    </text>
                  );
                })}
              </svg>
            </div>
          </motion.div>

          {/* Cột phải: Nhận xét AI & Tổng quan */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-[16px] border border-[rgba(0,0,0,0.1)] p-6 shadow-xl flex-1 flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-xl transition-all group-hover:scale-150" />
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-text-head">AI Coach Nhận Xét</h3>
              </div>
              <p className="text-xs text-text-body leading-relaxed flex-1">
                "Bạn có kỹ năng <strong className="text-blue-600">Nói (83%)</strong> cực kỳ ấn tượng, phát âm chuẩn xác. Tuy nhiên, kỹ năng <strong className="text-pink-600">Viết (42%)</strong> đang là điểm yếu lớn nhất cản trở bạn đạt cấp độ cao hơn. Cần tập trung cải thiện kỹ năng này ngay trong tuần!"
              </p>
              <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-medium">Xu hướng tuần:</span>
                  <span className="flex items-center gap-1 text-teal-600 font-black">
                    <TrendingUp className="w-3 h-3" /> +5%
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[16px] border border-indigo-500 p-6 shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Award className="w-32 h-32" />
              </div>
              <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Mục tiêu tiếp theo</h3>
              <div className="text-2xl font-black mb-1">B2 Upper</div>
              <p className="text-[10px] text-indigo-200 opacity-90 max-w-[80%]">
                Đạt trung bình 75% các kỹ năng để thăng cấp. Bạn cần 12% nữa!
              </p>
            </motion.div>
          </div>
        </div>

        {/* PHẦN 2: Lưới Chi tiết 4 Kỹ năng (Middle Grid) */}
        <div>
          <h2 className="text-sm font-bold text-text-head flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-slate-400" /> Chi Tiết Các Kỹ Năng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsData.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <motion.div 
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-card rounded-[16px] border border-[rgba(0,0,0,0.1)] p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${skill.lightBg} opacity-50 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${skill.lightBg} ${skill.border} border flex items-center justify-center ${skill.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-head">{skill.name}</h3>
                        <p className="text-[10px] text-text-muted mt-0.5">Cập nhật 2 giờ trước</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black ${skill.color}`}>{skill.score}%</div>
                      <div className="text-[9px] font-bold text-teal-600 flex items-center justify-end gap-0.5 mt-1">
                        <TrendingUp className="w-2.5 h-2.5" /> +2%
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between text-[10px] font-bold text-text-muted mb-1.5">
                      <span>Tiến trình</span>
                      <span>Mục tiêu: 80%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className={`h-full ${skill.bg} rounded-full`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* PHẦN 3: Lộ trình Đề xuất (Bottom Section) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-[16px] border border-[rgba(0,0,0,0.1)] p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-pink-500" />
              <div>
                <h2 className="text-sm font-bold text-text-head">Khắc phục điểm yếu: Kỹ năng Viết (42%)</h2>
                <p className="text-[10px] text-text-muted">Lộ trình 3 bước do AI đề xuất để cải thiện nhanh chóng</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Ôn tập Cấu trúc Câu", desc: "Học cách viết câu đơn, câu ghép chính xác.", time: "15 phút", xp: "+50" },
              { title: "Luyện Viết Đoạn Văn", desc: "Thực hành viết đoạn văn 50-70 từ có AI chấm.", time: "25 phút", xp: "+120" },
              { title: "Chữa Lỗi Ngữ Pháp", desc: "Trò chơi tìm và sửa lỗi sai trong câu.", time: "10 phút", xp: "+40" }
            ].map((task, i) => (
              <div key={i} className="border border-slate-200 hover:border-pink-300 rounded-xl p-4 bg-white transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-6 h-6 rounded-md bg-pink-50 text-pink-600 flex items-center justify-center text-[10px] font-black border border-pink-100">
                    {i + 1}
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    {task.xp} XP
                  </span>
                </div>
                <h4 className="text-[12px] font-bold text-slate-800 mb-1 group-hover:text-pink-600 transition-colors">{task.title}</h4>
                <p className="text-[10px] text-slate-500 mb-3 line-clamp-2">{task.desc}</p>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-medium text-slate-400">{task.time}</span>
                  <button className="text-pink-600 font-bold flex items-center gap-1 hover:gap-1.5 transition-all">
                    Học ngay <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// Bổ sung icon Layers cho phần tiêu đề
const Layers = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 12 12 17 22 12"></polyline>
    <polyline points="2 17 12 22 22 17"></polyline>
  </svg>
);
