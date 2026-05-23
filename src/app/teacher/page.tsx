"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, User, ChevronDown, CheckCircle, AlertTriangle, 
  Users, BookOpen, Star, Sparkles, Send, Gift, 
  Tv, X, Search, FileText, ChevronRight
} from "lucide-react";

// Types
interface Student {
  id: string;
  name: string;
  avatar: string;
  score: number;
  reading: number;
  listening: number;
  speaking: number;
  lastActive: string;
  attendance: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Nguyễn Minh Anh", avatar: "👩‍🎓", score: 92, reading: 95, listening: 88, speaking: 93, lastActive: "15 phút trước", attendance: "100%" },
  { id: "2", name: "Trần Tuấn Kiệt", avatar: "👦", score: 85, reading: 80, listening: 90, speaking: 85, lastActive: "2 giờ trước", attendance: "95%" },
  { id: "3", name: "Lê Bảo Trâm", avatar: "👧", score: 78, reading: 75, listening: 82, speaking: 77, lastActive: "Hôm qua", attendance: "88%" },
  { id: "4", name: "Phạm Hải Đăng", avatar: "🧑", score: 55, reading: 60, listening: 50, speaking: 55, lastActive: "3 ngày trước", attendance: "70%" },
  { id: "5", name: "Hoàng Phương Linh", avatar: "👱‍♀️", score: 98, reading: 100, listening: 95, speaking: 99, lastActive: "Vừa xong", attendance: "100%" },
];

