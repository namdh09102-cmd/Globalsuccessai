"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Sparkles, Gamepad2, Users, BarChart3, Award, Calendar, 
  BookOpen, Tv, Clock, ArrowUp, ArrowDown, Send, FileOutput, Settings,
  Rocket, Zap, Crown, Landmark, RotateCcw, Play, Pause, Eye, QrCode
} from "lucide-react";

type TabType = "overview" | "lesson" | "game" | "students";
type GameType = "race" | "quick" | "king" | "castle" | "team" | "spin";

const MOCK_STUDENTS = [
  {id: '1', name: 'Minh Anh', init: 'MA', xp: 3660, speak: 92, listen: 88, read: 85, active: '2 giờ trước', status: 'green'},
  {id: '2', name: 'Bảo Trâm', init: 'BT', xp: 2460, speak: 78, listen: 82, read: 76, active: '3 giờ trước', status: 'green'},
  {id: '3', name: 'Tuấn Kiệt', init: 'TK', xp: 1710, speak: 65, listen: 60, read: 70, active: '1 ngày trước', status: 'amber'},
  {id: '4', name: 'Khánh Tân', init: 'KT', xp: 1260, speak: 58, listen: 55, read: 62, active: '5 giờ trước', status: 'amber'},
  {id: '5', name: 'Diệu Linh', init: 'DL', xp: 980, speak: 45, listen: 48, read: 50, active: '2 ngày trước', status: 'red'},
  {id: '6', name: 'Hoàng Bách', init: 'HB', xp: 750, speak: 40, listen: 42, read: 44, active: '3 ngày trước', status: 'red'},
];

const COLORS = {
  primary: '#E63946', primaryLight: '#FAECE7', primaryBorder: '#F5C4B3',
  teal: '#0F6E56', tealLight: '#E1F5EE', tealBorder: '#9FE1CB', tealMid: '#1D9E75',
  amber: '#BA7517', amberLight: '#FAEEDA', amberBorder: '#FAC775',
  purple: '#534AB7', purpleLight: '#EEEDFE', purpleBorder: '#CECBF6',
  blue: '#185FA5', blueLight: '#E6F1FB', blueBorder: '#B5D4F4',
  green: '#3B6D11', greenLight: '#EAF3DE', greenBorder: '#C0DD97',
  bgPrimary: '#fff', bgSecondary: '#f9f9f9', bgTertiary: '#F5F5F2',
  borderSecondary: '#eaeaea', borderTertiary: '#f0f0f0',
  textPrimary: '#333', textSecondary: '#666', textTertiary: '#999'
};

