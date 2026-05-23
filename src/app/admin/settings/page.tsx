"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Key, Building2, ShieldAlert, CheckCircle, Save } from "lucide-react";

export default function AdminSettings() {
  const [showToast, setShowToast] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  
  const [apiKeys, setApiKeys] = useState({
    groq: "",
    openai: ""
  });

  const [bankInfo, setBankInfo] = useState({
    bankName: "Ngân hàng TMCP Quân đội (MB)",
    accountNumber: "0123456789",
    ownerName: "GLOBAL SUCCESS AI JSC"
  });

  useEffect(() => {
    // Load config from localStorage
    const mainMode = localStorage.getItem("gsa-maintenance-mode") === "true";
    setIsMaintenance(mainMode);

    const storedKeys = localStorage.getItem("gsa-admin-api-keys");
    if (storedKeys) {
      try { setApiKeys(JSON.parse(storedKeys)); } catch(e){}
    }

    const storedBank = localStorage.getItem("gsa-admin-bank");
    if (storedBank) {
      try { setBankInfo(JSON.parse(storedBank)); } catch(e){}
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("gsa-maintenance-mode", isMaintenance.toString());
    localStorage.setItem("gsa-admin-api-keys", JSON.stringify(apiKeys));
    localStorage.setItem("gsa-admin-bank", JSON.stringify(bankInfo));
    
    // Bắn event để LayoutWrapper catch
    window.dispatchEvent(new Event("settings-updated"));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-full p-6 space-y-6 select-none bg-[#090D16]">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[99] bg-gradient-to-r from-teal-500 to-teal-400 text-black font-black text-xs px-6 py-3 rounded-[var(--radius-card)] shadow-2xl shadow-teal-500/30 flex items-center gap-2 border border-teal-300/40"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Lưu cấu hình hệ thống thành công!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[var(--radius-card)] bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
              Cấu Hình Hệ Thống
            </h1>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-0.5">
              API Keys, Thanh toán & Bảo mật
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-6 py-3 rounded-[var(--radius-card)] bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_4px_0_#4c1d95] active:translate-y-[2px] active:shadow-none"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cấu Hình</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* API KEYS CONFIG */}
        <div className="bg-[#111827] border border-slate-800 rounded-[var(--radius-card)] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-6">
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-black uppercase tracking-wider">Cổng Kết Nối Trí Tuệ Nhân Tạo</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">GROQ API KEY (Chấm điểm phát âm)</label>
              <input 
                type="password"
                value={apiKeys.groq}
                onChange={(e) => setApiKeys({...apiKeys, groq: e.target.value})}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[#090D16] border border-slate-800 text-slate-300 text-xs rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">OPENAI API KEY (Chatbot & Gợi ý)</label>
              <input 
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[#090D16] border border-slate-800 text-slate-300 text-xs rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* BANK CONFIG */}
        <div className="bg-[#111827] border border-slate-800 rounded-[var(--radius-card)] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-6">
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800/60 pb-3">
            <Building2 className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-black uppercase tracking-wider">Cấu Hình Cổng Thanh Toán PRO</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tên Ngân Hàng</label>
              <input 
                type="text"
                value={bankInfo.bankName}
                onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                className="w-full bg-[#090D16] border border-slate-800 text-slate-300 text-xs rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Số Tài Khoản Nhận</label>
              <input 
                type="text"
                value={bankInfo.accountNumber}
                onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                className="w-full bg-[#090D16] border border-slate-800 text-slate-300 text-xs rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono font-bold text-teal-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tên Chủ Tài Khoản</label>
              <input 
                type="text"
                value={bankInfo.ownerName}
                onChange={(e) => setBankInfo({...bankInfo, ownerName: e.target.value})}
                className="w-full bg-[#090D16] border border-slate-800 text-slate-300 text-xs rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-bold uppercase"
              />
            </div>
          </div>
        </div>

        {/* MAINTENANCE MODE */}
        <div className="lg:col-span-2 bg-[#111827] border border-rose-500/20 rounded-[var(--radius-card)] p-6 shadow-[0_8px_30px_rgba(225,29,72,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className={`w-6 h-6 text-rose-500 ${isMaintenance ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <h2 className="text-sm font-black text-rose-400 uppercase tracking-wider">Chế Độ Bảo Trì Toàn Hệ Thống</h2>
              <p className="text-xs text-text-muted font-medium mt-1">Khi kích hoạt, toàn bộ cổng K-12 sẽ bị đóng lại. Học sinh không thể truy cập.</p>
            </div>
          </div>
          
          {/* Toggle Switch */}
          <div 
            onClick={() => setIsMaintenance(!isMaintenance)}
            className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out border ${
              isMaintenance ? "bg-rose-500 border-rose-600" : "bg-slate-800 border-slate-700"
            }`}
          >
            <motion.div 
              className="w-6 h-6 rounded-full bg-card shadow-md"
              animate={{ x: isMaintenance ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
