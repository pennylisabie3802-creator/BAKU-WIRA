/**
 * BAKUWIRA: Tetapan Permainan Modal
 * Controls audio, sound effects, tutorial reset, and credits.
 */

import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Sparkles, X, RotateCcw, Monitor, Info } from 'lucide-react';
import { soundEffects } from '../../utils/audioEffects';

interface SettingsModalProps {
  onClose: () => void;
  onResetTutorial?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onResetTutorial }) => {
  const [muted, setMuted] = useState(soundEffects.getMuted());
  const [volume, setVolume] = useState(() => Math.round(soundEffects.getBGMVolume() * 100));
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>(() => {
    return (localStorage.getItem('bakuwira_graphics_quality') as any) || 'high';
  });
  const [resetNotice, setResetNotice] = useState(false);

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    soundEffects.setBGMVolume(newVal / 100);
  };

  const handleSetGraphics = (level: 'low' | 'medium' | 'high') => {
    setGraphicsQuality(level);
    localStorage.setItem('bakuwira_graphics_quality', level);
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playClick();
    }
  };

  const handleResetTutorial = () => {
    soundEffects.playClick();
    if (onResetTutorial) onResetTutorial();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 text-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
              <Settings className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                Tetapan Permainan
              </h2>
              <p className="text-xs text-slate-400">Audio, paparan dan pilihan sistem BAKUWIRA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Audio Controls */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {muted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-bold text-slate-200">Kesan Bunyi & BGM</span>
              </div>
              <button
                onClick={toggleMute}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition-all ${
                  muted
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {muted ? 'Dibisukan' : 'Aktif (60fps Audio)'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">Kelantangan:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-300 w-8 text-right">{volume}%</span>
            </div>
          </div>

          {/* Graphics Quality */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-slate-200">Kualiti Visual & Kelopak Sakura</span>
                <p className="text-[10px] text-slate-400">Prestasi animasi 60 FPS pada peranti</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSetGraphics('low')}
                className={`py-1 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                  graphicsQuality === 'low'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Sesuai untuk telefon mudah alih / peranti bajet"
              >
                Rendah (Low)
              </button>
              <button
                onClick={() => handleSetGraphics('medium')}
                className={`py-1 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                  graphicsQuality === 'medium'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Keseimbangan grafik dan kelancaran"
              >
                Sederhana
              </button>
              <button
                onClick={() => handleSetGraphics('high')}
                className={`py-1 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                  graphicsQuality === 'high'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Pencahayaan penuh, bayang lembut & 60 FPS"
              >
                Tinggi (High)
              </button>
            </div>
          </div>

          {/* Reset Tutorial Option */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-200">Panduan Permainan</span>
              <p className="text-[10px] text-slate-400">Main semula 7 skrin tutorial Puan Zahra</p>
            </div>
            <button
              onClick={handleResetTutorial}
              className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Buka Panduan</span>
            </button>
          </div>

          {resetNotice && (
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs text-center border border-emerald-500/40">
              Panduan permainan akan dipaparkan semasa memasuki dunia!
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
          <span>Versi 2.4.0 • DBP Malaysia</span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
