"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, Image as ImageIcon } from "lucide-react";
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

          <div className="w-full flex flex-col items-center justify-center p-4 bg-[#0a0d14] rounded-2xl border border-slate-800">
            {/* Audio Player Section */}
            {mainAudio && (
              <div className="w-full mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-indigo-400 text-xs font-bold">MP3</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-300">File Nghe Gốc (Native Speaker)</span>
                </div>
                <audio controls className="w-full h-10 outline-none rounded-lg" key={mainAudio}>
                  <source src={mainAudio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                
                {/* Playlist (nếu có nhiều track) */}
                {audioTracks && audioTracks.length > 1 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-slate-500 mr-2 flex items-center">Các Track khác:</span>
                    {audioTracks.map((track, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          const audioEl = document.querySelector('audio');
                          if (audioEl) {
                            audioEl.src = track;
                            audioEl.play().catch(e => console.log("Auto-play prevented", e));
                          }
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-medium text-slate-300 transition-colors border border-slate-700 hover:border-slate-500"
                      >
                        Track {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-[50vh] object-contain rounded-xl"
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
