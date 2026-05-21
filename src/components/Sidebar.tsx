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
  Moon,
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
  const [isLightMode, setIsLightMode] = useState(false);

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
            return;
          }
        } catch (e) {}
      } else {
        setFullName("Học viên");
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

    // Đọc Theme
    const loadTheme = () => {
      const isLight = localStorage.getItem("gsa-theme") === "light";
      setIsLightMode(isLight);
      if (isLight) {
        document.documentElement.classList.add("light-mode");
      } else {
        document.documentElement.classList.remove("light-mode");
      }
    };
    loadTheme();

    return () => {
      window.removeEventListener("stats-updated", loadSidebarStats);
      window.removeEventListener("tier-updated", loadTier);
      window.removeEventListener("profile-updated", loadProfile);
      window.removeEventListener("auth-changed", loadProfile);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    localStorage.setItem("gsa-theme", newTheme ? "light" : "dark");
    if (newTheme) {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  };

  const navigation: NavigationItem[] = [
    { name: "Bảng điều khiển", href: "/dashboard", icon: Home },
    { name: "Lộ trình SGK", href: "/learn", icon: BookOpen },
    { name: "Phòng Luyện AI", href: "/ai-practice", icon: Mic },
    { name: "Thi đua & Thành tích", href: "/history", icon: Trophy },
    { name: "Hồ sơ học viên", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-[250px] shrink-0 border-r border-slate-800/60 bg-[#070A13] hidden md:flex flex-col h-full overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-850/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <PlayCircle className="w-6 h-6 text-white fill-white/10" />
        </div>
        <div>
          <h1 className="font-black text-[11px] tracking-wide text-white uppercase flex items-center gap-1">
            <span>Global Success AI</span>
          </h1>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold tracking-widest text-indigo-400 uppercase">
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
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 group ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-indigo-400 border-l-2 border-indigo-500 shadow-md shadow-indigo-950/15"
                  : "text-slate-400 hover:bg-slate-800/20 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="px-4 py-2 border-t border-slate-850/20 pt-3">
        {isTeacherRoute ? (
          <Link
            href="/dashboard"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-[11px] font-black text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-[0.98] transition-all border border-emerald-500/25 group/btn"
          >
            <User className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            <span>Giao diện Học Sinh</span>
          </Link>
        ) : (
          <Link
            href="/teacher"
            className="w-full py-2.5 px-4 rounded-xl bg-[#151B2B] hover:bg-slate-900 border border-indigo-500/35 hover:border-indigo-400/60 text-indigo-300 hover:text-indigo-200 text-[11px] font-black text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/25 active:scale-[0.98] transition-all group/btn"
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
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#1a1408] to-[#0d0f18] p-4 space-y-2 shadow-lg shadow-amber-950/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/5 to-yellow-600/5" />
            <div className="relative flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-400 flex items-center gap-1">
                  Thành viên PRO
                  <span className="text-[9px]">✦</span>
                </h4>
                <p className="text-[9px] text-amber-600/70 mt-0.5">
                  Toàn bộ giáo trình đã mở khóa
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Upgrade Card */
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#111625] to-[#0A0D18] p-4 space-y-3 shadow-lg shadow-indigo-950/30 group">
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-md animate-pulse">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-100 flex items-center gap-1">
                  <span>Nâng cấp PRO</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 flex items-center justify-center text-[6px] text-amber-400 font-bold border border-amber-500/30">👑</span>
                </h4>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                  Mở khóa toàn bộ giáo trình và AI
                </p>
              </div>
            </div>
            
            <Link
              href="/upgrade"
              className="relative z-10 block w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[10px] font-bold text-center active:scale-[0.98] transition-all shadow-md shadow-indigo-600/15"
            >
              Xem bảng giá →
            </Link>
          </div>
        )}
      </div>

      {/* User Profile Footer Card */}
      <div className="p-4 border-t border-slate-850/40 bg-[#04060d]/60">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-xs shadow-md uppercase">
                {fullName.substring(0, 2)}
              </div>
              <div className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#070A13]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-200 truncate" title={fullName}>
                  {fullName}
                </h2>
                {isPro && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[7px] font-black uppercase tracking-wider">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {userRole === "teacher" || isTeacherRoute ? "Giáo viên giảng dạy" : "Học sinh - Lớp 11A3"}
              </p>
            </div>
          </div>

          {/* Level Progress Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-bold">
              <span className="text-slate-400">Cấp độ 12</span>
              <span className="text-indigo-400 font-black">{xp} / 1000 XP</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-slate-900/40">
              <div 
                style={{ width: `${Math.min(100, (xp / 1000) * 100)}%` }} 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 shadow-md shadow-indigo-500/20"
              />
            </div>
          </div>
          
          {/* Admin System Link (Subtle) */}
          {(userRole.toUpperCase() === "ADMIN" || userEmail.toLowerCase() === "admin@globalsuccess.ai") && (
            <div className="pt-1.5">
              <Link
                href="/admin"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-850 border border-slate-700/30 hover:border-indigo-500/35 text-indigo-300 hover:text-indigo-200 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300"
              >
                <span>🛠️ Quản trị hệ thống</span>
              </Link>
            </div>
          )}

          {/* Light/Dark Mode Toggle & Logout Button */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-950/10 hover:bg-red-950/20 transition-all duration-300 group"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400/80 group-hover:text-red-400 transition-colors" />
              <span className="text-[9px] font-bold text-red-400/80 group-hover:text-red-400 uppercase tracking-wider transition-colors">Đăng xuất</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors group"
            >
              {isLightMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-300">Nền Tối</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-300">Nền Sáng</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
}
