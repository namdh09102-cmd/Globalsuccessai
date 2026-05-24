"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, CheckCircle2, Rocket, Gamepad2, Brain, Zap, Shield, 
  ChevronRight, Users, Play, Trophy, Star, ArrowRight, BarChart3
} from "lucide-react";

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState(86400 * 2); // 2 days in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 font-nunito selection:bg-indigo-500 selection:text-white">
      {/* Top Notification Bar - FOMO */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white text-center py-2.5 px-4 font-bold text-sm flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="animate-pulse">🔥 Ưu đãi Back-to-School giảm 50% Gói ELITE chỉ còn 49k/tháng.</span>
        <span className="bg-black/20 px-3 py-1 rounded-full font-mono tracking-wider">Kết thúc sau: {formatTime(timeLeft)}</span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl rotate-3 shadow-lg shadow-indigo-500/30">
              G
            </div>
            <span className="font-fredoka text-2xl text-white tracking-wide">GlobalSuccess <span className="text-indigo-400">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
            <a href="#pricing" className="hover:text-white transition-colors">Bảng giá</a>
            <a href="#b2b" className="hover:text-indigo-400 transition-colors">Dành cho Nhà trường</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-slate-300 font-bold hover:text-white text-sm hidden sm:block">
              Đăng nhập
            </Link>
            <Link href="/auth" className="bg-white text-indigo-900 hover:bg-indigo-50 font-black px-6 py-2.5 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Học Thử Miễn Phí
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-slate-200">#1 Nền tảng Gamification & AI Tiếng Anh tại VN</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white font-fredoka leading-tight mb-8">
            Học sinh nghiện. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Phụ huynh thích. Giáo viên nhàn.
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Hệ sinh thái học Tiếng Anh thông minh giúp trẻ em tăng 300% cảm hứng học tập qua Game, tích hợp AI sửa lỗi phát âm và báo cáo tự động cho phụ huynh.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-full text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 group">
              Bắt Đầu Ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all border border-slate-700 flex items-center justify-center gap-2">
              Xem Bảng Giá
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-slate-800">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Được tin dùng bởi hơn 50,000 học sinh & 500 trường học</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Logos placeholders */}
              <div className="text-2xl font-black font-fredoka">Vinschool</div>
              <div className="text-2xl font-black font-fredoka">FPT Schools</div>
              <div className="text-2xl font-black font-fredoka">Newton</div>
              <div className="text-2xl font-black font-fredoka">Archimedes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white font-fredoka mb-4">Hệ Sinh Thái Hoàn Hảo</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Mọi tính năng đều được thiết kế dựa trên nghiên cứu tâm lý học hành vi, đảm bảo sự hứng thú dài hạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500 transition-colors group">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Gamification Cực Cuốn</h3>
              <p className="text-slate-400 leading-relaxed">
                Hệ thống nhiệm vụ, kiếm XP, leo Rank và mua vật phẩm ảo. Đi kèm 6 mini-games trực tiếp trên lớp.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500 transition-colors group">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Sửa Lỗi Phát Âm</h3>
              <p className="text-slate-400 leading-relaxed">
                Công nghệ Speech-to-Text phát hiện chính xác từng âm sai, chấm điểm và gợi ý sửa lỗi ngay lập tức.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-rose-500 transition-colors group">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Báo Cáo Zalo Tự Động</h3>
              <p className="text-slate-400 leading-relaxed">
                Giáo viên gửi báo cáo tình hình học tập hàng tuần tới Phụ huynh qua Zalo ZNS chỉ với 1 cú click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (4 Tầng Doanh Thu) */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white font-fredoka mb-4">Đầu Tư Cho Tương Lai</h2>
            <p className="text-slate-400">Lựa chọn gói phù hợp với mục tiêu học tập của bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
              <p className="text-slate-400 text-sm mb-6">Trải nghiệm tính năng cơ bản</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">Miễn phí</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Học Unit 1 của mọi lớp</li>
                <li className="flex gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Chấm điểm AI (Giới hạn 10 lần/ngày)</li>
                <li className="flex gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Tham gia Game trên lớp</li>
              </ul>
              <Link href="/auth" className="block w-full bg-slate-700 hover:bg-slate-600 text-white text-center font-bold py-3 rounded-xl transition-colors">
                Bắt Đầu Ngay
              </Link>
            </div>

            {/* Pro - 49k */}
            <div className="bg-gradient-to-b from-indigo-900 to-slate-900 border-2 border-indigo-500 p-8 rounded-3xl relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Phổ Biến Nhất</div>
              <h3 className="text-xl font-bold text-white mb-2">PRO</h3>
              <p className="text-indigo-200 text-sm mb-6">Mở khóa toàn bộ chương trình</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">49.000đ</span>
                <span className="text-slate-400">/tháng</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Mở khóa toàn bộ 12 Unit</li>
                <li className="flex gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> AI chấm điểm Không Giới Hạn</li>
                <li className="flex gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Báo cáo chi tiết điểm yếu</li>
                <li className="flex gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Tham gia bảng xếp hạng Toàn quốc</li>
              </ul>
              <Link href="/upgrade" className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white text-center font-bold py-3 rounded-xl transition-colors shadow-lg">
                Nâng Cấp Ngay
              </Link>
            </div>

            {/* Elite - 99k */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-2xl rounded-full" />
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500" /> ELITE</h3>
              <p className="text-slate-400 text-sm mb-6">Luyện thi IELTS & Gia sư AI</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">99.000đ</span>
                <span className="text-slate-400">/tháng</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Mọi quyền lợi của gói PRO</li>
                <li className="flex gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Lộ trình IELTS Master (Cấp 3)</li>
                <li className="flex gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Thi thử Mock Speaking Test AI</li>
                <li className="flex gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Trò chuyện 1-1 với Gia sư AI</li>
              </ul>
              <Link href="/upgrade" className="block w-full bg-slate-700 hover:bg-slate-600 text-white text-center font-bold py-3 rounded-xl transition-colors">
                Chọn Gói ELITE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section id="b2b" className="py-24 bg-indigo-950 relative border-t border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-indigo-900 border border-indigo-800 px-4 py-2 rounded-full mb-6">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-indigo-200">Dành cho Nhà trường / Trung tâm</span>
              </div>
              <h2 className="text-4xl font-black text-white font-fredoka mb-6 leading-tight">Giải Pháp B2B Chuyển Đổi Số Toàn Diện</h2>
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                Tích hợp hệ sinh thái GlobalSuccess AI vào nhà trường. Cung cấp Dashboard quản lý cho Hiệu trưởng, công cụ soạn giáo án AI cho Giáo viên và tự động hóa báo cáo tới Phụ huynh.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="w-5 h-5 text-cyan-400" /> Quản lý hàng ngàn học sinh tập trung.</li>
                <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="w-5 h-5 text-cyan-400" /> Gửi Báo cáo Zalo ZNS hàng loạt.</li>
                <li className="flex items-center gap-3 text-white font-bold"><CheckCircle2 className="w-5 h-5 text-cyan-400" /> Phân quyền Super Admin & Giáo viên.</li>
              </ul>
              <Link href="/school" className="inline-flex items-center gap-2 bg-white text-indigo-900 font-black px-8 py-4 rounded-full hover:bg-indigo-50 transition-colors">
                Truy cập School Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg transform rotate-6">Dành cho Hiệu trưởng</div>
                <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                   <BarChart3 className="w-20 h-20 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; 2026 GlobalSuccess AI. Kỷ nguyên Edtech mới.</p>
      </footer>
    </div>
  );
}

// Fix missing icon
const Crown = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
)
