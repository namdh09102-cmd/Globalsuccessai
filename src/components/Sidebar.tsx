"use client";

import React, { useState, useEffect } from "react";
import { 
  Home,
  BookOpen, 
  Mic, 
  Trophy,
  Medal,
  UserCircle,
  Gamepad2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname() || "/";

  const navigation = [
    { name: "Trang chủ", href: "/dashboard", icon: Home },
    { name: "Học bài", href: "/learn", icon: BookOpen },
    { name: "Luyện nói", href: "/ai-practice", icon: Mic },
    { name: "Trò chơi", href: "/games", icon: Gamepad2 },
    { name: "Thi đua", href: "/history", icon: Trophy },
    { name: "Hồ sơ", href: "/profile", icon: UserCircle },
  ];

  return (
    <aside className="w-[72px] shrink-0 bg-sidebar flex flex-col h-full overflow-hidden select-none z-10 hidden md:flex border-r-2 border-primary-dark">
      <nav className="flex-1 px-1 py-4 space-y-2 overflow-y-auto custom-scrollbar flex flex-col items-center">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.href.startsWith("#")
            ? false
            : item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-[60px] h-[60px] rounded-[12px] transition-all duration-300 group relative ${
                isActive
                  ? "bg-white/25 slide-highlight"
                  : "hover:bg-white/15"
              }`}
              aria-label={item.name}
              style={{ margin: "4px auto" }}
            >
              <Icon
                className={`w-6 h-6 transition-transform duration-300 group-hover:scale-105 ${
                  isActive ? "text-xp" : "text-white"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[9px] font-nunito font-bold mt-1 text-center leading-tight ${
                isActive ? "text-xp" : "text-white"
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
