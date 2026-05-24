"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, Users, TrendingUp, BarChart3, Settings, Shield, Award, Calendar, Bell, ChevronDown, CheckCircle2, AlertTriangle, ArrowUpRight
} from "lucide-react";

export default function SchoolDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "classes" | "teachers" | "reports">("overview");

  // Mock data cho School Dashboard
  const stats = {
    totalStudents: 1250,
    activeToday: 856,
    avgXP: 4500,
    avgScore: 8.2
  };

  const classesData = [
    { name: "10A1", students: 35, avgScore: 8.5, teacher: "Nguyễn Văn A", status: "excellent" },
    { name: "10A2", students: 32, avgScore: 7.8, teacher: "Trần Thị B", status: "good" },
    { name: "11A1", students: 38, avgScore: 8.8, teacher: "Lê Văn C", status: "excellent" },
    { name: "11A3", students: 30, avgScore: 6.5, teacher: "Phạm Thị D", status: "warning" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-nunito flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-white text-lg leading-tight">
            Vinschool <br/><span className="text-xs text-indigo-400 font-normal">School Portal</span>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          <div 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-5 h-5" /> Tổng quan
          </div>
          <div 
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'classes' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}
          >
            <Users className="w-5 h-5" /> Quản lý Lớp học
          </div>
          <div 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'reports' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}
          >
            <TrendingUp className="w-5 h-5" /> Báo cáo Zalo
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-800 text-slate-500">
            <Settings className="w-5 h-5" /> Cài đặt trường
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link href="/landing" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
            <Shield className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-slate-800">
            {activeTab === 'overview' && 'Tổng quan Toàn trường'}
            {activeTab === 'classes' && 'Quản lý Thi đua Lớp'}
            {activeTab === 'reports' && 'Báo cáo Tự động'}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-100" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">HT</div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-slate-800">Hiệu trưởng</div>
                <div className="text-xs text-slate-500">Super Admin</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Tổng Học Sinh</div>
                  <div className="text-4xl font-black text-slate-800 mb-2">{stats.totalStudents}</div>
                  <div className="text-sm font-bold text-green-600 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> +12% so với tháng trước</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Hoạt động hằng ngày</div>
                  <div className="text-4xl font-black text-indigo-600 mb-2">{stats.activeToday}</div>
                  <div className="text-sm font-bold text-green-600 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> Đạt 68% học sinh</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">XP Trung bình</div>
                  <div className="text-4xl font-black text-yellow-500 mb-2">{stats.avgXP}</div>
                  <div className="text-sm text-slate-400">Đứng top 3 hệ thống</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Điểm Phát âm AI</div>
                  <div className="text-4xl font-black text-slate-800 mb-2">{stats.avgScore}<span className="text-xl text-slate-400">/10</span></div>
                  <div className="text-sm text-slate-400">Cải thiện rõ rệt ở khối 10</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart placeholder */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Biểu đồ Tương tác theo tuần</h3>
                  <div className="h-64 flex items-end gap-4 justify-between border-b border-slate-100 pb-2">
                    {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="w-full bg-indigo-100 hover:bg-indigo-200 rounded-t-lg transition-all relative group" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h * 10} truy cập
                        </div>
                        <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg" style={{ height: `${h/2}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                    <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                    <span>Cảnh báo & Nhắc nhở</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Xem tất cả</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-red-900">Lớp 11A3 sụt giảm tương tác</div>
                        <div className="text-sm text-red-700 mt-1">Tỷ lệ nộp bài tập tuần này chỉ đạt 45%. Yêu cầu GVCN nhắc nhở.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                      <Award className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-yellow-900">Lớp 10A1 đạt danh hiệu Lớp Tiên tiến</div>
                        <div className="text-sm text-yellow-700 mt-1">Học sinh lớp 10A1 đã vượt mốc 50.000 XP trong tuần. Hãy khen thưởng.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <Building2 className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800">Đã gửi Báo cáo Zalo cho 1,200 Phụ huynh</div>
                        <div className="text-sm text-slate-500 mt-1">Hệ thống đã hoàn tất gửi ZNS tự động lúc 17:00 hôm nay.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Bảng thi đua các lớp</h3>
                <div className="flex items-center gap-2">
                  <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none">
                    <option>Tất cả khối</option>
                    <option>Khối 10</option>
                    <option>Khối 11</option>
                  </select>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                    + Thêm Lớp
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 text-sm font-bold text-slate-500">Lớp</th>
                      <th className="p-4 text-sm font-bold text-slate-500">Giáo viên</th>
                      <th className="p-4 text-sm font-bold text-slate-500 text-center">Sĩ số</th>
                      <th className="p-4 text-sm font-bold text-slate-500 text-center">Điểm TB</th>
                      <th className="p-4 text-sm font-bold text-slate-500 text-center">Đánh giá</th>
                      <th className="p-4 text-sm font-bold text-slate-500 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classesData.map((c, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-black text-slate-800">{c.name}</td>
                        <td className="p-4 font-bold text-slate-600">{c.teacher}</td>
                        <td className="p-4 text-center font-bold text-slate-600">{c.students}</td>
                        <td className="p-4 text-center font-black text-indigo-600">{c.avgScore}</td>
                        <td className="p-4 text-center">
                          {c.status === 'excellent' && <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Xuất sắc</span>}
                          {c.status === 'good' && <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">Khá tốt</span>}
                          {c.status === 'warning' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full"><AlertTriangle className="w-3 h-3" /> Chú ý</span>}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-indigo-600 font-bold text-sm hover:underline">Chi tiết</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Hệ thống gửi Báo cáo Zalo Tự động</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                Hệ thống sẽ tự động quét điểm số, nhận xét AI và gửi Báo cáo ZNS tới từng Phụ huynh vào 17:00 Thứ Sáu hàng tuần.
              </p>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold px-6 py-3 rounded-xl mb-6">
                <CheckCircle2 className="w-5 h-5" /> Trạng thái: Đang hoạt động
              </div>
              <div className="block">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg">
                  Cấu hình Template Zalo
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
