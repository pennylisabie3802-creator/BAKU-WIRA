/**
 * BAKUWIRA: RegionMapModal Component
 * Stylized, interactive 2D regional tactical map for each of the five official regions:
 * 1. Kota Media Sosial (Cyberpunk Sakura Grid)
 * 2. Akademi Detektif Bahasa (Celestial Arcane Blueprint)
 * 3. Bengkel Bahasa Melayu (Artisanal Timber & Cog Blueprint)
 * 4. Kampung Komunikasi (Riverside Village Map)
 * 5. Istana Wira Bahasa (Golden Crystal Sanctum)
 *
 * Features:
 * - Highlights 4 (or 5) sublocations with custom icons, completion badges, and quest markers
 * - Real-time Player Position locator with directional compass cone and coordinates
 * - Active Target Destination Waypoint with pulsating navigation beacon
 * - Interactive node selection with detailed district briefing and distance calculation
 * - "TETAPKAN DESTINASI" action to guide 3D navigation
 * - "TEROKA LOKASI" fast travel action
 * - Region switcher tabs allowing inspection of all five regions
 */

import React, { useState, useMemo } from 'react';
import {
  RegionId,
  SubLocationInfo,
  PlayerProfile,
  MissionQuestion,
} from '../../types/game';
import { REGIONS_DATA } from '../../data/missionBank';
import { soundEffects } from '../../utils/audioEffects';
import {
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  Lock,
  Sparkles,
  Users,
  X,
  Crosshair,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Globe2,
  BookOpen,
  ArrowRight,
  Flame,
} from 'lucide-react';

export interface RegionMapModalProps {
  currentRegionId: RegionId;
  playerCoords: [number, number, number];
  playerRotationY?: number;
  profile: PlayerProfile;
  activeQuestion?: MissionQuestion;
  onClose: () => void;
  onSetDestination: (sublocationId: string) => void;
  onFastTravel?: (sublocation: SubLocationInfo, regionId: RegionId) => void;
  onOpenWorldMap?: () => void;
}

