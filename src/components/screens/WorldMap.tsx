/**
 * BAKUWIRA: Interactive World Map & Detailed Location Maps
 * Implements Part 2 & Part 3 with the user's uploaded artwork:
 * /public/assets/aistudio/PETA_LOKASI_5e53326a.jpeg
 * 
 * Features:
 * - 5 regions connected in sequence (1. Kota Media Sosial -> 2. Akademi -> 3. Bengkel -> 4. Kampung -> 5. Istana)
 * - Detailed Location Sub-maps with 4 sublocations per region
 * - Navigation waypoint destination setter ("Tetapkan Destinasi")
 * - Zoom controls, stats, crystals, completion rates, locked indicators
 */

import React, { useState } from 'react';
import { REGIONS_DATA } from '../../data/missionBank';
import { RegionId, RegionInfo, SubLocationInfo } from '../../types/game';
import {
  MapPin,
  Navigation,
  ArrowLeft,
  X,
  Compass,
  Sparkles,
  CheckCircle2,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

interface WorldMapProps {
  currentRegion: RegionId;
  currentLocationId: string;
  unlockedRegions: RegionId[];
  unlockedLocations: string[];
  completedActivities: string[];
  collectedCrystals: string[];
  targetDestinationId?: string;
  onSelectRegionAndLocation: (regionId: RegionId, locationId: string) => void;
  onSetDestination: (locationId: string) => void;
  onBack: () => void;
  onSelectRegion?: (region: RegionInfo) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentRegion,
  currentLocationId,
  unlockedRegions,
  unlockedLocations,
  completedActivities,
  collectedCrystals,
  targetDestinationId,
  onSelectRegionAndLocation,
  onSetDestination,
  onBack,
  onSelectRegion,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>(currentRegion);
  const [selectedSublocationId, setSelectedSublocationId] = useState<string>(currentLocationId);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'world' | 'sublocation'>('world');

  const selectedRegion = REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];

  const isRegionUnlocked = (rId: RegionId) => unlockedRegions.includes(rId);
  const isLocationUnlocked = (locId: string) => unlockedLocations.includes(locId);

  // Calculate completion percentage for a region
  const getRegionProgress = (region: RegionInfo) => {
    const totalActivities = region.sublocations.length;
    let completed = 0;
    for (const sub of region.sublocations) {
      if (completedActivities.includes(sub.activityId)) {
        completed++;
      }
    }
    const percent = Math.round((completed / Math.max(1, totalActivities)) * 100);
    return { completed, total: totalActivities, percent };
  };

  const handleRegionClick = (reg: RegionInfo) => {
    setSelectedRegionId(reg.id);
    setSelectedSublocationId(reg.sublocations[0].id);
    if (onSelectRegion) {
      onSelectRegion(reg);
    } else {
      setViewMode('sublocation');
    }
  };

  const handleSetDestinationClick = (sub: SubLocationInfo) => {
    onSetDestination(sub.id);
  };

  const handleTravelToSublocation = (sub: SubLocationInfo) => {
    if (!isLocationUnlocked(sub.id)) return;
    onSelectRegionAndLocation(selectedRegionId, sub.id);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-white select-none overflow-hidden animate-fadeIn">
      {/* Top Map Navigation Bar */}
      <div className="h-14 sm:h-16 px-4 sm:px-6 bg-slate-900/95 border-b border-amber-500/30 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={viewMode === 'sublocation' ? () => setViewMode('world') : onBack}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{viewMode === 'sublocation' ? 'Kembali ke Peta Dunia' : 'Kembali ke Menu Utama'}</span>
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-black tracking-wide text-transparent bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text">
              {viewMode === 'world' ? 'PETA DUNIA BAKUWIRA' : `PETA LOKASI — ${selectedRegion.name.toUpperCase()}`}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400">
              {viewMode === 'world'
                ? 'Laluan Berpandu Lima Wilayah Komunikasi'
                : selectedRegion.tagline}
            </p>
          </div>
        </div>

        {/* View Switcher & Zoom */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zum Keluar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zum Masuk"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'world' ? 'sublocation' : 'world')}
            className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs font-bold text-indigo-200 flex items-center gap-1.5 hover:bg-indigo-900 transition-colors"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">
              {viewMode === 'world' ? 'Lihat Sublokasi' : 'Peta Penuh'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas View */}
      <div className="relative flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950">
        {/* World Map View using PETA_LOKASI artwork */}
        {viewMode === 'world' ? (
          <div
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            {/* The Original Anime Fantasy World Map Image */}
            <img
              src="/assets/aistudio/PETA_LOKASI_5e53326a.jpeg"
              alt="Peta Lokasi Dunia BAKUWIRA"
              className="w-full h-auto object-cover block select-none pointer-events-none"
            />

            {/* Interactive Region Hotspot Pins */}
            {REGIONS_DATA.map((region) => {
              const unlocked = isRegionUnlocked(region.id);
              const isCurrent = currentRegion === region.id;
              const { completed, total, percent } = getRegionProgress(region);
              const hasCrystal = collectedCrystals.includes(region.crystalName);

              return (
                <div
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                  style={{ left: `${region.mapCoords.x}%`, top: `${region.mapCoords.y}%` }}
                >
                  {/* Glowing Pulse Ring for Active Region */}
                  {isCurrent && (
                    <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Node Card */}
                  <div
                    className={`px-3 py-1.5 rounded-2xl border shadow-2xl flex items-center gap-2 transition-all transform group-hover:scale-110 ${
                      isCurrent
                        ? 'bg-slate-950/95 border-amber-400 ring-2 ring-amber-400/40 text-white'
                        : unlocked
                        ? 'bg-slate-950/90 border-slate-700 text-slate-200 hover:border-amber-400/70'
                        : 'bg-slate-950/80 border-slate-800 text-slate-500 opacity-80'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs text-white shadow"
                      style={{ backgroundColor: region.color }}
                    >
                      {region.orderNumber}
                    </span>

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate max-w-[130px]">
                          {region.name}
                        </span>
                        {!unlocked && <Lock className="w-3 h-3 text-slate-500 shrink-0" />}
                        {hasCrystal && <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>
                          {completed}/{total} Lokasi
                        </span>
                        <span>•</span>
                        <span className={percent === 100 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                          {percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Detailed Sublocation Map for the Selected Region */
          <div className="w-full max-w-4xl bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn">
            {/* Official Region Artwork Banner */}
            <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl group">
              <img
                src={selectedRegion.image}
                alt={selectedRegion.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded font-black text-slate-950" style={{ backgroundColor: selectedRegion.color }}>
                      WILAYAH {selectedRegion.orderNumber}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow">{selectedRegion.name}</h3>
                  </div>
                  <p className="text-xs text-slate-200">{selectedRegion.tagline}</p>
                </div>
                {onSelectRegion && (
                  <button
                    onClick={() => onSelectRegion(selectedRegion)}
                    className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs shadow-xl border border-yellow-200 flex items-center gap-1.5 transition-all transform hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mod Ilustrasi Penuh</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                  {selectedRegion.icon}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Peta 4 Sublokasi Teroka</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedRegion.description}</p>
                </div>
              </div>

              {/* Crystal Award Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-lg">{selectedRegion.crystalIcon}</span>
                <span className="text-slate-300 font-semibold">{selectedRegion.crystalName}</span>
                {collectedCrystals.includes(selectedRegion.crystalName) ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-amber-400 font-bold">(Belum Dituntut)</span>
                )}
              </div>
            </div>

            {/* 4 Sublocations in Guided Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRegion.sublocations.map((sub, idx) => {
                const unlocked = isLocationUnlocked(sub.id);
                const isCurrentLoc = currentLocationId === sub.id && currentRegion === selectedRegion.id;
                const isTarget = targetDestinationId === sub.id;
                const isCompleted = completedActivities.includes(sub.activityId);

                return (
                  <div
                    key={sub.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isCurrentLoc
                        ? 'bg-slate-950 border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                        : isTarget
                        ? 'bg-indigo-950/70 border-indigo-400 shadow-lg'
                        : unlocked
                        ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold font-mono text-xs text-amber-400 shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                            <span>{sub.name}</span>
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            NPC: <strong className="text-amber-300">{sub.primaryNpc}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      {isCurrentLoc ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                          Lokasi Semasa
                        </span>
                      ) : isTarget ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500 text-white font-black animate-pulse">
                          Destinasi Aktif
                        </span>
                      ) : !unlocked ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3" />
                          <span>Terkunci</span>
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {sub.description}
                    </p>

                    {/* Action Buttons for this sublocation */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleSetDestinationClick(sub)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isTarget
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{isTarget ? 'Destinasi Ditetapkan' : 'Tetapkan Destinasi'}</span>
                      </button>

                      {unlocked && (
                        <button
                          onClick={() => handleTravelToSublocation(sub)}
                          className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <span>Kembara</span>
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="h-12 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            Peta Lokasi Berpandu: <strong>5 Wilayah</strong> • <strong>20 Sublokasi</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-300">
            Kristal Dikumpul: <strong className="text-amber-400">{collectedCrystals.length} / 5</strong>
          </span>
          <button
            onClick={onBack}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
          >
            Tutup Peta
          </button>
        </div>
      </div>
    </div>
  );
};
