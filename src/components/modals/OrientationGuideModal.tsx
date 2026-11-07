/**
 * BAKUWIRA: Mobile Landscape Orientation Guide
 * Automatically detects portrait orientation on mobile/touch devices
 * and prompts players to rotate their device horizontally.
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, Sparkles, Compass } from 'lucide-react';

export const OrientationGuideModal: React.FC = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;

      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;

      // Portrait check: height is greater than width, and it's a mobile/narrow viewport
      const isPortrait = window.innerHeight > window.innerWidth;
      const isNarrowMobile = window.innerWidth <= 820;

      // Only prompt if on a mobile/tablet screen in portrait mode
      if (isPortrait && (isTouch || isNarrowMobile)) {
        setIsPortraitMobile(true);
      } else {
        setIsPortraitMobile(false);
        setDismissed(false); // Reset dismissal once user actually rotates to landscape
      }
    };

    checkOrientation();

    // Listeners for device rotation & viewport changes
    const mql = window.matchMedia('(orientation: landscape)');
    const handleMqlChange = () => checkOrientation();

    if (mql.addEventListener) {
      mql.addEventListener('change', handleMqlChange);
    } else {
      mql.addListener(handleMqlChange);
    }

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', checkOrientation);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleMqlChange);
      } else {
        mql.removeListener(handleMqlChange);
      }
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', checkOrientation);
      }
    };
  }, []);

  if (!isPortraitMobile || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 select-none animate-fadeIn">
      {/* Background artwork blur */}
      <img
        src="/assets/aistudio/menu_game_bc7c0e58.jpeg"
        alt="BAKUWIRA Landscape Requirement"
        className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-md pointer-events-none"
      />

      {/* Decorative radial lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/70 to-slate-950 pointer-events-none" />

      {/* Main Guide Card */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-900 border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(250,204,21,0.5)] p-6 sm:p-8 flex flex-col items-center text-center space-y-5 text-white">
        {/* Animated Phone Rotation Graphic */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer glowing magic ring */}
          <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-spin-slow" />
          <div className="absolute -inset-2 rounded-full border border-cyan-400/20 animate-reverse-spin" />

          {/* Rotating Phone Animation */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* The Phone */}
            <div className="w-12 h-20 rounded-2xl border-3 border-amber-300 bg-slate-900/90 shadow-2xl flex flex-col items-center justify-between p-1.5 animate-phone-rotate">
              <div className="w-4 h-1 rounded-full bg-slate-600" />
              <div className="w-full flex-1 rounded-xl bg-gradient-to-br from-indigo-600/40 to-purple-600/40 my-1 flex items-center justify-center border border-amber-400/30">
                <Compass className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div className="w-2 h-2 rounded-full border border-slate-500" />
            </div>

            {/* Circular Arrows around Phone */}
            <div className="absolute -inset-3 pointer-events-none">
              <RotateCw className="w-full h-full text-amber-400/60 animate-spin-slow stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider text-amber-300 shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pengalaman RPG 3D</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text">
            PUTARKAN TELEFON ANDA
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
            Untuk pengalaman <strong>BAKUWIRA</strong> yang terbaik, sila putarkan telefon anda secara <strong>melintang (landscape)</strong>.
          </p>
        </div>

        {/* Quick Orientation Indicator Badges */}
        <div className="w-full grid grid-cols-2 gap-2 pt-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center gap-1.5 text-rose-300">
            <span className="text-xs">📱❌</span>
            <span>Potret (Tolak)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center gap-1.5 text-emerald-300 font-bold shadow-[0_0_15px_rgba(52,211,153,0.2)]">
            <span className="text-xs">📲✓</span>
            <span>Melintang (Disyorkan)</span>
          </div>
        </div>

        {/* Dismiss Button for testing or users who cannot rotate */}
        <button
          onClick={() => setDismissed(true)}
          className="text-[11px] text-slate-400 hover:text-amber-300 underline underline-offset-4 transition-colors pt-1 cursor-pointer"
        >
          Teruskan dalam mod potret (Skrin Kecil)
        </button>
      </div>
    </div>
  );
};
