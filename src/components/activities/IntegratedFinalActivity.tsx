/**
 * BAKUWIRA: Integrated Final Challenge Activity (Cabaran Akhir Bersepadu)
 * Misi 21: Selamatkan Kerajaan Bahasa (Peristiwa Khas di Istana Wira Bahasa)
 * 3-Phase Climax Event:
 * FASA 1 - SIASAT: Kenal pasti 4 ungkapan rojak
 * FASA 2 - TULIS: Karang pengumuman diraja dalam bahasa Melayu baku
 * FASA 3 - BERTUTUR: Sampaikan pengumuman melalui rakaman suara 60s
 * Ganjaran Kemenangan: Mahkota BAKUWIRA - Wira Keterampilan Bahasa
 */

import React, { useState, useEffect, useRef } from 'react';
import { MissionQuestion } from '../../types/game';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Search,
  PenTool,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  Award,
} from 'lucide-react';
import { NPCAnimatedPortrait } from './NPCAnimatedPortrait';

interface IntegratedFinalActivityProps {
  question: MissionQuestion;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const IntegratedFinalActivity: React.FC<IntegratedFinalActivityProps> = ({
  question,
  onComplete,
  onClose,
}) => {
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);

  // Fasa 1 state: Spot 4 rojak words
  const rojakTerms = ['Guys', 'royal language event', 'start', 'Please come early'];
  const [spottedTerms, setSpottedTerms] = useState<string[]>([]);

  // Fasa 2 state: Write baku announcement
  const sampleGoodAnswer =
    'Perhatian kepada semua hadirin dan rakyat sekalian. Program bahasa diraja akan bermula esok pada pukul 8.00 pagi di dewan. Semua hadirin diminta hadir lebih awal. Sekian, terima kasih.';
  const [writingInput, setWritingInput] = useState(
    'Perhatian kepada semua hadirin,\n\nProgram bahasa diraja akan bermula esok pada pukul 8.00 pagi...'
  );
  const [fasa2Submitted, setFasa2Submitted] = useState(false);

  // Fasa 3 state: 60s speech proclamation
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Final Victory State
  const [isVictorious, setIsVictorious] = useState(false);

  // FASA 1: Toggle spotted term
  const handleSpotTerm = (term: string) => {
    if (!spottedTerms.includes(term)) {
      const next = [...spottedTerms, term];
      setSpottedTerms(next);
      if (next.length === rojakTerms.length) {
        // All terms spotted! Auto proceed to Phase 2 after short delay
        setTimeout(() => {
          setCurrentPhase(2);
        }, 1200);
      }
    }
  };

  // FASA 2: Submit writing
  const handleFasa2Submit = () => {
    if (writingInput.trim().length > 30) {
      setFasa2Submitted(true);
      setTimeout(() => {
        setCurrentPhase(3);
      }, 1000);
    }
  };

