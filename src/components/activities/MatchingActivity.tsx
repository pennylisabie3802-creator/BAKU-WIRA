/**
 * BAKUWIRA: Matching Activity (Padanan Seret / Ketuk)
 * Tailored for Misi 07: Eksperimen Bahasa (Makmal Kata)
 * and Misi 11: Khazanah Digital (Perpustakaan Kosa Kata).
 */

import React, { useState } from 'react';
import { MissionQuestion } from '../../types/game';
import { Sparkles, CheckCircle2, ArrowRight, Lightbulb, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

interface MatchingActivityProps {
  question: MissionQuestion;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const MatchingActivity: React.FC<MatchingActivityProps> = ({
  question,
  onComplete,
  onClose,
}) => {
  // Pairs from question
  const defaultPairs: [string, string][] = [
    ['submit', 'hantar'],
    ['feedback', 'maklum balas'],
    ['update', 'kemas kini'],
    ['share', 'kongsi'],
  ];

  const pairs: [string, string][] = question.structuredAnswer?.pairs || defaultPairs;

  const [matchedTerms, setMatchedTerms] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Right side options shuffled once
  const [rightOptions] = useState<string[]>(() => {
    return [...pairs.map((p) => p[1])].sort(() => Math.random() - 0.5);
  });

  const isComplete = matchedTerms.length === pairs.length;
  const isLabMachine = question.id === 'BW-M07';

  const handleSelectLeft = (term: string) => {
    if (matchedTerms.includes(term)) return;
    setFeedbackMsg(null);
    setSelectedLeft(term);

    if (selectedRight) {
      evaluatePair(term, selectedRight);
    }
  };

  const handleSelectRight = (term: string) => {
    const isAlreadyMatched = pairs.some((p) => matchedTerms.includes(p[0]) && p[1] === term);
    if (isAlreadyMatched) return;

    setFeedbackMsg(null);
    setSelectedRight(term);

    if (selectedLeft) {
      evaluatePair(selectedLeft, term);
    }
  };

  const evaluatePair = (left: string, right: string) => {
    const isMatch = pairs.some((p) => p[0] === left && p[1] === right);
    if (isMatch) {
      setMatchedTerms((prev) => [...prev, left]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setFeedbackMsg({
        text: `Tepat sekali! "${left}" dipadankan dengan "${right}".`,
        isError: false,
      });
    } else {
      setFeedbackMsg({
        text: `Kurang tepat. Istilah "${left}" tidak sepadan dengan "${right}". Sila cuba lagi.`,
        isError: true,
      });
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 900);
    }
  };

  const handleFinish = () => {
    onComplete(100, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-920 to-slate-950 border-2 border-indigo-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 flex items-center justify-between text-white font-bold shadow-md shrink-0">
          <div className="flex items-center gap-2">
            {isLabMachine ? <Cpu className="w-5 h-5 text-cyan-300" /> : <BookOpen className="w-5 h-5 text-amber-300" />}
            <span className="tracking-wide text-xs sm:text-sm uppercase font-extrabold">
              {isLabMachine ? 'Makmal Kata: Eksperimen Menghidupkan Mesin' : 'Perpustakaan Kosa Kata: Membuka Buku Ajaib'}
            </span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono font-bold">
            {matchedTerms.length} / {pairs.length} Padanan
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Directive Card */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{question.title}</span>
            </h4>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {question.sourceContent?.arahanPemain || question.prompt}
            </p>
          </div>

          {/* Interactive Progress Display (Magic Machine Gears / 4 Books) */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/30 text-center space-y-3">
            <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>{isLabMachine ? '⚙️ Status Jana Kuasa Mesin Ajaib' : '📚 Status Kunci 4 Buku Khazanah'}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {pairs.map(([eng, malay], idx) => {
                const isActivated = matchedTerms.includes(eng);

                return (
                  <div
                    key={eng}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isActivated
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-2xl mb-1">{isActivated ? (isLabMachine ? '⚡' : '📖') : (isLabMachine ? '⚙️' : '🔒')}</span>
                    <span className="text-[11px] font-bold capitalize">{eng}</span>
                    <span className="text-[10px] opacity-75">{isActivated ? malay : 'Terkunci'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback banner */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl border text-xs animate-fadeIn ${
                feedbackMsg.isError
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                  : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
              }`}
            >
              {feedbackMsg.text}
            </div>
          )}

          {/* Dual Columns for Matching */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Column (Istilah Bahasa Inggeris) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                1. Pilih Istilah Digital (Inggeris):
              </span>
              <div className="space-y-2">
                {pairs.map(([eng]) => {
                  const isMatched = matchedTerms.includes(eng);
                  const isSelected = selectedLeft === eng;

                  return (
                    <button
                      key={eng}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleSelectLeft(eng)}
                      className={`w-full p-3.5 rounded-xl border font-bold text-sm text-left flex items-center justify-between transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 line-through opacity-60'
                          : isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-300 shadow-md'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <span className="font-mono">{eng}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column (Padanan Bahasa Melayu Baku) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                2. Pilih Padanan Melayu Baku:
              </span>
              <div className="space-y-2">
                {rightOptions.map((malay) => {
                  const isMatched = pairs.some(
                    (p) => matchedTerms.includes(p[0]) && p[1] === malay
                  );
                  const isSelected = selectedRight === malay;

                  return (
                    <button
                      key={malay}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleSelectRight(malay)}
                      className={`w-full p-3.5 rounded-xl border font-bold text-sm text-left flex items-center justify-between transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 line-through opacity-60'
                          : isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300 shadow-md'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <span>{malay}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {isComplete && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border-2 border-emerald-500 text-emerald-200 shadow-xl space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>
                  {isLabMachine
                    ? 'Mesin Makmal Kata Berjaya Dihidupkan Sepenuhnya!'
                    : 'Kesemua 4 Buku Khazanah Berjaya Dibuka & Ditambah ke Inventori!'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {question.sourceContent?.jawapanPanduanPenilaian}
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-300">
                <span className="font-semibold text-amber-300">Justifikasi: </span>
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
            disabled={!isComplete}
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 transform active:scale-95"
          >
            <span>Selesaikan Aktiviti Padanan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
