"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ShieldCheck, Rocket, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // "student" or "teacher"
  const [gradeLevel, setGradeLevel] = useState("primary"); // "primary", "middle", "high"
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // MOCK ADMIN ACCOUNT
  const ADMIN_CREDS = { email: "admin@globalsuccess.ai", password: "admin123" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. ADMIN LOGIN HARDCODE (Tạo tài khoản qua auth API nếu muốn chuẩn, nhưng ta hardcode bypass ở đây nếu cần test)
      if (isLogin && email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
        // Cố gắng đăng nhập qua Supabase trước
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          // Nếu admin chưa tồn tại trong Supabase Auth, tự động tạo
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
          if (!signUpError && signUpData.user) {
            await supabase.from('profiles').upsert({ id: signUpData.user.id, name: "Super Admin", email, role: "admin", tier: "pro", grade_level: "none" });
          }
        }
        
        const adminUser = { id: "ADMIN-000", name: "Super Admin", email, role: "admin", tier: "pro", gradeLevel: "none" };
        localStorage.setItem("gsa-current-user", JSON.stringify(adminUser));
        window.dispatchEvent(new Event("auth-changed"));
        router.push("/admin");
        return;
      }

      if (isLogin) {
        // ĐĂNG NHẬP
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profile) {
            localStorage.setItem("gsa-current-user", JSON.stringify({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              tier: profile.tier,
              gradeLevel: profile.grade_level || "primary",
              avatarUrl: profile.avatar_url
            }));
            // Update profile cache
            localStorage.setItem("gsa-user-profile", JSON.stringify({
              fullName: profile.name,
              school: profile.school || "",
              grade: profile.grade_level ? `Lớp ${profile.grade_level}` : "",
              avatarUrl: profile.avatar_url
            }));
            
            window.dispatchEvent(new Event("auth-changed"));
            router.push(profile.role === "teacher" ? "/teacher" : (profile.role === "admin" ? "/admin" : "/learn"));
          } else {
             setError("Không tìm thấy hồ sơ người dùng trong Database.");
          }
        }
      } else {
        // ĐĂNG KÝ
        const { data, error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name,
            email,
            role,
            tier: "free",
            grade_level: role === "student" ? gradeLevel : "none",
          });

          if (profileError) {
            setError("Lỗi tạo hồ sơ: " + profileError.message);
            setIsLoading(false);
            return;
          }

          localStorage.setItem("gsa-current-user", JSON.stringify({
            id: data.user.id,
            name,
            email,
            role,
            tier: "free",
            gradeLevel: role === "student" ? gradeLevel : "none"
          }));
          window.dispatchEvent(new Event("auth-changed"));
          router.push(role === "teacher" ? "/teacher" : "/learn");
        }
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-page flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-light rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-light rounded-full blur-[100px] pointer-events-none" />
      
      {/* Auth Card */}
      <motion.div 
        layout
        className="w-full max-w-md bg-page backdrop-blur-xl border border-[rgba(0,0,0,0.1)] rounded-[var(--radius-card)] shadow-2xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-[var(--radius-card)] bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <ShieldCheck className="w-7 h-7 text-text-head" />
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
            {isLogin ? "Đăng Nhập Hệ Thống" : "Tạo Tài Khoản Mới"}
          </h1>
          <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-2">
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
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và Tên của bạn" 
                    className="w-full bg-card border border-[rgba(0,0,0,0.1)] text-text-head text-sm rounded-[var(--radius-card)] pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Rocket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-card border border-[rgba(0,0,0,0.1)] text-text-head text-sm rounded-[var(--radius-card)] pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="student">Học sinh K-12</option>
                    <option value="teacher">Giáo viên / Phụ huynh</option>
                  </select>
                </div>

                <AnimatePresence>
                  {role === "student" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative overflow-hidden"
                    >
                      <div className="pt-2">
                        <select 
                          value={gradeLevel}
                          onChange={(e) => setGradeLevel(e.target.value)}
                          className="w-full bg-card border border-[rgba(0,0,0,0.1)] text-text-head text-sm rounded-[var(--radius-card)] px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="primary">Cấp 1 (Lớp 1 - Lớp 5)</option>
                          <option value="middle">Cấp 2 (Lớp 6 - Lớp 9)</option>
                          <option value="high">Cấp 3 (Lớp 10 - Lớp 12)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email đăng nhập" 
              className="w-full bg-card border border-[rgba(0,0,0,0.1)] text-text-head text-sm rounded-[var(--radius-card)] pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu" 
              className="w-full bg-card border border-[rgba(0,0,0,0.1)] text-text-head text-sm rounded-[var(--radius-card)] pl-12 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-rose-600 bg-rose-500/10 border border-rose-500/20 p-3 rounded-[var(--radius-btn)] text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="w-full py-4 mt-2 rounded-[var(--radius-btn)] bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-text-head text-sm font-black uppercase tracking-wider shadow-[0_4px_0_#3730a3] hover:shadow-[0_2px_0_#3730a3] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          <p className="text-xs text-text-muted font-medium">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-primary font-bold hover:text-primary transition-colors ml-1"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>



      </motion.div>
    </div>
  );
}
