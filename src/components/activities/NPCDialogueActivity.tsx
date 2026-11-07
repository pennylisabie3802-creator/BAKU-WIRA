/**
 * BAKUWIRA: NPC Structured Dialogue Activity
 * Based on Panel 9: Interaksi NPC - Dialog Berstruktur
 * Enhanced with synchronized lip-sync mouth animation, typewriter dialogue streaming,
 * reactive NPC feedback speech, and Malaysian anime character aesthetic.
 */

import React, { useState, useEffect, useRef } from 'react';
import { MissionQuestion } from '../../types/game';
import {
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FastForward,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NPCAnimatedPortrait } from './NPCAnimatedPortrait';
import { playDialogueChirp } from '../../utils/audioSynth';

interface NPCDialogueActivityProps {
  question: MissionQuestion;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const NPCDialogueActivity: React.FC<NPCDialogueActivityProps> = ({
  question,
  onComplete,
  onClose,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Typewriter and Lip-sync Synchronization State
  const fullDialogueText = question.npcDialoguePrompt || question.prompt || '';
  const [displayedText, setDisplayedText] = useState('');
  const [isTalking, setIsTalking] = useState(false);

  // Spoken feedback state after player responds
  const [displayedFeedback, setDisplayedFeedback] = useState('');
  const [isTalkingFeedback, setIsTalkingFeedback] = useState(false);

  const typewriterTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const selectedChoice = question.originalChoices?.find((c) => c.id === selectedChoiceId);
  const isCorrect = selectedChoice?.isCorrect ?? false;

  const npcName = question.npcName || 'Puan Zahra';
  const npcRole = question.npcRole || 'Ketua Pengajar Detektif Bahasa';

  // ----------------------------------------------------
  // TYPEWRITER & LIP-SYNC EFFECT FOR INITIAL DIALOGUE
  // ----------------------------------------------------
  const startDialogueTypewriter = (textToType: string) => {
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }

    setDisplayedText('');
    setIsTalking(true);

    let charIndex = 0;
    const speed = 26; // ms per char

    typewriterTimerRef.current = window.setInterval(() => {
      charIndex++;
      setDisplayedText(textToType.slice(0, charIndex));

      // Play soft speech chirp on every 3rd letter if sound is enabled
      if (soundEnabled && charIndex % 3 === 0 && textToType[charIndex - 1] !== ' ') {
        playDialogueChirp(npcName);
      }

      if (charIndex >= textToType.length) {
        if (typewriterTimerRef.current) {
          clearInterval(typewriterTimerRef.current);
          typewriterTimerRef.current = null;
        }
        setIsTalking(false);
      }
    }, speed);
  };

  // Start dialogue on mount or when question changes
  useEffect(() => {
    startDialogueTypewriter(fullDialogueText);

    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (feedbackTimerRef.current) clearInterval(feedbackTimerRef.current);
    };
  }, [question.id]);

