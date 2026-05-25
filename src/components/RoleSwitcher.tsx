"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, BookOpen, GraduationCap, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoleSwitcher() {
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = () => {
      const uStr = localStorage.getItem("gsa-current-user");
      if (uStr) {
        try {
          const u = JSON.parse(uStr);
          setRole(u.role?.toLowerCase() || null);
        } catch (e) {}
      } else {
        setRole(null);
      }
    };
    loadUser();
    window.addEventListener("auth-changed", loadUser);
    return () => window.removeEventListener("auth-changed", loadUser);
  }, []);

  // Chỉ hiển thị cho Admin và Teacher
  if (!role || role === "student") return null;

  // Xác định giao diện đang xem dựa vào URL
  const currentView = pathname.startsWith("/admin") 
    ? "admin" 
    : pathname.startsWith("/teacher") 
      ? "teacher" 
      : "student";

  const getRoleLabel = (r: string) => {
    switch (r) {
      case "admin": return { label: "Admin Portal", icon: <ShieldCheck className="w-4 h-4" /> };
      case "teacher": return { label: "Teacher Dashboard", icon: <BookOpen className="w-4 h-4" /> };
      case "student": return { label: "Student View", icon: <GraduationCap className="w-4 h-4" /> };
    }
    return { label: "", icon: null };
  };

  const handleSwitch = (targetRole: string) => {
    setIsOpen(false);
    switch (targetRole) {
      case "admin": router.push("/admin"); break;
      case "teacher": router.push("/teacher"); break;
      case "student": router.push("/learn"); break;
    }
  };

  return (
    <div className="fixed bottom-24 left-6 z-[9999] flex flex-col items-start select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 bg-white rounded-[var(--radius-card)] shadow-2xl border border-slate-200 overflow-hidden min-w-[220px]"
          >
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Chuyển đổi giao diện</span>
            </div>
            
            {role === "admin" && (
              <button 
                onClick={() => handleSwitch("admin")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${currentView === "admin" ? "bg-rose-50 text-rose-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </button>
            )}
            
            {(role === "admin" || role === "teacher") && (
              <button 
                onClick={() => handleSwitch("teacher")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold border-t border-slate-100 transition-colors ${currentView === "teacher" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <BookOpen className="w-4 h-4" /> Teacher Dashboard
              </button>
            )}
            
            <button 
              onClick={() => handleSwitch("student")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold border-t border-slate-100 transition-colors ${currentView === "student" ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <GraduationCap className="w-4 h-4" /> Student View
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-full shadow-xl hover:bg-slate-800 transition-colors border border-slate-700 group hover:scale-105 active:scale-95 duration-200"
      >
        {getRoleLabel(currentView).icon}
        <span className="text-sm font-bold ml-1">{getRoleLabel(currentView).label}</span>
        <ChevronUp className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? "rotate-180 text-rose-400" : "text-slate-400 group-hover:text-white"}`} />
      </button>
    </div>
  );
}
