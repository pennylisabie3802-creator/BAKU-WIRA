/**
 * BAKUWIRA: Game HUD Overlay
 * 
 * Faithfully matches Image F (dunia_game_2_dd4319dc.jpeg) & Image G (dunia_game_4d1d1234.jpeg):
 * - Top-Left: Ornate circular gold-framed hero portrait (Wira Lelaki / Wira Perempuan art)
 *   with HP gradient bar, coins counter (c) and gold star EXP (☆), plus hero switch button
 * - Top-Right: 4 circular gold-rimmed fantasy quick action buttons:
 *   1. Glosari / Koleksi Bahasa (Book)
 *   2. Inventori / Beg Wira (Chest/Bag)
 *   3. Misi & Cabaran (Missions/Rank)
 *   4. Tetapan Permainan (Gear)
 *   Followed by the circular radar Minimap with gold compass rose
 * - Bottom-Center: The official golden ribbon badge:
 *   "[4] Dunia Permainan (In-Game 3D)"
 * - Preserved guided quest tracker, navigation modal, and teacher mode
 */

import React, { useState } from 'react';
import { PlayerProfile, MissionQuestion, SubLocationInfo } from '../../types/game';
import { Minimap } from './Minimap';
import { REGIONS_DATA } from '../../data/missionBank';
import { soundEffects } from '../../utils/audioEffects';
import {
  isFullscreenSupported,
  getIsFullscreen,
  requestGameFullscreen,
  exitGameFullscreen,
} from '../../utils/fullscreen';
import {
  Compass,
  Menu,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Coins,
  BookOpen,
  Backpack,
  Settings,
  Users,
  Map,
  HelpCircle,
  RefreshCw,
  Navigation,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface GameHUDProps {
  profile: PlayerProfile;
  activeQuestion?: MissionQuestion;
  currentSublocation?: SubLocationInfo;
  targetDestination?: SubLocationInfo;
  playerCoords: [number, number, number];
  playerRotationY: number;
  onOpenSystemMenu: () => void;
  onOpenWorldMap: () => void;
  onOpenContentManager: () => void;
  onOpenTutorial: () => void;
  onTriggerActiveActivity: () => void;
  onReturnToRegionEntrance?: () => void;
  onReturnToMainMenu?: () => void;
  onChangeHero?: () => void;
  onOpenInventory?: () => void;
  onOpenCollection?: () => void;
  onOpenRegionMap?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  profile,
  activeQuestion,
  currentSublocation,
  targetDestination,
  playerCoords,
  playerRotationY,
  onOpenSystemMenu,
  onOpenWorldMap,
  onOpenContentManager,
  onOpenTutorial,
  onTriggerActiveActivity,
  onReturnToRegionEntrance,
  onReturnToMainMenu,
  onChangeHero,
  onOpenInventory,
  onOpenCollection,
  onOpenRegionMap,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [questTrackerCollapsed, setQuestTrackerCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(getIsFullscreen());

  // Listen for Fullscreen API change events
  React.useEffect(() => {
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

  const currentRegion = REGIONS_DATA.find((r) => r.id === profile.currentRegion) || REGIONS_DATA[0];

  const isFemale = profile.avatar.gender === 'perempuan';
  const heroPortrait = isFemale
    ? '/assets/aistudio/perempuan_2_6fd55231.jpeg'
    : '/assets/aistudio/lelaki_1_db0886e4.jpeg';
  const heroRole = isFemale ? 'Penyelidik Bahasa' : 'Peneroka Bahasa';

  // Calculate HP and EXP percentages
  const hpPercent = 100;
  const xpPercent = Math.min(100, Math.round((profile.xp / Math.max(1, profile.maxXp)) * 100));

  // Nearby NPCs for minimap
  const nearbyNpcs = [
    { name: currentSublocation?.primaryNpc || 'Puan Zahra', x: 0, z: -4 },
    { name: 'Adik Faris', x: -12, z: 10 },
  ];

  // Navigation bearing and distance to next game destination
  const destCoords = targetDestination?.coordinates || [0, 0, 0];
  const dx = destCoords[0] - playerCoords[0];
  const dz = destCoords[2] - playerCoords[2];
  const distance = Math.round(Math.sqrt(dx * dx + dz * dz));
  const worldAngleToTarget = Math.atan2(dx, dz);
  // playerRotationY is the player's facing angle in radians
  const relativeAngle = worldAngleToTarget - playerRotationY;
  const relativeDeg = Math.round((relativeAngle * 180) / Math.PI);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-2.5 sm:p-5">
      {/* ==================================================== */}
      {/* TOP HEADER: HERO PORTRAIT (LEFT) & ICONS + MAP (RIGHT) */}
      {/* ==================================================== */}
      <div className="flex items-start justify-between gap-3 w-full">
        {/* -------------------------------------------------- */}
        {/* TOP-LEFT: ORNATE CIRCULAR HERO PORTRAIT & STATS    */}
        {/* Exactly matching Image F & Image G                 */}
        {/* -------------------------------------------------- */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Avatar Container with Ornate Gold Ring Frame */}
          <div className="relative group">
            {/* Outer golden halo */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 blur-[2px] opacity-90 group-hover:opacity-100 transition-opacity" />

            {/* Circular Portrait Frame */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)] bg-slate-900 flex items-center justify-center">
              <img
                src={heroPortrait}
                alt={profile.name}
                className="w-full h-full object-cover object-top scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>

            {/* Small Hero Switch / Change Button at bottom-left corner */}
            {onChangeHero && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onChangeHero();
                }}
                title="Tukar Watak (Pilih Watak Utama)"
                className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg border border-amber-200 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 stroke-[2.5]" />
              </button>
            )}

            {/* Small Gender Element Badge at bottom-right corner */}
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-purple-950/90 border border-amber-400/80 text-[9px] font-black text-amber-300 shadow">
              Lv.{profile.level}
            </div>
          </div>

          {/* Player HP, EXP & Resource Bars (Exact Image F/G styling) */}
          <div className="flex flex-col gap-1 min-w-[130px] sm:min-w-[170px]">
            {/* Top row: Name & Coins (c) */}
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="font-extrabold text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate max-w-[100px]">
                {profile.name}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/50 text-[10px] text-amber-300 font-bold shadow">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>{profile.coins}</span>
              </div>
            </div>

            {/* Cyan/Blue Curved HP Gradient Bar */}
            <div className="relative w-full h-3 sm:h-3.5 rounded-full bg-slate-950/90 border border-cyan-400/80 p-0.5 shadow-[0_0_10px_rgba(34,211,238,0.4)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 transition-all duration-500 shadow-inner"
                style={{ width: `${hpPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-black text-slate-950/90">
                HP 100%
              </div>
            </div>

            {/* Gold Star EXP / Score Bar */}
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-amber-400 text-xs drop-shadow leading-none">★</span>
              <div className="relative flex-1 h-2 rounded-full bg-slate-950/80 border border-amber-500/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300"
                  style={{ width: `${Math.max(12, xpPercent)}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-amber-300 font-bold leading-none">
                {profile.xp}/{profile.maxXp}
              </span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* TOP-CENTER: REGION BANNER & NAVIGATION ARROW GUIDE */}
        {/* Directly guides the player to the next game        */}
        {/* -------------------------------------------------- */}
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* Region and Location Pill with KEMBALI button */}
          <div className="flex items-center gap-2">
            {onReturnToRegionEntrance && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onReturnToRegionEntrance();
                }}
                title="Kembali ke Ilustrasi Wilayah"
                className="px-3 py-1 rounded-full bg-slate-950/90 hover:bg-purple-950 text-purple-200 hover:text-white border border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.4)] flex items-center gap-1 text-[11px] font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>◀</span>
                <span>KEMBALI</span>
              </button>
            )}
            <button
              onClick={() => {
                soundEffects.playClick();
                if (onOpenRegionMap) onOpenRegionMap();
              }}
              title="Buka Peta Taktikal Wilayah (2D)"
              className="hidden sm:flex px-4 py-1 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-amber-500/60 shadow-[0_0_15px_rgba(250,204,21,0.3)] items-center gap-2 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-amber-200">{currentRegion.name}</span>
              <span className="text-amber-500/60">•</span>
              <span className="text-white font-medium">
                {profile.currentLocationName || currentSublocation?.name || 'Dataran Mesej'}
              </span>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-black tracking-wider">
                PETA 2D
              </span>
            </button>
          </div>

          {/* Dynamic Next Game Directional Guidance Arrow Badge */}
          {targetDestination && (
            <div
              onClick={() => {
                if (distance <= 5) {
                  soundEffects.playClick();
                  onTriggerActiveActivity();
                }
              }}
              className={`px-3 py-1 sm:py-1.5 rounded-2xl bg-gradient-to-r from-slate-950/95 via-purple-950/90 to-slate-950/95 border-2 ${
                distance <= 5
                  ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] cursor-pointer hover:scale-105'
                  : 'border-amber-400/90 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
              } flex items-center gap-2.5 transition-all animate-fadeIn`}
            >
              {/* Rotating Compass Arrow Icon */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-amber-400/80 flex items-center justify-center shadow-inner shrink-0">
                <div
                  style={{
                    transform: `rotate(${relativeDeg}deg)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 fill-amber-400 drop-shadow" />
                </div>
              </div>

              {/* Text Information */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    {distance <= 5 ? '🎯 TIBA DI LOKASI!' : '➔ KE PERMAINAN SETERUSNYA:'}
                  </span>
                  <span className="font-mono text-[10px] font-extrabold text-cyan-300 bg-cyan-950/70 px-1.5 py-0.2 rounded border border-cyan-500/40">
                    {distance}m
                  </span>
                </div>
                <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[210px]">
                  {targetDestination.name}
                </span>
              </div>

              {distance <= 5 && (
                <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-lg shadow animate-pulse">
                  MULA
                </span>
              )}
            </div>
          )}
        </div>

        {/* -------------------------------------------------- */}
        {/* TOP-RIGHT: 4 CIRCULAR FANTASY ICONS + RADAR MINIMAP*/}
        {/* Exactly matching Image F & Image G                 */}
        {/* -------------------------------------------------- */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Action Button 1: Book / Koleksi Bahasa */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onOpenCollection) {
                onOpenCollection();
              } else {
                onOpenSystemMenu();
              }
            }}
            title="Koleksi Bahasa (Glosari Baku)"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-indigo-900 to-purple-950 border-2 border-amber-400/90 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-amber-200 transition-colors" />
          </button>

          {/* Quick Action Button 2: Bag / Inventori */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onOpenInventory) {
                onOpenInventory();
              } else {
                onOpenSystemMenu();
              }
            }}
            title="Inventori & Beg Wira"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-amber-900 to-yellow-950 border-2 border-amber-400/90 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <Backpack className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-amber-200 transition-colors" />
          </button>

          {/* Quick Action Button 3: Users / Misi & Cabaran */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenContentManager();
            }}
            title="Editor Soalan & Misi (Mod Guru)"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-purple-900 to-slate-950 border-2 border-amber-400/90 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-amber-200 transition-colors" />
          </button>

          {/* Quick Action Button 4: Gear / Tetapan & Menu Sistem */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setNavMenuOpen(true);
            }}
            title="Menu Navigasi & Tetapan Permainan"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-slate-850 to-slate-950 border-2 border-amber-400/90 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* Quick Action Button 5: Fullscreen Landscape Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh (Mod Melintang)'}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-cyan-950 to-slate-950 border-2 border-cyan-400/90 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-cyan-200 transition-colors" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-cyan-200 transition-colors" />
            )}
          </button>

          {/* Circular Radar Minimap (Top-Right position matching Image F & G) */}
          <div className="relative ml-1">
            <Minimap
              playerCoords={playerCoords}
              playerRotationY={playerRotationY}
              sublocations={currentRegion.sublocations}
              currentLocationId={profile.currentLocationId}
              targetDestinationId={profile.targetDestinationId}
              completedActivities={profile.completedActivities}
              unlockedLocations={profile.unlockedLocations}
              npcs={nearbyNpcs}
              onOpenFullMap={onOpenRegionMap || onOpenWorldMap}
            />
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MID-RIGHT: GUIDED QUEST TRACKER PANEL                */}
      {/* ==================================================== */}
      <div className="self-end pointer-events-auto max-w-xs sm:max-w-sm mt-3 p-3 sm:p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/50 shadow-2xl space-y-1.5 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentRegion.name.toUpperCase()}</span>
          </div>
          <button
            onClick={() => setQuestTrackerCollapsed(!questTrackerCollapsed)}
            className="p-1 rounded text-amber-400 hover:text-amber-200"
          >
            {questTrackerCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!questTrackerCollapsed && (
          <>
            <div className="space-y-1 text-xs">
              <div className="text-slate-300">
                <span className="text-slate-400">Lokasi Semasa: </span>
                <strong className="text-amber-300">{profile.currentLocationName}</strong>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Objektif: </span>
                <span className="font-semibold text-white">
                  {activeQuestion?.title || 'Selesaikan tugasan bahasa'}
                </span>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Kemajuan: </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {profile.completedActivities.includes(activeQuestion?.id || '')
                    ? '1/1 Aktiviti Selesai ✓'
                    : '0/1 Belum Selesai'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 capitalize truncate">
                {activeQuestion?.activityType.replace('_', ' ') || 'Penerokaan'}
              </span>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onTriggerActiveActivity();
                }}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-[11px] shadow transition-all transform hover:scale-105 active:scale-95"
              >
                Mula Misi
              </button>
            </div>
          </>
        )}
      </div>

      {/* ==================================================== */}
      {/* BOTTOM CENTER: ORNATE RIBBON BADGE                   */}
      {/* "[4] Dunia Permainan (In-Game 3D)"                   */}
      {/* Exact replica of Image F & Image G                   */}
      {/* ==================================================== */}
      <div className="self-center pointer-events-auto flex flex-col items-center gap-2 mb-2">
        {/* Ribbon Badge */}
        <div className="relative flex items-center shadow-[0_0_30px_rgba(250,204,21,0.5)]">
          {/* Outer Golden Number Ring (4) */}
          <div className="relative -mr-3 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center border border-yellow-200">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-purple-950 to-indigo-950 flex items-center justify-center border border-amber-300/60 shadow-inner">
              <span className="text-xl sm:text-2xl font-serif font-black text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                4
              </span>
            </div>
          </div>

          {/* Royal Purple & Gold Filigree Ribbon Plate */}
          <div className="relative pl-6 pr-6 sm:pr-8 py-1.5 sm:py-2 rounded-r-2xl rounded-l-md bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border-y-2 border-r-2 border-amber-400/90 shadow-2xl flex items-center gap-2 backdrop-blur-md">
            {/* Subtle decorative gold diamond marker */}
            <span className="text-amber-400 text-xs">✦</span>
            <span className="font-serif text-sm sm:text-base font-bold text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text tracking-wide drop-shadow">
              Dunia Permainan (In-Game 3D)
            </span>
            <span className="text-amber-400 text-xs">✦</span>
          </div>
        </div>

        {/* Collapsible Keyboard Controls Bar */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="px-2.5 py-0.5 rounded-t bg-slate-950/70 hover:bg-slate-900 text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-all"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3 h-3 text-amber-400" />
                <span>Kawalan</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 text-amber-400" />
                <span>Sembunyi</span>
              </>
            )}
          </button>

          {!isDockCollapsed && (
            <div className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-slate-700/80 shadow-2xl flex items-center gap-3 text-[11px] backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="font-mono px-1 rounded bg-slate-800 text-amber-400 font-bold text-[10px]">
                  W A S D
                </span>
                <span>Gerak</span>
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="font-mono px-1 rounded bg-slate-800 text-amber-400 font-bold text-[10px]">
                  E
                </span>
                <span>Interaksi</span>
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="font-mono px-1 rounded bg-slate-800 text-yellow-400 font-bold text-[10px]">
                  Space
                </span>
                <span>Lompat</span>
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="font-mono px-1 rounded bg-slate-800 text-cyan-400 font-bold text-[10px]">
                  M
                </span>
                <span>Peta</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* RPG 3D NAVIGATION MENU MODAL                         */}
      {/* ==================================================== */}
      {navMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none pointer-events-auto">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/80 rounded-3xl shadow-2xl p-6 text-white space-y-4">
            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                {currentRegion.name}
              </span>
              <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                MENU NAVIGASI 3D
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* BUTTON: TUKAR WATAK UTAMA */}
              {onChangeHero && (
                <button
                  onClick={() => {
                    setNavMenuOpen(false);
                    onChangeHero();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 font-black text-xs flex items-center justify-between transition-all transform hover:scale-[1.02] shadow-lg border border-amber-300"
                >
                  <span>✦ TUKAR WATAK UTAMA (WIRA LELAKI / PEREMPUAN)</span>
                  <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}

              {/* BUTTON 1: KEMBALI KE MOD ILUSTRASI */}
              {onReturnToRegionEntrance && (
                <button
                  onClick={() => {
                    setNavMenuOpen(false);
                    onReturnToRegionEntrance();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-500/50 font-bold text-xs flex items-center justify-between transition-all transform hover:scale-[1.02]"
                >
                  <span>1. KEMBALI KE MOD ILUSTRASI</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </button>
              )}

              {/* BUTTON: PETA TAKTIKAL WILAYAH (2D) */}
              {onOpenRegionMap && (
                <button
                  onClick={() => {
                    setNavMenuOpen(false);
                    onOpenRegionMap();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-950/90 to-teal-950/90 hover:from-emerald-900 text-emerald-200 hover:text-white border border-emerald-500/50 font-bold text-xs flex items-center justify-between transition-all transform hover:scale-[1.02] shadow-md"
                >
                  <span>✦ PETA TAKTIKAL WILAYAH (2D INTERAKTIF)</span>
                  <Map className="w-4 h-4 text-emerald-400" />
                </button>
              )}

              {/* BUTTON 2: KEMBALI KE PETA PENGEMBARAAN */}
              <button
                onClick={() => {
                  setNavMenuOpen(false);
                  onOpenWorldMap();
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-950/90 hover:bg-blue-900 text-blue-200 hover:text-white border border-blue-500/50 font-bold text-xs flex items-center justify-between transition-all transform hover:scale-[1.02]"
              >
                <span>2. KEMBALI KE PETA PENGEMBARAAN</span>
                <Map className="w-4 h-4 text-blue-400" />
              </button>

              {/* BUTTON: EDITOR SOALAN (MOD GURU) */}
              <button
                onClick={() => {
                  setNavMenuOpen(false);
                  onOpenContentManager();
                }}
                className="w-full py-3 px-4 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 text-indigo-200 hover:text-white border border-indigo-500/50 font-bold text-xs flex items-center justify-between transition-all transform hover:scale-[1.02]"
              >
                <span>3. EDITOR SOALAN & MISI (MOD GURU)</span>
                <span className="text-base">🎓</span>
              </button>

              {/* BUTTON: SKRIN PENUH (MOD MELINTANG) */}
              <button
                onClick={() => {
                  setNavMenuOpen(false);
                  toggleFullscreen();
                }}
                className="w-full py-3 px-4 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 hover:text-white border border-cyan-500/50 font-bold text-xs flex items-center justify-between transition-all transform hover:scale-[1.02]"
              >
                <span>{isFullscreen ? 'KELUAR SKRIN PENUH' : 'SKRIN PENUH (MOD MELINTANG)'}</span>
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              {/* BUTTON: PANDUAN PERMAINAN */}
              <button
                onClick={() => {
                  setNavMenuOpen(false);
                  onOpenTutorial();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center justify-between transition-all transform hover:scale-[1.02]"
              >
                <span>4. PANDUAN PERMAINAN</span>
                <HelpCircle className="w-4 h-4 text-amber-400" />
              </button>

              {/* BUTTON: KEMBALI KE MENU UTAMA */}
              {onReturnToMainMenu && (
                <button
                  onClick={() => {
                    setNavMenuOpen(false);
                    onReturnToMainMenu();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 hover:text-white border border-rose-500/50 font-bold text-xs flex items-center justify-between transition-all transform hover:scale-[1.02]"
                >
                  <span>5. KEMBALI KE MENU UTAMA</span>
                  <Compass className="w-4 h-4 text-rose-400" />
                </button>
              )}

              {/* BUTTON: SAMBUNG PENGEMBARAAN */}
              <button
                onClick={() => setNavMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all transform hover:scale-[1.02] border-2 border-amber-300"
              >
                <span>SAMBUNG PENGEMBARAAN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
