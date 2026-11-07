/**
 * BAKUWIRA: Region Victory & Progression Modal
 * Implements Part 7:
 * Displays "WILAYAH BERJAYA DIPULIHKAN!", Crystal Recovery, and the 3 buttons:
 * 1. TERUSKAN KE WILAYAH SETERUSNYA
 * 2. LIHAT PETA DUNIA
 * 3. TERUSKAN PENEROKAAN
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RegionInfo } from '../../types/game';
import { Sparkles, ArrowRight, Map, Compass, Award } from 'lucide-react';

interface RegionSuccessModalProps {
  completedRegion: RegionInfo;
  nextRegion?: RegionInfo;
  onContinueNextRegion: () => void;
  onOpenWorldMap: () => void;
  onContinueExploration: () => void;
}

export const RegionSuccessModal: React.FC<RegionSuccessModalProps> = ({
  completedRegion,
  nextRegion,
  onContinueNextRegion,
  onOpenWorldMap,
  onContinueExploration,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-950 border-2 border-yellow-400 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
        {/* Crystal Recovery Emblem */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center text-5xl shadow-2xl shadow-yellow-500/50 border-4 border-yellow-200">
            {completedRegion.crystalIcon}
          </div>
          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-3 -right-3 animate-spin" />
        </div>

        {/* Header matching Part 7 */}
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
            PULIHKAN WILAYAH KE-{completedRegion.orderNumber}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {completedRegion.id === 'kota_media'
              ? 'TAHNIAH! KOTA MEDIA SOSIAL BERJAYA DIPULIHKAN!'
              : 'WILAYAH BERJAYA DIPULIHKAN!'}
          </h2>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 space-y-1.5 leading-relaxed">
            <p className="font-bold text-amber-300">Syabas, Wira Bahasa!</p>
            <p>
              Kamu telah memulihkan <strong>{completedRegion.crystalName}</strong> di{' '}
              <strong>{completedRegion.name}</strong>.
            </p>
            {nextRegion ? (
              <p className="text-emerald-300 font-semibold pt-1 border-t border-slate-800">
                Wilayah seterusnya, <u>{nextRegion.name}</u>, telah dibuka!
              </p>
            ) : (
              <p className="text-yellow-300 font-black pt-1 border-t border-slate-800">
                Semua 5 wilayah telah berjaya dipulihkan sepenuhnya!
              </p>
            )}
          </div>
        </div>

        {/* 3 Buttons specified in Part 7 */}
        <div className="w-full space-y-2.5 pt-2">
          {/* Button 1: TERUSKAN KE WILAYAH SETERUSNYA / AKADEMI DETEKTIF BAHASA */}
          <button
            onClick={onContinueNextRegion}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] border-2 border-amber-300"
          >
            <span>
              {completedRegion.id === 'kota_media'
                ? 'TERUSKAN KE AKADEMI DETEKTIF BAHASA'
                : nextRegion
                ? 'TERUSKAN KE WILAYAH SETERUSNYA'
                : 'LIHAT PENAMAT BAKUWIRA'}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Button 2: LIHAT PETA DUNIA */}
            <button
              onClick={onOpenWorldMap}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Map className="w-3.5 h-3.5 text-blue-400" />
              <span>LIHAT PETA DUNIA</span>
            </button>

            {/* Button 3: TERUSKAN PENEROKAAN */}
            <button
              onClick={onContinueExploration}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>TERUSKAN PENEROKAAN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
