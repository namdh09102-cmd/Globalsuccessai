"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Rocket, Zap, CheckCircle2, PlayCircle } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";

// Mock data câu hỏi từ vựng tiếng Anh
const QUESTIONS = [
  { q: "Nghề nghiệp: 'Bác sĩ' trong tiếng Anh là gì?", options: ["Doctor", "Engineer", "Teacher", "Pilot"], ans: 0 },
  { q: "Từ nào sau đây nghĩa là 'Trường học'?", options: ["Hospital", "School", "Market", "Park"], ans: 1 },
  { q: "Con vật nào là 'Con mèo'?", options: ["Dog", "Cat", "Bird", "Fish"], ans: 1 },
  { q: "Màu 'Đỏ' là màu nào?", options: ["Blue", "Green", "Red", "Yellow"], ans: 2 },
  { q: "Số '5' trong tiếng Anh viết là?", options: ["Three", "Four", "Five", "Six"], ans: 2 },
  { q: "'Gia đình' tiếng Anh là gì?", options: ["Friend", "Family", "Teacher", "Student"], ans: 1 },
  { q: "Đồ vật 'Cây bút' là?", options: ["Book", "Pen", "Ruler", "Eraser"], ans: 1 },
  { q: "Môn 'Toán' tiếng Anh là?", options: ["Music", "Art", "Math", "History"], ans: 2 },
  { q: "Động từ 'Chạy' là?", options: ["Walk", "Run", "Jump", "Swim"], ans: 1 },
  { q: "Thời tiết 'Nắng' là?", options: ["Rainy", "Cloudy", "Windy", "Sunny"], ans: 3 }
];

export default function PlayGame() {
  const [step, setStep] = useState<"login" | "lobby" | "playing" | "finished">("login");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [team, setTeam] = useState<number>(0);
  
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // Connect to Supabase Room
  const joinRoom = () => {
    if (!pin || !name || team === 0) return;
    
    const roomChannel = supabase.channel(`room_${pin}`, {
      config: {
        broadcast: { ack: false },
      },
    });

    roomChannel
      .on("broadcast", { event: "game_start" }, () => {
        setStep("playing");
      })
      .on("broadcast", { event: "game_reset" }, () => {
        setStep("lobby");
        setQIndex(0);
        setScore(0);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setChannel(roomChannel);
          setStep("lobby");
          // Thông báo cho GV có người mới vào (tuỳ chọn)
          roomChannel.send({
            type: "broadcast",
            event: "student_join",
            payload: { name, team },
          });
        }
      });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [channel]);

  const handleAnswer = (optIndex: number) => {
    const isCorrect = optIndex === QUESTIONS[qIndex].ans;
    
    if (isCorrect && channel) {
      setScore(s => s + 10);
      // Bắn tín hiệu lên cho Giáo viên cập nhật xe đua
      channel.send({
        type: "broadcast",
        event: "answer_correct",
        payload: { name, team, points: 5 }, // 5% tiến độ mỗi câu
      });
    }

    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setStep("finished");
    }
  };

  if (step === "login") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-[#FAECE7] text-[#E63946] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Rocket className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">GlobalSuccess Play</h1>
          
          <input 
            type="text" placeholder="Mã PIN phòng (VD: 123456)" 
            value={pin} onChange={e => setPin(e.target.value.toUpperCase())}
            className="w-full bg-slate-50 border-2 border-slate-200 text-center text-xl font-bold py-3 rounded-xl outline-none focus:border-[#E63946] transition-colors"
          />
          <input 
            type="text" placeholder="Tên của bạn" 
            value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 text-center text-xl font-bold py-3 rounded-xl outline-none focus:border-[#E63946] transition-colors"
          />
          
          <div className="text-left">
            <p className="text-sm font-bold text-slate-500 mb-2">Chọn Đội Đua:</p>
            <div className="flex gap-2">
              <button onClick={() => setTeam(1)} className={`flex-1 py-3 rounded-xl font-bold border-2 ${team === 1 ? 'border-[#E63946] bg-[#FAECE7] text-[#E63946]' : 'border-slate-200 text-slate-400'}`}>Đội Đỏ</button>
              <button onClick={() => setTeam(2)} className={`flex-1 py-3 rounded-xl font-bold border-2 ${team === 2 ? 'border-[#0F6E56] bg-[#E1F5EE] text-[#0F6E56]' : 'border-slate-200 text-slate-400'}`}>Đội Xanh</button>
              <button onClick={() => setTeam(3)} className={`flex-1 py-3 rounded-xl font-bold border-2 ${team === 3 ? 'border-[#534AB7] bg-[#EEEDFE] text-[#534AB7]' : 'border-slate-200 text-slate-400'}`}>Đội Tím</button>
            </div>
          </div>

          <button 
            onClick={joinRoom}
            disabled={!pin || !name || !team}
            className="w-full bg-[#E63946] hover:bg-[#c62b37] text-white text-lg font-black py-4 rounded-xl transition-all disabled:opacity-50 mt-4"
          >
            Vào Chơi!
          </button>
        </div>
      </div>
    );
  }

  if (step === "lobby") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <PlayCircle className="w-10 h-10 text-[#4ECDC4]" />
        </div>
        <h2 className="text-3xl font-black mb-2">Đã vào phòng!</h2>
        <p className="text-lg text-slate-400 mb-8">Xin chào, <span className="font-bold text-white">{name}</span> (Đội {team})</p>
        
        <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
          <span className="font-bold text-slate-300">Đang chờ giáo viên bắt đầu...</span>
        </div>
      </div>
    );
  }

  if (step === "playing") {
    const q = QUESTIONS[qIndex];
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between border-b border-slate-200">
          <div className="font-bold text-slate-500">Đội {team}</div>
          <div className="font-black text-lg text-slate-800">Câu {qIndex + 1}/{QUESTIONS.length}</div>
          <div className="font-bold text-[#0F6E56] bg-[#E1F5EE] px-3 py-1 rounded-full">{score} XP</div>
        </div>
        
        <div className="flex-1 flex flex-col p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex-1 flex items-center justify-center text-center mb-4">
            <h2 className="text-2xl font-black text-slate-800">{q.q}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 h-[40vh]">
            {q.options.map((opt, i) => {
              const colors = [
                "bg-[#E63946] border-[#c62b37]", 
                "bg-[#0F6E56] border-[#0a4d3c]", 
                "bg-[#BA7517] border-[#8e5810]", 
                "bg-[#534AB7] border-[#3e378c]"
              ];
              return (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  className={`${colors[i]} border-b-4 text-white text-xl font-black rounded-xl active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center p-4`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <CheckCircle2 className="w-24 h-24 text-green-400 mb-6" />
      <h2 className="text-4xl font-black mb-2">Hoàn Thành!</h2>
      <p className="text-xl text-slate-400 mb-8">Bạn đã xuất sắc mang về <span className="font-bold text-white">{score} XP</span> cho Đội {team}</p>
      
      <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl max-w-sm w-full">
        <p className="text-sm text-slate-400">Hãy nhìn lên bảng để xem đội nào chiến thắng nhé!</p>
      </div>
    </div>
  );
}
