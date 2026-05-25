"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Shield, CheckCircle, Search, Filter, MoreVertical, Eye, Edit, CalendarDays, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type UserAccount = {
  id: string;
  name: string;
  email?: string;
  role: "student" | "teacher" | "admin";
  tier: "free" | "pro";
  school?: string;
  grade?: string;
  last_sign_in_at?: string;
  created_at?: string;
  pro_expires_at?: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Filters & Pagination
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Modals state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [viewUser, setViewUser] = useState<UserAccount | null>(null);
  
  const [editRoleUser, setEditRoleUser] = useState<UserAccount | null>(null);
  const [newRole, setNewRole] = useState<"student"|"teacher"|"admin">("student");
  
  const [extendProUser, setExtendProUser] = useState<UserAccount | null>(null);
  const [proExpDate, setProExpDate] = useState("");

  const [revokeProUser, setRevokeProUser] = useState<UserAccount | null>(null);
  
  const [deleteUser, setDeleteUser] = useState<UserAccount | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    // Lấy dữ liệu từ localStorage (thay vì Supabase để đồng bộ với mock đăng ký)
    const storedUsersStr = localStorage.getItem("gsa-users");
    if (storedUsersStr) {
      setUsers(JSON.parse(storedUsersStr));
    } else {
      setUsers([]);
    }
    setLoading(false);
  };

  const updateUsersList = (newUsers: UserAccount[]) => {
    setUsers(newUsers);
    localStorage.setItem("gsa-users", JSON.stringify(newUsers));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.action-dropdown')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleUpdateRole = async () => {
    if (!editRoleUser) return;
    const newUsers = users.map(u => u.id === editRoleUser.id ? { ...u, role: newRole } : u);
    updateUsersList(newUsers as UserAccount[]);
    triggerToast(`Đã đổi Role của ${editRoleUser.name} thành ${newRole.toUpperCase()}`);
    setEditRoleUser(null);
  };

  const handleExtendPro = async () => {
    if (!extendProUser || !proExpDate) return;
    const newUsers = users.map(u => u.id === extendProUser.id ? { ...u, tier: 'pro', pro_expires_at: proExpDate } : u);
    updateUsersList(newUsers as UserAccount[]);
    triggerToast(`Đã gia hạn PRO cho ${extendProUser.name}`);
    setExtendProUser(null);
  };

  const handleRevokePro = async () => {
    if (!revokeProUser) return;
    const newUsers = users.map(u => u.id === revokeProUser.id ? { ...u, tier: 'free', pro_expires_at: undefined } : u);
    updateUsersList(newUsers as UserAccount[]);
    triggerToast(`Đã thu hồi PRO của ${revokeProUser.name}`);
    setRevokeProUser(null);
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    const newUsers = users.filter(u => u.id !== deleteUser.id);
    updateUsersList(newUsers as UserAccount[]);
    triggerToast(`Đã xóa vĩnh viễn user ${deleteUser.name}`);
    setDeleteUser(null);
    setDeleteConfirmText("");
  };

  // Filter & Pagination Logic
  const filteredUsers = useMemo(() => {
    let result = users;
    if (filterRole !== "all") result = result.filter(u => u.role === filterRole);
    if (filterPlan !== "all") result = result.filter(u => u.tier === filterPlan);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q)));
    }
    return result;
  }, [users, filterRole, filterPlan, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole, filterPlan, searchQuery]);

  return (
    <div className="min-h-full p-6 space-y-6 select-none bg-[#090D16]">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[99] bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-6 py-3 rounded-[var(--radius-card)] shadow-2xl shadow-amber-500/30 flex items-center gap-2 border border-amber-300/40"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
        <div className="w-12 h-12 rounded-[var(--radius-card)] bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Quản Lý Tài Khoản K-12
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Cấp quyền & Kiểm soát truy cập
          </p>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-[var(--radius-card)] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-4">
        
        {/* Thanh công cụ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-md relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm ID, email hoặc tên người dùng..." 
              className="w-full bg-[#090D16] border border-slate-800 text-slate-300 text-xs rounded-[var(--radius-card)] pl-9 pr-4 py-2.5 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-card)] border border-slate-800 bg-[#090D16]">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-transparent text-slate-300 text-xs outline-none border-none cursor-pointer"
              >
                <option value="all">Tất cả Role</option>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-card)] border border-slate-800 bg-[#090D16]">
              <select 
                value={filterPlan} 
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-transparent text-slate-300 text-xs outline-none border-none cursor-pointer"
              >
                <option value="all">Tất cả Plan</option>
                <option value="free">Gói Free</option>
                <option value="pro">Gói PRO VIP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-slate-800/80 bg-[#090D16]">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#111827] text-slate-400 uppercase tracking-widest text-[10px] font-black border-b border-slate-800/80">
                <th className="px-4 py-4">Mã ID</th>
                <th className="px-4 py-4">Tên Người Dùng</th>
                <th className="px-4 py-4">Vai Trò</th>
                <th className="px-4 py-4">Gói Dịch Vụ</th>
                <th className="px-4 py-4">Ngày Tham Gia</th>
                <th className="px-4 py-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">Đang tải dữ liệu từ Supabase...</td></tr>
              ) : paginatedUsers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">Không tìm thấy tài khoản nào.</td></tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#111827]/50 transition-colors group">
                    <td className="px-4 py-4 font-mono text-slate-500 truncate max-w-[100px]">{user.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-200 truncate max-w-[150px]">{user.name}</div>
                      {user.email && <div className="text-[10px] text-slate-500">{user.email}</div>}
                    </td>
                    <td className="px-4 py-4">
                      {user.role === "student" && <span className="text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-black uppercase">Học Sinh</span>}
                      {user.role === "teacher" && <span className="text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded text-[10px] font-black uppercase">Giáo Viên</span>}
                      {user.role === "admin" && <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 w-max"><Shield className="w-3 h-3"/> Admin</span>}
                    </td>
                    <td className="px-4 py-4">
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
                    <td className="px-4 py-4 text-slate-400 font-medium">{new Date(user.created_at || Date.now()).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-4 text-center relative action-dropdown">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Action Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === user.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-10 top-4 w-48 bg-[#111827] border border-slate-700 rounded-[var(--radius-card)] shadow-2xl z-50 overflow-hidden text-left"
                          >
                            <button onClick={() => {setViewUser(user); setActiveDropdown(null);}} className="w-full px-4 py-2 text-[11px] text-slate-300 hover:bg-slate-800 flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> Xem chi tiết</button>
                            <button onClick={() => {setEditRoleUser(user); setNewRole(user.role); setActiveDropdown(null);}} className="w-full px-4 py-2 text-[11px] text-slate-300 hover:bg-slate-800 flex items-center gap-2"><Edit className="w-3.5 h-3.5" /> Đổi Role</button>
                            <div className="h-px bg-slate-800 my-1"></div>
                            {user.tier === "free" ? (
                              <button onClick={() => {setExtendProUser(user); setActiveDropdown(null);}} className="w-full px-4 py-2 text-[11px] text-amber-400 hover:bg-slate-800 flex items-center gap-2"><Crown className="w-3.5 h-3.5" /> Gia hạn PRO</button>
                            ) : (
                              <button onClick={() => {setRevokeProUser(user); setActiveDropdown(null);}} className="w-full px-4 py-2 text-[11px] text-orange-400 hover:bg-slate-800 flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Thu hồi PRO</button>
                            )}
                            <div className="h-px bg-slate-800 my-1"></div>
                            <button onClick={() => {setDeleteUser(user); setActiveDropdown(null);}} className="w-full px-4 py-2 text-[11px] text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 flex items-center gap-2 font-bold"><Trash2 className="w-3.5 h-3.5" /> Xóa tài khoản</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-slate-500">Trang {currentPage} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded bg-[#090D16] border border-slate-800 text-slate-300 text-xs font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors"
              >
                Prev
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded bg-[#090D16] border border-slate-800 text-slate-300 text-xs font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* VIEW DETAILS */}
        {viewUser && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111827] border border-slate-700 rounded-[var(--radius-card)] p-6 max-w-sm w-full shadow-2xl relative">
              <button onClick={() => setViewUser(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"><X className="w-5 h-5"/></button>
              <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400"/> Chi tiết tài khoản</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">ID:</span> <span className="font-mono text-slate-300 text-xs truncate max-w-[150px]">{viewUser.id}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Tên:</span> <span className="font-bold text-white">{viewUser.name}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Email:</span> <span className="text-slate-300">{viewUser.email || "N/A"}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Trường:</span> <span className="text-slate-300">{viewUser.school || "Chưa cập nhật"}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Lớp:</span> <span className="text-slate-300">{viewUser.grade || "Chưa cập nhật"}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Trạng thái:</span> <span className="text-amber-400 font-bold">{viewUser.tier === 'pro' ? 'PRO VIP' : 'FREE'}</span></div>
                <div className="flex justify-between pb-2"><span className="text-slate-500">Hoạt động cuối:</span> <span className="text-slate-300">{viewUser.last_sign_in_at ? new Date(viewUser.last_sign_in_at).toLocaleString('vi-VN') : "Chưa đăng nhập"}</span></div>
              </div>
            </motion.div>
          </div>
        )}

        {/* EDIT ROLE */}
        {editRoleUser && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111827] border border-slate-700 rounded-[var(--radius-card)] p-6 max-w-sm w-full shadow-2xl relative">
              <h3 className="text-white font-black text-lg mb-2">Đổi Vai Trò (Role)</h3>
              <p className="text-xs text-slate-400 mb-4">Thay đổi quyền hạn của <strong className="text-white">{editRoleUser.name}</strong></p>
              
              <div className="space-y-2 mb-6">
                {(['student', 'teacher', 'admin'] as const).map(r => (
                  <label key={r} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newRole === r ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-[#090D16] hover:border-slate-600'}`}>
                    <input type="radio" name="role" value={r} checked={newRole === r} onChange={(e) => setNewRole(e.target.value as any)} className="accent-indigo-500" />
                    <span className="text-sm font-bold text-slate-200 capitalize">{r}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => setEditRoleUser(null)} className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors">Hủy</button>
                <button onClick={handleUpdateRole} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors">Lưu thay đổi</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* EXTEND PRO */}
        {extendProUser && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111827] border border-amber-500/30 rounded-[var(--radius-card)] p-6 max-w-sm w-full shadow-2xl relative">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20"><Crown className="w-5 h-5 text-amber-500"/></div>
              <h3 className="text-white font-black text-lg mb-2">Gia Hạn PRO VIP</h3>
              <p className="text-xs text-slate-400 mb-4">Cấp quyền truy cập đầy đủ cho <strong className="text-white">{extendProUser.name}</strong></p>
              
              <div className="mb-6">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Ngày hết hạn</label>
                <input type="date" value={proExpDate} onChange={e => setProExpDate(e.target.value)} className="w-full bg-[#090D16] border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => setExtendProUser(null)} className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors">Hủy</button>
                <button onClick={handleExtendPro} disabled={!proExpDate} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-black hover:opacity-90 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20">Kích Hoạt</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* REVOKE PRO */}
        {revokeProUser && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111827] border border-orange-500/30 rounded-[var(--radius-card)] p-6 max-w-sm w-full shadow-2xl relative text-center">
              <h3 className="text-orange-400 font-black text-lg mb-2">Thu Hồi Quyền PRO?</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">Bạn có chắc chắn muốn hạ cấp tài khoản của <strong className="text-white">{revokeProUser.name}</strong> xuống gói Free? Hành động này sẽ khóa các tính năng nâng cao ngay lập tức.</p>
              <div className="flex gap-2">
                <button onClick={() => setRevokeProUser(null)} className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors">Trở lại</button>
                <button onClick={handleRevokePro} className="flex-1 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-colors">Đồng ý Hạ Cấp</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE USER */}
        {deleteUser && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111827] border border-rose-500/30 rounded-[var(--radius-card)] p-6 max-w-sm w-full shadow-2xl relative">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border border-rose-500/20"><Trash2 className="w-6 h-6 text-rose-500"/></div>
              <h3 className="text-center text-rose-500 font-black text-lg mb-2">Xóa Vĩnh Viễn</h3>
              <p className="text-xs text-slate-300 text-center mb-4 leading-relaxed">Hành động này không thể hoàn tác. Dữ liệu học tập của <strong className="text-white">{deleteUser.name}</strong> sẽ bị mất.</p>
              
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 text-center">Nhập tên user để xác nhận</label>
                <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder={deleteUser.name} className="w-full bg-[#090D16] border border-rose-500/30 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-center" />
              </div>

              <div className="flex gap-2">
                <button onClick={() => {setDeleteUser(null); setDeleteConfirmText("");}} className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors">Hủy</button>
                <button onClick={handleDeleteUser} disabled={deleteConfirmText !== deleteUser.name} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${deleteConfirmText === deleteUser.name ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>Xóa Tài Khoản</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
