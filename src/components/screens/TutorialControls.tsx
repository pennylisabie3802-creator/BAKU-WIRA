/**
 * BAKUWIRA: Controls Tutorial Screen
 * Panel 6: Tutorial Kawalan
 */

import React from 'react';
import { ArrowRight, Move, MousePointer, ShieldAlert, Sparkles } from 'lucide-react';

interface TutorialControlsProps {
  onContinue: () => void;
}

export const TutorialControls: React.FC<TutorialControlsProps> = ({ onContinue }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white select-none">
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panduan Wira Baru</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text">
            Panduan Kawalan 3D
          </h2>
          <p className="text-xs text-slate-400">
            Pelajari asas pergerakan dan interaksi sebelum memasuki dunia permainan
          </p>
        </div>

        {/* Controls Layout Cards matching panel 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Movement WASD */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-amber-300 text-xs shadow">
                W
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-amber-300 text-xs shadow">
                  A
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-amber-300 text-xs shadow">
                  S
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-amber-300 text-xs shadow">
                  D
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Pergerakan Wira</h4>
              <p className="text-xs text-slate-400">Tekan W, A, S, D atau kekunci anak panah</p>
            </div>
          </div>

          {/* Mouse Camera */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 shadow">
              <MousePointer className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Laras Kamera</h4>
              <p className="text-xs text-slate-400">Kamera mengekori wira secara automatik</p>
            </div>
          </div>

          {/* Space / Shift */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="px-3 py-1 rounded-md bg-slate-800 border border-slate-600 font-mono text-xs font-bold text-amber-300 text-center">
                Space
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-800 border border-slate-600 font-mono text-xs font-bold text-blue-300 text-center">
                Shift
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Lompat & Lari Laju</h4>
              <p className="text-xs text-slate-400">Pecutan untuk meneroka kawasan lapang</p>
            </div>
          </div>

          {/* E Interaction */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg border-2 border-amber-300">
              E
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-300">Interaksi & Tindakan</h4>
              <p className="text-xs text-slate-300">
                Berbual dengan NPC atau imbas petunjuk hologram
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button matching panel 6 */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <span>Teruskan Masuk ke Dunia Permainan</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
