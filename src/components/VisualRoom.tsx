"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight, Grid, BookOpen } from "lucide-react";
import Image from "next/image";

interface VisualRoomProps {
  lessonId: string;
  title: string;
  imageUrl: string;
  mainAudio?: string;
  audioTracks?: string[];
  onBack: () => void;
  onComplete: (score: number) => void;
}

export default function VisualRoom({
  lessonId,
  title,
  imageUrl,
  mainAudio,
  audioTracks,
  onBack,
  onComplete,
}: VisualRoomProps) {
  const [flashcards, setFlashcards] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"mindmap" | "flashcards">("mindmap");

  useEffect(() => {
    // Extract unit number from lessonId (e.g. u1-l1 or unit-1-l1)
    const match = lessonId.match(/u(?:nit-)?(\d+)/i);
    if (match) {
      const unitNum = match[1];
      fetch("/flashcards/l1_index.json")
        .then(res => res.json())
        .then(data => {
          if (data[`u${unitNum}`]) {
            setFlashcards(data[`u${unitNum}`]);
          }
        })
        .catch(e => console.log("No flashcards found"));
    }
  }, [lessonId]);
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-card)] text-sm font-bold text-text-body hover:text-primary bg-card hover:bg-primary-light border border-[rgba(0,0,0,0.1)] transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Về Bảng Điều Khiển
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full bg-card border border-[rgba(0,0,0,0.1)] rounded-[var(--radius-card)] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-light rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-card)] bg-primary/20 border border-indigo-500/30 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-1">
                  MINDMAP & FLASHCARDS
                </h2>
                <h3 className="text-xl font-bold text-white">{title}</h3>
              </div>
            </div>
            
            {flashcards.length > 0 && (
              <div className="flex bg-card p-1 rounded-[var(--radius-btn)] border border-[rgba(0,0,0,0.1)]">
                <button 
                  onClick={() => setViewMode("mindmap")}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${viewMode === "mindmap" ? "bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] text-white" : "text-text-muted hover:text-white"}`}
                >
                  <Grid className="w-4 h-4" /> Mindmap
                </button>
                <button 
                  onClick={() => setViewMode("flashcards")}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${viewMode === "flashcards" ? "bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] text-white" : "text-text-muted hover:text-white"}`}
                >
                  <BookOpen className="w-4 h-4" /> Flashcards
                </button>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col items-center justify-center p-4 bg-page rounded-[var(--radius-card)] border border-[rgba(0,0,0,0.1)] min-h-[400px]">
            {/* Audio Player Section */}
            {mainAudio && (
              <div className="w-full mb-6 p-4 bg-primary-light/50 rounded-[var(--radius-card)] border border-indigo-100 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-indigo-400 text-xs font-bold">MP3</span>
                  </div>
                  <span className="text-sm font-bold text-text-body">File Nghe Gốc (Native Speaker)</span>
                </div>
                <audio controls className="w-full h-10 outline-none rounded-[var(--radius-btn)]" key={mainAudio}>
                  <source src={mainAudio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {viewMode === "mindmap" ? (
              <img
                src={imageUrl}
                alt={title}
                className="max-w-full max-h-[60vh] object-contain rounded-[var(--radius-card)]"
              />
            ) : (
              <div className="w-full relative flex flex-col items-center justify-center">
                <div className="relative w-full max-w-2xl h-[50vh] flex items-center justify-center bg-card rounded-[var(--radius-card)] shadow-inner border border-[rgba(0,0,0,0.1)] overflow-hidden">
                  <img 
                    src={flashcards[currentIndex]} 
                    alt="Flashcard" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-6 mt-6">
                  <button 
                    onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : flashcards.length - 1)}
                    className="w-12 h-12 rounded-full bg-slate-800 hover:bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="text-white font-bold">{currentIndex + 1} / {flashcards.length}</span>
                  <button 
                    onClick={() => setCurrentIndex(prev => prev < flashcards.length - 1 ? prev + 1 : 0)}
                    className="w-12 h-12 rounded-full bg-slate-800 hover:bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onComplete(100)}
              className="px-8 py-3 bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] hover:bg-primary text-white rounded-[var(--radius-card)] font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <CheckCircle2 className="w-5 h-5" />
              Đã hiểu & Hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
