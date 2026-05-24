"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  CheckCircle,
  Shield,
  Star,
  Users,
  Flame,
  BookOpen,
  Gift,
  QrCode,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Lock,
  X,
  School
} from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    id: "free",
    name: "Gói Cơ Bản",
    emoji: "🌱",
    price: "0đ",
    period: "/ mãi mãi",
    priceNote: "Trải nghiệm giới hạn",
    savings: null,
    popular: false,
    tag: null,
    accentColor: "slate",
    borderClass: "border-slate-300/50",
    bgGlow: "bg-slate-500/5",
    tagClass: null,
    btnClass: "bg-card text-text-head border border-slate-300 hover:bg-page transition-all",
    features: [
      "Học tối đa 5 bài / ngày",
      "Chơi 3 mini-game cơ bản",
      "Bảng xếp hạng trong lớp",
      "Giới hạn nhận XP / tuần",
      "Có hiển thị quảng cáo",
    ],
  },
  {
    id: "family",
    name: "Gói Gia Đình",
    emoji: "👨‍👩‍👧‍👦",
    price: "49.000đ",
    period: "/ tháng",
    priceNote: "~1.600đ / ngày",
    savings: null,
    popular: true,
    tag: "🔥 PHỔ BIẾN NHẤT",
    accentColor: "teal",
    borderClass: "border-teal-500 ring-2 ring-teal-500/30 ring-offset-2 ring-offset-page",
    bgGlow: "bg-teal-500/10",
    tagClass: "from-teal-500 to-teal-400",
    btnClass: "bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-900/20 active:scale-95 transition-all",
    features: [
      "Học không giới hạn toàn bộ bài",
      "Mở khóa 100% 6 mini-game",
      "Avatar & Skin nhân vật đặc biệt",
      "Báo cáo kết quả cho Phụ huynh",
      "Nhạc học tập Premium",
      "Không bao giờ có quảng cáo",
    ],
  },
  {
    id: "teacher",
    name: "Gói Giáo Viên",
    emoji: "👩‍🏫",
    price: "99.000đ",
    period: "/ tháng",
    priceNote: "~3.300đ / ngày",
    savings: "Cho cá nhân GV",
    popular: false,
    tag: "✨ CHUYÊN GIA",
    accentColor: "indigo",
    borderClass: "border-indigo-500/60 hover:border-indigo-500 transition-colors",
    bgGlow: "bg-indigo-500/10",
    tagClass: "from-indigo-600 to-violet-500",
    btnClass: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/20 active:scale-95 transition-all",
    features: [
      "Soạn giáo án tự động bằng AI",
      "Tạo & Trình chiếu Game trên TV",
      "Quản lý danh sách lớp học",
      "Giao bài tập & Trao thưởng (XP)",
      "Xuất báo cáo PDF học tập",
      "Bao gồm toàn bộ quyền lợi Gói 49k",
    ],
  },
  {
    id: "b2b",
    name: "Gói Nhà Trường",
    emoji: "🏫",
    price: "Liên hệ",
    period: "/ năm học",
    priceNote: "Dành cho BGH",
    savings: "Tối ưu chi phí",
    popular: false,
    tag: "👑 DOANH NGHIỆP",
    accentColor: "amber",
    borderClass: "border-amber-500/50 hover:border-amber-500 border-dashed transition-colors",
    bgGlow: "bg-amber-500/10",
    tagClass: "from-amber-600 to-amber-500",
    btnClass: "bg-transparent text-amber-600 border border-amber-500 font-bold hover:bg-amber-500/10 active:scale-95 transition-all",
    features: [
      "Cấp tài khoản cho toàn bộ GV & HS",
      "Tích hợp hệ thống dữ liệu trường",
      "Branding logo trường riêng biệt",
      "Tập huấn Onboarding tận nơi",
      "Hỗ trợ SLA ưu tiên 24/7",
      "Báo cáo tổng thể cho BGH theo kỳ",
    ],
  }
];

const FEATURES_COMPARISON = [
  { name: "Số bài học mỗi ngày", free: "Tối đa 5 bài", pro: "Không giới hạn", teacher: "Không giới hạn" },
  { name: "Mini-game", free: "3 game cơ bản", pro: "Toàn bộ 6 game", teacher: "Tự tạo vô hạn" },
  { name: "Báo cáo Phụ huynh", free: false, pro: true, teacher: true },
  { name: "Không quảng cáo", free: false, pro: true, teacher: true },
  { name: "Soạn giáo án AI", free: false, pro: false, teacher: true },
  { name: "Trình chiếu Game (TV)", free: false, pro: false, teacher: true },
];

