/**
 * BAKUWIRA: Writing Challenge Activity (Latihan Menulis)
 * Supports:
 * - writing_rewrite (Misi 03)
 * - investigation_writing (Misi 05 with clock/location evidence icons, Misi 18)
 * - writing_message (Misi 10)
 * - writing_announcement (Misi 12 with 30-50 word counter)
 * - writing_invitation (Misi 17)
 * 
 * Rubrik Penulisan Rasmi:
 * - Ketepatan bahasa Melayu baku: 30%
 * - Tatabahasa: 25%
 * - Kesesuaian laras bahasa: 20%
 * - Kejelasan penyampaian: 15%
 * - Kesantunan: 10%
 */

import React, { useState, useMemo } from 'react';
import { MissionQuestion } from '../../types/game';
import {
  PenTool,
  CheckCircle2,
  RotateCcw,
  Award,
  Sparkles,
  FileText,
  Clock,
  MapPin,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface WritingActivityProps {
  question: MissionQuestion;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const WritingActivity: React.FC<WritingActivityProps> = ({
  question,
  onComplete,
  onClose,
}) => {
  const isInvestigation = question.activityType === 'investigation_writing' || question.id === 'BW-M05' || question.id === 'BW-M18';
  const isAnnouncement = question.activityType === 'writing_announcement' || question.id === 'BW-M12';

  // Evidence tracking for investigation missions (Misi 05: time and place)
  const [evidenceFound, setEvidenceFound] = useState<{ time: boolean; place: boolean }>({
    time: false,
    place: false,
  });

  const [textInput, setTextInput] = useState(() => {
    if (question.id === 'BW-M03') return 'Selamat pagi, cikgu. Saya...';
    if (question.id === 'BW-M05') return 'Kawan-kawan, kita akan mengadakan perjumpaan esok pada pukul...';
    if (question.id === 'BW-M10') return 'Selamat pagi, cikgu. Saya ingin bertanya tentang...';
    if (question.id === 'BW-M12') return 'Perhatian kepada semua murid. Gotong-royong Perdana akan diadakan pada hari Sabtu...';
    if (question.id === 'BW-M17') return 'Dengan segala hormatnya, anda dijemput ke Sambutan Minggu Bahasa...';
    if (question.id === 'BW-M18') return 'Kawan-kawan, program bahasa akan bermula esok...';
    return question.writingTask?.promptTemplate || 'Selamat pagi, cikgu...';
  });

  const [showHint, setShowHint] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // Word count helper
  const wordCount = useMemo(() => {
    return textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  }, [textInput]);

  // Sample answer from question
  const sampleAnswer =
    question.structuredAnswer?.referenceSentence ||
    question.sourceContent?.jawapanPanduanPenilaian ||
    question.correctAnswerText ||
    'Perhatian kepada semua murid. Program akan diadakan dengan jayanya. Terima kasih.';

  // Official Rubric Evaluation (Ketepatan 30%, Tatabahasa 25%, Laras 20%, Kejelasan 15%, Kesantunan 10%)
  const [rubricResult, setRubricResult] = useState<{
    scores: { name: string; mark: number; max: number }[];
    total: number;
    feedback: string;
    passed: boolean;
  } | null>(null);

  const handleEvaluate = () => {
    const lower = textInput.toLowerCase();
    const rojakSlangs = ['sy', 'xdtg', 'x dpt', 'dtg', 'sklh', 'sbb', 'guys', 'meeting', 'event', 'start', 'postpone', 'urgent', 'homework', 'submit'];
    let rojakHits = 0;
    rojakSlangs.forEach((w) => {
      if (lower.includes(w)) rojakHits++;
    });

    const hasGreeting = lower.includes('selamat') || lower.includes('salam') || lower.includes('perhatian') || lower.includes('tuan');
    const hasThanks = lower.includes('terima kasih') || lower.includes('sekian');
    const isAppropriateLength = wordCount >= 6;

    // Scores according to official percentages
    const ketepatan = Math.max(15, 30 - rojakHits * 4);
    const tatabahasa = Math.max(14, 25 - rojakHits * 3);
    const laras = hasGreeting ? 20 : 13;
    const kejelasan = isAppropriateLength ? 15 : 10;
    const kesantunan = hasThanks || hasGreeting ? 10 : 6;

    const total = ketepatan + tatabahasa + laras + kejelasan + kesantunan;
    const passed = total >= 70 && rojakHits === 0;

    setRubricResult({
      scores: [
        { name: 'Ketepatan Bahasa Baku', mark: ketepatan, max: 30 },
        { name: 'Tatabahasa', mark: tatabahasa, max: 25 },
        { name: 'Kesesuaian Laras Bahasa', mark: laras, max: 20 },
        { name: 'Kejelasan Penyampaian', mark: kejelasan, max: 15 },
        { name: 'Kesantunan', mark: kesantunan, max: 10 },
      ],
      total,
      passed,
      feedback:
        rojakHits > 0
          ? `Terdapat ${rojakHits} singkatan atau perkataan bahasa rojak yang belum dimurnikan sepenuhnya. Sila semak semula ayat anda!`
          : isAnnouncement && (wordCount < 30 || wordCount > 50)
          ? `Panjang teks anda ialah ${wordCount} patah perkataan. Pengumuman rasmi sekolah disarankan antara 30 hingga 50 patah perkataan.`
          : 'Penulisan sangat cemerlang, gramatis, dan mematuhi laras bahasa Melayu baku!',
    });
    setHasEvaluated(true);
  };

  const handleRetry = () => {
    setHasEvaluated(false);
    setRubricResult(null);
  };

  const handleFinish = () => {
    const score = rubricResult?.total || 85;
    onComplete(score, score >= 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-920 to-slate-950 border-2 border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-5 py-3 flex items-center justify-between text-white font-bold shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-emerald-200" />
            <span className="tracking-wide text-xs sm:text-sm uppercase font-extrabold">
              Cabaran Penulisan & Pemurnian Ayat Baku
            </span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono font-bold">
            {question.id}
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Directive Card */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{question.title}</span>
            </h4>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {question.sourceContent?.arahanPemain || question.prompt}
            </p>
          </div>

          {/* Bahan Dialog Asal (jika ada) */}
          {question.sourceContent?.bahanDialogSoalan && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                Bahan Sumber / Mesej Asal:
              </span>
              <p className="text-xs sm:text-sm font-medium text-rose-200 italic font-mono">
                {question.sourceContent.bahanDialogSoalan}
              </p>
            </div>
          )}

          {/* Investigation Clue Clickers for Misi 05 */}
          {isInvestigation && question.id === 'BW-M05' && (
            <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2.5">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                1. Klik Dua Ikon Bukti Maklumat Tidak Jelas:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEvidenceFound((prev) => ({ ...prev, time: true }))}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    evidenceFound.time
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Clock className="w-5 h-5 text-amber-400" />
                  <div className="text-left">
                    <span className="text-xs font-bold block">Bukti 1: Masa Tidak Jelas</span>
                    <span className="text-[10px] opacity-75">
                      {evidenceFound.time ? 'Dikenal pasti! (cth: 10.00 pagi)' : 'Tekan untuk periksa'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEvidenceFound((prev) => ({ ...prev, place: true }))}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    evidenceFound.place
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div className="text-left">
                    <span className="text-xs font-bold block">Bukti 2: Tempat Tidak Jelas</span>
                    <span className="text-[10px] opacity-75">
                      {evidenceFound.place ? 'Dikenal pasti! (cth: di perpustakaan)' : 'Tekan untuk periksa'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Writing Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span>Ruang Penulisan Jawapan Wira:</span>
              <span className={`font-mono text-xs ${isAnnouncement && (wordCount < 30 || wordCount > 50) ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                {wordCount} patah perkataan {isAnnouncement && '(Sasaran: 30–50)'}
              </span>
            </div>

            <textarea
              value={textInput}
              disabled={hasEvaluated}
              onChange={(e) => setTextInput(e.target.value)}
              rows={4}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-slate-100 font-medium text-xs sm:text-sm leading-relaxed focus:outline-none transition-all"
              placeholder="Tulis jawapan atau pembetulan ayat anda di sini..."
            />

            {/* Helper Buttons: Petunjuk & Contoh Pembetulan */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint ? 'Tutup Petunjuk' : 'Butang Petunjuk'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showSampleAnswer ? 'Tutup Contoh' : 'Contoh Pembetulan'}</span>
                </button>
              </div>

              {!hasEvaluated && (
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={textInput.trim().length === 0}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-40"
                >
                  Semak Jawapan Penulisan
                </button>
              )}
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-1 animate-fadeIn">
                <span className="font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Petunjuk Penulisan:</span>
                </span>
                <p className="leading-relaxed text-slate-300">
                  {question.hints?.join(' ') ||
                    'Elakkan singkatan SMS (sy, x dpt, sbb). Gunakan salam, nyatakan tujuan dengan tepat, dan akhiri dengan ucapan terima kasih.'}
                </p>
              </div>
            )}

            {/* Sample Answer Box */}
            {showSampleAnswer && (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs space-y-1 animate-fadeIn">
                <span className="font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Contoh Pembetulan Rujukan:</span>
                </span>
                <p className="leading-relaxed font-medium text-slate-200 italic">
                  “{sampleAnswer}”
                </p>
              </div>
            )}
          </div>

          {/* Rubric Assessment Result Card */}
          {hasEvaluated && rubricResult && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-slate-100">
                    Penilaian Rubrik Keterampilan Menulis
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400">
                    {rubricResult.total} / 100
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    Markah Keseluruhan
                  </span>
                </div>
              </div>

              {/* Rubric Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rubricResult.scores.map((sc) => (
                  <div key={sc.name} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{sc.name}</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {sc.mark} / {sc.max}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${(sc.mark / sc.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">Ulasan Guru / Sistem:</span>
                {rubricResult.feedback}
              </div>

              {/* Justifikasi Tatabahasa */}
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
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

          <div className="flex items-center gap-2">
            {hasEvaluated && (
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cuba Semula</span>
              </button>
            )}

            {hasEvaluated && (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transform active:scale-95"
              >
                <span>Selesaikan Aktiviti Penulisan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
