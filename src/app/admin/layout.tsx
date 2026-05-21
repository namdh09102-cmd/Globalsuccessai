"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, Users, BookOpen, Settings, Rocket, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("gsa-current-user");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/auth");
  };

  const navItems = [
    { name: "Tổng quan hệ thống", href: "/admin", icon: Zap },
    { name: "Quản lý tài khoản", href: "/admin/users", icon: Users },
    { name: "Quản lý giáo trình", href: "/admin/curriculum", icon: BookOpen },
    { name: "Cấu hình Hệ thống", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#090D16] text-slate-300">
      
      {/* Mobile Top Bar Admin */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-[#090D16] border-b border-slate-800 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Rocket className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
          <span className="font-black text-xs text-white uppercase tracking-wider">
            ADMIN PORTAL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/learn" className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
            Học tập
          </Link>
          <button
            onClick={handleLogout}
            className="text-[10px] font-bold text-rose-400 bg-rose-950/20 border border-rose-500/20 px-2 py-1 rounded-lg"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Mobile Sub Navigation Admin */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-2 bg-[#0C1220] border-b border-slate-800 shrink-0 custom-scrollbar select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-[10px] whitespace-nowrap border shrink-0 transition-all ${
                isActive
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Admin Độc Lập */}
      <aside className="w-[280px] shrink-0 border-r border-slate-800/80 bg-[#090D16] hidden md:flex flex-col h-full select-none shadow-2xl">
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-[12px] tracking-wide text-white uppercase flex items-center gap-1">
              <span>ADMIN PORTAL</span>
            </h1>
            <span className="text-[9px] font-bold tracking-widest text-rose-400 uppercase">
              Super Admin Mode
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Menu Quản Trị</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            // Xử lý Active state cẩn thận: "/admin" là route gốc nên phải check exact match nếu không các route con cũng bị sáng
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-xs ${
                  isActive
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/30 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đăng Xuất
          </button>
          
          <Link href="/learn" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all">
            ← Quay lại Hệ Thống K-12
          </Link>
        </div>
      </aside>

      {/* Vùng Main Content của Admin */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar bg-[#090D16]">
        {children}
      </main>

    </div>
  );
}
