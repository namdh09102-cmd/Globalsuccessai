"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ChevronRight,
  RotateCcw,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: "A" | "B" | "C" | "D";
}

interface QuizRoomProps {
  lessonTitle: string;
  questions?: QuizQuestion[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

const fallbackQuestions: QuizQuestion[] = [
  {
    question: "You ______ consult your parents before deciding on a career path, as their advice is valuable.",
    options: [
      "A. must",
      "B. should",
      "C. have to",
      "D. ought"
    ],
    correctAnswer: "B"
  },
  {
    question: "The difference in attitude or behavior between older and younger generations is called generation ______.",
    options: [
      "A. space",
      "B. bridge",
      "C. gap",
      "D. split"
    ],
    correctAnswer: "C"
  }
];

export default function QuizRoom({
  lessonTitle,
  questions = fallbackQuestions,
  onComplete,
  onBack
}: QuizRoomProps) {
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  
  // Hiệu ứng pháo hoa nhẹ (chỉ lưu tọa độ hạt để vẽ)
  const [fireworks, setFireworks] = useState<{id: number, x: number, y: number, color: string}[]>([]);

  const activeQuestion = questions[currentIdx] || fallbackQuestions[0];

  // Bắn pháo hoa khi trả lời đúng
  const triggerFireworks = () => {
    const colors = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];
    const newParticles = [...Array(15)].map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: -50 - Math.random() * 100,
      color: colors[i % colors.length]
    }));
    setFireworks(newParticles);
    // Cleanup sau 1.5 giây
    setTimeout(() => setFireworks([]), 1500);
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    const letter = opt.substring(0, 1) as "A" | "B" | "C" | "D";
    setSelectedOption(letter);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;

    const correct = selectedOption === activeQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScore(score + 1);
      triggerFireworks();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Đã trả lời hết các câu hỏi
      onComplete(Math.round((score / questions.length) * 100));
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setScore(0);
  };

  // Ánh xạ chữ cái thành Index của mảng options (A->0, B->1, C->2, D->3)
  const letterToIdx = (letter: "A" | "B" | "C" | "D") => {
    return { A: 0, B: 1, C: 2, D: 3 }[letter];
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-[#0B0F19] text-slate-300 relative overflow-hidden">
      
      {/* Nút quay lại */}
      <button
        onClick={onBack}
        className="self-start mb-6 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:text-slate-100 hover:bg-slate-800/40 transition-all text-xs font-semibold flex items-center gap-1.5 z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Về Bảng Điều Khiển
      </button>

      {/* CSS-based Sparkles/Fireworks container */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {fireworks.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ 
              scale: [0.5, 1.2, 0], 
              x: p.x, 
              y: p.y, 
              opacity: [1, 0.8, 0] 
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#151B2B] p-8 space-y-8 shadow-2xl relative overflow-hidden z-10 pb-12">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Room Header */}
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow">
              <HelpCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black text-violet-400 tracking-wider uppercase">
                Quiz Room (Offline)
              </span>
              <h2 className="text-sm font-bold text-slate-200">{lessonTitle}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-violet-600/10 text-violet-400 border border-violet-500/20 uppercase">
              Câu {currentIdx + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Center Question Text */}
        <div className="text-center py-6 px-4 relative z-10">
          <h3 className="text-base font-extrabold text-white leading-relaxed font-sans">
            {activeQuestion.question}
          </h3>
        </div>

        {/* 2x2 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {activeQuestion.options.map((opt) => {
            const letter = opt.substring(0, 1) as "A" | "B" | "C" | "D";
            const isSelected = selectedOption === letter;
            
            // CSS classes for 3D buttons
            // Khi được chọn: dịch chuyển xuống (translate-y-[4px]), shadow đáy giảm về 0, viền tím.
            return (
              <div
                key={opt}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl border transition-all duration-100 cursor-pointer select-none relative ${
                  isSelected
                    ? "bg-[#1d1b33] border-violet-500 translate-y-[4px] shadow-[0_0px_0_#0a0f19]"
                    : "bg-[#151B2B] border-slate-800 hover:border-slate-700 hover:bg-[#182033] shadow-[0_4px_0_#0a0f19] active:translate-y-[4px] active:shadow-[0_0px_0_#0a0f19]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border transition-colors ${
                    isSelected
                      ? "bg-violet-500 border-violet-400 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}>
                    {letter}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {opt.substring(2).trim()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submission Panel (Bottom button) */}
        {!isSubmitted && (
          <div className="flex justify-end pt-4 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`px-8 py-2.5 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-lg ${
                selectedOption
                  ? "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-950/20"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              <span>Kiểm Tra</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* ========================================================
          BOTTOM FEEDBACK RIBBON/BAR (Absolutely positioned at screen bottom)
          ======================================================== */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur border-t px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-3xl shadow-2xl ${
              isCorrect
                ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                : "bg-rose-950/80 border-rose-800 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}>
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                ) : (
                  <XCircle className="w-6 h-6 animate-pulse" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-black tracking-wide uppercase">
                  {isCorrect ? "Câu Trả Lời Chính Xác!" : "Ồ! Chưa Chính Xác Rồi"}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isCorrect
                    ? "Bạn đã xuất sắc làm đúng câu hỏi này! Hãy tiếp tục phát huy."
                    : `Đáp án đúng là ${activeQuestion.correctAnswer}: ${activeQuestion.options[letterToIdx(activeQuestion.correctAnswer)].substring(2).trim()}`}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 self-end sm:self-auto shadow-md ${
                isCorrect
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              }`}
            >
              <span>{currentIdx + 1 < questions.length ? "Câu tiếp theo" : "Hoàn thành thử thách"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
