/**
 * BAKUWIRA: Top-Left Minimap Component
 * Implements Part 4:
 * Shows player position, radar direction arrow, nearby NPCs, mission objectives,
 * active destination beacon, custom icons, and "LIHAT PETA" button.
 */

import React from 'react';
import { SubLocationInfo } from '../../types/game';
import { Map, Navigation, Compass } from 'lucide-react';

interface MinimapProps {
  playerCoords: [number, number, number];
  playerRotationY: number;
  sublocations: SubLocationInfo[];
  currentLocationId: string;
  targetDestinationId?: string;
  completedActivities: string[];
  unlockedLocations: string[];
  npcs: { name: string; x: number; z: number }[];
  onOpenFullMap: () => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  playerCoords,
  playerRotationY,
  sublocations,
  currentLocationId,
  targetDestinationId,
  completedActivities,
  unlockedLocations,
  npcs,
  onOpenFullMap,
}) => {
  // Minimap radius in 3D world units (expanded to cover connected districts)
  const mapRange = 52;
  const mapSize = 130; // px
  const center = mapSize / 2;

  // Convert 3D world coords [x, y, z] to minimap 2D coords relative to player
  const toMinimapPos = (wx: number, wz: number) => {
    const dx = wx - playerCoords[0];
    const dz = wz - playerCoords[2];

    const px = center + (dx / mapRange) * (mapSize / 2);
    const py = center + (dz / mapRange) * (mapSize / 2);

    // Clamp to circular edge
    const dist = Math.hypot(px - center, py - center);
    const maxR = mapSize / 2 - 8;
    if (dist > maxR) {
      const angle = Math.atan2(py - center, px - center);
      return {
        x: center + Math.cos(angle) * maxR,
        y: center + Math.sin(angle) * maxR,
        isClamped: true,
      };
    }
    return { x: px, y: py, isClamped: false };
  };

  return (
    <div className="flex flex-col items-start gap-1 select-none pointer-events-auto">
      {/* Radar Map Container */}
      <div className="relative w-[130px] h-[130px] rounded-full bg-slate-950/90 border-2 border-amber-400/80 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Radar concentric rings */}
        <div className="absolute inset-2 rounded-full border border-slate-700/50" />
        <div className="absolute inset-8 rounded-full border border-slate-700/40" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800/60 -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800/60 -translate-x-1/2" />

        {/* Sublocations on Minimap */}
        {sublocations.map((sub) => {
          const pos = toMinimapPos(sub.coordinates[0], sub.coordinates[2]);
          const isTarget = targetDestinationId === sub.id;
          const isCompleted = completedActivities.includes(sub.activityId);
          const isUnlocked = unlockedLocations.includes(sub.id);

          return (
            <div
              key={sub.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 z-10"
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              title={sub.name}
            >
              {isCompleted ? (
                /* Green checkmark */
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow">
                  ✓
                </span>
              ) : !isUnlocked ? (
                /* Grey lock */
                <span className="w-3 h-3 rounded-full bg-slate-700 text-slate-300 text-[8px] flex items-center justify-center">
                  🔒
                </span>
              ) : isTarget ? (
                /* Blue diamond / active destination */
                <div className="relative">
                  <span className="w-4 h-4 bg-blue-500 rotate-45 flex items-center justify-center shadow-lg border border-white animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </div>
              ) : sub.iconType === 'purple_crystal' ? (
                /* Purple crystal */
                <span className="text-[10px]">🔮</span>
              ) : (
                /* Gold star */
                <span className="text-[10px]">⭐</span>
              )}
            </div>
          );
        })}

        {/* Nearby NPCs (Green speech bubble) */}
        {npcs.map((npc, idx) => {
          const pos = toMinimapPos(npc.x, npc.z);
          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              title={`NPC: ${npc.name}`}
            >
              <div className="w-3 h-3 rounded-full bg-emerald-400 border border-slate-950 shadow flex items-center justify-center text-[7px] text-slate-950 font-bold">
                💬
              </div>
            </div>
          );
        })}

        {/* Center Player Pointer (Facing Direction Arrow) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-transform duration-75"
          style={{ transform: `translate(-50%, -50%) rotate(${playerRotationY}rad)` }}
        >
          {/* Directional Cone Pointer */}
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-amber-400 shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-white mx-auto -mt-1 shadow" />
        </div>

        {/* Compass Cardinal 'U' (Utara) */}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 font-black text-[9px] text-amber-300 font-mono">
          U
        </span>
      </div>

      {/* Button: "LIHAT PETA" matching Part 4 */}
      <button
        onClick={onOpenFullMap}
        className="w-[130px] py-1.5 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
      >
        <Map className="w-3.5 h-3.5" />
        <span>LIHAT PETA</span>
      </button>
    </div>
  );
};
