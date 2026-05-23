"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  Zap,
  CheckCircle,
  Sparkles,
  Lock,
  Shield,
  Star,
  QrCode,
  Copy,
  Check,
  Flame,
  BookOpen,
  Users,
  Gift,
} from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivatePro?: () => void;
}

const PLANS = [
  {
    id: "monthly",
    name: "Gói Tháng",
    price: "199.000đ",
    period: "/ tháng",
    priceNote: "~6.600đ / ngày",
    savings: null,
    color: "indigo",
    borderClass: "border-slate-700/60",
    bgClass: "bg-[#0F1520]",
    buttonClass:
      "bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] hover:bg-primary shadow-[0_4px_0_#312e81] hover:shadow-[0_2px_0_#312e81] active:translate-y-[3px] active:shadow-none",
    features: [
      "Toàn bộ bài học Unit đang học",
      "AI Chấm phát âm không giới hạn",
      "Phòng Dictation & Quiz",
      "Bảng xếp hạng lớp học",
    ],
    popular: false,
    tag: null,
  },
  {
    id: "semester",
    name: "Gói Học Kỳ",
    price: "699.000đ",
    period: "/ 6 tháng",
    priceNote: "~3.800đ / ngày",
    savings: "Tiết kiệm 40%",
    color: "violet",
    borderClass: "border-indigo-600/40",
    bgClass: "bg-[#0F1520]",
    buttonClass:
      "bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)] hover:bg-primary shadow-[0_4px_0_#4c1d95] hover:shadow-[0_2px_0_#4c1d95] active:translate-y-[3px] active:shadow-none",
    features: [
      "Toàn bộ giáo trình Lớp 6–12",
      "AI Chấm phát âm không giới hạn",
      "Thi đua & Bảng thành tích",
      "Hỗ trợ ưu tiên qua Zalo",
    ],
    popular: false,
    tag: null,
  },
  {
    id: "yearly",
    name: "Gói Năm",
    price: "999.000đ",
    period: "/ năm",
    priceNote: "~2.700đ / ngày",
    savings: "Tiết kiệm 58%",
    color: "amber",
    borderClass: "border-indigo-500 ring-2 ring-indigo-500/60 ring-offset-2 ring-offset-[#0B0F19]",
    bgClass: "bg-gradient-to-b from-[#161032] to-[#0F1520]",
    buttonClass:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-[0_4px_0_#92400e] hover:shadow-[0_2px_0_#92400e] active:translate-y-[3px] active:shadow-none font-black",
    features: [
      "Toàn bộ giáo trình Lớp 1–12",
      "AI Chấm phát âm không giới hạn",
      "🎁 Tặng TK Giáo viên / Phụ huynh",
      "Chứng chỉ hoàn thành khoá học",
      "Hỗ trợ VIP 1-1 với Giáo viên",
    ],
    popular: true,
    tag: "🔥 BÁN CHẠY NHẤT",
  },
];

export default function PaywallModal({ isOpen, onClose, onActivatePro }: PaywallModalProps) {
  const [copiedBank, setCopiedBank] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [isPro, setIsPro] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: "Ngân hàng TMCP Quân đội (MB)",
    accountNumber: "0123456789",
    ownerName: "GLOBAL SUCCESS AI JSC"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tier = localStorage.getItem("gsa-user-tier");
      setIsPro(tier === "pro");
      
      const storedBank = localStorage.getItem("gsa-admin-bank");
      if (storedBank) {
        try {
          setBankInfo(JSON.parse(storedBank));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  // Khóa scroll body khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCopyBank = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const fireToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleActivateVIP = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gsa-user-tier", "pro");
      localStorage.setItem("gsa-purchased-pro", "true");
      setIsPro(true);
      window.dispatchEvent(new Event("tier-updated"));
    }
    fireToast(
      "🎉 Đã nâng cấp PRO thành công! Toàn bộ giáo trình Lớp 1 – 12 đã được mở khóa."
    );
    if (onActivatePro) onActivatePro();
    setTimeout(() => onClose(), 2000);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.93, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 280, damping: 28 },
    },
    exit: { opacity: 0, scale: 0.93, y: 30, transition: { duration: 0.18 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: -40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[99] bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-6 py-3 rounded-[var(--radius-card)] shadow-2xl shadow-amber-500/30 flex items-center gap-2 border border-amber-300/40"
              >
                <Crown className="w-4 h-4" />
                <span>{toastMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-auto w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0B0F19] rounded-[var(--radius-card)] border border-slate-800/60 shadow-2xl shadow-black/50 relative"
            >
              {/* Ambient Glows */}
              <div className="absolute top-0 left-1/4 w-96 h-48 bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]/8 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-64 h-48 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 w-8 h-8 rounded-[var(--radius-card)] bg-slate-900 border border-slate-800 flex items-center justify-center text-text-muted hover:text-slate-200 hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-3 relative">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-indigo-500/25 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Global Success PRO</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-amber-300 tracking-tight">
                    Mở Khóa Toàn Diện Quyền Năng AI
                  </h2>
                  <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                    Tiếp cận toàn bộ giáo trình SGK Lớp 1–12, AI chấm phát âm không giới hạn và hàng trăm bài Dictation chuyên sâu.
                  </p>

                  {/* Social Proof */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>15,200+ học sinh đang dùng PRO</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] text-text-muted font-bold ml-1">4.9/5</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative rounded-[var(--radius-card)] border p-5 cursor-pointer transition-all duration-200 ${plan.bgClass} ${plan.borderClass} ${
                        selectedPlan === plan.id ? "scale-[1.02]" : "hover:scale-[1.01] opacity-90 hover:opacity-100"
                      }`}
                    >
                      {/* Popular Tag */}
                      {plan.tag && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-lg">
                          {plan.tag}
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Plan name + savings */}
                        <div>
                          <h3 className={`text-sm font-black ${plan.popular ? "text-amber-400" : "text-slate-200"}`}>
                            {plan.name}
                          </h3>
                          {plan.savings && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-[9px] font-black uppercase tracking-wider">
                              {plan.savings}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-black ${plan.popular ? "text-amber-300" : "text-white"}`}>
                              {plan.price}
                            </span>
                          </div>
                          <span className="text-[10px] text-text-muted font-bold">{plan.period}</span>
                          <p className="text-[9px] text-text-body font-bold mt-0.5">{plan.priceNote}</p>
                        </div>

                        {/* Features */}
                        <ul className="space-y-1.5">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-[10px] text-text-muted font-bold">
                              <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular ? "text-amber-400" : "text-indigo-400"}`} />
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
                          className={`w-full py-2.5 rounded-[var(--radius-card)] text-white text-[11px] font-bold transition-all duration-100 ${plan.buttonClass}`}
                        >
                          {plan.popular ? "⚡ Nâng cấp ngay" : "Chọn gói này"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* VietQR Mock */}
                  <div className="rounded-[var(--radius-card)] border border-slate-800 bg-[#0F1520] p-5 space-y-4">
                    <div className="flex items-center gap-2 text-text-muted">
                      <QrCode className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider">Quét Mã QR Thanh Toán</h4>
                    </div>

                    <div className="flex justify-center">
                      <div className="relative w-36 h-36 rounded-[var(--radius-card)] border-2 border-indigo-500/30 bg-card p-2 shadow-lg shadow-indigo-950/20">
                        <img 
                          src={`https://img.vietqr.io/image/mb-${bankInfo.accountNumber}-compact.png?amount=999000&addInfo=VIP%20KHANH%20TRAN&accountName=${encodeURIComponent(bankInfo.ownerName)}`}
                          alt="VietQR" 
                          className="w-full h-full object-contain rounded-[var(--radius-card)] shadow-lg border border-slate-800"
                        />
                      </div>
                    </div>

                    <p className="text-[9px] text-text-muted text-center leading-relaxed">
                      Quét bằng app ngân hàng bất kỳ. Nội dung chuyển khoản: <span className="text-indigo-400 font-black">GSA + Tên học sinh</span>
                    </p>
                  </div>

                  {/* Bank Transfer Info */}
                  <div className="rounded-[var(--radius-card)] border border-slate-800 bg-[#0F1520] p-5 space-y-4">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Shield className="w-4 h-4 text-teal-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider">Thông Tin Chuyển Khoản</h4>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Ngân hàng", value: bankInfo.bankName },
                        { label: "Chủ tài khoản", value: bankInfo.ownerName },
                        { label: "Số tài khoản", value: bankInfo.accountNumber, copyable: true },
                        { label: "Chi nhánh", value: "Hà Nội – Hoàn Kiếm" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800/50">
                          <span className="text-[10px] text-text-muted font-bold">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-200 font-bold font-mono">{item.value}</span>
                            {item.copyable && (
                              <button
                                onClick={handleCopyBank}
                                className={`p-1 rounded-[var(--radius-btn)] transition-colors ${copiedBank ? "bg-teal-500/15 text-teal-400" : "bg-slate-800 text-text-muted hover:text-slate-200"}`}
                              >
                                {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 p-3 rounded-[var(--radius-card)] bg-amber-500/5 border border-amber-500/15">
                      <p className="text-[9px] text-amber-400/80 font-bold leading-relaxed">
                        ⚡ Sau khi chuyển khoản, tài khoản sẽ được kích hoạt trong vòng <span className="text-amber-400">5-15 phút</span>. Lưu ảnh chụp màn hình để xác nhận.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Test Button + Trust Badges */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/40">
                  {/* Trust Badges */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {[
                      { icon: Shield, text: "Bảo mật 256-bit SSL" },
                      { icon: BookOpen, text: "Toàn bộ SGK Lớp 1–12" },
                      { icon: Flame, text: "Hoàn tiền trong 7 ngày" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-1.5 text-[9px] text-text-muted font-bold">
                        <Icon className="w-3.5 h-3.5 text-text-body" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Admin Test VIP button — nhỏ, ẩn mình */}
                  <button
                    onClick={handleActivateVIP}
                    title="Xác nhận đã chuyển khoản (Bản Test)"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-card)] border border-dashed border-slate-700/60 text-text-body hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/5 text-[9px] font-bold transition-all group"
                  >
                    <Gift className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Xác nhận đã chuyển khoản (Bản Test)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
