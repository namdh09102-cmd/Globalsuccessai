"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface VisualRoomProps {
  lessonId: string;
  title: string;
  imageUrl: string;
  onBack: () => void;
  onComplete: (score: number) => void;
}

export default function VisualRoom({
  lessonId,
  title,
  imageUrl,
  onBack,
  onComplete,
}: VisualRoomProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Về Bảng Điều Khiển
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full bg-[#111625] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-1">
                  MINDMAP & VOCABULARY
                </h2>
                <h3 className="text-xl font-bold text-white">{title}</h3>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center p-4 bg-[#0a0d14] rounded-2xl border border-slate-800">
            <img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-[60vh] object-contain rounded-xl"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onComplete(100)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center gap-2 transform hover:-translate-y-0.5"
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
