/**
 * BAKUWIRA: Full-Screen Region Illustration Mode (Mod Ilustrasi Penuh Wilayah)
 * 
 * Implements Sections 4, 5, 6, 7, 8, 9, 10, 11, 14:
 * - Dedicated full-screen illustration interface for all 5 regions
 * - Uses exact uploaded illustrations in responsive 16:9 cinematic scaling
 * - Preserves original characters and visual identity without distortion
 * - Lightweight animations: falling sakura petals, glowing particles, soft magical lighting, camera parallax
 * - Interactive fantasy RPG mission location markers:
 *   * Small elegant gold & purple markers displaying location name, mission name, status
 *   * Information panel on click: Nama Tempat, Nama Misi, Objektif Misi, Status Misi
 *   * Button: "TEROKA KAWASAN RPG 3D"
 * - Navigation Buttons:
 *   1. "TEROKA KAWASAN RPG 3D"
 *   2. "KEMBALI KE PETA PENGEMBARAAN"
 *   3. "KEMBALI KE MENU UTAMA"
 */

import React, { useState } from 'react';
import { RegionInfo, MissionQuestion, SubLocationInfo } from '../../types/game';
import { soundEffects } from '../../utils/audioEffects';
import { SakuraParticlesCanvas } from '../effects/SakuraParticlesCanvas';
import {
  Compass,
  Map,
  ArrowLeft,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  Play,
  RotateCw,
  Home,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface AnimatedRegionEntranceProps {
  region: RegionInfo;
  activeQuestion?: MissionQuestion;
  allQuestions?: MissionQuestion[];
  completedActivities: string[];
  onEnterPlayable3D: (sublocationId?: string) => void;
  onReturnToMap: () => void;
  onReturnToMainMenu: () => void;
}

export const AnimatedRegionEntrance: React.FC<AnimatedRegionEntranceProps> = ({
  region,
  activeQuestion,
  allQuestions = [],
  completedActivities = [],
  onEnterPlayable3D,
  onReturnToMap,
  onReturnToMainMenu,
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [selectedSublocation, setSelectedSublocation] = useState<SubLocationInfo | null>(
    region.sublocations[0] || null
  );

  // Subtle interactive parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight } = currentTarget;
    const x = (clientX / clientWidth - 0.5) * 14;
    const y = (clientY / clientHeight - 0.5) * 10;
    setMouseOffset({ x, y });
  };

  // Helper to retrieve matched mission question for a sublocation
  const getSublocationQuestion = (sub: SubLocationInfo): MissionQuestion | undefined => {
    return allQuestions.find((q) => q.id === sub.activityId);
  };

  // Pin positions for each region (tuned to avoid blocking character faces on left/right)
  const getMarkerPosition = (sub: SubLocationInfo, index: number, total: number) => {
    if (region.id === 'kota_media') {
      // 1. Dataran Mesej, 2. Pusat Komunikasi, 3. Lorong Singkatan, 4. Menara Hologram
      const coords = [
        { x: 50, y: 58 },
        { x: 26, y: 40 },
        { x: 74, y: 40 },
        { x: 50, y: 22 },
      ];
      return coords[index] || { x: 50, y: 45 };
    }
    if (region.id === 'akademi') {
      // 1. Dewan Bukti, 2. Perpustakaan Misteri, 3. Makmal Kata, 4. Menara Pemerhatian
      const coords = [
        { x: 50, y: 56 },
        { x: 26, y: 38 },
        { x: 74, y: 38 },
        { x: 50, y: 20 },
      ];
      return coords[index] || { x: 50, y: 45 };
    }
    if (region.id === 'bengkel') {
      // 1. Mesin Susun Ayat, 2. Dewan Penulis, 3. Perpustakaan Kosa Kata, 4. Taman Pena
      const coords = [
        { x: 50, y: 55 },
        { x: 28, y: 42 },
        { x: 72, y: 42 },
        { x: 50, y: 24 },
      ];
      return coords[index] || { x: 50, y: 45 };
    }
    if (region.id === 'kampung') {
      // 1. Sekolah Harmoni, 2. Pasar Komuniti, 3. Balai Penduduk, 4. Pentas Bicara
      const coords = [
        { x: 50, y: 54 },
        { x: 26, y: 38 },
        { x: 74, y: 38 },
        { x: 50, y: 22 },
      ];
      return coords[index] || { x: 50, y: 45 };
    }
    // Region 5: Istana Wira Bahasa (5 markers)
    // 1. Dewan Diraja, 2. Galeri Kristal, 3. Pentas Pengucapan, 4. Balairung Bahasa, 5. Cabaran Penamat
    const coords = [
      { x: 38, y: 56 },
      { x: 62, y: 56 },
      { x: 26, y: 38 },
      { x: 74, y: 38 },
      { x: 50, y: 18 },
    ];
    return coords[index] || { x: 50, y: 45 };
  };

  const activeQuestionForSelected = selectedSublocation
    ? getSublocationQuestion(selectedSublocation)
    : undefined;

  const isSelectedCompleted = selectedSublocation
    ? completedActivities.includes(selectedSublocation.activityId)
    : false;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white select-none overflow-hidden animate-fadeIn"
    >
      {/* 16:9 Presentation Frame (Preserves original illustration composition) */}
      <div className="relative w-full max-w-[1920px] max-h-screen aspect-[16/9] overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Layer 1: Official Region Image with subtle parallax & floating breath */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transform transition-transform duration-700 ease-out animate-breathe"
          style={{
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) scale(1.03)`,
          }}
        >
          <img
            src={region.image}
            alt={region.name}
            className="w-full h-full object-cover"
          />
          {/* Subtle cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40" />
        </div>

        {/* Layer 2: Falling Sakura Petals & Magic Particles */}
        <SakuraParticlesCanvas interactive={true} />

        {/* Layer 3: Interactive Fantasy RPG Mission Location Markers */}
        <div className="absolute inset-0 pointer-events-auto z-20">
          {region.sublocations.map((sub, idx) => {
            const pos = getMarkerPosition(sub, idx, region.sublocations.length);
            const isCompleted = completedActivities.includes(sub.activityId);
            const isSelected = selectedSublocation?.id === sub.id;
            const q = getSublocationQuestion(sub);

            return (
              <div
                key={sub.id}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20"
              >
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedSublocation(sub);
                  }}
                  onMouseEnter={() => soundEffects.playHover()}
                  className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl ${
                    isSelected
                      ? 'bg-amber-500/95 text-slate-950 border-2 border-yellow-200 ring-4 ring-amber-400/40'
                      : isCompleted
                      ? 'bg-slate-950/85 text-emerald-300 border-2 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                      : 'bg-slate-950/85 text-amber-200 border-2 border-amber-400/80 hover:border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.6)]'
                  }`}
                  title={sub.name}
                >
                  {/* Order Number Badge */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shadow-md shrink-0 ${
                      isSelected
                        ? 'bg-slate-950 text-amber-300'
                        : isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950'
                    }`}
                  >
                    {isCompleted ? '✓' : sub.order}
                  </div>

                  {/* Marker Text & Mission Tag */}
                  <div className="text-left flex flex-col justify-center max-w-[130px] sm:max-w-[160px]">
                    <span className="text-[11px] font-black truncate leading-tight uppercase tracking-wide">
                      {sub.name}
                    </span>
                    <span
                      className={`text-[9px] font-semibold truncate leading-tight ${
                        isSelected
                          ? 'text-slate-900'
                          : isCompleted
                          ? 'text-emerald-400'
                          : 'text-amber-300/90'
                      }`}
                    >
                      {q?.title ? `Misi: ${q.title}` : `NPC: ${sub.primaryNpc}`}
                    </span>
                  </div>

                  {/* Pulsing Target Dot */}
                  <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Layer 4: Top Bar (Region Info & Direct Return Buttons) */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-30 pointer-events-auto flex items-center justify-between gap-4">
          {/* Region Title & Crystal Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/40 border-2 border-amber-200 text-slate-950 font-black shrink-0">
              {region.orderNumber}
            </div>
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/50 text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>WILAYAH KE-{region.orderNumber} • {region.crystalName}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-transparent bg-gradient-to-r from-white via-amber-200 to-yellow-400 bg-clip-text drop-shadow-md">
                {region.name.toUpperCase()}
              </h1>
            </div>
          </div>

          {/* Top Navigation Buttons (Section 14) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                onReturnToMap();
              }}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 shadow-lg text-xs font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              title="Kembali ke Peta Pengembaraan"
            >
              <Map className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">KEMBALI KE PETA PENGEMBARAAN</span>
              <span className="sm:hidden">Peta</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onReturnToMainMenu();
              }}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 shadow-lg text-xs font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              title="Kembali ke Menu Utama"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">KEMBALI KE MENU UTAMA</span>
              <span className="sm:hidden">Menu</span>
            </button>
          </div>
        </div>

        {/* Layer 5: Mission Location Details Panel & Primary Exploration Action */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-30 pointer-events-auto flex flex-col items-center">
          {selectedSublocation ? (
            <div className="w-full max-w-3xl p-4 sm:p-5 rounded-3xl bg-slate-950/90 backdrop-blur-md border-2 border-amber-500/50 shadow-2xl space-y-3 animate-fadeIn">
              {/* Selected Sublocation Header & Status */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-sm flex items-center justify-center">
                    {selectedSublocation.order}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      1. NAMA TEMPAT
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {selectedSublocation.name.toUpperCase()}
                    </h3>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                    4. STATUS MISI:
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 ${
                      isSelectedCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {isSelectedCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Selesai ✓</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>Sedia Diteroka</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Mission Name & Objective Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block mb-0.5">
                    2. NAMA MISI:
                  </span>
                  <p className="font-bold text-slate-100 text-xs sm:text-sm">
                    {activeQuestionForSelected?.missionTitle ||
                      `Misi di ${selectedSublocation.name}`}
                  </p>
                  <span className="text-[10px] text-cyan-300 font-mono mt-1 block">
                    NPC Pembimbing: {selectedSublocation.primaryNpc}
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block mb-0.5">
                    3. OBJEKTIF MISI:
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                    {activeQuestionForSelected?.prompt ||
                      selectedSublocation.description}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS: 1. TEROKA KAWASAN RPG 3D, 2. KEMBALI KE PETA, 3. KEMBALI KE MENU */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  onClick={() => {
                    soundEffects.playFanfare();
                    onEnterPlayable3D(selectedSublocation.id);
                  }}
                  className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-amber-200"
                >
                  <Compass className="w-4 h-4 stroke-[2.5]" />
                  <span>TEROKA LOKASI (3D)</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onReturnToMap();
                    }}
                    className="flex-1 sm:flex-initial py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
                  >
                    KEMBALI KE PETA PENGEMBARAAN
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onReturnToMainMenu();
                    }}
                    className="flex-1 sm:flex-initial py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
                  >
                    KEMBALI KE MENU UTAMA
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Button if no marker is actively clicked */
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundEffects.playFanfare();
                  onEnterPlayable3D();
                }}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wide shadow-2xl flex items-center gap-2.5 border-2 border-amber-200 transition-all transform hover:scale-105 active:scale-95"
              >
                <Compass className="w-5 h-5 stroke-[2.5]" />
                <span>TEROKA LOKASI (3D)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
