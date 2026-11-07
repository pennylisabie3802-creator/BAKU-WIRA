/**
 * BAKUWIRA: Game Over & Credits Screen
 * Panel 16: Tamat Permainan / Kredit (Tahniah! Kamu telah memulihkan Dunia Bahasa!)
 */

import React, { useState } from 'react';
import { Award, Sparkles, RotateCcw, Heart, Share2, Compass } from 'lucide-react';

interface GameOverCreditsProps {
  onContinueExplore: () => void;
  onRestartMenu: () => void;
}

export const GameOverCredits: React.FC<GameOverCreditsProps> = ({
  onContinueExplore,
  onRestartMenu,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white select-none overflow-y-auto">
      <div className="relative z-10 w-full max-w-xl bg-slate-900/90 border-2 border-amber-500/60 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center space-y-6 animate-fadeIn my-auto">
        {/* Victory Emblem matching panel 16 */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/50 border-2 border-amber-200">
            👑
          </div>
          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-3 -right-3 animate-spin" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
            BAKUWIRA: Misi Penyelamat Bahasa
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Tahniah!
          </h2>
          <p className="text-sm sm:text-base font-bold text-amber-200">
            Kamu telah memulihkan Dunia Bahasa!
          </p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-md">
          Terima kasih kerana menyertai perjuangan mempertahankan kesantunan, tatabahasa baku,
          dan keindahan bahasa kebangsaan merentas kelima-lima wilayah.
        </p>

        {/* Certificate Modal / View */}
        {showCertificate ? (
          <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-400 space-y-3 animate-fadeIn text-left">
            <div className="text-center pb-2 border-b border-amber-500/30">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                SIJIL PENGHARGAAN WIRA BAHASA
              </span>
              <h4 className="text-lg font-black text-white">Dunia Bahasa Melayu</h4>
            </div>
            <p className="text-xs text-slate-300 italic text-center">
              "Dengan ini diperakui bahawa murid telah berjaya menguasai keterampilan bertutur santun,
              tatabahasa baku, dan penulisan rasmi berlandaskan Kurikulum Tahap 2."
            </p>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Tarikh: 2026</span>
              <span className="font-bold text-amber-400">Puan Zahra & Raja Bahasa</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCertificate(true)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Sijil Wira Bahasa</span>
          </button>
        )}

        {/* Credits */}
        <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="font-bold text-slate-300">Penyelaras Kurikulum & Gamifikasi:</div>
          <div>Berasaskan Cadangan Gamifikasi Penambahbaikan BAKUWIRA</div>
          <div className="text-[11px] text-slate-500">
            Bahasa Rojak dalam Era Digital: Cabaran Keterampilan Bertutur dan Menulis Tahap 2
          </div>
        </div>

        {/* Action Buttons matching panel 16 */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onContinueExplore}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4" />
            <span>Teruskan Penerokaan</span>
          </button>

          <button
            onClick={onRestartMenu}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
