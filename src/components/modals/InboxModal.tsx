/**
 * BAKUWIRA: Peti Warkah & Notifikasi Modal
 * Displays royal decree letters from Istana and teacher announcements
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Bell, Sparkles, X, Check, Gift } from 'lucide-react';
import { soundEffects } from '../../utils/audioEffects';

interface Letter {
  id: string;
  sender: string;
  title: string;
  body: string;
  rewardClaimed: boolean;
  rewardCoins?: number;
  date: string;
}

interface InboxModalProps {
  onClose: () => void;
  onClaimReward: (coins: number) => void;
}

export const InboxModal: React.FC<InboxModalProps> = ({ onClose, onClaimReward }) => {
  const [letters, setLetters] = useState<Letter[]>([
    {
      id: 'let_1',
      sender: 'Puan Zahra, Guru Pembimbing',
      title: 'Selamat Datang ke Kerajaan BAKUWIRA!',
      body: 'Tahniah kerana menyahut seruan memulihkan keharmonian bahasa Melayu di lima wilayah. Kanta Siasatan dan Kamus Dewan Mini telah dibekalkan dalam inventori anda. Gunakan bahasa baku dengan santun!',
      rewardClaimed: false,
      rewardCoins: 300,
      date: 'Hari Ini',
    },
    {
      id: 'let_2',
      sender: 'Raja Bahasa, Istana Wira Bahasa',
      title: 'Warkah Titah Diraja: Cabaran 21 Misi',
      body: 'Kepada wira bahasa yang dikasihi, pulihkanlah Kristal Bahasa di setiap wilayah sebelum kabus bahasa rojak meranapkan keindahan wacana rasmi kita.',
      rewardClaimed: false,
      rewardCoins: 500,
      date: 'Semalam',
    },
  ]);

  const [selectedLetter, setSelectedLetter] = useState<Letter>(letters[0]);

  const handleClaim = (letterId: string, coins: number) => {
    soundEffects.playFanfare();
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setLetters((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, rewardClaimed: true } : l))
    );
    setSelectedLetter((prev) => ({ ...prev, rewardClaimed: true }));
    onClaimReward(coins);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-4 text-white max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                Peti Warkah & Notifikasi Diraja
              </h2>
              <p className="text-xs text-slate-400">Surat jemputan, makluman guru dan ganjaran khas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* List */}
          <div className="space-y-2 sm:col-span-1">
            {letters.map((l) => (
              <div
                key={l.id}
                onClick={() => {
                  soundEffects.playHover();
                  setSelectedLetter(l);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedLetter.id === l.id
                    ? 'bg-amber-500/20 border-amber-400 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>{l.date}</span>
                  {!l.rewardClaimed && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <h4 className="text-xs font-bold truncate">{l.title}</h4>
                <p className="text-[10px] text-slate-400 truncate">{l.sender}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="border-b border-slate-800/80 pb-2">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  Daripada: {selectedLetter.sender}
                </span>
                <h3 className="text-sm font-black text-white mt-0.5">{selectedLetter.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedLetter.body}
              </p>
            </div>

            {selectedLetter.rewardCoins && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    Lampiran: +{selectedLetter.rewardCoins} Koin Diraja
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleClaim(selectedLetter.id, selectedLetter.rewardCoins || 0)
                  }
                  disabled={selectedLetter.rewardClaimed}
                  className={`py-1 px-3 rounded-lg text-xs font-bold transition-all ${
                    selectedLetter.rewardClaimed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow hover:scale-105'
                  }`}
                >
                  {selectedLetter.rewardClaimed ? 'Sudah Dituntut ✓' : 'Tuntut Hadiah'}
                </button>
              </div>
            )}
          </div>
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
