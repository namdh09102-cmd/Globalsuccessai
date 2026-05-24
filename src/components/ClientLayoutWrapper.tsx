"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import LevelUpModal from "@/components/LevelUpModal";
import { AlertTriangle, Wrench, Home, BookOpen, Mic, Trophy, User } from "lucide-react";
import MusicPlayer from "@/components/MusicPlayer";
import { audioManager } from "@/lib/AudioManager";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  
  const isAuthRoute = pathname === "/auth";
  const isAdminRoute = pathname.startsWith("/admin");
  const isTeacherRoute = pathname.startsWith("/teacher");
  const isPitchRoute = pathname.startsWith("/pitch");

  const [stats, setStats] = useState({ xp: 0, streak: 5, diamonds: 20 });
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadStats = () => {
      const stored = localStorage.getItem("gsa-student-stats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          
          setStats(prev => {
            // Trigger animations if values increased
            if (parsed.xp > prev.xp && prev.xp > 0) {
              const el = document.getElementById('xp-chip');
              el?.classList.remove('xp-glow');
              void el?.offsetWidth;
              el?.classList.add('xp-glow');
              audioManager.play('xpEarned');
            }
            if (parsed.streak > prev.streak && prev.streak > 0) {
              const el = document.getElementById('streak-chip');
              el?.classList.remove('streak-pop');
              void el?.offsetWidth;
              el?.classList.add('streak-pop');
            } else if (parsed.streak < prev.streak) {
              audioManager.play('streakBroken');
            }
            return {
              xp: parsed.xp || 0,
              streak: parsed.streak || 5,
              diamonds: parsed.diamonds || 20
            };
          });
        } catch (e) {}
      }
    };
    loadStats();
    window.addEventListener("stats-updated", loadStats);

    // Global button micro-interactions
    const handleMouseDown = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button');
      if (target && !target.disabled) {
        target.classList.add('btn-interactive-active');
        audioManager.play('buttonClick');
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button');
      if (target) {
        target.classList.remove('btn-interactive-active');
      }
    };
    const handleMouseLeave = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button');
      if (target) {
        target.classList.remove('btn-interactive-active');
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseout', handleMouseLeave); // if cursor leaves while down

    return () => {
      window.removeEventListener("stats-updated", loadStats);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    setMounted(true);

    const checkState = () => {
      const maintenanceStr = localStorage.getItem("gsa-maintenance-mode");
      setIsMaintenance(maintenanceStr === "true");

      const storedUser = localStorage.getItem("gsa-current-user");
      let user = null;
      if (storedUser) {
        try { user = JSON.parse(storedUser); } catch(e){}
      }
      setCurrentUser(user);
      
      const theme = user?.gradeLevel || "primary";
      document.documentElement.setAttribute("data-theme", theme);

      let trialStart = localStorage.getItem("gsa-trial-start");
      if (!trialStart) {
        trialStart = Date.now().toString();
        localStorage.setItem("gsa-trial-start", trialStart);
      }
      
      const isTrialActive = Date.now() - parseInt(trialStart) < 3 * 24 * 60 * 60 * 1000;
      if (isTrialActive) {
        localStorage.setItem("gsa-user-tier", "pro");
      } else {
        if (localStorage.getItem("gsa-purchased-pro") !== "true") {
           localStorage.setItem("gsa-user-tier", "free");
        }
      }

      if (!user) {
        if (!isAuthRoute) {
          const guestStartTime = localStorage.getItem("gsa-guest-start");
          if (!guestStartTime) {
            localStorage.setItem("gsa-guest-start", Date.now().toString());
            setTimeout(() => {
              const u = localStorage.getItem("gsa-current-user");
              if (!u) {
                alert("Hết thời gian trải nghiệm. Vui lòng đăng nhập để tiếp tục học!");
                window.location.href = "/auth";
              }
            }, 120000);
          } else {
            const elapsed = Date.now() - parseInt(guestStartTime);
            if (elapsed >= 120000) {
              router.push("/auth");
            } else {
              setTimeout(() => {
                const u = localStorage.getItem("gsa-current-user");
                if (!u) {
                  alert("Hết thời gian trải nghiệm. Vui lòng đăng nhập để tiếp tục học!");
                  window.location.href = "/auth";
                }
              }, 120000 - elapsed);
            }
          }
        }
      } else {
        if (isAuthRoute) {
          if (user.role?.toLowerCase() === "admin") router.push("/admin");
          else if (user.role?.toLowerCase() === "teacher") router.push("/teacher");
          else router.push("/learn");
        } else if (isAdminRoute && user.role?.toLowerCase() !== "admin") {
          router.push("/learn");
        } else if (isTeacherRoute && user.role?.toLowerCase() !== "teacher" && user.role?.toLowerCase() !== "admin") {
          router.push("/learn");
        }
      }
    };

    checkState();

    window.addEventListener("settings-updated", checkState);
    window.addEventListener("auth-changed", checkState);
    return () => {
      window.removeEventListener("settings-updated", checkState);
      window.removeEventListener("auth-changed", checkState);
    };
  }, [pathname, router]);

  if (!mounted) return null;

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (isPitchRoute) {
    return <>{children}</>;
  }

  if (pathname.startsWith("/play")) {
    return <>{children}</>;
  }

  if (isTeacherRoute) {
    return <>{children}</>;
  }

  if (isMaintenance && !isAdminRoute) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-page text-center p-8 space-y-6 select-none">
        <div className="w-24 h-24 rounded-[var(--radius-card)] bg-xp-light border-[var(--c-border)] border-xp-dark flex items-center justify-center animate-wiggle-custom shadow-[0_6px_0_var(--c-xp-dark)]">
          <Wrench className="w-12 h-12 text-xp-dark" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-primary-dark font-fredoka uppercase tracking-wider">
            Bảo Trì Hệ Thống 🛠️
          </h1>
          <p className="text-text-muted max-w-md mx-auto text-sm leading-relaxed font-bold">
            Các kỹ sư AI của Global Success đang tiến hành nâng cấp lõi hệ thống. Vui lòng quay lại sau ít phút nữa nhé!
          </p>
        </div>
      </div>
    );
  }

  if (isAdminRoute || isTeacherRoute) {
    return <>{children}</>;
  }

  const getBottomNavItems = () => {
    const level = currentUser?.gradeLevel || "primary";
    
    if (level === "high") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: require("lucide-react").LayoutDashboard },
        { name: "Học", href: "/learn", icon: BookOpen },
        { name: "Speaking", href: "/ai-practice", icon: Mic },
        { name: "Kỹ năng", href: "/skills", icon: require("lucide-react").BarChart },
        { name: "Tài khoản", href: "/profile", icon: require("lucide-react").User },
      ];
    }
    
    if (level === "middle") {
      return [
        { name: "Home", href: "/dashboard", icon: Home },
        { name: "Học bài", href: "/learn", icon: BookOpen },
        { name: "Luyện nói", href: "/ai-practice", icon: Mic },
        { name: "Rank", href: "/history", icon: Trophy },
        { name: "Hồ sơ", href: "/profile", icon: require("lucide-react").User },
      ];
    }

    // Default primary
    return [
      { name: "Nhà", href: "/dashboard", icon: Home },
      { name: "Học", href: "/learn", icon: BookOpen },
      { name: "Nói", href: "/ai-practice", icon: Mic },
      { name: "Chơi", href: "/games", icon: require("lucide-react").Gamepad2 },
      { name: "Sao", href: "/profile", icon: require("lucide-react").Star },
    ];
  };

  const bottomNavItems = getBottomNavItems();

  const isTabActive = (href: string) => {
    if (href === "/learn") {
      return pathname === "/learn" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getInitials = (name: string) => {
    if (!name) return "KT";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getMascot = () => {
    if (currentUser?.gradeLevel === "primary" || !currentUser?.gradeLevel) {
      return <span className="text-[20px]">🦖</span>;
    }
    // Middle and High use initials
    return <span className="text-[14px] font-black text-primary-dark">{getInitials(currentUser?.name)}</span>;
  };

  const TopNavbar = () => (
    <div className="h-[56px] bg-sidebar flex items-center justify-between px-6 shrink-0 z-20 border-b-2 border-primary-dark select-none w-full">
      {/* Left: Logo */}
      <div className="flex items-center">
        {currentUser?.gradeLevel === "high" ? (
          <h1 className="text-[18px] tracking-wide flex items-center !text-white font-inter">
            <span className="font-black">GlobalSuccess AI</span>
            <span className="ml-2 text-[10px] bg-white/20 px-2 py-1 rounded font-bold tracking-widest">ADVANCED</span>
          </h1>
        ) : currentUser?.gradeLevel === "middle" ? (
          <h1 className="text-[18px] tracking-wide flex items-center !text-white font-nunito">
            <span className="font-black">GlobalAI</span>
            <span className="ml-2 text-[11px] bg-white/20 px-2 py-1 rounded font-black tracking-widest">MID</span>
          </h1>
        ) : (
          <h1 className="text-[18px] tracking-wide flex items-center !text-white">
            <span className="font-nunito font-black text-white">Global</span>
            <span className="font-fredoka text-xp mx-1">KIDS</span>
            <span className="font-nunito font-black text-white">AI</span>
          </h1>
        )}
      </div>

      {/* Center: Greeting */}
      <div className="hidden md:flex text-white font-nunito font-bold text-[14px]">
        Chào {currentUser?.name || currentUser?.fullName || "Học viên"}!
      </div>

      {/* Right group */}
      <div className="flex items-center gap-3">
        {/* Upgrade button */}
        <Link
          href="/upgrade"
          className="hidden md:flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full border border-amber-300 text-black shadow-[0_2px_0_#b45309] hover:scale-105 active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <span className="text-[12px]">👑</span>
          <span className="font-black text-[9px] uppercase tracking-wider">Nâng cấp</span>
        </Link>

        {/* Streak chip */}
        <div id="streak-chip" className="streak-chip bg-xp text-xp-text border border-xp-dark rounded-[999px] px-3 py-1 flex items-center gap-1 shadow-sm transition-transform">
          <span className="text-[14px]">🔥</span>
          <span className="font-bold text-[12px]">{stats.streak} ngày</span>
        </div>
        
        {/* XP chip */}
        <div id="xp-chip" className="xp-chip bg-white text-primary border border-[rgba(0,0,0,0.1)] rounded-[999px] px-3 py-1 flex items-center gap-1 shadow-sm transition-colors">
          <span className="text-[14px]">⚡</span>
          <span className="font-bold text-[12px] xp-number">{(stats.xp).toLocaleString()} XP</span>
        </div>

        {/* Avatar circle */}
        <div className="mascot-avatar w-[36px] h-[36px] rounded-full border-[3px] border-xp bg-card flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform">
          {getMascot()}
        </div>
      </div>
    </div>
  );

  return (
    <div data-theme={currentUser?.gradeLevel || "primary"} className="flex-1 flex flex-col h-full overflow-hidden bg-page theme-wrapper">
      <LevelUpModal />
      {/* Top Navbar */}
      <TopNavbar />

      <div className="flex-1 flex overflow-hidden relative w-full">
        <Sidebar />
        
        <main className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar bg-page" style={{ padding: "20px", paddingBottom: "100px" }}>
          {children}
        </main>
        
        <RightPanel />
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-card border-t-[var(--c-border)] border-[rgba(0,0,0,0.1)] flex justify-around items-center z-50 md:hidden select-none pb-safe">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all relative group ${
                active
                  ? "text-primary -translate-y-1"
                  : "text-text-muted hover:text-primary-dark"
              }`}
            >
              <div className={`p-1.5 rounded-[var(--radius-card)] transition-colors ${active ? "bg-primary-light" : "group-hover:bg-page"}`}>
                <Icon className={`w-6 h-6 transition-transform ${active ? "scale-110 animate-wiggle-custom" : "group-hover:scale-110"}`} />
              </div>
              <span className={`text-[10px] font-black tracking-wide ${active ? "font-fredoka" : ""}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <MusicPlayer />
    </div>
  );
}
