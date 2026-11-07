/**
 * BAKUWIRA: Mission Success & Level Up Modal
 * Panel 12: Misi Selesai, Ganjaran dan Naik Tahap
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Coins, BookOpen, ArrowRight, TrendingUp } from 'lucide-react';
import { MissionQuestion } from '../../types/game';

interface MissionSuccessModalProps {
  question: MissionQuestion;
  leveledUp?: boolean;
  newLevel?: number;
  onContinue: () => void;
}

export const MissionSuccessModal: React.FC<MissionSuccessModalProps> = ({
  question,
  leveledUp = false,
  newLevel = 13,
  onContinue,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
        {/* Glowing Badge matching Panel 12 */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/40 border-2 border-amber-200">
            🏆
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
        </div>

        {/* Title & Mission Code */}
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
            Aktiviti Berjaya Ditamatkan!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Misi Selesai!
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-amber-200">
            {question.missionTitle}: {question.title}
          </p>
        </div>

        {/* Level Up Banner if applicable (as in panel 12: Lv. 12 -> Lv. 13) */}
        {leveledUp && (
          <div className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg animate-pulse">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            <span>Naik Tahap! Lv. {newLevel - 1} ➔ Lv. {newLevel}</span>
          </div>
        )}

        {/* Rewards Box matching panel 12 */}
        <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Ganjaran Diperoleh:
          </span>

          <div className="grid grid-cols-3 gap-2.5">
            {/* EXP */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-xs text-blue-400 font-bold">EXP</span>
              <span className="text-base font-black text-white">+{question.xpReward}</span>
            </div>

            {/* Coins */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" />
                <span>Koin</span>
              </span>
              <span className="text-base font-black text-white">+{question.coinReward}</span>
            </div>

            {/* Language Module */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-xs text-purple-400 font-bold flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Modul</span>
              </span>
              <span className="text-xs font-black text-purple-300 text-center truncate w-full">
                +1 Ilmu
              </span>
            </div>
          </div>
        </div>

        {/* Unlocked Module name */}
        {question.moduleReward && (
          <div className="text-xs text-slate-300 bg-indigo-950/40 px-4 py-2 rounded-xl border border-indigo-500/30">
            <span className="text-amber-400 font-bold">Modul Baharu Dibuka: </span>
            {question.moduleReward}
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
        >
          <span>Teruskan Pengembaraan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
