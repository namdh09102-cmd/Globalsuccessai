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
} from "lucide-react";

export default function AdminPortal() {
  return (
    <div className="min-h-full p-6 space-y-6 select-none bg-[#090D16]">

      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            Quyền năng định đoạt toàn hệ thống
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* ========================================================
            BENTO CARD #1: KHỐI THỐNG KÊ TOÀN CỤC (System Matrix)
            ======================================================== */}
        <div className="xl:col-span-1 rounded-3xl bg-[#151B2B] border border-slate-800 p-6 flex flex-col space-y-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <h2 className="text-sm font-black uppercase tracking-wider">Trung Tâm Điều Hành Hệ Thống</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="rounded-2xl bg-[#0B0F19]/80 border border-slate-800/80 p-4 space-y-2 group hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center gap-2 text-indigo-400">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Tổng học viên</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">12,450</span>
                <p className="text-[9px] text-emerald-400 font-bold mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Tăng 15% tuần này
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0B0F19]/80 border border-slate-800/80 p-4 space-y-2 group hover:border-rose-500/40 transition-colors">
              <div className="flex items-center gap-2 text-rose-400">
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">TK Giáo viên</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-rose-300 transition-colors">320</span>
                <p className="text-[9px] text-slate-500 font-bold mt-1">Trường & Trung tâm</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0B0F19]/80 border border-slate-800/80 p-4 space-y-2 group hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400">
                <Wallet className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Doanh thu PRO</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">45.8M</span>
                <p className="text-[9px] text-slate-500 font-bold mt-1">Đồng bộ VietQR</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0B0F19]/80 border border-slate-800/80 p-4 space-y-2 group hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-2 text-violet-400">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Tỷ lệ chuyển đổi</span>
              </div>
              <div>
                <span className="text-xl font-black text-white group-hover:text-violet-300 transition-colors">4.2%</span>
                <p className="text-[9px] text-emerald-400 font-bold mt-1 flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> Đạt mục tiêu
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
