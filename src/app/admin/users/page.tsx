"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Shield, CheckCircle, Search, Filter } from "lucide-react";

// Định dạng kiểu dữ liệu Người dùng
type UserAccount = {
  id: string;
  name: string;
  role: "student" | "teacher" | "admin";
  tier: "free" | "pro";
  joinDate: string;
};

// Dữ liệu Mock ban đầu
const MOCK_USERS: UserAccount[] = [
  { id: "USR-9901", name: "Nguyễn Khánh Trần", role: "student", tier: "free", joinDate: "2026-05-18" },
  { id: "USR-9902", name: "Lê Minh Phát", role: "student", tier: "pro", joinDate: "2026-05-19" },
  { id: "USR-9903", name: "Trần Thị Ánh Tuyết", role: "teacher", tier: "pro", joinDate: "2026-05-01" },
  { id: "USR-9904", name: "Phạm Quốc Bảo", role: "student", tier: "free", joinDate: "2026-05-20" },
  { id: "USR-9905", name: "Hoàng Thanh Hà", role: "admin", tier: "pro", joinDate: "2026-01-01" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    // Thử đọc từ localStorage, nếu không có thì dùng Mock
    const stored = localStorage.getItem("gsa-admin-users");
    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch (e) {
        setUsers(MOCK_USERS);
      }
    } else {
      setUsers(MOCK_USERS);
      localStorage.setItem("gsa-admin-users", JSON.stringify(MOCK_USERS));
    }
  }, []);

  const handleActivatePro = (userId: string, userName: string) => {
    const updated = users.map(u => u.id === userId ? { ...u, tier: "pro" as const } : u);
    setUsers(updated);
    localStorage.setItem("gsa-admin-users", JSON.stringify(updated));

    // Nếu là Khánh Trần, cập nhật luôn biến thực tế mà client dùng
    if (userId === "USR-9901") {
      localStorage.setItem("gsa-user-tier", "pro");
      window.dispatchEvent(new Event("profile-updated")); // Trigger update profile
    }

    setToastMsg(`Kích hoạt thành công gói VIP cho ${userName}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-full p-6 space-y-6 select-none bg-[#090D16]">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[99] bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-6 py-3 rounded-xl shadow-2xl shadow-amber-500/30 flex items-center gap-2 border border-amber-300/40"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Quản Lý Tài Khoản K-12
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            Cấp quyền & Kiểm soát truy cập
          </p>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-4">
        
        {/* Thanh công cụ */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm ID hoặc tên người dùng..." 
              className="w-full bg-[#090D16] border border-slate-800 text-slate-300 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-[#090D16] text-slate-300 text-xs font-bold hover:bg-slate-800 transition-all">
            <Filter className="w-4 h-4" /> Lọc danh sách
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#090D16]">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#111827] text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-800/80">
                <th className="px-6 py-4">Mã ID</th>
                <th className="px-6 py-4">Tên Người Dùng</th>
                <th className="px-6 py-4">Vai Trò</th>
                <th className="px-6 py-4">Gói Dịch Vụ</th>
                <th className="px-6 py-4">Ngày Tham Gia</th>
                <th className="px-6 py-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#111827]/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-500">{user.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-200">{user.name}</td>
                  <td className="px-6 py-4">
                    {user.role === "student" && <span className="text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-black uppercase">Học Sinh</span>}
                    {user.role === "teacher" && <span className="text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded text-[10px] font-black uppercase">Giáo Viên</span>}
                    {user.role === "admin" && <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 w-max"><Shield className="w-3 h-3"/> Admin</span>}
                  </td>
                  <td className="px-6 py-4">
                    {user.tier === "pro" ? (
                      <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 w-max">
                        <Crown className="w-3 h-3" /> PRO VIP
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[10px] font-black uppercase">
                        Gói Free
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{user.joinDate}</td>
                  <td className="px-6 py-4 text-right">
                    {user.tier === "free" && user.role === "student" ? (
                      <button 
                        onClick={() => handleActivatePro(user.id, user.name)}
                        className="px-3 py-1.5 rounded bg-gradient-to-tr from-amber-500 to-yellow-500 text-black font-black text-[10px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      >
                        [ Kích Hoạt PRO ]
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">Đã Kích Hoạt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
