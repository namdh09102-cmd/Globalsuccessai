"use client";

import React from "react";
import Link from "next/link";
import { Zap, Castle, Crown, Rocket, Ticket, Users } from "lucide-react";

const GAME_MODES = [
  {
    id: "quick-battle",
    title: "Đấu Quick",
    desc: "1v1 tốc độ! Đọc thật nhanh và chuẩn để hạ gục đối thủ.",
    icon: Zap,
    customClass: "game-dau-quick",
    href: "/games/quick-battle"
  },
  {
    id: "castle-builder",
    title: "Xây Lâu Đài",
    desc: "Cùng cả lớp xây dựng lâu đài tri thức bằng cách trả lời đúng.",
    icon: Castle,
    customClass: "game-lau-dai",
    href: "/games/castle-builder"
  },
  {
    id: "class-king",
    title: "Vua Lớp Học",
    desc: "Bảng vàng danh dự hàng tuần. Thách đấu ngay để đoạt ngôi vương!",
    icon: Crown,
    customClass: "game-vua-lop",
    href: "/games/class-king"
  },
  {
    id: "rocket-race",
    title: "Đua Tên Lửa",
    desc: "Đua tốc độ giải bài tập. Tên lửa ai về đích trước sẽ thắng!",
    icon: Rocket,
    customClass: "game-ten-lua",
    href: "/games/rocket-race"
  },
  {
    id: "spin-wheel",
    title: "Quay May Mắn",
    desc: "Dùng 100 XP để quay thưởng mỗi ngày. Rất nhiều skin hiếm!",
    icon: Ticket,
    customClass: "game-quay-vong",
    href: "/games/spin-wheel"
  },
  {
    id: "team-battle",
    title: "Đội Đấu Đội",
    desc: "Chia 2 phe Xanh - Đỏ. Kéo co điểm số cực kỳ kịch tính.",
    icon: Users,
    customClass: "game-doi-dau",
    href: "/games/team-battle"
  }
];

export default function GamesHub() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-fredoka text-primary-dark uppercase tracking-wide drop-shadow-sm">
          Đấu Trường Game
        </h1>
        <p className="text-text-muted font-nunito font-bold text-sm max-w-lg mx-auto">
          Chọn một chế độ chơi để rèn luyện tiếng Anh, kiếm XP và leo rank cùng bạn bè nhé!
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAME_MODES.map((game, i) => {
          const Icon = game.icon;
          return (
            <Link 
              key={game.id}
              href={game.href}
              className={`game-card ${game.customClass} group relative p-6 cursor-pointer overflow-hidden flex flex-col items-center text-center`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-[18px] bg-white text-current bg-opacity-20 flex items-center justify-center mb-4 shadow-sm group-hover:animate-bounce-custom transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>

              <h2 className="text-[20px] font-fredoka mb-2">
                {game.title}
              </h2>
              
              <p className="text-[13px] font-nunito font-bold opacity-80">
                {game.desc}
              </p>

              <button className="mt-6 w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-colors border border-[rgba(0,0,0,0.05)]">
                Chơi Ngay
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
