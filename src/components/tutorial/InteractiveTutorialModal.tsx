/**
 * BAKUWIRA: Interactive Gameplay Guide (PANDUAN PERMAINAN BAKUWIRA)
 * Implements Part 1 with 7 interactive tutorial screens:
 * Screen 1: Selamat Datang & Character display
 * Screen 2: Kawalan Watak (Interactive movement practice to marker)
 * Screen 3: Berinteraksi dengan NPC (Puan Zahra structured dialogue)
 * Screen 4: Memahami Misi (4 activity categories + quizzes)
 * Screen 5: Menggunakan Peta (Interactive map usage & Kota Media Sosial highlight)
 * Screen 6: Menyelesaikan Misi (Interactive sample educational task & reward demo)
 * Screen 7: Meneruskan Pengembaraan ("Mulakan Misi Pertama" -> Kota Media Sosial)
 */

import React, { useState } from 'react';
import { PlayerProfile } from '../../types/game';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  MapPin,
  CheckCircle2,
  BookOpen,
  Volume2,
  PenTool,
  Search,
  MessageSquare,
  Award,
  Shield,
  MousePointer,
  Navigation,
} from 'lucide-react';
import { NPCAnimatedPortrait } from '../activities/NPCAnimatedPortrait';

interface InteractiveTutorialModalProps {
  profile: PlayerProfile;
  onFinishTutorial: () => void;
  onSkipTutorial: () => void;
  onClose?: () => void;
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  profile,
  onFinishTutorial,
  onSkipTutorial,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Screen 2 interactive state
  const [hasMovedInTutorial, setHasMovedInTutorial] = useState(false);
  const [markerReached, setMarkerReached] = useState(false);

  // Screen 3 dialogue state
  const [puanZahraDialogueChosen, setPuanZahraDialogueChosen] = useState<string | null>(null);

  // Screen 5 map interactive tracking state
  const [selectedTutorialRegion, setSelectedTutorialRegion] = useState<string>('kota_media');

  // Screen 6 sample quiz state
  const [sampleQuizAnswer, setSampleQuizAnswer] = useState<string | null>(null);
  const [sampleQuizCompleted, setSampleQuizCompleted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-3.5 flex items-center justify-between text-slate-950 font-black shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span className="tracking-wide text-xs sm:text-sm uppercase">
              PANDUAN PERMAINAN BAKUWIRA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-950/20 px-2.5 py-0.5 rounded-full font-mono">
              Langkah {currentStep} / 7
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-950/30 text-slate-950 transition-colors"
                title="Tutup Panduan"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center justify-between gap-1 shrink-0">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step === currentStep
                  ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                  : step < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* ==================================================== */}
          {/* SCREEN 1 — SELAMAT DATANG */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
              {/* Character Avatar Preview Box */}
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-5xl shadow-2xl border-4 border-amber-400">
                {profile.avatar.gender === 'perempuan' ? '🧕' : '🧑‍🎓'}
                <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase border border-white">
                  {profile.name}
                </span>
              </div>

              <div className="space-y-3 max-w-xl">
                <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                  Selamat Datang ke Kerajaan BAKUWIRA!
                </h3>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-sm leading-relaxed text-slate-200 text-left space-y-2">
                  <p>
                    Kamu merupakan seorang <strong>Wira Bahasa</strong> yang ditugaskan untuk
                    memulihkan lima wilayah komunikasi daripada ancaman Kekeliruan Bahasa.
                  </p>
                  <p>
                    Terokai dunia, berinteraksi dengan penduduk dan selesaikan cabaran bertutur serta
                    menulis untuk memulihkan <strong>Kristal Bahasa</strong>!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                  <span>Mula Panduan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onSkipTutorial}
                  className="px-6 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-slate-200 font-bold text-xs transition-colors"
                >
                  Langkau Panduan
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 2 — KAWALAN WATAK */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Langkah 2: Asas Kawalan Watak
                </span>
                <h3 className="text-2xl font-black text-white">Panduan Pergerakan & Tindakan</h3>
                <p className="text-xs text-slate-400">
                  Kuasai papan kekunci desktop atau kawalan sentuh peranti mudah alih.
                </p>
              </div>

