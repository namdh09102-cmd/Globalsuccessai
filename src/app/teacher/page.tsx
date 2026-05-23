"use client";

import React, { useState, useEffect } from "react";
import { 
  School, 
  Users, 
  ClipboardList, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Award, 
  Trophy,
  ArrowRight,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ClassItem {
  id: string;
  name: string;
  studentsCount: number;
  code: string;
  progress: number;
}

interface StudentTrackerItem {
  name: string;
  streak: number;
  accuracy: number;
  lastLesson: string;
  isCurrentUser?: boolean;
}

export default function TeacherPortal() {
  // 1. Quản lý lớp học
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("12");
  const [selectedClassId, setSelectedClassId] = useState<string>("class-1");
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);

  // 2. Đồng bộ dữ liệu học sinh Khánh Tân
  const [khanhTanStats, setKhanhTanStats] = useState({
    streak: 5,
    accuracy: 83,
    lastLesson: "Unit 2: Speaking - Relationships"
  });

  // 3. Quản lý form giao bài tập
  const [assignForm, setAssignForm] = useState({
    classId: "class-1",
    lesson: "Unit 1: Dictation - Health & Fitness",
    deadline: "Ngày mai (23:59)"
  });

  // Trạng thái Toast thông báo giao bài thành công
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Load danh sách lớp từ localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem("gsa-teacher-classes");
    const defaultClasses = [
      { id: "class-1", name: "Lớp 11A1", studentsCount: 45, code: "GS-11A1", progress: 78 },
      { id: "class-2", name: "Lớp 6A2", studentsCount: 38, code: "GS-6A2", progress: 62 }
    ];
    if (savedClasses) {
      try {
        setClasses(JSON.parse(savedClasses));
      } catch (e) {
        setClasses(defaultClasses);
      }
    } else {
      setClasses(defaultClasses);
    }
  }, []);

  // Load dữ liệu động của Khánh Tân từ localStorage
  useEffect(() => {
    const syncKhanhTanData = () => {
      // Streak
      const storedStats = localStorage.getItem("gsa-student-stats");
      let streak = 5;
      if (storedStats) {
        try {
          const parsed = JSON.parse(storedStats);
          streak = parsed.streak ?? 5;
        } catch (e) {}
      }

      // Điểm phát âm TB
      const storedAccuracy = localStorage.getItem("gsa-pronunciation-accuracy");
      let accuracy = 83;
      if (storedAccuracy) {
        const parsed = parseInt(storedAccuracy, 10);
        if (!isNaN(parsed)) accuracy = parsed;
      }

      // Bài học gần nhất
      const storedLogs = localStorage.getItem("gsa-learning-logs");
      let lastLesson = "Unit 2: Speaking - Relationships";
      if (storedLogs) {
        try {
          const logs = JSON.parse(storedLogs);
          if (logs.length > 0) {
            lastLesson = logs[0].lessonTitle || "Unit 2: Speaking - Relationships";
          }
        } catch (e) {}
      }

      setKhanhTanStats({ streak, accuracy, lastLesson });
    };

    syncKhanhTanData();
    window.addEventListener("stats-updated", syncKhanhTanData);
    return () => {
      window.removeEventListener("stats-updated", syncKhanhTanData);
    };
  }, []);

  // Sync class ID với assignForm khi đổi lớp chọn bên ngoài
  useEffect(() => {
    // Tự động đổi bài học mẫu tương ứng với khối lớp
    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (selectedClass) {
      const defaultLesson = selectedClass.name.includes("11") 
        ? "Unit 1: Dictation - Health & Fitness"
        : "Unit 1: Speaking - My New School";
      setAssignForm(prev => ({
        ...prev,
        classId: selectedClassId,
        lesson: defaultLesson
      }));
    }
  }, [selectedClassId, classes]);

  // Xử lý sao chép Mã lớp học
  const handleCopyCode = (code: string, classId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedClassId(classId);
    setTimeout(() => setCopiedClassId(null), 2000);
  };

  // Danh sách học sinh tương ứng với từng lớp
  const getStudentsList = (): StudentTrackerItem[] => {
    if (selectedClassId === "class-1") {
      return [
        { name: "Khánh Tân", streak: khanhTanStats.streak, accuracy: khanhTanStats.accuracy, lastLesson: khanhTanStats.lastLesson, isCurrentUser: true }
      ];
    } else {
      return [];
    }
  };

  // Xác định trạng thái của học sinh
  const getStudentStatus = (item: StudentTrackerItem) => {
    if (item.accuracy < 70 || item.streak <= 2) {
      return { label: "Cần hỗ trợ", color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: AlertTriangle };
    } else if (item.accuracy >= 90) {
      return { label: "Xuất sắc", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: Trophy };
    } else {
      return { label: "Ổn định", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: UserCheck };
    }
  };

  // Kho bài học tương ứng cho dropdown giao bài
  const getLessonsList = () => {
    const selectedClass = classes.find(c => c.id === assignForm.classId);
    if (selectedClass && selectedClass.name.includes("11")) {
      return [
        "Unit 1: Speaking - A Long and Healthy Life",
        "Unit 1: Dictation - Health & Fitness",
        "Unit 1: Quiz - Modal Verbs",
        "Unit 2: Speaking - Relationships",
        "Unit 2: Dictation - Family Conflict"
      ];
    } else {
      return [
        "Unit 1: Vocabulary - My New School",
        "Unit 1: Speaking - Introducing Myself",
        "Unit 1: Dictation - School Friends",
        "Unit 1: Quiz - Present Simple"
      ];
    }
  };

  // Xử lý Giao bài tập (Lưu vào localStorage)
  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find(c => c.id === assignForm.classId);
    if (targetClass) {
      const newAssignment = {
        id: Date.now().toString(),
        className: targetClass.name,
        ...assignForm
      };
      
      const existing = localStorage.getItem("gsa-assignments");
      let assignments = [];
      if (existing) {
        try { assignments = JSON.parse(existing); } catch (e) {}
      }
      assignments.push(newAssignment);
      localStorage.setItem("gsa-assignments", JSON.stringify(assignments));

      setToastMessage(`Nhiệm vụ đã được phát động! Học sinh thuộc lớp này sẽ nhận được yêu cầu làm bài khi đăng nhập.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  // Xử lý tạo lớp học mới
  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // Sinh mã ngẫu nhiên GS-XXXX
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `GS-${randomChars}`;
    const newId = `class-${Date.now()}`;
    const newClass: ClassItem = {
      id: newId,
      name: newClassName.trim(),
      studentsCount: 0,
      code: newCode,
      progress: 0
    };
    
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    localStorage.setItem("gsa-teacher-classes", JSON.stringify(updatedClasses));
    
    setIsCreateClassModalOpen(false);
    setNewClassName("");
    setNewClassGrade("12");

    setToastMessage(`Đã tạo lớp thành công! Mã vào lớp của bạn là ${newCode}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

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
  } as const;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 select-none relative">
      
      {/* Toast thông báo thành công */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-55 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center gap-2 border border-emerald-400/35"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Header lớn */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1 font-mono">
            <School className="w-3.5 h-3.5" />
            <span>Teacher Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-500 tracking-tight">
            Bảng Quản Trị Giáo Viên
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giao nhiệm vụ SGK nhanh, giám sát điểm số phát âm AI và theo dõi streak chuyên chuyên cần của học sinh.
          </p>
        </div>

        {/* Nút Refresh dữ liệu nhanh */}
        <button 
          onClick={() => {
            setToastMessage("Đã làm mới dữ liệu học bạ lớp học!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }}
          className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bento Grid layout Giáo viên */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        
        {/* ================= CỘT TRÁI (LỚN - 2 Cột) ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PHÂN HỆ 1: QUẢN LÝ LỚP HỌC (Classroom Center - Bento Card #1) */}
          <motion.div 
            variants={cardVariants}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl relative overflow-hidden group hover:border-slate-300/80 transition-all duration-300"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <School className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Danh Sách Lớp Học Quản Lý</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Bấm vào lớp để theo dõi chi tiết học sinh</p>
                </div>
              </div>

              {/* Nút Tạo lớp học mới 3D */}
              <button 
                onClick={() => setIsCreateClassModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-slate-800 font-black text-[10px] uppercase tracking-wider transition-all duration-100 shadow-[0_3px_0_#312e81] active:translate-y-[3px] active:shadow-none"
              >
                [+] Tạo Lớp Mới
              </button>
            </div>

            {/* Grid danh sách lớp học */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.map((cls) => {
                const isSelected = selectedClassId === cls.id;
                const isCopied = copiedClassId === cls.id;

                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden select-none ${
                      isSelected
                        ? "bg-gradient-to-b from-indigo-950/20 to-indigo-900/10 border-indigo-500/75 shadow-[0_8px_24px_rgba(99,102,241,0.15)] scale-[1.01]"
                        : "bg-[#0b0f19]/40 border-slate-200 hover:border-slate-300/60 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block font-mono mb-1">
                          Global Success
                        </span>
                        <h4 className="text-base font-extrabold text-slate-800">{cls.name}</h4>
                      </div>
                      
                      {/* Badge sĩ số */}
                      <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black bg-slate-100 border border-slate-200 text-slate-500">
                        {cls.studentsCount} Học sinh
                      </span>
                    </div>

                    {/* Class Code & Copy Button */}
                    <div className="mt-4 flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#0b0f19]/80 border border-slate-900 z-10 relative">
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        Code: {cls.code}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click ngoài
                          handleCopyCode(cls.code, cls.id);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          isCopied ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-100 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Progress Bar tiến độ lớp */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-500">Tiến độ trung bình</span>
                        <span className="text-indigo-400 font-black">{cls.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-900/40 p-0.5">
                        <div
                          style={{ width: `${cls.progress}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-indigo-550 to-violet-550 shadow-md shadow-indigo-650/30"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </motion.div>

          {/* PHÂN HỆ 2: BẢNG THEO DÕI HỌC SINH CHI TIẾT (Student Tracker Table - Bento Card #2) */}
          <motion.div 
            variants={cardVariants}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl relative overflow-hidden group hover:border-slate-300/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Bảng Học Học Viên Lớp: {classes.find(c => c.id === selectedClassId)?.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Giám sát chất lượng học và chỉ số thực tế</p>
                </div>
              </div>
              
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 uppercase">
                Đồng bộ Offline
              </span>
            </div>

            {/* Table bảng học sinh tối giản kính mờ */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="pb-3 pl-2">Học Sinh</th>
                    <th className="pb-3 text-center">Streak</th>
                    <th className="pb-3 text-center">Phát Âm TB</th>
                    <th className="pb-3">Bài Học Gần Nhất</th>
                    <th className="pb-3 text-right pr-2">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-slate-400 divide-y divide-slate-200">
                  {getStudentsList().map((student, idx) => {
                    const status = getStudentStatus(student);
                    const StatusIcon = status.icon;

                    return (
                      <tr 
                        key={idx}
                        className={`hover:bg-slate-100 transition-colors ${
                          student.isCurrentUser 
                            ? "bg-violet-950/20 text-slate-800 border-l-2 border-violet-500" 
                            : ""
                        }`}
                      >
                        {/* Tên học sinh */}
                        <td className="py-3.5 pl-2 font-bold flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shadow-inner ${
                            student.isCurrentUser
                              ? "bg-violet-500/20 border border-violet-500/30 text-violet-400"
                              : "bg-slate-100 border border-slate-200 text-slate-500"
                          }`}>
                            {student.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span>{student.name}</span>
                            {student.isCurrentUser && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-violet-600/25 text-violet-400 border border-violet-500/30 tracking-wider font-mono">
                                Bạn
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Streak */}
                        <td className="py-3.5 text-center font-mono font-bold text-amber-500">
                          {student.streak} ngày 🔥
                        </td>

                        {/* Phát âm TB */}
                        <td className="py-3.5 text-center font-mono font-bold text-violet-400">
                          {student.accuracy}%
                        </td>

                        {/* Bài học gần nhất */}
                        <td className="py-3.5 text-slate-500 font-medium max-w-[180px] truncate">
                          {student.lastLesson}
                        </td>

                        {/* Trạng thái hành động */}
                        <td className="py-3.5 text-right pr-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${status.color}`}>
                            <StatusIcon className="w-2.5 h-2.5" />
                            <span>{status.label}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </motion.div>

        </div>

        {/* ================= CỘT PHẢI (NHỎ - 1 Cột) ================= */}
        <div className="space-y-6">
          
          {/* PHÂN HỆ 3: TRUNG TÂM GIAO BÀI TẬP (Assignment Builder - Bento Card #3) */}
          <motion.div 
            variants={cardVariants}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl relative overflow-hidden group hover:border-slate-300/80 transition-all duration-300"
          >
            {/* Ambient Glow */}
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
              <ClipboardList className="w-4.5 h-4.5 text-slate-500" />
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Trung Tâm Giao Bài Tập
              </h3>
            </div>

            {/* Form Giao bài tập */}
            <form onSubmit={handleAssignTask} className="space-y-4 relative z-10">
              
              {/* Field 1: Chọn lớp học */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                  1. Chọn lớp học
                </label>
                <select
                  value={assignForm.classId}
                  onChange={(e) => setAssignForm({ ...assignForm, classId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id} className="bg-white">
                      {cls.name} ({cls.studentsCount} HS)
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Chọn bài học trong kho SGK */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                  2. Chọn bài tập SGK
                </label>
                <select
                  value={assignForm.lesson}
                  onChange={(e) => setAssignForm({ ...assignForm, lesson: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                >
                  {getLessonsList().map((les, idx) => (
                    <option key={idx} value={les} className="bg-white">
                      {les}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Chọn hạn chót */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                  3. Thời hạn hoàn thành
                </label>
                <select
                  value={assignForm.deadline}
                  onChange={(e) => setAssignForm({ ...assignForm, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                >
                  <option value="Ngày mai (23:59)" className="bg-white">Ngày mai (23:59)</option>
                  <option value="Cuối tuần này (Chủ Nhật)" className="bg-white">Cuối tuần này (Chủ Nhật)</option>
                  <option value="Tuần sau (7 ngày nữa)" className="bg-white">Tuần sau (7 ngày nữa)</option>
                </select>
              </div>

              {/* Nút bấm Phát động nhiệm vụ màu Xanh Emerald */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-555 text-slate-800 font-black text-xs transition-all duration-100 flex items-center justify-center gap-1.5 shadow-[0_4px_0_#064e3b] active:translate-y-[4px] active:shadow-none select-none"
              >
                <Send className="w-3.5 h-3.5 fill-white/10" />
                <span>Phát Động Nhiệm Vụ</span>
              </button>

            </form>
          </motion.div>

          {/* Quick Helper Tips Card dành cho GV */}
          <motion.div
            variants={cardVariants}
            className="rounded-3xl border border-slate-200 bg-gradient-to-b from-indigo-50 to-purple-50 p-5 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-650/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 text-violet-400">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h4 className="text-xs font-black uppercase tracking-wider">Hỗ Trợ AI Giảng Dạy</h4>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Bạn có thể dễ dàng kiểm soát các học sinh có cảnh báo ⚠️ **"Cần hỗ trợ"**. Hệ thống AI tự động đề xuất bài học bổ trợ phù hợp cho từng học sinh dựa trên lỗi sai ngữ điệu trong bài luyện phát âm offline của các em.
            </p>
          </motion.div>

        </div>

      </motion.div>

      {/* Modal Tạo Lớp Học Mới (Glassmorphism) */}
      <AnimatePresence>
        {isCreateClassModalOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateClassModalOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
            />
            {/* Modal Box */}
            <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 20 }}
                className="pointer-events-auto w-full max-w-md bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-[60px] pointer-events-none" />
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h2 className="text-lg font-black text-slate-800">Khởi Tạo Lớp Học Mới</h2>
                    <button
                      onClick={() => setIsCreateClassModalOpen(false)}
                      className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleCreateClassSubmit} className="space-y-4 relative z-10">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                        Tên lớp học
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Lớp 12 Cận Chuyên"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white text-sm font-bold text-slate-800 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition-all placeholder:text-slate-600"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                        Chọn khối lớp
                      </label>
                      <select
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white text-sm font-bold text-slate-800 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition-all"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i+1} value={i+1} className="bg-white">Lớp {i+1}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-slate-800 font-black text-sm transition-all shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none"
                    >
                      Khởi tạo lớp học
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
