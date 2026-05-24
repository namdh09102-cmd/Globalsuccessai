"use client";

import React, { useState, useEffect } from "react";
import { 
  Home, BookOpen, Mic, Gamepad2, Star, Trophy, User, LayoutDashboard, Target, Activity
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Export this so other components (like mobile bottom nav) can use the same logic
export const getUnifiedNavigation = (gradeLevel: string) => {
  if (gradeLevel === "high") {
    return [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Học", href: "/learn", icon: BookOpen },
      { name: "Speaking", href: "/ai-practice", icon: Mic },
      { name: "IELTS", href: "/learn/ielts", icon: Target },
      { name: "Kỹ năng", href: "/skills", icon: Activity },
      { name: "Tài khoản", href: "/profile", icon: User },
    ];
  }
  
  if (gradeLevel === "middle") {
    return [
      { name: "Home", href: "/dashboard", icon: Home },
      { name: "Học bài", href: "/learn", icon: BookOpen },
      { name: "Luyện nói", href: "/ai-practice", icon: Mic },
      { name: "Trò đấu", href: "/games", icon: Gamepad2 },
      { name: "Rank", href: "/history", icon: Trophy },
      { name: "Hồ sơ", href: "/profile", icon: User },
    ];
  }

  // Default: primary (KIDS)
  return [
    { name: "Nhà", href: "/dashboard", icon: Home },
    { name: "Học", href: "/learn", icon: BookOpen },
    { name: "Nói", href: "/ai-practice", icon: Mic },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Sao", href: "/profile", icon: Star },
  ];
};

export default function UnifiedSidebar() {
  const pathname = usePathname() || "/";
  const [gradeLevel, setGradeLevel] = useState("primary");

  useEffect(() => {
    const loadLevel = () => {
      const storedUser = localStorage.getItem("gsa-current-user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.gradeLevel) setGradeLevel(u.gradeLevel);
        } catch (e) {}
      }
    };
    loadLevel();
    window.addEventListener("auth-changed", loadLevel);
    window.addEventListener("profile-updated", loadLevel);
    return () => {
      window.removeEventListener("auth-changed", loadLevel);
      window.removeEventListener("profile-updated", loadLevel);
    };
  }, []);

  const navigation = getUnifiedNavigation(gradeLevel);

  return (
    <aside className={`shrink-0 bg-sidebar flex flex-col h-full overflow-hidden select-none z-10 hidden md:flex border-r-2 border-primary-dark ${gradeLevel === "high" ? "w-[90px]" : gradeLevel === "middle" ? "w-[80px]" : "w-[72px]"}`}>
      <nav className="flex-1 px-1 py-4 space-y-2 overflow-y-auto custom-scrollbar flex flex-col items-center">
        {navigation.map((item) => {
          const Icon = item.icon;
          // Exact match for root-like paths, startsWith for others
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          // Dynamic styling based on grade theme
          const activeBg = gradeLevel === "high" ? "bg-white/10" : "bg-white/25 slide-highlight";
          const hoverBg = gradeLevel === "high" ? "hover:bg-white/5" : "hover:bg-white/15";
          const widthClass = gradeLevel === "high" ? "w-[75px]" : gradeLevel === "middle" ? "w-[68px]" : "w-[60px]";
          const fontClass = gradeLevel === "high" ? "font-inter" : gradeLevel === "middle" ? "font-nunito" : "font-nunito";
          const textActiveColor = gradeLevel === "high" ? "text-primary-light" : "text-xp";

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center ${widthClass} h-[60px] rounded-[12px] transition-all duration-300 group relative ${
                isActive ? activeBg : hoverBg
              }`}
              aria-label={item.name}
              style={{ margin: "4px auto" }}
            >
              <Icon
                className={`w-6 h-6 transition-transform duration-300 group-hover:scale-105 ${
                  isActive ? textActiveColor : "text-white"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[9px] ${fontClass} font-bold mt-1 text-center leading-tight ${
                isActive ? textActiveColor : "text-white"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
