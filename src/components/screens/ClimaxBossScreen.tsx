/**
 * BAKUWIRA: Climax Confrontation Screen
 * Panel 15: Klimaks - Istana Wira Bahasa
 */

import React, { useState } from 'react';
import { Skull, ShieldAlert, Sparkles, ArrowRight, Sword } from 'lucide-react';

interface ClimaxBossScreenProps {
  onVictory: () => void;
  onBack: () => void;
}

export const ClimaxBossScreen: React.FC<ClimaxBossScreenProps> = ({ onVictory, onBack }) => {
  const [bossHp, setBossHp] = useState(100);
  const [playerPhase, setPlayerPhase] = useState(0);

  const climaxChallenges = [
    {
      distortionText: 'BOSS: "Haha! Di era AI dan digital, korang tak payah belajar grammar baku! Just type rojak je!"',
      counterChoices: [
        { text: 'Bahasa Melayu ialah maruah dan identiti bangsa yang menyatukan seluruh rakyat dengan peradaban tinggi!', damage: 50 },
        { text: 'Biarkan sahaja mereka bercakap campur.', damage: 0 },
      ],
    },
    {
      distortionText: 'BOSS: "Kuasa Bahasa Rojak tidak dapat dihalang! Singkatan SMS dan slanga liar akan menenggelamkan bahasa ibunda!"',
      counterChoices: [
        { text: 'Dengan kuasa Wira Bahasa, kami pertahankan sebutan baku, ejaan DBP dan kesantunan bicara sepanjang zaman!', damage: 50 },
        { text: 'Saya rasa malas nak berdebat.', damage: 0 },
      ],
    },
  ];

  const currentChallenge = climaxChallenges[playerPhase];

  const handleStrike = (damage: number) => {
    const nextHp = Math.max(0, bossHp - damage);
    setBossHp(nextHp);

    if (nextHp <= 0) {
      setTimeout(() => {
        onVictory();
      }, 700);
    } else if (playerPhase < climaxChallenges.length - 1) {
      setPlayerPhase(playerPhase + 1);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-12 bg-gradient-to-b from-purple-950 via-slate-950 to-indigo-950 text-white select-none">
      {/* Top Boss Health Meter */}
      <div className="w-full max-w-xl flex flex-col items-center space-y-2 z-10">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
          <Skull className="w-5 h-5 text-rose-500 animate-pulse" />
          <span>Inti Kekeliruan Bahasa (Boss Terakhir)</span>
        </div>
        <div className="w-full h-4 rounded-full bg-slate-900 border border-rose-500/50 overflow-hidden shadow-lg shadow-rose-950/50">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 transition-all duration-500 rounded-full"
            style={{ width: `${bossHp}%` }}
          />
        </div>
        <div className="text-xs font-mono text-rose-300">HP Kekeliruan: {bossHp} / 100</div>
      </div>

      {/* Center Cinematic Boss Confrontation matching Panel 15 */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-6 animate-fadeIn">
        <div className="w-28 h-28 rounded-3xl bg-slate-900 border-2 border-rose-500/60 flex items-center justify-center text-6xl shadow-2xl shadow-rose-600/30 animate-pulse">
          🌪️
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/90 border-2 border-rose-500/50 shadow-2xl space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block">
            Gegaran Bahasa Rojak:
          </span>
          <p className="text-slate-100 text-base sm:text-lg font-semibold italic">
            {currentChallenge?.distortionText}
          </p>
        </div>

        {/* Counter Strike Options */}
        <div className="w-full space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
            <Sword className="w-4 h-4" />
            <span>Patahkan Kekeliruan dengan Kebenaran Bahasa:</span>
          </span>

          {currentChallenge?.counterChoices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleStrike(c.damage)}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-indigo-900/80 to-blue-900/80 hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 border border-indigo-500/40 hover:border-amber-300 font-bold text-sm text-left transition-all transform hover:scale-[1.01] active:scale-98 shadow-lg flex items-center justify-between group"
            >
              <span>{c.text}</span>
              <Sparkles className="w-5 h-5 text-amber-400 group-hover:text-slate-950 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="w-full max-w-2xl flex justify-start z-10">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-4 py-2 rounded-lg bg-slate-900/60"
        >
          Undur ke Istana
        </button>
      </div>
    </div>
  );
};
