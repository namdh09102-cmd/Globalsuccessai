class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Background music nodes
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.3, slideTo?: number, slideDuration?: number) {
    if (!this.ctx || !this.masterGain) return;
    
    // Resume context if suspended (browser policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    if (slideTo && slideDuration) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, this.ctx.currentTime + slideDuration);
    }

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime + Math.max(0.01, duration - 0.01));
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  public play(effect: 'correctAnswer' | 'wrongAnswer' | 'levelUp' | 'xpEarned' | 'streakBroken' | 'buttonClick' | 'gameStart' | 'achievementUnlocked') {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (effect) {
      case 'correctAnswer':
        // Two-tone ascending: 523Hz (C5) -> 659Hz (E5), each 80ms, sine wave
        this.playTone(523.25, 'sine', 0.08, 0.3);
        setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.3), 80);
        break;

      case 'wrongAnswer':
        // Descending buzz: 300Hz -> 200Hz, 150ms, sawtooth wave
        this.playTone(300, 'sawtooth', 0.15, 0.2, 200, 0.15);
        break;

      case 'levelUp':
        // Fanfare: C5->E5->G5->C6, each 120ms, triangle wave
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.2), i * 120);
        });
        // Sparkle: random high freq 800-1200Hz, 5 quick pings
        setTimeout(() => {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(800 + Math.random() * 400, 'sine', 0.05, 0.1), i * 40);
          }
        }, 480);
        break;

      case 'xpEarned':
        // Single cheerful ping: 880Hz, 60ms, sine
        this.playTone(880, 'sine', 0.06, 0.2);
        break;

      case 'streakBroken':
        // Sad trombone: descending 400->200Hz, 400ms, sawtooth
        this.playTone(400, 'sawtooth', 0.4, 0.2, 200, 0.4);
        break;

      case 'buttonClick':
        // Soft pop: 600Hz, 30ms, sine
        this.playTone(600, 'sine', 0.03, 0.1);
        break;

      case 'gameStart':
        // 3-2-1 countdown beeps: 440Hz, 550Hz, 660Hz (1 per sec), then GO fanfare
        this.playTone(440, 'sine', 0.2, 0.3);
        setTimeout(() => this.playTone(550, 'sine', 0.2, 0.3), 1000);
        setTimeout(() => this.playTone(660, 'sine', 0.2, 0.3), 2000);
        setTimeout(() => {
          this.playTone(880, 'square', 0.1, 0.2);
          setTimeout(() => this.playTone(1046.50, 'square', 0.4, 0.2), 100);
        }, 3000);
        break;

      case 'achievementUnlocked':
        // Mario-style jingle: 5 note ascending arp, 80ms each
        [392.00, 523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 'square', 0.08, 0.15), i * 80);
        });
        break;
    }
  }

  // --- Background Music (Generative Lo-Fi Loop) ---
  public toggleBgm(play: boolean, volume: number = 0.5) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (play && !this.isBgmPlaying) {
      this.isBgmPlaying = true;
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = volume;
      this.bgmGain.connect(this.masterGain);
      
      // Simple generative chord loop (Cmaj9)
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
      ];
      
      let step = 0;
      
      const playChord = () => {
        if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
        const chord = chords[step % chords.length];
        step++;
        
        chord.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq / 2; // deeper lo-fi sound
          
          gain.gain.setValueAtTime(0, this.ctx!.currentTime);
          gain.gain.linearRampToValueAtTime(0.05, this.ctx!.currentTime + 1.0); // slow attack
          gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 4.0); // long release
          
          osc.connect(gain);
          gain.connect(this.bgmGain!);
          
          osc.start(this.ctx!.currentTime);
          osc.stop(this.ctx!.currentTime + 4.0);
        });
      };
      
      playChord();
      this.bgmInterval = setInterval(playChord, 4000); // New chord every 4s
      
    } else if (!play && this.isBgmPlaying) {
      this.isBgmPlaying = false;
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      if (this.bgmGain && this.ctx) {
        this.bgmGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
        setTimeout(() => {
          this.bgmGain?.disconnect();
          this.bgmGain = null;
        }, 1000);
      }
    }
  }

  public setBgmVolume(vol: number) {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();

// Expose to window for global inline usage (e.g., from generated HTML components)
if (typeof window !== "undefined") {
  (window as any).audioManager = audioManager;
}
