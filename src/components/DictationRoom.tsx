"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Square, 
  HelpCircle, 
  Check, 
  AlertCircle, 
  Volume2, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight,
  RotateCcw
} from "lucide-react";

interface DictationRoomProps {
  lessonTitle: string;
  expectedText: string;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function DictationRoom({
  lessonTitle,
  expectedText,
  onComplete,
  onBack
}: DictationRoomProps) {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInputs, setUserInputs] = useState<{[key: number]: string}>({});
  const [validation, setValidation] = useState<{[key: number]: "correct" | "incorrect" | "none"}>({});
  const [isChecked, setIsChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Phân tích câu: tách [word] thành mảng các phần tử
  // Ví dụ: "Generational conflict in families is often [caused] by different [views]"
  // Trả về: ["Generational conflict in families is often ", "caused", " by different ", "views"]
  // Index chẵn: từ/cụm từ thông thường
  // Index lẻ: từ khóa cần điền vào ô trống
  const parts = expectedText.split(/\[(.*?)\]/g);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    
    // Cleanup SpeechSynthesis khi thoát trang
    return () => {
      if (synthRef.current && isPlaying) {
        synthRef.current.cancel();
      }
    };
  }, [isPlaying]);

  // Phát âm thanh của câu đầy đủ (đã loại bỏ ngoặc vuông)
  const handlePlayAudio = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    // Làm sạch câu để đọc trôi chảy
    const cleanText = expectedText.replace(/\[(.*?)\]/g, "$1");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 0.85; // Đọc chậm một chút để luyện nghe chép
    
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    synthRef.current.speak(utterance);
  };

  const handleInputChange = (index: number, val: string) => {
    setUserInputs({
      ...userInputs,
      [index]: val
    });
    
    // Reset kiểm tra của ô này khi học sinh gõ lại
    if (isChecked) {
      setValidation({
        ...validation,
        [index]: "none"
      });
    }
  };

  // Kiểm tra đáp án
  const handleCheckAnswers = () => {
    let correctCount = 0;
    let blanksCount = 0;
    const newValidation = { ...validation };

    parts.forEach((part, idx) => {
      if (idx % 2 !== 0) { // Ô trống cần điền
        blanksCount++;
        const answer = part.trim().toLowerCase();
        const userInput = (userInputs[idx] || "").trim().toLowerCase();

        if (userInput === answer) {
          newValidation[idx] = "correct";
          correctCount++;
        } else {
          newValidation[idx] = "incorrect";
        }
      }
    });

    setValidation(newValidation);
    setIsChecked(true);

    if (correctCount === blanksCount) {
      setAllCorrect(true);
      // Gọi callback báo hoàn thành sau một nhịp trễ ngắn
      setTimeout(() => {
        onComplete(100);
      }, 1200);
    }
  };

  // Làm lại bài
  const handleReset = () => {
    setUserInputs({});
    setValidation({});
    setIsChecked(false);
    setAllCorrect(false);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-700">
      
      {/* Nút quay lại */}
      <button
        onClick={onBack}
        className="self-start mb-6 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-xs font-semibold flex items-center gap-1.5 text-slate-600 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Về Bảng Điều Khiển
      </button>

      {/* Thẻ luyện nghe trung tâm */}
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Room Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black text-blue-400 tracking-wider uppercase">
                Dictation Room (Offline)
              </span>
              <h2 className="text-sm font-bold text-slate-800">{lessonTitle}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              Focus Mode
            </span>
          </div>
        </div>

        {/* Audio Player Button (Ping soundwave effect) */}
        <div className="flex flex-col items-center justify-center py-6 space-y-3 z-10 relative">
          <div className="relative">
            {/* Ping animation effect */}
            {isPlaying && (
              <span className="absolute -inset-2 rounded-full bg-indigo-500/20 animate-ping" />
            )}
            
            <button
              onClick={handlePlayAudio}
              className={`w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-600 to-blue-500 hover:opacity-95 flex items-center justify-center text-white shadow-xl shadow-indigo-950/50 border border-indigo-500/30 transition-transform ${
                isPlaying ? "scale-95" : "hover:scale-105"
              }`}
            >
              {isPlaying ? (
                <Square className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              )}
            </button>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono">
            {isPlaying ? "Đang đọc mẫu..." : "Bấm Play để nghe"}
          </span>
        </div>

        {/* Interactive Text Display */}
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 leading-loose text-sm font-medium z-10 relative">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
            {parts.map((part, idx) => {
              if (idx % 2 === 0) {
                // Plain Text
                return (
                  <span key={idx} className="text-slate-700 font-sans leading-relaxed">
                    {part}
                  </span>
                );
              } else {
                // 3D Input blank space
                const isCorrect = validation[idx] === "correct";
                const isIncorrect = validation[idx] === "incorrect";
                
                return (
                  <input
                    key={idx}
                    type="text"
                    autoComplete="off"
                    value={userInputs[idx] || ""}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder={`[ô trống (${part.length} ký tự)]`}
                    style={isMobile ? { width: "100%" } : { width: `${Math.max(80, part.length * 11)}px` }}
                    className={`px-3 py-2 md:py-1 text-base md:text-xs font-bold font-mono text-center rounded-lg bg-white text-slate-800 placeholder-slate-400 outline-none transition-all border-b-2 w-full md:w-auto ${
                      isCorrect
                        ? "border-b-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                        : isIncorrect
                        ? "border-b-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.2)] animate-shake"
                        : "border-b-indigo-500/50 hover:border-b-indigo-400 focus:border-b-indigo-500"
                    }`}
                  />
                );
              }
            })}
          </div>
        </div>

        {/* Controls and Feedback Panel */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 z-10 relative">
          
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 border border-slate-200 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>

          {allCorrect ? (
            <div className="px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-extrabold flex items-center gap-1.5">
              <Check className="w-4 h-4 animate-bounce" />
              <span>Chính xác hoàn toàn! Đang lưu kết quả...</span>
            </div>
          ) : (
            <button
              onClick={handleCheckAnswers}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/15"
            >
              <span>Kiểm Tra Đáp Án</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
