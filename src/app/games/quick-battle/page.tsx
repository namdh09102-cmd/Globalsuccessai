"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Square, Zap, Swords, Trophy, Users, User, Loader2 } from "lucide-react";
import Confetti from "@/components/Confetti";
import { supabase } from "@/lib/supabase";
import { evaluateSpeaking } from "@/app/actions/eduActions";

const SENTENCES = [
  "The human brain can generate power.",
  "Technology completely transformed modern learning.",
  "Artificial intelligence is the future of education.",
  "Practice makes perfect when learning a new language.",
  "A journey of a thousand miles begins with a single step."
];

export default function QuickBattle() {
  const [step, setStep] = useState<"setup" | "lobby" | "countdown" | "battle" | "result">("setup");
  const [pin, setPin] = useState("");
  const [myName, setMyName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [targetSentence, setTargetSentence] = useState("");
  
  const [countdown, setCountdown] = useState(3);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [winner, setWinner] = useState<"me" | "opponent" | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const channelRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load name from LocalStorage
  useEffect(() => {
    const u = localStorage.getItem("gsa-current-user");
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setMyName(parsed.name || parsed.fullName || "Player");
      } catch (e) {}
    } else {
      setMyName("Player_" + Math.floor(Math.random() * 1000));
    }
  }, []);

  const handleJoin = () => {
    if (pin.length !== 4) return alert("Nhập mã phòng 4 số!");
    
    setStep("lobby");
    
    // Cleanup old channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`quick_battle_${pin}`, {
      config: { broadcast: { ack: false } },
    });

    channel
      .on("broadcast", { event: "player_join" }, (payload) => {
        const msg = payload.payload;
        if (msg.name !== myName) {
          setOpponentName(msg.name);
          // If I am waiting in lobby, and someone else joins, I act as Host and start game
          if (step === "lobby" || step === "setup") {
             const randomSentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
             setTimeout(() => {
               channel.send({
                 type: "broadcast",
                 event: "game_start",
                 payload: { sentence: randomSentence, hostName: myName }
               });
             }, 500); // Give them time to subscribe
          }
        }
      })
      .on("broadcast", { event: "game_start" }, (payload) => {
        const msg = payload.payload;
        if (msg.hostName !== myName) {
           setOpponentName(msg.hostName); // I am joiner
        }
        setTargetSentence(msg.sentence);
        setStep("countdown");
      })
      .on("broadcast", { event: "score_update" }, (payload) => {
        const msg = payload.payload;
        if (msg.name !== myName) {
          setOpponentScore(msg.score);
        }
      })
      .on("broadcast", { event: "game_over" }, (payload) => {
        const msg = payload.payload;
        if (msg.winnerName === myName) {
          setWinner("me");
        } else {
          setWinner("opponent");
        }
        setStep("result");
        if (msg.winnerName === myName) {
          setConfettiTrigger(prev => prev + 1);
          awardXP();
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
           // Say hi to room
           channel.send({
             type: "broadcast",
             event: "player_join",
             payload: { name: myName }
           });
        }
      });

    channelRef.current = channel;
  };

  // Countdown Logic
  useEffect(() => {
    if (step === "countdown") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStep("battle");
      }
    }
  }, [step, countdown]);

  const awardXP = () => {
    const storedStats = localStorage.getItem("gsa-student-stats");
    if (storedStats) {
      try {
        const stats = JSON.parse(storedStats);
        stats.xp += 100;
        localStorage.setItem("gsa-student-stats", JSON.stringify(stats));
        window.dispatchEvent(new Event("stats-updated"));
      } catch (e) {}
    }
  };

  const startRecording = async () => {
    if (step !== "battle" || winner || isEvaluating) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Str = reader.result as string;
          processSpeech(base64Str);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Không thể truy cập Microphone!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try { mediaRecorderRef.current.stop(); } catch(e){}
      setIsRecording(false);
      setIsEvaluating(true);
    }
  };

  const processSpeech = async (base64Str: string) => {
    try {
      // Đọc API Key từ admin
      let customKey = "";
      const storedKeys = localStorage.getItem("gsa-admin-api-keys");
      if (storedKeys) {
        try { customKey = JSON.parse(storedKeys).groq || ""; } catch (e) {}
      }

      const res = await evaluateSpeaking(base64Str, targetSentence, customKey);
      
      const newScore = Math.max(myScore, res.score); // Keep highest score
      setMyScore(newScore);

      // Broadcast my score
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "score_update",
          payload: { name: myName, score: newScore }
        });
      }

      // Check win condition
      if (newScore >= 80) {
        if (channelRef.current) {
          channelRef.current.send({
            type: "broadcast",
            event: "game_over",
            payload: { winnerName: myName }
          });
        }
        setWinner("me");
        setStep("result");
        setConfettiTrigger(prev => prev + 1);
        awardXP();
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetGame = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setStep("setup");
    setCountdown(3);
    setMyScore(0);
    setOpponentScore(0);
    setWinner(null);
    setOpponentName("");
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-teal-500 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]";
    if (s > 50) return "text-indigo-400";
    return "text-slate-300";
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-[24px] overflow-hidden border-[4px] border-slate-800 relative select-none">
      <Confetti trigger={confettiTrigger} />
      
      {/* Header */}
      <div className="bg-slate-950 text-white p-4 flex items-center justify-between z-10 shrink-0 border-b border-slate-800">
        <Link href="/games" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito font-bold text-sm">Thoát</span>
        </Link>
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-teal-400" />
          <h1 className="font-black text-xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Đấu Quick 1v1</h1>
        </div>
        <div className="w-16" />
      </div>

      {step === "setup" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="w-full max-w-sm bg-slate-800/80 backdrop-blur-md border border-slate-700 p-8 rounded-3xl space-y-6 text-center z-10">
            <div className="w-16 h-16 bg-teal-500/20 rounded-2xl mx-auto flex items-center justify-center border border-teal-500/30 mb-2">
              <Zap className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Tạo / Vào Phòng</h2>
              <p className="text-xs text-slate-400 font-medium mt-2">Nhập chung mã PIN 4 số với bạn bè để kết nối thi đấu phát âm Real-time.</p>
            </div>
            
            <input 
              type="text" 
              maxLength={4}
              placeholder="Ví dụ: 1234"
              className="w-full bg-slate-900 border-2 border-slate-700 text-white text-center text-3xl font-black tracking-[0.5em] py-4 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
            />

            <button 
              onClick={handleJoin}
              disabled={pin.length !== 4}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-all"
            >
              Vào Chiến Thôi!
            </button>
          </div>
        </div>
      )}

      {step === "lobby" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          <div className="text-6xl animate-pulse">⏳</div>
          <h2 className="text-3xl font-black text-white">Phòng: {pin}</h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-bold bg-slate-800 px-6 py-3 rounded-full border border-slate-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang đợi đối thủ vào phòng...
          </div>
          <p className="text-xs text-slate-500 text-center max-w-xs">Gửi mã PIN này cho bạn bè, hoặc dùng điện thoại khác nhập mã để tự test trò chơi!</p>
        </div>
      )}

      {(step === "countdown" || step === "battle" || step === "result") && (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* Target Sentence Banner */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md border border-slate-700 px-8 py-4 rounded-2xl z-20 shadow-2xl text-center min-w-[80%] md:min-w-[400px]">
            <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2">Đọc thật to câu tiếng Anh sau:</p>
            <p className="font-serif font-medium text-xl md:text-2xl text-white italic tracking-wide">&ldquo;{targetSentence}&rdquo;</p>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-slate-400 text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Ai đạt 80 điểm trước sẽ thắng
            </div>
          </div>

          {/* Countdown Overlay */}
          {step === "countdown" && (
            <div className="absolute inset-0 bg-slate-950/80 z-30 flex items-center justify-center backdrop-blur-sm">
              <span className="text-[150px] font-black text-white animate-ping drop-shadow-2xl">{countdown}</span>
            </div>
          )}

          {/* Winner Overlay */}
          {step === "result" && (
            <div className="absolute inset-0 bg-slate-950/90 z-30 flex flex-col items-center justify-center backdrop-blur-md animate-fade-in-up">
              <span className="text-8xl mb-6">
                {winner === "me" ? "🏆" : "💀"}
              </span>
              <h2 className={`text-4xl md:text-6xl font-black mb-4 uppercase drop-shadow-lg ${winner === "me" ? "text-teal-400" : "text-rose-500"}`}>
                {winner === "me" ? "Bạn Đã Chiến Thắng!" : "Đối Thủ Thắng Rồi!"}
              </h2>
              {winner === "me" && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-400 text-black font-black text-xl px-8 py-3 rounded-full mb-8 shadow-lg shadow-amber-500/20">
                  +100 XP
                </div>
              )}
              <div className="flex gap-4">
                <button 
                  onClick={resetGame}
                  className="bg-white text-slate-900 font-black px-8 py-4 rounded-2xl hover:bg-slate-200 active:scale-95 transition-all"
                >
                  Chơi Trận Khác
                </button>
              </div>
            </div>
          )}

          {/* Split Screen Battle */}
          <div className="flex-1 flex flex-col md:flex-row h-full pt-28">
            
            {/* My Side */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center p-8 relative">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-500/30 text-teal-400">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-white font-bold text-sm">{myName} (Bạn)</span>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className={`text-8xl md:text-9xl font-black mb-6 transition-colors duration-500 ${getScoreColor(myScore)}`}>
                  {myScore}<span className="text-2xl md:text-4xl text-slate-600">/100</span>
                </div>
                
                {/* Visualizer fake based on recording state */}
                <div className="flex items-center gap-1.5 h-16 mb-8 w-64 justify-center">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 rounded-full transition-all duration-75 ${isRecording ? "bg-teal-400" : "bg-slate-700"}`} 
                      style={{ 
                        height: isRecording ? `${20 + Math.random() * 80}%` : '20%',
                      }} 
                    />
                  ))}
                </div>

                <button 
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onMouseLeave={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  disabled={step !== "battle"}
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-200 border-4 ${
                    isRecording 
                      ? "bg-teal-500 border-teal-400 scale-110 shadow-[0_0_40px_rgba(20,184,166,0.5)]" 
                      : isEvaluating
                      ? "bg-slate-700 border-slate-600 opacity-80"
                      : "bg-slate-800 border-slate-700 hover:border-teal-500/50 hover:bg-slate-800"
                  }`}
                >
                  {isEvaluating ? (
                    <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                  ) : isRecording ? (
                    <Square className="w-10 h-10 text-white fill-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-teal-400" />
                  )}
                </button>
                <span className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-widest">Nhấn giữ để đọc</span>
              </div>
            </div>

            {/* Opponent Side */}
            <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-8 relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-white font-bold text-sm">{opponentName}</span>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className={`text-8xl md:text-9xl font-black mb-6 transition-colors duration-500 ${getScoreColor(opponentScore)}`}>
                  {opponentScore}<span className="text-2xl md:text-4xl text-slate-800">/100</span>
                </div>
                
                {/* Opponent Visualizer */}
                <div className="flex items-center gap-1.5 h-16 mb-8 w-64 justify-center opacity-30">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 rounded-full bg-slate-700 transition-all duration-300" 
                      style={{ 
                        height: opponentScore > 0 ? `${10 + Math.random() * (opponentScore/2)}%` : '10%',
                      }} 
                    />
                  ))}
                </div>
                
                <div className="text-sm font-bold text-slate-700 uppercase tracking-widest">Trạng thái Live</div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
