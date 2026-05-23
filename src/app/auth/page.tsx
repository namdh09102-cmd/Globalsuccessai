"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ShieldCheck, Rocket, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // "student" or "teacher"
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // MOCK ADMIN ACCOUNT
  const ADMIN_CREDS = { email: "admin@globalsuccess.ai", password: "admin123" };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // 1. ADMIN LOGIN HARDCODE
      if (isLogin && email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
        const adminUser = { id: "ADMIN-000", name: "Super Admin", email, role: "admin", tier: "pro" };
        localStorage.setItem("gsa-current-user", JSON.stringify(adminUser));
        window.dispatchEvent(new Event("auth-changed"));
        router.push("/admin");
        return;
      }

      const storedUsersStr = localStorage.getItem("gsa-users");
      let storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [
        { id: "ADMIN-000", name: "Super Admin", email: "admin@globalsuccess.ai", password: "admin123", role: "admin", tier: "pro", joinDate: "2026-01-01" },
        { id: "TEACHER-001", name: "Đinh Hoàng Nam", email: "teacher@globalsuccess.ai", password: "teacher123", role: "teacher", tier: "pro", joinDate: "2026-05-01" },
        { id: "STUDENT-001", name: "Khánh Tân", email: "student@globalsuccess.ai", password: "student123", role: "student", tier: "free", joinDate: "2026-05-20" }
      ];

      // Save initial users back if it was empty to ensure they persist
      if (!storedUsersStr) {
        localStorage.setItem("gsa-users", JSON.stringify(storedUsers));
      }

      if (isLogin) {
        // ĐĂNG NHẬP
        const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
        if (foundUser) {
          localStorage.setItem("gsa-current-user", JSON.stringify({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            tier: foundUser.tier
          }));
          window.dispatchEvent(new Event("auth-changed"));
          
          if (foundUser.role === "teacher") {
            router.push("/teacher");
          } else {
            router.push("/learn");
          }
        } else {
          setError("Email hoặc mật khẩu không chính xác!");
          setIsLoading(false);
        }
      } else {
        // ĐĂNG KÝ
        const isExist = storedUsers.some((u: any) => u.email === email);
        if (isExist) {
          setError("Email này đã được đăng ký!");
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          name,
          email,
          password,
          role,
          tier: "free",
          joinDate: new Date().toISOString().split("T")[0]
        };

        storedUsers.push(newUser);
        localStorage.setItem("gsa-users", JSON.stringify(storedUsers));
        
        // Auto login
        localStorage.setItem("gsa-current-user", JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          tier: newUser.tier
        }));
        window.dispatchEvent(new Event("auth-changed"));

        if (newUser.role === "teacher") {
          router.push("/teacher");
        } else {
          router.push("/learn");
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Auth Card */}
      <motion.div 
        layout
        className="w-full max-w-md bg-slate-50 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <ShieldCheck className="w-7 h-7 text-slate-800" />
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
            {isLogin ? "Đăng Nhập Hệ Thống" : "Tạo Tài Khoản Mới"}
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">
            Global Success AI Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và Tên của bạn" 
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Rocket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="student">Học sinh K-12</option>
                    <option value="teacher">Giáo viên / Phụ huynh</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email đăng nhập" 
              className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu" 
              className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-rose-600 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-xs font-semibold"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-slate-800 text-sm font-black uppercase tracking-wider shadow-[0_4px_0_#3730a3] hover:shadow-[0_2px_0_#3730a3] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "Truy Cập Ngay" : "Hoàn Tất Đăng Ký"}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-600 font-bold hover:text-indigo-600 transition-colors ml-1"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>



      </motion.div>
    </div>
  );
}
