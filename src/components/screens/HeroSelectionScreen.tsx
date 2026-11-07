/**
 * BAKUWIRA: Pilih Watak Utama (Official Hero Selection Screen)
 * 
 * Features:
 * - 100% preserves the master uploaded anime illustration:
 *   /assets/aistudio/file_00000000c7848207a683cefc0e85b4cd_0d60acef.png
 * - NO block-shaped 3D models covering the artwork.
 * - Both original anime characters are completely visible and crystal clear.
 * - Non-destructive subtle 2D anime animations:
 *   * Natural blinking (soft eyelid blink timed over anime eyes)
 *   * Gentle organic breathing oscillation
 *   * Subtle hair, ribbon, and cape breeze motion
 *   * Soft floating magical particles (Gold/Blue for male, Pink/Purple for female)
 *   * Dynamic selection reactions (radiant glowing frame highlight, particle burst, sound cue)
 * - Interactive clickable cards for Wira Lelaki and Wira Perempuan
 * - Golden "✓ Sahkan" button enabled once a hero is selected
 * - Navigation: "KEMBALI → Main Menu"
 * - Profile sheet drawer for official turnaround sheets and expressions
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Info,
  Check,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEffects } from '../../utils/audioEffects';

export type HeroGender = 'lelaki' | 'perempuan';

interface HeroSelectionScreenProps {
  initialGender?: HeroGender;
  initialName?: string;
  onConfirm: (gender: HeroGender, name: string) => void;
  onBack: () => void;
}

export const HeroSelectionScreen: React.FC<HeroSelectionScreenProps> = ({
  initialGender,
  initialName = 'Wira Bahasa',
  onConfirm,
  onBack,
}) => {
  const [selectedHero, setSelectedHero] = useState<HeroGender | null>(initialGender || null);
  const [heroName, setHeroName] = useState(initialName);
  const [showProfileDrawer, setShowProfileDrawer] = useState<HeroGender | null>(null);

  // Reaction burst trigger state
  const [justSelected, setJustSelected] = useState<HeroGender | null>(null);

  // Sound toggle
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());

  const handleSelect = (hero: HeroGender) => {
    setSelectedHero(hero);
    setJustSelected(hero);
    soundEffects.playHeroSelect(hero);

    // Reset burst effect after 1.8 seconds
    setTimeout(() => {
      setJustSelected(null);
    }, 1800);
  };

  const handleConfirm = () => {
    if (!selectedHero) return;
    soundEffects.playClick();
    soundEffects.playFanfare();

    onConfirm(
      selectedHero,
      heroName.trim() || (selectedHero === 'lelaki' ? 'Wira Lelaki' : 'Wira Perempuan')
    );
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.setMuted(next);
    if (!next) soundEffects.playClick();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none font-sans">
      {/* 
        Responsive Presentation Frame matching official artwork ratio 1190 / 1322 (~0.9)
        Keeps artwork uncropped, undistorted, and pixel-aligned on all viewports.
      */}
      <div
        className="relative overflow-hidden shadow-2xl flex items-center justify-center"
        style={{
          width: 'min(98vw, calc(98vh * 1190 / 1322))',
          height: 'min(98vh, calc(98vw * 1322 / 1190))',
          aspectRatio: '1190 / 1322',
        }}
      >
        {/* Layer 1: The Official Master Anime Artwork (Crisp, clean, unblocked) */}
        <img
          src="/assets/aistudio/file_00000000c7848207a683cefc0e85b4cd_0d60acef.png"
          alt="Pilih Watak Utama"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* Layer 2: Subtle Ambient Atmospheric Shimmer */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/20 via-transparent to-purple-950/15" />

        {/* Layer 3: Top Navigation Bar Overlay (KEMBALI & Info Controls) */}
        <div className="absolute top-2 sm:top-4 left-3 right-3 sm:left-6 sm:right-6 z-30 flex items-center justify-between pointer-events-auto">
          {/* Button: KEMBALI → Main Menu */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onBack();
            }}
            className="py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl bg-slate-950/85 hover:bg-slate-900 border-2 border-amber-400 text-amber-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            title="Kembali ke Menu Utama"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>KEMBALI</span>
          </button>

          {/* Right utility buttons: Info & Audio */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowProfileDrawer(selectedHero || 'lelaki');
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-amber-400/80 text-amber-300 font-bold text-[11px] sm:text-xs flex items-center gap-1.5 backdrop-blur-md shadow-lg cursor-pointer transition-transform hover:scale-105"
              title="Lihat Lembaran Profil Rasmi & Turnaround"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Info Hero</span>
            </button>

            <button
              onClick={toggleSound}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-amber-400/80 text-amber-300 transition-all shadow-lg cursor-pointer"
              title={isMuted ? 'Bunyikan Audio' : 'Senyapkan Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* INTERACTIVE CHARACTER CARD 1: WIRA LELAKI (LEFT)    */}
        {/* Exact coordinates over the illustrated left frame:   */}
        {/* Left: 14.2%, Top: 18.6%, Width: 35.4%, Height: 47.8% */}
        {/* ==================================================== */}
        <div
          onClick={() => handleSelect('lelaki')}
          className={`absolute rounded-3xl cursor-pointer transition-all duration-300 group z-20 overflow-hidden ${
            selectedHero === 'lelaki'
              ? 'scale-[1.025] shadow-[0_0_40px_rgba(59,130,246,0.95),0_0_20px_rgba(250,204,21,0.95)] ring-4 ring-amber-300'
              : 'hover:scale-[1.015] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] ring-2 ring-transparent hover:ring-amber-400/50'
          }`}
          style={{
            left: '14.2%',
            top: '18.6%',
            width: '35.4%',
            height: '47.8%',
          }}
          title="Pilih Wira Lelaki (Peneroka / Pahlawan Bahasa)"
        >
          {/* Subtle 2D Breathing Animation Layer */}
          <div className="absolute inset-0 pointer-events-none animate-anime-breathe" />

          {/* Subtle Hair & Cape Breeze Motion Shimmer */}
          <div className="absolute inset-0 pointer-events-none animate-hair-breeze opacity-35 bg-gradient-to-tr from-transparent via-blue-400/10 to-transparent" />

          {/* Natural Eye Blinking Overlay (Precisely positioned over Wira Lelaki's anime eyes) */}
          <div
            className="absolute pointer-events-none animate-anime-blink rounded-full bg-amber-900/60 blur-[0.6px]"
            style={{
              top: '30.8%',
              left: '42.5%',
              width: '18%',
              height: '2.5%',
            }}
          />

          {/* Floating Blue & Gold Magic Particles (Non-destructive overlay) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span
              className="absolute text-blue-300 text-[10px] animate-sparkle-rise"
              style={{ left: '25%', bottom: '20%', animationDelay: '0s' }}
            >
              ✦
            </span>
            <span
              className="absolute text-amber-300 text-[8px] animate-sparkle-rise"
              style={{ left: '60%', bottom: '28%', animationDelay: '0.8s' }}
            >
              ★
            </span>
            <span
              className="absolute text-cyan-200 text-[10px] animate-sparkle-rise"
              style={{ left: '40%', bottom: '15%', animationDelay: '1.5s' }}
            >
              ✦
            </span>
            <span
              className="absolute text-yellow-300 text-[7px] animate-sparkle-rise"
              style={{ left: '72%', bottom: '35%', animationDelay: '1.9s' }}
            >
              •
            </span>
          </div>

          {/* Selected State: Radiant Golden-Blue Halo & Burst Glow */}
          {selectedHero === 'lelaki' && (
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-amber-400/15 to-transparent pointer-events-none z-10 transition-opacity duration-300" />
          )}

          {/* Selection Reaction Burst Animation (When newly clicked) */}
          {justSelected === 'lelaki' && (
            <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center animate-ping">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400/40 via-yellow-300/40 to-blue-500/40 blur-lg" />
            </div>
          )}

          {/* Selected Check Badge in top right corner */}
          {selectedHero === 'lelaki' && (
            <div className="absolute top-2.5 right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-xl border-2 border-white animate-bounce pointer-events-none">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
            </div>
          )}

          {/* Active Bottom Glow Accent */}
          <div
            className={`absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-blue-600/50 via-blue-400/20 to-transparent pointer-events-none transition-opacity duration-300 ${
              selectedHero === 'lelaki' ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
            }`}
          />
        </div>

        {/* ==================================================== */}
        {/* INTERACTIVE CHARACTER CARD 2: WIRA PEREMPUAN (RIGHT)*/}
        {/* Exact coordinates over the illustrated right frame:  */}
        {/* Left: 50.4%, Top: 18.6%, Width: 35.4%, Height: 47.8% */}
        {/* ==================================================== */}
        <div
          onClick={() => handleSelect('perempuan')}
          className={`absolute rounded-3xl cursor-pointer transition-all duration-300 group z-20 overflow-hidden ${
            selectedHero === 'perempuan'
              ? 'scale-[1.025] shadow-[0_0_40px_rgba(217,70,239,0.95),0_0_20px_rgba(250,204,21,0.95)] ring-4 ring-amber-300'
              : 'hover:scale-[1.015] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] ring-2 ring-transparent hover:ring-amber-400/50'
          }`}
          style={{
            left: '50.4%',
            top: '18.6%',
            width: '35.4%',
            height: '47.8%',
          }}
          title="Pilih Wira Perempuan (Penyelidik / Penulis Wira)"
        >
          {/* Subtle 2D Breathing Animation Layer */}
          <div className="absolute inset-0 pointer-events-none animate-anime-breathe" />

          {/* Subtle Hair, Ribbon & Flower Flutter Motion Shimmer */}
          <div className="absolute inset-0 pointer-events-none animate-ribbon-flutter opacity-35 bg-gradient-to-tr from-transparent via-pink-400/10 to-transparent" />

          {/* Natural Eye Blinking Overlay (Precisely positioned over Wira Perempuan's anime eyes) */}
          <div
            className="absolute pointer-events-none animate-anime-blink rounded-full bg-pink-950/60 blur-[0.6px]"
            style={{
              top: '32.2%',
              left: '43.2%',
              width: '18%',
              height: '2.5%',
            }}
          />

          {/* Floating Pink, Magenta & Sakura Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span
              className="absolute text-pink-300 text-[10px] animate-sparkle-rise"
              style={{ left: '30%', bottom: '22%', animationDelay: '0.2s' }}
            >
              🌸
            </span>
            <span
              className="absolute text-fuchsia-300 text-[9px] animate-sparkle-rise"
              style={{ left: '65%', bottom: '26%', animationDelay: '1.0s' }}
            >
              ✦
            </span>
            <span
              className="absolute text-amber-300 text-[8px] animate-sparkle-rise"
              style={{ left: '45%', bottom: '18%', animationDelay: '1.6s' }}
            >
              ★
            </span>
            <span
              className="absolute text-pink-200 text-[7px] animate-sparkle-rise"
              style={{ left: '75%', bottom: '32%', animationDelay: '2.1s' }}
            >
              •
            </span>
          </div>

          {/* Selected State: Radiant Golden-Magenta Halo */}
          {selectedHero === 'perempuan' && (
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-pink-400/15 to-transparent pointer-events-none z-10 transition-opacity duration-300" />
          )}

          {/* Selection Reaction Burst Animation (When newly clicked) */}
          {justSelected === 'perempuan' && (
            <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center animate-ping">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-fuchsia-400/40 via-yellow-300/40 to-pink-500/40 blur-lg" />
            </div>
          )}

          {/* Selected Check Badge in top right corner */}
          {selectedHero === 'perempuan' && (
            <div className="absolute top-2.5 right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-xl border-2 border-white animate-bounce pointer-events-none">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
            </div>
          )}

          {/* Active Bottom Glow Accent */}
          <div
            className={`absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-fuchsia-600/50 via-purple-400/20 to-transparent pointer-events-none transition-opacity duration-300 ${
              selectedHero === 'perempuan' ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
            }`}
          />
        </div>

        {/* ==================================================== */}
        {/* INTERACTIVE HOTSPOT: SAHKAN BUTTON                   */}
        {/* Exact coordinate overlay: Left 24.2%, Top 71.2%     */}
        {/* ==================================================== */}
        <button
          onClick={handleConfirm}
          disabled={!selectedHero}
          className={`absolute rounded-2xl z-20 transition-all duration-200 focus:outline-none ${
            selectedHero
              ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.98]'
              : 'cursor-not-allowed opacity-45'
          }`}
          style={{
            left: '24.2%',
            top: '71.2%',
            width: '51.6%',
            height: '10.8%',
          }}
          title={selectedHero ? 'Sahkan Pemilihan Watak' : 'Sila pilih salah satu wira terlebih dahulu'}
          aria-label="Sahkan Pemilihan Watak"
        >
          {/* Radiant Golden Glow and Shimmer when enabled */}
          {selectedHero && (
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none bg-amber-400/20 hover:bg-amber-300/35 shadow-[0_0_35px_rgba(250,204,21,0.9),inset_0_0_20px_rgba(254,240,138,0.6)] border-2 border-amber-300/90" />
          )}
        </button>

        {/* Small Optional Custom Name Badge Placed Elegantly Above Sahkan */}
        <div
          className="absolute z-20 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-3 py-0.5 rounded-full border border-amber-400/60 shadow-lg"
          style={{
            top: '67.2%',
          }}
        >
          <span className="text-[10px] font-bold text-amber-300">Wira:</span>
          <input
            type="text"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            placeholder={selectedHero === 'perempuan' ? 'Wira Perempuan' : 'Wira Lelaki'}
            maxLength={16}
            className="bg-transparent border-b border-amber-400/40 text-[11px] font-black text-white px-1 py-0 focus:outline-none focus:border-amber-300 text-center w-28 sm:w-36"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* DETAILED HERO PROFILE SHEET DRAWER (IMAGE A & B)     */}
      {/* ==================================================== */}
      {showProfileDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-amber-400 rounded-3xl shadow-2xl p-4 sm:p-6 text-white space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-500/40 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg sm:text-xl font-black text-transparent bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text">
                  Lembaran Profil Karakter Rasmi
                </h3>
              </div>
              <button
                onClick={() => setShowProfileDrawer(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hero Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowProfileDrawer('lelaki')}
                className={`flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                  showProfileDrawer === 'lelaki'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                ♂ Wira Lelaki (Pahlawan Bahasa)
              </button>
              <button
                onClick={() => setShowProfileDrawer('perempuan')}
                className={`flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                  showProfileDrawer === 'perempuan'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                ♀ Wira Perempuan (Penulis Wira)
              </button>
            </div>

            {/* Official Character Sheet Preview (Image A or B) */}
            <div className="rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-xl bg-slate-950">
              <img
                src={
                  showProfileDrawer === 'lelaki'
                    ? '/assets/aistudio/lelaki_1_db0886e4.jpeg'
                    : '/assets/aistudio/perempuan_2_6fd55231.jpeg'
                }
                alt={showProfileDrawer === 'lelaki' ? 'Profil Wira Lelaki' : 'Profil Wira Perempuan'}
                className="w-full h-auto object-contain max-h-[60vh] mx-auto select-none"
              />
            </div>

            {/* Quick Select & Close Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowProfileDrawer(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleSelect(showProfileDrawer);
                  setShowProfileDrawer(null);
                }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                Pilih Hero Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
