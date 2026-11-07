/**
 * BAKUWIRA: Transisi Masuk Dunia (Hero World Entrance Transition Screen)
 * 
 * Faithfully implements:
 * - IMAGE D (transisi_lelaki_c562d297.jpeg) for Wira Lelaki
 * - IMAGE E (transisi_pp_f2ab78b7.jpeg) for Wira Perempuan
 * 
 * Features:
 * - Full-screen cinematic presentation of hero standing on cliff looking toward floating sky palace
 * - Celestial pillar of light rising into the stratosphere
 * - Drifting sakura petals and golden dust particles
 * - Atmospheric loading progress: "Menghubungkan ke Dunia 3D Bakuwira..."
 * - Badge "3 Transisi Masuk Dunia" matching artwork
 * - Sound cue: playWorldTransition()
 * - Auto-finishes when loading reaches 100% with a manual skip option
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { HeroGender } from './HeroSelectionScreen';
import { soundEffects } from '../../utils/audioEffects';
import { SakuraParticlesCanvas } from '../effects/SakuraParticlesCanvas';

interface HeroTransitionScreenProps {
  heroGender: HeroGender;
  heroName: string;
  regionName?: string;
  onTransitionComplete: () => void;
}

export const HeroTransitionScreen: React.FC<HeroTransitionScreenProps> = ({
  heroGender,
  heroName,
  regionName = 'Kota Media Sosial',
  onTransitionComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    soundEffects.playWorldTransition();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onTransitionComplete();
          }, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8 + 5);
        if (next >= 40) setCanSkip(true);
        return Math.min(100, next);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onTransitionComplete]);

  const bgImage =
    heroGender === 'lelaki'
      ? '/assets/aistudio/transisi_lelaki_c562d297.jpeg'
      : '/assets/aistudio/transisi_pp_f2ab78b7.jpeg';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none font-sans">
      {/* 16:9 Presentation Frame */}
      <div
        className="relative overflow-hidden shadow-2xl flex flex-col items-center justify-between p-4 sm:p-8"
        style={{
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
          aspectRatio: '16 / 9',
        }}
      >
        {/* Layer 1: Master Transition Background Image (Image D or Image E) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <img
            src={bgImage}
            alt="Transisi Masuk Dunia"
            className="w-full h-full object-cover select-none animate-breathe"
            draggable={false}
          />
          {/* Subtle light rays gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
        </div>

        {/* Layer 2: Floating Sakura Petals Canvas */}
        <SakuraParticlesCanvas interactive={false} />

        {/* Top Floating Badge */}
        <div className="relative z-20 w-full flex items-center justify-between pt-2 px-2 sm:px-6">
          <div className="px-4 py-1.5 rounded-full bg-slate-950/80 border border-amber-400/50 backdrop-blur-md flex items-center gap-2 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-amber-300">
              Wira: <strong className="text-white">{heroName}</strong> ({heroGender === 'lelaki' ? 'Wira Lelaki' : 'Wira Perempuan'})
            </span>
          </div>

          {canSkip && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onTransitionComplete();
              }}
              className="py-1 px-3.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-amber-400 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <span>Langkau</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Central Magical Aura & Text */}
        <div className="relative z-20 flex flex-col items-center text-center space-y-2 my-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(250,204,21,0.9)] border-2 border-white animate-pulse">
            ✨
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text drop-shadow">
            Melangkah Masuk ke Dunia Bahasa
          </h2>
          <p className="text-xs text-slate-200 max-w-md drop-shadow px-4">
            Destinasi: <strong className="text-cyan-300">{regionName}</strong>. Bawa Tome Sihir dan pulihkan keharmonian kata!
          </p>
        </div>

        {/* Bottom Section: Progress Bar & "3 Transisi Masuk Dunia" Badge */}
        <div className="relative z-20 w-full max-w-lg flex flex-col items-center gap-3 pb-2">
          {/* Progress Bar Container */}
          <div className="w-full space-y-1">
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono font-bold text-amber-300 px-1">
              <span>Menjana Medan 3D Bakuwira...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950/90 border border-amber-500/50 p-0.5 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all duration-150 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Badge: "3 Transisi Masuk Dunia" matching Image D and Image E */}
          <div className="px-5 py-1.5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-950/90 to-purple-950/90 border-2 border-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center gap-2 backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black text-xs flex items-center justify-center shadow">
              3
            </div>
            <span className="text-xs sm:text-sm font-black text-white tracking-wide">
              Transisi Masuk Dunia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
