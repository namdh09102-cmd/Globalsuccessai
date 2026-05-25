"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { 
  LayoutDashboard, Sparkles, Gamepad2, Users, BarChart3, Award, Calendar, 
  BookOpen, Tv, Clock, ArrowUp, ArrowDown, Send, FileOutput, Settings,
  Rocket, Zap, Crown, Landmark, RotateCcw, Play, Pause, Eye, QrCode, ArrowLeft, PlayCircle, Search, CheckCircle2,
  Edit3, Save, Upload, X, Image as ImageIcon, Video, Paperclip, Loader2, Library, Presentation, Plus
} from "lucide-react";
import Link from "next/link";

type TabType = "overview" | "lesson" | "library" | "game" | "students" | "reports" | "rewards" | "schedule" | "settings";
type GameType = "race" | "quick" | "king" | "castle" | "team" | "spin";

interface TeacherClass {
  id: string;
  name: string;
  code: string;
}

const MOCK_STUDENTS: any[] = [];

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
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [libraryLessons, setLibraryLessons] = useState<any[]>([]);
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [savingLesson, setSavingLesson] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingMedia(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lesson_resources')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('lesson_resources').getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        const newResource = {
          name: file.name,
          url: data.publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document'
        };
        
        setAiOutput((prev: any) => ({
          ...prev,
          resources: [...(prev?.resources || []), newResource]
        }));
        setShowToast("Tải lên thành công!");
        setTimeout(() => setShowToast(""), 3000);
      }
    } catch (error: any) {
      alert("Lỗi tải lên: " + error.message + " (Vui lòng đảm bảo bạn đã tạo bucket public tên 'lesson_resources' trên Supabase)");
    } finally {
      setUploadingMedia(false);
      e.target.value = ''; // reset input
    }
  };

  // Rewards State
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [rewardHistory, setRewardHistory] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [rewardType, setRewardType] = useState<"xp"|"diamond"|"badge">("xp");
  const [rewardAmount, setRewardAmount] = useState<string>("");
  const [rewardBadge, setRewardBadge] = useState<string>("Chiến thần Giao tiếp");
  const [rewardReason, setRewardReason] = useState<string>("");
  const [searchStudent, setSearchStudent] = useState("");
  const [showToast, setShowToast] = useState("");

  // Schedule State
  const [scheduleSessions, setScheduleSessions] = useState<any[]>([]);
  const [scheduleView, setScheduleView] = useState<"week"|"month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedClass, setSchedClass] = useState("7A3");
  const [schedUnit, setSchedUnit] = useState("Unit 1: Hobbies");
  const [schedDate, setSchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedStartTime, setSchedStartTime] = useState("08:00");
  const [schedEndTime, setSchedEndTime] = useState("08:45");
  const [schedNotes, setSchedNotes] = useState("");

  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");

  const [teacherProfile, setTeacherProfile] = useState({
    name: "Cô Ngọc Thảo",
    school: "THCS Ngô Sĩ Liên",
    phone: "0987654321",
    grades: "Tiếng Anh · Lớp 6–9"
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      let teacherId = user?.id;
      
      let classesQuery = supabase.from('classes').select('*');
      if (teacherId) {
        classesQuery = classesQuery.eq('teacher_id', teacherId);
      }
      
      const { data: classesData } = await classesQuery;
      
      if (classesData && classesData.length > 0) {
        setClasses(classesData);
        setSelectedClassId(classesData[0].id);
      }

      // Fetch teacher lessons
      let lessonsQuery = supabase.from('teacher_lessons').select('*').order('created_at', { ascending: false });
      if (teacherId) {
        lessonsQuery = lessonsQuery.eq('teacher_id', teacherId);
      }
      const { data: lessonsData } = await lessonsQuery;
      if (lessonsData) {
        setLibraryLessons(lessonsData);
      }

      // Teacher profile sync if we want, ignoring for now since it's just static text in UI
      const tProfile = localStorage.getItem("gsa-teacher-profile");
      if (tProfile) {
        try { setTeacherProfile(JSON.parse(tProfile)); } catch(e){}
      }

      // Fetch students for the first class, or all class members
      // Wait, class_members join profiles is complex, we will just fetch profiles
      // Actually let's fetch all student_stats and profiles to mock students for the class
      const { data: profilesData } = await supabase.from('profiles').select('*').eq('role', 'student');
      const { data: statsData } = await supabase.from('student_stats').select('*');
      
      if (profilesData) {
        const studentList = profilesData.map(p => {
          const stat = statsData?.find(s => s.user_id === p.id) || {};
          return {
            id: p.id,
            classId: classesData?.[0]?.id || '1',
            name: p.full_name || p.email?.split('@')[0] || "Student",
            init: (p.full_name || p.email || "S").substring(0, 2).toUpperCase(),
            xp: stat.total_xp || 0,
            speak: 85,
            listen: 80,
            read: 90,
            active: 'Vừa xong',
            status: 'teal'
          };
        });
        setStudents(studentList);
      }

      const hist = localStorage.getItem("gsa-rewards-history");
      if (hist) {
        try { setRewardHistory(JSON.parse(hist)); } catch(e){}
      }
      const sched = localStorage.getItem("gsa-teaching-sessions");
      if (sched) {
        try { setScheduleSessions(JSON.parse(sched)); } catch(e){}
      }
    };
    
    fetchData();
  }, []);

  const handleGiveReward = () => {
    if (selectedStudents.length === 0) {
      alert("Vui lòng chọn ít nhất 1 học sinh.");
      return;
    }
    if (rewardType === "xp" || rewardType === "diamond") {
      if (!rewardAmount || isNaN(Number(rewardAmount))) {
        alert("Vui lòng nhập số lượng hợp lệ.");
        return;
      }
    }

    const amount = Number(rewardAmount);
    
    // Update students
    const updated = students.map(s => {
      if (selectedStudents.includes(s.id)) {
        if (rewardType === "xp") return { ...s, xp: s.xp + amount };
      }
      return s;
    });
    setStudents(updated);
    localStorage.setItem("gsa-teacher-students", JSON.stringify(updated));

    // Update History
    const selectedNames = updated.filter(s => selectedStudents.includes(s.id)).map(s => s.name).join(", ");
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      studentNames: selectedNames,
      type: rewardType,
      amount: rewardType === "badge" ? rewardBadge : amount,
      reason: rewardReason || "Không có lý do"
    };

    const newHistory = [newRecord, ...rewardHistory].slice(0, 20);
    setRewardHistory(newHistory);
    localStorage.setItem("gsa-rewards-history", JSON.stringify(newHistory));

    setShowToast(`Đã trao thưởng cho ${selectedStudents.length} học sinh!`);
    setTimeout(() => setShowToast(""), 3000);

    // Reset form
    setSelectedStudents([]);
    setRewardAmount("");
    setRewardReason("");
  };

  const handleSaveSchedule = () => {
    if (!schedClass || !schedUnit || !schedDate || !schedStartTime || !schedEndTime) {
      alert("Vui lòng điền đủ thông tin.");
      return;
    }
    const newSession = {
      id: Date.now().toString(),
      class_id: schedClass,
      unit_id: schedUnit,
      date: schedDate,
      start_time: schedStartTime,
      end_time: schedEndTime,
      notes: schedNotes
    };
    const newSessions = [...scheduleSessions, newSession];
    setScheduleSessions(newSessions);
    localStorage.setItem("gsa-teaching-sessions", JSON.stringify(newSessions));
    setShowToast("Đã thêm buổi dạy thành công!");
    setTimeout(() => setShowToast(""), 3000);
    setSchedNotes("");
  };

  // Race Game State
  const [isRacing, setIsRacing] = useState(false);
  const [positions, setPositions] = useState([10, 10, 10]); // Team 1, 2, 3
  
  // Realtime State
  const [roomPin, setRoomPin] = useState<string>("");
  const [gameChannel, setGameChannel] = useState<RealtimeChannel | null>(null);
  const [studentCount, setStudentCount] = useState(0);

  const toggleActivity = (act: string) => {
    setActivities(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]);
  };

  const handleSaveToLibrary = async () => {
    if (!aiOutput) return;
    setSavingLesson(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const newLesson = {
        teacher_id: user?.id || null,
        topic,
        grade,
        duration,
        content: aiOutput,
        resources: aiOutput.resources || []
      };

      const { data, error } = await supabase.from('teacher_lessons').insert([newLesson]).select();
      if (error) throw error;

      if (data) {
        setLibraryLessons([data[0], ...libraryLessons]);
        setShowToast("Lưu vào thư viện thành công!");
        setTimeout(() => setShowToast(""), 3000);
      }
    } catch (e: any) {
      alert("Lỗi lưu giáo án: " + e.message);
    } finally {
      setSavingLesson(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setAiOutput(null);
    try {
      let customKey = "";
      const storedKeys = localStorage.getItem("gsa-admin-api-keys");
      if (storedKeys) {
        try {
          const parsed = JSON.parse(storedKeys);
          customKey = parsed.groq || "";
        } catch (e) {}
      }

      const res = await fetch("/api/teacher/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, grade, duration, activities, customKey })
      });
      if (!res.ok) throw new Error("API fail");
      const data = await res.json();
      setAiOutput(data);
    } catch (e) {
      // Fallback if API fails
      alert("Hệ thống hiện tại chưa kết nối đến AI hoặc API Key không hợp lệ. Vui lòng kiểm tra lại cấu hình Groq trong thư mục backend.");
      setAiOutput(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // -------------------------
  // REALTIME ROCKET RACE LOGIC
  // -------------------------

  const createRoom = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomPin(pin);
    
    if (gameChannel) supabase.removeChannel(gameChannel);

    const channel = supabase.channel(`room_${pin}`, {
      config: { broadcast: { ack: false } },
    });

    channel
      .on("broadcast", { event: "student_join" }, (payload) => {
        setStudentCount(c => c + 1);
      })
      .on("broadcast", { event: "answer_correct" }, (payload) => {
        const data = payload.payload;
        // Tăng thanh tiến độ của Team (1, 2, 3)
        setPositions(prev => {
          const newPos = [...prev];
          const teamIdx = data.team - 1;
          if (teamIdx >= 0 && teamIdx <= 2) {
            newPos[teamIdx] = Math.min(newPos[teamIdx] + data.points, 100);
          }
          return newPos;
        });
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setGameChannel(channel);
        }
      });
  };

  useEffect(() => {
    return () => {
      if (gameChannel) supabase.removeChannel(gameChannel);
    };
  }, [gameChannel]);

  const startGame = () => {
    if (!gameChannel) return;
    setIsRacing(true);
    setPositions([10, 10, 10]);
    // Báo cho học sinh bắt đầu
    gameChannel.send({
      type: "broadcast",
      event: "game_start",
    });
  };

  const resetRace = () => {
    setPositions([10, 10, 10]);
    if (gameChannel) {
      gameChannel.send({
        type: "broadcast",
        event: "game_reset",
      });
    }
  };

  const [isTvMode, setIsTvMode] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTvMode) setIsTvMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTvMode]);

  if (presentationMode && aiOutput) {
    const slides = [
      { title: "Mục tiêu bài học", content: aiOutput.objective, type: "text" },
      { title: "Từ vựng chính", content: aiOutput.vocab, type: "vocab" },
      { title: "Khởi động (Warm-up)", content: aiOutput.warmup, type: "text" },
      { title: "Bài Mới (Presentation)", content: aiOutput.presentation, type: "text" },
      { title: "Thực hành (Practice)", content: aiOutput.practice, type: "text" },
      { title: "Vận dụng (Production)", content: aiOutput.production, type: "text" },
      { title: "Tài nguyên đính kèm", content: aiOutput.resources, type: "media" },
      { title: "Game củng cố", content: aiOutput.game, type: "game" }
    ].filter(s => {
      if (s.type === 'media' && (!s.content || s.content.length === 0)) return false;
      return true;
    });

    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    const renderSlideContent = (slide: any) => {
      if (slide.type === 'vocab') {
        return (
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            {slide.content.map((v: string, i: number) => (
              <div key={i} className="bg-white text-teal-700 px-8 py-6 rounded-2xl shadow-xl text-4xl font-bold border-4 border-teal-100 transform transition-transform hover:scale-105">
                {v}
              </div>
            ))}
          </div>
        );
      }
      if (slide.type === 'media') {
        return (
          <div className="grid grid-cols-2 gap-8 mt-8">
            {slide.content.map((res: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100 flex flex-col items-center">
                {res.type === 'image' && <img src={res.url} alt="media" className="w-full h-[300px] object-cover rounded-xl mb-4" />}
                {res.type === 'video' && <video src={res.url} controls className="w-full h-[300px] object-cover rounded-xl mb-4 bg-black" />}
                {res.type === 'document' && <div className="w-full h-[300px] bg-blue-50 rounded-xl flex items-center justify-center mb-4"><FileOutput className="w-24 h-24 text-blue-300" /></div>}
                <div className="text-xl font-bold text-gray-700">{res.name}</div>
              </div>
            ))}
          </div>
        );
      }
      if (slide.type === 'game') {
        return (
          <div className="bg-indigo-50 border-4 border-indigo-200 rounded-3xl p-12 mt-12 text-center">
            <Gamepad2 className="w-24 h-24 text-indigo-400 mx-auto mb-6" />
            <div className="text-3xl text-indigo-900 font-bold leading-relaxed">{slide.content}</div>
          </div>
        );
      }
      return <div className="text-3xl text-gray-700 leading-[1.8] mt-12 bg-white/60 p-10 rounded-3xl backdrop-blur-sm shadow-sm">{slide.content}</div>;
    };

    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col overflow-hidden text-slate-800 font-sans select-none animate-fade-in-up">
        {/* Presentation Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100">
              <Presentation className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800 uppercase tracking-wide">
                {topic}
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-0.5">{grade} · Tiết học tương tác</p>
            </div>
          </div>
          <button 
            onClick={() => { setPresentationMode(false); setCurrentSlide(0); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
          >
            Đóng [ESC]
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto p-12 relative flex flex-col">
          <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col relative z-10">
            <div className="text-teal-600 font-black text-2xl uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">{currentSlide + 1}</span>
              {slides[currentSlide].title}
            </div>
            {renderSlideContent(slides[currentSlide])}
          </div>
          
          {/* Background decorations */}
          <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-teal-400/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="fixed top-20 left-10 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[80px] pointer-events-none" />
        </div>

        {/* Presentation Footer Controls */}
        <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex items-center justify-between px-12 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="text-gray-500 font-bold">
            Slide {currentSlide + 1} / {slides.length}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={prevSlide} 
              disabled={currentSlide === 0}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <div key={i} className={`h-2.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-teal-500' : 'w-2.5 bg-gray-200'}`} />
              ))}
            </div>
            <button 
              onClick={nextSlide} 
              disabled={currentSlide === slides.length - 1}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-md shadow-teal-500/20"
            >
              <ArrowLeft className="w-6 h-6 text-white rotate-180" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTvMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col overflow-hidden text-white font-sans select-none animate-fade-in-up">
        {/* TV Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
              <Tv className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 uppercase tracking-widest">
                GlobalSuccess AI
              </h1>
              <p className="text-slate-400 font-bold mt-1 text-lg">Chế độ Trình chiếu (Classroom Mode) · Lớp 7A3</p>
            </div>
          </div>
          <button 
            onClick={() => setIsTvMode(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors border border-slate-700"
          >
            Đóng [ESC]
          </button>
        </div>

        {/* TV Content */}
        <div className="flex-1 flex p-8 gap-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />
          
          {/* Left Column: QR & Info */}
          <div className="w-[450px] flex flex-col gap-8 shrink-0 z-10">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-10 flex flex-col items-center justify-center text-center shadow-2xl h-[450px]">
              <div className="w-64 h-64 bg-white rounded-3xl p-4 mb-8 shadow-lg shadow-teal-500/20 relative">
                {/* Fake QR */}
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-3 opacity-80">
                    {Array.from({length: 64}).map((_, i) => (
                      <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-transparent'}`} />
                    ))}
                  </div>
                  <div className="relative w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-2">Mã Phòng / PIN</h2>
              <div className="text-7xl font-black text-white tracking-[0.2em] font-mono drop-shadow-lg">
                {roomPin || "----"}
              </div>
            </div>

            <div className="flex-1 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-8 flex flex-col justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />
              <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-4">Trạng Thái</h3>
              <div className="flex items-end gap-4">
                <span className="text-8xl font-black text-indigo-400 leading-none">{studentCount}</span>
                <span className="text-2xl text-slate-500 font-bold mb-2">Học sinh đã vào</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Feed / Game Render */}
          <div className="flex-1 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-2xl flex flex-col relative z-10 overflow-hidden">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                  <Play className="w-6 h-6 text-rose-400" />
                </div>
                <h2 className="text-3xl font-black text-white">Live: {activeGame === 'race' ? "Đua Tên Lửa" : activeGame === 'quick' ? "Đấu Quick" : "Vua Lớp Học"}</h2>
              </div>
              
              {!isRacing ? (
                <button 
                  onClick={startGame}
                  disabled={!roomPin}
                  className="px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xl uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-teal-500/20"
                >
                  Bắt Đầu Trận
                </button>
              ) : (
                <button 
                  onClick={resetRace}
                  className="px-8 py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xl uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-rose-500/20"
                >
                  Kết Thúc
                </button>
              )}
            </div>

            {/* Game Screen Replica inside TV */}
            <div className="flex-1 rounded-2xl border-4 border-slate-800 bg-slate-950 p-12 flex flex-col justify-center relative">
              {activeGame === 'race' ? (
                <>
                  {/* Race Track XL */}
                  <div className="relative h-[300px] w-full">
                    <div className="absolute left-0 right-0 top-[75px] h-2 bg-slate-800 rounded-full border border-slate-700"></div>
                    <div className="absolute left-0 right-0 top-[150px] h-2 bg-slate-800 rounded-full border border-slate-700"></div>
                    <div className="absolute left-0 right-0 top-[225px] h-2 bg-slate-800 rounded-full border border-slate-700"></div>
                    <div className="absolute right-12 top-0 bottom-0 w-4 border-l-4 border-dashed border-white/20"></div>
                    
                    <div className="absolute text-7xl transition-all ease-linear duration-500" style={{ top: '35px', left: `${positions[0]}%`, transform: 'translateX(-50%)' }}>🚀</div>
                    <div className="absolute text-7xl transition-all ease-linear duration-500" style={{ top: '110px', left: `${positions[1]}%`, transform: 'translateX(-50%)' }}>🛸</div>
                    <div className="absolute text-7xl transition-all ease-linear duration-500" style={{ top: '185px', left: `${positions[2]}%`, transform: 'translateX(-50%)' }}>🚁</div>
                  </div>

                  <div className="flex justify-between gap-8 mt-12">
                    <div className="flex-1 bg-slate-900 rounded-3xl p-8 text-center border-2 border-slate-800">
                      <div className="text-xl text-slate-400 font-bold uppercase tracking-widest mb-4">Đội Tên Lửa</div>
                      <div className="text-6xl font-black text-[#E63946]">{Math.round(positions[0])}%</div>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-3xl p-8 text-center border-2 border-slate-800">
                      <div className="text-xl text-slate-400 font-bold uppercase tracking-widest mb-4">Đội Đĩa Bay</div>
                      <div className="text-6xl font-black text-[#0F6E56]">{Math.round(positions[1])}%</div>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-3xl p-8 text-center border-2 border-slate-800">
                      <div className="text-xl text-slate-400 font-bold uppercase tracking-widest mb-4">Đội Trực Thăng</div>
                      <div className="text-6xl font-black text-[#534AB7]">{Math.round(positions[2])}%</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-500 text-3xl font-bold">
                  Tính năng TV cho game này đang được cấu hình...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#F5F5F2] font-sans overflow-hidden flex">
      <div className="flex w-full h-full bg-white shadow-sm">
        
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
            <div onClick={() => setActiveTab('library')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'library' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Library className="w-4 h-4" /> Thư viện bài giảng
            </div>
            <div onClick={() => setActiveTab('game')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'game' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Gamepad2 className="w-4 h-4" /> Tạo game lớp
            </div>

            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2 mt-2">Học sinh</div>
            <div onClick={() => setActiveTab('students')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'students' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Users className="w-4 h-4" /> Danh sách lớp
            </div>
            <div onClick={() => setActiveTab('reports')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'reports' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <BarChart3 className="w-4 h-4" /> Báo cáo Zalo
            </div>
            <div onClick={() => setActiveTab('rewards')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'rewards' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Award className="w-4 h-4" /> Trao thưởng
            </div>

            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2 mt-2">Cài đặt</div>
            <div onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'schedule' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Calendar className="w-4 h-4" /> Lịch dạy
            </div>
            <div onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${activeTab === 'settings' ? 'bg-[#FAECE7] text-[#E63946]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Settings className="w-4 h-4" /> Tài khoản
            </div>
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium mt-2">
              <PlayCircle className="w-4 h-4" /> Trải nghiệm Học sinh
            </Link>
          </div>

          <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center text-[12px] font-bold shrink-0">NT</div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-gray-800 truncate">{teacherProfile.name}</div>
              <div className="text-[11px] text-gray-500 truncate">{teacherProfile.grades}</div>
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
                {activeTab === 'library' && "Thư viện bài giảng"}
                {activeTab === 'game' && "Tạo game cho lớp"}
                {activeTab === 'students' && "Danh sách học sinh"}
                {activeTab === 'reports' && "Báo cáo tiến độ Zalo"}
                {activeTab === 'rewards' && "Trao thưởng cho học sinh"}
                {activeTab === 'schedule' && "Quản lý Lịch dạy"}
                {activeTab === 'settings' && "Thiết lập tài khoản"}
              </h2>
              <p className="text-[12px] text-gray-500 mt-0.5">
                {activeTab === 'overview' && "Thông tin chung và tiến độ học tập của lớp"}
                {activeTab === 'lesson' && "Nhập chủ đề — AI tạo giáo án hoàn chỉnh trong 10 giây"}
                {activeTab === 'library' && "Lưu trữ và tái sử dụng các giáo án AI đã soạn"}
                {activeTab === 'game' && "Chọn game, cấu hình và chiếu thẳng lên bảng TV"}
                {activeTab === 'students' && "Theo dõi tiến độ từng em, giao bài và gửi báo cáo"}
                {activeTab === 'reports' && "Gửi báo cáo tiến độ học tập hàng tuần tới phụ huynh qua Zalo ZNS"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[12px] text-gray-500 flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" /> Lớp 7A3 · 32 HS
              </div>
              <button 
                onClick={() => setIsTvMode(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 border-teal-500 bg-teal-50 hover:bg-teal-100 text-[12px] font-bold text-teal-700 transition-colors shadow-sm"
              >
                <Tv className="w-4 h-4" /> Chiếu TV
              </button>
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
                        <div className="flex items-center gap-2">
                          {isEditingLesson ? (
                            <button onClick={() => setIsEditingLesson(false)} className="text-[11px] text-white bg-green-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-green-700 transition-colors">
                              <Save className="w-3.5 h-3.5" /> Lưu
                            </button>
                          ) : (
                            <button onClick={() => setIsEditingLesson(true)} className="text-[11px] text-gray-600 bg-gray-200 px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-300 transition-colors">
                              <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                            </button>
                          )}
                          <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{grade} · {duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto relative">
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mục tiêu bài học</div>
                          {isEditingLesson ? (
                            <textarea className="w-full text-[13px] text-gray-800 p-3 border rounded-lg outline-none focus:border-[#0F6E56] min-h-[100px] resize-y leading-relaxed" value={aiOutput.objective} onChange={e => setAiOutput({...aiOutput, objective: e.target.value})} />
                          ) : (
                            <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.objective}</div>
                          )}
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Từ vựng chính</div>
                          <div className="flex flex-wrap gap-2 items-center">
                            {aiOutput.vocab.map((v:string, i:number) => (
                              isEditingLesson ? 
                                <div key={i} className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1">
                                  <input value={v} onChange={e => {
                                    const newVocab = [...aiOutput.vocab];
                                    newVocab[i] = e.target.value;
                                    setAiOutput({...aiOutput, vocab: newVocab});
                                  }} className="text-[12px] w-24 outline-none bg-transparent" />
                                  <button onClick={() => {
                                    const newVocab = [...aiOutput.vocab];
                                    newVocab.splice(i, 1);
                                    setAiOutput({...aiOutput, vocab: newVocab});
                                  }} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3"/></button>
                                </div>
                                : <span key={i} className="text-[12px] px-2.5 py-1 rounded bg-[#E1F5EE] text-[#0F6E56] font-medium shadow-sm">{v}</span>
                            ))}
                            {isEditingLesson && (
                              <button onClick={() => setAiOutput({...aiOutput, vocab: [...aiOutput.vocab, "Từ mới"]})} className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded border border-teal-200 hover:bg-teal-100 flex items-center gap-1">
                                + Thêm từ
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">1. Khởi động (Warm-up)</div>
                          {isEditingLesson ? (
                            <textarea className="w-full text-[13px] text-gray-800 p-3 border rounded-lg outline-none focus:border-[#0F6E56] min-h-[120px] resize-y leading-relaxed" value={aiOutput.warmup} onChange={e => setAiOutput({...aiOutput, warmup: e.target.value})} />
                          ) : (
                            <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.warmup}</div>
                          )}
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">2. Bài Mới (Presentation)</div>
                          {isEditingLesson ? (
                            <textarea className="w-full text-[13px] text-gray-800 p-3 border rounded-lg outline-none focus:border-[#0F6E56] min-h-[150px] resize-y leading-relaxed" value={aiOutput.presentation} onChange={e => setAiOutput({...aiOutput, presentation: e.target.value})} />
                          ) : (
                            <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.presentation}</div>
                          )}
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">3. Thực hành (Practice)</div>
                          {isEditingLesson ? (
                            <textarea className="w-full text-[13px] text-gray-800 p-3 border rounded-lg outline-none focus:border-[#0F6E56] min-h-[150px] resize-y leading-relaxed" value={aiOutput.practice} onChange={e => setAiOutput({...aiOutput, practice: e.target.value})} />
                          ) : (
                            <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.practice}</div>
                          )}
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">4. Vận dụng (Production)</div>
                          {isEditingLesson ? (
                            <textarea className="w-full text-[13px] text-gray-800 p-3 border rounded-lg outline-none focus:border-[#0F6E56] min-h-[120px] resize-y leading-relaxed" value={aiOutput.production} onChange={e => setAiOutput({...aiOutput, production: e.target.value})} />
                          ) : (
                            <div className="text-[13px] text-gray-800 leading-relaxed">{aiOutput.production}</div>
                          )}
                        </div>
                        <div className="p-4 border-b border-gray-100">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Game củng cố</div>
                          {isEditingLesson ? (
                            <textarea className="w-full text-[13px] text-gray-800 p-3 border rounded-lg outline-none focus:border-[#0F6E56] min-h-[100px] resize-y leading-relaxed" value={aiOutput.game} onChange={e => setAiOutput({...aiOutput, game: e.target.value})} />
                          ) : (
                            <div className="text-[13px] text-gray-800 leading-relaxed bg-[#EEEDFE] text-[#534AB7] p-2 rounded-lg inline-block font-medium">🎮 {aiOutput.game}</div>
                          )}
                        </div>

                        {/* File Upload Section */}
                        <div className="p-4 bg-gray-50/50">
                           <div className="flex items-center justify-between mb-3">
                             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tài nguyên đính kèm</div>
                             <label className="cursor-pointer text-[11px] text-teal-600 bg-teal-50 px-3 py-1 rounded flex items-center gap-1.5 hover:bg-teal-100 transition-colors">
                               {uploadingMedia ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                               {uploadingMedia ? 'Đang tải lên...' : 'Tải lên File/Media'}
                               <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*,.pdf,.doc,.docx" disabled={uploadingMedia} />
                             </label>
                           </div>
                           
                           {aiOutput.resources && aiOutput.resources.length > 0 ? (
                             <div className="grid grid-cols-2 gap-3 mt-3">
                               {aiOutput.resources.map((res: any, idx: number) => (
                                 <div key={idx} className="border border-gray-200 rounded-lg p-2 bg-white flex flex-col gap-2 relative group">
                                   {isEditingLesson && (
                                     <button onClick={() => {
                                       const newResources = [...aiOutput.resources];
                                       newResources.splice(idx, 1);
                                       setAiOutput({...aiOutput, resources: newResources});
                                     }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><X className="w-3 h-3"/></button>
                                   )}
                                   {res.type === 'image' && <img src={res.url} alt="resource" className="w-full h-24 object-cover rounded-md" />}
                                   {res.type === 'video' && <video src={res.url} controls className="w-full h-24 object-cover rounded-md bg-black" />}
                                   {res.type === 'document' && <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"><FileOutput className="w-8 h-8" /></div>}
                                   <div className="text-[10px] text-gray-600 truncate px-1" title={res.name}>{res.name}</div>
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <div className="text-center py-4 text-[11px] text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                               Chưa có tài nguyên nào được đính kèm.
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="p-3 px-4 bg-gray-50 border-t border-gray-200 flex gap-2 shrink-0">
                        <button onClick={() => setPresentationMode(true)} className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-2 rounded-lg text-[12px] font-bold transition-all shadow-md flex items-center justify-center gap-1.5">
                          <Presentation className="w-3.5 h-3.5" /> Bắt đầu Dạy (Chiếu TV)
                        </button>
                        <button onClick={handleSaveToLibrary} disabled={savingLesson} className="flex-1 bg-white border-2 border-[#E63946] text-[#E63946] hover:bg-[#FAECE7] py-2 rounded-lg text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
                          {savingLesson ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          {savingLesson ? 'Đang lưu...' : 'Lưu vào Thư viện'}
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

            {/* LIBRARY TAB */}
            {activeTab === 'library' && (
              <div className="animate-fade-in-up">
                {libraryLessons.length === 0 ? (
                  <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center flex flex-col items-center justify-center">
                    <Library className="w-12 h-12 text-gray-300 mb-3" />
                    <h3 className="text-[14px] font-bold text-gray-700 mb-1">Thư viện trống</h3>
                    <p className="text-[12px] text-gray-500 mb-4">Bạn chưa lưu giáo án nào. Hãy sang phần Soạn giáo án AI để tạo và lưu nhé.</p>
                    <button onClick={() => setActiveTab('lesson')} className="bg-[#E63946] text-white px-4 py-2 rounded-lg text-[12px] font-bold">Soạn giáo án ngay</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {libraryLessons.map((l: any, i: number) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col relative group hover:border-[#E63946] transition-colors">
                        <div className="text-[10px] text-gray-400 mb-1">{new Date(l.created_at).toLocaleDateString('vi-VN')}</div>
                        <h3 className="text-[14px] font-bold text-gray-800 leading-tight mb-2 line-clamp-2">{l.topic}</h3>
                        <div className="text-[11px] text-gray-500 mb-4 flex gap-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{l.grade}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{l.duration}</span>
                        </div>
                        
                        <div className="mt-auto flex gap-2">
                          <button onClick={() => {
                            setTopic(l.topic);
                            setGrade(l.grade);
                            setDuration(l.duration);
                            setAiOutput(l.content);
                            setActiveTab('lesson');
                          }} className="flex-1 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] py-1.5 rounded font-bold text-center transition-colors">
                            Xem / Sửa
                          </button>
                          <button onClick={() => {
                            setTopic(l.topic);
                            setGrade(l.grade);
                            setDuration(l.duration);
                            setAiOutput(l.content);
                            setPresentationMode(true);
                          }} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-[11px] py-1.5 rounded font-bold text-center transition-colors flex justify-center items-center gap-1">
                            <Presentation className="w-3 h-3" /> Dạy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                        <div className="text-[12px] font-bold text-gray-800 flex items-center gap-1.5"><Eye className="w-4 h-4" /> Xem trước (Bấm 'Chiếu TV' để phóng to)</div>
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
                          onClick={isRacing ? resetRace : startGame}
                          className="mt-4 w-full bg-[#E63946] hover:bg-[#c62b37] text-white py-2.5 rounded-lg text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          {isRacing ? <><RotateCcw className="w-4 h-4" /> Kết thúc game</> : <><Play className="w-4 h-4" /> Bắt đầu game</>}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 bg-[#E1F5EE] border border-[#9FE1CB] rounded-xl p-3 px-4 shadow-sm flex flex-col gap-3">
                      {roomPin ? (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse"></span>
                              <span className="text-[13px] font-bold text-[#0F6E56]">PIN: {roomPin} ({studentCount} HS đã vào phòng)</span>
                            </div>
                            <div className="text-[11px] font-bold text-gray-500">Truy cập <span className="text-[#E63946]">globalsuccess.vn/play</span></div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-gray-500">Chưa tạo phòng game</span>
                          <button onClick={createRoom} className="bg-[#0F6E56] text-white px-4 py-1.5 rounded-lg text-[12px] font-bold shadow-sm">Tạo Phòng Chơi</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === 'students' && (
              <div className="animate-fade-in-up flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <select 
                      className="text-[14px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-teal-500"
                      value={selectedClassId}
                      onChange={e => setSelectedClassId(e.target.value)}
                    >
                      {classes.length === 0 && <option value="">Chưa có lớp nào</option>}
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {classes.length > 0 && (
                      <div className="text-[12px] bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-100 font-bold flex items-center gap-2">
                        Mã tham gia: <span className="text-[15px] tracking-widest">{classes.find(c => c.id === selectedClassId)?.code}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddClass(true)} className="bg-white border border-[#E63946] text-[#E63946] px-4 py-1.5 rounded-lg text-[12px] font-bold shadow-sm hover:bg-[#FAECE7] transition-colors">
                      + Tạo lớp học
                    </button>
                    <button onClick={() => {
                        if (!selectedClassId) return alert("Vui lòng tạo lớp học trước");
                        setShowAddStudent(true);
                      }} 
                      className="bg-[#0F6E56] text-white px-4 py-1.5 rounded-lg text-[12px] font-bold shadow-sm hover:bg-[#0c5c48] transition-colors">
                      + Thêm học sinh
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center p-8 text-gray-500 text-sm">
                            Chưa có học sinh nào. Bấm <strong>+ Thêm học sinh</strong> hoặc gửi <strong>Mã tham gia</strong> cho học sinh.
                          </td>
                        </tr>
                      ) : (
                        students.filter(s => s.classId === selectedClassId).map(s => {
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
                                <div className="text-[13px] font-bold text-gray-800 mb-1">{s.xp?.toLocaleString() || 0}</div>
                                <div className="w-16 h-1 bg-gray-100 rounded-full mx-auto overflow-hidden"><div className="h-full bg-[#E63946]" style={{width: `${(s.xp || 0)/4000*100}%`}}></div></div>
                              </td>
                              <td className="p-3 text-center text-[12px] font-bold" style={{color: s.speak >= 80 ? '#3B6D11' : s.speak >= 60 ? '#BA7517' : '#A32D2D'}}>{s.speak || 0}%</td>
                              <td className="p-3 text-center text-[12px] font-bold" style={{color: s.listen >= 80 ? '#3B6D11' : s.listen >= 60 ? '#BA7517' : '#A32D2D'}}>{s.listen || 0}%</td>
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
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

                {showAddClass && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                       <h3 className="text-[16px] font-bold text-gray-800 mb-4">Tạo lớp học mới</h3>
                       <div className="mb-6">
                         <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Tên lớp học</label>
                         <input autoFocus placeholder="VD: 7A3, IELTS Beginner..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                       </div>
                       <div className="flex justify-end gap-2">
                         <button onClick={() => setShowAddClass(false)} className="px-4 py-2 text-[13px] text-gray-500 font-bold hover:bg-gray-50 rounded-lg transition-colors">Hủy</button>
                         <button onClick={async () => {
                           if(!newClassName) return;
                           const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                           const { data: { user } } = await supabase.auth.getUser();
                           
                           const { data, error } = await supabase.from('classes').insert({
                             name: newClassName,
                             code: newCode,
                             teacher_id: user?.id || '00000000-0000-0000-0000-000000000000'
                           }).select();
                           
                           if (data && data.length > 0) {
                             const newList = [...classes, data[0]];
                             setClasses(newList);
                             setSelectedClassId(data[0].id);
                           }
                           setNewClassName("");
                           setShowAddClass(false);
                         }} className="px-4 py-2 text-[13px] bg-[#E63946] text-white rounded-lg font-bold shadow-sm hover:bg-[#c62b37] transition-colors">Khởi tạo</button>
                       </div>
                    </div>
                  </div>
                )}
                {showAddStudent && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                       <h3 className="text-[16px] font-bold text-gray-800 mb-4">Thêm học sinh thủ công</h3>
                       <div className="mb-6">
                         <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Họ và Tên</label>
                         <input autoFocus placeholder="Nhập tên đầy đủ..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} />
                       </div>
                       <div className="flex justify-end gap-2">
                         <button onClick={() => setShowAddStudent(false)} className="px-4 py-2 text-[13px] text-gray-500 font-bold hover:bg-gray-50 rounded-lg transition-colors">Hủy</button>
                         <button onClick={async () => {
                           if(!newStudentName) return;
                           const inits = newStudentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                           
                           const { data, error } = await supabase.from('students').insert({
                             class_id: selectedClassId,
                             name: newStudentName,
                             init: inits,
                             xp: 0,
                             speak: 0,
                             listen: 0,
                             status: 'amber'
                           }).select();

                           if (data) {
                             const newS = { ...data[0], classId: data[0].class_id, active: 'Vừa xong' };
                             const newList = [...students, newS];
                             setStudents(newList);
                             setNewStudentName("");
                             setShowAddStudent(false);
                             setShowToast(`Đã thêm ${newStudentName}!`);
                             setTimeout(() => setShowToast(""), 3000);
                           }
                         }} className="px-4 py-2 text-[13px] bg-[#0F6E56] text-white rounded-lg font-bold shadow-sm hover:bg-[#0c5c48] transition-colors">Lưu lại</button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-gray-500" /> Báo cáo Tuần 3 (Lớp 7A3)</div>
                    <button className="text-[12px] text-[#E63946] font-bold px-3 py-1 bg-[#FAECE7] rounded-lg">28/32 Phụ huynh đã LK</button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-[12px] text-gray-700 leading-relaxed">
                        Hệ thống đã tổng hợp điểm số, số câu hoàn thành và điểm yếu của từng học sinh. Vui lòng kiểm tra lại trước khi gửi hàng loạt qua Zalo.
                      </div>
                    </div>

                    {MOCK_STUDENTS.map(s => (
                      <div key={s.id} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-[#0F6E56] focus:ring-[#0F6E56]" />
                            <span className="text-[13px] font-bold text-gray-800">{s.name}</span>
                          </div>
                          <span className="text-[11px] text-gray-500">PH: 098****123</span>
                        </div>
                        <div className="text-[12px] text-gray-600 bg-gray-50 p-2 rounded">
                          XP Tuần: +450 | Điểm: {((s.speak + s.listen)/2).toFixed(1)}/100 | Nhận xét: Cần cải thiện phát âm âm /th/
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white">
                    <button className="w-full bg-[#0068FF] hover:bg-[#0054cc] text-white py-3 rounded-lg text-[13px] font-bold transition-colors flex items-center justify-center gap-2 shadow-md">
                      <Send className="w-4 h-4" /> Gửi hàng loạt qua Zalo ZNS (28)
                    </button>
                  </div>
                </div>

                {/* Zalo Preview */}
                <div className="flex items-center justify-center p-4">
                  <div className="w-[320px] h-[640px] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10"></div>
                    
                    {/* Zalo Header */}
                    <div className="bg-[#0068FF] pt-12 pb-3 px-4 flex items-center gap-3 text-white">
                      <ArrowLeft className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="text-[15px] font-bold">GlobalSuccess AI</div>
                        <div className="text-[11px] opacity-80">Official Account</div>
                      </div>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 bg-[#E2E8F0] p-4 overflow-y-auto">
                      <div className="text-center text-[10px] text-gray-500 mb-4">14:20 Hôm nay</div>
                      
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-blue-500 to-teal-400 relative">
                          <div className="absolute bottom-3 left-3 text-white">
                            <div className="text-[10px] font-bold opacity-90">BÁO CÁO HỌC TẬP TUẦN 3</div>
                            <div className="text-[16px] font-black">Học sinh: Minh Anh</div>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-[12px] text-gray-500">Điểm số Tuần</span>
                            <span className="text-[14px] font-bold text-[#0F6E56]">9.0/10</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-[12px] text-gray-500">Kinh nghiệm (XP)</span>
                            <span className="text-[13px] font-bold text-[#E63946]">+450 XP (Hạng 2)</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-gray-500 block mb-1">Đánh giá từ AI:</span>
                            <div className="text-[12px] text-gray-800 bg-gray-50 p-2 rounded-lg leading-relaxed">
                              Minh Anh học rất chăm chỉ. Tuy nhiên con cần chú ý luyện tập thêm phần Speaking (phát âm ending sounds).
                            </div>
                          </div>
                          <button className="w-full bg-[#E1F5EE] text-[#0F6E56] font-bold text-[13px] py-2.5 rounded-lg mt-2">
                            Xem chi tiết & Khen thưởng
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* REWARDS TAB */}
            {activeTab === 'rewards' && (
              <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Toast Notification */}
                {showToast && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 animate-bounce z-50">
                    <CheckCircle2 className="w-5 h-5" /> {showToast}
                  </div>
                )}
                
                {/* Cột Trái - Danh sách học sinh */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col max-h-[700px]">
                  <h3 className="text-[15px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" /> Chọn học sinh
                  </h3>
                  <div className="relative mb-4">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm học sinh..." 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2 px-1">
                    <label className="flex items-center gap-2 text-[12px] font-bold text-gray-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                        checked={selectedStudents.length === students.length && students.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedStudents(students.map(s => s.id));
                          else setSelectedStudents([]);
                        }}
                      />
                      Chọn tất cả
                    </label>
                    <div className="text-[12px] text-gray-500">Đã chọn: <span className="font-bold text-teal-600">{selectedStudents.length}</span></div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {students.filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase())).map((student) => (
                      <div 
                        key={student.id} 
                        onClick={() => {
                          if (selectedStudents.includes(student.id)) setSelectedStudents(prev => prev.filter(id => id !== student.id));
                          else setSelectedStudents(prev => [...prev, student.id]);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedStudents.includes(student.id) ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-gray-100 hover:border-teal-300 hover:bg-gray-50'}`}
                      >
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 pointer-events-none"
                          checked={selectedStudents.includes(student.id)}
                          readOnly
                        />
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                          student.status === 'green' ? 'bg-[#E1F5EE] text-[#0F6E56]' : 
                          student.status === 'amber' ? 'bg-[#FAEEDA] text-[#BA7517]' : 
                          'bg-[#FCEBEB] text-[#A32D2D]'
                        }`}>
                          {student.init}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-bold text-gray-800 truncate">{student.name}</div>
                          <div className="text-[11px] text-gray-500">
                            Level {Math.floor(student.xp / 1000) + 1}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[13px] font-bold text-[#BA7517] flex items-center gap-1 justify-end"><Zap className="w-3 h-3" /> {student.xp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cột Phải - Form trao thưởng */}
                <div className="flex flex-col gap-6 max-h-[700px]">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm shrink-0">
                    <h3 className="text-[15px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" /> Thông tin Phần thưởng
                    </h3>
                    
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-5">
                      <button onClick={() => setRewardType('xp')} className={`flex-1 py-2 text-[12px] font-bold rounded-md transition-colors ${rewardType === 'xp' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        + Điểm XP
                      </button>
                      <button onClick={() => setRewardType('diamond')} className={`flex-1 py-2 text-[12px] font-bold rounded-md transition-colors ${rewardType === 'diamond' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        + Kim cương
                      </button>
                      <button onClick={() => setRewardType('badge')} className={`flex-1 py-2 text-[12px] font-bold rounded-md transition-colors ${rewardType === 'badge' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Tặng Huy hiệu
                      </button>
                    </div>

                    {rewardType === 'xp' && (
                      <div className="mb-4 animate-fade-in-up">
                        <label className="block text-[12px] font-bold text-gray-700 mb-2">Số lượng XP</label>
                        <input 
                          type="number" 
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(e.target.value)}
                          placeholder="Nhập số XP..." 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[14px] font-bold text-amber-600 focus:outline-none focus:border-amber-500"
                        />
                        <div className="flex gap-2 mt-2">
                          {[50, 100, 200, 500].map(val => (
                            <button key={val} onClick={() => setRewardAmount(val.toString())} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-bold hover:bg-amber-100">
                              +{val}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {rewardType === 'diamond' && (
                      <div className="mb-4 animate-fade-in-up">
                        <label className="block text-[12px] font-bold text-gray-700 mb-2">Số Kim cương</label>
                        <input 
                          type="number" 
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(e.target.value)}
                          placeholder="Nhập số kim cương..." 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[14px] font-bold text-blue-600 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2 mt-2">
                          {[5, 10, 20, 50].map(val => (
                            <button key={val} onClick={() => setRewardAmount(val.toString())} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-bold hover:bg-blue-100">
                              +{val}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {rewardType === 'badge' && (
                      <div className="mb-4 animate-fade-in-up">
                        <label className="block text-[12px] font-bold text-gray-700 mb-2">Chọn Huy hiệu</label>
                        <select 
                          value={rewardBadge}
                          onChange={(e) => setRewardBadge(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-bold text-purple-700 focus:outline-none focus:border-purple-500"
                        >
                          {["Chiến thần Giao tiếp", "Vua Từ vựng", "Chuyên gia Ngữ pháp", "Cao thủ Nghe", "Thợ săn Điểm số", "Thần đồng Phát âm", "Ngôi sao Chăm chỉ", "Kỷ luật Thép", "Bậc thầy Tốc độ"].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mb-5">
                      <label className="block text-[12px] font-bold text-gray-700 mb-2">Lý do trao thưởng</label>
                      <textarea 
                        value={rewardReason}
                        onChange={(e) => setRewardReason(e.target.value)}
                        placeholder="Vd: Phát âm xuất sắc tuần này..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-gray-400 resize-none h-[80px]"
                      ></textarea>
                    </div>

                    <button 
                      onClick={handleGiveReward}
                      className="w-full bg-[#E63946] hover:bg-[#D92B38] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Send className="w-4 h-4" /> Trao thưởng
                    </button>
                  </div>

                  {/* Lịch sử Trao thưởng */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex-1 flex flex-col min-h-0">
                    <h3 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center justify-between">
                      Lịch sử gần đây
                      <span className="text-[11px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{rewardHistory.length} bản ghi</span>
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      {rewardHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-[12px] italic">Chưa có dữ liệu trao thưởng.</div>
                      ) : (
                        <div className="space-y-3">
                          {rewardHistory.map(record => (
                            <div key={record.id} className="border-l-2 border-amber-400 pl-3 py-1">
                              <div className="flex justify-between items-start mb-1">
                                <div className="text-[12px] font-bold text-gray-800 line-clamp-1">{record.studentNames}</div>
                                <div className="text-[10px] text-gray-400 shrink-0 ml-2">{record.date}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  record.type === 'xp' ? 'bg-amber-100 text-amber-700' :
                                  record.type === 'diamond' ? 'bg-blue-100 text-blue-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {record.type === 'xp' ? `+${record.amount} XP` : record.type === 'diamond' ? `+${record.amount} Kim cương` : `Huy hiệu: ${record.amount}`}
                                </span>
                                <span className="text-[11px] text-gray-600 truncate">{record.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* SCHEDULE TAB */}
            {activeTab === 'schedule' && (
              <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                {/* Toast Notification */}
                {showToast && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 animate-bounce z-50">
                    <CheckCircle2 className="w-5 h-5" /> {showToast}
                  </div>
                )}
                
                {/* Cột Trái - Lịch (chiếm 2 cột) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(currentDate.getDate() - 7);
                        setCurrentDate(newDate);
                      }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <span className="text-[14px] font-bold text-gray-800 w-32 text-center">
                        Tuần này
                      </span>
                      <button onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(currentDate.getDate() + 7);
                        setCurrentDate(newDate);
                      }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </button>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button onClick={() => setScheduleView('week')} className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-colors ${scheduleView === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Tuần
                      </button>
                      <button onClick={() => setScheduleView('month')} className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-colors ${scheduleView === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Tháng
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="bg-white rounded-xl border border-gray-200 p-1 shadow-sm flex-1 min-h-[500px]">
                    {scheduleView === 'week' ? (
                      <div className="grid grid-cols-7 h-full divide-x divide-gray-100">
                        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => (
                          <div key={day} className="flex flex-col h-full min-h-[400px]">
                            <div className="text-center py-2 border-b border-gray-100 bg-gray-50">
                              <div className="text-[11px] font-bold text-gray-500 uppercase">{day}</div>
                            </div>
                            <div className="flex-1 p-1 space-y-2 relative bg-white">
                              {scheduleSessions.map((sess, idx) => {
                                const sDate = new Date(sess.date);
                                const jsDay = sDate.getDay();
                                const colIndex = jsDay === 0 ? 6 : jsDay - 1;
                                
                                if (colIndex === i) {
                                  return (
                                    <div key={sess.id} className={`p-2 rounded-lg border ${sess.class_id === '7A3' ? 'bg-blue-50 border-blue-200' : sess.class_id === '6A1' ? 'bg-amber-50 border-amber-200' : 'bg-purple-50 border-purple-200'} shadow-sm relative group animate-fade-in`}>
                                      <div className="text-[10px] font-bold text-gray-500 mb-0.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {sess.start_time} - {sess.end_time}
                                      </div>
                                      <div className={`text-[12px] font-bold ${sess.class_id === '7A3' ? 'text-blue-700' : sess.class_id === '6A1' ? 'text-amber-700' : 'text-purple-700'} line-clamp-1`}>{sess.class_id}</div>
                                      <div className="text-[10px] text-gray-600 line-clamp-1">{sess.unit_id}</div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[500px] text-gray-400 text-[13px]">
                        <Calendar className="w-12 h-12 text-gray-200 mb-4" />
                        Chế độ xem tháng đang được hoàn thiện...
                      </div>
                    )}
                  </div>
                </div>

                {/* Cột Phải - Form Thêm buổi dạy */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-[15px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" /> Thêm buổi dạy
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Chọn Lớp</label>
                        <select 
                          value={schedClass}
                          onChange={(e) => setSchedClass(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500"
                        >
                          <option value="7A3">Lớp 7A3</option>
                          <option value="6A1">Lớp 6A1</option>
                          <option value="8B2">Lớp 8B2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Chọn Unit (Nội dung)</label>
                        <select 
                          value={schedUnit}
                          onChange={(e) => setSchedUnit(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500"
                        >
                          <option value="Unit 1: Hobbies">Unit 1: Hobbies</option>
                          <option value="Unit 2: Healthy Living">Unit 2: Healthy Living</option>
                          <option value="Unit 3: Community Service">Unit 3: Community Service</option>
                          <option value="Review 1">Review 1</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Ngày dạy</label>
                        <input 
                          type="date"
                          value={schedDate}
                          onChange={(e) => setSchedDate(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-bold text-gray-700 mb-1">Bắt đầu</label>
                          <input 
                            type="time"
                            value={schedStartTime}
                            onChange={(e) => setSchedStartTime(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-gray-700 mb-1">Kết thúc</label>
                          <input 
                            type="time"
                            value={schedEndTime}
                            onChange={(e) => setSchedEndTime(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
                        <textarea 
                          value={schedNotes}
                          onChange={(e) => setSchedNotes(e.target.value)}
                          placeholder="Vd: Kiểm tra 15 phút đầu giờ..."
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-gray-400 resize-none h-[70px]"
                        ></textarea>
                      </div>

                      <button 
                        onClick={handleSaveSchedule}
                        className="w-full bg-[#185FA5] hover:bg-[#134D86] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Lưu Lịch Dạy
                      </button>
                    </div>
                  </div>

                  {/* Thống kê */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-[14px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" /> Thống kê hoạt động
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-[12px] text-gray-600">Tuần này</span>
                        <span className="text-[13px] font-bold text-gray-800">{scheduleSessions.filter(s => {
                          const sd = new Date(s.date);
                          const cd = new Date();
                          return Math.abs(sd.getTime() - cd.getTime()) < 7 * 24 * 60 * 60 * 1000;
                        }).length} buổi</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-[12px] text-gray-600">Tháng này</span>
                        <span className="text-[13px] font-bold text-gray-800">{scheduleSessions.filter(s => {
                          const sd = new Date(s.date);
                          const cd = new Date();
                          return sd.getMonth() === cd.getMonth() && sd.getFullYear() === cd.getFullYear();
                        }).length} buổi</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-gray-600">Unit dạy nhiều nhất</span>
                        <span className="text-[12px] font-bold text-teal-600 max-w-[120px] truncate" title="Unit 1: Hobbies">
                          {scheduleSessions.length > 0 ? "Unit 1: Hobbies" : "Chưa có"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in-up bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 max-w-2xl mt-4 ml-6">
                <h3 className="text-[16px] font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                  <Settings className="w-5 h-5 text-[#E63946]" /> Thiết lập tài khoản Giáo viên
                </h3>
                
                {/* Toast Notification for settings */}
                {showToast && (
                  <div className="mb-6 bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB] px-4 py-2 rounded-lg text-[13px] font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {showToast}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Họ và tên Giáo viên</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-[14px] text-gray-800 outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 transition-all" value={teacherProfile.name} onChange={e => setTeacherProfile({...teacherProfile, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Trường công tác</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-[14px] text-gray-800 outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 transition-all" value={teacherProfile.school} onChange={e => setTeacherProfile({...teacherProfile, school: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Số điện thoại / Zalo</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-[14px] text-gray-800 outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 transition-all" value={teacherProfile.phone} onChange={e => setTeacherProfile({...teacherProfile, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 mb-1.5">Phụ trách khối lớp</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-[14px] text-gray-800 outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 transition-all" value={teacherProfile.grades} onChange={e => setTeacherProfile({...teacherProfile, grades: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button onClick={() => {
                      localStorage.setItem("gsa-teacher-profile", JSON.stringify(teacherProfile));
                      setShowToast("Đã lưu thông tin tài khoản thành công!");
                      setTimeout(() => setShowToast(""), 3000);
                    }} className="bg-[#E63946] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md hover:bg-[#c62b37] transition-all">
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
