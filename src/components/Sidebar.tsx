"use client";

import React, { useState, useEffect } from "react";
import { 
  Home,
  BookOpen, 
  Compass,
  Film,
  Mic, 
  Trophy,
  CheckSquare,
  User,
  Sparkles, 
  Crown,
  PlayCircle,
  School,
  Sun,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [fullName, setFullName] = useState("Học viên");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userRole, setUserRole] = useState<string>("student");
  const [userEmail, setUserEmail] = useState<string>("");

  const isTeacherRoute = pathname.startsWith("/teacher");

  const handleLogout = () => {
    localStorage.removeItem("gsa-current-user");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/auth");
  };

  useEffect(() => {
    // Đọc stats từ localStorage để đồng bộ XP hiển thị ở footer sidebar nếu có
    const loadSidebarStats = () => {
      const stored = localStorage.getItem("gsa-student-stats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setXp(parsed.xp || 0);
          setStreak(parsed.streak || 0);
        } catch (e) {}
      }
    };

    loadSidebarStats();
    window.addEventListener("stats-updated", loadSidebarStats);

    // Đọc trạng thái Tier
    const loadTier = () => {
      if (typeof window !== "undefined") {
        setIsPro(localStorage.getItem("gsa-user-tier") === "pro");
      }
    };
    loadTier();
    window.addEventListener("tier-updated", loadTier);

    // Đọc Profile Name
    const loadProfile = () => {
      const currentUserStr = localStorage.getItem("gsa-current-user");
      if (currentUserStr) {
        try {
          const parsed = JSON.parse(currentUserStr);
          if (parsed.name) {
            setFullName(parsed.name);
          }
          if (parsed.email) {
            setUserEmail(parsed.email);
          }
          if (parsed.role) {
            setUserRole(parsed.role);
            setIsLoggedIn(true);
            return;
          }
        } catch (e) {}
      } else {
        setFullName("Học viên");
        setIsLoggedIn(false);
      }

      const storedProfile = localStorage.getItem("gsa-user-profile");
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          if (parsed.fullName) setFullName(parsed.fullName);
        } catch (e) {}
      }
      setUserRole(isTeacherRoute ? "teacher" : "student");
      setUserEmail("");
    };
    loadProfile();
    window.addEventListener("profile-updated", loadProfile);
    window.addEventListener("auth-changed", loadProfile);

    return () => {
      window.removeEventListener("stats-updated", loadSidebarStats);
      window.removeEventListener("tier-updated", loadTier);
      window.removeEventListener("profile-updated", loadProfile);
      window.removeEventListener("auth-changed", loadProfile);
    };
  }, []);

  const navigation: NavigationItem[] = [
    { name: "Bảng điều khiển", href: "/dashboard", icon: Home },
    { name: "Lộ trình SGK", href: "/learn", icon: BookOpen },
    { name: "Phòng Luyện AI", href: "/ai-practice", icon: Mic },
    { name: "Thi đua & Thành tích", href: "/history", icon: Trophy },
    { name: "Hồ sơ học viên", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-[250px] shrink-0 border-r border-slate-200 bg-white hidden md:flex flex-col h-full overflow-hidden select-none shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <PlayCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-black text-[11px] tracking-wide text-slate-800 uppercase flex items-center gap-1">
            <span>Global Success AI</span>
          </h1>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold tracking-widest text-indigo-600 uppercase">
              K-12 EDTECH PLATFORM
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const Icon = item.icon;
          // Logic Active State dynamic
          const isActive = item.href.startsWith("#")
            ? false
            : item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="px-4 py-2 border-t border-slate-100 pt-3">
        {isTeacherRoute ? (
          <Link
            href="/dashboard"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white text-[11px] font-black text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all group/btn"
          >
            <User className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            <span>Giao diện Học Sinh</span>
          </Link>
        ) : (
          <Link
            href="/teacher"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 text-[11px] font-black text-center flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all group/btn"
          >
            <School className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            <span>Giao diện Giáo Viên</span>
          </Link>
        )}
      </div>

      {/* VIP Upgrade Pro Card — Ẩn khi đã là PRO */}
      <div className="px-4 py-2">
        {isPro ? (
          /* PRO Active Badge */
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4 space-y-2 shadow-sm">
            <div className="relative flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-600 flex items-center gap-1">
                  Thành viên PRO
                  <span className="text-[9px]">✦</span>
                </h4>
                <p className="text-[9px] text-amber-700/70 mt-0.5 font-medium">
                  Toàn bộ giáo trình đã mở khóa
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Upgrade Card */
          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white p-4 space-y-3 shadow-sm group hover:shadow-md transition-shadow">
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm animate-pulse">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <span>Nâng cấp PRO</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-100 flex items-center justify-center text-[6px] text-amber-500 font-bold border border-amber-200">👑</span>
                </h4>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                  Mở khóa toàn bộ giáo trình và AI
                </p>
              </div>
            </div>
            
            <Link
              href="/upgrade"
              className="relative z-10 block w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-[10px] font-bold text-center active:scale-[0.98] transition-all shadow-md shadow-indigo-500/20"
            >
              Xem bảng giá →
            </Link>
          </div>
        )}
      </div>

      {/* User Profile Footer Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
        {isLoggedIn ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black text-white text-xs shadow-md uppercase">
                  {fullName.substring(0, 2)}
                </div>
                <div className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold text-slate-800 truncate" title={fullName}>
                    {fullName}
                  </h2>
                  {isPro && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-200 text-amber-600 text-[7px] font-black uppercase tracking-wider">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate font-medium">
                  {userRole === "teacher" || isTeacherRoute ? "Giáo viên giảng dạy" : "Học sinh - Lớp 11A3"}
                </p>
              </div>
            </div>

            {/* Level Progress Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-slate-500">Cấp độ 12</span>
                <span className="text-indigo-600 font-black">{xp} / 1000 XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, (xp / 1000) * 100)}%` }} 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-3">
            <p className="text-[10px] text-slate-500 mb-2 text-center font-medium">Bạn đang dùng thử với tư cách Khách</p>
            <Link href="/auth" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold text-center transition-all shadow-md shadow-indigo-500/20">
              Đăng nhập / Đăng ký
            </Link>
          </div>
        )}
          
        {/* Admin System Link (Subtle) & Bottom controls */}
        {(userRole.toUpperCase() === "ADMIN" || userEmail.toLowerCase() === "admin@globalsuccess.ai") && (
          <div className="pt-2">
            <Link
              href="/admin"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300"
            >
              <span>🛠️ Quản trị hệ thống</span>
            </Link>
          </div>
        )}

        {/* Logout Button */}
        <div className="flex items-center justify-center pt-3 mt-3 border-t border-slate-200">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors w-full justify-center py-1 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              ĐĂNG XUẤT
            </button>
          ) : (
            <span className="text-[9px] font-bold text-slate-400">GUEST MODE</span>
          )}
        </div>
      </div>
    </aside>
  );
}
