/**
 * BAKUWIRA: Master Main Menu (Official Artwork & Invisible Interactive Hotspots)
 * 
 * Features:
 * - Full-screen presentation utilizing the official BAKUWIRA illustration (1280x720 / 16:9)
 * - Exact responsive coordinate containment: zero distortion, zero letterboxing offset
 * - Removed duplicate top navigation bar completely
 * - Activated all 6 illustrated purple/gold RPG buttons with invisible interactive hotspots:
 *   1. MULAKAN PENGEMBARAAN -> World adventure map (5 regions)
 *   2. PETA DUNIA -> World map
 *   3. MISI & CABARAN -> 21 missions management & editor
 *   4. KOLEKSI BAHASA -> Vocabulary & grammar modules
 *   5. INVENTORI -> Player bag, tools, and crystals
 *   6. TETAPAN -> Game audio, graphics, and settings
 * - Activated 4 left-side menu illustrated buttons:
 *   1. GANJARAN HARIAN -> Daily rewards modal
 *   2. PENCAPAIAN -> Achievement system
 *   3. WATAK -> Character selection & customization
 *   4. KEDAI PERMAINAN -> Educational rewards shop (in-game coins only)
 * - Preserved PANDUAN PERMAINAN via the illustrated open guide book & quill above BAKUWIRA logo
 *   plus a subtle integrated help badge
 * - Activated top bar illustrated stats & bottom 5 region cards
 * - Subtle golden glow visual feedback on hover/tap, keyboard focus accessibility, and crisp audio cues
 */

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Volume2,
  VolumeX,
  Film,
  Sparkles,
  ArrowLeft,
  User,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { REGIONS_DATA } from '../../data/missionBank';
import { soundEffects } from '../../utils/audioEffects';
import { SakuraParticlesCanvas } from '../effects/SakuraParticlesCanvas';
import {
  getIsFullscreen,
  requestGameFullscreen,
  exitGameFullscreen,
} from '../../utils/fullscreen';

// Modals
import { DailyRewardModal } from '../modals/DailyRewardModal';
import { InventoryModal } from '../modals/InventoryModal';
import { LanguageCollectionModal } from '../modals/LanguageCollectionModal';
import { ShopModal } from '../modals/ShopModal';
import { SettingsModal } from '../modals/SettingsModal';
import { InboxModal } from '../modals/InboxModal';
import { AnimateVideoModal } from '../modals/AnimateVideoModal';

