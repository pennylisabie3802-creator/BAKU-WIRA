/**
 * BAKUWIRA: Profile Selection Screen
 * Panel 3: Pilih Profil / Simpanan
 */

import React from 'react';
import { PlayerProfile } from '../../types/game';
import { User, Clock, MapPin, Plus, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { REGIONS_DATA } from '../../data/missionBank';

interface ProfileSelectProps {
  profiles: PlayerProfile[];
  activeProfileId: string;
  onSelectProfile: (profile: PlayerProfile) => void;
  onCustomizeProfile?: (profile: PlayerProfile) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

export const ProfileSelect: React.FC<ProfileSelectProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCustomizeProfile,
  onCreateNew,
  onBack,
}) => {
  const formatPlaytime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getRegionName = (regId: string) => {
    return REGIONS_DATA.find((r) => r.id === regId)?.name || 'Akademi Detektif Bahasa';
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white select-none">
      <div className="relative z-10 w-full max-w-xl space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text">
            Pilih Profil / Simpanan
          </h2>
          <p className="text-xs text-slate-400">
            Pilih rekod pengembaraan wira bahasa anda atau cipta profil baharu
          </p>
        </div>

        {/* Profile Cards List */}
        <div className="space-y-3.5">
          {profiles.map((p, idx) => {
            const isSelected = p.id === activeProfileId;
            return (
              <div
                key={p.id}
                onClick={() => onSelectProfile(p)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-amber-400/80 ring-2 ring-amber-400/30 shadow-xl'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar Thumbnail */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md border border-white/20">
                    {p.avatar.gender === 'perempuan' ? '🧕' : '🧑‍🎓'}
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors">
                        {p.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-[11px] font-black text-amber-300">
                        Lv. {p.level}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{getRegionName(p.currentRegion)}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formatPlaytime(p.playtimeSeconds)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onCustomizeProfile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCustomizeProfile(p);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all hover:scale-105"
                      title="Ubah suai rupa watak dan pakaian wira"
                    >
                      Ubah Suai
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProfile(p);
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all group-hover:scale-105"
                  >
                    Pilih
                  </button>
                </div>
              </div>
            );
          })}

          {/* New Profile Button */}
          <button
            onClick={onCreateNew}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-amber-400/80 bg-slate-900/40 hover:bg-slate-850/60 text-slate-400 hover:text-amber-300 flex items-center justify-center gap-2 font-bold text-sm transition-all"
          >
            <Plus className="w-5 h-5 text-amber-400" />
            <span>+ Profil Baharu</span>
          </button>
        </div>

        {/* Back Button */}
        <div className="pt-2 flex justify-start">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
