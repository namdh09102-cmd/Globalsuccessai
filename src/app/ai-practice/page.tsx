"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Sparkles,
  Play,
  RotateCcw,
  Loader2,
  Volume2,
  Award,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  VolumeX
} from "lucide-react";
import { evaluateSpeaking, SpeakingEvaluationResult } from "@/app/actions/eduActions";

// Cấu hình các gợi ý nhanh (Quick prompts)
const QUICK_PROMPTS = [
  {
    category: "Giao tiếp cơ bản",
    text: "Hello, I am a student. Nice to meet you.",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-300 text-blue-600"
  },
  {
    category: "Thuyết trình",
    text: "Today, I would like to talk about the generation gap in modern families.",
    color: "from-indigo-500/10 to-indigo-500/10 border-primary-dark text-primary"
  },
  {
    category: "IELTS Speaking",
    text: "In my opinion, technology has completely transformed the way young people learn nowadays.",
    color: "from-teal-500/10 to-teal-500/10 border-teal-300 text-teal-600"
  }
];

export default function AIPracticePage() {
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SpeakingEvaluationResult | null>(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Đếm giờ ghi âm
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

  // Bắt đầu ghi âm
  const startRecording = async () => {
    try {
      if (!textInput.trim()) {
        alert("Vui lòng nhập hoặc chọn một câu Tiếng Anh trước khi ghi âm!");
        return;
      }
      setEvaluationResult(null);
      setAudioUrl(null);
      setAudioBase64(null);
      setRewardClaimed(false);
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
          handleEvaluation(base64Str);
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Không thể truy cập Microphone. Vui lòng kiểm tra quyền trình duyệt!");
    }
  };

  // Dừng ghi âm
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
  };

  // Gửi chấm điểm AI
  const handleEvaluation = async (customBase64?: string) => {
    const targetBase64 = customBase64 || audioBase64;
    if (!targetBase64 || !textInput.trim()) return;
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

      const res = await evaluateSpeaking(targetBase64, textInput, customKey);
      setEvaluationResult(res);

      // Thưởng điểm offline nếu điểm cao (>=75)
      if (res.success && res.score >= 75) {
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
        setRewardClaimed(true);

        // 1. Lưu điểm phát âm thực tế để tính trung bình cộng
        try {
          const storedSpeakingScores = localStorage.getItem("gsa-speaking-scores");
          let speakingScores: number[] = [];
          if (storedSpeakingScores) {
            speakingScores = JSON.parse(storedSpeakingScores);
          }
          speakingScores.push(res.score);
          localStorage.setItem("gsa-speaking-scores", JSON.stringify(speakingScores));

          const avgScore = Math.round(speakingScores.reduce((a: number, b: number) => a + b, 0) / speakingScores.length);
          localStorage.setItem("gsa-pronunciation-accuracy", String(avgScore));
        } catch (err) {
          console.error("Error saving speaking scores:", err);
        }

        // 2. Lưu nhật ký làm bài gần nhất
        try {
          const storedLogs = localStorage.getItem("gsa-learning-logs");
          let learningLogs = [];
          if (storedLogs) {
            learningLogs = JSON.parse(storedLogs);
          }
          const displayTitle = textInput.length > 40 ? textInput.substring(0, 37) + "..." : textInput;
          const newLog = {
            lessonTitle: `Luyện phát âm: "${displayTitle}"`,
            type: "speaking",
            score: res.score,
            xpEarned: 50,
            timeAgo: "Vừa xong",
            passed: res.score >= 75
          };
          localStorage.setItem("gsa-learning-logs", JSON.stringify([newLog, ...learningLogs].slice(0, 10)));
        } catch (err) {
          console.error("Error saving learning log:", err);
        }

        // Phát event cập nhật stats trên RightPanel và Sidebar ngay lập tức
        window.dispatchEvent(new Event("stats-updated"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reset toàn bộ trang tập luyện
  const resetPractice = () => {
    setAudioUrl(null);
    setAudioBase64(null);
    setEvaluationResult(null);
    setRewardClaimed(false);
  };

  // Định dạng thời gian đếm giây
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 select-none animate-fadeIn">
      {/* 1. Header Khơi Gợi */}
      <div className="border-b border-[rgba(0,0,0,0.1)] pb-6 relative">
        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Luyện nói tự do cùng AI Coach</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-500">
          Phòng Luyện Phát Âm Trực Tiếp
        </h1>
        <p className="text-xs md:text-sm text-text-muted mt-2 leading-relaxed">
          Gõ bất kỳ câu Tiếng Anh nào bạn muốn luyện tập, hoặc chọn nhanh từ kho gợi ý bên dưới.
        </p>
      </div>

      {/* 2. Khối Nhập Liệu (Input Section - Bento Card #1) */}
      <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl space-y-4 hover:border-slate-300/50 transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
          Nhập câu hoặc đoạn văn bản tiếng Anh
        </label>
        
        <textarea
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            resetPractice();
          }}
          rows={3}
          maxLength={300}
          placeholder="Ví dụ: 'Technology is playing a crucial role in modern education.'"
          className="w-full rounded-[var(--radius-card)] border border-slate-300 bg-card p-4 text-text-head placeholder-slate-400 text-base md:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none custom-scrollbar shadow-inner"
        />
        
        <div className="flex items-center justify-between">
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Gợi ý nhanh:</span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTextInput(prompt.text);
                  resetPractice();
                }}
                className={`px-3 py-1.5 rounded-[var(--radius-card)] border bg-gradient-to-r ${prompt.color} text-[10px] font-bold hover:scale-[1.02] hover:border-indigo-500/40 active:scale-[0.98] transition-all`}
              >
                {prompt.category}
              </button>
            ))}
          </div>
          
          <div className="text-[9px] font-bold text-text-muted">
            {textInput.length}/300 ký tự
          </div>
        </div>
      </div>

      {/* 3. Khối Ghi Âm & Chấm Điểm (Action Section - Bento Card #2) */}
      <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl space-y-6 hover:border-slate-300/50 transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
            Ghi âm & Đánh giá phát âm
          </label>
          <p className="text-[11px] text-text-muted">
            {isRecording ? "Bấm nút vuông đỏ để kết thúc ghi âm" : "Nhấp Microphone khổng lồ bên dưới để bắt đầu thu âm giọng nói"}
          </p>
        </div>

        {/* Microphone Container & Recording timer */}
        <div className="flex flex-col items-center gap-4 relative py-2">
          
          {/* Recording Timer Banner */}
          {isRecording && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 animate-pulse text-[10px] font-bold z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Đang thu âm: {formatTime(recordingSeconds)}</span>
            </div>
          )}

          {/* Giant Mic Button */}
          <div className="relative">
            {isRecording && (
              <>
                <div className="absolute inset-[-12px] rounded-full border-2 border-indigo-500/30 animate-ping" />
                <div className="absolute inset-[-24px] rounded-full border border-indigo-500/10 animate-pulse" />
              </>
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`mic-button text-white flex items-center justify-center transition-all duration-300 active:scale-95 ${
                isRecording ? "scale-110" : ""
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 fill-white" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>

        {/* Playback & Submit actions */}
        {audioUrl && !isRecording && (
          <div className="w-full max-w-md pt-4 flex flex-col items-center gap-4 animate-fadeIn">
            
            {/* Audio player preview */}
            <div className="w-full p-3 rounded-[var(--radius-card)] bg-card border border-[rgba(0,0,0,0.1)] flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2 text-primary">
                <Volume2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Nghe lại giọng nói của bạn</span>
              </div>
              <audio src={audioUrl} controls className="h-8 max-w-[200px] text-xs" />
            </div>

            <div className="flex gap-3 w-full">
              <button className="flex-1 py-3 rounded-[var(--radius-btn)] border border-[rgba(0,0,0,0.1)] bg-card hover:bg-card hover:text-text-head text-text-muted text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thu âm lại</span>
              </button>

              <button
                onClick={() => handleEvaluation()}
                disabled={isEvaluating}
                className="flex-2 py-3 px-6 rounded-[var(--radius-card)] bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-teal-950/20 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gửi AI Phân Tích</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Khối Phản Hồi AI (Feedback Section - Bento Card #3) */}
      {evaluationResult && !isRecording && (
        <div className="rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-card p-6 shadow-xl space-y-6 animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.1)] pb-4">
            <div className="w-8 h-8 rounded-[var(--radius-btn)] bg-teal-500/10 border border-teal-300 flex items-center justify-center text-teal-600">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-head">Báo cáo đánh giá phát âm AI</h2>
              <p className="text-[10px] text-text-muted">Phân tích âm học chi tiết bằng Whisper & AI Coach</p>
            </div>
          </div>

          {/* Reward Notification Banner */}
          {rewardClaimed && (
            <div className="rounded-[var(--radius-card)] border border-teal-500/15 bg-gradient-to-r from-teal-500/10 to-teal-500/5 p-4 flex items-center justify-between shadow-md shadow-teal-950/10 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-card)] bg-teal-500/15 border border-teal-300 flex items-center justify-center text-teal-600 shadow-md">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text-head">Luyện tập xuất sắc!</h3>
                  <p className="text-[9px] text-text-muted">Bạn đã hoàn thành phát âm tự do với kết quả ấn tượng.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-[var(--radius-card)]">
                <span className="text-[10px] font-black text-teal-600">+50 XP</span>
                <span className="text-[10px] font-black text-amber-600">+2 💎</span>
              </div>
            </div>
          )}

          {/* Metrics Layout row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Accuracy Score Big Badge - Trái */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-page text-center space-y-3">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={evaluationResult.score >= 80 ? "#10B981" : evaluationResult.score >= 60 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="6"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * evaluationResult.score) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-text-head">{evaluationResult.score}</span>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Điểm AI</span>
                </div>
              </div>

              <div className="text-[10px] font-black uppercase tracking-wider">
                {evaluationResult.score >= 85 ? (
                  <span className="text-teal-600">Tuyệt Hảo (Excellent)</span>
                ) : evaluationResult.score >= 70 ? (
                  <span className="text-primary">Khá Tốt (Good)</span>
                ) : (
                  <span className="text-amber-500">Cần Cố Gắng (Keep Trying)</span>
                )}
              </div>
            </div>

            {/* Biểu đồ Bar Chart 3 thanh ngang - Phải */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-4">
              
              {/* Ngữ điệu (Fluency) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-text-muted">Ngữ điệu (Fluency)</span>
                  <span className="font-bold text-primary">{evaluationResult.fluency}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-card overflow-hidden border border-slate-900/40">
                  <div
                    style={{ width: `${evaluationResult.fluency}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Độ chuẩn (Pronunciation) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-text-muted">Độ chuẩn (Pronunciation)</span>
                  <span className="font-bold text-teal-600">{evaluationResult.pronunciation}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-card overflow-hidden border border-slate-900/40">
                  <div
                    style={{ width: `${evaluationResult.pronunciation}%` }}
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Trọng âm (Stress) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-text-muted">Trọng âm (Stress)</span>
                  <span className="font-bold text-amber-600">{evaluationResult.accuracy}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-card overflow-hidden border border-slate-900/40">
                  <div
                    style={{ width: `${evaluationResult.accuracy}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Word-by-word Match Highlight */}
          <div className="p-4 rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] bg-page space-y-3 shadow-inner">
            <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">
              Bôi màu chi tiết từng chữ phát âm
            </label>
            
            <div className="flex flex-wrap gap-x-2 gap-y-2 text-sm leading-relaxed p-1 select-all">
              {evaluationResult.words.map((w, idx) => {
                let colorClass = "text-text-muted bg-card border-[rgba(0,0,0,0.1)]";
                
                if (w.status === "correct") {
                  colorClass = "text-teal-600 bg-teal-500/10 border-teal-300";
                } else if (w.status === "mispronounced") {
                  colorClass = "text-amber-600 bg-amber-500/10 border-amber-300";
                } else if (w.status === "omitted") {
                  colorClass = "text-rose-600 bg-rose-500/10 border-rose-500/20";
                }
                
                return (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-md border text-xs md:text-sm font-bold transition-all ${colorClass}`}
                    title={`Trạng thái: ${w.status === "correct" ? "Chính xác" : w.status === "mispronounced" ? "Phát âm lệch/sai âm" : "Đọc thiếu/bỏ sót"}`}
                  >
                    {w.word}
                  </span>
                );
              })}
            </div>

            {/* Explanatory Legend */}
            <div className="flex items-center gap-4 pt-3 border-t border-[rgba(0,0,0,0.1)] text-[9px] text-text-muted font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-teal-400/80 block" />
                <span>Phát âm đúng</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-amber-400/80 block" />
                <span>Phát âm lệch</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-rose-400/80 block" />
                <span>Bỏ sót từ</span>
              </div>
            </div>
          </div>

          {/* AI Coach Feedback Panel */}
          <div className="p-4 rounded-[var(--radius-card)] border border-indigo-500/15 bg-gradient-to-br from-indigo-50 to-blue-50 border-primary-dark flex gap-4 items-start shadow-inner">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-600 flex items-center justify-center font-bold text-text-head text-xs shrink-0 shadow-md">
              AI
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Nhận xét từ AI Coach</div>
              <p className="text-xs md:text-sm text-text-body leading-relaxed font-medium">
                &ldquo;{evaluationResult.feedback}&rdquo;
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
