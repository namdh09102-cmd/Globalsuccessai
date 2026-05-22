"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Rocket, 
  Edit3, 
  Plus,
  CheckCircle,
  AlertCircle,
  Trash2
} from "lucide-react";

export default function AdminCurriculum() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [ingestGrade, setIngestGrade] = useState("6");
  const [ingestType, setIngestType] = useState("speaking");
  const [ingestData, setIngestData] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [syncedGrades, setSyncedGrades] = useState<number[]>([]);
  const [curriculumData, setCurriculumData] = useState<Record<string, any>>({});

  // Kiểm tra trạng thái nạp dữ liệu ban đầu
  React.useEffect(() => {
    let loadedGrades = [];
    const allData: Record<string, any> = {};
    for (let i = 1; i <= 12; i++) {
      const stored = localStorage.getItem(`gsa-curriculum-l${i}`);
      if (stored) {
        loadedGrades.push(i);
        try {
          allData[`l${i}`] = JSON.parse(stored);
        } catch (e) {}
      }
    }
    // Check old Lớp 11
    const storedOld = localStorage.getItem("gsa-curriculum");
    if (storedOld) {
      try {
        const parsed = JSON.parse(storedOld);
        if (parsed.some((u: any) => u.id === "unit-2")) {
          loadedGrades.push(11);
          allData["l11"] = parsed;
        }
      } catch (e) {}
    }
    setSyncedGrades(Array.from(new Set(loadedGrades)));
    setCurriculumData(allData);
  }, []);

  const handleResetGrade = (grade: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`XÁC NHẬN XÓA: Bạn có chắc chắn muốn xóa toàn bộ dữ liệu của Lớp ${grade}?`)) {
      localStorage.removeItem(`gsa-curriculum-l${grade}`);
      setSyncedGrades(prev => prev.filter(g => g !== grade));
      setCurriculumData(prev => {
        const newData = { ...prev };
        delete newData[`l${grade}`];
        return newData;
      });
      setToastMessage(`Đã xóa sạch dữ liệu Lớp ${grade}!`);
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleDeleteLesson = (grade: number, lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Xác nhận xóa bài học này khỏi giáo trình?")) {
      setCurriculumData(prev => {
        const newData = { ...prev };
        const gradeData = [...(newData[`l${grade}`] || [])];
        if (gradeData[0] && gradeData[0].lessons) {
          gradeData[0].lessons = gradeData[0].lessons.filter((l: any) => l.id !== lessonId);
        }
        newData[`l${grade}`] = gradeData;
        localStorage.setItem(`gsa-curriculum-l${grade}`, JSON.stringify(gradeData));
        return newData;
      });
      setToastMessage("Đã xóa bài học!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleBulkIngestion = () => {
    if (!ingestData.trim()) return;
    setIsIngesting(true);
    
    setTimeout(() => {
      try {
        let lessonDataToMerge: any = {};

        if (ingestType === "dictation") {
          // Bỏ qua JSON parse, kiểm tra cặp ngoặc vuông
          if (!ingestData.includes("[") || !ingestData.includes("]")) {
            throw new Error("DICTATION_INVALID");
          }
          lessonDataToMerge = { expectedText: ingestData.trim() };
        } else {
          // Validate JSON cho Speaking, Quiz
          const parsed = JSON.parse(ingestData);
          
          if (ingestType === "quiz") {
            let questions = Array.isArray(parsed) ? parsed : (parsed.quizQuestions ? parsed.quizQuestions : [parsed]);
            
            // Magical Normalizer cho Quiz
            questions = questions.map((q: any) => {
              let options = q.options;
              if (!Array.isArray(options) && typeof options === "object" && options !== null) {
                // Biến đổi { A: "book", B: "apple" } thành ["A. book", "B. apple", "C. cat", "D. duck"]
                options = Object.entries(options).map(([k, v]) => `${k}. ${v}`);
              }
              return {
                ...q,
                question: q.question || "",
                options: options || [],
                correctAnswer: q.correctAnswer || q.correct || "A"
              };
            });

            lessonDataToMerge = { quizQuestions: questions };
          } else if (ingestType === "speaking") {
            if (Array.isArray(parsed)) {
              lessonDataToMerge = parsed[0]?.expectedText ? parsed[0] : { expectedText: JSON.stringify(parsed) };
            } else if (typeof parsed === "object" && parsed !== null) {
              lessonDataToMerge = parsed.expectedText 
                ? parsed 
                : { expectedText: parsed.text || parsed.content || Object.values(parsed)[0] || JSON.stringify(parsed) };
            } else {
              lessonDataToMerge = { expectedText: String(parsed) };
            }
          } else {
            lessonDataToMerge = parsed;
          }
        }
        
        const storageKey = `gsa-curriculum-l${ingestGrade}`;
        let existingData: any[] = [];
        
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) existingData = JSON.parse(stored);
        } catch(e) {}

        if (!Array.isArray(existingData) || existingData.length === 0) {
          existingData = [{
            id: `unit-${ingestGrade}-1`,
            number: 1,
            title: `Chương trình học Lớp ${ingestGrade}`,
            status: "in_progress",
            progress: 0,
            grade: `Lớp ${ingestGrade}`,
            lessons: []
          }];
        }

        // Tạo bài học mới từ dữ liệu
        const newLesson = {
          id: `u${ingestGrade}-l${Date.now()}`,
          title: `Bài tập ${ingestType.toUpperCase()}`,
          type: ingestType,
          completed: false,
          ...lessonDataToMerge
        };

        existingData[0].lessons.push(newLesson);

        localStorage.setItem(storageKey, JSON.stringify(existingData));
        
        setSyncedGrades(prev => Array.from(new Set([...prev, parseInt(ingestGrade)])));
        setCurriculumData(prev => ({
          ...prev,
          [`l${ingestGrade}`]: existingData
        }));
        
        setToastMessage(`Đã nạp thành công dữ liệu thật Lớp ${ingestGrade}!`);
        setToastType("success");
      } catch (e: any) {
        if (e.message === "DICTATION_INVALID") {
          setToastMessage("Văn bản Dictation phải chứa từ khóa bọc trong ngoặc vuông [ ]!");
        } else {
          setToastMessage("Lỗi định dạng dữ liệu JSON!");
        }
        setToastType("error");
      }

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
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99] ${
              toastType === "error"
                ? "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-red-500/40 border-red-400/60"
                : "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-emerald-500/30 border-emerald-300/40"
            } font-black text-xs px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border`}
          >
            {toastType === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span>{toastMessage}</span>
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
              const isSelected = ingestGrade === grade.toString();
              
              return (
                <div key={grade} className="flex flex-col gap-1">
                  <div 
                    onClick={() => setIngestGrade(grade.toString())}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all group cursor-pointer ${
                      isSelected 
                        ? "border-fuchsia-500/50 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.15)]" 
                        : "border-slate-800/50 bg-[#090D16]/50 hover:bg-[#090D16] hover:border-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                        hasData 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : isSelected
                            ? 'bg-fuchsia-500/20 text-fuchsia-400'
                            : 'bg-slate-800 text-slate-500'
                      }`}>
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
                      {hasData && (
                        <button 
                          onClick={(e) => handleResetGrade(grade, e)}
                          className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all shadow-[0_2px_0_rgba(244,63,94,0.2)] active:translate-y-[2px] active:shadow-none" 
                          title="Xóa toàn bộ dữ liệu lớp này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Lessons List */}
                  {isSelected && hasData && curriculumData[`l${grade}`]?.[0]?.lessons && (
                    <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-800/60 space-y-2 mb-2">
                      {curriculumData[`l${grade}`][0].lessons.map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D16]/80 border border-slate-800/40 group/lesson transition-all hover:border-slate-700/50">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-[11px] font-bold text-slate-300 truncate">{lesson.title}</span>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">{lesson.type}</span>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteLesson(grade, lesson.id, e)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 opacity-0 group-hover/lesson:opacity-100 transition-all active:scale-95"
                            title="Xóa bài học này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {curriculumData[`l${grade}`][0].lessons.length === 0 && (
                        <div className="text-[10px] text-slate-500 italic p-2">Chưa có bài học nào.</div>
                      )}
                    </div>
                  )}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Khối Lớp
                </label>
                <select 
                  value={ingestGrade}
                  onChange={(e) => setIngestGrade(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all appearance-none cursor-pointer"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      Lớp {i + 1}
                    </option>
                  ))}
                </select>
              </div>

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
