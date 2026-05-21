"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import { AlertTriangle, Wrench, Home, BookOpen, Mic, Trophy, User } from "lucide-react";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  
  const isAuthRoute = pathname === "/auth";
  const isAdminRoute = pathname.startsWith("/admin");
  const isTeacherRoute = pathname.startsWith("/teacher");

  const [stats, setStats] = useState({ streak: 5, diamonds: 20 });
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadStats = () => {
      const stored = localStorage.getItem("gsa-student-stats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStats({
            streak: parsed.streak || 5,
            diamonds: parsed.diamonds || 20
          });
        } catch (e) {}
      }
    };
    loadStats();
    window.addEventListener("stats-updated", loadStats);
    return () => {
      window.removeEventListener("stats-updated", loadStats);
    };
  }, []);

  useEffect(() => {
    setMounted(true);

    const checkState = () => {
      // 1. Kiểm tra Maintenance
      const maintenanceStr = localStorage.getItem("gsa-maintenance-mode");
      setIsMaintenance(maintenanceStr === "true");

      // 2. Kiểm tra Auth User
      const storedUser = localStorage.getItem("gsa-current-user");
      let user = null;
      if (storedUser) {
        try { user = JSON.parse(storedUser); } catch(e){}
      }
      setCurrentUser(user);

      // 3. Khởi tạo Trial 3 ngày nếu chưa có
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

      // ROUTE GUARD LOGIC
      if (!user) {
        // Khách (Chưa đăng nhập) -> Không đá về Auth ngay, cho dùng thử 2 phút
        if (!isAuthRoute) {
          const guestStartTime = localStorage.getItem("gsa-guest-start");
          if (!guestStartTime) {
            localStorage.setItem("gsa-guest-start", Date.now().toString());
            // Đặt timer 2 phút (120,000 ms)
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
        // Đã đăng nhập
        if (isAuthRoute) {
          // Đã đăng nhập rồi mà còn vào Auth -> Đá về nhà
          if (user.role?.toLowerCase() === "admin") router.push("/admin");
          else if (user.role?.toLowerCase() === "teacher") router.push("/teacher");
          else router.push("/learn");
        } else if (isAdminRoute && user.role?.toLowerCase() !== "admin") {
          // Chặn Học sinh/Giáo viên mò vào Admin
          router.push("/learn");
        } else if (isTeacherRoute && user.role?.toLowerCase() !== "teacher" && user.role?.toLowerCase() !== "admin") {
          // Chặn Học sinh mò vào Teacher
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

  // Nếu là trang Auth -> Trả về trắng trơn không bọc gì
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Chế độ bảo trì (Chặn mọi route học sinh và teacher, nhưng tha cho Admin)
  if (isMaintenance && !isAdminRoute) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-[#070A13] text-center p-8 space-y-6 select-none">
        <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse shadow-2xl shadow-amber-500/20">
          <Wrench className="w-12 h-12 text-amber-500" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
            Hệ Thống Đang Bảo Trì
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Các kỹ sư AI của Global Success đang tiến hành nâng cấp lõi hệ thống. Vui lòng quay lại sau ít phút nữa nhé!
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500/80 uppercase tracking-widest bg-amber-500/5 px-4 py-2 rounded-lg border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>System Upgrade in Progress</span>
        </div>
      </div>
    );
  }

  // Nếu là Admin Route -> Trả về cho Layout Admin lo
  if (isAdminRoute) {
    return <>{children}</>;
  }

  const bottomNavItems = [
    { name: "Bảng điều khiển", href: "/dashboard", icon: Home },
    { name: "Lộ trình", href: "/learn", icon: BookOpen },
    { name: "Luyện AI", href: "/ai-practice", icon: Mic },
    { name: "Thành tích", href: "/history", icon: Trophy },
    { name: "Hồ sơ", href: "/profile", icon: User },
  ];

  const isTabActive = (href: string) => {
    if (href === "/learn") {
      return pathname === "/learn" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Luồng K-12 bình thường (Có Sidebar + RightPanel + Mobile Navigation)
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 shrink-0 select-none">
        <span className="font-black text-xs text-white uppercase tracking-wider">
          Global Success AI
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
            🔥 {stats.streak.toString().padStart(2, "0")}
          </span>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
            💎 {stats.diamonds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar pb-16 md:pb-0">
          {children}
        </main>
        
        <RightPanel />
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#111827]/90 backdrop-blur-md border-t border-slate-800 flex justify-around items-center z-50 md:hidden select-none">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all relative ${
                active
                  ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
              <span className="text-[9px] font-extrabold tracking-wide">{item.name}</span>
              {active && (
                <div className="absolute bottom-1 w-5 h-0.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
