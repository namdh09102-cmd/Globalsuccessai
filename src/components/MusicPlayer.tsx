"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";
import { audioManager } from "@/lib/AudioManager";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Check initial permission or ask for it
  useEffect(() => {
    const checkAuth = localStorage.getItem("gsa-music-permission");
    if (checkAuth === "true") {
      setHasPermission(true);
      setIsPlaying(true);
      audioManager.toggleBgm(true, volume);
    } else if (checkAuth === "false") {
      setHasPermission(false);
    }
  }, []);

  const handleGrantPermission = (grant: boolean) => {
    localStorage.setItem("gsa-music-permission", grant.toString());
    setHasPermission(grant);
    if (grant) {
      setIsPlaying(true);
      audioManager.toggleBgm(true, volume);
    }
  };

  const togglePlay = () => {
    if (hasPermission === null) {
      handleGrantPermission(true);
      return;
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    audioManager.toggleBgm(nextState, isMuted ? 0 : volume);
    audioManager.play('buttonClick');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    audioManager.setBgmVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioManager.setBgmVolume(volume || 0.5);
      if (volume === 0) setVolume(0.5);
    } else {
      setIsMuted(true);
      audioManager.setBgmVolume(0);
    }
    audioManager.play('buttonClick');
  };

  // Permission prompt overlay if not decided yet
  if (hasPermission === null) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[44px] bg-[#1A1A2E] flex items-center justify-between px-4 z-[60] border-t border-slate-700/50 shadow-lg text-white">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-nunito font-bold">Bật nhạc nền lo-fi giúp tập trung tốt hơn?</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleGrantPermission(false)} className="px-3 py-1 rounded-md text-[10px] font-bold bg-slate-800 hover:bg-slate-700 transition-colors">Để sau</button>
          <button onClick={() => handleGrantPermission(true)} className="px-3 py-1 rounded-md text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-colors text-slate-900">Bật nhạc</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[72px] md:bottom-0 left-0 right-0 h-[44px] bg-[#1A1A2E] flex items-center justify-between px-4 md:px-6 z-[60] border-t border-slate-700/50 shadow-lg select-none">
      
      {/* Left: Album Art & Title */}
      <div className="flex items-center gap-3 w-1/3 overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-inner flex items-center justify-center shrink-0 animate-[spin_10s_linear_infinite]" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
          <div className="w-2 h-2 rounded-full bg-[#1A1A2E]" />
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex flex-col justify-center">
          <div className="whitespace-nowrap animate-[marquee_10s_linear_infinite] text-xs font-nunito font-bold text-white tracking-wide">
            Kids Focus Vol.1 — Lo-Fi Beats to Learn English To
          </div>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-4 justify-center w-1/3">
        <button onClick={() => audioManager.play('buttonClick')} className="text-slate-400 hover:text-white transition-colors" aria-label="Previous track">
          <SkipBack className="w-4 h-4" />
        </button>
        <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white text-[#1A1A2E] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md" aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>
        <button onClick={() => audioManager.play('buttonClick')} className="text-slate-400 hover:text-white transition-colors" aria-label="Next track">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center gap-2 justify-end w-1/3">
        <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors" aria-label={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input 
          ref={sliderRef}
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 md:w-24 h-1 bg-slate-700 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
        />
      </div>
    </div>
  );
}
