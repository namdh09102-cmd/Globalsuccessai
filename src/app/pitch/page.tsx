"use client";

import React, { useState } from "react";
import { Network, Gamepad2, GraduationCap, CircleDollarSign, Share2, Zap, Trophy, Rocket, Crown, Star, Sparkles, BookOpen, BarChart3, Clock, Gift, Shield } from "lucide-react";

type TabType = "ecosystem" | "games" | "teacher" | "monetization";

export default function PitchDeckPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ecosystem");

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333] font-inter p-6 md:p-10 flex flex-col items-center overflow-y-auto">
      <div className="w-full max-w-[1000px] flex flex-col gap-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab("ecosystem")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-sm whitespace-nowrap ${
                activeTab === "ecosystem" 
                  ? "bg-[#FF5A5F] text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Network className="w-5 h-5" /> Hệ sinh thái
            </button>
            <button
              onClick={() => setActiveTab("games")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-sm whitespace-nowrap ${
                activeTab === "games" 
                  ? "bg-[#FF5A5F] text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Gamepad2 className="w-5 h-5" /> Trò chơi
            </button>
            <button
              onClick={() => setActiveTab("teacher")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-sm whitespace-nowrap ${
                activeTab === "teacher" 
                  ? "bg-[#FF5A5F] text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <GraduationCap className="w-5 h-5" /> Giáo viên
            </button>
            <button
              onClick={() => setActiveTab("monetization")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-sm whitespace-nowrap ${
                activeTab === "monetization" 
                  ? "bg-[#FF5A5F] text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <CircleDollarSign className="w-5 h-5" /> Kiếm tiền
            </button>
          </div>
          <div className="text-gray-400">...</div>
        </div>

        {/* Tab 1: Hệ sinh thái */}
        {activeTab === "ecosystem" && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-[#C83E4D] font-black text-xl flex items-center gap-2">
              <Share2 className="w-6 h-6" /> 2 người dùng — 1 hệ sinh thái gắn kết
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Teacher */}
              <div className="bg-[#F0F8FA] border-[2px] border-[#48A9A6] rounded-[16px] p-6 shadow-sm">
                <h3 className="text-[#3B8B88] font-black uppercase text-sm mb-1">Giáo viên</h3>
                <h4 className="text-[#1A5B59] font-black text-lg mb-2">Tạo bài học & giao nhiệm vụ</h4>
                <p className="text-[#2F7370] text-sm font-medium">Soạn câu hỏi, chọn mini-game, giao bài về nhà cho từng lớp</p>
              </div>

              {/* Student */}
              <div className="bg-[#FFF0F0] border-[2px] border-[#FF6B6B] rounded-[16px] p-6 shadow-sm">
                <h3 className="text-[#D94848] font-black uppercase text-sm mb-1">Học sinh</h3>
                <h4 className="text-[#A62B2B] font-black text-lg mb-2">Chơi • Học • Ganh đua</h4>
                <p className="text-[#CC4444] text-sm font-medium">Nhận nhiệm vụ, chơi game học tiếng Anh, kiếm XP và huy hiệu</p>
              </div>

              {/* Parent */}
              <div className="bg-[#FFF9EE] border-[2px] border-[#F4B942] rounded-[16px] p-6 shadow-sm">
                <h3 className="text-[#CC9429] font-black uppercase text-sm mb-1">Phụ huynh</h3>
                <h4 className="text-[#996C17] font-black text-lg mb-2">Theo dõi tiến độ</h4>
                <p className="text-[#B38020] text-sm font-medium">Nhận báo cáo tuần, thấy con tiến bộ → tin tưởng → trả phí</p>
              </div>

              {/* School */}
              <div className="bg-[#F0FFF4] border-[2px] border-[#4CAF50] rounded-[16px] p-6 shadow-sm">
                <h3 className="text-[#388E3C] font-black uppercase text-sm mb-1">Nhà trường</h3>
                <h4 className="text-[#2E7D32] font-black text-lg mb-2">Mua gói trường / lớp</h4>
                <p className="text-[#43A047] text-sm font-medium">Tích hợp vào giáo án, dùng cho cả trường → doanh thu B2B lớn</p>
              </div>
            </div>

            {/* Banner */}
            <div className="bg-[#FFF9EE] border-[2px] border-[#F4B942] rounded-[12px] p-4 shadow-sm flex items-center gap-3">
              <Sparkles className="text-[#F4B942] w-6 h-6" />
              <p className="text-[#996C17] font-bold">Vòng lặp vàng: Giáo viên assign → Học sinh nghiện chơi → Phụ huynh thấy kết quả → Trường mua gói</p>
            </div>
          </div>
        )}

        {/* Tab 2: Trò chơi */}
        {activeTab === "games" && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-[#C83E4D] font-black text-xl flex items-center gap-2">
              <Trophy className="w-6 h-6" /> Mini-game ganh đua theo lớp
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#FFE5E5] border-[2px] border-black rounded-[16px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="text-[#C83E4D] font-black text-[15px] mb-2">Đấu nhanh</h4>
                <p className="text-[#8C2C36] text-[11px] font-medium leading-tight">2 học sinh đấu phát âm / từ vựng real-time. AI chấm điểm tức thì</p>
              </div>
              
              <div className="bg-[#E5F6FF] border-[2px] border-black rounded-[16px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🏗️</div>
                <h4 className="text-[#006699] font-black text-[15px] mb-2">Xây lâu đài</h4>
                <p className="text-[#004C73] text-[11px] font-medium leading-tight">Mỗi bài đúng = thêm 1 mảnh xây. Cả lớp xây chung 1 công trình</p>
              </div>

              <div className="bg-[#FFF8E5] border-[2px] border-black rounded-[16px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">👑</div>
                <h4 className="text-[#996600] font-black text-[15px] mb-2">Vua lớp học</h4>
                <p className="text-[#734D00] text-[11px] font-medium leading-tight">Bảng xếp hạng tuần. Quán quân được đặt vương miện trên avatar</p>
              </div>

              <div className="bg-[#E5FFE5] border-[2px] border-black rounded-[16px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🚀</div>
                <h4 className="text-[#008000] font-black text-[15px] mb-2">Đua tên lửa</h4>
                <p className="text-[#006600] text-[11px] font-medium leading-tight">Trả lời đúng = tên lửa bay nhanh hơn. Chiếu lên TV lớp học</p>
              </div>

              <div className="bg-[#FFF0F5] border-[2px] border-black rounded-[16px] p-5 shadow-sm text-center flex flex-col items-center justify-center relative">
                <span className="absolute top-2 left-2 bg-[#0066CC] text-white text-[9px] font-black px-2 py-0.5 rounded">NEW</span>
                <div className="text-4xl mb-3 mt-3">🎡</div>
                <h4 className="text-[#99004D] font-black text-[15px] mb-2">Quay may mắn</h4>
                <p className="text-[#660033] text-[11px] font-medium leading-tight">Dùng XP quay để nhân đôi điểm, mở khóa skin nhân vật đặc biệt</p>
              </div>

              <div className="bg-[#F0E6FF] border-[2px] border-black rounded-[16px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="text-[#4D0099] font-black text-[15px] mb-2">Đội đấu đội</h4>
                <p className="text-[#330066] text-[11px] font-medium leading-tight">Chia 2 team trong lớp. Cộng điểm tập thể. Đội thua làm thêm bài</p>
              </div>
            </div>

            <div className="bg-[#FFF9EE] border-[2px] border-[#F4B942] rounded-[12px] p-4 shadow-sm flex items-center justify-center gap-3">
              <span className="text-2xl">📺</span>
              <p className="text-[#996C17] font-bold text-sm">Chế độ "Chiếu lên bảng": Giáo viên bật trong tiết — cả lớp thấy bảng xếp hạng trực tiếp trên màn hình lớn</p>
            </div>
          </div>
        )}

        {/* Tab 3: Giáo viên */}
        {activeTab === "teacher" && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-[#C83E4D] font-black text-xl flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Công cụ giáo viên — lý do họ trả tiền
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F0F8FA] border-[2px] border-black rounded-[16px] p-6 shadow-sm">
                <div className="text-3xl mb-3">📄</div>
                <h4 className="text-[#1A5B59] font-black text-lg mb-3">Soạn giáo án AI</h4>
                <ul className="space-y-2 text-[#2F7370] text-sm font-medium">
                  <li className="flex gap-2"><span>—</span> Nhập chủ đề → AI ra bài tập ngay</li>
                  <li className="flex gap-2"><span>—</span> Tự sinh câu hỏi theo SGK</li>
                  <li className="flex gap-2"><span>—</span> Xuất PDF giáo án chuẩn bộ</li>
                  <li className="flex gap-2"><span>—</span> Tiết kiệm 2-3h soạn/tuần</li>
                </ul>
              </div>

              <div className="bg-[#FFF0F0] border-[2px] border-black rounded-[16px] p-6 shadow-sm">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="text-[#A62B2B] font-black text-lg mb-3">Theo dõi cả lớp</h4>
                <ul className="space-y-2 text-[#CC4444] text-sm font-medium">
                  <li className="flex gap-2"><span>—</span> Dashboard từng học sinh</li>
                  <li className="flex gap-2"><span>—</span> Biết ai yếu kỹ năng nào</li>
                  <li className="flex gap-2"><span>—</span> Giao bài riêng cho nhóm yếu</li>
                  <li className="flex gap-2"><span>—</span> Báo cáo gửi phụ huynh 1 click</li>
                </ul>
              </div>

              <div className="bg-[#F0FFF4] border-[2px] border-black rounded-[16px] p-6 shadow-sm">
                <div className="text-3xl mb-3">🎮</div>
                <h4 className="text-[#2E7D32] font-black text-lg mb-3">Khởi động tiết học</h4>
                <ul className="space-y-2 text-[#43A047] text-sm font-medium">
                  <li className="flex gap-2"><span>—</span> Bật game 5 phút đầu tiết</li>
                  <li className="flex gap-2"><span>—</span> Cả lớp tham gia qua điện thoại</li>
                  <li className="flex gap-2"><span>—</span> Kết quả hiện lên TV ngay lập tức</li>
                  <li className="flex gap-2"><span>—</span> Thay thế hoàn toàn Kahoot</li>
                </ul>
              </div>

              <div className="bg-[#FFF9EE] border-[2px] border-black rounded-[16px] p-6 shadow-sm">
                <div className="text-3xl mb-3">🎉</div>
                <h4 className="text-[#996C17] font-black text-lg mb-3">Thưởng & kỷ luật số</h4>
                <ul className="space-y-2 text-[#B38020] text-sm font-medium">
                  <li className="flex gap-2"><span>—</span> Tặng XP thưởng cho HS xuất sắc</li>
                  <li className="flex gap-2"><span>—</span> Tạo thử thách riêng cho lớp</li>
                  <li className="flex gap-2"><span>—</span> Mở khoá skin đặc biệt do thầy cô tặng</li>
                  <li className="flex gap-2"><span>—</span> Gắn kết cảm xúc thầy-trò</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#FFF9EE] border-[2px] border-[#F4B942] rounded-[12px] p-4 shadow-sm flex items-center justify-center gap-3">
              <span className="text-[#F4B942] text-xl">🎖️</span>
              <p className="text-[#996C17] font-bold text-sm">Mục tiêu: Giáo viên nghĩ "không có app này tôi dạy thiếu rồi" — đó là lúc trường bắt đầu mua gói</p>
            </div>
          </div>
        )}

        {/* Tab 4: Kiếm tiền */}
        {activeTab === "monetization" && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-[#C83E4D] font-black text-xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6" /> Mô hình doanh thu đa tầng
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#E5FFE5] border-[2px] border-black rounded-[16px] p-5 shadow-sm">
                <span className="bg-[#4CAF50] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Free</span>
                <h4 className="text-[#2E7D32] font-black text-[13px] mt-2 mb-1 uppercase tracking-wide">Học sinh cá nhân</h4>
                <div className="text-[#1B5E20] font-black text-3xl mb-4">0đ</div>
                <ul className="space-y-2 text-[#2E7D32] text-xs font-bold">
                  <li className="flex gap-1.5"><span>✓</span> 5 bài/ngày</li>
                  <li className="flex gap-1.5"><span>✓</span> Bảng xếp hạng lớp</li>
                  <li className="flex gap-1.5"><span>✓</span> 3 mini-game cơ bản</li>
                  <li className="flex gap-1.5"><span>✓</span> Nhân vật mặc định</li>
                </ul>
              </div>

              <div className="bg-[#FFF9EE] border-[2px] border-black rounded-[16px] p-5 shadow-sm relative -translate-y-2">
                <span className="bg-[#9C27B0] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Pro</span>
                <h4 className="text-[#7B1FA2] font-black text-[13px] mt-2 mb-1 uppercase tracking-wide">Gia đình / tháng</h4>
                <div className="text-[#4A148C] font-black text-3xl mb-4">49k</div>
                <ul className="space-y-2 text-[#7B1FA2] text-xs font-bold">
                  <li className="flex gap-1.5"><span>✓</span> Không giới hạn bài</li>
                  <li className="flex gap-1.5"><span>✓</span> Tất cả mini-game</li>
                  <li className="flex gap-1.5"><span>✓</span> Skin & avatar đặc biệt</li>
                  <li className="flex gap-1.5"><span>✓</span> Báo cáo phụ huynh</li>
                  <li className="flex gap-1.5"><span>✓</span> Không quảng cáo</li>
                </ul>
              </div>

              <div className="bg-[#E5F6FF] border-[2px] border-black rounded-[16px] p-5 shadow-sm">
                <span className="bg-[#FF5A5F] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">B2B</span>
                <h4 className="text-[#006699] font-black text-[13px] mt-2 mb-1 uppercase tracking-wide">Giáo viên / tháng</h4>
                <div className="text-[#004C73] font-black text-3xl mb-4">99k</div>
                <ul className="space-y-2 text-[#006699] text-xs font-bold">
                  <li className="flex gap-1.5"><span>✓</span> Soạn giáo án AI</li>
                  <li className="flex gap-1.5"><span>✓</span> Dashboard cả lớp</li>
                  <li className="flex gap-1.5"><span>✓</span> Tạo game riêng</li>
                  <li className="flex gap-1.5"><span>✓</span> Chiếu lên bảng TV</li>
                  <li className="flex gap-1.5"><span>✓</span> Xuất báo cáo PDF</li>
                </ul>
              </div>

              <div className="bg-[#F0E6FF] border-[2px] border-black rounded-[16px] p-5 shadow-sm">
                <span className="bg-[#673AB7] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Trường</span>
                <h4 className="text-[#512DA8] font-black text-[13px] mt-2 mb-1 uppercase tracking-wide">/ năm học</h4>
                <div className="text-[#311B92] font-black text-[22px] leading-tight mb-4">Thương lượng</div>
                <ul className="space-y-2 text-[#4527A0] text-xs font-bold">
                  <li className="flex gap-1.5 items-start"><span>✓</span> Toàn bộ giáo viên & HS</li>
                  <li className="flex gap-1.5 items-start"><span>✓</span> Tích hợp hệ thống trường</li>
                  <li className="flex gap-1.5 items-start"><span>✓</span> Branding trường</li>
                  <li className="flex gap-1.5 items-start"><span>✓</span> Hỗ trợ tập huấn</li>
                  <li className="flex gap-1.5 items-start"><span>✓</span> Hợp đồng năm học</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#FFF9EE] border-[2px] border-[#F4B942] rounded-[12px] p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#F4B942] text-white rounded-full w-8 h-8 flex items-center justify-center font-black">$</div>
                <p className="text-[#996C17] font-bold text-sm max-w-[500px] leading-tight">
                  Chiến lược: Free → Phụ huynh thấy kết quả → nâng Pro 49k. Giáo viên dùng thích → thuyết phục trường → hợp đồng B2B lớn nhất
                </p>
              </div>
              <button className="bg-[#FFF9EE] border-[2px] border-[#F4B942] text-[#996C17] font-black px-4 py-2 rounded-[8px] whitespace-nowrap hover:bg-[#F4B942] hover:text-white transition-colors text-sm">
                Xem mockup chi tiết ↗
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
