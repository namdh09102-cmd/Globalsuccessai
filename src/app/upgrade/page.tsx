"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

const PLANS = [
  {
    id: "monthly",
    name: "Gói Tháng",
    emoji: "🌱",
    price: "199.000đ",
    period: "/ tháng",
    priceNote: "~6.600đ / ngày",
    savings: null,
    popular: false,
    tag: null,
    accentColor: "indigo",
    borderClass: "border-slate-300/50",
    bgGlow: "bg-indigo-500/5",
    tagClass: "from-indigo-600 to-indigo-500",
    btnClass:
      "bg-indigo-600 hover:bg-indigo-500 shadow-[0_4px_0_#312e81] active:translate-y-[4px] active:shadow-none",
    features: [
      "Toàn bộ bài học Unit đang học",
      "AI Chấm phát âm không giới hạn",
      "Phòng Dictation & Quiz offline",
      "Bảng xếp hạng & thi đua lớp",
    ],
  },
  {
    id: "semester",
    name: "Gói Học Kỳ",
    emoji: "📚",
    price: "699.000đ",
    period: "/ 6 tháng",
    priceNote: "~3.800đ / ngày",
    savings: "Tiết kiệm 40%",
    popular: false,
    tag: null,
    accentColor: "violet",
    borderClass: "border-indigo-600/40",
    bgGlow: "bg-indigo-500/5",
    tagClass: "from-indigo-600 to-indigo-500",
    btnClass:
      "bg-indigo-600 hover:bg-indigo-500 shadow-[0_4px_0_#4c1d95] active:translate-y-[4px] active:shadow-none",
    features: [
      "Toàn bộ giáo trình Lớp 6–12",
      "AI Chấm phát âm không giới hạn",
      "Thi đua & Bảng thành tích nâng cao",
      "Hỗ trợ ưu tiên qua Zalo 24/7",
    ],
  },
  {
    id: "yearly",
    name: "Gói Năm",
    emoji: "🏆",
    price: "999.000đ",
    period: "/ năm",
    priceNote: "~2.700đ / ngày",
    savings: "Tiết kiệm 58%",
    popular: true,
    tag: "🔥 BÁN CHẠY NHẤT",
    accentColor: "amber",
    borderClass:
      "border-indigo-500 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-[#0B0F19]",
    bgGlow: "bg-amber-500/5",
    tagClass: "from-amber-500 to-orange-500",
    btnClass:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black shadow-[0_4px_0_#92400e] active:translate-y-[4px] active:shadow-none",
    features: [
      "Toàn bộ giáo trình Lớp 1–12 đầy đủ",
      "AI Chấm phát âm không giới hạn",
      "🎁 Tặng TK Giáo viên / Phụ huynh giám sát",
      "Chứng chỉ hoàn thành khoá học",
      "Hỗ trợ VIP 1-1 với Giáo viên riêng",
      "Ưu tiên tính năng mới & Beta Access",
    ],
  },
];

const FEATURES_COMPARISON = [
  { name: "Bài học Unit 1 (Miễn phí)", free: true, pro: true },
  { name: "Bài học Unit 2–12 (SGK đầy đủ)", free: false, pro: true },
  { name: "AI Chấm phát âm không giới hạn", free: false, pro: true },
  { name: "Phòng Dictation offline", free: "Giới hạn", pro: true },
  { name: "Phòng Quiz offline", free: "Giới hạn", pro: true },
  { name: "Bảng xếp hạng & Thi đua", free: false, pro: true },
  { name: "Tài khoản Giáo viên / Phụ huynh", free: false, pro: "Gói Năm" },
  { name: "Chứng chỉ hoàn thành khoá", free: false, pro: "Gói Năm" },
];

export default function UpgradePage() {
  const [copiedBank, setCopiedBank] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPro(localStorage.getItem("gsa-user-tier") === "pro");
      window.addEventListener("tier-updated", () =>
        setIsPro(localStorage.getItem("gsa-user-tier") === "pro")
      );
    }
  }, []);

  const handleCopyBank = () => {
    navigator.clipboard.writeText("1234567890");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleActivateVIP = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gsa-user-tier", "pro");
      localStorage.setItem("gsa-purchased-pro", "true");
      setIsPro(true);
      window.dispatchEvent(new Event("tier-updated"));
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, type: "spring" as const, stiffness: 200, damping: 22 },
    }),
  };

  return (
    <div className="min-h-full relative">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-6 py-3 rounded-xl shadow-2xl shadow-amber-500/30 flex items-center gap-2 border border-amber-300/40 whitespace-nowrap"
          >
            <Crown className="w-4 h-4" />
            <span>🎉 Đã nâng cấp PRO thành công! Toàn bộ giáo trình Lớp 1 – 12 đã được mở khóa.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-10 pb-16">
        {/* Back Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại Bảng điều khiển
          </Link>

          {isPro && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 text-[10px] font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              Bạn đang là thành viên PRO
            </span>
          )}
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 relative"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-48 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
              <Crown className="w-3.5 h-3.5 animate-pulse" />
              <span>Global Success PRO — Nền Tảng EdTech K-12 #1</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-indigo-600 to-amber-600 tracking-tight leading-tight">
              Mở Khóa Toàn Diện
              <br />
              <span className="text-2xl md:text-3xl">Quyền Năng AI</span>
            </h1>

            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-3 leading-relaxed">
              Tiếp cận toàn bộ giáo trình SGK Lớp 1–12, AI chấm phát âm không giới hạn, hàng trăm bài Dictation & Quiz chuyên sâu.
            </p>

            {/* Social proof bar */}
            <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>15,200+ học sinh đang dùng PRO</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-600" />
                ))}
                <span className="text-[10px] text-slate-500 font-bold ml-1.5">4.9 / 5</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>Hoàn tiền trong 7 ngày</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-xl border bg-[#0F1520] p-6 cursor-pointer transition-all duration-200 overflow-hidden ${plan.borderClass} ${
                selectedPlan === plan.id
                  ? "scale-[1.02] shadow-2xl"
                  : "hover:scale-[1.01] hover:shadow-xl opacity-90 hover:opacity-100"
              }`}
            >
              {/* Ambient Glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 ${plan.bgGlow} rounded-full blur-[60px] pointer-events-none`} />

              {/* Popular Tag */}
              {plan.tag && (
                <div
                  className={`absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.tagClass} text-[10px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap`}
                  style={{ color: plan.id === "yearly" ? "black" : "white" }}
                >
                  {plan.tag}
                </div>
              )}

              <div className="space-y-5 relative">
                {/* Plan Name */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xl">{plan.emoji}</span>
                  <h3
                    className={`text-sm font-black ${
                      plan.popular ? "text-amber-600" : "text-slate-800"
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span
                      className={`text-2xl font-black tracking-tight ${
                        plan.popular ? "text-amber-600" : "text-slate-800"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">{plan.period}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold">{plan.priceNote}</p>
                  {plan.savings && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-600 text-[9px] font-black uppercase tracking-wider">
                      {plan.savings}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-[10px] text-slate-500 font-semibold">
                      <CheckCircle
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          plan.popular ? "text-amber-600" : "text-indigo-600"
                        }`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.id);
                  }}
                  className={`w-full py-3 rounded-xl text-slate-800 text-xs font-bold transition-all duration-100 ${plan.btnClass}`}
                >
                  {plan.popular ? "⚡ Nâng cấp ngay — Chỉ 2.700đ/ngày" : "Chọn gói này"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* QR Code Mock */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-slate-200 bg-[#0F1520] p-6 space-y-5"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-300 flex items-center justify-center text-indigo-600">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Quét Mã QR VietQR</h3>
                <p className="text-[10px] text-slate-500 font-bold">Thanh toán nhanh qua app ngân hàng</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* QR Mockup */}
              <div className="relative w-44 h-44 rounded-xl border-2 border-indigo-500/25 bg-white p-3 shadow-xl shadow-indigo-950/20">
                <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-white">
                  {/* QR Pattern grid mockup */}
                  <div className="grid grid-cols-9 gap-0.5">
                    {Array.from({ length: 81 }).map((_, i) => {
                      const row = Math.floor(i / 9);
                      const col = i % 9;
                      // Corner squares
                      const inTopLeft = row < 3 && col < 3;
                      const inTopRight = row < 3 && col > 5;
                      const inBottomLeft = row > 5 && col < 3;
                      const isCornerBorder =
                        (row < 4 && col < 4 && (row === 0 || row === 3 || col === 0 || col === 3) && !(row > 0 && row < 3 && col > 0 && col < 3)) ||
                        (row < 4 && col > 4 && (row === 0 || row === 3 || col === 5 || col === 8) && !(row > 0 && row < 3 && col > 5 && col < 8)) ||
                        (row > 4 && col < 4 && (row === 5 || row === 8 || col === 0 || col === 3) && !(row > 5 && row < 8 && col > 0 && col < 3));
                      const isFill = inTopLeft || inTopRight || inBottomLeft;
                      const isRandom = !isFill && !isCornerBorder && ((i * 31 + row * 7 + col * 13) % 3 === 0);
                      const filled = isFill || isCornerBorder || isRandom;
                      return (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-sm ${filled ? "bg-slate-100" : "bg-transparent"}`}
                        />
                      );
                    })}
                  </div>
                </div>
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-slate-800" />
                  </div>
                </div>
                {/* VietQR badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-600 text-slate-800 text-[8px] font-black tracking-wider shadow-lg whitespace-nowrap">
                  VietQR · Vietcombank
                </div>
              </div>

              <p className="text-[9px] text-slate-500 text-center leading-relaxed max-w-xs">
                Mở app ngân hàng → Quét mã QR → Nhập nội dung chuyển khoản:
                {" "}<span className="text-indigo-600 font-black">GSA [Tên học sinh]</span>
              </p>
            </div>
          </motion.div>

          {/* Bank Transfer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-slate-200 bg-[#0F1520] p-6 space-y-5"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-300 flex items-center justify-center text-teal-600">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Chuyển Khoản Ngân Hàng</h3>
                <p className="text-[10px] text-slate-500 font-bold">Kích hoạt trong 5–15 phút</p>
              </div>
            </div>

            <div className="space-y-0">
              {[
                { label: "Ngân hàng", value: "Vietcombank (VCB)" },
                { label: "Chủ tài khoản", value: "CONG TY GLOBAL SUCCESS AI" },
                { label: "Số tài khoản", value: "1234567890", copyable: true },
                { label: "Chi nhánh", value: "Hà Nội – Hoàn Kiếm" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0"
                >
                  <span className="text-[10px] text-slate-500 font-bold">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-800 font-bold font-mono">{item.value}</span>
                    {item.copyable && (
                      <button
                        onClick={handleCopyBank}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedBank
                            ? "bg-teal-500/15 text-teal-600"
                            : "bg-slate-100 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <p className="text-[9px] text-amber-600/80 font-bold leading-relaxed">
                ⚡ Sau khi chuyển khoản, tài khoản được kích hoạt trong{" "}
                <span className="text-amber-600">5–15 phút</span>. Hãy lưu ảnh chụp màn hình để xác nhận nếu cần.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-slate-200 bg-[#0F1520] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800">So Sánh Tính Năng</h3>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Miễn phí vs PRO</span>
          </div>

          <div className="divide-y divide-slate-800/40">
            <div className="grid grid-cols-3 px-6 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <span>Tính năng</span>
              <span className="text-center">Miễn phí</span>
              <span className="text-center text-indigo-600">PRO ✦</span>
            </div>
            {FEATURES_COMPARISON.map((feat) => (
              <div key={feat.name} className="grid grid-cols-3 px-6 py-3 hover:bg-slate-100 transition-colors">
                <span className="text-[10px] text-slate-500 font-semibold">{feat.name}</span>
                <div className="flex justify-center">
                  {feat.free === true ? (
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                  ) : feat.free === false ? (
                    <Lock className="w-4 h-4 text-slate-700" />
                  ) : (
                    <span className="text-[9px] text-amber-500/70 font-bold">{feat.free}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {feat.pro === true ? (
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                  ) : typeof feat.pro === "string" ? (
                    <span className="text-[9px] text-amber-600 font-black">{feat.pro}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Admin + Trust Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-5">
            {[
              { icon: Shield, text: "Bảo mật SSL 256-bit" },
              { icon: BookOpen, text: "SGK Lớp 1–12 đầy đủ" },
              { icon: Flame, text: "Hoàn tiền 7 ngày" },
              { icon: Zap, text: "Kích hoạt tức thì" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                <Icon className="w-3.5 h-3.5 text-slate-600" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Admin secret button */}
          <button 
            onClick={handleActivateVIP}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:text-amber-600 hover:border-amber-500/40 hover:bg-amber-500/5 text-[9px] font-bold transition-all group"
          >
            <Gift className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>[Admin] Giả lập kích hoạt VIP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