export default function TeacherPortal() {
  const [selectedClass, setSelectedClass] = useState("Lớp 11A1");
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // AI Lesson Planner State
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonGrade, setLessonGrade] = useState("11");
  const [lessonDuration, setLessonDuration] = useState("45");
  const [lessonActivities, setLessonActivities] = useState<string[]>(["Từ vựng", "Nghe"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<any>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-100 border-emerald-300";
    if (score >= 60) return "text-amber-600 bg-amber-100 border-amber-300";
    return "text-red-600 bg-red-100 border-red-300";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleGenerateAI = () => {
    if (!lessonTopic) {
      triggerToast("Vui lòng nhập chủ đề bài học!");
      return;
    }
    setIsGenerating(true);
    setAiOutput(null);
    setTimeout(() => {
      setIsGenerating(false);
      setAiOutput({
        objective: "Học sinh nắm vững 10 từ vựng chủ đề " + lessonTopic + " và có thể giao tiếp cơ bản.",
        vocab: ["Environment", "Pollution", "Protect", "Save", "Energy"],
        warmup: "Chơi mini-game Vòng quay từ vựng (5 phút).",
        practice: "Luyện nghe chép chính tả đoạn hội thoại ngắn, sau đó thực hành nói theo cặp.",
        game: "Game Xây Lâu Đài (Tổng hợp từ vựng và ngữ pháp)."
      });
      triggerToast("Đã tạo giáo án thành công!");
    }, 2000);
  };

  // --- Broadcast Mode (TV Overlay) ---
  if (isBroadcastMode) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col text-white font-nunito overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-fredoka uppercase text-primary tracking-wide">{selectedClass}</h1>
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/50 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              28/30 học sinh đang tham gia
            </span>
          </div>
          <button 
            onClick={() => setIsBroadcastMode(false)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center Content: Mock Game / Leaderboard */}
        <div className="flex-1 flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
          
          <div className="z-10 text-center">
            <div className="text-8xl mb-6 animate-bounce-custom">🏆</div>
            <h2 className="text-5xl font-fredoka uppercase mb-4 text-amber-400 drop-shadow-lg">Bảng Phong Thần</h2>
            <div className="w-[600px] bg-slate-800/80 border-4 border-slate-700 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
              {[MOCK_STUDENTS[4], MOCK_STUDENTS[0], MOCK_STUDENTS[1]].map((s, i) => (
                <div key={s.id} className="flex items-center justify-between p-4 mb-3 last:mb-0 bg-slate-700/50 rounded-2xl border-2 border-slate-600">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-slate-400">#{i+1}</span>
                    <span className="text-4xl">{s.avatar}</span>
                    <span className="text-2xl font-bold">{s.name}</span>
                  </div>
                  <span className="text-2xl font-black text-amber-400">{s.score * 100} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="absolute bottom-8 right-8 bg-white p-3 rounded-2xl flex flex-col items-center shadow-2xl animate-fade-in-up">
            <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center border-4 border-dashed border-slate-300">
              <span className="text-slate-400 font-bold text-center leading-tight">MOCK<br/>QR CODE</span>
            </div>
            <span className="mt-2 text-slate-800 font-bold text-sm">Quét để tham gia</span>
          </div>
        </div>

        {/* Bottom Ticker */}
        <div className="h-14 bg-primary flex items-center px-6 overflow-hidden border-t-4 border-primary-dark shrink-0">
          <div className="whitespace-nowrap animate-[marquee_15s_linear_infinite] font-bold text-xl flex gap-12">
            <span>🎉 Minh Tuấn vừa đạt 100 điểm!</span>
            <span>🔥 Hải Đăng đang có chuỗi thắng 5 câu liên tiếp!</span>
            <span>⭐ Lớp 11A1 đã hoàn thành 80% mục tiêu bài học!</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Normal Dashboard Mode ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-nunito text-slate-800 pb-20">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in-up">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl tracking-wide flex items-center">
            <span className="font-black text-slate-800">Global</span>
            <span className="font-fredoka text-primary mx-1">KIDS</span>
            <span className="font-black text-slate-800">AI</span>
          </h1>
          <span className="bg-[#4ECDC4] text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
            Giáo viên
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Class Dropdown */}
          <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full cursor-pointer transition-colors border border-slate-200">
            <span className="font-bold text-sm text-slate-700">{selectedClass}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
          
          <button 
            onClick={() => setIsBroadcastMode(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-colors shadow-md"
          >
            <Tv className="w-4 h-4" />
            Chiếu lên bảng
          </button>

          <div className="w-px h-6 bg-slate-200" />
          
          <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 shadow-sm">
            <User className="w-5 h-5" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* 1. Class Overview Dashboard */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[14px] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 text-slate-500">
                <span className="font-bold text-sm">Học sinh online</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-fredoka text-slate-800">28<span className="text-lg text-slate-400">/30</span></span>
                <svg width="60" height="20" viewBox="0 0 60 20" className="stroke-emerald-500 fill-none stroke-2">
                  <path d="M0 15 Q 10 5, 20 10 T 40 5 T 60 0" />
                </svg>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[14px] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 text-slate-500">
                <span className="font-bold text-sm">Hoàn thành bài tập</span>
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="22" stroke="#4ECDC4" strokeWidth="4" fill="none" strokeDasharray="138" strokeDashoffset="27.6" strokeLinecap="round"/>
                  </svg>
                  <span className="font-bold text-sm text-slate-800">80%</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">+5% so với tuần trước</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[14px] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 text-slate-500">
                <span className="font-bold text-sm">Điểm TB Lớp</span>
                <Star className="w-4 h-4" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-fredoka text-slate-800">8.2</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center">
                  <ChevronDown className="w-4 h-4 rotate-180" /> 0.4
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[14px] shadow-sm flex flex-col justify-between border-2 border-transparent hover:border-red-200 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4 text-red-500">
                <span className="font-bold text-sm group-hover:text-red-600">Cần hỗ trợ</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex items-end gap-2 text-red-600">
                <span className="text-3xl font-fredoka">1</span>
                <span className="text-sm font-bold pb-1">học sinh &lt; 60%</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Student List & Reports */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 2. Student List with Quick Insights */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Danh Sách Học Sinh
                </h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm học sinh..." 
                    className="pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm font-bold outline-none focus:border-primary w-64 bg-white"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-black border-b border-slate-200">
                      <th className="py-4 px-6">Học Sinh</th>
                      <th className="py-4 px-6">Trạng Thái</th>
                      <th className="py-4 px-6">Kỹ Năng (Đ / N / N)</th>
                      <th className="py-4 px-6 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_STUDENTS.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg bg-white ${getScoreColor(student.score)}`}>
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{student.name}</div>
                              <div className="text-xs text-slate-500 font-semibold">{student.lastActive}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="w-24">
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span className="text-slate-600">Học lực</span>
                              <span className={getScoreColor(student.score).split(' ')[0]}>{student.score}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${getProgressColor(student.score)}`} style={{ width: `${student.score}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getScoreColor(student.reading)}`} title="Đọc">Đ {student.reading}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getScoreColor(student.listening)}`} title="Nghe">N {student.listening}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getScoreColor(student.speaking)}`} title="Nói">N {student.speaking}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          {student.score < 60 ? (
                            <button 
                              onClick={() => triggerToast(`Đã giao bài tập bổ trợ cho ${student.name}`)}
                              className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-600 border border-orange-200 font-bold text-xs hover:bg-orange-200 transition-colors"
                            >
                              Giao bài thêm
                            </button>
                          ) : (
                            <button 
                              onClick={() => triggerToast(`Đã gửi lời khen đến ${student.name}`)}
                              className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-600 border border-amber-200 font-bold text-xs hover:bg-amber-200 transition-colors"
                            >
                              Khen ngợi ⭐
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Weekly Report */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-indigo-500" /> Báo Cáo Hàng Tuần (Gửi Phụ Huynh)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_STUDENTS.slice(0,2).map(student => (
                  <div key={student.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl bg-white w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center">{student.avatar}</div>
                      <div>
                        <div className="font-bold text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-500 font-semibold">Chuyên cần: {student.attendance}</div>
                      </div>
                    </div>
                    <div className="text-sm space-y-2 mb-4 flex-1">
                      <div className="flex justify-between font-semibold"><span className="text-slate-500">XP đạt được:</span> <span className="text-amber-500 font-black">+1,250 XP</span></div>
                      <div className="flex justify-between font-semibold"><span className="text-slate-500">Kỹ năng tốt nhất:</span> <span className="text-emerald-600">Đọc ({student.reading}%)</span></div>
                      {student.score < 80 && (
                        <div className="flex justify-between font-semibold"><span className="text-slate-500">Cần cải thiện:</span> <span className="text-red-500">Nói ({student.speaking}%)</span></div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => triggerToast(`Đã gửi báo cáo của ${student.name} qua Zalo!`)}
                        className="flex-1 py-2 bg-blue-500 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        Gửi Zalo
                      </button>
                      <button 
                        onClick={() => triggerToast(`Đã gửi báo cáo của ${student.name} qua Email!`)}
                        className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-300 transition-colors"
                      >
                        Email
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: AI Planner & Rewards */}
          <div className="space-y-8">
            
            {/* 3. Lesson Planner — AI-powered */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-red-50 to-orange-50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF6B6B]" /> Tạo Giáo Án AI
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Chủ đề bài học:</label>
                  <input 
                    type="text" 
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    placeholder="VD: Animals, School life..." 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-[#FF6B6B] bg-slate-50"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-bold text-slate-500">Lớp:</label>
                    <select 
                      value={lessonGrade} onChange={(e) => setLessonGrade(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold outline-none bg-slate-50"
                    >
                      {[10,11,12].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-bold text-slate-500">Thời lượng:</label>
                    <div className="flex bg-slate-100 rounded-xl p-1">
                      {["15", "30", "45"].map(d => (
                        <button 
                          key={d}
                          onClick={() => setLessonDuration(d)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${lessonDuration === d ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {d}p
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Hoạt động (chọn nhiều):</label>
                  <div className="flex flex-wrap gap-2">
                    {["Từ vựng", "Phát âm", "Nghe", "Nói", "Mini-game"].map(act => (
                      <button 
                        key={act}
                        onClick={() => setLessonActivities(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act])}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          lessonActivities.includes(act) 
                            ? 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30' 
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] disabled:opacity-70 text-white font-nunito font-extrabold text-sm shadow-[0_4px_0_#d32f2f] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isGenerating ? "AI đang biên soạn..." : "Tạo giáo án với AI"}
                </button>

                {/* AI Output Card */}
                {aiOutput && (
                  <div className="mt-6 border-l-4 border-[#4ECDC4] bg-slate-50 rounded-r-xl p-4 animate-fade-in-up">
                    <div className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-bold text-slate-800 flex items-center justify-between cursor-pointer">
                          Mục tiêu <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </h4>
                        <p className="text-slate-600 mt-1">{aiOutput.objective}</p>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <h4 className="font-bold text-slate-800 flex items-center justify-between cursor-pointer">
                          Từ vựng chính <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </h4>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {aiOutput.vocab.map((v: string) => <span key={v} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-600">{v}</span>)}
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <h4 className="font-bold text-slate-800 flex items-center justify-between cursor-pointer">
                          Game đề xuất <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </h4>
                        <p className="text-[#FF6B6B] font-bold mt-1">🎮 {aiOutput.game}</p>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex gap-2">
                      <button 
                        onClick={() => triggerToast("Đã giao bài cho lớp!")}
                        className="flex-1 py-2 bg-[#4ECDC4] text-white rounded-lg font-bold text-xs shadow-sm hover:bg-[#3dbdb4] transition-colors"
                      >
                        Giao cho lớp
                      </button>
                      <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors">
                        Xuất PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 5. Reward Controls Panel */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-amber-500" /> Bảng Điều Khiển Quà Tặng
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => triggerToast("Mở panel tặng XP...")}
                  className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center gap-2 hover:bg-amber-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">⭐</div>
                  <span className="font-bold text-xs text-amber-700 text-center">Tặng XP đặc biệt</span>
                </button>
                <button 
                  onClick={() => triggerToast("Mở tạo thử thách...")}
                  className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">🎯</div>
                  <span className="font-bold text-xs text-blue-700 text-center">Tạo thử thách riêng</span>
                </button>
                <button 
                  onClick={() => triggerToast("Mở kho skin độc quyền...")}
                  className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col items-center justify-center gap-2 hover:bg-purple-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">👕</div>
                  <span className="font-bold text-xs text-purple-700 text-center">Mở khóa skin</span>
                </button>
                <button 
                  onClick={() => triggerToast("Mở mẫu lời khen...")}
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center gap-2 hover:bg-rose-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">👏</div>
                  <span className="font-bold text-xs text-rose-700 text-center">Gửi lời khen</span>
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
