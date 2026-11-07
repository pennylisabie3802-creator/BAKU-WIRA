/**
 * BAKUWIRA: In-Game System Menu & Progress Overview
 * Panel 13: Menu Sistem dalam Permainan & Panel 14: Ringkasan Perkembangan
 */

import React, { useState } from 'react';
import { PlayerProfile, MissionQuestion } from '../../types/game';
import {
  User,
  Map,
  Package,
  BookOpen,
  Award,
  Settings,
  X,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  CheckCircle2,
  Lock,
  Music,
  Volume2,
  VolumeX,
  Volume1,
  Headphones,
  Sliders,
} from 'lucide-react';
import { REGIONS_DATA } from '../../data/missionBank';
import { soundEffects } from '../../utils/audioEffects';

interface SystemMenuModalProps {
  profile: PlayerProfile;
  questions: MissionQuestion[];
  onClose: () => void;
  onOpenContentManager: () => void;
  onOpenWorldMap: () => void;
}

type TabType = 'profil' | 'misi' | 'inventori' | 'modul' | 'pencapaian' | 'tetapan';

export const SystemMenuModal: React.FC<SystemMenuModalProps> = ({
  profile,
  questions,
  onClose,
  onOpenContentManager,
  onOpenWorldMap,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>(() => {
    return (localStorage.getItem('bakuwira_graphics_quality') as any) || 'high';
  });

  // Independent Audio States
  const [bgmMuted, setBgmMuted] = useState(soundEffects.getBgmMuted());
  const [bgmVolume, setBgmVolume] = useState(() => Math.round(soundEffects.getBGMVolume() * 100));
  const [sfxMuted, setSfxMuted] = useState(soundEffects.getSfxMuted());
  const [sfxVolume, setSfxVolume] = useState(() => Math.round(soundEffects.getSfxVolume() * 100));

  const handleToggleBgm = () => {
    const next = !bgmMuted;
    setBgmMuted(next);
    soundEffects.setBgmMuted(next);
    if (!next) {
      soundEffects.playClick();
    }
  };

  const handleBgmVolumeChange = (newVal: number) => {
    setBgmVolume(newVal);
    soundEffects.setBGMVolume(newVal / 100);
    if (newVal > 0 && bgmMuted) {
      setBgmMuted(false);
      soundEffects.setBgmMuted(false);
    }
  };

  const handleToggleSfx = () => {
    const next = !sfxMuted;
    setSfxMuted(next);
    soundEffects.setSfxMuted(next);
    if (!next) {
      soundEffects.playClick();
    }
  };

  const handleSfxVolumeChange = (newVal: number) => {
    setSfxVolume(newVal);
    soundEffects.setSfxVolume(newVal / 100);
    soundEffects.playHover();
  };

  const handleTestSfx = () => {
    soundEffects.playFanfare();
  };

  const handleSetGraphics = (level: 'low' | 'medium' | 'high') => {
    setGraphicsQuality(level);
    localStorage.setItem('bakuwira_graphics_quality', level);
  };

  const totalQuestionsCount = questions.length;
  const completedCount = profile.completedActivities.length;
  const masteryPercentage = Math.min(
    100,
    Math.round((completedCount / Math.max(1, totalQuestionsCount)) * 100) + 25
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl h-[88vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden text-slate-100">
        {/* Left Sidebar Menu matching Panel 13 */}
        <div className="md:w-64 bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md border border-white/20">
                {profile.avatar.gender === 'perempuan' ? '🧕' : '🧑‍🎓'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm text-amber-300 truncate">{profile.name}</h3>
                <span className="text-xs text-slate-400 font-mono">Lv. {profile.level}</span>
              </div>
            </div>

            {/* Menu Buttons list */}
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('profil')}
                className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                  activeTab === 'profil'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Ringkasan Perkembangan</span>
              </button>

              <button
                onClick={() => setActiveTab('misi')}
                className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                  activeTab === 'misi'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Senarai Misi (5 Wilayah)</span>
              </button>

              <button
                onClick={() => setActiveTab('inventori')}
                className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                  activeTab === 'inventori'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Inventori Alatan Wira</span>
              </button>

              <button
                onClick={() => setActiveTab('modul')}
                className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                  activeTab === 'modul'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Modul Bahasa Baku</span>
              </button>

              <button
                onClick={() => setActiveTab('pencapaian')}
                className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                  activeTab === 'pencapaian'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Pencapaian & Pingat</span>
              </button>

              <button
                onClick={() => setActiveTab('tetapan')}
                className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                  activeTab === 'tetapan'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Tetapan Permainan</span>
              </button>
            </nav>
          </div>

          {/* Quick Background Music Controller */}
          <div className="pt-3 pb-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Music className={`w-3.5 h-3.5 ${!bgmMuted ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-[11px]">Muzik Latar (BGM)</span>
              </div>
              <button
                onClick={handleToggleBgm}
                className={`py-0.5 px-2 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                  !bgmMuted
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                }`}
                title={!bgmMuted ? 'Matikan Muzik' : 'Hidupkan Muzik'}
              >
                {!bgmMuted ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span>{!bgmMuted ? `${bgmVolume}%` : 'Bisu'}</span>
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bgmMuted ? 0 : bgmVolume}
              onChange={(e) => handleBgmVolumeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-400 cursor-pointer"
              title="Kelantangan Muzik Latar"
            />
          </div>

          {/* Teacher Tool Shortcut */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                onClose();
                onOpenContentManager();
              }}
              className="w-full py-2 px-3 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Urus Kandungan Misi (Guru)</span>
            </button>
          </div>
        </div>

        {/* Right Main Content Pane matching Panel 14 */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-black text-base text-amber-300 uppercase tracking-wider">
              {activeTab === 'profil' && 'Perkembangan Wira Bahasa'}
              {activeTab === 'misi' && 'Kemajuan Misi 5 Wilayah'}
              {activeTab === 'inventori' && 'Beg Inventori Wira'}
              {activeTab === 'modul' && 'Glosari & Modul Bahasa Baku'}
              {activeTab === 'pencapaian' && 'Pencapaian Bahasa Melayu'}
              {activeTab === 'tetapan' && 'Tetapan Sistem'}
            </h3>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: PROFIL / RINGKASAN PERKEMBANGAN (Panel 14 exactly) */}
            {activeTab === 'profil' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Level & EXP Progress Bar */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-amber-400">Lv. {profile.level}</span>
                      <span className="text-xs text-slate-400">Tahap Wira Bahasa</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      EXP {profile.xp} / {profile.maxXp}
                    </span>
                  </div>
                  {/* EXP Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (profile.xp / profile.maxXp) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 3 Metric Cards matching panel 14 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Kemajuan Misi: 12 / 100 */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 font-medium">Kemajuan Misi</div>
                    <div className="text-2xl font-black text-blue-400">
                      {completedCount} <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>

                  {/* Pencapaian: 8 / 50 */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 font-medium">Pencapaian</div>
                    <div className="text-2xl font-black text-purple-400">
                      8 <span className="text-xs text-slate-500">/ 50</span>
                    </div>
                  </div>

                  {/* Penguasaan Bahasa: 78% */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 font-medium">Penguasaan Bahasa</div>
                    <div className="text-2xl font-black text-emerald-400">
                      {masteryPercentage}%
                    </div>
                  </div>
                </div>

                {/* Language Skills scores */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Keterampilan Bahasa (Lisan & Bertulis)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Skor Simulasi Bertutur:</span>
                      <span className="font-black text-indigo-400 text-sm">92 / 100</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Skor Latihan Menulis:</span>
                      <span className="font-black text-emerald-400 text-sm">75 / 80</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SENARAI MISI */}
            {activeTab === 'misi' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-400">
                    Selesaikan semua 5 wilayah untuk membebaskan Dunia Bahasa daripada Kekeliruan Bahasa.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWorldMap();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Buka Peta Dunia
                  </button>
                </div>

                <div className="space-y-3">
                  {REGIONS_DATA.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{r.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{r.name}</h4>
                          <span className="text-xs text-amber-400/90">{r.tagline}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                        {r.id === profile.currentRegion ? 'Wilayah Aktif' : 'Terbuka'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: INVENTORI */}
            {activeTab === 'inventori' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                {profile.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5"
                  >
                    <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-700">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-amber-300">{item.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                      <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                        Jumlah: {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: MODUL BAHASA */}
            {activeTab === 'modul' && (
              <div className="space-y-3 animate-fadeIn">
                {profile.languageModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-indigo-300">{mod.title}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                        {mod.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{mod.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 font-mono">
                        <span className="font-bold block text-[10px] text-rose-400 uppercase">Rojak:</span>
                        "{mod.exampleRojak}"
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-mono">
                        <span className="font-bold block text-[10px] text-emerald-400 uppercase">Baku:</span>
                        "{mod.exampleBaku}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: PENCAPAIAN */}
            {activeTab === 'pencapaian' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                {profile.badges.map((b, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5"
                  >
                    <span className="text-3xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      🎖️
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{b}</h4>
                      <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Telah Dicapai</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: TETAPAN */}
            {activeTab === 'tetapan' && (
              <div className="space-y-5 max-w-xl animate-fadeIn text-xs">
                {/* 1. Independent Background Music Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 shadow-lg space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                        <Music className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                          <span>Muzik Latar Tema (BGM)</span>
                          {!bgmMuted && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400">Lagu tema orkestra epik BAKUWIRA</p>
                      </div>
                    </div>
                    {/* Music Toggle */}
                    <button
                      onClick={handleToggleBgm}
                      className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
                        !bgmMuted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {!bgmMuted ? (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span>Muzik Aktif</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-400" />
                          <span>Muzik Dibisukan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Volume Slider & readout */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Kelantangan Muzik:</span>
                      <span className="font-mono text-amber-300 font-bold text-sm">
                        {bgmMuted ? '0% (Bisu)' : `${bgmVolume}%`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Volume1 className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bgmMuted ? 0 : bgmVolume}
                        onChange={(e) => handleBgmVolumeChange(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                      <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                    </div>
                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 mr-1">Pratetap:</span>
                      {[
                        { label: '0%', val: 0 },
                        { label: '25%', val: 25 },
                        { label: '50%', val: 50 },
                        { label: '75%', val: 75 },
                        { label: '100%', val: 100 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          onClick={() => handleBgmVolumeChange(preset.val)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                            !bgmMuted && bgmVolume === preset.val
                              ? 'bg-amber-500 text-slate-950 border-amber-300'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    💡 <span className="text-slate-300 font-semibold">Bebas & Terpisah:</span> Menukar kelantangan atau membisukan muzik latar tidak akan mengubah kesan bunyi tapak kaki, interaksi dialog watak, ataupun bunyi ganjaran fanfare.
                  </p>
                </div>

                {/* 2. Independent Sound Effects (SFX) Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        <Headphones className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-300 text-sm">Kesan Bunyi (SFX)</h4>
                        <p className="text-[11px] text-slate-400">Langkah 3D, lonjakan, klik & fanfare</p>
                      </div>
                    </div>
                    {/* SFX Toggle */}
                    <button
                      onClick={handleToggleSfx}
                      className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
                        !sfxMuted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {!sfxMuted ? (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span>SFX Aktif</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-400" />
                          <span>SFX Dibisukan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SFX Volume Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Kelantangan Kesan Bunyi:</span>
                      <span className="font-mono text-indigo-300 font-bold text-sm">
                        {sfxMuted ? '0% (Bisu)' : `${sfxVolume}%`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Volume1 className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sfxMuted ? 0 : sfxVolume}
                        onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
                        className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                      <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 mr-1">Pratetap:</span>
                        {[
                          { label: '0%', val: 0 },
                          { label: '50%', val: 50 },
                          { label: '80%', val: 80 },
                          { label: '100%', val: 100 },
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            onClick={() => handleSfxVolumeChange(preset.val)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                              !sfxMuted && sfxVolume === preset.val
                                ? 'bg-indigo-600 text-white border-indigo-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleTestSfx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 text-[11px] font-bold flex items-center gap-1 transition-all"
                        title="Dengar contoh kesan bunyi fanfare"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Uji SFX</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Graphics Quality Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs">Kualiti Visual & Kelancaran 3D</h4>
                      <p className="text-[10px] text-slate-400">Pencahayaan, zarah sakura dan resolusi</p>
                    </div>
                    <span className="text-amber-400 font-mono text-xs font-bold capitalize">
                      {graphicsQuality === 'low'
                        ? 'Rendah (Low)'
                        : graphicsQuality === 'medium'
                        ? 'Sederhana (Med)'
                        : 'Tinggi (High)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSetGraphics('low')}
                      className={`py-2 px-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                        graphicsQuality === 'low'
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Rendah (Low)
                    </button>
                    <button
                      onClick={() => handleSetGraphics('medium')}
                      className={`py-2 px-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                        graphicsQuality === 'medium'
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Sederhana
                    </button>
                    <button
                      onClick={() => handleSetGraphics('high')}
                      className={`py-2 px-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                        graphicsQuality === 'high'
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Tinggi (High)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