export const RegionMapModal: React.FC<RegionMapModalProps> = ({
  currentRegionId,
  playerCoords,
  playerRotationY = 0,
  profile,
  activeQuestion,
  onClose,
  onSetDestination,
  onFastTravel,
  onOpenWorldMap,
}) => {
  // Selected region tab (defaults to player's current region)
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>(currentRegionId);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  const regionData = useMemo(() => {
    return REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];
  }, [selectedRegionId]);

  const isPlayerInSelectedRegion = currentRegionId === selectedRegionId;

  // Selected sublocation in drawer (default to target destination or first sublocation)
  const [selectedSublocationId, setSelectedSublocationId] = useState<string>(() => {
    if (isPlayerInSelectedRegion && profile.targetDestinationId) {
      return profile.targetDestinationId;
    }
    return regionData.sublocations[0].id;
  });

  const selectedSublocation = useMemo(() => {
    return (
      regionData.sublocations.find((s) => s.id === selectedSublocationId) ||
      regionData.sublocations[0]
    );
  }, [regionData, selectedSublocationId]);

  // World coordinates to 2D SVG canvas projection
  // Canvas coordinate system: 700 width x 560 height
  // Center is at (350, 290)
  const svgCenterX = 350;
  const svgCenterY = 290;
  const scale = 6.4; // pixels per world meter

  const toSvgCoords = (wx: number, wz: number) => {
    return {
      x: svgCenterX + wx * scale,
      y: svgCenterY + wz * scale,
    };
  };

  const playerSvgPos = useMemo(() => {
    return toSvgCoords(playerCoords[0], playerCoords[2]);
  }, [playerCoords]);

  // Distance from player to selected sublocation in meters
  const distanceToSelected = useMemo(() => {
    if (!isPlayerInSelectedRegion) return null;
    const [sx, , sz] = selectedSublocation.coordinates;
    const dx = sx - playerCoords[0];
    const dz = sz - playerCoords[2];
    return Math.round(Math.hypot(dx, dz));
  }, [isPlayerInSelectedRegion, playerCoords, selectedSublocation]);

  const handleSelectSublocation = (sub: SubLocationInfo) => {
    soundEffects.playClick();
    setSelectedSublocationId(sub.id);
  };

  const handleSetTargetDestination = () => {
    soundEffects.playFanfare();
    onSetDestination(selectedSublocation.id);
  };

  const handleTeleport = () => {
    soundEffects.playFanfare();
    if (onFastTravel) {
      onFastTravel(selectedSublocation, selectedRegionId);
    }
    onClose();
  };

  // Region-specific visual theme configurations
  const theme = useMemo(() => {
    switch (selectedRegionId) {
      case 'kota_media':
        return {
          bgGradient: 'from-slate-950 via-indigo-950 to-slate-950',
          gridColor: 'rgba(56, 189, 248, 0.12)',
          accentBorder: 'border-cyan-500/60',
          pathColor: '#38bdf8',
          roadStroke: 'rgba(56, 189, 248, 0.35)',
          roadFill: 'rgba(14, 165, 233, 0.08)',
          glowColor: 'rgba(56, 189, 248, 0.4)',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
          subtitle: 'Rangkaian Siber & Dataran Mesej Digital',
        };
      case 'akademi':
        return {
          bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
          gridColor: 'rgba(99, 102, 241, 0.14)',
          accentBorder: 'border-blue-500/60',
          pathColor: '#818cf8',
          roadStroke: 'rgba(99, 102, 241, 0.35)',
          roadFill: 'rgba(79, 70, 229, 0.08)',
          glowColor: 'rgba(99, 102, 241, 0.4)',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
          subtitle: 'Kubu Forensik Sintaksis & Arkib Kitab Agung',
        };
      case 'bengkel':
        return {
          bgGradient: 'from-stone-950 via-amber-950/70 to-stone-900',
          gridColor: 'rgba(245, 158, 11, 0.12)',
          accentBorder: 'border-amber-500/60',
          pathColor: '#f59e0b',
          roadStroke: 'rgba(245, 158, 11, 0.35)',
          roadFill: 'rgba(217, 119, 6, 0.08)',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          subtitle: 'Makmal Penulisan Ajaib & Jentera Tatabahasa',
        };
      case 'kampung':
        return {
          bgGradient: 'from-slate-950 via-emerald-950 to-slate-950',
          gridColor: 'rgba(16, 185, 129, 0.12)',
          accentBorder: 'border-emerald-500/60',
          pathColor: '#10b981',
          roadStroke: 'rgba(16, 185, 129, 0.35)',
          roadFill: 'rgba(5, 150, 105, 0.08)',
          glowColor: 'rgba(16, 185, 129, 0.4)',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          subtitle: 'Perkampungan Sungai & Pusat Adab Kesantunan',
        };
      case 'istana':
      default:
        return {
          bgGradient: 'from-slate-950 via-purple-950 to-amber-950/60',
          gridColor: 'rgba(234, 179, 8, 0.14)',
          accentBorder: 'border-yellow-500/60',
          pathColor: '#eab308',
          roadStroke: 'rgba(234, 179, 8, 0.4)',
          roadFill: 'rgba(202, 138, 4, 0.08)',
          glowColor: 'rgba(234, 179, 8, 0.45)',
          badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
          subtitle: 'Sanctum Mahligai Kristal & Balairung Diraja',
        };
    }
  }, [selectedRegionId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] rounded-3xl bg-slate-950 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        
        {/* ==================================================== */}
        {/* MODAL HEADER: Title, Tabs & Close Button              */}
        {/* ==================================================== */}
        <div className="relative px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-inner text-amber-300 text-xl">
              🗺️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-wide">
                  PETA WILAYAH: {regionData.name.toUpperCase()}
                </h2>
                {isPlayerInSelectedRegion && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black tracking-wider flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    LOKASI ANDA
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {theme.subtitle}
              </p>
            </div>
          </div>

          {/* Region Tabs (All 5 official regions) */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-full">
            {REGIONS_DATA.map((reg) => {
              const isSelected = reg.id === selectedRegionId;
              const isPlayerHere = reg.id === currentRegionId;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedRegionId(reg.id);
                    setSelectedSublocationId(reg.sublocations[0].id);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-lg font-black scale-105'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span>{reg.icon}</span>
                  <span className="hidden md:inline">{reg.name}</span>
                  <span className="md:hidden">W{reg.orderNumber}</span>
                  {isPlayerHere && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5 shadow-sm" title="Anda berada di sini" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Tools & Close */}
          <div className="flex items-center gap-2">
            {onOpenWorldMap && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenWorldMap();
                }}
                className="hidden sm:flex px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="Buka Peta Dunia (Semua 5 Wilayah)"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>PETA DUNIA</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 hover:border-rose-500/60 text-slate-300 flex items-center justify-center transition-all active:scale-95"
              title="Tutup Peta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* MAIN BODY: 2D Interactive Map Canvas + Location Drawer */}
        {/* ==================================================== */}
        <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950">
          
          {/* Map Viewport Area */}
          <div className="relative flex-1 h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
            
            {/* Themed SVG Tactical Map */}
            <svg
              viewBox="0 0 700 560"
              className="w-full h-full max-h-full object-contain cursor-crosshair transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel})`,
              }}
            >
              <defs>
                {/* Background grid pattern */}
                <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme.gridColor} strokeWidth="1" />
                </pattern>

                {/* Road dashed animation */}
                <linearGradient id="road-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.pathColor} stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                </linearGradient>

                {/* Drop shadow filters */}
                <filter id="glow-pin" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base background rect */}
              <rect x="0" y="0" width="700" height="560" fill="#030712" />
              <rect x="0" y="0" width="700" height="560" fill="url(#tactical-grid)" />

              {/* Outer compass boundary ring */}
              <circle cx={svgCenterX} cy={svgCenterY} r="250" fill="none" stroke={theme.gridColor} strokeWidth="1.5" strokeDasharray="6,4" />
              <circle cx={svgCenterX} cy={svgCenterY} r="160" fill="none" stroke={theme.gridColor} strokeWidth="1" strokeDasharray="3,3" />
              <circle cx={svgCenterX} cy={svgCenterY} r="70" fill={theme.roadFill} stroke={theme.pathColor} strokeWidth="1.5" />

              {/* Region-specific scenic ground features */}
              {selectedRegionId === 'kampung' && (
                /* River running across the map */
                <path
                  d="M 50 290 Q 200 270 350 290 T 650 310"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="32"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              )}

              {/* Decorative Concentric Runic Circles at center */}
              <circle cx={svgCenterX} cy={svgCenterY} r="35" fill="none" stroke={theme.pathColor} strokeWidth="2" opacity="0.6" />
              <circle cx={svgCenterX} cy={svgCenterY} r="20" fill="none" stroke={theme.pathColor} strokeWidth="1" strokeDasharray="4,2" />

              {/* Pathways connecting Central Plaza to each Sublocation */}
              {regionData.sublocations.map((sub, idx) => {
                const subCoords = toSvgCoords(sub.coordinates[0], sub.coordinates[2]);
                const isTarget = profile.targetDestinationId === sub.id;

                return (
                  <g key={`path-${sub.id}`}>
                    {/* Broad walkway base */}
                    <line
                      x1={svgCenterX}
                      y1={svgCenterY}
                      x2={subCoords.x}
                      y2={subCoords.y}
                      stroke={theme.roadStroke}
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    {/* Center glowing waypoint pathway */}
                    <line
                      x1={svgCenterX}
                      y1={svgCenterY}
                      x2={subCoords.x}
                      y2={subCoords.y}
                      stroke={isTarget ? '#f59e0b' : theme.pathColor}
                      strokeWidth={isTarget ? '3.5' : '2'}
                      strokeDasharray={isTarget ? '8,4' : '4,4'}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* Inter-sublocation pathways (perimeter ring road) */}
              {regionData.sublocations.length >= 3 && (
                <path
                  d={regionData.sublocations
                    .map((s, i) => {
                      const c = toSvgCoords(s.coordinates[0], s.coordinates[2]);
                      return `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`;
                    })
                    .join(' ') + ' Z'}
                  fill="none"
                  stroke={theme.roadStroke}
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  opacity="0.6"
                />
              )}

              {/* Sublocation Nodes */}
              {regionData.sublocations.map((sub, idx) => {
                const coords = toSvgCoords(sub.coordinates[0], sub.coordinates[2]);
                const isSelected = selectedSublocationId === sub.id;
                const isTarget = profile.targetDestinationId === sub.id;
                const isCompleted = profile.completedActivities.includes(sub.activityId);
                const isUnlocked = profile.unlockedLocations.includes(sub.id);

                return (
                  <g
                    key={sub.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => handleSelectSublocation(sub)}
                  >
                    {/* Outer Target Beacon Wave if this is active target */}
                    {isTarget && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="30"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        className="animate-ping origin-center"
                        style={{ transformOrigin: `${coords.x}px ${coords.y}px` }}
                      />
                    )}

                    {/* Selection halo */}
                    {isSelected && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        strokeDasharray="4,2"
                      />
                    )}

                    {/* Node background circle */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="18"
                      fill={
                        isCompleted
                          ? '#059669'
                          : isTarget
                          ? '#d97706'
                          : isUnlocked
                          ? '#1e293b'
                          : '#0f172a'
                      }
                      stroke={
                        isCompleted
                          ? '#34d399'
                          : isTarget
                          ? '#fde047'
                          : isUnlocked
                          ? theme.pathColor
                          : '#475569'
                      }
                      strokeWidth="2.5"
                      filter="url(#glow-pin)"
                    />

                    {/* Center Icon / Order Number */}
                    <text
                      x={coords.x}
                      y={coords.y + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="sans-serif"
                    >
                      {isCompleted ? '✓' : sub.order}
                    </text>

                    {/* Sublocation Name Tag */}
                    <g transform={`translate(${coords.x}, ${coords.y + 30})`}>
                      <rect
                        x="-60"
                        y="-10"
                        width="120"
                        height="20"
                        rx="10"
                        fill="#020617"
                        stroke={isSelected ? '#facc15' : 'rgba(255,255,255,0.2)'}
                        strokeWidth={isSelected ? '1.5' : '1'}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="bold"
                        fill={isSelected ? '#fde047' : '#f1f5f9'}
                      >
                        {sub.name}
                      </text>
                    </g>

                    {/* Primary NPC Speech Pill */}
                    <g transform={`translate(${coords.x + 16}, ${coords.y - 14})`}>
                      <circle cx="0" cy="0" r="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
                      <text x="0" y="3" textAnchor="middle" fontSize="8">
                        💬
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Player Position Indicator (Only shown if player is inside this region) */}
              {isPlayerInSelectedRegion && (
                <g transform={`translate(${playerSvgPos.x}, ${playerSvgPos.y})`} className="pointer-events-none">
                  {/* Radar ripple rings */}
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="animate-ping" />
                  <circle cx="0" cy="0" r="14" fill="#0891b2" fillOpacity="0.4" stroke="#22d3ee" strokeWidth="2" />

                  {/* Player Orientation Cone (Facing direction) */}
                  <g transform={`rotate(${(playerRotationY * 180) / Math.PI})`}>
                    <polygon points="0,-16 -6,0 6,0" fill="#facc15" stroke="#78350f" strokeWidth="1" />
                  </g>

                  {/* Player Center Jewel */}
                  <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#0e7490" strokeWidth="1.5" />

                  {/* Floating "ANDA" label */}
                  <rect x="-24" y="-32" width="48" height="15" rx="7" fill="#0891b2" stroke="#ffffff" strokeWidth="1" />
                  <text x="0" y="-22" textAnchor="middle" fontSize="8" fontWeight="900" fill="#ffffff">
                    ANDA
                  </text>
                </g>
              )}

              {/* Compass Rose (North / South / East / West) */}
              <g transform="translate(640, 60)" className="pointer-events-none">
                <circle cx="0" cy="0" r="26" fill="#090d16" stroke="rgba(250, 204, 21, 0.5)" strokeWidth="1.5" />
                {/* Needle */}
                <polygon points="0,-18 5,-2 -5,-2" fill="#ef4444" />
                <polygon points="0,18 5,2 -5,2" fill="#94a3b8" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                <text x="0" y="-22" textAnchor="middle" fontSize="10" fontWeight="900" fill="#f87171">
                  U
                </text>
                <text x="0" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#94a3b8">
                  S
                </text>
                <text x="32" y="3" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#94a3b8">
                  T
                </text>
                <text x="-32" y="3" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#94a3b8">
                  B
                </text>
              </g>

              {/* Scale Bar (e.g. 20 meter scale bar) */}
              <g transform="translate(30, 520)" className="pointer-events-none">
                <rect x="0" y="0" width={scale * 20} height="4" fill="#fbbf24" rx="2" />
                <line x1="0" y1="-3" x2="0" y2="7" stroke="#fbbf24" strokeWidth="2" />
                <line x1={scale * 20} y1="-3" x2={scale * 20} y2="7" stroke="#fbbf24" strokeWidth="2" />
                <text x={(scale * 20) / 2} y="-6" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fde68a">
                  Skala: 20 Meter
                </text>
              </g>
            </svg>

            {/* Floating Zoom / Center Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
                className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg transition-all active:scale-95"
                title="Zum Masuk (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg transition-all active:scale-95"
                title="Zum Keluar (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg transition-all active:scale-95"
                title="Reset Zum"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Map Legend Overlay Toggle */}
            <div className="absolute bottom-4 left-4 z-10">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 shadow-md"
              >
                <span>{showLegend ? '▼ Sembunyi Petunjuk' : '▲ Tunjuk Petunjuk'}</span>
              </button>

              {showLegend && (
                <div className="mt-1.5 p-2 rounded-2xl bg-slate-950/95 border border-amber-500/30 shadow-2xl backdrop-blur-md text-[10px] space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white" />
                    <span className="text-slate-300">Lokasi Anda (Pemain)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white animate-pulse" />
                    <span className="text-slate-300">Destinasi Aktif (Waypoint)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[7px] flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-slate-300">Misi Selesai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-cyan-400" />
                    <span className="text-slate-300">Misi Tersedia</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================== */}
          {/* LOCATION DETAILS DRAWER: District Briefing & Actions  */}
          {/* ==================================================== */}
          <div className="w-full lg:w-80 lg:border-l border-t lg:border-t-0 border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-4">
              
              {/* Header Badge: Order & Region */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full border text-[11px] font-black tracking-wider uppercase ${theme.badgeColor}`}>
                  LOKASI #{selectedSublocation.order} DARI {regionData.sublocations.length}
                </span>

                {profile.completedActivities.includes(selectedSublocation.activityId) ? (
                  <span className="flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SELESAI
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-500/40">
                    <Crosshair className="w-3.5 h-3.5" />
                    BELUM SELESAI
                  </span>
                )}
              </div>

              {/* Sublocation Title & Icon */}
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{regionData.icon}</span>
                  <span>{selectedSublocation.name}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedSublocation.description}
                </p>
              </div>

              {/* Distance from player (if in same region) */}
              {isPlayerInSelectedRegion && distanceToSelected !== null && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Jarak dari kedudukan anda:</span>
                  </div>
                  <span className="font-mono text-xs font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                    {distanceToSelected} Meter
                  </span>
                </div>
              )}

              {/* Host NPC Info */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900/60 border border-indigo-400/50 flex items-center justify-center text-lg shadow-inner shrink-0">
                  💬
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                    WATAK PEMBIMBING (NPC)
                  </span>
                  <span className="text-sm font-black text-white">
                    {selectedSublocation.primaryNpc}
                  </span>
                </div>
              </div>

              {/* Activity ID & Status */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Kod Cabaran:</span>
                  <span className="font-mono font-bold text-amber-300">{selectedSublocation.activityId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Koordinat 3D:</span>
                  <span className="font-mono text-slate-300">
                    [{selectedSublocation.coordinates[0]}, {selectedSublocation.coordinates[2]}]
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 space-y-2 pt-4 border-t border-slate-800">
              {/* Button: Set Destination Waypoint */}
              <button
                onClick={handleSetTargetDestination}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Crosshair className="w-4 h-4" />
                <span>TETAPKAN SEBAGAI DESTINASI</span>
              </button>

              {/* Button: Fast Travel / Explore Now */}
              {onFastTravel && (
                <button
                  onClick={handleTeleport}
                  className="w-full py-2 px-4 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 hover:text-white border border-indigo-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>TEROKA LOKASI INI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
