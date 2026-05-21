"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Zap,
  Sparkles,
  BookOpen,
  ArrowRight,
  Award,
  Trophy,
  Play,
  CheckCircle,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface StudentStats {
  xp: number;
  diamonds: number;
  streak: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  completed: boolean;
  expectedText?: string;
  quizQuestions?: QuizQuestion[];
}

interface UnitData {
  id: string;
  number: number;
  title: string;
  status: "completed" | "in_progress" | "locked";
  progress: number;
  grade: string;
  lessons: Lesson[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StudentStats>({ xp: 1200, diamonds: 15, streak: 5 });
  const [nextLesson, setNextLesson] = useState<{ unitTitle: string; lessonTitle: string; type: string } | null>(null);

  useEffect(() => {
    // 1. Đọc stats từ localStorage
    const storedStats = localStorage.getItem("gsa-student-stats");
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Tìm bài học chưa hoàn thành gần nhất
    const storedCurriculum = localStorage.getItem("gsa-curriculum");
    if (storedCurriculum) {
      try {
        const units: UnitData[] = JSON.parse(storedCurriculum);
        // Tìm Unit đầu tiên đang "in_progress" hoặc "completed" nhưng chưa hoàn thành toàn bộ bài học
        let foundLesson: { unitTitle: string; lessonTitle: string; type: string } | null = null;
        
        for (const unit of units) {
          if (unit.status !== "locked") {
            const incompleteLesson = unit.lessons.find((l) => !l.completed);
            if (incompleteLesson) {
              foundLesson = {
                unitTitle: `Unit ${unit.number}: ${unit.title}`,
                lessonTitle: incompleteLesson.title,
                type: incompleteLesson.type,
              };
              break;
            }
          }
        }

        // Fallback nếu đã hoàn thành tất cả
        if (!foundLesson && units.length > 0) {
          const lastUnit = units[units.length - 1];
          const lastLesson = lastUnit.lessons[lastUnit.lessons.length - 1];
          foundLesson = {
            unitTitle: `Unit ${lastUnit.number}: ${lastUnit.title}`,
            lessonTitle: lastLesson.title,
            type: lastLesson.type,
          };
        }

        setNextLesson(foundLesson);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Dữ liệu mẫu nếu chưa có curriculum
      setNextLesson({
        unitTitle: "Unit 2: The Generation Gap",
        lessonTitle: "Speaking: Expressing opinion on rules",
        type: "speaking",
      });
    }

    // Lắng nghe stats thay đổi
    const handleStatsUpdated = () => {
      const updated = localStorage.getItem("gsa-student-stats");
      if (updated) {
        try {
          setStats(JSON.parse(updated));
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener("stats-updated", handleStatsUpdated);
    return () => {
      window.removeEventListener("stats-updated", handleStatsUpdated);
    };
  }, []);

  // Tính toán tọa độ cho Radar Chart SVG
  // 4 kỹ năng: Listening, Speaking, Reading, Writing
  // Các thang điểm từ tâm (0,0) đến đỉnh (100)
  // Góc quay tương ứng: Listening (0 độ - Top), Speaking (90 độ - Right), Reading (180 độ - Bottom), Writing (270 độ - Left)
  // Bán kính r = 100. Tâm biểu đồ ở (150, 150)
  const skills = [
    { name: "Listening (Nghe)", value: 82, angle: 0 },
    { name: "Speaking (Nói)", value: 85, angle: 90 },
    { name: "Reading (Đọc)", value: 78, angle: 180 },
    { name: "Writing (Viết)", value: 70, angle: 270 },
  ];

  const getCoordinates = (value: number, angle: number) => {
    const radius = (value / 100) * 90; // Giới hạn bán kính max là 90px
    const angleRad = (angle - 90) * (Math.PI / 180); // Trừ 90 độ để góc 0 tương ứng hướng 12 giờ
    const x = 150 + radius * Math.cos(angleRad);
    const y = 150 + radius * Math.sin(angleRad);
    return { x, y };
  };

  // Tạo chuỗi tọa độ cho đa giác kỹ năng của học sinh
  const studentPoints = skills.map((s) => {
    const { x, y } = getCoordinates(s.value, s.angle);
    return `${x},${y}`;
  }).join(" ");

  // Tạo chuỗi tọa độ cho đa giác chuẩn 100%
  const maxPoints = skills.map((s) => {
    const { x, y } = getCoordinates(100, s.angle);
    return `${x},${y}`;
  }).join(" ");

  const midPoints50 = skills.map((s) => {
    const { x, y } = getCoordinates(50, s.angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ thống báo cáo AI</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Tổng quan học tập
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tiến độ, phân tích kỹ năng toàn diện và tiếp tục hành trình học tiếng Anh.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-800/60 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-300">Học sinh trực tuyến</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: Biểu đồ kỹ năng 4D (SVG Radar Chart) */}
        <div className="md:col-span-7 rounded-3xl border border-slate-800/80 bg-[#151B2B] p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    Biểu đồ kỹ năng 4D
                  </h2>
                  <p className="text-[10px] text-slate-400">Phân tích chuyên sâu từ AI Coach</p>
                </div>
              </div>
              
              <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Active
              </span>
            </div>
            
            {/* Radar Chart SVG */}
            <div className="flex items-center justify-center py-2 relative">
              <svg className="w-[300px] h-[300px]" viewBox="0 0 300 300">
                {/* Lưới mạng nhện mốc 100% */}
                <polygon
                  points={maxPoints}
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                
                {/* Lưới mạng nhện mốc 50% */}
                <polygon
                  points={midPoints50}
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />

                {/* Các trục tọa độ */}
                {skills.map((s, idx) => {
                  const end = getCoordinates(100, s.angle);
                  return (
                    <line
                      key={idx}
                      x1="150"
                      y1="150"
                      x2={end.x}
                      y2={end.y}
                      stroke="#1E293B"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Đa giác chỉ số học sinh */}
                <polygon
                  points={studentPoints}
                  fill="url(#radarGradient)"
                  stroke="#6366F1"
                  strokeWidth="2"
                  className="animate-pulse"
                />

                {/* Các điểm neo (Data Points) */}
                {skills.map((s, idx) => {
                  const pt = getCoordinates(s.value, s.angle);
                  return (
                    <g key={idx} className="group/node cursor-pointer">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#818CF8"
                        stroke="#0B0F19"
                        strokeWidth="1.5"
                        className="transition-all duration-300 hover:r-7 hover:fill-white"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        fill="#818CF8"
                        fillOpacity="0.15"
                        className="animate-ping"
                      />
                    </g>
                  );
                })}

                {/* Định nghĩa Gradient đổ bóng */}
                <defs>
                  <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.35" />
                  </radialGradient>
                </defs>

                {/* Tên và Điểm số các nhãn */}
                {skills.map((s, idx) => {
                  // Đẩy nhãn ra ngoài một chút
                  const labelPt = getCoordinates(115, s.angle);
                  let textAnchor: "end" | "inherit" | "middle" | "start" = "middle";
                  let dy = "0.33em";
                  
                  if (s.angle === 90) textAnchor = "start";
                  else if (s.angle === 270) textAnchor = "end";
                  if (s.angle === 180) dy = "1em";
                  if (s.angle === 0) dy = "-0.5em";

                  return (
                    <text
                      key={idx}
                      x={labelPt.x}
                      y={labelPt.y}
                      textAnchor={textAnchor}
                      dy={dy}
                      className="fill-slate-400 font-bold text-[10px] transition-colors hover:fill-slate-200"
                    >
                      {s.name.split(" ")[0]} ({s.value}%)
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/40">
            <div className="p-3 rounded-2xl bg-slate-800/10 border border-slate-800/30 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400">Kỹ năng mạnh nhất:</span>
              <span className="text-xs font-black text-indigo-400">SPEAKING (85%)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/10 border border-slate-800/30 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400">Cần cải thiện:</span>
              <span className="text-xs font-black text-pink-400">WRITING (70%)</span>
            </div>
          </div>
        </div>

        {/* Cột phải chứa Card 2 và Card 3 */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Card 2: Chuỗi Streak & XP */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#151B2B] p-6 shadow-xl hover:border-amber-500/30 transition-all duration-300 group flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                  Ngọn lửa học tập
                </h2>
                <p className="text-[10px] text-slate-400">Thống kê tích lũy của bạn</p>
              </div>
            </div>

            {/* Flame Display */}
            <div className="py-6 flex items-center justify-center gap-6">
              <div className="relative">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-full blur-2xl opacity-20 group-hover:opacity-45 transition-all duration-500" />
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/15 to-orange-600/5 border border-amber-500/25 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Flame className="w-10 h-10 text-amber-500 animate-bounce" />
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 tracking-tight">
                  {stats.streak.toString().padStart(2, "0")} NGÀY
                </div>
                <div className="text-[11px] font-semibold text-slate-300 mt-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-violet-400" />
                  <span>Tổng tích lũy: <b className="text-violet-400">{stats.xp} XP</b></span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Bạn đang thuộc Top 10% học sinh xuất sắc nhất!
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center">
              <p className="text-[10px] font-medium text-amber-400 leading-relaxed">
                Học liên tiếp 2 ngày nữa để nhận Huy hiệu <span className="font-bold underline">"Chiến Binh Chuyên Cần"</span> phát sáng!
              </p>
            </div>
          </div>

          {/* Card 3: Học tiếp bài gần nhất */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#151B2B] p-6 shadow-xl hover:border-emerald-500/30 transition-all duration-300 group flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Tiến trình hiện tại
                </h2>
                <p className="text-[10px] text-slate-400">Học tiếp bài gần nhất</p>
              </div>
            </div>

            {/* Lesson Details */}
            {nextLesson ? (
              <div className="py-4 space-y-2">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {nextLesson.unitTitle}
                </div>
                <div className="text-sm font-bold text-slate-100 truncate">
                  {nextLesson.lessonTitle}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md uppercase">
                    {nextLesson.type}
                  </span>
                  <span className="text-[10px] text-slate-400">Còn dang dở</span>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div className="text-xs text-slate-400">Đang đồng bộ lộ trình học...</div>
              </div>
            )}

            {/* Action Button */}
            <Link
              href="/"
              className="relative w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold text-center shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:translate-y-[-2px]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>HỌC TIẾP NGAY</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

      </div>

      {/* Quick Stats Summary List (Bento Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#151B2B] p-4 flex items-center gap-4 hover:bg-slate-800/20 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Danh hiệu đạt được</div>
            <div className="text-base font-black text-slate-100">4 / 12 Huy hiệu</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#151B2B] p-4 flex items-center gap-4 hover:bg-slate-800/20 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Xếp hạng tuần</div>
            <div className="text-base font-black text-slate-100">Hạng #4 lớp 11A1</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#151B2B] p-4 flex items-center gap-4 hover:bg-slate-800/20 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Tỷ lệ chính xác</div>
            <div className="text-base font-black text-slate-100">86.4% Bài Luyện</div>
          </div>
        </div>
      </div>
    </div>
  );
}
