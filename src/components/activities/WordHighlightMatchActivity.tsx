/**
 * BAKUWIRA: Word Highlight & Match Activity
 * Tailored for Misi 01: Pemburu Mesej Rojak (Dataran Mesej)
 * Interactive hologram screen where player identifies mixed English words
 * and pairs them with their Malay equivalents.
 */

import React, { useState } from 'react';
import { MissionQuestion } from '../../types/game';
import { Sparkles, CheckCircle2, ArrowRight, Lightbulb, RefreshCw, Layers } from 'lucide-react';

interface WordHighlightMatchActivityProps {
  question: MissionQuestion;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const WordHighlightMatchActivity: React.FC<WordHighlightMatchActivityProps> = ({
  question,
  onComplete,
  onClose,
}) => {
  // Pairs from structuredAnswer or fallback default
  const defaultPairs: [string, string][] = [
    ['Guys', 'kawan-kawan'],
    ['please', 'sila'],
    ['submit', 'hantar'],
    ['homework', 'kerja sekolah'],
    ['before Friday', 'sebelum hari Jumaat'],
  ];

  const pairs: [string, string][] = question.structuredAnswer?.pairs || defaultPairs;

  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [selectedMalay, setSelectedMalay] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available Malay options shuffled
  const [malayOptions] = useState<string[]>(() => {
    return [...pairs.map((p) => p[1])].sort(() => Math.random() - 0.5);
  });

  const isCompleted = matchedPairs.length === pairs.length;

  const handleSelectEnglish = (eng: string) => {
    if (matchedPairs.includes(eng)) return;
    setErrorMessage(null);
    setSelectedEnglish(eng);

    // If Malay was already selected, check match
    if (selectedMalay) {
      checkMatch(eng, selectedMalay);
    }
  };

  const handleSelectMalay = (malay: string) => {
    // If this Malay is already matched, ignore
    const alreadyMatched = pairs.some((p) => matchedPairs.includes(p[0]) && p[1] === malay);
    if (alreadyMatched) return;

    setErrorMessage(null);
    setSelectedMalay(malay);

    if (selectedEnglish) {
      checkMatch(selectedEnglish, malay);
    }
  };

  const checkMatch = (eng: string, malay: string) => {
    const pair = pairs.find((p) => p[0] === eng && p[1] === malay);
    if (pair) {
      setMatchedPairs((prev) => [...prev, eng]);
      setSelectedEnglish(null);
      setSelectedMalay(null);
      setErrorMessage(null);
    } else {
      setErrorMessage(`Padanan "${eng}" dengan "${malay}" kurang tepat. Sila cuba lagi!`);
      setTimeout(() => {
        setSelectedEnglish(null);
        setSelectedMalay(null);
      }, 1000);
    }
  };

  const handleFinish = () => {
    onComplete(100, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-920 to-slate-950 border-2 border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 px-5 py-3 flex items-center justify-between text-slate-950 font-bold shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span className="tracking-wide text-xs sm:text-sm uppercase font-extrabold">
              Penerokaan: Pemburu Mesej Rojak Hologram
            </span>
          </div>
          <span className="text-xs bg-slate-950/20 px-2.5 py-1 rounded-full font-mono font-bold">
            {matchedPairs.length} / {pairs.length} Padanan Selesai
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Directive Card */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{question.title}</span>
            </h4>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {question.sourceContent?.arahanPemain ||
                'Klik bahagian bahasa Inggeris yang dicampurkan dalam mesej dan padankan dengan ungkapan bahasa Melayu yang sesuai.'}
            </p>
          </div>

          {/* Hologram Screen Message Display */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950 border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.2)] text-center space-y-3">
            <div className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Pancaran Skrin Hologram Dataran Mesej</span>
            </div>

            <div className="text-base sm:text-xl font-bold leading-relaxed text-slate-100 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              “
              {pairs.map(([eng], idx) => {
                const isMatched = matchedPairs.includes(eng);
                const isSelected = selectedEnglish === eng;

                return (
                  <button
                    key={eng}
                    type="button"
                    onClick={() => handleSelectEnglish(eng)}
                    className={`inline-block mx-1 my-1 px-2.5 py-1 rounded-lg text-sm sm:text-base font-extrabold transition-all transform ${
                      isMatched
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40 ring-2 ring-emerald-300'
                        : isSelected
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-lg'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-500/50 hover:bg-rose-900 hover:scale-105 cursor-pointer animate-pulse'
                    }`}
                  >
                    {eng}
                    {isMatched && ' ✓'}
                  </button>
                );
              })}
              ”
            </div>

            <p className="text-xs text-slate-400">
              Perkataan bahasa rojak yang belum dimurnikan berwarna merah. Klik satu perkataan, kemudian pilih padanan bahasa Melayu di bawah!
            </p>
          </div>

          {/* Feedback & Error */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs flex items-center justify-between animate-fadeIn">
              <span>{errorMessage}</span>
              <RefreshCw className="w-4 h-4 text-rose-400 shrink-0" />
            </div>
          )}

          {/* Malay Selection Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Pilih Padanan Bahasa Melayu Baku:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {malayOptions.map((malay) => {
                const isMatched = pairs.some(
                  (p) => matchedPairs.includes(p[0]) && p[1] === malay
                );
                const isSelected = selectedMalay === malay;

                return (
                  <button
                    key={malay}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectMalay(malay)}
                    className={`p-3 rounded-xl text-xs sm:text-sm font-bold text-center border transition-all ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60 line-through'
                        : isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-300 shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    {malay}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Success Banner */}
          {isCompleted && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border-2 border-emerald-500 text-emerald-200 shadow-xl space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Semua 5 Padanan Berjaya Dimurnikan!</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                Ayat Melayu Baku Lengkap:
                <br />
                <span className="font-bold text-emerald-300 text-sm">
                  “Kawan-kawan, sila hantar kerja sekolah BM sebelum hari Jumaat.”
                </span>
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-300">
                <span className="font-semibold text-amber-300">Justifikasi Tatabahasa: </span>
                {question.justification}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Tutup
          </button>

          <button
            disabled={!isCompleted}
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 transform active:scale-95"
          >
            <span>Selesaikan Misi 01</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
