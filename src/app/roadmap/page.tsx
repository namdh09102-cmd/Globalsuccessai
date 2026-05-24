"use client";

import React from "react";
import { Map } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="flex-1 bg-page h-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-[16px] border border-[rgba(0,0,0,0.1)] shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Map className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-black text-text-head mb-2 font-inter">Lộ trình Học tập</h1>
          <p className="text-text-muted font-medium max-w-md mx-auto">
            Chúng tôi đang xây dựng lộ trình luyện thi IELTS cá nhân hóa dành riêng cho bạn. Vui lòng quay lại sau!
          </p>
        </div>
      </div>
    </div>
  );
}
