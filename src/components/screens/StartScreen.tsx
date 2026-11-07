/**
 * BAKUWIRA: Start Screen / Title Logo
 * Panel 1: Skrin Permulaan / Logo
 */

import React from 'react';
import { Play, Sparkles, BookOpen } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-purple-600/10 to-transparent pointer-events-none" />

      {/* Decorative floating rune particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 text-4xl opacity-20 animate-bounce">🏛️</div>
        <div className="absolute top-1/3 right-1/5 text-4xl opacity-20 animate-pulse">📱</div>
        <div className="absolute bottom-1/4 left-1/5 text-4xl opacity-20 animate-pulse">⚙️</div>
        <div className="absolute bottom-1/3 right-1/6 text-4xl opacity-20 animate-bounce">🏡</div>
      </div>

      {/* Main Hero Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl animate-fadeIn space-y-6">
        {/* Crown Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest uppercase shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>RPG Pengembaraan 3D Bahasa Melayu</span>
        </div>

        {/* Game Title matching panel 1 */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_5px_15px_rgba(245,158,11,0.4)]">
            BAKUWIRA
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-amber-200">
            Misi Penyelamat Bahasa
          </h2>
          <p className="text-sm sm:text-base font-semibold text-blue-300 italic tracking-wide">
            "Bijak Berbahasa, Hebat Berkomunikasi!"
          </p>
        </div>

        {/* Start Game Button */}
        <div className="pt-6">
          <button
            onClick={onStart}
            className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-lg tracking-wider shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-amber-200"
          >
            <Play className="w-6 h-6 fill-slate-950 group-hover:translate-x-1 transition-transform" />
            <span>TEKAN UNTUK MULA</span>
          </button>
        </div>

        {/* Subtitle notes */}
        <p className="text-xs text-slate-400 pt-8 max-w-md">
          Berasaskan Dokumen Standard Kurikulum & Pentaksiran (DSKP) Bahasa Melayu Tahap 2.
          Membanteras kekeliruan bahasa rojak melalui penerokaan 3D dan simulasi pertuturan.
        </p>
      </div>
    </div>
  );
};