export default function TeacherPortalPort() {
  const [activeTab, setActiveTab] = useState<TabType>("lesson");
  const [activeGame, setActiveGame] = useState<GameType>("race");
  
  // Lesson Planner State
  const [topic, setTopic] = useState("My future job and dreams");
  const [grade, setGrade] = useState("Lớp 7");
  const [duration, setDuration] = useState("45 phút");
  const [activities, setActivities] = useState<string[]>(["Từ vựng", "Nói", "Mini-game"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<any>(null);

  // Race Game State
  const [isRacing, setIsRacing] = useState(false);
  const [positions, setPositions] = useState([10, 10, 10]);

  const toggleActivity = (act: string) => {
    setActivities(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]);
  };

  const handleGenerateAI = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setAiOutput(null);
    try {
      const res = await fetch("/api/teacher/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, grade, duration, activities })
      });
      if (!res.ok) throw new Error("API fail");
      const data = await res.json();
      setAiOutput(data);
    } catch (e) {
      // Fallback if API fails
      setAiOutput({
        objective: `HS hiểu và giao tiếp được về chủ đề ${topic}.`,
        vocab: ["doctor", "engineer", "teacher", "artist", "pilot"],
        warmup: "Game Đấu Quick khởi động.",
        practice: "Nghe mẫu câu, luyện nói theo cặp.",
        game: "Đua Tên Lửa — Củng cố từ vựng."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let tick: NodeJS.Timeout;
    if (isRacing) {
      let frame = 0;
      tick = setInterval(() => {
        frame++;
        setPositions(prev => {
          const finalPos = [78, 62, 55];
          return prev.map((p, i) => Math.min(p + Math.random() * 3, finalPos[i]));
        });
        if (frame >= 30) setIsRacing(false);
      }, 80);
    }
    return () => clearInterval(tick);
  }, [isRacing]);

  const resetRace = () => {
    setPositions([10, 10, 10]);
    setIsRacing(true);
  };

  return (
    <div className="h-[90vh] bg-[#F5F5F2] font-sans p-6 overflow-hidden flex items-center justify-center">
      <div className="flex w-full max-w-[1200px] h-[750px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Sidebar */}
        <div className="w-[220px] bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-200">
            <div className="text-[15px] font-bold text-gray-800">GlobalSuccess AI</div>
            <div className="text-[11px] text-gray-500 mt-0.5">K-12 Edtech Platform</div>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#E1F5EE] text-[#0F6E56] font-medium mt-2">
              <BookOpen className="w-3 h-3" /> Giáo viên
            </span>
          </div>
          
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2 mt-2">Giảng dạy</div>
            <div onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'overview' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <LayoutDashboard className="w-4 h-4" /> Tổng quan lớp
            </div>
            <div onClick={() => setActiveTab('lesson')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'lesson' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Sparkles className="w-4 h-4" /> Soạn giáo án AI
            </div>
            <div onClick={() => setActiveTab('game')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'game' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Gamepad2 className="w-4 h-4" /> Tạo game lớp
            </div>

            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2 mt-2">Học sinh</div>
            <div onClick={() => setActiveTab('students')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'students' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Users className="w-4 h-4" /> Danh sách lớp
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer text-gray-600 hover:bg-gray-50 mb-0.5">
              <BarChart3 className="w-4 h-4" /> Báo cáo
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer text-gray-600 hover:bg-gray-50 mb-0.5">
              <Award className="w-4 h-4" /> Trao thưởng
            </div>

            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2 mt-2">Cài đặt</div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer text-gray-600 hover:bg-gray-50 mb-0.5">
              <Calendar className="w-4 h-4" /> Lịch dạy
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center text-[12px] font-bold shrink-0">NT</div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-gray-800 truncate">Cô Ngọc Thảo</div>
              <div className="text-[11px] text-gray-500 truncate">Tiếng Anh · Lớp 6–9</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fbfbfb]">
          
          {/* Topbar */}
          <div className="p-4 px-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-[16px] font-bold text-gray-800">
                {activeTab === 'overview' && "Tổng quan lớp"}
                {activeTab === 'lesson' && "Soạn giáo án AI"}
                {activeTab === 'game' && "Tạo game cho lớp"}
                {activeTab === 'students' && "Danh sách học sinh"}
              </h2>
              <p className="text-[12px] text-gray-500 mt-0.5">
                {activeTab === 'overview' && "Lớp 7A3 hôm nay — 28/32 học sinh online"}
                {activeTab === 'lesson' && "Nhập chủ đề — AI tạo giáo án hoàn chỉnh trong 10 giây"}
                {activeTab === 'game' && "Chọn game, cấu hình và chiếu thẳng lên bảng TV"}
                {activeTab === 'students' && "Theo dõi tiến độ từng em, giao bài và gửi báo cáo"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[12px] text-gray-500 flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" /> Lớp 7A3 · 32 HS
              </div>
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[12px] font-bold text-gray-700 transition-colors">
                <Tv className="w-4 h-4" /> Chiếu bảng
              </button>
            </div>
          </div>

          {/* Tab Headers */}
          <div className="flex px-6 bg-white border-b border-gray-200 shrink-0">
            <div onClick={() => setActiveTab('overview')} className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#E63946] text-[#E63946]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <LayoutDashboard className="w-4 h-4" /> Tổng quan
            </div>
            <div onClick={() => setActiveTab('lesson')} className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'lesson' ? 'border-[#E63946] text-[#E63946]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <Sparkles className="w-4 h-4" /> Soạn giáo án
            </div>
            <div onClick={() => setActiveTab('game')} className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'game' ? 'border-[#E63946] text-[#E63946]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <Gamepad2 className="w-4 h-4" /> Tạo game
            </div>
            <div onClick={() => setActiveTab('students')} className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'students' ? 'border-[#E63946] text-[#E63946]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <Users className="w-4 h-4" /> Học sinh
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in-up">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="text-[11px] text-gray-500 mb-1">Online hôm nay</div>
                    <div className="text-[24px] font-bold text-gray-800">28<span className="text-[14px] text-gray-400 font-normal">/32</span></div>
                    <div className="text-[11px] text-[#3B6D11] mt-1 flex items-center gap-1"><ArrowUp className="w-3 h-3" /> 4 hơn hôm qua</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="text-[11px] text-gray-500 mb-1">Bài hoàn thành</div>
                    <div className="text-[24px] font-bold text-gray-800">74<span className="text-[14px] text-gray-400 font-normal">%</span></div>
                    <div className="text-[11px] text-[#3B6D11] mt-1 flex items-center gap-1"><ArrowUp className="w-3 h-3" /> +8% tuần trước</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="text-[11px] text-gray-500 mb-1">Điểm trung bình</div>
                    <div className="text-[24px] font-bold text-gray-800">7.8</div>
                    <div className="text-[11px] text-gray-400 mt-1">Ổn định</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="text-[11px] text-gray-500 mb-1">Cần hỗ trợ</div>
                    <div className="text-[24px] font-bold text-[#A32D2D]">5</div>
                    <div className="text-[11px] text-[#A32D2D] mt-1 flex items-center gap-1"><ArrowDown className="w-3 h-3" /> Dưới 60% tuần này</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-500" /> Hoạt động gần đây</div>
                      <div className="text-[11px] text-[#E63946] cursor-pointer hover:underline">Xem tất cả</div>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center text-[11px] font-bold shrink-0">MA</div>
                      <div className="flex-1"><div className="text-[12px] font-bold text-gray-800">Minh Anh</div><div className="text-[11px] text-gray-500">Hoàn thành Unit 3 Speaking</div></div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF3DE] text-[#3B6D11] font-bold">+50 XP</span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-[#EEEDFE] text-[#534AB7] flex items-center justify-center text-[11px] font-bold shrink-0">BT</div>
                      <div className="flex-1"><div className="text-[12px] font-bold text-gray-800">Bảo Trâm</div><div className="text-[11px] text-gray-500">Luyện phát âm /th/ — 83%</div></div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAEEDA] text-[#BA7517] font-bold">+20 XP</span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-[#FCEBEB] text-[#A32D2D] flex items-center justify-center text-[11px] font-bold shrink-0">TK</div>
                      <div className="flex-1"><div className="text-[12px] font-bold text-gray-800">Tuấn Kiệt</div><div className="text-[11px] text-gray-500">Chưa nộp bài Unit 3</div></div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FCEBEB] text-[#A32D2D] font-bold">Nhắc nhở</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
                    <div className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5 mb-3"><Sparkles className="w-4 h-4 text-[#E63946]" /> Gợi ý từ AI</div>
                    <div className="text-[13px] text-gray-600 leading-relaxed mb-4 flex-1">
                      Lớp 7A3 đang yếu kỹ năng <strong className="text-[#E63946]">Pronunciation</strong>. Đề xuất tổ chức game <em>Đấu Quick</em> đầu tiết hôm nay để luyện tập nhóm.
                    </div>
                    <button onClick={() => setActiveTab('game')} className="w-full bg-[#0F6E56] hover:bg-[#1D9E75] text-white py-2.5 rounded-lg text-[13px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <Gamepad2 className="w-4 h-4" /> Tạo game ngay
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LESSON TAB */}
            {activeTab === 'lesson' && (
              <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-fit">
                  <div className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5 mb-5 border-b border-gray-100 pb-3">
                    <Sparkles className="w-4 h-4 text-gray-500" /> Thông tin bài học
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-gray-500">Chủ đề bài học</label>
                      <input 
                        type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                        className="w-full text-[13px] px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E63946] outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-gray-500">Khối lớp</label>
                        <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full text-[13px] px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E63946] outline-none bg-white">
                          <option>Lớp 7</option><option>Lớp 8</option><option>Lớp 9</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-gray-500">Thời lượng</label>
                        <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full text-[13px] px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E63946] outline-none bg-white">
                          <option>45 phút</option><option>30 phút</option><option>15 phút</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-gray-500">Loại hoạt động</label>
                      <div className="flex flex-wrap gap-2">
                        {["Từ vựng", "Nói", "Nghe", "Mini-game", "Viết", "Ngữ pháp"].map(act => (
                          <div 
                            key={act} onClick={() => toggleActivity(act)}
                            className={`px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors border ${
                              activities.includes(act) ? 'bg-[#FAECE7] text-[#E63946] border-[#F5C4B3]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {act}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-gray-500">Ghi chú thêm</label>
                      <textarea rows={2} placeholder="VD: Tập trung pronunciation..." className="w-full text-[13px] px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E63946] outline-none resize-none"></textarea>
                    </div>

                    <button 
                      onClick={handleGenerateAI} disabled={isGenerating}
                      className="w-full bg-[#E63946] hover:bg-[#c62b37] disabled:opacity-70 text-white py-2.5 rounded-lg text-[13px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
                    >
                      {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isGenerating ? "AI đang soạn..." : "Tạo giáo án với AI"}
                    </button>
                  </div>
                </div>

                <div>
                  {aiOutput ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full animate-fade-in-up">
                      <div className="p-3.5 px-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 shrink-0">
                        <div className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5"><FileOutput className="w-4 h-4 text-[#0F6E56]" /> Giáo án: {topic}</div>
                        <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{grade} · {duration}</span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto">
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mục tiêu bài học</div>
                          <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.objective}</div>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Từ vựng chính</div>
                          <div className="flex flex-wrap gap-1.5">
                            {aiOutput.vocab.map((v:string) => <span key={v} className="text-[11px] px-2 py-0.5 rounded bg-[#E1F5EE] text-[#0F6E56] font-medium">{v}</span>)}
                          </div>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Khởi động</div>
                          <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.warmup}</div>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Thực hành</div>
                          <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.practice}</div>
                        </div>
                        <div className="p-4">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Game củng cố</div>
                          <div className="text-[13px] text-gray-800 leading-relaxed bg-[#EEEDFE] text-[#534AB7] p-2 rounded-lg inline-block font-medium">🎮 {aiOutput.game}</div>
                        </div>
                      </div>

                      <div className="p-3 px-4 bg-gray-50 border-t border-gray-200 flex gap-2 shrink-0">
                        <button className="flex-1 bg-[#E63946] hover:bg-[#c62b37] text-white py-2 rounded-lg text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5">
                          <Send className="w-3.5 h-3.5" /> Giao cho lớp
                        </button>
                        <button onClick={() => window.print()} className="px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5">
                          <FileOutput className="w-3.5 h-3.5" /> Xuất PDF
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 h-full flex flex-col items-center justify-center text-gray-400">
                      <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                      <div className="text-[13px] font-medium">Nhập thông tin bên trái để AI tạo giáo án</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GAME TAB */}
            {activeTab === 'game' && (
              <div className="animate-fade-in-up">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div onClick={() => setActiveGame('race')} className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center bg-white ${activeGame === 'race' ? 'border-[#E63946] bg-[#FAECE7]' : 'border-gray-100 hover:border-[#F5C4B3]'}`}>
                    <Rocket className={`w-6 h-6 mx-auto mb-1.5 ${activeGame === 'race' ? 'text-[#E63946]' : 'text-gray-400'}`} />
                    <div className="text-[12px] font-bold text-gray-800 mb-0.5">Đua Tên Lửa</div>
                    <div className="text-[10px] text-gray-500 leading-tight">Trả lời nhanh — tên lửa bay</div>
                  </div>
                  <div onClick={() => setActiveGame('quick')} className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center bg-white ${activeGame === 'quick' ? 'border-[#E63946] bg-[#FAECE7]' : 'border-gray-100 hover:border-[#F5C4B3]'}`}>
                    <Zap className={`w-6 h-6 mx-auto mb-1.5 ${activeGame === 'quick' ? 'text-[#E63946]' : 'text-gray-400'}`} />
                    <div className="text-[12px] font-bold text-gray-800 mb-0.5">Đấu Quick</div>
                    <div className="text-[10px] text-gray-500 leading-tight">1v1 phát âm real-time</div>
                  </div>
                  <div onClick={() => setActiveGame('king')} className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center bg-white ${activeGame === 'king' ? 'border-[#E63946] bg-[#FAECE7]' : 'border-gray-100 hover:border-[#F5C4B3]'}`}>
                    <Crown className={`w-6 h-6 mx-auto mb-1.5 ${activeGame === 'king' ? 'text-[#E63946]' : 'text-gray-400'}`} />
                    <div className="text-[12px] font-bold text-gray-800 mb-0.5">Vua Lớp Học</div>
                    <div className="text-[10px] text-gray-500 leading-tight">Bảng xếp hạng tuần</div>
                  </div>
                </div>

                {activeGame === 'race' && (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
                      <div className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5 mb-3 border-b border-gray-100 pb-2">
                        <Settings className="w-4 h-4 text-gray-400" /> Cấu hình: Đua Tên Lửa
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-500">Số câu hỏi</label>
                          <select className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-gray-200 outline-none bg-gray-50"><option>10 câu</option><option>15 câu</option></select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-500">Thời gian/câu</label>
                          <select className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-gray-200 outline-none bg-gray-50"><option>15 giây</option><option>30 giây</option></select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-500">Nội dung</label>
                          <select className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-gray-200 outline-none bg-gray-50"><option>Giáo án hiện tại</option><option>Tự chọn</option></select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="p-3 px-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="text-[12px] font-bold text-gray-800 flex items-center gap-1.5"><Eye className="w-4 h-4" /> Xem trước trên TV</div>
                      </div>
                      <div className="p-4 bg-slate-900 relative">
                        {/* Race Track */}
                        <div className="relative h-[100px] bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                          <div className="absolute left-0 right-0 top-[25px] h-px bg-slate-700"></div>
                          <div className="absolute left-0 right-0 top-[50px] h-px bg-slate-700"></div>
                          <div className="absolute left-0 right-0 top-[75px] h-px bg-slate-700"></div>
                          <div className="absolute right-4 top-0 bottom-0 w-2 border-l-2 border-dashed border-white/30"></div>
                          
                          <div className="absolute text-[24px] drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all ease-linear" style={{ top: '8px', left: `${positions[0]}%` }}>🚀</div>
                          <div className="absolute text-[24px] drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all ease-linear" style={{ top: '33px', left: `${positions[1]}%` }}>🚀</div>
                          <div className="absolute text-[24px] drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all ease-linear" style={{ top: '58px', left: `${positions[2]}%` }}>🚀</div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center border border-slate-700">
                            <div className="text-[10px] text-slate-400">Đội 1</div><div className="text-[14px] font-bold text-[#E63946]">{Math.round(positions[0])}%</div>
                          </div>
                          <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center border border-slate-700">
                            <div className="text-[10px] text-slate-400">Đội 2</div><div className="text-[14px] font-bold text-[#0F6E56]">{Math.round(positions[1])}%</div>
                          </div>
                          <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center border border-slate-700">
                            <div className="text-[10px] text-slate-400">Đội 3</div><div className="text-[14px] font-bold text-[#534AB7]">{Math.round(positions[2])}%</div>
                          </div>
                        </div>

                        <button 
                          onClick={isRacing ? resetRace : resetRace}
                          className="mt-4 w-full bg-[#E63946] hover:bg-[#c62b37] text-white py-2.5 rounded-lg text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          {isRacing ? <><RotateCcw className="w-4 h-4" /> Chơi lại</> : <><Play className="w-4 h-4" /> Bắt đầu game</>}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 bg-[#E1F5EE] border border-[#9FE1CB] rounded-xl p-3 px-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse"></span>
                        <span className="text-[13px] font-bold text-[#0F6E56]">28 học sinh đã sẵn sàng</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-white border border-[#9FE1CB] text-[#0F6E56] px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" /> QR</button>
                        <button className="bg-[#0F6E56] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 shadow-sm"><Tv className="w-3.5 h-3.5" /> Chiếu lên bảng</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === 'students' && (
              <div className="animate-fade-in-up bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-500" /> Danh sách Lớp 7A3</div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Tìm kiếm..." className="text-[12px] px-3 py-1.5 rounded-lg border border-gray-200 outline-none w-48" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-white">
                        <th className="p-3 pl-4">Học sinh</th>
                        <th className="p-3 text-center">XP Tích luỹ</th>
                        <th className="p-3 text-center">Nói</th>
                        <th className="p-3 text-center">Nghe</th>
                        <th className="p-3 text-center">Trạng thái</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_STUDENTS.map(s => {
                        const bg = s.status === 'green' ? '#E1F5EE' : s.status === 'amber' ? '#FAEEDA' : '#FCEBEB';
                        const text = s.status === 'green' ? '#0F6E56' : s.status === 'amber' ? '#BA7517' : '#A32D2D';
                        return (
                          <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <td className="p-3 pl-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{background: bg, color: text}}>{s.init}</div>
                                <div>
                                  <div className="text-[13px] font-bold text-gray-800">{s.name}</div>
                                  <div className="text-[11px] text-gray-500">{s.active}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="text-[13px] font-bold text-gray-800 mb-1">{s.xp.toLocaleString()}</div>
                              <div className="w-16 h-1 bg-gray-100 rounded-full mx-auto overflow-hidden"><div className="h-full bg-[#E63946]" style={{width: `${s.xp/4000*100}%`}}></div></div>
                            </td>
                            <td className="p-3 text-center text-[12px] font-bold" style={{color: s.speak >= 80 ? '#3B6D11' : s.speak >= 60 ? '#BA7517' : '#A32D2D'}}>{s.speak}%</td>
                            <td className="p-3 text-center text-[12px] font-bold" style={{color: s.listen >= 80 ? '#3B6D11' : s.listen >= 60 ? '#BA7517' : '#A32D2D'}}>{s.listen}%</td>
                            <td className="p-3 text-center">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{background: bg, color: text}}>
                                {s.status === 'green' ? 'Tích cực' : s.status === 'amber' ? 'Bình thường' : 'Cần hỗ trợ'}
                              </span>
                            </td>
                            <td className="p-3 pr-4 text-right">
                              <button className="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                                Giao bài
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