interface MainMenuProps {
  onStartNew: () => void;
  onContinue: () => void;
  onOpenMissions: () => void;
  onOpenAchievements: () => void;
  onOpenContentManager: () => void;
  onOpenSettings: () => void;
  onStartAdventure?: () => void;
  onOpenTutorial?: () => void;
  onOpenProfileSelect?: () => void;
  activeProfile?: PlayerProfile | null;
  onSelectRegion?: (regionId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartNew,
  onContinue,
  onOpenMissions,
  onOpenAchievements,
  onOpenContentManager,
  onOpenSettings,
  onStartAdventure,
  onOpenTutorial,
  onOpenProfileSelect,
  activeProfile,
  onSelectRegion,
}) => {
  // Modal states
  const [dailyRewardOpen, setDailyRewardOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [profileSummaryOpen, setProfileSummaryOpen] = useState(false);

  // Region preview state for bottom carousel
  const [selectedRegionCard, setSelectedRegionCard] = useState<string | null>(null);

  // Dynamic resources (coins, gems)
  const [coins, setCoins] = useState(activeProfile?.coins || 25000);
  const [gems, setGems] = useState(1500);
  const [claimedDays, setClaimedDays] = useState<number[]>([]);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(getIsFullscreen());

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(getIsFullscreen());
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    soundEffects.playClick();
    if (getIsFullscreen()) {
      await exitGameFullscreen();
      setIsFullscreen(false);
    } else {
      await requestGameFullscreen(document.documentElement);
      setIsFullscreen(true);
    }
  };

  // Sound toggle
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.setMuted(next);
    if (!next) {
      soundEffects.playClick();
      soundEffects.startAmbientFantasyBGM();
    } else {
      soundEffects.stopAmbientFantasyBGM();
    }
  };

  const handleClaimDaily = (bonusCoins: number, bonusGems: number) => {
    setCoins((c) => c + bonusCoins);
    setGems((g) => g + bonusGems);
    setClaimedDays((days) => [...days, 1]);
  };

  const handleClaimMail = (bonusCoins: number) => {
    setCoins((c) => c + bonusCoins);
  };

  const handleBuyShopItem = (item: { cost: number }) => {
    setCoins((c) => Math.max(0, c - item.cost));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none">
      {/* 
        16:9 Responsive Presentation Container
        Calculated strictly to maintain the 16:9 ratio of the uploaded artwork.
        Hotspots inside are percentage-based and remain 100% pixel-aligned on desktop,
        tablet, and mobile landscape, regardless of browser dimensions or letterboxing.
      */}
      <div
        className="relative overflow-hidden shadow-2xl flex items-center justify-center"
        style={{
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
          aspectRatio: '16 / 9',
        }}
      >
        {/* Layer 1: Official Master BAKUWIRA Artwork (Clean, uncropped, original colors & buttons) */}
        <img
          src="/assets/aistudio/menu_game_bc7c0e58.jpeg"
          alt="BAKUWIRA: Misi Penyelamat Bahasa"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Layer 2: Subtle Golden Logo Shimmer Sweep Overlay */}
        <div
          className="absolute pointer-events-none z-10 overflow-hidden"
          style={{
            left: '48%',
            top: '8%',
            width: '32%',
            height: '22%',
          }}
        >
          <div className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent w-[200%] h-full animate-shimmer" />
          </div>
        </div>

        {/* Layer 3: High-Performance Sakura Petals & Magical Sparkles Canvas */}
        <SakuraParticlesCanvas interactive={true} />

        {/* Layer 4: Invisible Interactive Hotspots positioned exactly over the illustrated buttons */}
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-auto">

          {/* ==================================================== */}
          {/* SECTION 4: 6 MAIN ILLUSTRATED BUTTONS (RIGHT STACK)  */}
          {/* ==================================================== */}

          {/* BUTTON 1: MULAKAN PENGEMBARAAN (Grand Play Button) */}
          <button
            onClick={() => {
              soundEffects.playFanfare();
              if (onStartAdventure) {
                onStartAdventure();
              } else {
                onOpenMissions();
              }
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Mulakan Pengembaraan (Peta Dunia 5 Wilayah)"
            aria-label="Mulakan Pengembaraan"
            className="absolute rounded-3xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '76.2%',
              top: '28.8%',
              width: '22.8%',
              height: '12.4%',
            }}
          >
            {/* Subtle golden aura glow on hover */}
            <div className="w-full h-full rounded-3xl transition-all duration-300 pointer-events-none group-hover:bg-gradient-to-r group-hover:from-amber-400/20 group-hover:to-yellow-300/30 group-hover:shadow-[0_0_35px_rgba(250,204,21,0.85),inset_0_0_20px_rgba(254,240,138,0.5)] group-hover:border-2 group-hover:border-amber-300/80" />
          </button>

          {/* BUTTON 2: PETA DUNIA */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onStartAdventure) {
                onStartAdventure();
              } else {
                onOpenMissions();
              }
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Peta Dunia"
            aria-label="Peta Dunia"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '78.5%',
              top: '42.4%',
              width: '20.4%',
              height: '7.8%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* BUTTON 3: MISI & CABARAN */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenContentManager();
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Misi & Cabaran (Pengurusan 21 Misi Rasmi)"
            aria-label="Misi dan Cabaran"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '78.5%',
              top: '50.8%',
              width: '20.4%',
              height: '7.8%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* BUTTON 4: KOLEKSI BAHASA */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setCollectionOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Koleksi Bahasa (Glosari Baku & Modul)"
            aria-label="Koleksi Bahasa"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '78.5%',
              top: '59.2%',
              width: '20.4%',
              height: '7.8%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* BUTTON 5: INVENTORI */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setInventoryOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Inventori & Beg Wira"
            aria-label="Inventori"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '78.5%',
              top: '67.6%',
              width: '20.4%',
              height: '7.8%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* BUTTON 6: TETAPAN */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSettingsOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Tetapan Permainan"
            aria-label="Tetapan Permainan"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '80.8%',
              top: '76.0%',
              width: '18.2%',
              height: '7.8%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* ==================================================== */}
          {/* SECTION 5: 4 LEFT SIDE MENU BUTTONS                 */}
          {/* ==================================================== */}

          {/* Left Item 1: GANJARAN HARIAN */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setDailyRewardOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Ganjaran Harian"
            aria-label="Ganjaran Harian"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '1.2%',
              top: '15.2%',
              width: '6.5%',
              height: '13.2%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* Left Item 2: PENCAPAIAN */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenAchievements();
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Pencapaian & Lencana"
            aria-label="Pencapaian"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '1.2%',
              top: '29.2%',
              width: '6.5%',
              height: '13.2%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* Left Item 3: WATAK (Selection & Customization) with Guided Arrow */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onOpenProfileSelect) {
                onOpenProfileSelect();
              } else {
                onStartNew();
              }
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Watak (Pemilihan & Ubah Suai Watak Wira)"
            aria-label="Watak"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] z-20"
            style={{
              left: '1.2%',
              top: '43.2%',
              width: '6.5%',
              height: '13.2%',
            }}
          >
            {/* Glowing golden halo on the character button */}
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none border-2 border-amber-400/80 shadow-[0_0_20px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.4)] animate-pulse group-hover:bg-amber-400/20 group-hover:shadow-[0_0_35px_rgba(250,204,21,0.95)]" />

            {/* Corner Badge */}
            <div className="absolute -top-1.5 -right-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.9)] border border-yellow-100 uppercase tracking-tighter">
              WATAK
            </div>
          </button>

          {/* Animated Guidance Arrow Pointing directly to the WATAK Button */}
          <div
            onClick={() => {
              soundEffects.playClick();
              if (onOpenProfileSelect) {
                onOpenProfileSelect();
              } else {
                onStartNew();
              }
            }}
            className="absolute z-30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-bounce-horizontal select-none"
            style={{
              left: '8.2%',
              top: '45.2%',
            }}
            title="Klik di sini untuk memilih watak dan meneruskan permainan"
          >
            {/* Golden Circular Pointing Arrow pointing left towards WATAK */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-[0_0_25px_rgba(250,204,21,0.95)] flex items-center justify-center animate-pulse">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 stroke-[3] drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                </div>
              </div>
              {/* Outer pulsing ping ring */}
              <span className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-ping opacity-60 pointer-events-none" />
            </div>

            {/* Royal Callout Badge: "PILIH WATAK • Ke Permainan Seterusnya" */}
            <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-slate-950/95 via-purple-950/90 to-slate-950/95 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(250,204,21,0.7)] flex items-center gap-2 backdrop-blur-md">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                <User className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text">
                    PILIH WATAK
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-300/90 whitespace-nowrap">
                  Klik untuk ke permainan seterusnya ➔
                </span>
              </div>
            </div>
          </div>

          {/* Left Item 4: KEDAI PERMAINAN (In-game educational rewards) */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setShopOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Kedai Permainan (Ganjaran & Barangan Permainan)"
            aria-label="Kedai Permainan"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '1.2%',
              top: '57.2%',
              width: '6.5%',
              height: '13.2%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:bg-amber-400/15 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.7),inset_0_0_15px_rgba(254,240,138,0.35)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* ==================================================== */}
          {/* SECTION 6: PRESERVED GAME INSTRUCTIONS (PANDUAN)     */}
          {/* Connecting tutorial to the illustrated magic guide   */}
          {/* book & quill emblem right above the BAKUWIRA logo    */}
          {/* ==================================================== */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onOpenTutorial) onOpenTutorial();
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Panduan Permainan (Buku Panduan Wira - 7 Langkah Pengembaraan)"
            aria-label="Panduan Permainan"
            className="absolute rounded-3xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            style={{
              left: '54.0%',
              top: '7.8%',
              width: '16.5%',
              height: '12.5%',
            }}
          >
            <div className="w-full h-full rounded-3xl transition-all duration-300 pointer-events-none group-hover:bg-gradient-to-r group-hover:from-amber-400/20 group-hover:to-yellow-300/20 group-hover:shadow-[0_0_30px_rgba(250,204,21,0.8),inset_0_0_15px_rgba(254,240,138,0.4)] group-hover:border group-hover:border-amber-300/60" />
          </button>

          {/* ==================================================== */}
          {/* TOP BAR ILLUSTRATED HOTSPOTS                        */}
          {/* ==================================================== */}

          {/* 1. Player Profile Badge (Top-Left) */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setProfileSummaryOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Profil Wira Bahasa & Status"
            aria-label="Profil Wira Bahasa"
            className="absolute rounded-full transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            style={{
              left: '1.0%',
              top: '1.5%',
              width: '18.5%',
              height: '9.8%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border group-hover:border-amber-300/60 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] group-hover:bg-amber-400/10" />
          </button>

          {/* 2. Diamonds / Gems Hotspot */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setShopOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Permata Kristal Wira"
            aria-label="Permata Kristal"
            className="absolute rounded-xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            style={{
              left: '48.2%',
              top: '1.5%',
              width: '10.0%',
              height: '6.8%',
            }}
          >
            <div className="w-full h-full rounded-xl transition-all duration-300 pointer-events-none group-hover:border group-hover:border-cyan-400/80 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] group-hover:bg-cyan-400/15" />
          </button>

          {/* 3. Gold Coins Hotspot */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setShopOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Koin Emas Bahasa"
            aria-label="Koin Emas"
            className="absolute rounded-xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{
              left: '59.0%',
              top: '1.5%',
              width: '11.2%',
              height: '6.8%',
            }}
          >
            <div className="w-full h-full rounded-xl transition-all duration-300 pointer-events-none group-hover:border group-hover:border-amber-400/80 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.6)] group-hover:bg-amber-400/15" />
          </button>

          {/* 4. Energy / Stamina Hotspot */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setInventoryOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Tenaga Pengembaraan"
            aria-label="Tenaga Pengembaraan"
            className="absolute rounded-xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            style={{
              left: '71.0%',
              top: '1.5%',
              width: '12.2%',
              height: '6.8%',
            }}
          >
            <div className="w-full h-full rounded-xl transition-all duration-300 pointer-events-none group-hover:border group-hover:border-rose-400/80 group-hover:shadow-[0_0_15px_rgba(251,113,133,0.6)] group-hover:bg-rose-400/15" />
          </button>

          {/* 5. Notification Bell Hotspot */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setInboxOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Notifikasi & Pengumuman"
            aria-label="Notifikasi"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{
              left: '84.5%',
              top: '1.5%',
              width: '4.4%',
              height: '7.2%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.8)] group-hover:bg-amber-400/20" />
          </button>

          {/* 6. Mail Hotspot */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setInboxOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Peti Warkah Diraja"
            aria-label="Peti Warkah"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{
              left: '89.5%',
              top: '1.5%',
              width: '4.4%',
              height: '7.2%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.8)] group-hover:bg-amber-400/20" />
          </button>

          {/* 7. Settings Gear Hotspot */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSettingsOpen(true);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Tetapan Permainan"
            aria-label="Tetapan Permainan"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{
              left: '94.5%',
              top: '1.5%',
              width: '4.4%',
              height: '7.2%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.8)] group-hover:bg-amber-400/20" />
          </button>

          {/* ==================================================== */}
          {/* BOTTOM REGION CAROUSEL HOTSPOTS (1 to 5)            */}
          {/* ==================================================== */}

          {/* Region 1: Kota Media Sosial */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedRegionCard('kota_media');
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Wilayah 1: Kota Media Sosial"
            aria-label="Wilayah 1: Kota Media Sosial"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.98]"
            style={{
              left: '5.6%',
              top: '64.5%',
              width: '13.0%',
              height: '29.5%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-blue-400 group-hover:shadow-[0_0_25px_rgba(96,165,250,0.8),inset_0_0_15px_rgba(96,165,250,0.3)] group-hover:bg-blue-400/15" />
          </button>

          {/* Region 2: Akademi Detektif Bahasa */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedRegionCard('akademi');
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Wilayah 2: Akademi Detektif Bahasa"
            aria-label="Wilayah 2: Akademi Detektif Bahasa"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-[0.98]"
            style={{
              left: '20.4%',
              top: '64.5%',
              width: '13.5%',
              height: '29.5%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-amber-400 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.8),inset_0_0_15px_rgba(250,204,21,0.3)] group-hover:bg-amber-400/15" />
          </button>

          {/* Region 3: Bengkel Bahasa Melayu */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedRegionCard('bengkel');
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Wilayah 3: Bengkel Bahasa Melayu"
            aria-label="Wilayah 3: Bengkel Bahasa Melayu"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.98]"
            style={{
              left: '35.4%',
              top: '64.5%',
              width: '13.5%',
              height: '29.5%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-emerald-400 group-hover:shadow-[0_0_25px_rgba(52,211,153,0.8),inset_0_0_15px_rgba(52,211,153,0.3)] group-hover:bg-emerald-400/15" />
          </button>

          {/* Region 4: Kampung Komunikasi */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedRegionCard('kampung');
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Wilayah 4: Kampung Komunikasi"
            aria-label="Wilayah 4: Kampung Komunikasi"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-[0.98]"
            style={{
              left: '50.4%',
              top: '64.5%',
              width: '13.5%',
              height: '29.5%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.8),inset_0_0_15px_rgba(34,211,238,0.3)] group-hover:bg-cyan-400/15" />
          </button>

          {/* Region 5: Istana Wira Bahasa */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedRegionCard('istana');
            }}
            onMouseEnter={() => soundEffects.playHover()}
            title="Wilayah 5: Istana Wira Bahasa"
            aria-label="Wilayah 5: Istana Wira Bahasa"
            className="absolute rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 active:scale-[0.98]"
            style={{
              left: '65.4%',
              top: '64.5%',
              width: '13.5%',
              height: '29.5%',
            }}
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 pointer-events-none group-hover:border-2 group-hover:border-yellow-400 group-hover:shadow-[0_0_30px_rgba(250,204,21,0.9),inset_0_0_15px_rgba(250,204,21,0.35)] group-hover:bg-yellow-400/20" />
          </button>

          {/* ==================================================== */}
          {/* DISCRETE INTEGRATED UTILITY CONTROLS                 */}
          {/* Clean, unobtrusive corner controls:                 */}
          {/* - Panduan Permainan (Help icon)                     */}
          {/* - AI Video Studio                                   */}
          {/* - BGM Audio Toggle                                  */}
          {/* ==================================================== */}
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-30">
            {/* Integrated Panduan Permainan Help Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                if (onOpenTutorial) onOpenTutorial();
              }}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-amber-500/50 shadow-xl text-amber-300 text-xs font-bold flex items-center gap-1 transition-all transform hover:scale-105 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Panduan Permainan (7 Langkah Interaktif)"
              aria-label="Panduan Permainan"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline text-[11px]">Panduan</span>
            </button>

            {/* AI Video Generation Feature: Animate Images into Video */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setVideoModalOpen(true);
              }}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-purple-400/60 shadow-xl flex items-center gap-1 text-xs font-bold text-purple-200 transition-all transform hover:scale-105 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              title="Jana Video Animasi 16:9 menggunakan Gemini Omni Flash"
              aria-label="Video Animasi AI"
            >
              <Film className="w-4 h-4 text-yellow-300" />
              <span className="hidden md:inline text-[11px]">Animasi Video AI</span>
            </button>

            {/* Audio Ambience Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-amber-500/50 shadow-xl text-amber-300 transition-all transform hover:scale-110 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title={isMuted ? 'Buka Bunyi BGM' : 'Bisukan Audio'}
              aria-label={isMuted ? 'Buka Bunyi BGM' : 'Bisukan Audio'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Skrin Penuh (Landscape Fullscreen Toggle) */}
            <button
              onClick={toggleFullscreen}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-cyan-400/60 shadow-xl flex items-center gap-1 text-xs font-bold text-cyan-300 transition-all transform hover:scale-105 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              title={isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh (Mod Melintang)'}
              aria-label={isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh (Mod Melintang)'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-cyan-400" />
              )}
              <span className="hidden md:inline text-[11px]">
                {isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODALS                                               */}
      {/* ==================================================== */}

      {/* Region Preview Modal (when clicking bottom cards) */}
      {selectedRegionCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-4 text-white">
            {(() => {
              const reg =
                REGIONS_DATA.find((r) => r.id === selectedRegionCard) || REGIONS_DATA[0];
              return (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 border-2 border-amber-200">
                    {reg.crystalIcon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      Wilayah Ke-{reg.orderNumber}
                    </span>
                    <h3 className="text-xl font-black text-white">{reg.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed px-2">
                      {reg.description}
                    </p>
                  </div>
                  <div className="w-full p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-left space-y-1">
                    <div className="text-slate-400">
                      Ganjaran Kristal:{' '}
                      <strong className="text-yellow-300">{reg.crystalName}</strong>
                    </div>
                    <div className="text-slate-400">
                      Bilangan Sublokasi:{' '}
                      <strong className="text-cyan-300">4 Lokasi Teroka</strong>
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setSelectedRegionCard(null)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => {
                        const target = selectedRegionCard;
                        setSelectedRegionCard(null);
                        if (onSelectRegion) {
                          onSelectRegion(target);
                        } else {
                          onContinue();
                        }
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
                    >
                      Teroka Sekarang
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Profile Summary Modal */}
      {profileSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500 rounded-3xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl border border-white/20 shadow">
                {activeProfile?.avatar.gender === 'perempuan' ? '🧕' : '🧑‍🎓'}
              </div>
              <div>
                <h3 className="font-black text-sm text-white">
                  {activeProfile?.name || 'Wira Bahasa'}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                  Tahap {activeProfile?.level || 1}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Mata Pengalaman (EXP):</span>
                <span className="text-blue-300 font-mono font-bold">
                  {activeProfile?.xp || 0} / {activeProfile?.maxXp || 1000}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Koin Pengembaraan:</span>
                <span className="text-amber-300 font-mono font-bold">{coins}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Permata Kristal:</span>
                <span className="text-cyan-300 font-mono font-bold">{gems}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Misi Selesai:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {activeProfile?.completedActivities.length || 0} / 21
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setProfileSummaryOpen(false);
                  if (onOpenProfileSelect) {
                    onOpenProfileSelect();
                  } else {
                    onStartNew();
                  }
                }}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300"
              >
                Tukar / Ubah Watak
              </button>
              <button
                onClick={() => setProfileSummaryOpen(false)}
                className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-slate-950"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Reward Modal */}
      {dailyRewardOpen && (
        <DailyRewardModal
          claimedDays={claimedDays}
          onClaim={handleClaimDaily}
          onClose={() => setDailyRewardOpen(false)}
        />
      )}

      {/* Inventory Modal */}
      {inventoryOpen && <InventoryModal onClose={() => setInventoryOpen(false)} />}

      {/* Language Collection Modal */}
      {collectionOpen && (
        <LanguageCollectionModal onClose={() => setCollectionOpen(false)} />
      )}

      {/* Shop Modal */}
      {shopOpen && (
        <ShopModal
          playerCoins={coins}
          onBuyItem={handleBuyShopItem}
          onClose={() => setShopOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          onResetTutorial={() => {
            setSettingsOpen(false);
            if (onOpenTutorial) onOpenTutorial();
          }}
        />
      )}

      {/* Inbox Modal */}
      {inboxOpen && (
        <InboxModal
          onClose={() => setInboxOpen(false)}
          onClaimReward={handleClaimMail}
        />
      )}

      {/* AI Video Studio Modal */}
      {videoModalOpen && <AnimateVideoModal onClose={() => setVideoModalOpen(false)} />}
    </div>
  );
};
