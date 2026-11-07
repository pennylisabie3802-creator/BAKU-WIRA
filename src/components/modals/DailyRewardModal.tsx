/**
 * BAKUWIRA: Ganjaran Harian Modal
 * Interactive Daily Login Reward Claiming
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, CheckCircle2, Coins, Gem, X } from 'lucide-react';
import { soundEffects } from '../../utils/audioEffects';

interface DailyRewardModalProps {
  onClose: () => void;
  onClaim: (coins: number, gems: number) => void;
  claimedDays: number[];
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  onClose,
  onClaim,
  claimedDays,
}) => {
  const [claimed, setClaimed] = useState<boolean>(claimedDays.includes(1));

  const rewards = [
    { day: 1, name: 'Hari 1', coins: 250, gems: 10, icon: '🪙' },
    { day: 2, name: 'Hari 2', coins: 500, gems: 15, icon: '💎' },
    { day: 3, name: 'Hari 3', coins: 750, gems: 20, icon: '🎁' },
    { day: 4, name: 'Hari 4', coins: 1000, gems: 25, icon: '📜' },
    { day: 5, name: 'Hari 5', coins: 1500, gems: 30, icon: '✨' },
    { day: 6, name: 'Hari 6', coins: 2000, gems: 40, icon: '🔮' },
    { day: 7, name: 'Hari 7', coins: 5000, gems: 100, icon: '👑' },
  ];

  const handleClaim = (coins: number, gems: number) => {
    soundEffects.playFanfare();
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setClaimed(true);
    onClaim(coins, gems);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 text-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
              <Gift className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                Ganjaran Harian Wira
              </h2>
              <p className="text-xs text-slate-400">Log masuk setiap hari untuk bonus istimewa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {rewards.map((r, i) => {
            const isToday = r.day === 1;
            const isClaimedState = isToday ? claimed : claimedDays.includes(r.day);
            return (
              <div
                key={r.day}
                className={`flex flex-col items-center justify-between p-2.5 rounded-2xl border text-center transition-all ${
                  isClaimedState
                    ? 'bg-slate-950/70 border-emerald-500/50 opacity-80'
                    : isToday
                    ? 'bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-300">{r.name}</span>
                <span className="text-2xl my-1">{r.icon}</span>
                <span className="text-[9px] font-black text-amber-300">+{r.coins}</span>
                {isClaimedState ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-1" />
                ) : (
                  <span className="text-[8px] text-slate-400">Tuntut</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Action */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400">Ganjaran Hari Ini:</span>
            <div className="flex items-center gap-3 text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" /> +250 Koin
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Gem className="w-4 h-4 text-cyan-400" /> +10 Permata
              </span>
            </div>
          </div>
          <button
            onClick={() => handleClaim(250, 10)}
            disabled={claimed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 font-black text-xs shadow-lg transition-all transform hover:scale-105 active:scale-95 border border-amber-300"
          >
            {claimed ? 'Sudah Dituntut ✓' : 'Tuntut Sekarang!'}
          </button>
        </div>
      </div>
    </div>
  );
};
