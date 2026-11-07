/**
 * BAKUWIRA: Location & Region Transition Overlay
 * Implements Part 9:
 * Short anime RPG transition animation, location title banner,
 * educational tip, loading bar, and failsafe error recovery.
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, MapPin, Compass, AlertCircle, RefreshCw } from 'lucide-react';

interface TransitionOverlayProps {
  title: string;
  subtitle: string;
  educationalTip?: string;
  onTransitionComplete: () => void;
  onReturnToMap?: () => void;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  title,
  subtitle,
  educationalTip = 'Tip Bahasa: Gunakan sebutan baku dan elakkan singkatan teks semasa berhubung dengan guru dan rakan.',
  onTransitionComplete,
  onReturnToMap,
}) => {
  const [progress, setProgress] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onTransitionComplete, 200);
          return 100;
        }
        return p + 20;
      });
    }, 150);

    // Timeout failsafe after 6 seconds
    const timeoutTimer = setTimeout(() => {
      if (progress < 100) {
        setHasTimedOut(true);
      }
    }, 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeoutTimer);
    };
  }, [onTransitionComplete, progress]);

  return (
    <div className="fixed inset-0 z-60 flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-lg text-white select-none animate-fadeIn">
      {/* Decorative ambient lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-indigo-900/15 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-6">
        {/* Animated Beacon Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-2xl shadow-amber-500/30">
            <Compass className="w-10 h-10 text-amber-400 animate-spin-slow" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            {subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {title}
          </h2>
        </div>

        {/* Educational Tip Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed max-w-sm">
          <span className="font-bold text-amber-300 block mb-1">Mutiara Kata Bahasa:</span>
          "{educationalTip}"
        </div>

        {/* Loading Bar */}
        <div className="w-full max-w-xs space-y-1.5">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Memuatkan Kawasan 3D...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Timeout / Error Recovery (Part 9 Failsafe) */}
        {hasTimedOut && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold justify-center">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Memerlukan masa lebih lama?</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={onTransitionComplete}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Masuk Sekarang</span>
              </button>
              {onReturnToMap && (
                <button
                  onClick={onReturnToMap}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Kembali ke Peta
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
