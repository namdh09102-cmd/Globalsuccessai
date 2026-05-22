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
  Check,
  Bot,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  question: string;
  options: string[] | { [key: string]: string };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation?: string;
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

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  
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
    setShowAiModal(false);
    setAiResponse(null);
  };

  const handleAskAI = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      alert("Vui lòng nhập Gemini API Key trong trang Admin trước khi dùng Gia sư AI!");
      return;
    }

    setShowAiModal(true);
    setIsAiLoading(true);
    setAiResponse(null);

    const normalizedOpts = Array.isArray(activeQuestion.options)
      ? activeQuestion.options
      : Object.entries(activeQuestion.options).map(([k, v]) => `${k}. ${v}`);

    const prompt = `Bạn là một gia sư Tiếng Anh nhiệt tình, thân thiện.
Học sinh vừa làm câu hỏi sau:
Câu hỏi: ${activeQuestion.question}
Các đáp án:
${normalizedOpts.join("\n")}
Học sinh chọn: ${selectedOption}
Đáp án đúng là: ${activeQuestion.correctAnswer}
Hãy giải thích ngắn gọn, dễ hiểu tại sao đáp án ${activeQuestion.correctAnswer} là đúng, và tại sao ${selectedOption} là sai (nếu học sinh chọn sai). Khen ngợi hoặc động viên học sinh một cách dễ thương. Trình bày văn bản rõ ràng.`;

    try {
      // Gọi trực tiếp REST API của Gemini 1.5 Flash
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await res.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        setAiResponse(data.candidates[0].content.parts[0].text);
      } else {
        setAiResponse("Lỗi: AI không thể trả lời lúc này. Bạn kiểm tra lại API Key nhé.");
      }
    } catch (err) {
      setAiResponse("Lỗi kết nối tới AI: " + (err as Error).message);
    } finally {
      setIsAiLoading(false);
    }
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
          {(() => {
            const normalizedOptions = Array.isArray(activeQuestion.options)
              ? activeQuestion.options
              : Object.entries(activeQuestion.options).map(([k, v]) => `${k}. ${v}`);
            
            return normalizedOptions.map((opt) => {
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
            });
          })()}
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
                    : `Đáp án đúng là ${activeQuestion.correctAnswer}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={handleAskAI}
                className="px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] border border-slate-600 text-slate-200"
              >
                <Bot className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Hỏi Cô giáo AI</span>
              </button>

              <button
                onClick={handleNext}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md ${
                  isCorrect
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-rose-600 hover:bg-rose-500 text-white"
                }`}
              >
                <span>{currentIdx + 1 < questions.length ? "Câu tiếp theo" : "Hoàn thành thử thách"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Tutor Modal */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090D16]/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#151B2B] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Cô giáo AI</h3>
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Gemini Pro Tutor</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 rounded-full"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="min-h-[150px] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {isAiLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 pt-10">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                    <p className="text-xs font-bold animate-pulse">Cô giáo đang suy nghĩ...</p>
                  </div>
                ) : (
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
