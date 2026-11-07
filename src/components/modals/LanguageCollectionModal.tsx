/**
 * BAKUWIRA: Koleksi & Modul Bahasa Modal
 * Displays unlocked grammar modules, rojak vs baku dictionaries, and vocabulary notes.
 */

import React, { useState } from 'react';
import { BookOpen, Sparkles, X, CheckCircle, Search, Bookmark } from 'lucide-react';
import { soundEffects } from '../../utils/audioEffects';

interface LanguageCollectionModalProps {
  onClose: () => void;
}

export const LanguageCollectionModal: React.FC<LanguageCollectionModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'kamus' | 'modul'>('kamus');

  const vocabularyPairs = [
    { rojak: 'viral / trending', baku: 'tular', contoh: 'Berita tersebut telah tular di media sosial.' },
    { rojak: 'posting / post', baku: 'hantaran / memuat naik', contoh: 'Cikgu memuat naik hantaran ilmiah di portal sekolah.' },
    { rojak: 'caption', baku: 'kapsyen', contoh: 'Kapsyen poster itu ditulis dengan ejaan yang tepat.' },
    { rojak: 'join / participate', baku: 'menyertai', contoh: 'Murid-murid digalakkan menyertai kempen bahasa baku.' },
    { rojak: 'confirm / make sure', baku: 'mengesahkan / memastikan', contoh: 'Sila sahkan kehadiran anda sebelum hari Jumaat.' },
    { rojak: 'cancel', baku: 'membatalkan', contoh: 'Pihak penganjur membatalkan perlawanan kerana hujan lebat.' },
    { rojak: 'order / buy', baku: 'memesan / membeli', contoh: 'Saya ingin memesan sebungkus nasi lemak.' },
    { rojak: 'meeting', baku: 'mesyuarat', contoh: 'Mesyuarat agung persatuan bermula pada pukul 2:00 petang.' },
    { rojak: 'feedback', baku: 'maklum balas', contoh: 'Guru memberikan maklum balas yang membina.' },
    { rojak: 'download', baku: 'memuat turun', contoh: 'Murid boleh memuat turun nota tatabahasa di sini.' },
  ];

  const modules = [
    {
      id: 'm1',
      title: 'Modul 1: Glosari Istilah Digital Baku',
      desc: 'Padanan rasmi istilah Internet, komunikasi media sosial dan e-mel rasmi.',
      status: 'Selesai 100%',
      icon: '📱',
    },
    {
      id: 'm2',
      title: 'Modul 2: Laras Bahasa Rasmi vs Santai',
      desc: 'Panduan membezakan perbualan mesra harian dan wacana rasmi beradab.',
      status: 'Selesai 100%',
      icon: '🏛️',
    },
    {
      id: 'm3',
      title: 'Modul 3: Hukum Tatabahasa Kerap Keliru',
      desc: 'Hukum D-M, imbuhan pinjaman, kata majmuk dan kata sendi nama.',
      status: 'Selesai 100%',
      icon: '✍️',
    },
    {
      id: 'm4',
      title: 'Modul 4: Kesantunan Pengucapan Awam',
      desc: 'Adab menyapa, intonasi berbicara dan susunan pidato berwibawa.',
      status: 'Selesai 100%',
      icon: '🎙️',
    },
  ];

  const filteredVocab = vocabularyPairs.filter(
    (v) =>
      v.rojak.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.baku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contoh.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 text-white max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                Koleksi & Modul Bahasa
              </h2>
              <p className="text-xs text-slate-400">Glosari kata baku dan arkib modul bahasa Melayu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('kamus')}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'kamus'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kamus Rojak ➔ Baku ({vocabularyPairs.length})
          </button>
          <button
            onClick={() => setActiveTab('modul')}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'modul'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modul Bahasa ({modules.length})
          </button>
        </div>

        {activeTab === 'kamus' ? (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari perkataan rojak atau istilah baku..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
              />
            </div>

            {/* Vocab Cards List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredVocab.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-500/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-xs font-mono line-through">{v.rojak}</span>
                      <span className="text-slate-500 text-xs">➔</span>
                      <strong className="text-emerald-400 text-xs font-bold">{v.baku}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">"{v.contoh}"</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono self-start sm:self-center shrink-0">
                    Baku DBP ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-400/50 flex items-start gap-3 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                  {m.icon}
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-xs font-bold text-slate-100">{m.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-400 font-bold">{m.status}</span>
                    <button
                      onClick={() => soundEffects.playClick()}
                      className="text-[10px] text-amber-300 underline font-medium hover:text-amber-200"
                    >
                      Buka Rujukan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
