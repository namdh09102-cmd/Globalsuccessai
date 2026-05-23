"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, FileText, Headphones } from "lucide-react";

interface WorksheetRoomProps {
  title: string;
  worksheetUrl: string;
  mainAudio?: string;
  onBack: () => void;
}

export default function WorksheetRoom({
  title,
  worksheetUrl,
  mainAudio,
  onBack,
}: WorksheetRoomProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(worksheetUrl)
      .then(res => res.text())
      .then(data => {
        setHtmlContent(data);
        setLoading(false);
      })
      .catch(e => {
        console.error("Lỗi tải Worksheet", e);
        setLoading(false);
      });
  }, [worksheetUrl]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center pb-20 h-screen overflow-hidden">
      {/* Sticky Header */}
      <div className="w-full bg-slate-50 backdrop-blur-xl border-b border-slate-200 p-4 flex items-center justify-between shadow-xl shrink-0">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <h1 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          {title}
        </h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="w-full flex-1 overflow-y-auto px-4 py-8 custom-scrollbar bg-slate-50">
        
        {mainAudio && (
          <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-3 shadow-lg">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <Headphones className="w-6 h-6 text-blue-400" />
              File Nghe (Listening Section)
            </h2>
            <audio controls className="w-full h-12 outline-none rounded-lg bg-slate-100" src={mainAudio}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {worksheetUrl.toLowerCase().endsWith(".pdf") ? (
          <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden h-[80vh]">
            <iframe 
              src={worksheetUrl} 
              className="w-full h-full border-0" 
              title={title}
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden p-8 min-h-[60vh]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div 
                className="prose prose-slate max-w-none prose-img:rounded-xl prose-img:border prose-img:border-slate-200"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
