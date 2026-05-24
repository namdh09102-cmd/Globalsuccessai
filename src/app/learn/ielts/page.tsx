"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Target, Trophy, Mic, Award, Zap, ChevronRight, Lock, Unlock, PlayCircle, BarChart2, CheckCircle, BookOpen
} from "lucide-react";

export default function IeltsRoadmapPage() {
  const [showMockTest, setShowMockTest] = useState(false);
  const [testPhase, setTestPhase] = useState<"intro" | "recording" | "feedback">("intro");
  const [timer, setTimer] = useState(120); // 2 minutes for Part 2

  // Simple radar chart values
  const skills = [
    { name: "Speaking", value: 6.5, max: 9.0, angle: 0 },
    { name: "Reading", value: 5.5, max: 9.0, angle: 72 },
    { name: "Writing", value: 5.0, max: 9.0, angle: 144 },
    { name: "Listening", value: 7.0, max: 9.0, angle: 216 },
    { name: "Vocab", value: 6.0, max: 9.0, angle: 288 },
  ];

  const getPoints = (scale = 1) => {
    return skills.map(skill => {
      const radius = (skill.value / skill.max) * 100 * scale;
      const x = 150 + radius * Math.sin((skill.angle * Math.PI) / 180);
      const y = 150 - radius * Math.cos((skill.angle * Math.PI) / 180);
      return `${x},${y}`;
    }).join(" ");
  };

  const getBackgroundPoints = () => {
    return [0, 72, 144, 216, 288].map(angle => {
      const radius = 100;
      const x = 150 + radius * Math.sin((angle * Math.PI) / 180);
      const y = 150 - radius * Math.cos((angle * Math.PI) / 180);
      return `${x},${y}`;
    }).join(" ");
  };

  const startMockTest = () => {
    setShowMockTest(true);
    setTestPhase("intro");
  };

  const startRecording = () => {
    setTestPhase("recording");
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTestPhase("feedback");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-nunito pb-12">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F172A]/90 backdrop-blur-md z-30 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Trang chủ</span>
          </Link>
          <div className="font-fredoka text-xl text-white flex items-center gap-2 tracking-wider">
            <Target className="w-6 h-6 text-indigo-400" /> IELTS MASTER
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 bg-indigo-900/50 px-3 py-1.5 rounded-full border border-indigo-800">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold text-indigo-200">Mục tiêu: 7.0+</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              NA
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-white font-fredoka tracking-wide mb-2">Lộ trình của bạn</h1>
            <p className="text-slate-400">Tiếp tục chặng đường chinh phục IELTS 6.5. Cố lên nhé!</p>
          </div>

          <div className="relative">
            {/* Roadmap Line */}
            <div className="absolute left-[27px] top-8 bottom-8 w-1 bg-slate-800 rounded-full" />
            <div className="absolute left-[27px] top-8 h-[40%] w-1 bg-gradient-to-b from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />

            <div className="space-y-6 relative z-10">
              {/* Stage 1: Done */}
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-indigo-600 border-4 border-[#0F172A] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex-1 opacity-70">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">Foundation (4.0+)</h3>
                      <p className="text-sm text-slate-400">Xây dựng nền tảng từ vựng và ngữ pháp cơ bản.</p>
                    </div>
                    <span className="text-xs font-bold bg-green-900/50 text-green-400 px-2 py-1 rounded">Hoàn thành</span>
                  </div>
                </div>
              </div>

              {/* Stage 2: Active */}
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-cyan-500 border-4 border-[#0F172A] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="bg-slate-800 border-2 border-cyan-500 p-6 rounded-2xl flex-1 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">Đang học</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Intermediate (5.0 - 6.5)</h3>
                  <p className="text-sm text-slate-400 mb-4">Làm quen format đề, kỹ năng Listening & Reading.</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl hover:bg-slate-700 cursor-pointer border border-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><BookOpen className="w-4 h-4" /></div>
                        <div>
                          <div className="font-bold text-slate-200">Reading Strategy: Skimming</div>
                          <div className="text-xs text-slate-500">Bài học • 15 phút</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl hover:bg-slate-700 cursor-pointer border border-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center"><Mic className="w-4 h-4" /></div>
                        <div>
                          <div className="font-bold text-slate-200">Speaking Part 1: Hometown</div>
                          <div className="text-xs text-slate-500">Thực hành AI • 10 phút</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 3: Locked */}
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-slate-800 border-4 border-[#0F172A] flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-slate-600" />
                </div>
                <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl flex-1 opacity-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-400">Advanced (7.0+)</h3>
                      <p className="text-sm text-slate-500">Luyện đề chuyên sâu và Writing Task 2.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Col: Stats & Quick Actions */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-400" /> Kỹ năng 5 chiều</h3>
            <div className="relative w-[300px] h-[300px] mx-auto">
              <svg width="300" height="300" className="absolute top-0 left-0">
                {/* Background Grid */}
                <polygon points={getBackgroundPoints()} fill="none" stroke="#334155" strokeWidth="1" />
                <polygon points={getBackgroundPoints().split(" ").map(p => {
                  const [x, y] = p.split(",");
                  return `${150 + (Number(x)-150)*0.6},${150 + (Number(y)-150)*0.6}`;
                }).join(" ")} fill="none" stroke="#334155" strokeWidth="1" />
                
                {/* Axes */}
                {skills.map((skill, i) => {
                  const x = 150 + 100 * Math.sin((skill.angle * Math.PI) / 180);
                  const y = 150 - 100 * Math.cos((skill.angle * Math.PI) / 180);
                  return <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="#334155" strokeWidth="1" />;
                })}

                {/* Data Polygon */}
                <polygon points={getPoints()} fill="rgba(99, 102, 241, 0.4)" stroke="#818CF8" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                
                {/* Data Points */}
                {skills.map((skill, i) => {
                  const radius = (skill.value / skill.max) * 100;
                  const x = 150 + radius * Math.sin((skill.angle * Math.PI) / 180);
                  const y = 150 - radius * Math.cos((skill.angle * Math.PI) / 180);
                  return <circle key={i} cx={x} cy={y} r="4" fill="#E0E7FF" className="drop-shadow-md" />;
                })}
              </svg>

              {/* Labels */}
              {skills.map((skill, i) => {
                const radius = 120;
                const x = 150 + radius * Math.sin((skill.angle * Math.PI) / 180);
                const y = 150 - radius * Math.cos((skill.angle * Math.PI) / 180);
                return (
                  <div key={i} className="absolute text-[11px] font-bold text-slate-400 -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
                    {skill.name} ({skill.value})
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <div className="text-3xl font-black text-white">6.0</div>
              <div className="text-sm text-slate-400">Band điểm dự kiến</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700/50 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full" />
            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Mock Speaking Test AI</h3>
            <p className="text-sm text-indigo-200 mb-6 relative z-10">Trải nghiệm thi thử IELTS Speaking y như thật với giám khảo AI (Giọng chuẩn Anh).</p>
            <button 
              onClick={startMockTest}
              className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-black py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] flex items-center justify-center gap-2 relative z-10"
            >
              <Mic className="w-5 h-5" /> Thi Thử Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Mock Test Modal */}
      {showMockTest && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[24px] w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl animate-fade-in-up">
            
            {/* Left: Video feed / AI Avatar */}
            <div className="w-[60%] bg-slate-950 border-r border-slate-800 relative flex flex-col justify-center items-center">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-bold flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
                </div>
                <div className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-bold">
                  Part 2: Cue Card
                </div>
              </div>

              {testPhase === "intro" && (
                <div className="text-center p-8">
                  <div className="w-32 h-32 rounded-full bg-indigo-900 border-4 border-indigo-500 mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                    🧑🏼‍🏫
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Examiner Sarah</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">"I'm going to give you a topic, and I'd like you to talk about it for 1 to 2 minutes. You have 1 minute to prepare."</p>
                </div>
              )}

              {testPhase === "recording" && (
                <div className="text-center w-full px-12">
                  <div className="text-[80px] font-black text-white font-fredoka tracking-widest drop-shadow-lg mb-8">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="flex justify-center gap-2 mb-8">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-3 h-16 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-slate-400 italic">Đang ghi âm câu trả lời của bạn...</p>
                </div>
              )}

              {testPhase === "feedback" && (
                <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-green-900 border-4 border-green-500 mx-auto mb-6 flex items-center justify-center text-4xl">
                    ✨
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Phân tích hoàn tất!</h3>
                  <p className="text-slate-400">AI đang chấm điểm ngữ pháp, từ vựng và độ lưu loát của bạn.</p>
                </div>
              )}
            </div>

            {/* Right: Cue Card & Controls */}
            <div className="w-[40%] flex flex-col p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Your Topic</h3>
                <button onClick={() => setShowMockTest(false)} className="text-slate-500 hover:text-white transition-colors">Đóng</button>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 mb-auto border-l-4 border-indigo-500 shadow-inner">
                <p className="text-slate-200 font-bold mb-4 text-lg">Describe a piece of technology you own that you feel is very important.</p>
                <p className="text-sm text-slate-400 mb-2">You should say:</p>
                <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
                  <li>What the technology is</li>
                  <li>How you got it</li>
                  <li>How often you use it</li>
                  <li>And explain why it is so important to you.</li>
                </ul>
              </div>

              {testPhase === "intro" && (
                <button onClick={startRecording} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-colors shadow-lg shadow-indigo-600/30 flex justify-center items-center gap-2">
                  <Mic className="w-5 h-5" /> Bắt đầu trả lời
                </button>
              )}

              {testPhase === "recording" && (
                <button onClick={() => { setTestPhase("feedback"); setTimer(0); }} className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-colors shadow-lg shadow-red-600/30 flex justify-center items-center gap-2">
                  Nộp bài sớm
                </button>
              )}

              {testPhase === "feedback" && (
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-400">Band Score (Dự kiến)</span>
                    <span className="text-lg font-black text-green-400">6.5</span>
                  </div>
                  <div className="space-y-2 mb-4 text-xs text-slate-300">
                    <div className="flex justify-between"><span>Fluency:</span> <span>6.5</span></div>
                    <div className="flex justify-between"><span>Lexical:</span> <span>7.0</span></div>
                    <div className="flex justify-between"><span>Grammar:</span> <span>6.0</span></div>
                    <div className="flex justify-between"><span>Pronunciation:</span> <span>6.5</span></div>
                  </div>
                  <button onClick={() => setShowMockTest(false)} className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors">
                    Xem chi tiết sửa lỗi
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
