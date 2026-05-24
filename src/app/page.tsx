"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  BookOpen,
  TrendingUp,
  Sparkles,
  Check,
  Loader2,
  Lock,
  ChevronRight,
  BookMarked,
  Award,
  Volume2,
  HelpCircle,
  Settings,
  Flame,
  Plus,
  ArrowLeft,
  Search,
  Play,
  Headphones,
  Compass,
  Zap
} from "lucide-react";
import Link from "next/link";
import { evaluateSpeaking, saveLessonProgress, SpeakingEvaluationResult } from "@/app/actions/eduActions";

// Import các phòng học offline & màn ăn mừng
import DictationRoom from "@/components/DictationRoom";
import QuizRoom from "@/components/QuizRoom";
import VisualRoom from "@/components/VisualRoom";
import ExamRoom from "@/components/ExamRoom";
import WorksheetRoom from "@/components/WorksheetRoom";
import CelebrationArena from "@/components/CelebrationArena";
import PaywallModal from "@/components/PaywallModal";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: "A" | "B" | "C" | "D";
}

interface Lesson {
  id: string;
  title: string;
  type: "vocabulary" | "speaking" | "grammar" | "reading" | "dictation" | "quiz" | "visual" | "exam" | "worksheet";
  completed: boolean;
  expectedText?: string;
  quizQuestions?: QuizQuestion[];
  questions?: any[];
  imageUrl?: string;
  mainAudio?: string;
  audioTracks?: string[];
  examQuestions?: any[];
  examDuration?: number;
  examAudio?: string;
  worksheetUrl?: string;
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

const defaultUnits: UnitData[] = [
  // Lớp 10
  {
    id: "unit-10-1",
    number: 1,
    title: "Family Life",
    status: "completed",
    progress: 100,
    grade: "Lớp 10",
    lessons: [
      { id: "u10-1-l1", title: "Vocabulary: Family life & Chores", type: "vocabulary", completed: true },
      { id: "u10-1-l2", title: "Speaking: Sharing household chores", type: "speaking", completed: true },
      { id: "u10-1-l3", title: "Grammar: Present Simple vs. Present Continuous", type: "grammar", completed: true },
    ]
  },
  {
    id: "unit-10-2",
    number: 2,
    title: "Your Body and You",
    status: "in_progress",
    progress: 33,
    grade: "Lớp 10",
    lessons: [
      { id: "u10-2-l1", title: "Vocabulary: Organs & Systems", type: "vocabulary", completed: true },
      { 
        id: "u10-2-l2", 
        title: "Speaking: Talking about human body", 
        type: "speaking", 
        completed: false,
        expectedText: "Linh: Did you know that the human brain can generate about twenty-three watts of power? Minh: Wow, that is amazing! I did not know that."
      },
      { 
        id: "u10-2-l3", 
        title: "Dictation: Healthy diet & nervous system", 
        type: "dictation", 
        completed: false,
        expectedText: "A healthy diet is very important for our [nervous] system. Eating fresh vegetables helps us stay [fit] and active. We should avoid fast food to protect our [digestive] system."
      },
      { 
        id: "u10-2-l4", 
        title: "Quiz: Your Body and You & Systems", 
        type: "quiz", 
        completed: false,
        quizQuestions: [
          {
            question: "The ______ system controls all the activities of the body.",
            options: ["A. digestive", "B. circulatory", "C. nervous", "D. skeletal"],
            correctAnswer: "C"
          },
          {
            question: "You should eat more vegetables because they are good ______ your health.",
            options: ["A. at", "B. for", "C. with", "D. to"],
            correctAnswer: "B"
          },
          {
            question: "The human ______ is responsible for pumping blood throughout the body.",
            options: ["A. brain", "B. heart", "C. lungs", "D. stomach"],
            correctAnswer: "B"
          }
        ]
      },
    ]
  },
  {
    id: "unit-10-3",
    number: 3,
    title: "Music",
    status: "locked",
    progress: 0,
    grade: "Lớp 10",
    lessons: [
      { id: "u10-3-l1", title: "Vocabulary: Music & Art", type: "vocabulary", completed: false },
      { id: "u10-3-l2", title: "Speaking: Describing your favorite singer", type: "speaking", completed: false },
      { id: "u10-3-l3", title: "Grammar: Compound sentences", type: "grammar", completed: false },
    ]
  },

  // Lớp 11
  {
    id: "unit-11-1",
    number: 1,
    title: "A Long and Healthy Life",
    status: "completed",
    progress: 100,
    grade: "Lớp 11",
    lessons: [
      { id: "u11-1-l1", title: "Vocabulary: Health & Fitness", type: "vocabulary", completed: true },
      { id: "u11-1-l2", title: "Speaking: Talking about healthy habits", type: "speaking", completed: true },
      { id: "u11-1-l3", title: "Grammar: Past Simple vs. Present Perfect", type: "grammar", completed: true },
    ]
  },
  {
    id: "unit-11-2",
    number: 2,
    title: "The Generation Gap",
    status: "in_progress",
    progress: 33,
    grade: "Lớp 11",
    lessons: [
      { id: "u11-2-l1", title: "Vocabulary: Family & Relationships", type: "vocabulary", completed: true },
      { 
        id: "u11-2-l2", 
        title: "Speaking: Đoạn hội thoại Phong - Vy", 
        type: "speaking", 
        completed: false,
        expectedText: "Phong: I think parents should respect our privacy. Vy: Yes, but we also need to understand their worries."
      },
      { 
        id: "u11-2-l3", 
        title: "Dictation: Arguments between parents...", 
        type: "dictation", 
        completed: false,
        expectedText: "Arguments between parents and children usually occur when parents do not respect their children's [individuality]. Some behaviors are considered [unacceptable] in traditional families. We need to show [sympathy] to bridge the [generation] gap."
      },
      { 
        id: "u11-2-l4", 
        title: "Quiz: Generation Gap & Modal Verbs", 
        type: "quiz", 
        completed: false,
        quizQuestions: [
          {
            question: "You ______ consult your parents before deciding on a career path, as their advice is valuable.",
            options: ["A. must", "B. should", "C. have to", "D. ought"],
            correctAnswer: "B"
          },
          {
            question: "The difference in attitude or behavior between older and younger generations is called generation ______.",
            options: ["A. space", "B. bridge", "C. gap", "D. split"],
            correctAnswer: "C"
          },
          {
            question: "I don't think parents should impose their decisions ______ their children.",
            options: ["A. on", "B. in", "C. at", "D. to"],
            correctAnswer: "A"
          }
        ]
      },
    ]
  },
  {
    id: "unit-11-3",
    number: 3,
    title: "Cities of the Future",
    status: "locked",
    progress: 0,
    grade: "Lớp 11",
    lessons: [
      { id: "u11-3-l1", title: "Vocabulary: Smart Cities", type: "vocabulary", completed: false },
      { id: "u11-3-l2", title: "Speaking: Describing futuristic urban life", type: "speaking", completed: false },
      { id: "u11-3-l3", title: "Grammar: Stative verbs in continuous form", type: "grammar", completed: false },
    ]
  },

  // Lớp 12
  {
    id: "unit-12-1",
    number: 1,
    title: "Life Stories",
    status: "completed",
    progress: 100,
    grade: "Lớp 12",
    lessons: [
      { id: "u12-1-l1", title: "Vocabulary: Life & Achievements", type: "vocabulary", completed: true },
      { id: "u12-1-l2", title: "Speaking: Telling a biography", type: "speaking", completed: true },
      { id: "u12-1-l3", title: "Grammar: Past Simple vs. Past Continuous", type: "grammar", completed: true },
    ]
  },
  {
    id: "unit-12-2",
    number: 2,
    title: "A Long and Healthy Life",
    status: "in_progress",
    progress: 33,
    grade: "Lớp 12",
    lessons: [
      { id: "u12-2-l1", title: "Vocabulary: Longevity & Healthy habits", type: "vocabulary", completed: true },
      { 
        id: "u12-2-l2", 
        title: "Speaking: Secrets of longevity", 
        type: "speaking", 
        completed: false,
        expectedText: "Hoa: How can we live a long and healthy life? Nam: We should eat balanced meals, sleep enough, and exercise regularly."
      },
      { 
        id: "u12-2-l3", 
        title: "Dictation: Longevity and health...", 
        type: "dictation", 
        completed: false,
        expectedText: "Regular exercise is the key to [longevity] and good health. We must pay attention to our [mental] health as well as physical health. Eating a balanced diet keeps us immune to many [diseases]."
      },
      { 
        id: "u12-2-l4", 
        title: "Quiz: A Long and Healthy Life", 
        type: "quiz", 
        completed: false,
        quizQuestions: [
          {
            question: "A healthy lifestyle can increase life ______ significantly.",
            options: ["A. span", "B. expectation", "C. expectancy", "D. duration"],
            correctAnswer: "C"
          },
          {
            question: "We should ______ down on fast food if we want to stay healthy.",
            options: ["A. cut", "B. get", "C. drop", "D. put"],
            correctAnswer: "A"
          },
          {
            question: "Regular physical activity helps to prevent chronic ______.",
            options: ["A. treatments", "B. diseases", "C. symptoms", "D. medicines"],
            correctAnswer: "B"
          }
        ]
      },
    ]
  },
  {
    id: "unit-12-3",
    number: 3,
    title: "Green Living",
    status: "locked",
    progress: 0,
    grade: "Lớp 12",
    lessons: [
      { id: "u12-3-l1", title: "Vocabulary: Environmental protection", type: "vocabulary", completed: false },
      { id: "u12-3-l2", title: "Speaking: Discussing green lifestyle", type: "speaking", completed: false },
      { id: "u12-3-l3", title: "Grammar: Simple, compound, and complex sentences", type: "grammar", completed: false },
    ]
  }
];

export default function Dashboard() {
  const [activeGrade, setActiveGrade] = useState("Lớp 10");
  const [units, setUnits] = useState<UnitData[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  
  // Điều hướng các phòng học: "dashboard" | "speaking" | "dictation" | "quiz" | "visual" | "exam" | "worksheet"
  const [activeRoom, setActiveRoom] = useState<"dashboard" | "speaking" | "dictation" | "quiz" | "visual" | "exam" | "worksheet">("dashboard");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Session: danh sách bài cùng loại để học liên tiếp
  const [sessionLessons, setSessionLessons] = useState<Lesson[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  // Màn ăn mừng Celebration
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  // Paywall System
  const [userTier, setUserTier] = useState<"free" | "pro">("free");
  const [paywallOpen, setPaywallOpen] = useState(false);

  const loadUserTier = () => {
    if (typeof window !== "undefined") {
      const tier = localStorage.getItem("gsa-user-tier");
      setUserTier(tier === "pro" ? "pro" : "free");
    }
  };

  // Trạng thái Speaking Room (trong dashboard)
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SpeakingEvaluationResult | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Trạng thái stats để đồng bộ thời gian thực với RightPanel và Welcome Banner
  const [stats, setStats] = useState({ xp: 0, diamonds: 0, streak: 0 });
  const [fullName, setFullName] = useState("Học viên");

  const loadStats = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gsa-student-stats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStats({
            xp: parsed.xp || 0,
            diamonds: parsed.diamonds || 0,
            streak: parsed.streak || 0
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        const defaultStats = { xp: 0, diamonds: 0, streak: 0 };
        localStorage.setItem("gsa-student-stats", JSON.stringify(defaultStats));
      }
    }
  };

  const loadProfile = () => {
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("gsa-current-user");
      if (currentUserStr) {
        try {
          const parsed = JSON.parse(currentUserStr);
          if (parsed.name) {
            setFullName(parsed.name);
            return;
          }
        } catch (e) {}
      } else {
        setFullName("Học viên");
      }

      const storedProfile = localStorage.getItem("gsa-user-profile");
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          if (parsed.fullName) setFullName(parsed.fullName);
        } catch (e) {}
      }
    }
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Đọc danh sách bài học và điểm số từ localStorage
  useEffect(() => {
    loadCurriculum();
    loadStats();
    loadUserTier();
    loadProfile();
    if (typeof window !== "undefined") {
      window.addEventListener("stats-updated", loadStats);
      window.addEventListener("tier-updated", loadUserTier);
      window.addEventListener("profile-updated", loadProfile);
      window.addEventListener("auth-changed", loadProfile);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("stats-updated", loadStats);
        window.removeEventListener("tier-updated", loadUserTier);
        window.removeEventListener("profile-updated", loadProfile);
        window.removeEventListener("auth-changed", loadProfile);
      }
    };
  }, []);

  const loadCurriculum = async () => {
    let baseUnits = [...defaultUnits];
    
    // Đọc từ localStorage chung
    const stored = localStorage.getItem("gsa-curriculum");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseUnits = parsed;
        }
      } catch (e) {}
    }

    // Khóa tất cả các bài mặc định (trừ Unit 11-2)
    baseUnits = baseUnits.map((u: any) => {
      if (u.id !== "unit-11-2") {
        return {
          ...u,
          status: "locked",
          progress: 0,
          lessons: u.lessons.map((l: any) => ({ ...l, completed: false }))
        };
      }
      return u;
    });

    // Gom dữ liệu từ 12 khối lớp
    const allUnits = [...baseUnits];
    
    for (let grade = 1; grade <= 12; grade++) {
      const gradeStr = `Lớp ${grade}`;
      let storedData = localStorage.getItem(`gsa-curriculum-l${grade}`);
      
      // Tự động tải dữ liệu ngầm cho Lớp 1, 2, 3 nếu chưa có trong máy
      if (!storedData && (grade === 1 || grade === 2 || grade === 3 || grade === 10)) {
        try {
          const res = await fetch(`/seeds/grade${grade}.json`);
          if (res.ok) {
            const data = await res.json();
            storedData = JSON.stringify(data);
            localStorage.setItem(`gsa-curriculum-l${grade}`, storedData);
          }
        } catch (e) {
          console.error(`Lỗi tải ngầm dữ liệu Lớp ${grade}:`, e);
        }
      }
      
      let hasRealData = false;
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            hasRealData = true;
            // Gộp tất cả các Unit của lớp này
            for (const uNew of parsedData) {
              const idx = allUnits.findIndex((u: any) => u.id === uNew.id || (u.grade === gradeStr && u.number === uNew.number));
              if (idx >= 0) allUnits[idx] = uNew;
              else allUnits.push(uNew);
            }
          }
        } catch (e) {}
      }

      // Nếu không có dữ liệu thật và cũng chưa có Unit mặc định nào cho khối này, thêm một Unit "Sắp ra mắt"
      if (!hasRealData && !allUnits.some(u => u.grade === gradeStr)) {
        allUnits.push({
          id: `unit-${grade}-coming-soon`,
          number: 1,
          title: "Chương trình mới đang cập nhật",
          grade: gradeStr,
          status: "locked",
          progress: 0,
          lessons: [
            { id: `u${grade}-coming-l1`, title: "Sắp ra mắt", type: "vocabulary", completed: false },
            { id: `u${grade}-coming-l2`, title: "Sắp ra mắt", type: "speaking", completed: false },
            { id: `u${grade}-coming-l3`, title: "Sắp ra mắt", type: "dictation", completed: false }
          ]
        });
      }
    }

    setUnits(allUnits);
    const selectedUnitFromList = 
      allUnits.find((u: any) => u.grade === activeGrade && u.number === 2) 
      || allUnits.find((u: any) => u.grade === activeGrade) 
      || allUnits[0] || null;
    setSelectedUnit(selectedUnitFromList);
  };

  // Đồng bộ đếm giờ ghi âm
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    const user = localStorage.getItem("gsa-current-user");
    if (!user) {
      alert("Bạn cần đăng nhập để sử dụng tính năng Ghi âm AI!");
      window.location.href = "/auth";
      return;
    }
    try {
      setEvaluationResult(null);
      setAudioUrl(null);
      setAudioBase64(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/mp4" });
        setAudioUrl(URL.createObjectURL(audioBlob));

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Str = reader.result as string;
          setAudioBase64(base64Str);
          if (activeLesson && activeLesson.type === "speaking") {
            handleEvaluateSpeaking(activeLesson.expectedText || "", activeLesson.id, base64Str);
          }
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Không thể truy cập Microphone. Vui lòng cấp quyền!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
  };

  const handleEvaluateSpeaking = async (expected: string, lessonId: string, customBase64?: string) => {
    const targetBase64 = customBase64 || audioBase64;
    if (!targetBase64) return;
    setIsEvaluating(true);
    try {
      // Đọc custom API Key từ localStorage do Admin cấu hình
      let customKey = "";
      const storedKeys = localStorage.getItem("gsa-admin-api-keys");
      if (storedKeys) {
        try {
          const parsed = JSON.parse(storedKeys);
          customKey = parsed.groq || "";
        } catch (e) {}
      }

      const res = await evaluateSpeaking(targetBase64, expected, customKey);
      setEvaluationResult(res);

      if (res.success) {
        // Tự động kích hoạt thưởng +50 XP và +2 Kim cương nếu điểm >= 75
        if (res.score >= 75) {
          const storedStats = localStorage.getItem("gsa-student-stats");
          let stats = { xp: 0, diamonds: 0, streak: 0 };
          if (storedStats) {
            try {
              stats = JSON.parse(storedStats);
            } catch (e) {}
          }
          const newStats = {
            ...stats,
            xp: stats.xp + 50,
            diamonds: stats.diamonds + 2
          };
          localStorage.setItem("gsa-student-stats", JSON.stringify(newStats));
          window.dispatchEvent(new Event("stats-updated"));
        }

        // Hoàn thành bài học nếu đạt yêu cầu tối thiểu >= 70
        if (res.score >= 70) {
          handleLessonCompletion(lessonId, res.score);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Xử lý khi hoàn thành bất kỳ bài tập nào
  const handleLessonCompletion = (lessonId: string, finalScore: number = 100) => {
    // 1. Cập nhật bài học thành Hoàn thành trong localStorage
    const updatedUnits = units.map((unit) => {
      const hasLesson = unit.lessons.some((l) => l.id === lessonId);
      if (hasLesson) {
        const updatedLessons = unit.lessons.map((l) => {
          if (l.id === lessonId) return { ...l, completed: true };
          return l;
        });
        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const progress = Math.round((completedCount / updatedLessons.length) * 100);
        return {
          ...unit,
          lessons: updatedLessons,
          progress
        };
      }
      return unit;
    });

    setUnits(updatedUnits);
    localStorage.setItem("gsa-curriculum", JSON.stringify(updatedUnits));
    
    // Cập nhật selectedUnit đang hiển thị cục bộ
    if (selectedUnit) {
      const updatedSel = updatedUnits.find((u) => u.id === selectedUnit.id);
      if (updatedSel) setSelectedUnit(updatedSel);
    }

    // Tìm bài học vừa hoàn thành và lưu vào localStorage của Khối Lớp tương ứng
    let completedLesson: Lesson | undefined;
    let unitNumber = 1;
    updatedUnits.forEach((unit) => {
      const found = unit.lessons.find((l) => l.id === lessonId);
      if (found) {
        completedLesson = found;
        unitNumber = unit.number;
        // Lưu ngược lại vào localStorage theo khối lớp
        if (unit.grade) {
          const gradeMatch = unit.grade.match(/\d+/);
          if (gradeMatch) {
            const gradeNum = gradeMatch[0];
            const gradeUnits = updatedUnits.filter(u => u.grade === unit.grade);
            localStorage.setItem(`gsa-curriculum-l${gradeNum}`, JSON.stringify(gradeUnits));
          }
        }
      }
    });

    // 2. Cộng điểm thưởng offline (100 XP + 5 Kim cương)
    const storedStats = localStorage.getItem("gsa-student-stats");
    let stats = { xp: 0, diamonds: 0, streak: 0 };
    if (storedStats) {
      try {
        stats = JSON.parse(storedStats);
      } catch (e) {}
    }
    
    const newStats = {
      ...stats,
      xp: stats.xp + 100,
      diamonds: stats.diamonds + 5
    };
    localStorage.setItem("gsa-student-stats", JSON.stringify(newStats));

    // 3. Nếu là bài luyện nói (speaking), đồng bộ điểm phát âm trung bình cộng
    if (completedLesson && completedLesson.type === "speaking") {
      try {
        const storedSpeakingScores = localStorage.getItem("gsa-speaking-scores");
        let speakingScores: number[] = [];
        if (storedSpeakingScores) {
          speakingScores = JSON.parse(storedSpeakingScores);
        }
        speakingScores.push(finalScore);
        localStorage.setItem("gsa-speaking-scores", JSON.stringify(speakingScores));

        const avgScore = Math.round(speakingScores.reduce((a: number, b: number) => a + b, 0) / speakingScores.length);
        localStorage.setItem("gsa-pronunciation-accuracy", String(avgScore));
      } catch (err) {
        console.error("Error saving speaking scores from curriculum:", err);
      }
    }

    // 4. Lưu nhật ký luyện tập chuyên sâu vào gsa-learning-logs
    if (completedLesson) {
      try {
        const storedLogs = localStorage.getItem("gsa-learning-logs");
        let learningLogs: any[] = [];
        if (storedLogs) {
          learningLogs = JSON.parse(storedLogs);
        }
        
        const displayTypeMap: { [key: string]: string } = {
          vocabulary: "Từ vựng",
          speaking: "Speaking",
          grammar: "Ngữ pháp",
          reading: "Đọc hiểu",
          dictation: "Dictation",
          quiz: "Quiz"
        };
        
        const displayType = displayTypeMap[completedLesson.type] || completedLesson.type;
        const lessonTitleFormatted = `Unit ${unitNumber}: ${displayType} - ${completedLesson.title}`;
        
        const newLog = {
          lessonTitle: lessonTitleFormatted,
          type: completedLesson.type,
          score: finalScore,
          xpEarned: 100,
          timeAgo: "Vừa xong",
          passed: finalScore >= 70
        };
        
        // Đẩy vào đầu danh sách, chỉ giữ tối đa 10 bản ghi gần nhất
        localStorage.setItem("gsa-learning-logs", JSON.stringify([newLog, ...learningLogs].slice(0, 10)));
      } catch (err) {
        console.error("Error saving learning logs from curriculum:", err);
      }
    }

    // Kích hoạt sự kiện toàn hệ thống để cập nhật điểm trên RightPanel tức thì
    window.dispatchEvent(new Event("stats-updated"));

    // 5. Nếu còn bài tiếp theo trong session, chuyển sang bài đó
    //    Nếu là bài cuối cùng → mở màn ăn mừng
    const nextIdx = sessionIndex + 1;
    if (sessionLessons.length > 1 && nextIdx < sessionLessons.length) {
      // Có bài tiếp theo - tự động chuyển sau 600ms
      setTimeout(() => {
        handleNextInSession();
      }, 600);
    } else {
      // Hết session → ăn mừng
      setCelebrationOpen(true);
    }

    // Lưu DB thông qua Server Action
    saveLessonProgress("student-khanh-tran-11", lessonId, finalScore, "completed");
  };

  // Kiểm tra bài học có bị khóa Paywall không
  const isLessonLocked = (lesson: Lesson): boolean => {
    if (userTier === "pro") return false;
    // Tìm unit chứa bài học này
    const parentUnit = units.find((u) => u.lessons.some((l) => l.id === lesson.id));
    // Unit 2 trở đi bị khóa với tài khoản free
    return !!(parentUnit && parentUnit.number >= 2);
  };

  // Khởi động một phòng học cụ thể
  const handleStartLesson = (lesson: Lesson, forceUnit?: UnitData) => {
    const user = localStorage.getItem("gsa-current-user");
    if (!user) {
      alert("Bạn cần đăng nhập để học và lưu kết quả!");
      window.location.href = "/auth";
      return;
    }

    // Kiểm tra Paywall Gate
    if (isLessonLocked(lesson)) {
      setPaywallOpen(true);
      return;
    }

    // Gom tất cả bài cùng type từ unit hiện tại vào một phiên học
    const currentUnit = forceUnit || selectedUnit;
    const sameLessons = currentUnit
      ? currentUnit.lessons.filter(l => l.type === lesson.type)
      : [lesson];
    const startIdx = sameLessons.findIndex(l => l.id === lesson.id);
    setSessionLessons(sameLessons);
    setSessionIndex(startIdx >= 0 ? startIdx : 0);
    setActiveLesson(lesson);
    
    // Mở phòng tương ứng
    if (lesson.type === "speaking" && lesson.expectedText) {
      setActiveRoom("speaking");
      setEvaluationResult(null);
      setAudioUrl(null);
      setAudioBase64(null);
    } else if (lesson.type === "speaking" && !lesson.expectedText) {
      alert("Bài học Speaking này chưa có dữ liệu âm thanh/văn bản. Vui lòng cập nhật!");
    } else if (lesson.type === "dictation" && lesson.expectedText) {
      setActiveRoom("dictation");
    } else if (lesson.type === "dictation" && !lesson.expectedText) {
      alert("Bài học Dictation này chưa có dữ liệu âm thanh/văn bản. Vui lòng cập nhật!");
    } else if (lesson.type === "quiz" || lesson.type === "vocabulary" || lesson.type === "grammar" || lesson.type === "reading") {
      setActiveRoom("quiz");
    } else if (lesson.type === "visual") {
      setActiveRoom("visual");
    } else if (lesson.type === "exam") {
      setActiveRoom("exam");
    } else if (lesson.type === "worksheet") {
      setActiveRoom("worksheet");
    }
  };

  // Chuyển sang bài tiếp theo trong phiên học
  const handleNextInSession = () => {
    const nextIdx = sessionIndex + 1;
    if (nextIdx < sessionLessons.length) {
      const nextLesson = sessionLessons[nextIdx];
      setSessionIndex(nextIdx);
      setActiveLesson(nextLesson);
      // Reset speaking state nếu cần
      if (nextLesson.type === "speaking") {
        setEvaluationResult(null);
        setAudioUrl(null);
        setAudioBase64(null);
      }
    } else {
      // Hết session, về dashboard
      setActiveRoom("dashboard");
    }
  };


  const handleCloseCelebration = () => {
    setCelebrationOpen(false);
    setActiveRoom("dashboard");
    setActiveLesson(null);
    // Reload lại từ đầu chương trình để cập nhật UI các tích xanh
    loadCurriculum();
  };

  // Trả về Icon tương ứng với loại bài tập
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "speaking": return Mic;
      case "dictation": return Volume2;
      case "quiz": return HelpCircle;
      default: return BookOpen;
    }
  };

  const getLessonColor = (type: string) => {
    switch (type) {
      case "speaking": return "text-primary bg-primary-light border-indigo-500/25";
      case "dictation": return "text-blue-600 bg-blue-500/10 border-blue-500/25";
      case "quiz": return "text-primary bg-primary-light border-indigo-500/25";
      default: return "text-text-muted bg-slate-500/10 border-slate-500/25";
    }
  };

  if (!selectedUnit) return null;

  return (
    <div className="min-h-full">
      {/* ========================================================
          RENDER PHÒNG DICTATION
          ======================================================== */}
      {activeRoom === "dictation" && activeLesson && (
        <DictationRoom
          lessonTitle={activeLesson.title}
          expectedText={activeLesson.expectedText || ""}
          onComplete={(score) => handleLessonCompletion(activeLesson.id, score)}
          onBack={() => setActiveRoom("dashboard")}
        />
      )}

      {/* ========================================================
          RENDER PHÒNG QUIZ
          ======================================================== */}
      {activeRoom === "quiz" && activeLesson && (
        <QuizRoom
          lessonTitle={activeLesson.title}
          questions={activeLesson.quizQuestions || activeLesson.questions}
          onComplete={(score) => handleLessonCompletion(activeLesson.id, score)}
          onBack={() => setActiveRoom("dashboard")}
        />
      )}

      {/* ========================================================
          RENDER PHÒNG VISUAL
          ======================================================== */}
      {activeRoom === "visual" && activeLesson && (
        <VisualRoom
          lessonId={activeLesson.id}
          title={activeLesson.title}
          imageUrl={activeLesson.imageUrl || ""}
          mainAudio={activeLesson.mainAudio}
          audioTracks={activeLesson.audioTracks}
          onBack={() => setActiveRoom("dashboard")}
          onComplete={(score) => handleLessonCompletion(activeLesson.id, score)}
        />
      )}

      {/* ========================================================
          RENDER PHÒNG THI (EXAM)
          ======================================================== */}
      {activeRoom === "exam" && activeLesson && (
        <ExamRoom
          examTitle={activeLesson.title}
          durationMinutes={activeLesson.examDuration || 35}
          audioUrl={activeLesson.examAudio}
          questions={activeLesson.examQuestions || []}
          onBack={() => setActiveRoom("dashboard")}
          onComplete={(score) => handleLessonCompletion(activeLesson.id, score)}
        />
      )}

      {/* ========================================================
          RENDER PHÒNG WORKSHEET (BÀI TẬP BỔ TRỢ / ĐỀ THI HTML)
          ======================================================== */}
      {activeRoom === "worksheet" && activeLesson?.worksheetUrl && (
        <WorksheetRoom
          title={activeLesson.title}
          worksheetUrl={activeLesson.worksheetUrl}
          mainAudio={activeLesson.mainAudio}
          onBack={() => {
            setActiveRoom("dashboard");
            setActiveLesson(null);
          }}
        />
      )}


      {/* ========================================================
          RENDER PHÒNG SPEAKING CHI TIẾT (Focus Mode)
          ======================================================== */}
      {activeRoom === "speaking" && activeLesson && (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-page">
          <div className="w-full max-w-2xl flex items-center justify-between mb-4">
            <button
              onClick={() => setActiveRoom("dashboard")}
              className="px-4 py-2 rounded-[var(--radius-card)] bg-card border border-[rgba(0,0,0,0.1)] text-text-body hover:text-primary hover:border-primary-dark hover:bg-primary-light transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-4.5 h-4.5" /> Về Bảng Điều Khiển
            </button>
            {sessionLessons.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-muted font-bold">{sessionIndex + 1}/{sessionLessons.length}</span>
                <div className="flex gap-1">
                  {sessionLessons.map((_, i) => (
                    <div key={i} className={`w-4 h-1.5 rounded-full transition-all ${i <= sessionIndex ? "bg-primary" : "bg-page"}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full max-w-2xl rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.1)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--radius-card)] bg-primary-light border border-primary-dark flex items-center justify-center text-primary shadow">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-primary tracking-wider uppercase">Speaking Room (Offline)</span>
                  <h3 className="text-sm font-bold text-text-head">{activeLesson.title}</h3>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/10 text-primary border border-primary-dark uppercase">
                AI Chấm Điểm
              </span>
            </div>

            <div className="p-4 rounded-[var(--radius-card)] bg-page border border-[rgba(0,0,0,0.1)] space-y-2">
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Đọc to câu tiếng Anh sau:</span>
              <p className="text-sm font-bold text-text-head leading-relaxed font-mono">&ldquo;{activeLesson.expectedText}&rdquo;</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-page flex flex-col items-center justify-center gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase">Ghi âm</span>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={isEvaluating}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 hover:opacity-95 flex items-center justify-center text-white shadow-lg"
                  >
                    <Mic className="w-6 h-6 animate-pulse" />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-rose-500 border border-slate-300 animate-pulse"
                  >
                    <Square className="w-5 h-5 fill-rose-500" />
                  </button>
                )}

                <p className="text-[10px] font-bold text-text-muted">
                  {isRecording ? `Đang ghi... ${recordingSeconds}s` : "Nhấn Micro để nói"}
                </p>

                {audioUrl && (
                  <div className="w-full flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[rgba(0,0,0,0.1)]">
                    <audio src={audioUrl} controls className="h-6 w-full scale-90 opacity-70" />
                    <button
                      onClick={() => handleEvaluateSpeaking(activeLesson.expectedText || "", activeLesson.id)}
                      disabled={isEvaluating}
                      className="px-3 py-1.5 rounded-[var(--radius-btn)] text-[9px] font-bold bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] hover:bg-primary text-white flex items-center gap-1"
                    >
                      {isEvaluating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Chấm"}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-page flex flex-col justify-center min-h-[150px]">
                {isEvaluating ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-primary">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-[9px] font-bold uppercase animate-pulse">AI Đang phân tích âm...</span>
                  </div>
                ) : evaluationResult ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-1.5 pt-1 pb-2 border-b border-[rgba(0,0,0,0.1)] text-center">
                      <div className="p-1.5 rounded-[var(--radius-btn)] bg-page border border-[rgba(0,0,0,0.1)]">
                        <div className="text-[7px] font-bold text-text-muted uppercase tracking-wider">Tổng điểm</div>
                        <div className="text-xs font-black text-primary">{evaluationResult.score}%</div>
                      </div>
                      <div className="p-1.5 rounded-[var(--radius-btn)] bg-page border border-[rgba(0,0,0,0.1)]">
                        <div className="text-[7px] font-bold text-text-muted uppercase tracking-wider">Accuracy</div>
                        <div className="text-xs font-black text-teal-600">{evaluationResult.accuracy}%</div>
                      </div>
                      <div className="p-1.5 rounded-[var(--radius-btn)] bg-page border border-[rgba(0,0,0,0.1)]">
                        <div className="text-[7px] font-bold text-text-muted uppercase tracking-wider">Pronounce</div>
                        <div className="text-xs font-black text-amber-600">{evaluationResult.pronunciation}%</div>
                      </div>
                      <div className="p-1.5 rounded-[var(--radius-btn)] bg-page border border-[rgba(0,0,0,0.1)]">
                        <div className="text-[7px] font-bold text-text-muted uppercase tracking-wider">Fluency</div>
                        <div className="text-xs font-black text-blue-600">{evaluationResult.fluency}%</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 py-1">
                      {evaluationResult.words.map((w, i) => {
                        let colorClass = "bg-rose-500/10 text-rose-600 border-rose-500/20";
                        if (w.status === "correct") {
                          colorClass = "bg-teal-500/10 text-teal-600 border-teal-300";
                        } else if (w.status === "mispronounced") {
                          colorClass = "bg-amber-500/10 text-amber-600 border-amber-300";
                        } else if (w.status === "omitted") {
                          colorClass = "bg-rose-500/10 text-rose-600 border-rose-500/20";
                        }
                        return (
                          <span 
                            key={i} 
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${colorClass}`}
                            title={w.status === "correct" ? "Chính xác" : w.status === "mispronounced" ? "Phát âm lệch/sai âm" : "Bị bỏ sót"}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-primary-dark font-medium italic bg-primary-light p-2 rounded-[var(--radius-btn)] border border-indigo-100 shadow-sm">
                      &ldquo;{evaluationResult.feedback}&rdquo;
                    </p>

                    {evaluationResult.score >= 75 && (
                      <div className="p-2 rounded-[var(--radius-card)] bg-amber-500/10 border border-amber-300 flex items-center justify-center gap-1.5 text-[9px] animate-pulse text-amber-600 font-extrabold">
                        <span>🏆 AI Bonus (+50 XP & +2 💎) đã được cộng!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-text-muted space-y-1">
                    <Volume2 className="w-6 h-6 mx-auto opacity-30" />
                    <p className="text-[9px] font-bold uppercase">Chờ thu âm</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeRoom === "dashboard" && (
        <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto pb-16">
          {/* Top Search & Navigation Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(0,0,0,0.1)] pb-6">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={activeGrade === "SearchPlaceholder" ? "" : undefined}
                placeholder="Tìm kiếm bài học, chủ đề..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-[var(--radius-card)] bg-card border border-[rgba(0,0,0,0.1)] text-text-body focus:outline-none focus:border-indigo-500/50 transition-all placeholder-slate-500 shadow-inner"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex overflow-x-auto hide-scrollbar space-x-2 p-1 rounded-[var(--radius-card)] bg-card border border-[rgba(0,0,0,0.1)] w-full md:w-fit max-w-[calc(100vw-3rem)]">
                {[...Array(12)].map((_, i) => {
                  const grade = `Lớp ${i + 1}`;
                  return (
                    <button
                      key={grade}
                      onClick={() => {
                        setActiveGrade(grade);
                        const unit1 = units.find(u => u.grade === grade && u.number === 1) || units.find(u => u.grade === grade);
                        if (unit1) {
                          setSelectedUnit(unit1);
                        }
                      }}
                      className={`shrink-0 px-4 py-1.5 rounded-[var(--radius-card)] text-xs font-bold tracking-wide transition-all ${
                        activeGrade === grade
                          ? "bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] text-white shadow-md shadow-indigo-600/20"
                          : "text-text-body hover:text-text-head hover:bg-card"
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Greeting Card */}
          {(() => {
            const isHigh = ["Lớp 10", "Lớp 11", "Lớp 12"].includes(activeGrade);
            const isMiddle = ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"].includes(activeGrade);
            
            if (isHigh) {
              return (
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] p-5 flex items-center gap-4 shadow-sm animate-fade-in-up">
                  <div className="w-[50px] h-[50px] rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl leading-none">🎯</span>
                  </div>
                  <div className="flex-1 flex flex-col items-start gap-1">
                    <h2 className="text-text-head font-inter font-black text-[18px] leading-tight tracking-tight">
                      Chào {fullName}!
                    </h2>
                    <p className="text-text-muted font-inter font-medium text-[13px] leading-tight">
                      Tiếp tục lộ trình luyện thi nhé?
                    </p>
                    <div className="mt-1 bg-primary/10 text-primary-dark font-inter font-bold text-[11px] px-2.5 py-1 rounded-[6px] inline-flex items-center">
                      <Flame className="w-3.5 h-3.5 mr-1" /> {stats.streak} ngày liên tiếp
                    </div>
                  </div>
                </div>
              );
            }
            
            if (isMiddle) {
              return (
                <div className="bg-white border-[1.5px] border-primary/20 rounded-[16px] p-4 flex items-center gap-4 shadow-sm animate-fade-in-up">
                  <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shrink-0">
                    <span className="text-2xl leading-none text-white font-black">KT</span>
                  </div>
                  <div className="flex-1 flex flex-col items-start gap-1">
                    <h2 className="text-primary-dark font-nunito font-black text-[18px] leading-tight">
                      Hi {fullName}! 👋
                    </h2>
                    <p className="text-text-body font-nunito font-bold text-[13px] leading-tight">
                      Sẵn sàng chinh phục bảng xếp hạng chưa?
                    </p>
                    <div className="mt-1 bg-xp-light border border-xp text-xp-text font-nunito font-bold text-[11px] px-3 py-1 rounded-[8px] inline-flex items-center">
                      🔥 {stats.streak} day streak
                    </div>
                  </div>
                </div>
              );
            }

            // Primary
            return (
              <div className="bg-white border-[2px] border-[#FFB347] rounded-[18px] p-4 flex items-center gap-4 animate-fade-in-up shadow-md">
                <div className="w-[56px] h-[56px] rounded-full border-[3px] border-[#FFD166] bg-[#FF6B6B] flex items-center justify-center shrink-0 animate-bounce-custom">
                  <span className="text-3xl leading-none">🦖</span>
                </div>
                <div className="flex-1 flex flex-col items-start gap-1">
                  <h2 className="text-[#C0392B] font-fredoka text-[18px] leading-tight">
                    Chào {fullName}! 🎉
                  </h2>
                  <p className="text-[#E67E22] font-nunito font-bold text-[13px] leading-tight">
                    Hôm nay mình học gì nào?
                  </p>
                  <div className="mt-1 bg-[#FFD166] text-[#7A4F00] font-nunito font-extrabold text-[11px] px-3 py-1 rounded-full inline-flex items-center shadow-sm">
                    🔥 {stats.streak} ngày liên tiếp — Tuyệt vời!
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Learning Methods Bento Grid */}
          {!["Lớp 10", "Lớp 11", "Lớp 12"].includes(activeGrade) && (
            <div className="space-y-4">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">
              Chọn cách học phù hợp với bạn
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Học SGK */}
              <div 
                onClick={() => {
                  document.getElementById("curriculum-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative rounded-[var(--radius-card)] border-none bg-gradient-to-br from-blue-500 to-blue-600 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-[var(--radius-card)] bg-card/20 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">Học SGK</h4>
                    <p className="text-[10px] text-blue-100 leading-relaxed max-w-[200px]">
                      Học theo chương trình sách giáo khoa từ lớp 6 đến lớp 12
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-[9px] text-white/90 font-bold">
                  <span>12.4K học sinh đang học</span>
                  <div className="w-6 h-6 rounded-full bg-card group-hover:bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] flex items-center justify-center text-text-muted border border-[rgba(0,0,0,0.1)] group-hover:border-indigo-600 shadow-sm group-hover:text-white transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Card 2: Luyện nghe Dictation */}
              <div 
                onClick={() => {
                  const activeGradeUnits = units.filter(u => u.grade === activeGrade);
                  const dictationLesson = activeGradeUnits.flatMap(u => u.lessons).find(l => l.type === "dictation" && !l.completed) 
                    || activeGradeUnits.flatMap(u => u.lessons).find(l => l.type === "dictation");
                  if (dictationLesson) {
                    handleStartLesson(dictationLesson);
                  } else {
                    alert("Hãy chọn bài học nghe chép (Dictation) trong phần Lộ trình học bên dưới nhé!");
                  }
                }}
                className="group relative rounded-[var(--radius-card)] border-none bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-[var(--radius-card)] bg-card/20 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner shrink-0">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">Luyện nghe Dictation</h4>
                    <p className="text-[10px] text-indigo-100 leading-relaxed max-w-[200px]">
                      Nghe viết chính tả các câu tiếng Anh theo sách giáo khoa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-[9px] text-white/90 font-bold">
                  <span>8.3K học sinh đang học</span>
                  <div className="w-6 h-6 rounded-full bg-card group-hover:bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] flex items-center justify-center text-text-muted border border-[rgba(0,0,0,0.1)] group-hover:border-indigo-600 shadow-sm group-hover:text-white transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Card 3: Luyện nói AI */}
              <div 
                onClick={() => {
                  const activeGradeUnits = units.filter(u => u.grade === activeGrade);
                  const speakingLesson = activeGradeUnits.flatMap(u => u.lessons).find(l => l.type === "speaking" && !l.completed) 
                    || activeGradeUnits.flatMap(u => u.lessons).find(l => l.type === "speaking");
                  if (speakingLesson) {
                    handleStartLesson(speakingLesson);
                  }
                }}
                className="group relative rounded-[var(--radius-card)] border-none bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-[var(--radius-card)] bg-card/20 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner shrink-0">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">Luyện nói AI</h4>
                    <p className="text-[10px] text-indigo-100 leading-relaxed max-w-[200px]">
                      AI chấm phát âm và sửa lỗi chi tiết như giáo viên bản xứ
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-[9px] text-white/90 font-bold">
                  <span>15K học sinh đang luyện</span>
                  <div className="w-6 h-6 rounded-full bg-card group-hover:bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] flex items-center justify-center text-text-muted border border-[rgba(0,0,0,0.1)] group-hover:border-indigo-600 shadow-sm group-hover:text-white transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unit Roadmap Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">
                Tiếp tục học
              </h3>
              <button 
                onClick={() => {
                  document.getElementById("curriculum-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs font-black text-primary hover:text-primary transition-colors uppercase tracking-wider"
              >
                Xem tất cả
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full">
              {units.filter(u => u.grade === activeGrade).map((unit, idx) => {
                const bgImages = [
                  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1536859355448-76f92eb7a3c8?q=80&w=400&auto=format&fit=crop",
                ];
                
                const difficultyTags = [
                  { label: "Dễ", style: "bg-teal-500/10 text-teal-600 border-teal-300" },
                  { label: "Dễ", style: "bg-teal-500/10 text-teal-600 border-teal-300" },
                  { label: "Trung bình", style: "bg-amber-500/10 text-amber-600 border-amber-300" },
                ];

                const bgImg = bgImages[idx % bgImages.length];
                const diffTag = difficultyTags[idx % difficultyTags.length];
                
                // Trích xuất phần mô tả từ title (Ví dụ: "Unit 1: At my birthday party" -> "At my birthday party")
                const titleParts = unit.title ? unit.title.split(':') : [];
                const subDesc = titleParts.length > 1 ? titleParts[1].trim() : (unit.title || "Bài học mới");
                const isSelected = selectedUnit?.id === unit.id;

                return (
                  <div
                    key={unit.id}
                    className={`flex-none w-[220px] relative rounded-[var(--radius-card)] overflow-hidden border flex flex-col justify-between min-h-[180px] transition-all duration-300 shadow-sm group cursor-pointer ${
                      isSelected 
                        ? "border-indigo-400 bg-primary-light/30 shadow-md" 
                        : "border-[rgba(0,0,0,0.1)] bg-page/50 hover:border-primary-dark hover:bg-card hover:shadow-md"
                    }`}
                    onClick={() => {
                      if (unit.status !== "locked") {
                        setSelectedUnit(unit);
                        setTimeout(() => {
                          document.getElementById("curriculum-section")?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      } else {
                        alert("Ử dung đang được ban sư phạm biên soạn. Vui lòng quay lại sau!");
                      }
                    }}
                  >
                    {/* Card Top Image */}
                    <div className="relative h-20 w-full overflow-hidden shrink-0">
                      <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${bgImg}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                      
                      {unit.status === "locked" && (
                        <div className="absolute inset-0 bg-card/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                          <Lock className="w-6 h-6 text-text-muted" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
                        <span className="px-1.5 py-0.5 rounded text-[7px] font-black bg-card/80 text-text-head border border-[rgba(0,0,0,0.1)] uppercase tracking-widest font-mono">
                          UNIT {unit.number}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black border ${diffTag.style} bg-card/90 uppercase tracking-wider`}>
                          {diffTag.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="text-[10px] font-black text-text-head group-hover:text-primary transition-colors leading-tight">
                          {unit.title}
                        </h4>
                        <p className="text-[8px] text-text-muted mt-0.5 line-clamp-1">{subDesc}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-2">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-gray-300">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${unit.progress}%`,
                                background: unit.progress >= 100 ? "#10b981" : "linear-gradient(90deg, #6366f1, #8b5cf6)"
                              }}
                            />
                          </div>
                          <span className="text-[9px] text-text-muted font-bold mt-1 block">{unit.progress}% • {unit.lessons.length} bài</span>
                        </div>
                        {unit.status === "locked" ? (
                          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center shrink-0 border border-gray-300 shadow-sm">
                            <Lock className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            isSelected ? "bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]" : "bg-page text-text-body group-hover:bg-primary border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/30 group-hover:text-white"
                          }`}>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Lesson Drawer for selected unit */}
          {selectedUnit && (
            <div id="curriculum-section" className="space-y-4 pt-4 scroll-mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[var(--radius-btn)] bg-primary-light border border-primary-dark flex items-center justify-center text-primary">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">
                    Chi tiết bài học: Unit {selectedUnit.number} — {selectedUnit.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-primary-light text-primary border border-primary-dark uppercase tracking-wide font-mono">
                  {selectedUnit.grade}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column: Lesson items */}
                <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-5 space-y-4 shadow-xl">
                  <span className="text-[9px] font-black text-text-muted tracking-widest uppercase block">
                    Các phòng học offline
                  </span>
                  
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                    {selectedUnit.lessons.map((lesson) => {
                      const LessonIcon = getLessonIcon(lesson.type);
                      const colorStyles = getLessonColor(lesson.type);
                      const locked = isLessonLocked(lesson);
                      
                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-3.5 rounded-[var(--radius-card)] border transition-all group/item relative ${
                            locked
                              ? "border-[rgba(0,0,0,0.1)] bg-card opacity-60"
                              : "border-[rgba(0,0,0,0.1)] bg-page hover:border-[rgba(0,0,0,0.1)] hover:bg-primary-light"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-[var(--radius-card)] flex items-center justify-center border shrink-0 relative ${
                              locked ? "bg-page border-[rgba(0,0,0,0.1)] shadow-sm border-[rgba(0,0,0,0.1)] text-text-muted" : colorStyles
                            }`}>
                              {locked ? (
                                <Lock className="w-4 h-4 text-text-muted" />
                              ) : (
                                <LessonIcon className="w-4.5 h-4.5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className={`text-xs font-bold truncate transition-colors ${
                                locked ? "text-text-muted" : "text-text-head group-hover/item:text-primary-dark"
                              }`}>
                                {lesson.title}
                              </h4>
                              <p className="text-[8px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
                                {locked ? (
                                  <span className="text-amber-600/70">🔒 Yêu cầu PRO</span>
                                ) : (
                                  <>Hình thức: {lesson.type === "speaking" ? "AI speaking" : lesson.type === "dictation" ? "Nghe chép" : lesson.type === "visual" ? "Sơ đồ tư duy" : "Trắc nghiệm"}</>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {lesson.completed && !locked ? (
                              <span className="px-2.5 py-1 rounded-[var(--radius-card)] text-[9px] font-bold bg-teal-500/10 text-teal-600 border border-teal-300 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Xong
                              </span>
                            ) : locked ? (
                              <button
                                onClick={() => setPaywallOpen(true)}
                                className="px-3 py-1.5 rounded-[var(--radius-card)] text-[9px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/25 transition-all flex items-center gap-1"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Mở khóa</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartLesson(lesson)}
                                className="px-3.5 py-1.5 rounded-[var(--radius-card)] text-[9px] font-bold bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] hover:bg-primary text-white transition-all flex items-center gap-0.5 group/btn"
                              >
                                <span>Vào học</span>
                                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {selectedUnit.lessons.length === 0 && (
                      <div className="text-center py-8 text-slate-650">
                        <HelpCircle className="w-8 h-8 mx-auto opacity-35" />
                        <p className="text-[10px] uppercase font-bold mt-1 tracking-wider">Không có bài học nào</p>
                        <p className="text-[9px] text-text-body">Hãy thêm bài học từ Admin Builder!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Focus Grammar & Vocabulary */}
                <div className="grid grid-rows-2 gap-4">
                  {/* Focus Grammar */}
                  <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Ngữ Pháp Trọng Tâm</span>
                        <Award className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-head">
                          {selectedUnit.number === 1 ? "Past Simple vs. Present Perfect" : selectedUnit.number === 2 ? "Modal Verbs (Must vs. Should)" : "Stative Verbs in Continuous Form"}
                        </h4>
                        <p className="text-[9px] text-primary-dark font-bold font-mono mt-1 bg-primary-light p-2 rounded-[var(--radius-btn)] border border-primary-dark shadow-inner">
                          {selectedUnit.number === 1 ? "Formula: S + have/has + V3/V-ed" : selectedUnit.number === 2 ? "Formula: S + must/should + V-bare" : "Active / Stative Verbs"}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-text-muted leading-relaxed">
                      {selectedUnit.number === 1 
                        ? "Dùng Present Perfect cho hành động đã diễn ra nhưng không rõ thời gian hoặc kéo dài đến hiện tại."
                        : selectedUnit.number === 2
                        ? "Dùng 'must' cho nghĩa vụ bắt buộc, 'should' cho lời khuyên hoặc đề xuất nhẹ nhàng."
                        : "Một số động từ trạng thái (stative verbs) chỉ nhận thức, cảm xúc thường không dùng ở thì tiếp diễn."}
                    </p>
                  </div>

                  {/* Focus Vocabulary */}
                  <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">Từ Vựng Nổi Bật</span>
                        <BookMarked className="w-4.5 h-4.5 text-teal-600" />
                      </div>
                      <div className="p-2.5 rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-page space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-text-head font-mono">
                            {selectedUnit.number === 1 ? "Fitness" : selectedUnit.number === 2 ? "Independent" : "Futuristic"}
                          </span>
                          <span className="text-[9px] text-text-muted font-bold font-mono">
                            {selectedUnit.number === 1 ? "/ˈfɪtnəs/" : selectedUnit.number === 2 ? "/ˌɪndɪˈpendənt/" : "/ˌfjuːtʃəˈrɪstɪk/"}
                          </span>
                        </div>
                        <p className="text-[9px] text-teal-600 font-bold">
                          {selectedUnit.number === 1 ? "(n) sự sung sức, sự cân đối" : selectedUnit.number === 2 ? "(adj) độc lập, tự chủ" : "(adj) thuộc về tương lai"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-text-muted font-bold">Từ nổi bật của bài học</span>
                      <button className="text-[9px] font-bold text-teal-600 hover:text-teal-600 transition-colors flex items-center gap-0.5 group/btn">
                        <span>Xem từ tiếp theo</span>
                        <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          CELEBRATION ARENA (Overlay Modal)
          ======================================================== */}
      <CelebrationArena
        isOpen={celebrationOpen}
        xpReward={100}
        diamondReward={5}
        onClose={handleCloseCelebration}
      />

      {/* ========================================================
          PAYWALL MODAL
          ======================================================== */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onActivatePro={() => {
          setUserTier("pro");
          setPaywallOpen(false);
        }}
      />
    </div>
  );
}
