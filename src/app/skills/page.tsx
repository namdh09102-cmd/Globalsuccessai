"use client";

import React from "react";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { Activity, BarChart, Target } from "lucide-react";

export default function SkillsPage() {
  return (
    <ClientLayoutWrapper>
      <div className="flex-1 bg-page h-full p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-[16px] border border-[rgba(0,0,0,0.1)] shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-text-head mb-2 font-inter">Phân tích Kỹ năng</h1>
            <p className="text-text-muted font-medium max-w-md mx-auto">
              Hệ thống đang thu thập dữ liệu học tập của bạn để đưa ra phân tích chi tiết. Tính năng này sẽ sớm ra mắt!
            </p>
          </div>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
