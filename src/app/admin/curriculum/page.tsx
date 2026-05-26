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
import { supabase } from "@/lib/supabase";

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
    const fetchCurriculums = async () => {
      try {
        const { data, error } = await supabase.from('curriculums').select('*');
        if (error) throw error;
        
        let loadedGrades: number[] = [];
        const allData: Record<string, any> = {};
        
        if (data && data.length > 0) {
          data.forEach(item => {
            const gradeNum = parseInt(item.grade_level);
            if (!isNaN(gradeNum)) {
              loadedGrades.push(gradeNum);
              allData[`l${gradeNum}`] = item.content;
            } else if (item.grade_level === 'contributions') {
              allData['contributions'] = item.content;
            }
          });
        }
        
        setSyncedGrades(Array.from(new Set(loadedGrades)));
        setCurriculumData(allData);
      } catch (err) {
        console.error("Error fetching curriculums", err);
      }
    };
    
    fetchCurriculums();
  }, []);

  const handleResetGrade = async (grade: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`XÁC NHẬN XÓA: Bạn có chắc chắn muốn xóa toàn bộ dữ liệu của Lớp ${grade}?`)) {
      try {
        await supabase.from('curriculums').delete().eq('grade_level', grade.toString());
        setSyncedGrades(prev => prev.filter(g => g !== grade));
        setCurriculumData(prev => {
          const newData = { ...prev };
          delete newData[`l${grade}`];
          return newData;
        });
        setToastMessage(`Đã xóa sạch dữ liệu Lớp ${grade}!`);
        setToastType("success");
      } catch (err) {
        setToastMessage("Lỗi khi xóa dữ liệu!");
        setToastType("error");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleDeleteLesson = async (grade: number, lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Xác nhận xóa bài học này khỏi giáo trình?")) {
      try {
        const newData = { ...curriculumData };
        const gradeData = [...(newData[`l${grade}`] || [])];
        gradeData.forEach(unit => {
          if (unit.lessons) {
            unit.lessons = unit.lessons.filter((l: any) => l.id !== lessonId);
          }
        });
        newData[`l${grade}`] = gradeData;
        
        await supabase.from('curriculums').upsert({
          grade_level: grade.toString(),
          content: gradeData
        });
        
        setCurriculumData(newData);
        setToastMessage("Đã xóa bài học!");
        setToastType("success");
      } catch (err) {
        setToastMessage("Lỗi khi xóa bài học!");
        setToastType("error");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleBulkIngestion = async () => {
    if (!ingestData.trim()) return;
    setIsIngesting(true);
    
    try {
      let lessonDataToMerge: any = {};

      if (ingestType === "dictation") {
        if (!ingestData.includes("[") || !ingestData.includes("]")) {
          throw new Error("DICTATION_INVALID");
        }
        lessonDataToMerge = { expectedText: ingestData.trim() };
      } else {
        const cleanedData = ingestData.replace(/\n/g, " ").replace(/\r/g, "");
        const parsed = JSON.parse(cleanedData);
        
        if (ingestType === "quiz") {
          let questions = Array.isArray(parsed) ? parsed : (parsed.quizQuestions ? parsed.quizQuestions : [parsed]);
          questions = questions.map((q: any) => {
            let options = q.options;
            if (!Array.isArray(options) && typeof options === "object" && options !== null) {
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
      
      let existingData: any[] = curriculumData[`l${ingestGrade}`] || [];
      
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

      const newLesson = {
        id: `u${ingestGrade}-l${Date.now()}`,
        title: `Bài tập ${ingestType.toUpperCase()}`,
        type: ingestType,
        completed: false,
        ...lessonDataToMerge
      };

      existingData[0].lessons.push(newLesson);

      const { error } = await supabase.from('curriculums').upsert({
        grade_level: ingestGrade.toString(),
        content: existingData
      }, { onConflict: 'grade_level' });
      
      if (error) throw error;
      
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
  };

  const handleAutoSeedL1 = async () => {
    if (!window.confirm("Bắt đầu tự động nạp 16 Units Lớp 1 từ file seed (ghi đè dữ liệu cũ)?")) return;
    try {
      setIsIngesting(true);
      const res = await fetch("/seeds/grade1.json");
      if (!res.ok) throw new Error("Không tìm thấy file seed");
      const gradeData = await res.json();
      
      const { error } = await supabase.from('curriculums').upsert({
        grade_level: "1",
        content: gradeData
      }, { onConflict: 'grade_level' });
      if (error) throw error;
      
      setSyncedGrades(prev => Array.from(new Set([...prev, 1])));
      setCurriculumData(prev => ({ ...prev, l1: gradeData }));
      
      setToastMessage("Đã Auto-Seed toàn bộ 16 Units Lớp 1!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Lỗi khi đọc file grade1.json");
    } finally {
      setIsIngesting(false);
    }
  };

  const handleAutoSeedL2 = async () => {
    if (!window.confirm("Bắt đầu tự động nạp 16 Units Lớp 2 từ file seed (ghi đè dữ liệu cũ)?")) return;
    try {
      setIsIngesting(true);
      const res = await fetch("/seeds/grade2.json");
      if (!res.ok) throw new Error("Không tìm thấy file seed");
      const gradeData = await res.json();
      
      const { error } = await supabase.from('curriculums').upsert({
        grade_level: "2",
        content: gradeData
      }, { onConflict: 'grade_level' });
      if (error) throw error;
      
      setSyncedGrades(prev => Array.from(new Set([...prev, 2])));
      setCurriculumData(prev => ({ ...prev, l2: gradeData }));
      
      setToastMessage("Đã Auto-Seed toàn bộ 16 Units Lớp 2!");
      setToastType("success");
    } catch (e: any) {
      setToastMessage("Lỗi Auto-Seed: " + e.message);
      setToastType("error");
    } finally {
      setIsIngesting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleAutoSeedL3 = async () => {
    if (!window.confirm("Bắt đầu tự động nạp 20 Units Lớp 3 từ file seed (ghi đè dữ liệu cũ)?")) return;
    try {
      setIsIngesting(true);
      const res = await fetch("/seeds/grade3.json");
      if (!res.ok) throw new Error("Không tìm thấy file seed");
      const gradeData = await res.json();
      
      const { error } = await supabase.from('curriculums').upsert({
        grade_level: "3",
        content: gradeData
      }, { onConflict: 'grade_level' });
      if (error) throw error;
      
      setSyncedGrades(prev => Array.from(new Set([...prev, 3])));
      setCurriculumData(prev => ({ ...prev, l3: gradeData }));
      
      setToastMessage("Đã Auto-Seed toàn bộ 20 Units Lớp 3!");
      setToastType("success");
    } catch (e: any) {
      setToastMessage("Lỗi Auto-Seed: " + e.message);
      setToastType("error");
    } finally {
      setIsIngesting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
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
                : "bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-teal-500/30 border-teal-300/40"
            } font-black text-xs px-6 py-3 rounded-[var(--radius-card)] shadow-2xl flex items-center gap-2 border`}
          >
            {toastType === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
        <div className="w-12 h-12 rounded-[var(--radius-card)] bg-gradient-to-tr from-teal-600 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Quản Lý Giáo Trình
          </h1>
          <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-0.5">
            Cấu trúc bài giảng & Seeding Dữ liệu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BENTO CARD #2: KHỐI QUẢN LÝ GIÁO TRÌNH */}
        <div className="rounded-[var(--radius-card)] bg-[#111827] border border-slate-800 p-6 flex flex-col space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2 text-slate-300">
              <BookOpen className="w-5 h-5 text-teal-400 fill-teal-400/20" />
              <h2 className="text-sm font-black uppercase tracking-wider">Cấu Trúc Kho Bài Giảng K-12</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoSeedL1}
                disabled={isIngesting}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary-light text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-[var(--radius-btn)] hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Rocket className="w-3.5 h-3.5" />
                Auto Lớp 1
              </button>
              <button
                onClick={handleAutoSeedL2}
                disabled={isIngesting}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary-light text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-[var(--radius-btn)] hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Rocket className="w-3.5 h-3.5" />
                Auto Lớp 2
              </button>
              <button
                onClick={handleAutoSeedL3}
                disabled={isIngesting}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-[var(--radius-btn)] hover:bg-teal-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Rocket className="w-3.5 h-3.5" />
                Auto Lớp 3
              </button>
            </div>
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
                    className={`flex items-center justify-between p-3 rounded-[var(--radius-card)] border transition-all group cursor-pointer ${
                      isSelected 
                        ? "border-indigo-500/50 bg-primary-light shadow-[0_0_15px_rgba(217,70,239,0.15)]" 
                        : "border-slate-800/50 bg-[#090D16]/50 hover:bg-[#090D16] hover:border-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-[var(--radius-btn)] flex items-center justify-center font-black text-xs transition-colors ${
                        hasData 
                          ? 'bg-teal-500/10 text-teal-400' 
                          : isSelected
                            ? 'bg-primary/20 text-indigo-400'
                            : 'bg-slate-800 text-text-muted'
                      }`}>
                        {grade}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-200">Khối Lớp {grade}</h3>
                        {hasData ? (
                          <span className="inline-block mt-0.5 text-[8px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                            Đã nạp Data thật
                          </span>
                        ) : (
                          <span className="inline-block mt-0.5 text-[8px] font-black uppercase tracking-wider text-text-muted bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            Bản thô / Chờ duyệt
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded bg-primary-light hover:bg-primary/20 border border-indigo-500/20 text-indigo-400 transition-all shadow-[0_2px_0_rgba(99,102,241,0.2)] active:translate-y-[2px] active:shadow-none" title="Thêm bài học">
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
                  {isSelected && hasData && curriculumData[`l${grade}`] && (
                    <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-800/60 space-y-2 mb-2">
                      {curriculumData[`l${grade}`].flatMap((unit: any) => unit.lessons || []).map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center justify-between p-2.5 rounded-[var(--radius-card)] bg-[#090D16]/80 border border-slate-800/40 group/lesson transition-all hover:border-slate-700/50">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-[11px] font-bold text-slate-300 truncate">{lesson.title}</span>
                            <span className="text-[9px] text-text-muted uppercase tracking-widest font-mono mt-0.5">{lesson.type}</span>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteLesson(grade, lesson.id, e)}
                            className="p-1.5 rounded-[var(--radius-btn)] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 opacity-0 group-hover/lesson:opacity-100 transition-all active:scale-95"
                            title="Xóa bài học này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {curriculumData[`l${grade}`].flatMap((u: any) => u.lessons || []).length === 0 && (
                        <div className="text-[10px] text-text-muted italic p-2">Chưa có bài học nào.</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* KHO ĐÓNG GÓP CỦA GIÁO VIÊN */}
            <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-slate-800/60">
              <div 
                onClick={() => setIngestGrade('contributions')}
                className={`flex items-center justify-between p-3 rounded-[var(--radius-card)] border transition-all group cursor-pointer ${
                  ingestGrade === 'contributions'
                    ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                    : "border-amber-500/20 bg-[#090D16]/50 hover:bg-[#090D16] hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[var(--radius-btn)] flex items-center justify-center font-black text-xs transition-colors bg-amber-500/20 text-amber-400`}>
                    GV
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300">Kho đóng góp của Giáo viên</h3>
                    {curriculumData['contributions'] && curriculumData['contributions'][0]?.lessons?.length > 0 ? (
                      <span className="inline-block mt-0.5 text-[8px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {curriculumData['contributions'][0].lessons.length} Bài chờ duyệt
                      </span>
                    ) : (
                      <span className="inline-block mt-0.5 text-[8px] font-black uppercase tracking-wider text-text-muted bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        Trống
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {ingestGrade === 'contributions' && curriculumData['contributions'] && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-amber-500/30 space-y-2 mb-2">
                  {curriculumData['contributions'][0]?.lessons?.map((lesson: any) => (
                    <div key={lesson.id} className="flex flex-col gap-2 p-3 rounded-[var(--radius-card)] bg-[#090D16]/80 border border-slate-800/40 group/lesson transition-all hover:border-amber-500/30">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-[11px] font-bold text-amber-300 truncate">{lesson.title}</span>
                          <span className="text-[9px] text-amber-500/60 uppercase tracking-widest font-mono mt-0.5">{lesson.type} - {lesson.status}</span>
                        </div>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            if(window.confirm("Duyệt bài này làm nguồn giáo trình? Nó sẽ được thêm vào kho chung sau đó xóa khỏi hàng đợi.")) {
                              // Chuyển bài học vào Lớp 6 (hoặc lớp mà Admin chọn, demo chọn l6)
                              // Xóa khỏi hàng đợi
                              const newConts = { ...curriculumData['contributions'][0] };
                              newConts.lessons = newConts.lessons.filter((l:any) => l.id !== lesson.id);
                              await supabase.from('curriculums').upsert({ grade_level: 'contributions', content: [newConts] });
                              
                              setCurriculumData(prev => ({
                                ...prev,
                                'contributions': [newConts]
                              }));
                              alert("Đã duyệt thành công! Bài học có thể được đưa vào giáo trình chính thức.");
                            }
                          }}
                          className="px-2 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-400 text-[9px] font-bold uppercase transition-all"
                        >
                          Duyệt
                        </button>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono bg-black/40 p-2 rounded max-h-20 overflow-y-auto">
                         {JSON.stringify(lesson.quizQuestions || lesson.expectedText || lesson, null, 1)}
                      </div>
                    </div>
                  ))}
                  {(!curriculumData['contributions'][0]?.lessons || curriculumData['contributions'][0]?.lessons.length === 0) && (
                    <div className="text-[10px] text-text-muted italic p-2">Chưa có bài đóng góp nào.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BENTO CARD #3: CỬA SỔ NẠP DATA */}
        <div className="rounded-[var(--radius-card)] bg-[#111827] border border-slate-800 p-6 flex flex-col space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <Rocket className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
            <h2 className="text-sm font-black uppercase tracking-wider">Trình Nạp Dữ Liệu AI Cấp Tốc</h2>
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">
                  Khối Lớp
                </label>
                <select 
                  value={ingestGrade}
                  onChange={(e) => setIngestGrade(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 text-slate-200 text-xs rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      Lớp {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">
                  Loại dữ liệu nạp
                </label>
                <select 
                  value={ingestType}
                  onChange={(e) => setIngestType(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 text-slate-200 text-xs rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                >
                  <option value="speaking">Bài tập Speaking (Hội thoại)</option>
                  <option value="dictation">Bài tập Dictation (Điền từ)</option>
                  <option value="quiz">Bài tập Quiz (Trắc nghiệm JSON)</option>
                </select>
              </div>
            </div>

            <div className="flex-1 flex flex-col space-y-2 relative min-h-[300px]">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 flex items-center justify-between">
                <span>Nội dung thô (Raw Data)</span>
                <span className="text-indigo-400 bg-primary-light px-1.5 py-0.5 rounded text-[8px]">Auto-Seeding</span>
              </label>
              <textarea
                value={ingestData}
                onChange={(e) => setIngestData(e.target.value)}
                placeholder="Dán cấu trúc JSON hoặc đoạn văn bản chứa ngoặc vuông [ ] vào đây để hệ thống tự động Seeding..."
                className="flex-1 w-full bg-[#090D16] border border-slate-700 text-slate-300 text-xs rounded-[var(--radius-card)] p-4 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none custom-scrollbar font-mono leading-relaxed placeholder:text-text-body"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[9px] text-text-muted bg-[#111827] px-2 py-1 rounded-md border border-slate-800">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>Format: JSON / Plain Text</span>
              </div>
            </div>

            <button
              onClick={handleBulkIngestion}
              disabled={isIngesting || !ingestData.trim()}
              className="w-full py-4 rounded-[var(--radius-card)] bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-black uppercase tracking-wider shadow-[0_6px_0_#831843] hover:shadow-[0_3px_0_#831843] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_6px_0_#831843] disabled:active:translate-y-0 mt-4"
            >
              {isIngesting ? "Đang xử lý đồng bộ..." : "Kích Hoạt Đồng Bộ Toàn Hệ Thống"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
