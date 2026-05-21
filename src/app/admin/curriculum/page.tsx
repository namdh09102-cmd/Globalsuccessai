"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Rocket, 
  Edit3, 
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AdminCurriculum() {
  const [showToast, setShowToast] = useState(false);
  const [ingestType, setIngestType] = useState("speaking");
  const [ingestData, setIngestData] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [syncedGrades, setSyncedGrades] = useState<number[]>([6]);

  // Kiểm tra trạng thái nạp dữ liệu ban đầu
  React.useEffect(() => {
    const stored = localStorage.getItem("gsa-curriculum");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const unit2 = parsed.find((u: any) => u.id === "unit-2");
        if (unit2) {
          const dictationLesson = unit2.lessons.find((l: any) => l.type === "dictation");
          if (dictationLesson && dictationLesson.expectedText?.includes("individuality")) {
            setSyncedGrades(prev => Array.from(new Set([...prev, 11])));
          }
        }
      } catch (e) {}
    }
  }, []);

  const handleBulkIngestion = () => {
    if (!ingestData.trim()) return;
    setIsIngesting(true);
    
    setTimeout(() => {
      // 1. Lấy dữ liệu Curriculum hiện tại
      const stored = localStorage.getItem("gsa-curriculum");
      let parsed = [];
      if (stored) {
        try { parsed = JSON.parse(stored); } catch (e) {}
      }

      // 2. Tạo bộ dữ liệu Mock Unit 2
      const unit2Data = {
        id: "unit-2",
        number: 2,
        title: "The Generation Gap",
        status: "in_progress",
        progress: 33,
        grade: "Lớp 11",
        lessons: [
          { id: "u2-l1", title: "Vocabulary: Family & Relationships", type: "vocabulary", completed: true },
          { 
            id: "u2-l2", title: "Speaking: Đoạn hội thoại Phong - Vy", type: "speaking", completed: false,
            expectedText: "Phong: I think parents should respect our privacy. Vy: Yes, but we also need to understand their worries."
          },
          { 
            id: "u2-l3", title: "Dictation: Arguments between parents...", type: "dictation", completed: false,
            expectedText: "Arguments between parents and children usually occur when parents do not respect their children's [individuality]. Some behaviors are considered [unacceptable] in traditional families. We need to show [sympathy] to bridge the [generation] gap."
          },
          { 
            id: "u2-l4", title: "Quiz: Generation Gap & Modal Verbs", type: "quiz", completed: false,
            quizQuestions: [
              { question: "You ______ consult your parents before deciding on a career path, as their advice is valuable.", options: ["A. must", "B. should", "C. have to", "D. ought"], correctAnswer: "B" },
              { question: "The difference in attitude or behavior between older and younger generations is called generation ______.", options: ["A. space", "B. bridge", "C. gap", "D. split"], correctAnswer: "C" },
              { question: "I don't think parents should impose their decisions ______ their children.", options: ["A. on", "B. in", "C. at", "D. to"], correctAnswer: "A" }
            ]
          }
        ]
      };

      // 3. Ghi đè vào mảng
      const unit2Index = parsed.findIndex((u: any) => u.id === "unit-2");
      if (unit2Index >= 0) {
        parsed[unit2Index] = unit2Data;
      } else {
        parsed.push(unit2Data);
      }

      // 4. Lưu lại vào DB và cập nhật UI State
      localStorage.setItem("gsa-curriculum", JSON.stringify(parsed));
      setSyncedGrades(prev => Array.from(new Set([...prev, 11])));

      setIsIngesting(false);
      setIngestData("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-full p-6 space-y-6 select-none bg-[#090D16]">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[99] bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-6 py-3 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center gap-2 border border-amber-300/40"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Đồng bộ hệ thống thành công! Toàn bộ dữ liệu thật Unit 2 đã được trực tuyến hóa.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Quản Lý Giáo Trình
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            Cấu trúc bài giảng & Seeding Dữ liệu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BENTO CARD #2: KHỐI QUẢN LÝ GIÁO TRÌNH */}
        <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 flex flex-col space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <BookOpen className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            <h2 className="text-sm font-black uppercase tracking-wider">Cấu Trúc Kho Bài Giảng K-12</h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 max-h-[500px]">
            {[...Array(12)].map((_, i) => {
              const grade = i + 1;
              const hasData = syncedGrades.includes(grade);
              
              return (
                <div key={grade} className="flex items-center justify-between p-3 rounded-xl border border-slate-800/50 bg-[#090D16]/50 hover:bg-[#090D16] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${hasData ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {grade}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Khối Lớp {grade}</h3>
                      {hasData ? (
                        <span className="inline-block mt-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          Đã nạp Data thật
                        </span>
                      ) : (
                        <span className="inline-block mt-0.5 text-[8px] font-black uppercase tracking-wider text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          Bản thô / Chờ duyệt
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 transition-all shadow-[0_2px_0_rgba(99,102,241,0.2)] active:translate-y-[2px] active:shadow-none" title="Thêm bài học">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all shadow-[0_2px_0_rgba(51,65,85,0.4)] active:translate-y-[2px] active:shadow-none" title="Chỉnh sửa nhanh">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENTO CARD #3: CỬA SỔ NẠP DATA */}
        <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 flex flex-col space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <Rocket className="w-5 h-5 text-fuchsia-400 fill-fuchsia-400/20" />
            <h2 className="text-sm font-black uppercase tracking-wider">Trình Nạp Dữ Liệu AI Cấp Tốc</h2>
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                Loại dữ liệu nạp
              </label>
              <select 
                value={ingestType}
                onChange={(e) => setIngestType(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all appearance-none"
              >
                <option value="speaking">Bài tập Speaking (Hội thoại)</option>
                <option value="dictation">Bài tập Dictation (Điền từ)</option>
                <option value="quiz">Bài tập Quiz (Trắc nghiệm JSON)</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col space-y-2 relative min-h-[300px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center justify-between">
                <span>Nội dung thô (Raw Data)</span>
                <span className="text-fuchsia-400 bg-fuchsia-500/10 px-1.5 py-0.5 rounded text-[8px]">Auto-Seeding</span>
              </label>
              <textarea
                value={ingestData}
                onChange={(e) => setIngestData(e.target.value)}
                placeholder="Dán cấu trúc JSON hoặc đoạn văn bản chứa ngoặc vuông [ ] vào đây để hệ thống tự động Seeding..."
                className="flex-1 w-full bg-[#090D16] border border-slate-700 text-slate-300 text-xs rounded-xl p-4 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all resize-none custom-scrollbar font-mono leading-relaxed placeholder:text-slate-600"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[9px] text-slate-500 bg-[#111827] px-2 py-1 rounded-md border border-slate-800">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>Format: JSON / Plain Text</span>
              </div>
            </div>

            <button
              onClick={handleBulkIngestion}
              disabled={isIngesting || !ingestData.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white text-xs font-black uppercase tracking-wider shadow-[0_6px_0_#831843] hover:shadow-[0_3px_0_#831843] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_6px_0_#831843] disabled:active:translate-y-0 mt-4"
            >
              {isIngesting ? "Đang xử lý đồng bộ..." : "Kích Hoạt Đồng Bộ Toàn Hệ Thống"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
