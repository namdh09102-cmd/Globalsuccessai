"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, CheckCircle2, PlayCircle, Headphones, BookOpen } from "lucide-react";

interface ExamQuestion {
  id: string;
  section: "Listening" | "Reading" | "Writing";
  text: string;
  options: string[];
  correctAnswer: string;
}

interface ExamRoomProps {
  examTitle: string;
  durationMinutes: number;
  audioUrl?: string;
  questions: ExamQuestion[];
  onBack: () => void;
  onComplete: (score: number) => void;
}

export default function ExamRoom({
  examTitle,
  durationMinutes,
  audioUrl,
  questions,
  onBack,
  onComplete,
}: ExamRoomProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Timer logic
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (qId: string, opt: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] && answers[q.id].charAt(0) === q.correctAnswer) {
        correct++;
      }
    });
    const score = Math.round((correct / questions.length) * 100);
    setFinalScore(score);
    setIsSubmitted(true);
  };

  const listeningQuestions = questions.filter((q) => q.section === "Listening");
  const readingQuestions = questions.filter((q) => q.section === "Reading");
  const writingQuestions = questions.filter((q) => q.section === "Writing");

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 w-full bg-slate-50 backdrop-blur-xl border-b border-slate-200 p-4 flex items-center justify-between shadow-xl mb-8">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-700 text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <h1 className="text-lg font-black text-white uppercase tracking-widest">{examTitle}</h1>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${timeLeft < 300 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'}`}>
          <Clock className="w-5 h-5" />
          <span className="text-xl tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="w-full space-y-12 px-4">
        {/* SECTION: LISTENING */}
        {listeningQuestions.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Headphones className="w-8 h-8 text-blue-400" />
              SECTION 1: LISTENING
            </h2>
            
            {audioUrl && (
              <div className="w-full mb-8 p-4 bg-[#0a0d14] rounded-xl border border-slate-200 flex flex-col gap-3">
                <span className="text-sm font-semibold text-slate-500">File Nghe Bài Thi</span>
                <audio controls className="w-full h-12 outline-none rounded-lg" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className="space-y-6">
              {listeningQuestions.map((q, idx) => (
                <QuestionItem key={q.id} index={idx + 1} question={q} selected={answers[q.id]} onSelect={(o: string) => handleSelect(q.id, o)} isSubmitted={isSubmitted} />
              ))}
            </div>
          </div>
        )}

        {/* SECTION: READING */}
        {readingQuestions.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500" />
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-teal-400" />
              SECTION 2: READING
            </h2>
            <div className="space-y-6">
              {readingQuestions.map((q, idx) => (
                <QuestionItem key={q.id} index={listeningQuestions.length + idx + 1} question={q} selected={answers[q.id]} onSelect={(o: string) => handleSelect(q.id, o)} isSubmitted={isSubmitted} />
              ))}
            </div>
          </div>
        )}

        {/* SECTION: WRITING */}
        {writingQuestions.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">✍️</span>
              SECTION 3: WRITING
            </h2>
            <div className="space-y-6">
              {writingQuestions.map((q, idx) => (
                <QuestionItem key={q.id} index={listeningQuestions.length + readingQuestions.length + idx + 1} question={q} selected={answers[q.id]} onSelect={(o: string) => handleSelect(q.id, o)} isSubmitted={isSubmitted} />
              ))}
            </div>
          </div>
        )}

        {/* Nộp bài */}
        {!isSubmitted ? (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleSubmit}
              className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white rounded-xl font-black text-xl shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all hover:scale-105"
            >
              NỘP BÀI THI
            </button>
          </div>
        ) : (
          <div className="mt-12 bg-gradient-to-br from-indigo-900/40 to-indigo-900/40 border border-indigo-500/50 rounded-xl p-10 flex flex-col items-center text-center shadow-[0_0_50px_rgba(79,70,229,0.2)]">
            <h3 className="text-4xl font-black text-white mb-4">Kết Quả Bài Thi</h3>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mb-8">
              {finalScore} / 100
            </div>
            <button
              onClick={() => onComplete(finalScore)}
              className="px-8 py-3 bg-white text-indigo-900 hover:bg-slate-200 rounded-xl font-bold text-lg transition-all"
            >
              Hoàn tất & Về trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionItem({ question, index, selected, onSelect, isSubmitted }: any) {
  const isCorrect = isSubmitted && selected && selected.charAt(0) === question.correctAnswer;
  const isWrong = isSubmitted && selected && selected.charAt(0) !== question.correctAnswer;

  return (
    <div className={`p-6 rounded-xl border ${isCorrect ? 'bg-teal-500/10 border-teal-500/50' : isWrong ? 'bg-rose-500/10 border-rose-500/50' : 'bg-[#0a0d14] border-slate-200'}`}>
      <p className="text-lg font-semibold text-slate-800 mb-4">
        <span className="text-indigo-400 mr-2">Câu {index}:</span>
        {question.text}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((opt: string) => {
          const isChosen = selected === opt;
          const showAsCorrect = isSubmitted && opt.charAt(0) === question.correctAnswer;
          
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              disabled={isSubmitted}
              className={`text-left p-4 rounded-xl border transition-all ${
                showAsCorrect ? 'bg-teal-500 border-teal-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                isChosen && isWrong ? 'bg-rose-500 border-rose-400 text-white' :
                isChosen ? 'bg-indigo-600 border-indigo-400 text-white' :
                'bg-slate-800/50 border-slate-300 text-slate-700 hover:bg-slate-800 hover:border-slate-500'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
