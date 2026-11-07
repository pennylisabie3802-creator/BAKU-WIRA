/**
 * BAKUWIRA: Story Cinematic Screen
 * Panel 5: Sinematik Pembuka / Jalan Cerita
 */

import React, { useState } from 'react';
import { ArrowRight, SkipForward, Sparkles, AlertOctagon } from 'lucide-react';

interface StoryCinematicProps {
  onContinue: () => void;
}

export const StoryCinematic: React.FC<StoryCinematicProps> = ({ onContinue }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const storySlides = [
    {
      title: 'Krisis di Dunia Bahasa',
      subtitle: 'Era Digital dan Pencemaran Bahasa',
      text: 'Dunia Bahasa kini diancam oleh Kekeliruan Bahasa. Gelombang mesej digital bercampur bahasa rojak dan singkatan liar telah melunturkan keaslian tatabahasa ibunda.',
      icon: '⚡',
      bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    },
    {
      title: 'Seruan Kepada Wira Bahasa',
      subtitle: 'Memulihkan Kedaulatan Pertuturan',
      text: 'Hanya Wira Bahasa yang mampu memulihkan kefasihan, kesantunan dan penggunaan bahasa baku merentas lima wilayah agung.',
      icon: '🛡️',
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    },
    {
      title: 'Misi Pertama Menanti',
      subtitle: 'Akademi Detektif Bahasa',
      text: 'Puan Zahra sedang menanti anda di Akademi Detektif Bahasa. Bersiap sedialah untuk meneroka, berinteraksi dan menguji keterampilan bertutur serta menulis!',
      icon: '🏛️',
      bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    },
  ];

  const current = storySlides[slideIndex];

  const handleNext = () => {
    if (slideIndex < storySlides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      onContinue();
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-12 bg-gradient-to-b ${current.bgGradient} text-white select-none transition-colors duration-700`}
    >
      {/* Top Controls */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BAKUWIRA: Babak Penceritaan</span>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all border border-slate-700/60"
        >
          <span>Langkau Sinematik</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Cinematic Dialogue Box (Matching Panel 5) */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-6 animate-fadeIn">
        <div className="w-24 h-24 rounded-3xl bg-slate-900/80 border-2 border-amber-400/40 flex items-center justify-center text-5xl shadow-2xl">
          {current.icon}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            {current.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100">
            {current.title}
          </h2>
        </div>

        {/* Narrator Dialogue Box from Panel 5 */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-amber-500/50 shadow-2xl text-left space-y-2 relative">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase block">
            Pencerita (Narrator):
          </span>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium italic">
            "{current.text}"
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-2">
          {storySlides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === slideIndex ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-2xl flex justify-end z-10">
        <button
          onClick={handleNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
          <span>{slideIndex === storySlides.length - 1 ? 'Mula Pengembaraan' : 'Seterusnya'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