  // Fast-forward / complete dialogue instantly on click
  const handleSkipOrCompleteDialogue = () => {
    if (isTalking) {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
      }
      setDisplayedText(fullDialogueText);
      setIsTalking(false);
    }
  };

  // Replay initial dialogue speech
  const handleReplayDialogue = () => {
    startDialogueTypewriter(fullDialogueText);
  };

  // ----------------------------------------------------
  // SUBMISSION & SPOKEN FEEDBACK REACTION
  // ----------------------------------------------------
  const handleSubmit = () => {
    if (!selectedChoiceId || !selectedChoice) return;
    setHasSubmitted(true);

    // Make the NPC actively speak the feedback reaction!
    const feedbackText = isCorrect
      ? `Jawapan tepat! ${selectedChoice.feedback}`
      : `Kurang tepat. ${selectedChoice.feedback}`;

    if (feedbackTimerRef.current) {
      clearInterval(feedbackTimerRef.current);
    }

    setDisplayedFeedback('');
    setIsTalkingFeedback(true);

    let feedbackIndex = 0;
    feedbackTimerRef.current = window.setInterval(() => {
      feedbackIndex++;
      setDisplayedFeedback(feedbackText.slice(0, feedbackIndex));

      if (soundEnabled && feedbackIndex % 3 === 0) {
        playDialogueChirp(npcName);
      }

      if (feedbackIndex >= feedbackText.length) {
        if (feedbackTimerRef.current) {
          clearInterval(feedbackTimerRef.current);
          feedbackTimerRef.current = null;
        }
        setIsTalkingFeedback(false);
      }
    }, 24);
  };

  const handleFinish = () => {
    onComplete(isCorrect ? 100 : 50, isCorrect);
  };

  // Combined talking state for the NPC portrait (either talking initial prompt or feedback)
  const isPortraitTalking = isTalking || isTalkingFeedback;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-920 to-slate-950 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-5 py-3 flex items-center justify-between text-slate-950 font-bold shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-950" />
            <span className="tracking-wide text-xs sm:text-sm uppercase font-extrabold">
              Simulasi Interaksi NPC — Dialog Berstruktur
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Suara NPC' : 'Aktifkan Suara NPC'}
              className="px-2 py-1 bg-slate-950/20 hover:bg-slate-950/30 rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Suara: Hidup</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                  <span className="hidden sm:inline text-[11px] opacity-75">Suara: Bisu</span>
                </>
              )}
            </button>
            <span className="text-xs bg-slate-950/20 px-2.5 py-1 rounded-full font-mono">
              {question.id}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* NPC Profile & Synchronized Animated Speech Card */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Animated NPC Character Portrait with Lip-Sync & Blinking */}
            <NPCAnimatedPortrait
              npcName={npcName}
              npcRole={npcRole}
              npcAvatar={question.npcAvatar}
              isTalking={isPortraitTalking}
              size="md"
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />

            {/* Speech Dialogue Bubble */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
                    <span>{npcName}</span>
                    {isTalking && (
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </h4>
                  <p className="text-xs text-purple-300/80 font-medium">{npcRole}</p>
                </div>

                {/* Typewriter Controls */}
                <div className="flex items-center gap-1.5">
                  {isTalking ? (
                    <button
                      onClick={handleSkipOrCompleteDialogue}
                      className="px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg flex items-center gap-1 transition-colors"
                      title="Papar seluruh teks serta-merta"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Pantas</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReplayDialogue}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                      title="Ulang animasi dialog"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Ulang</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Spoken Dialogue Container (Click to complete) */}
              <div
                onClick={handleSkipOrCompleteDialogue}
                className="relative cursor-pointer group bg-slate-900/70 hover:bg-slate-900/90 transition-colors p-3.5 rounded-xl border-l-4 border-amber-500 border-t border-r border-b border-slate-700/60 shadow-inner"
              >
                <p className="text-slate-100 text-sm leading-relaxed min-h-[48px]">
                  "{displayedText}"
                  {isTalking && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-amber-400 animate-pulse align-middle" />
                  )}
                </p>

                {isTalking && (
                  <span className="block mt-1 text-[10px] text-amber-400/70 italic text-right">
                    Tekan petak ini atau klik 'Pantas' untuk langkau animasi
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Player Response Choices */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-2 text-amber-400">
                <HelpCircle className="w-4 h-4" />
                <span>Pilih Tindak Balas Wira Bahasa:</span>
              </span>
              <span className="text-slate-400 font-normal">
                {question.originalChoices?.length || 0} Pilihan
              </span>
            </div>

            <div className="space-y-2.5">
              {question.originalChoices?.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                let btnStyle = 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:border-slate-600';

                if (hasSubmitted) {
                  if (choice.isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-400/60';
                  } else if (isSelected && !choice.isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-950/70 text-rose-200 ring-1 ring-rose-500';
                  } else {
                    btnStyle = 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-50';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-amber-400 bg-amber-500/20 text-amber-100 ring-2 ring-amber-400/60';
                }

                return (
                  <button
                    key={choice.id}
                    disabled={hasSubmitted}
                    onClick={() => setSelectedChoiceId(choice.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 group shadow-sm ${btnStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                          : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                      }`}
                    >
                      {choice.id}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {choice.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Feedback & NPC Reaction (With Talking Animation) */}
          {hasSubmitted && (
            <div
              className={`p-4 rounded-xl border animate-fadeIn space-y-3 ${
                isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-amber-950/50 border-amber-500/60 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Respons Tepat & Menepati Kesantunan Berbahasa!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>Perhatikan Kesantunan & Laras Bahasa</span>
                    </>
                  )}
                </div>

                {isTalkingFeedback && (
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-500/50 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>Ulasan NPC</span>
                  </span>
                )}
              </div>

              {/* NPC Spoken Reaction Text */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-700/60">
                <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                  {displayedFeedback || selectedChoice?.feedback}
                  {isTalkingFeedback && (
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-400 animate-pulse" />
                  )}
                </p>
              </div>

              {/* Justifikasi Tatabahasa / Konsep Pembelajaran */}
              <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>📖 Justifikasi Tatabahasa & Konteks:</span>
                </span>
                <p className="leading-relaxed pl-4 border-l-2 border-amber-400/40 text-slate-300">
                  {question.justification}
                </p>
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
              disabled={!selectedChoiceId}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 transform active:scale-95"
            >
              <span>Hantar Jawapan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
            >
              <span>Selesaikan Interaksi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
