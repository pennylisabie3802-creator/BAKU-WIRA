/**
 * BAKUWIRA: Character Customization & Creation Screen
 * Panel 4: Penciptaan / Penyesuaian Watak (Cipta Wira Bahasa)
 */

import React, { useState } from 'react';
import { AvatarCustomization } from '../../types/game';
import { User, Sparkles, Check, ArrowLeft, Palette, Scissors, Shield } from 'lucide-react';

interface CharacterCreatorProps {
  initialAvatar?: AvatarCustomization;
  initialName?: string;
  onConfirm: (name: string, avatar: AvatarCustomization) => void;
  onBack: () => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialAvatar = {
    gender: 'lelaki',
    hairStyle: 1,
    hairColor: '#451a03',
    outfitColor: '#2563eb',
    accessory: 'bandana',
  },
  initialName = 'Wira Bahasa',
  onConfirm,
  onBack,
}) => {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<'lelaki' | 'perempuan'>(initialAvatar.gender);
  const [hairStyle, setHairStyle] = useState(initialAvatar.hairStyle);
  const [hairColor, setHairColor] = useState(initialAvatar.hairColor);
  const [outfitColor, setOutfitColor] = useState(initialAvatar.outfitColor);
  const [accessory, setAccessory] = useState(initialAvatar.accessory);

  const outfitColors = [
    { label: 'Biru Akademi', value: '#2563eb' },
    { label: 'Ungu Siber', value: '#9333ea' },
    { label: 'Emas Istana', value: '#d97706' },
    { label: 'Hijau Warisan', value: '#059669' },
    { label: 'Merah Berani', value: '#dc2626' },
  ];

  const hairColors = [
    { label: 'Hitam Asli', value: '#1e293b' },
    { label: 'Coklat Tua', value: '#451a03' },
    { label: 'Perang Gelap', value: '#78350f' },
    { label: 'Kuning Madu', value: '#b45309' },
  ];

  const accessories = [
    { id: 'tiada', label: 'Tiada' },
    { id: 'bandana', label: 'Bandana Wira' },
    { id: 'cermin_mata', label: 'Kanta Analisis' },
    { id: 'tudung', label: 'Tudung Santun' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(name.trim() || 'Wira Bahasa', {
      gender,
      hairStyle,
      hairColor,
      outfitColor,
      accessory,
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white select-none">
      <div className="relative z-10 w-full max-w-4xl bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 animate-fadeIn">
        {/* Left: 3D-Like Preview Box matching panel 4 */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pratonton Watak Wira</span>
          </div>

          {/* Procedural Visual Avatar Representation */}
          <div className="relative w-48 h-64 flex flex-col items-center justify-center">
            {/* Ambient pedestal */}
            <div className="absolute bottom-2 w-36 h-6 rounded-full bg-amber-500/20 blur-md" />
            <div className="absolute bottom-0 w-32 h-4 rounded-full bg-slate-800 border border-amber-500/40" />

            {/* Accessory Top Icon */}
            {accessory === 'bandana' && (
              <div className="absolute top-6 z-20 text-xs px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                BANDANA
              </div>
            )}
            {accessory === 'tudung' && (
              <div className="absolute top-6 z-20 text-xs px-2 py-0.5 rounded bg-purple-500 text-white font-bold">
                TUDUNG
              </div>
            )}

            {/* Head & Hair */}
            <div
              className="relative w-20 h-20 rounded-full border-2 border-amber-300/60 shadow-lg flex items-center justify-center text-3xl"
              style={{ backgroundColor: '#fed7aa' }}
            >
              {gender === 'perempuan' ? '👧' : '👦'}
            </div>

            {/* Torso & Outfit */}
            <div
              className="w-24 h-24 rounded-2xl mt-1 shadow-md border border-white/20 flex flex-col items-center justify-center"
              style={{ backgroundColor: outfitColor }}
            >
              <Shield className="w-8 h-8 text-white/80" />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                BAKU
              </span>
            </div>

            {/* Legs */}
            <div className="flex gap-4 -mt-1">
              <div className="w-5 h-10 rounded-b-lg bg-slate-800" />
              <div className="w-5 h-10 rounded-b-lg bg-slate-800" />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-black text-amber-300">{name || 'Wira Bahasa'}</h3>
            <p className="text-xs text-slate-400 capitalize">
              {gender} • Gaya {hairStyle} • {accessory.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Right: Customization Controls Form */}
        <form onSubmit={handleSave} className="md:w-1/2 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text">
                Cipta Wira Bahasa
              </h2>
              <p className="text-xs text-slate-400">
                Sesuaikan watak wira bahasa anda sebelum memulakan misi penyelamatan
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Wira Bahasa
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="Masukkan nama anda..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 text-sm text-slate-100 outline-none"
                required
              />
            </div>

            {/* Jantina */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Jantina</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('lelaki')}
                  className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all ${
                    gender === 'lelaki'
                      ? 'bg-blue-600 border-blue-400 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Lelaki
                </button>
                <button
                  type="button"
                  onClick={() => setGender('perempuan')}
                  className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all ${
                    gender === 'perempuan'
                      ? 'bg-purple-600 border-purple-400 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Perempuan
                </button>
              </div>
            </div>

            {/* Warna Pakaian */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Warna Pakaian Wira</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {outfitColors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setOutfitColor(c.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      outfitColor === c.value
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Aksesori */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Aksesori Kepala
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {accessories.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAccessory(a.id)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                      accessory === a.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Sahkan & Mula</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
