/**
 * BAKUWIRA: Location Completion Modal & Progression Panel
 * Implements Part 6:
 * Displays "MISI SELESAI!", location completion details, rewards, and the 3 functional buttons:
 * 1. TERUSKAN KE LOKASI SETERUSNYA
 * 2. LIHAT PETA
 * 3. ULANG AKTIVITI
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MissionQuestion, SubLocationInfo } from '../../types/game';
import {
  Sparkles,
  ArrowRight,
  Map,
  RotateCcw,
  Coins,
  TrendingUp,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface LocationSuccessModalProps {
  question: MissionQuestion;
  currentSublocationName: string;
  nextSublocation?: SubLocationInfo;
  isRegionComplete: boolean;
  leveledUp?: boolean;
  newLevel?: number;
  onContinueNextLocation: () => void;
  onOpenMap: () => void;
  onReplayActivity: () => void;
}

export const LocationSuccessModal: React.FC<LocationSuccessModalProps> = ({
  question,
  currentSublocationName,
  nextSublocation,
  isRegionComplete,
  leveledUp = false,
  newLevel = 13,
  onContinueNextLocation,
  onOpenMap,
  onReplayActivity,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-5">
        {/* Glowing Trophy Badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/40 border-2 border-amber-200">
            🏆
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
        </div>

        {/* Title & Location Header matching Part 6 */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400">
            PENCAPAIAN LOKASI SELESAI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            MISI SELESAI!
          </h2>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 space-y-1 leading-relaxed">
            <p className="font-semibold text-amber-300">Tahniah, Wira Bahasa!</p>
            <p>
              Kamu telah menyelesaikan cabaran di <strong>{currentSublocationName}</strong>.
            </p>
            {question.id === 'BW-M20' ? (
              <p className="text-yellow-300 font-bold animate-pulse">
                Cabaran Penamat (Misi 21: Selamatkan Kerajaan Bahasa) sedia untuk dimulakan!
              </p>
            ) : question.id === 'BW-M21' ? (
              <p className="text-yellow-300 font-bold">
                Semua misi telah berjaya ditamatkan! Mahkota Wira Bahasa menjadi milikmu!
              </p>
            ) : nextSublocation ? (
              <p className="text-emerald-300 font-bold">
                Destinasi seterusnya ialah <u>{nextSublocation.name}</u>.
              </p>
            ) : null}
          </div>
        </div>

        {/* Level Up Banner if applicable */}
        {leveledUp && (
          <div className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg animate-pulse">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            <span>Naik Tahap! Lv. {newLevel - 1} ➔ Lv. {newLevel}</span>
          </div>
        )}

        {/* Rewards Box */}
        <div className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-bold">EXP Diperoleh:</span>
              <span className="text-sm font-black text-blue-400">+{question.xpReward}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Koin:</span>
              </span>
              <span className="text-sm font-black text-amber-400">+{question.coinReward}</span>
            </div>
          </div>
          {question.moduleReward && (
            <div className="text-[11px] text-purple-300 bg-purple-950/40 p-2 rounded-xl border border-purple-500/30 text-center truncate">
              Modul Dibuka: <strong>{question.moduleReward}</strong>
            </div>
          )}
        </div>

        {/* THREE FUNCTIONAL BUTTONS SPECIFIED IN PART 6 */}
        <div className="w-full space-y-2.5 pt-2">
          {/* BUTTON 1: TERUSKAN KE LOKASI SETERUSNYA / CABARAN PENAMAT */}
          <button
            onClick={onContinueNextLocation}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-98 border-2 border-amber-300"
          >
            <span>
              {question.id === 'BW-M20'
                ? 'MULAKAN CABARAN PENAMAT (MISI 21)'
                : question.id === 'BW-M21'
                ? 'LIHAT PENAMAT BAKUWIRA'
                : 'TERUSKAN KE TEMPAT SETERUSNYA'}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {/* BUTTON 2: LIHAT PETA */}
            <button
              onClick={onOpenMap}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Map className="w-3.5 h-3.5 text-blue-400" />
              <span>LIHAT PETA</span>
            </button>

            {/* BUTTON 3: ULANG AKTIVITI */}
            <button
              onClick={onReplayActivity}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>ULANG AKTIVITI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
