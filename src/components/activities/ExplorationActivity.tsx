/**
 * BAKUWIRA: 3D Exploration & Hologram Clue Resolver
 * Direct inspection of rojak anomalies found during 3D scene traversal.
 */

import React, { useState } from 'react';
import { ClueItem, MissionQuestion } from '../../types/game';
import { Compass, Sparkles, CheckCircle2, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExplorationActivityProps {
  question: MissionQuestion;
  clueId?: string;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const ExplorationActivity: React.FC<ExplorationActivityProps> = ({
  question,
  clueId,
  onComplete,
  onClose,
}) => {
  const clues = question.explorationClues || [];
  const [resolvedClueIds, setResolvedClueIds] = useState<string[]>(clueId ? [clueId] : []);
  const [activeClueIndex, setActiveClueIndex] = useState(
    clueId ? Math.max(0, clues.findIndex((c) => c.id === clueId)) : 0
  );

  const currentClue: ClueItem | undefined = clues[activeClueIndex] || clues[0];

  const handleResolveClue = (id: string) => {
    if (!resolvedClueIds.includes(id)) {
      const next = [...resolvedClueIds, id];
      setResolvedClueIds(next);
    }
  };

  const isAllResolved = clues.length > 0 && resolvedClueIds.length >= clues.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-cyan-600 px-6 py-3 flex items-center justify-between text-slate-950 font-bold shadow-md">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-950" />
            <span className="tracking-wide text-sm uppercase">Penerokaan & Imbasan Glit Bahasa</span>
          </div>
          <span className="text-xs bg-slate-950/20 px-2.5 py-1 rounded-full font-mono">
            {resolvedClueIds.length} / {clues.length} Diimbas
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Directive */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{question.title}</span>
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed">
              {question.prompt}
            </p>
          </div>

          {/* Clues Tabs */}
          {clues.length > 1 && (
            <div className="flex gap-2">
              {clues.map((c, idx) => {
                const isResolved = resolvedClueIds.includes(c.id);
                const isActive = idx === activeClueIndex;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveClueIndex(idx)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : isResolved
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <span>{c.label}</span>
                    {isResolved && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Clue Breakdown */}
          {currentClue ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Kandungan Asal Bercampur Bahasa Rojak:</span>
                </div>
                <p className="text-slate-200 text-sm italic font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  "{currentClue.rojakText}"
                </p>
              </div>

              {resolvedClueIds.includes(currentClue.id) ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Penulenan Bahasa Melayu Baku:</span>
                  </div>
                  <p className="text-emerald-200 text-sm font-semibold bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    "{currentClue.bakuText}"
                  </p>
                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <span className="font-semibold text-cyan-300">Penerangan Tatabahasa: </span>
                    {currentClue.explanation}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleResolveClue(currentClue.id)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Imbas & Pulihkan Glit Kepada Bahasa Baku</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center p-6 text-slate-400">Tiada petunjuk tersedia.</div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Tutup
          </button>

          {isAllResolved ? (
            <button
              onClick={() => onComplete(100, true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <span>Semua Glit Dipulihkan! Kumpul Ganjaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic">
              Imbas semua {clues.length} petunjuk untuk melengkapkan penerokaan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