export default function UpgradePage() {
  const [isPro, setIsPro] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPro(localStorage.getItem("gsa-user-tier") === "pro");
      window.addEventListener("tier-updated", () =>
        setIsPro(localStorage.getItem("gsa-user-tier") === "pro")
      );
    }
  }, []);

  const handleOpenPayment = (plan: typeof PLANS[0]) => {
    if (plan.id === "free" || plan.id === "b2b") {
      alert(plan.id === "free" ? "Bạn đang dùng gói cơ bản rồi!" : "Vui lòng liên hệ Hotline: 0909.xxx.xxx để được tư vấn gói B2B.");
      return;
    }
    setSelectedPlanForPayment(plan);
    setShowQRModal(true);
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText("19038289899011");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSimulatePaymentSuccess = () => {
    setShowQRModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("gsa-user-tier", "pro");
      localStorage.setItem("gsa-purchased-pro", "true");
      setIsPro(true);
      window.dispatchEvent(new Event("tier-updated"));
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring" as const, stiffness: 200, damping: 20 },
    }),
  };

  return (
    <div className="min-h-full relative overflow-x-hidden">
      {/* Toast Notification (Fireworks effect in UI) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-black text-xs md:text-sm px-6 py-4 rounded-2xl shadow-2xl shadow-teal-500/40 flex items-center gap-3 border border-emerald-300"
          >
            <Sparkles className="w-6 h-6 animate-spin-slow" />
            <span>🎉 Nâng cấp thành công! Bạn đã chính thức mở khóa toàn bộ quyền năng.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-12 pb-24">
        {/* Back Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-head transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại Bảng điều khiển
          </Link>

          {isPro && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 text-[10px] font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              Tài khoản VIP Đã Kích Hoạt
            </span>
          )}
        </div>

        {/* Section 1: Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-teal-500/30 text-teal-600 text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Được tin dùng bởi 10,000+ học sinh & 500+ giáo viên</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-text-head tracking-tight leading-tight">
              Mở Khóa Tiềm Năng Trọn Vẹn
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">
                cùng GlobalSuccess AI
              </span>
            </h1>

            <p className="text-sm text-text-muted max-w-xl mx-auto mt-4 leading-relaxed font-medium">
              Chấm dứt việc học tiếng Anh nhàm chán. Biến mỗi bài học thành một cuộc phiêu lưu thú vị với AI Coach và hệ sinh thái Gamification siêu việt.
            </p>

            {/* Billing Toggle Mock */}
            <div className="flex items-center justify-center mt-8 gap-3">
              <span className="text-xs font-bold text-text-muted">Hàng tháng</span>
              <div className="w-12 h-6 rounded-full bg-teal-500 p-1 cursor-pointer flex items-center justify-start">
                <div className="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-head">Hàng năm</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  Tiết kiệm 20%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: 4 Tier Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className={`relative rounded-3xl border bg-card p-6 md:p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 group ${plan.borderClass} ${
                plan.popular ? "shadow-2xl shadow-teal-900/10" : "shadow-lg shadow-black/5 hover:shadow-xl"
              }`}
            >
              {plan.bgGlow && (
                <div className={`absolute top-0 right-0 w-32 h-32 ${plan.bgGlow} rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700`} />
              )}

              {plan.tag && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.tagClass} text-white text-[10px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap z-10`}
                >
                  {plan.tag}
                </div>
              )}

              <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-12 h-12 rounded-2xl bg-page border border-slate-200/50 flex items-center justify-center text-2xl shadow-sm">
                  {plan.emoji}
                </div>
                <div>
                  <h3 className="text-sm font-black text-text-head uppercase tracking-wide">{plan.name}</h3>
                  <p className="text-[10px] font-bold text-text-muted mt-0.5">{plan.priceNote}</p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-200/50 relative">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-text-head tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-xs text-text-muted font-bold">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-500/10 inline-block px-2 py-0.5 rounded-md">
                    {plan.savings}
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1 relative">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <CheckCircle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.popular ? "text-teal-500" : plan.id === "teacher" ? "text-indigo-500" : "text-text-muted"
                      }`}
                    />
                    <span className="text-xs text-text-body font-medium leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleOpenPayment(plan)}
                className={`w-full py-3.5 rounded-xl text-xs uppercase tracking-wider mt-auto relative z-10 ${plan.btnClass}`}
              >
                {plan.id === "b2b" ? "Liên hệ ngay" : plan.id === "free" ? "Đang sử dụng" : "Nâng cấp ngay"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Section 3: Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto rounded-3xl border border-slate-200/50 bg-card overflow-hidden shadow-xl shadow-black/5"
        >
          <div className="px-6 py-6 md:px-8 md:py-8 border-b border-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-text-head">So sánh chi tiết</h3>
              <p className="text-xs text-text-muted font-medium mt-1">Chọn đúng gói phù hợp với nhu cầu của bạn</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-page">
                  <th className="p-4 md:p-6 text-xs font-bold text-text-muted uppercase tracking-wider w-1/3">Tính năng</th>
                  <th className="p-4 md:p-6 text-xs font-black text-text-head uppercase tracking-wider text-center w-2/9">Cơ bản</th>
                  <th className="p-4 md:p-6 text-xs font-black text-teal-600 uppercase tracking-wider text-center w-2/9 bg-teal-500/5">Gia đình</th>
                  <th className="p-4 md:p-6 text-xs font-black text-indigo-600 uppercase tracking-wider text-center w-2/9">Giáo viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {FEATURES_COMPARISON.map((row, idx) => (
                  <tr key={idx} className="hover:bg-page/50 transition-colors">
                    <td className="p-4 md:p-6 text-xs font-bold text-text-head">{row.name}</td>
                    
                    {/* Free */}
                    <td className="p-4 md:p-6 text-center">
                      {row.free === true ? <Check className="w-5 h-5 mx-auto text-slate-400" /> : 
                       row.free === false ? <Lock className="w-4 h-4 mx-auto text-slate-300" /> : 
                       <span className="text-xs font-bold text-slate-500">{row.free}</span>}
                    </td>
                    
                    {/* Family */}
                    <td className="p-4 md:p-6 text-center bg-teal-500/5">
                      {row.pro === true ? <CheckCircle className="w-5 h-5 mx-auto text-teal-500" /> : 
                       row.pro === false ? <Lock className="w-4 h-4 mx-auto text-slate-300" /> : 
                       <span className="text-xs font-bold text-teal-600">{row.pro}</span>}
                    </td>

                    {/* Teacher */}
                    <td className="p-4 md:p-6 text-center">
                      {row.teacher === true ? <CheckCircle className="w-5 h-5 mx-auto text-indigo-500" /> : 
                       row.teacher === false ? <Lock className="w-4 h-4 mx-auto text-slate-300" /> : 
                       <span className="text-xs font-bold text-indigo-600">{row.teacher}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer Trust Markers */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-8 border-t border-slate-200/50">
          {[
            { icon: Shield, text: "Thanh toán an toàn 256-bit" },
            { icon: Users, text: "Hỗ trợ 24/7 chuyên nghiệp" },
            { icon: School, text: "Chuẩn GD&TĐ Việt Nam" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <Icon className="w-5 h-5 text-slate-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* QR Payment Modal */}
      <AnimatePresence>
        {showQRModal && selectedPlanForPayment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <button 
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="text-center space-y-2 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center mb-4">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-text-head">Thanh Toán VietQR</h2>
                  <p className="text-sm text-text-muted font-medium">
                    Gói {selectedPlanForPayment.name} - <span className="font-black text-teal-600">{selectedPlanForPayment.price}</span>
                  </p>
                </div>

                {/* QR Code Graphic */}
                <div className="flex justify-center mb-8">
                  <div className="w-48 h-48 rounded-2xl border-4 border-teal-500/20 bg-white p-3 relative shadow-lg">
                    {/* Simulated QR pattern */}
                    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-30">
                        {Array.from({length: 36}).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.3 ? 'bg-slate-800' : 'bg-transparent'}`} />
                        ))}
                      </div>
                      {/* Logo in center */}
                      <div className="relative z-10 w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-page rounded-2xl p-5 border border-slate-200/50 space-y-3 mb-8">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-muted">Ngân hàng:</span>
                    <span className="font-black text-text-head">Techcombank</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-muted">Tên tài khoản:</span>
                    <span className="font-black text-text-head uppercase">CTCP Global Success AI</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-muted">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-teal-600 font-mono text-sm">19038289899011</span>
                      <button onClick={handleCopyBank} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors">
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-200/50">
                    <span className="font-bold text-text-muted">Nội dung chuyển:</span>
                    <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">GSA CONG2024</span>
                  </div>
                </div>

                {/* Simulate Success Button */}
                <button
                  onClick={handleSimulatePaymentSuccess}
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Tôi đã chuyển khoản xong (Giả lập)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
