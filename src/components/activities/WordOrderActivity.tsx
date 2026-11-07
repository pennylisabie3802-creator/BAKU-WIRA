/**
 * BAKUWIRA: Word Order Activity (Susun Kad Perkataan)
 * Tailored for Misi 09: Baiki Ayat Rosak (Mesin Susun Ayat - Bengkel Bahasa Melayu)
 */

import React, { useState } from 'react';
import { MissionQuestion } from '../../types/game';
import { Sparkles, CheckCircle2, ArrowRight, Lightbulb, RotateCcw, Wrench } from 'lucide-react';

interface WordOrderActivityProps {
  question: MissionQuestion;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const WordOrderActivity: React.FC<WordOrderActivityProps> = ({
  question,
  onComplete,
  onClose,
}) => {
  const referenceSentence =
    question.structuredAnswer?.referenceSentence ||
    'Saya sudah menghantar kerja sekolah kepada cikgu.';

  // Split reference sentence into words/tokens
  const wordsTarget = ['Saya', 'sudah', 'menghantar', 'kerja sekolah', 'kepada', 'cikgu.'];

  // Shuffled word cards
  const [availableCards, setAvailableCards] = useState<string[]>(() => {
    return [...wordsTarget].sort(() => Math.random() - 0.5);
  });

  const [placedCards, setPlacedCards] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCardClick = (word: string, fromPlaced: boolean, index: number) => {
    setErrorMessage(null);
    if (fromPlaced) {
      // Remove from placed, put back to available
      const nextPlaced = [...placedCards];
      nextPlaced.splice(index, 1);
      setPlacedCards(nextPlaced);
      setAvailableCards((prev) => [...prev, word]);
    } else {
      // Add to placed
      const nextAvailable = [...availableCards];
      nextAvailable.splice(index, 1);
      setAvailableCards(nextAvailable);
      const nextPlaced = [...placedCards, word];
      setPlacedCards(nextPlaced);

      // Check if all placed
      if (nextPlaced.length === wordsTarget.length) {
        checkSentence(nextPlaced);
      }
    }
  };

  const checkSentence = (cards: string[]) => {
    const constructed = cards.join(' ');
    const targetClean = wordsTarget.join(' ');

    if (constructed.toLowerCase() === targetClean.toLowerCase()) {
      setIsSuccess(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('Susunan belum tepat. Sila semak tatabahasa mengikut hukum D-M dan kata sendi nama yang betul.');
    }
  };

  const handleReset = () => {
    setPlacedCards([]);
    setAvailableCards([...wordsTarget].sort(() => Math.random() - 0.5));
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const handleFinish = () => {
    onComplete(100, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-920 to-slate-950 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-5 py-3 flex items-center justify-between text-slate-950 font-bold shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-slate-950" />
            <span className="tracking-wide text-xs sm:text-sm uppercase font-extrabold">
              Mesin Susun Ayat: Baiki Ayat Rosak
            </span>
          </div>
          <span className="text-xs bg-slate-950/20 px-2.5 py-1 rounded-full font-mono font-bold">
            {question.id}
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

          {/* Ayat Rosak Asal */}
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
              Ayat Rosak Tercemar:
            </span>
            <p className="text-sm sm:text-base font-semibold text-rose-200 italic font-mono">
              “{question.sourceContent?.bahanDialogSoalan || 'Saya already submit homework dekat cikgu.'}”
            </p>
          </div>

          {/* Slot Susunan Ayat (Placed Cards Area) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-dashed border-amber-500/50 min-h-[90px] flex flex-wrap items-center gap-2">
            {placedCards.length === 0 ? (
              <span className="text-xs sm:text-sm text-slate-500 italic w-full text-center">
                Tekan kad-kad perkataan di bawah untuk menyusunnya ke dalam slot ayat baku ini...
              </span>
            ) : (
              placedCards.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  onClick={() => handleCardClick(word, true, idx)}
                  className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 transform hover:scale-105 active:scale-95 ${
                    isSuccess
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/40'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  }`}
                  title="Klik untuk kembalikan kad"
                >
                  <span>{word}</span>
                  <span className="text-[10px] opacity-60">✕</span>
                </button>
              ))
            )}
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs flex items-center justify-between animate-fadeIn">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 font-bold text-[11px] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Susun Semula</span>
              </button>
            </div>
          )}

          {/* Available Cards Tray */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span>Pilihan Kad Perkataan Baku:</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tetap Semula Kad</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              {availableCards.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  onClick={() => handleCardClick(word, false, idx)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 hover:border-amber-400/60 font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:scale-105 active:scale-95"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border-2 border-emerald-500 text-emerald-200 shadow-xl space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Mesin Susun Ayat Berjaya Dibaiki & Diaktifkan!</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ayat Gramatis Lengkap:
                <br />
                <span className="font-bold text-emerald-300 text-sm">
                  “{referenceSentence}”
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
            disabled={!isSuccess}
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 transform active:scale-95"
          >
            <span>Selesaikan Misi 09</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
