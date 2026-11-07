/**
 * BAKUWIRA: Kedai Permainan Modal
 * Exchange coins and crystals for adventure goods, lens styles and energy.
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Store, Sparkles, X, Coins, Check, AlertCircle } from 'lucide-react';
import { soundEffects } from '../../utils/audioEffects';

interface ShopItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  icon: string;
  category: 'Aksesori' | 'Bekalan' | 'Lensa';
}

interface ShopModalProps {
  playerCoins: number;
  onBuyItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  playerCoins,
  onBuyItem,
  onClose,
}) => {
  const [coins, setCoins] = useState(playerCoins);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const shopItems: ShopItem[] = [
    {
      id: 'potion_super',
      name: 'Ramuan Tenaga Bahasa Penuh',
      desc: 'Memulihkan 100 mata stamina dan menambahkan keyakinan berbicara.',
      cost: 500,
      icon: '🧪',
      category: 'Bekalan',
    },
    {
      id: 'lensa_emas',
      name: 'Lensa Siasatan Neon Emas',
      desc: 'Menyerlahkan petunjuk kesalahan tatabahasa dengan garis cahaya emas.',
      cost: 1500,
      icon: '✨',
      category: 'Lensa',
    },
    {
      id: 'tanjak_wira',
      name: 'Tanjak Wira Sutera Ungu',
      desc: 'Aksesori tradisional Melayu yang meningkatkan keanggunan watak wira.',
      cost: 2500,
      icon: '👑',
      category: 'Aksesori',
    },
    {
      id: 'buku_nota_emas',
      name: 'Buku Nota Detektif Emas',
      desc: 'Menyimpan 10 petua tatabahasa tambahan untuk siasatan mesej keliru.',
      cost: 1000,
      icon: '📒',
      category: 'Bekalan',
    },
  ];

  const handlePurchase = (item: ShopItem) => {
    if (coins < item.cost) {
      soundEffects.playHover();
      setMessage(`Koin tidak mencukupi! Anda memerlukan ${item.cost} koin.`);
      return;
    }

    soundEffects.playClick();
    setCoins((c) => c - item.cost);
    setPurchasedIds((prev) => [...prev, item.id]);
    setMessage(`Tahniah! Anda berjaya membeli ${item.name}!`);
    onBuyItem(item);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 text-white max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
              <Store className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                Kedai Barangan Bahasa
              </h2>
              <p className="text-xs text-slate-400">Tukar koin pengembaraan untuk naik taraf peralatan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{coins}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-xs text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shopItems.map((item) => {
            const isOwned = purchasedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-amber-400/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-100">{item.name}</span>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    {item.cost}
                  </span>
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={isOwned}
                    className={`py-1 px-3 rounded-lg text-xs font-bold transition-all ${
                      isOwned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isOwned ? 'Milik Anda ✓' : 'Beli'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

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
