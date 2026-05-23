"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Swords, Medal } from "lucide-react";

const LEADERBOARD_MOCK = [
  { id: 1, name: "Minh Anh", xp: 5200, avatar: "👩‍🎓" },
  { id: 2, name: "Tuấn Kiệt", xp: 4800, avatar: "👦" },
  { id: 3, name: "Bảo Trâm", xp: 4100, avatar: "👧" },
  { id: 4, name: "Hải Đăng", xp: 3950, avatar: "🧑" },
  { id: 5, name: "Phương Linh", xp: 3800, avatar: "👱‍♀️" },
];

export default function ClassKing() {
  const [challenging, setChallenging] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col bg-card rounded-[24px] overflow-hidden border-[4px] border-yellow-400 relative">
      
      {/* Header */}
      <div className="bg-yellow-400 text-yellow-900 p-4 flex items-center justify-between z-10 shrink-0">
        <Link href="/games" className="flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito font-bold text-sm">Thoát</span>
        </Link>
        <h1 className="font-fredoka text-xl uppercase tracking-wider">Vua Lớp Học</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center custom-scrollbar">
        
        {/* Top 1 Crown Section */}
        <div className="relative mt-8 mb-12 flex flex-col items-center">
          {/* Animated Crown */}
          <div className="absolute -top-16 text-6xl animate-bounce-custom">
            <div className="animate-[spin_4s_linear_infinite]">👑</div>
          </div>
          
          <div className="w-32 h-32 rounded-full border-[6px] border-yellow-400 bg-yellow-100 flex items-center justify-center text-6xl shadow-[0_8px_0_#FBBF24] relative z-10">
            {LEADERBOARD_MOCK[0].avatar}
          </div>
          
          <div className="mt-6 text-center">
            <h2 className="font-fredoka text-3xl text-text-head mb-1">{LEADERBOARD_MOCK[0].name}</h2>
            <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-1.5 rounded-full border-2 border-yellow-300">
              <span className="text-xl">🔥</span>
              <span className="font-nunito font-black text-yellow-700">{LEADERBOARD_MOCK[0].xp.toLocaleString()} XP</span>
            </div>
          </div>

          <button 
            onClick={() => setChallenging(LEADERBOARD_MOCK[0].id)}
            className="mt-6 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-fredoka text-lg shadow-[0_5px_0_var(--c-primary-dark)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 uppercase tracking-wide"
          >
            <Swords className="w-5 h-5" />
            Thách Đấu Ngay!
          </button>
        </div>

        {/* Rest of Leaderboard */}
        <div className="w-full max-w-2xl bg-white rounded-[24px] border-[3px] border-[rgba(0,0,0,0.1)] p-6 shadow-sm">
          <h3 className="font-fredoka text-lg text-text-muted mb-6 flex items-center justify-center gap-2 uppercase">
            <Medal className="w-5 h-5" />
            Top Lớp Tuần Này
          </h3>
          
          <div className="space-y-4">
            {LEADERBOARD_MOCK.slice(1).map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border-2 border-[rgba(0,0,0,0.05)] hover:border-yellow-300 hover:bg-yellow-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-fredoka text-xl text-text-muted">#{idx + 2}</div>
                  <div className="w-12 h-12 rounded-full bg-page flex items-center justify-center text-2xl border-2 border-[rgba(0,0,0,0.1)]">
                    {user.avatar}
                  </div>
                  <span className="font-nunito font-bold text-lg text-text-head">{user.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-nunito font-black text-xp-dark">{user.xp.toLocaleString()} XP</span>
                  <button 
                    onClick={() => setChallenging(user.id)}
                    className="p-2 rounded-full bg-page text-text-muted hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="Thách đấu"
                  >
                    <Swords className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Challenge Modal */}
      {challenging && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-white rounded-[24px] border-[4px] border-primary-dark p-8 max-w-sm w-full text-center shadow-2xl animate-pop-custom">
            <div className="text-6xl mb-4">⚔️</div>
            <h2 className="font-fredoka text-2xl mb-2">Xác nhận Thách Đấu</h2>
            <p className="font-nunito font-bold text-text-body mb-6">
              Bạn sắp gửi lời thách đấu 1v1 đến <strong className="text-primary-dark">{LEADERBOARD_MOCK.find(u => u.id === challenging)?.name}</strong>. Phí thách đấu: 20 XP.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setChallenging(null)}
                className="flex-1 py-3 rounded-xl font-nunito font-bold text-text-muted bg-page hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <Link 
                href="/games/quick-battle"
                className="flex-1 py-3 rounded-xl font-fredoka text-white bg-primary shadow-[0_4px_0_var(--c-primary-dark)] hover:translate-y-0.5 hover:shadow-[0_2px_0_var(--c-primary-dark)] transition-all uppercase"
              >
                Chiến Thôi!
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