              {/* Controls Layout Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Desktop Keyboard */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm text-blue-400 flex items-center gap-2">
                    <MousePointer className="w-4 h-4" />
                    <span>Komputer / Komputer Riba (Desktop)</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-mono text-amber-300 font-bold">W / A / S / D</span>
                      <span>Bergerak 3D</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-mono text-blue-300 font-bold">Tetikus (Mouse)</span>
                      <span>Memusing Kamera</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-mono text-purple-300 font-bold">Shift</span>
                      <span>Berlari Laju</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-mono text-emerald-300 font-bold">Space</span>
                      <span>Melompat</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-mono text-amber-400 font-black bg-slate-900 px-1 rounded">E</span>
                      <span>Berinteraksi (NPC / Objek)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-mono text-slate-400 font-bold">M / J</span>
                      <span>Peta Dunia / Jurnal Bahasa</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Touch */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm text-purple-400 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    <span>Peranti Sentuh / Telefon Pintar (Mobile)</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-semibold text-amber-300">Kayu Joy Maya (Virtual Joystick)</span>
                      <span>Bergerak</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-semibold text-blue-300">Leret Skrin (Swipe)</span>
                      <span>Pusing Kamera</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-semibold text-purple-300">Butang Lari</span>
                      <span>Pecutan Laju</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="font-semibold text-emerald-300">Butang Lompat</span>
                      <span>Melompat</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-amber-400">Butang [E] Sentuh</span>
                      <span>Interaksi Penuh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Movement Simulator Task */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-center">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Ujian Praktikal Kawalan Watak
                </span>
                <p className="text-xs text-slate-200">
                  Tekan butang arahan di bawah untuk menggerakkan watak wira menuju ke{' '}
                  <strong>Penanda Panduan Bercahaya</strong>.
                </p>

                <div className="flex justify-center items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setHasMovedInTutorial(true);
                      setMarkerReached(true);
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                      markerReached
                        ? 'bg-emerald-500 text-slate-950 shadow-lg'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                    }`}
                  >
                    {markerReached ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        <span>Penanda Berjaya Dihampiri! ✓</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-4 h-4" />
                        <span>Gerakkan Wira ke Penanda Panduan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelum</span>
                </button>
                <button
                  disabled={!markerReached}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Seterusnya: Temui Puan Zahra</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 3 — BERINTERAKSI DENGAN NPC */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Langkah 3: Berinteraksi dengan Penduduk
                </span>
                <h3 className="text-2xl font-black text-white">Pertemuan Pertama dengan Puan Zahra</h3>
                <p className="text-xs text-slate-400">
                  Hampiri NPC dengan penanda seruan kuning bercahaya di atas kepala mereka.
                </p>
              </div>

              {/* NPC Interaction Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-indigo-500/40 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <NPCAnimatedPortrait
                      npcName="Puan Zahra"
                      npcRole="Ketua Pengajar Detektif Bahasa"
                      npcAvatar="👩‍🏫"
                      isTalking={!puanZahraDialogueChosen}
                      size="sm"
                      showVoiceWave={false}
                    />
                    {/* Glowing beacon marker overhead */}
                    <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center border-2 border-slate-950 shadow animate-bounce">
                      !
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-amber-300">Puan Zahra</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Ketua Pengajar Detektif Bahasa
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed italic">
                      "Setiap penduduk mempunyai cerita dan tugasan yang berbeza. Dengar atau baca
                      arahan mereka dengan teliti. Gunakan bahasa Melayu yang sesuai untuk membantu
                      mereka menyelesaikan masalah komunikasi."
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-300 flex items-center justify-between">
                  <span>Tekan E atau butang Interaksi untuk berbual:</span>
                  <span className="font-mono bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                    [E] INTERAKSI
                  </span>
                </div>

                {/* Structured Dialogue practice */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-300 block">
                    Pilih respons yang paling santun dan bersedia:
                  </span>
                  {[
                    {
                      id: 'A',
                      text: 'Saya sedia! Saya akan membantu memulihkan bahasa di setiap wilayah, Puan Zahra.',
                      isCorrect: true,
                    },
                    {
                      id: 'B',
                      text: 'Tengoklah dulu, kalau ada masa saya tolong.',
                      isCorrect: false,
                    },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setPuanZahraDialogueChosen(d.id)}
                      className={`w-full p-3 rounded-xl border text-xs font-medium text-left flex items-start gap-2.5 transition-all ${
                        puanZahraDialogueChosen === d.id
                          ? d.isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-bold font-mono px-1.5 py-0.5 rounded bg-slate-800">
                        {d.id}
                      </span>
                      <span>{d.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelum</span>
                </button>
                <button
                  disabled={!puanZahraDialogueChosen}
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Seterusnya: Memahami Misi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 4 — MEMAHAMI MISI */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Langkah 4: Struktur & Bentuk Tugasan
                </span>
                <h3 className="text-2xl font-black text-white">Empat Kategori Aktiviti Utama</h3>
                <p className="text-xs text-slate-400">
                  Setiap lokasi menawarkan gabungan aktiviti praktikal bertutur, menulis, dan menyiasat.
                </p>
              </div>

              {/* 4 Gameplay Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-xs text-cyan-300">1. Penerokaan & Penyiasatan</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Mencari artifak, buku rekod dan mesej hologram dalam persekitaran 3D untuk mengesan
                    perkataan rojak.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-xs text-amber-300">2. Simulasi Komunikasi NPC</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Berbual dengan guru, peniaga dan penduduk untuk menyelesaikan kekeliruan secara santun.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-bold text-xs text-indigo-300">3. Latihan Bertutur (Maksimum 60s)</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Pengucapan santun dan berkeyakinan dengan penilaian sebutan baku dan kelancaran.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-xs text-emerald-300">4. Latihan Menulis</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Membetulkan pesanan digital, mengarang e-mel rasmi dan peraturan berpandukan rubrik DSKP.
                  </p>
                </div>
              </div>

              {/* Note on Quizzes */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400 shrink-0" />
                <p>
                  Misi terpilih juga mengandungi <strong>Kuiz Interaktif</strong> bagi menguji Hukum D-M,
                  apitan tatabahasa, rima pantun dan kelewahan kata.
                </p>
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelum</span>
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Seterusnya: Navigasi Peta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 5 — MENGGUNAKAN PETA */}
          {/* ==================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Langkah 5: Peta & Panduan Lokasi
                </span>
                <h3 className="text-2xl font-black text-white">Navigasi Peta Dunia Fantasi</h3>
                <p className="text-xs text-slate-400">
                  Gunakan peta untuk mengetahui lokasi kamu, mencari tugasan dan menuju ke destinasi seterusnya.
                </p>
              </div>

              {/* Map Preview Container */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-xl bg-slate-950">
                <img
                  src="/public/assets/aistudio/PETA_LOKASI_5e53326a.jpeg"
                  alt="Peta Lokasi BAKUWIRA"
                  className="w-full h-48 sm:h-64 object-cover object-center brightness-90"
                />

                {/* Highlight Over Kota Media Sosial */}
                <div className="absolute top-1/3 left-6 sm:left-12 -translate-y-1/2 p-2 rounded-2xl bg-slate-950/90 border-2 border-amber-400 shadow-2xl flex items-center gap-2 animate-bounce">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <div className="text-left">
                    <span className="font-bold text-xs text-amber-300 block">
                      MISI 1 — KOTA MEDIA SOSIAL
                    </span>
                    <span className="text-[10px] text-slate-300">Destinasi Awal Ditetapkan</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-slate-700">
                  4 Sublokasi Dipandu Mengikut Urutan
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-amber-400 block">Kemahiran Navigasi Wira:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[11px]">
                  <li>Buka peta bila-bila masa melalui menu atau kekunci [M] / butang [LIHAT PETA].</li>
                  <li>Pilih wilayah untuk melihat senarai 4 sublokasi berpandu.</li>
                  <li>Tekan <strong>"Tetapkan Destinasi"</strong> untuk menyalakan sinar penanda di dunia 3D.</li>
                </ul>
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelum</span>
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Seterusnya: Uji Selesai Misi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 6 — MENYELESAIKAN MISI */}
          {/* ==================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Langkah 6: Menyiapkan Tugasan & Menerima Ganjaran
                </span>
                <h3 className="text-2xl font-black text-white">Demonstrasi Aktiviti Bahasa</h3>
                <p className="text-xs text-slate-400">
                  Cuba aktiviti ringkas ini untuk memahami bagaimana maklum balas dan ganjaran diberikan.
                </p>
              </div>

              {/* Mini Sample Quiz Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Contoh Cabaran Singkatan Bahasa:</span>
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Kemajuan: {sampleQuizCompleted ? '1/1 Selesai' : '0/1 Belum Selesai'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-100">
                  Antara berikut, manakah ayat yang menggunakan ejaan baku tanpa pengaruh bahasa rojak?
                </p>

                <div className="space-y-2">
                  {[
                    {
                      id: 'A',
                      text: 'Ali pergi ke perpustakaan untuk meminjam buku tatabahasa.',
                      isCorrect: true,
                    },
                    {
                      id: 'B',
                      text: 'Ali gi library nk pinjam buku grammar.',
                      isCorrect: false,
                    },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSampleQuizAnswer(c.id);
                        if (c.isCorrect) setSampleQuizCompleted(true);
                      }}
                      className={`w-full p-3 rounded-xl border text-xs font-medium text-left flex items-center gap-3 transition-all ${
                        sampleQuizAnswer === c.id
                          ? c.isCorrect
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/70 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-800 font-bold font-mono flex items-center justify-center shrink-0">
                        {c.id}
                      </span>
                      <span>{c.text}</span>
                    </button>
                  ))}
                </div>

                {sampleQuizCompleted && (
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Ganjaran Diperoleh: <strong>+100 EXP</strong> • <strong>+50 Koin</strong></span>
                    </div>
                    <span className="font-bold text-emerald-400">Tahniah!</span>
                  </div>
                )}
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelum</span>
                </button>
                <button
                  disabled={!sampleQuizCompleted}
                  onClick={() => setCurrentStep(7)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Seterusnya: Meneruskan Pengembaraan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 7 — MENERUSKAN PENGEMBARAAN */}
          {/* ==================================================== */}
          {currentStep === 7 && (
            <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 border-2 border-amber-200">
                👑
              </div>

              <div className="space-y-3 max-w-xl">
                <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                  Tahniah, Wira Bahasa!
                </h3>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm leading-relaxed text-slate-200 space-y-2">
                  <p>Kamu sudah memahami asas permainan <strong>BAKUWIRA</strong>.</p>
                  <p className="text-amber-300 font-semibold">
                    "Selepas menyelesaikan misi di sesuatu tempat, tekan butang{' '}
                    <span className="text-white bg-amber-500/30 px-2 py-0.5 rounded">
                      'Teruskan ke Lokasi Seterusnya'
                    </span>{' '}
                    untuk membuka cabaran baharu dan bergerak secara automatik."
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onFinishTutorial}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base tracking-wide shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-amber-200"
                >
                  <span>Mulakan Misi Pertama</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
                <p className="text-[11px] text-slate-400 mt-3">
                  Kamu akan memasuki <strong>Kota Media Sosial — Dataran Mesej</strong> serta-merta.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
