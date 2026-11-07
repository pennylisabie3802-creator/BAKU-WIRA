/**
 * BAKUWIRA: Web Audio API Sound Synthesizer
 * Provides crystal-clear anime RPG sound effects without external audio assets.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmMuted: boolean = false;
  private isSfxMuted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmVolume: number = 0.45;
  private sfxVolume: number = 0.8;
  private isBgmPlaying: boolean = false;
  private userInteracted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedBgmMuted = localStorage.getItem('bakuwira_bgm_muted');
        if (savedBgmMuted !== null) {
          this.isBgmMuted = savedBgmMuted === 'true';
        }
        const savedBgmVol = localStorage.getItem('bakuwira_bgm_volume');
        if (savedBgmVol !== null) {
          const v = parseFloat(savedBgmVol);
          if (!isNaN(v)) this.bgmVolume = Math.max(0, Math.min(1, v));
        }
        const savedSfxMuted = localStorage.getItem('bakuwira_sfx_muted');
        if (savedSfxMuted !== null) {
          this.isSfxMuted = savedSfxMuted === 'true';
        }
        const savedSfxVol = localStorage.getItem('bakuwira_sfx_volume');
        if (savedSfxVol !== null) {
          const v = parseFloat(savedSfxVol);
          if (!isNaN(v)) this.sfxVolume = Math.max(0, Math.min(1, v));
        }
      } catch {
        // ignore localStorage access error
      }

      const handleFirstInteraction = () => {
        if (!this.userInteracted) {
          this.userInteracted = true;
          this.getContext();
          if (!this.isMuted && !this.isBgmMuted && !this.isBgmPlaying) {
            this.startAmbientFantasyBGM();
          }
        }
      };
      window.addEventListener('click', handleFirstInteraction, { passive: true });
      window.addEventListener('keydown', handleFirstInteraction, { passive: true });
      window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Master mute (affects both)
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.setBgmMuted(muted);
    this.setSfxMuted(muted);
  }

  public getMuted(): boolean {
    return this.isMuted || (this.isBgmMuted && this.isSfxMuted);
  }

  // Independent BGM Music Controls
  public setBgmMuted(muted: boolean) {
    this.isBgmMuted = muted;
    try {
      localStorage.setItem('bakuwira_bgm_muted', String(muted));
    } catch {}

    if (this.bgmAudio) {
      this.bgmAudio.muted = muted;
      this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
    }

    if (!muted) {
      if (!this.isBgmPlaying || (this.bgmAudio && this.bgmAudio.paused)) {
        this.startAmbientFantasyBGM();
      }
    } else {
      if (this.bgmAudio) {
        try {
          this.bgmAudio.pause();
        } catch {}
      }
      this.isBgmPlaying = false;
    }
  }

  public getBgmMuted(): boolean {
    return this.isBgmMuted || this.isMuted;
  }

  public toggleBGM(): boolean {
    const next = !this.getBgmMuted();
    this.setBgmMuted(next);
    return next;
  }

  public setBGMVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    try {
      localStorage.setItem('bakuwira_bgm_volume', String(this.bgmVolume));
    } catch {}

    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isBgmMuted || this.isMuted ? 0 : this.bgmVolume;
    }

    // Auto resume if slider is dragged up and music is not explicitly muted
    if (this.bgmVolume > 0 && !this.isBgmMuted && !this.isMuted && (!this.isBgmPlaying || (this.bgmAudio && this.bgmAudio.paused))) {
      this.startAmbientFantasyBGM();
    }
  }

  public getBGMVolume(): number {
    return this.bgmVolume;
  }

  // Independent SFX Controls
  public setSfxMuted(muted: boolean) {
    this.isSfxMuted = muted;
    try {
      localStorage.setItem('bakuwira_sfx_muted', String(muted));
    } catch {}
  }

  public getSfxMuted(): boolean {
    return this.isSfxMuted || this.isMuted;
  }

  public toggleSFX(): boolean {
    const next = !this.getSfxMuted();
    this.setSfxMuted(next);
    return next;
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    try {
      localStorage.setItem('bakuwira_sfx_volume', String(this.sfxVolume));
    } catch {}
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  // Soft hover chime
  public playHover() {
    if (this.isMuted || this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

      const peakGain = 0.03 * this.sfxVolume;
      gain.gain.setValueAtTime(peakGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  // Golden button click chime
  public playClick() {
    if (this.isMuted || this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.04);

        const peakGain = 0.06 * this.sfxVolume;
        gain.gain.setValueAtTime(peakGain, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + i * 0.04 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  // Reward / Crystal Fanfare
  public playFanfare() {
    if (this.isMuted || this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        const peakGain = 0.08 * this.sfxVolume;
        gain.gain.setValueAtTime(peakGain, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Epic Orchestral Background Music (User uploaded Genshin-style theme)
  public startAmbientFantasyBGM() {
    if (this.isMuted || this.isBgmMuted) return;
    if (typeof window === 'undefined') return;

    try {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio('/assets/aistudio/bakuwira_theme_bgm.mp3');
        this.bgmAudio.loop = true;
        this.bgmAudio.preload = 'auto';

        // Fallback to mp4 source if needed
        this.bgmAudio.addEventListener('error', () => {
          if (this.bgmAudio && this.bgmAudio.src.endsWith('.mp3')) {
            this.bgmAudio.src = '/assets/aistudio/genshinn_5a27d2da.mp4';
            this.bgmAudio.play().catch(() => {});
          }
        });
      }

      this.bgmAudio.volume = (this.isMuted || this.isBgmMuted) ? 0 : this.bgmVolume;
      this.bgmAudio.muted = this.isMuted || this.isBgmMuted;

      if (this.bgmAudio.paused) {
        const playPromise = this.bgmAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy prevented playback until user interacts
          });
        }
      }
      this.isBgmPlaying = true;
    } catch {
      // ignore
    }
  }

  // Randomized footstep sound effects based on surface material
  public playFootstep(surface: 'stone' | 'wood' | 'grass' | 'carpet' = 'stone') {
    if (this.isMuted || this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Material-specific acoustic parameters
      let baseFreq = 160;
      let endFreq = 60;
      let decay = 0.055;
      let volume = 0.025 * this.sfxVolume;
      let filterFreq = 800;

      if (surface === 'wood') {
        baseFreq = 125 + Math.random() * 25;
        endFreq = 75;
        decay = 0.07;
        volume = 0.035 * this.sfxVolume;
        filterFreq = 650;
        osc.type = 'triangle';
      } else if (surface === 'grass') {
        baseFreq = 95 + Math.random() * 20;
        endFreq = 45;
        decay = 0.045;
        volume = 0.02 * this.sfxVolume;
        filterFreq = 420;
        osc.type = 'sine';
      } else if (surface === 'carpet') {
        baseFreq = 80 + Math.random() * 15;
        endFreq = 40;
        decay = 0.04;
        volume = 0.018 * this.sfxVolume;
        filterFreq = 300;
        osc.type = 'sine';
      } else {
        baseFreq = 180 + Math.random() * 35;
        endFreq = 85;
        decay = 0.05;
        volume = 0.026 * this.sfxVolume;
        filterFreq = 1200;
        osc.type = 'sine';
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, now);

      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + decay);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    } catch {
      // ignore
    }
  }

  // Jump sound
  public playJump() {
    if (this.isMuted || this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.04 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  // Hero select chord
  public playHeroSelect(hero: 'lelaki' | 'perempuan') {
    if (this.isMuted || this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = hero === 'lelaki' ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 739.99, 880, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0.05 * this.sfxVolume, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Magical world entrance transition sound
  public playWorldTransition() {
    if (this.isMuted || this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      arpeggio.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.06 * this.sfxVolume, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.6);
      });
    } catch {
      // ignore
    }
  }

  public stopAmbientFantasyBGM() {
    this.isBgmPlaying = false;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }
}

export const soundEffects = new SoundSynthesizer();
