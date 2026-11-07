/**
 * BAKUWIRA: Interactive Quiz Activity
 * Supports both Single Choice (1 jawapan) and Multiple Choice (berbilang jawapan).
 * Includes educational justifications, option feedback, and image support.
 */

import React, { useState } from 'react';
import { MissionQuestion, QuizChoice } from '../../types/game';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, BookOpen, Lightbulb, CheckSquare, Square } from 'lucide-react';

interface QuizActivityProps {
  question: MissionQuestion;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const QuizActivity: React.FC<QuizActivityProps> = ({
  question,
  onComplete,
  onClose,
}) => {
  // Determine if multiple choice
  const isMultiple =
    question.activityType === 'multiple_choice' ||
    (question.structuredAnswer?.correctKeys && question.structuredAnswer.correctKeys.length > 1);

  // Derive choices from originalChoices or structuredAnswer.options
  const choices: QuizChoice[] =
    question.originalChoices ||
    (question.structuredAnswer?.options?.map((opt) => ({
      id: opt.key,
      text: opt.text,
      isCorrect: question.structuredAnswer?.correctKeys?.includes(opt.key) ?? false,
      feedback:
        question.structuredAnswer?.correctKeys?.includes(opt.key)
          ? 'Pilihan tepat berdasarkan situasi.'
          : 'Pilihan ini kurang tepat atau tidak boleh digeneralisasikan.',
    })) ?? []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleToggle = (id: string) => {
    if (hasSubmitted) return;
    if (isMultiple) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  // Evaluation
  const correctKeys = choices.filter((c) => c.isCorrect).map((c) => c.id);
  const isFullyCorrect =
    correctKeys.length === selectedIds.length &&
    correctKeys.every((k) => selectedIds.includes(k));

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    setHasSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-920 to-slate-950 border-2 border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-5 py-3 flex items-center justify-between text-white font-bold shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-200" />
            <span className="tracking-wide text-xs sm:text-sm uppercase font-extrabold">
              {isMultiple ? 'Kuiz Berbilang Jawapan' : 'Kuiz Aneka Pilihan'} — Bahasa Melayu
            </span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono font-bold">
            {question.id}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Question Prompt */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{question.title}</span>
            </h4>
            <p className="text-slate-100 text-sm sm:text-base font-semibold leading-relaxed">
              {question.sourceContent?.bahanDialogSoalan || question.prompt}
            </p>
            {isMultiple && (
              <span className="inline-block text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/40">
                ⚠️ Tandakan SEMUA pilihan jawapan yang munasabah (lebih daripada satu jawapan).
              </span>
            )}
          </div>

          {/* Supporting Image if present */}
          {question.supportingImage && (
            <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-48 flex items-center justify-center bg-slate-950">
              <img
                src={question.supportingImage}
                alt={question.title}
                className="max-h-48 object-contain"
              />
            </div>
          )}

          {/* Choices List */}
          <div className="space-y-2.5">
            {choices.map((choice) => {
              const isSelected = selectedIds.includes(choice.id);
              let choiceStyle = 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200';

              if (hasSubmitted) {
                if (choice.isCorrect) {
                  choiceStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500/50';
                } else if (isSelected && !choice.isCorrect) {
                  choiceStyle = 'border-rose-500 bg-rose-950/70 text-rose-200 ring-1 ring-rose-500';
                } else {
                  choiceStyle = 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-50';
                }
              } else if (isSelected) {
                choiceStyle = 'border-blue-400 bg-blue-500/20 text-blue-100 ring-2 ring-blue-400/50';
              }

              return (
                <button
                  key={choice.id}
                  disabled={hasSubmitted}
                  onClick={() => handleToggle(choice.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 group shadow-sm ${choiceStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isSelected
                        ? 'bg-blue-400 text-slate-950 shadow scale-105'
                        : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                    }`}
                  >
                    {isMultiple ? (
                      isSelected ? '✓' : choice.id
                    ) : (
                      choice.id
                    )}
                  </span>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-medium leading-relaxed block">
                      {choice.text}
                    </span>
                    {hasSubmitted && (isSelected || choice.isCorrect) && (
                      <p className="mt-2 text-xs text-slate-300 font-normal italic border-t border-slate-700/40 pt-1.5">
                        {choice.feedback}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Justification & Rule */}
          {hasSubmitted && (
            <div
              className={`p-4 rounded-xl border animate-fadeIn space-y-2 ${
                isFullyCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {isFullyCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Jawapan Tepat & Lengkap!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>Pilihan Kurang Tepat / Belum Lengkap</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {question.sourceContent?.jawapanPanduanPenilaian}
              </p>
              <div className="text-xs leading-relaxed text-slate-300 pt-2 border-t border-slate-700/60">
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

          {!hasSubmitted ? (
            <button
              disabled={selectedIds.length === 0}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 transform active:scale-95"
            >
              <span>Sahkan Jawapan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onComplete(isFullyCorrect ? 100 : 50, isFullyCorrect)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
            >
              <span>Selesaikan Kuiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
