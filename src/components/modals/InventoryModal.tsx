/**
 * BAKUWIRA: Beg & Inventori Wira Modal
 * Displays player inventory items, tools, crystals and potions
 */

import React from 'react';
import { Backpack, Sparkles, X, Shield, Eye, BookOpen } from 'lucide-react';
import { soundEffects } from '../../utils/audioEffects';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Alat Siasatan' | 'Rujukan' | 'Kristal' | 'Bekalan';
  icon: string;
  count: number;
  description: string;
  rarity: 'Biasa' | 'Langka' | 'Legenda';
}

interface InventoryModalProps {
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ onClose }) => {
  const items: InventoryItem[] = [
    {
      id: 'kanta',
      name: 'Kanta Siasatan Baku',
      category: 'Alat Siasatan',
      icon: '🔍',
      count: 1,
      description: 'Mendedahkan glit bahasa rojak, ejaan salah dan kesalahan tatabahasa tersembunyi.',
      rarity: 'Legenda',
    },
    {
      id: 'kamus',
      name: 'Kamus Dewan Mini',
      category: 'Rujukan',
      icon: '📖',
      count: 1,
      description: 'Rujukan rasmi kosa kata baku, tatabahasa dan padanan istilah Dewan Bahasa dan Pustaka.',
      rarity: 'Langka',
    },
    {
      id: 'kristal_1',
      name: 'Kristal Komunikasi Digital',
      category: 'Kristal',
      icon: '💎',
      count: 1,
      description: 'Kristal bahasa yang dipulihkan dari Kota Media Sosial.',
      rarity: 'Legenda',
    },
    {
      id: 'potion_tenaga',
      name: 'Jus Tenaga Bahasa',
      category: 'Bekalan',
      icon: '🧪',
      count: 5,
      description: 'Memulihkan 50 mata tenaga perbualan untuk bercakap dengan penduduk dan saksi.',
      rarity: 'Biasa',
    },
    {
      id: 'pena_emas',
      name: 'Pena Emas Rasmi',
      category: 'Alat Siasatan',
      icon: '✒️',
      count: 1,
      description: 'Pena magis yang menambah markah ketepatan ejaan sebanyak +15% semasa latihan menulis.',
      rarity: 'Langka',
    },
    {
      id: 'mikrofon_kristal',
      name: 'Mikrofon Kristal Santun',
      category: 'Alat Siasatan',
      icon: '🎙️',
      count: 1,
      description: 'Meningkatkan kelancaran dan sebutan intonasi baku semasa simulasi pertuturan awam.',
      rarity: 'Langka',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 text-white max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
              <Backpack className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                Beg & Inventori Wira
              </h2>
              <p className="text-xs text-slate-400">Peralatan siasatan, rujukan dan kristal bahasa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => soundEffects.playHover()}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-400/60 transition-all flex items-start gap-3 cursor-pointer group hover:bg-slate-900/60"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-100 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    x{item.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px]">
                  <span className="text-slate-500">{item.category}</span>
                  <span className="text-slate-600">•</span>
                  <span
                    className={
                      item.rarity === 'Legenda'
                        ? 'text-amber-400 font-bold'
                        : item.rarity === 'Langka'
                        ? 'text-purple-400 font-bold'
                        : 'text-blue-400'
                    }
                  >
                    {item.rarity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
