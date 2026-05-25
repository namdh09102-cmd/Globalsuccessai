"use client";

import React from "react";
import { 
  Zap, 
  BookOpen, 
  Rocket, 
  TrendingUp, 
  Users, 
  Wallet, 
  Activity, 
  CheckCircle,
  BrainCircuit,
  Key
} from "lucide-react";

export default function AdminPortal() {
  const [apiKey, setApiKey] = React.useState("");

  React.useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key");
    if (saved) setApiKey(saved);
  }, []);

  const handleSaveApi = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    alert("Đã lưu Gemini API Key thành công! Gia sư AI đã sẵn sàng hoạt động.");
  };

  return (
    <div className="min-h-full p-6 space-y-6 select-none bg-[#090D16]">

      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
        <div className="w-12 h-12 rounded-[var(--radius-card)] bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Quyền năng định đoạt toàn hệ thống
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* ========================================================
            BENTO CARD #1: KHỐI THỐNG KÊ TOÀN CỤC (System Matrix)
            ======================================================== */}
        <div className="xl:col-span-1 rounded-[var(--radius-card)] bg-[#111827] border border-slate-800 p-6 flex flex-col space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <Zap className="w-5 h-5 text-amber-600 fill-amber-400/20" />
            <h2 className="text-sm font-black uppercase tracking-wider">Trung Tâm Điều Hành Hệ Thống</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="rounded-[var(--radius-card)] bg-[#090D16] border border-slate-800 p-4 space-y-2 group hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Tổng học viên</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-primary transition-colors">12,450</span>
                <p className="text-[9px] text-teal-400 font-bold mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Tăng 15% tuần này
                </p>
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-[#090D16] border border-slate-800 p-4 space-y-2 group hover:border-rose-500/40 transition-colors">
              <div className="flex items-center gap-2 text-rose-500">
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase text-slate-400">TK Giáo viên</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-rose-500 transition-colors">320</span>
                <p className="text-[9px] text-slate-500 font-bold mt-1">Trường & Trung tâm</p>
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-[#090D16] border border-slate-800 p-4 space-y-2 group hover:border-teal-500/40 transition-colors">
              <div className="flex items-center gap-2 text-teal-400">
                <Wallet className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Doanh thu PRO</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-teal-400 transition-colors">45.8M</span>
                <p className="text-[9px] text-slate-500 font-bold mt-1">Đồng bộ VietQR</p>
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] bg-[#090D16] border border-slate-800 p-4 space-y-2 group hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Tỷ lệ chuyển đổi</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-primary transition-colors">4.2%</span>
                <p className="text-[9px] text-teal-400 font-bold mt-1 flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> Đạt mục tiêu
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* ========================================================
            BENTO CARD #2: TÍCH HỢP AI (Gia sư AI)
            ======================================================== */}
        <div className="xl:col-span-1 rounded-[var(--radius-card)] bg-[#111827] border border-slate-800 p-6 flex flex-col space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <BrainCircuit className="w-5 h-5 text-rose-500" />
            <h2 className="text-sm font-black uppercase tracking-wider">Cấu hình Gia Sư AI</h2>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Nhập mã <span className="font-bold text-white">Gemini API Key</span> để kích hoạt chức năng Hỏi AI giải bài tập trực tiếp cho học sinh trên màn hình làm bài.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Key className="w-3 h-3" /> Gemini API Key
              </label>
              <input 
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-800 rounded-[var(--radius-card)] px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500/50 transition-colors placeholder-slate-600 font-mono"
              />
            </div>
            <button className="mt-auto w-full py-2.5 rounded-[var(--radius-btn)] bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
            >
              Lưu cấu hình AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