  // FASA 3: Speech Recording with MediaRecorder API
  const startRecording = async () => {
    setSecondsRecorded(0);
    audioChunksRef.current = [];
    setIsRecording(true);
    setHasRecorded(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch {
      // Graceful fallback if mic not available
    }

    timerRef.current = window.setInterval(() => {
      setSecondsRecorded((prev) => {
        if (prev >= 59) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleClaimVictory = () => {
    setIsVictorious(true);
  };

  const handleFinishMission21 = () => {
    onComplete(100, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 border-2 border-amber-500/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 px-6 py-3.5 flex items-center justify-between text-slate-950 font-black shadow-lg shrink-0">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-slate-950 fill-amber-300" />
            <span className="tracking-wide text-xs sm:text-base uppercase font-black">
              Misi 21: Selamatkan Kerajaan Bahasa — Cabaran Penamat
            </span>
          </div>
          <span className="text-xs bg-slate-950/20 px-3 py-1 rounded-full font-mono font-bold">
            Fasa {currentPhase} / 3
          </span>
        </div>

        {/* 3-Phase Stepper Ribbon */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-amber-500/30 flex items-center justify-between text-xs font-bold shrink-0">
          <div
            className={`flex items-center gap-2 ${
              currentPhase === 1 ? 'text-amber-400 font-extrabold' : spottedTerms.length === 4 ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-800 text-[11px] border border-current">
              1
            </span>
            <span>SIASAT (Kesan Rojak)</span>
          </div>

          <span className="text-slate-600">➔</span>

          <div
            className={`flex items-center gap-2 ${
              currentPhase === 2 ? 'text-amber-400 font-extrabold' : fasa2Submitted ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-800 text-[11px] border border-current">
              2
            </span>
            <span>TULIS (Baku)</span>
          </div>

          <span className="text-slate-600">➔</span>

          <div
            className={`flex items-center gap-2 ${
              currentPhase === 3 ? 'text-amber-400 font-extrabold' : hasRecorded ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-800 text-[11px] border border-current">
              3
            </span>
            <span>BERTUTUR (60s)</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* NPC Raja Bahasa Message Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/40 flex items-start gap-4">
            <NPCAnimatedPortrait
              npcName="Tuanku Raja Bahasa"
              npcRole="Pemerintah Dunia Bahasa"
              npcAvatar="👑"
              isTalking={currentPhase === 1 && spottedTerms.length < 4}
              size="sm"
            />
            <div className="space-y-1 flex-1">
              <h4 className="text-base font-bold text-amber-300">Tuanku Raja Bahasa</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                "{question.npcDialoguePrompt ||
                  'Inilah saat penentuan kemuncak! Inti Kekeliruan Bahasa telah mencemari draf titah pengumuman diraja. Selesaikan 3 Fasa pemulihan untuk memulihkan seluruh Kerajaan Bahasa!'}"
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FASA 1: SIASAT */}
          {/* ========================================================= */}
          {currentPhase === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Search className="w-4 h-4" />
                <span>Fasa 1 — Siasat: Kenal Pasti 4 Ungkapan Bahasa Rojak</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-purple-950/40 border-2 border-rose-500/50 space-y-3 text-center">
                <p className="text-xs text-rose-300 font-medium">
                  Tekan semua perkataan atau frasa bahasa Inggeris yang dicampurkan dalam draf pengumuman istana di bawah:
                </p>

                <div className="text-base sm:text-lg font-bold leading-relaxed text-slate-100 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  “
                  {['Guys', ',', ' ', 'royal language event', ' ', 'start', ' ', 'esok pukul 8.', ' ', 'Please come early', ' ', 'ke dewan!'].map(
                    (part, i) => {
                      const isRojak = rojakTerms.includes(part);
                      const isSpotted = spottedTerms.includes(part);

                      if (isRojak) {
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSpotTerm(part)}
                            className={`inline-block mx-1 my-1 px-3 py-1 rounded-lg font-extrabold transition-all transform ${
                              isSpotted
                                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                                : 'bg-rose-900 text-rose-200 border border-rose-400 hover:bg-rose-800 hover:scale-105 active:scale-95 cursor-pointer animate-pulse'
                            }`}
                          >
                            {part}
                            {isSpotted && ' ✓'}
                          </button>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    }
                  )}
                  ”
                </div>

                <div className="flex items-center justify-center gap-4 text-xs font-bold">
                  <span className="text-amber-300">
                    Dikesan: {spottedTerms.length} / {rojakTerms.length}
                  </span>
                  {spottedTerms.length === 4 && (
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai! Beralih ke Fasa 2...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FASA 2: TULIS */}
          {/* ========================================================= */}
          {currentPhase === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <PenTool className="w-4 h-4" />
                <span>Fasa 2 — Tulis: Karang Pengumuman Rasmi dalam Bahasa Melayu Baku</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs text-amber-300 font-semibold">
                  Maklumat Penting untuk Disertakan:
                </div>
                <div className="text-xs text-slate-300 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Nama: Program Bahasa Diraja</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Masa: Esok, 8.00 pagi</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Tempat: Dewan Istana</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Ajakan: Sila hadir lebih awal</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Helaian Penulisan Pengumuman Diraja:
                </label>
                <textarea
                  value={writingInput}
                  onChange={(e) => setWritingInput(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWritingInput(sampleGoodAnswer)}
                  className="text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  Muatkan Contoh Jawapan Rujukan Baku
                </button>

                <button
                  type="button"
                  onClick={handleFasa2Submit}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Sahkan & Teruskan ke Fasa 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FASA 3: BERTUTUR */}
          {/* ========================================================= */}
          {currentPhase === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Mic className="w-4 h-4" />
                <span>Fasa 3 — Bertutur: Sampaikan Pengumuman Pemulihan (Maksimum 60 Saat)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-300">Teks Pengumuman Anda:</span>
                <p className="text-xs sm:text-sm text-slate-200 italic p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  "{writingInput}"
                </p>
              </div>

              {/* Microphone Recorder Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-emerald-500/50 flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl ${
                      isRecording
                        ? 'bg-rose-500 text-white shadow-rose-500/50 scale-110 animate-pulse ring-4 ring-rose-300'
                        : hasRecorded
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  </div>

                  <div className="text-left">
                    <div className="text-2xl font-mono font-black text-amber-300">
                      00:{secondsRecorded.toString().padStart(2, '0')} / 01:00
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {isRecording ? 'Sedang merakam suara...' : hasRecorded ? 'Rakaman selesai!' : 'Tekan butang untuk mula'}
                    </span>
                  </div>
                </div>

                {/* Recorder Control Buttons */}
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{hasRecorded ? 'Rakam Semula' : 'Mula Rakam Ucapan'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 animate-bounce"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>Hentikan Rakaman</span>
                    </button>
                  )}
                </div>

                {/* Audio playback */}
                {audioUrl && (
                  <div className="w-full pt-2">
                    <audio src={audioUrl} controls className="w-full h-9 rounded-lg" />
                  </div>
                )}
              </div>

              {/* Victory Trigger */}
              {hasRecorded && !isVictorious && (
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-center space-y-3 animate-fadeIn">
                  <div className="text-sm font-bold text-emerald-300 flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Ketiga-tiga Fasa Misi 21 Berjaya Dilengkapkan!</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Tahniah! Anda telah menyiasat ungkapan rojak, menulis teks baku, dan menyampaikan pengumuman pemulihan diraja dengan jayanya.
                  </p>
                  <button
                    type="button"
                    onClick={handleClaimVictory}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:scale-105 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 mx-auto transition-transform"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Terima Mahkota BAKUWIRA!</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* FINAL VICTORY CEREMONY */}
          {/* ========================================================= */}
          {isVictorious && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-yellow-950/90 border-2 border-amber-400 text-center space-y-4 animate-fadeIn shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl mx-auto shadow-xl ring-4 ring-amber-300 animate-bounce">
                👑
              </div>

              <h3 className="text-2xl font-black text-amber-300">
                TAHNIAH, WIRA BAHASA AGUNG!
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg mx-auto">
                Seluruh Kerajaan Bahasa kini telah pulih daripada ancaman Bahasa Rojak! Dengan kebijaksanaan menyiasat, kemahiran menulis, dan keterampilan bertutur baku, kamu telah dimahkotakan sebagai:
                <br />
                <span className="text-base font-extrabold text-amber-400">
                  Mahkota BAKUWIRA — Wira Keterampilan Bahasa
                </span>
              </p>

              <button
                type="button"
                onClick={handleFinishMission21}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl transition-all transform hover:scale-105"
              >
                Lihat Penamat & Kredit BAKUWIRA ➔
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Tutup
          </button>

          {!isVictorious && (
            <span className="text-[11px] text-amber-400/80">
              Lengkapkan Fasa 1, 2 dan 3 untuk menyelamatkan kerajaan
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
