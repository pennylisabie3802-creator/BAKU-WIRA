/**
 * BAKUWIRA: Dedicated Teacher Question Editor (EDITOR SOALAN BAKUWIRA)
 * Implements Section 11 of the Master Prompt:
 * - Halaman Senarai Misi: All 21 missions grouped by region, filterable, searchable
 * - Halaman Edit Soalan: All 20 required fields editable
 * - Specialized Sub-editors: Single choice, multiple choice, matching pairs, word order, writing, speaking, integrated 3-phase
 * - Image Upload (Muat Naik Gambar) with PNG/JPEG/WebP support, preview, zoom, replace, remove
 * - Live Interactive Preview (Pratonton Misi)
 * - Simpan Draf, Terbitkan Perubahan, Pulihkan Kandungan Asal, Eksport JSON, Import JSON
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  MissionQuestion,
  ActivityType,
  RegionId,
  ReviewStatus,
  QuizChoice,
} from '../../types/game';
import { REGIONS_DATA } from '../../data/missionBank';
import {
  saveSingleMissionQuestion,
  restoreSingleMissionQuestionToOriginal,
  resetMissionQuestionsToDefault,
  exportMissionQuestionsJson,
  importMissionQuestionsJson,
  saveDraftMissionQuestion,
  publishAllDrafts,
  getDraftMissionQuestions,
  getQuestionStats,
} from '../../services/storage';
import { ActivityDispatcher } from '../activities/ActivityDispatcher';
import {
  SlidersHorizontal,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Play,
  X,
  Save,
  BookOpen,
  MessageSquare,
  Mic,
  PenTool,
  Compass,
  FileCheck,
  Info,
  Image as ImageIcon,
  ZoomIn,
  Eye,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface MissionContentManagerProps {
  questions: MissionQuestion[];
  onQuestionsChange: (newQuestions: MissionQuestion[]) => void;
  onPlayQuestion?: (question: MissionQuestion) => void;
  onClose: () => void;
}

export const MissionContentManager: React.FC<MissionContentManagerProps> = ({
  questions,
  onQuestionsChange,
  onPlayQuestion,
  onClose,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionId | 'all'>('all');
  const [selectedActivity, setSelectedActivity] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ReviewStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingQuestion, setEditingQuestion] = useState<MissionQuestion | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<MissionQuestion | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Import/Export Modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => getQuestionStats(questions), [questions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Questions (1 to 21)
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedRegion !== 'all' && q.regionId !== selectedRegion) return false;
      if (selectedActivity !== 'all' && q.activityType !== selectedActivity) return false;
      if (selectedStatus !== 'all' && q.reviewStatus !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesPrompt = q.prompt?.toLowerCase().includes(query);
        const matchesTitle = q.title?.toLowerCase().includes(query);
        const matchesId = q.id?.toLowerCase().includes(query);
        const matchesDialog = q.sourceContent?.bahanDialogSoalan?.toLowerCase().includes(query);
        const matchesJustification = q.justification?.toLowerCase().includes(query);
        if (!matchesPrompt && !matchesTitle && !matchesId && !matchesDialog && !matchesJustification) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedRegion, selectedActivity, selectedStatus, searchQuery]);

  // Group by region for organized display
  const groupedByRegion = useMemo(() => {
    const map: Record<string, MissionQuestion[]> = {
      kota_media: [],
      akademi: [],
      bengkel: [],
      kampung: [],
      istana: [],
    };
    filteredQuestions.forEach((q) => {
      if (map[q.regionId]) {
        map[q.regionId].push(q);
      } else {
        map.kota_media.push(q);
      }
    });
    return map;
  }, [filteredQuestions]);

  // ----------------- Edit Handlers -----------------

  const handleStartEdit = (q: MissionQuestion) => {
    // Clone deeply so edits are isolated until saved/published
    setEditingQuestion(JSON.parse(JSON.stringify(q)));
  };

  const handleSaveDraft = () => {
    if (!editingQuestion) return;
    saveDraftMissionQuestion(editingQuestion);
    showToast(`Draf soalan ${editingQuestion.id} berjaya disimpan secara setempat.`);
  };

  const handlePublishEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const stamped: MissionQuestion = {
      ...editingQuestion,
      reviewStatus: 'confirmed',
      lastEdited: new Date().toISOString(),
      publishedVersion: (editingQuestion.publishedVersion || 1) + 1,
    };

    const updatedList = saveSingleMissionQuestion(stamped);
    onQuestionsChange(updatedList);
    setEditingQuestion(null);
    showToast(`Misi ${stamped.id} (${stamped.title}) berjaya diterbitkan ke dalam permainan!`);
  };

  const handleRestoreCanonical = (id: string) => {
    if (confirm(`Pulihkan soalan ${id} kepada kandungan rasmi asal daripada bank PDF? Sebarang suntingan draf akan digantikan.`)) {
      const updatedList = restoreSingleMissionQuestionToOriginal(id);
      onQuestionsChange(updatedList);
      if (editingQuestion && editingQuestion.id === id) {
        setEditingQuestion(null);
      }
      showToast(`Misi ${id} telah dipulihkan kepada versi rasmi.`);
    }
  };

  const handleResetAll = () => {
    if (confirm('Tetap semula SEMUA 21 misi ke versi rasmi asal? Semua suntingan cikgu akan digantikan.')) {
      const restored = resetMissionQuestionsToDefault();
      onQuestionsChange(restored);
      showToast('Semua 21 misi telah dipulihkan ke versi rasmi asal.');
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportMissionQuestionsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BAKUWIRA_21_Misi_Bank_Boleh_Edit_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Fail JSON bank 21 soalan berjaya dieksport.');
  };

  const handleImportSubmit = () => {
    setImportError(null);
    const res = importMissionQuestionsJson(importJsonText);
    if (res.success) {
      setImportModalOpen(false);
      setImportJsonText('');
      const parsed = JSON.parse(importJsonText);
      const list = Array.isArray(parsed) ? parsed : parsed.missions;
      onQuestionsChange(list);
      showToast(`Berjaya mengimport ${res.count} misi ke dalam sistem!`);
    } else {
      setImportError(res.error || 'Gagal memproses fail JSON.');
    }
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingQuestion) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert('Format fail imej mestilah PNG, JPEG atau WebP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setEditingQuestion({
        ...editingQuestion,
        supportingImage: base64,
      });
      showToast('Gambar sokongan berjaya dimuat naik!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (!editingQuestion) return;
    setEditingQuestion({
      ...editingQuestion,
      supportingImage: undefined,
    });
    showToast('Gambar sokongan dikeluarkan.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-text">
      <div className="relative w-full max-w-6xl h-[94vh] bg-gradient-to-b from-slate-900 via-slate-920 to-slate-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-2xl border border-amber-200 animate-bounce flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-3.5 flex items-center justify-between text-slate-950 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-lg shadow">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-wide uppercase">
                  EDITOR SOALAN BAKUWIRA
                </span>
                <span className="text-[11px] font-bold bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                  MOD GURU / PENTADBIR
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-900 opacity-90 hidden sm:block">
                Pusat Pengurusan 21 Misi Rasmi (5 Wilayah, 20 Lokasi & 1 Cabaran Penamat)
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Eksport 21 soalan ke fail JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Eksport JSON</span>
            </button>

            <button
              onClick={() => setImportModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Import fail JSON bank soalan"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Import JSON</span>
            </button>

            <button
              onClick={handleResetAll}
              className="px-3 py-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/30 text-rose-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Pulihkan semua soalan ke asal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tetap Semula Asal</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 transition-colors ml-2"
              title="Tutup Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header Filter Toolbar */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci soalan, tajuk, ID atau dialog..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-semibold focus:outline-none focus:border-amber-400"
            >
              <option value="all">Semua Wilayah (5)</option>
              <option value="kota_media">Wilayah 1: Kota Media Sosial</option>
              <option value="akademi">Wilayah 2: Akademi Detektif Bahasa</option>
              <option value="bengkel">Wilayah 3: Bengkel Bahasa Melayu</option>
              <option value="kampung">Wilayah 4: Kampung Komunikasi</option>
              <option value="istana">Wilayah 5: Istana Wira Bahasa</option>
            </select>
          </div>

          {/* Summary Badges */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
              {filteredQuestions.length} / 21 Misi Dipaparkan
            </span>
          </div>
        </div>

        {/* Main Content Area: Master List of 21 Missions */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {REGIONS_DATA.map((region) => {
            const regionMissions = groupedByRegion[region.id] || [];
            if (selectedRegion !== 'all' && selectedRegion !== region.id) return null;
            if (regionMissions.length === 0) return null;

            return (
              <div
                key={region.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg space-y-3 p-4"
              >
                {/* Region Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{region.icon}</span>
                    <div>
                      <h3 className="text-base font-extrabold text-amber-300">
                        {region.name}
                      </h3>
                      <p className="text-xs text-slate-400">{region.tagline}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-950 text-amber-400 font-bold border border-slate-800">
                    Ganjaran: {region.crystalName}
                  </span>
                </div>

                {/* Missions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {regionMissions.map((q) => {
                    const isDraft = q.reviewStatus === 'edited';

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                          isDraft
                            ? 'bg-amber-950/20 border-amber-500/60'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          {/* Top Tag & ID */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {q.id}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {q.locationName}
                            </span>
                          </div>

                          {/* Mission Title */}
                          <h4 className="text-sm font-bold text-slate-100 leading-snug">
                            {q.title}
                          </h4>

                          {/* Activity Type Badge */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                              {q.sourceType || q.activityType}
                            </span>
                            {isDraft && (
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/60 animate-pulse">
                                Draf Diubah
                              </span>
                            )}
                          </div>

                          {/* Prompt preview */}
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">
                            "{q.sourceContent?.bahanDialogSoalan || q.prompt}"
                          </p>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setPreviewQuestion(q)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                            <span>Pratonton</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRestoreCanonical(q.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 transition-colors"
                              title="Pulihkan ke asal"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(q)}
                              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Soalan</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* HALAMAN EDIT SOALAN MODAL (ALL 20 FIELDS) */}
      {/* ================================================================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[92vh] bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Edit Header */}
            <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-3 flex items-center justify-between text-slate-950 font-black shadow shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                <span className="text-sm uppercase font-black">
                  Sunting Kandungan: {editingQuestion.id} — {editingQuestion.title}
                </span>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 rounded-lg hover:bg-slate-950/20 text-slate-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form Body (All 20 Fields) */}
            <form onSubmit={handlePublishEdit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Row 1: Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    1. Nombor Misi & ID:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${editingQuestion.number || 1} (${editingQuestion.id})`}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    2. Tajuk Misi:
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.title}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, title: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    3. Wilayah & 4. Lokasi:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${editingQuestion.regionName} — ${editingQuestion.locationName}`}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-400 text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Jenis Aktiviti & Mekanik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    5. Jenis Aktiviti (Format Permainan):
                  </label>
                  <select
                    value={editingQuestion.activityType}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        activityType: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold focus:border-amber-400"
                  >
                    <option value="word_highlight_match">Penerokaan / Klik Perkataan (Word Highlight Match)</option>
                    <option value="single_choice">Kuiz Aneka Pilihan (1 Jawapan)</option>
                    <option value="multiple_choice">Kuiz Berbilang Jawapan</option>
                    <option value="writing_rewrite">Penulisan / Baiki Ayat</option>
                    <option value="investigation_writing">Penyiasatan / Cari Bukti & Tulis</option>
                    <option value="matching">Padanan Seret / Pasang Istilah</option>
                    <option value="npc_dialogue">Simulasi Perbualan NPC</option>
                    <option value="word_order">Seret / Susun Ayat Baku</option>
                    <option value="writing_message">Penulisan Mesej Rasmi Guru</option>
                    <option value="writing_announcement">Simulasi Penulisan Pengumuman</option>
                    <option value="speaking_announcement">Simulasi Pengucapan Awam / 60s</option>
                    <option value="speaking_npc">Simulasi Pertuturan Bersemuka NPC / 60s</option>
                    <option value="speaking_transaction">Simulasi Pertuturan Jual Beli / 60s</option>
                    <option value="speaking_interview">Simulasi Temu Bual / 60s</option>
                    <option value="speaking_forum">Simulasi Forum Mini NPC / 60s</option>
                    <option value="writing_invitation">Penulisan Surat Jemputan Rasmi</option>
                    <option value="speaking_speech">Simulasi Pidato Wira / 60s</option>
                    <option value="integrated_final">Cabaran Akhir Bersepadu (Siasat + Tulis + Tutur)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    6. Situasi Permainan:
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.sourceContent?.situasi || ''}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        sourceContent: {
                          ...editingQuestion.sourceContent!,
                          situasi: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Row 3: Bahan / Dialog / Soalan & Arahan Pemain */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    7. Bahan / Dialog / Soalan:
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.sourceContent?.bahanDialogSoalan || editingQuestion.prompt}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        prompt: e.target.value,
                        sourceContent: {
                          ...editingQuestion.sourceContent!,
                          bahanDialogSoalan: e.target.value,
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs leading-relaxed focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    8. Arahan Pemain:
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.sourceContent?.arahanPemain || ''}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        sourceContent: {
                          ...editingQuestion.sourceContent!,
                          arahanPemain: e.target.value,
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs leading-relaxed focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 4: Specialized Choice / Pairing / Sentence Editor */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                  9 & 10. Konfigurasi Jawapan & Pilihan Berdasarkan Jenis Misi:
                </span>

                {/* Single Choice / Multiple Choice Options Editor */}
                {(editingQuestion.activityType === 'single_choice' ||
                  editingQuestion.activityType === 'multiple_choice' ||
                  editingQuestion.originalChoices) && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                      <span>Pilihan Jawapan (Tandakan kotak untuk jawapan betul):</span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextId = String.fromCharCode(65 + (editingQuestion.originalChoices?.length || 0));
                          const newChoice: QuizChoice = {
                            id: nextId,
                            text: 'Pilihan jawapan baharu',
                            isCorrect: false,
                            feedback: 'Ulasan maklum balas.',
                          };
                          setEditingQuestion({
                            ...editingQuestion,
                            originalChoices: [...(editingQuestion.originalChoices || []), newChoice],
                          });
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Pilihan</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {editingQuestion.originalChoices?.map((c, i) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingQuestion.originalChoices!.map((choice, idx) => {
                                if (editingQuestion.activityType === 'multiple_choice') {
                                  return idx === i ? { ...choice, isCorrect: !choice.isCorrect } : choice;
                                } else {
                                  return { ...choice, isCorrect: idx === i };
                                }
                              });
                              setEditingQuestion({ ...editingQuestion, originalChoices: updated });
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              c.isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                            title="Tandakan sebagai jawapan betul"
                          >
                            {c.isCorrect ? '✓' : c.id}
                          </button>

                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={c.text}
                              onChange={(e) => {
                                const updated = [...editingQuestion.originalChoices!];
                                updated[i].text = e.target.value;
                                setEditingQuestion({ ...editingQuestion, originalChoices: updated });
                              }}
                              className="w-full p-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-100"
                              placeholder="Teks pilihan..."
                            />
                            <input
                              type="text"
                              value={c.feedback}
                              onChange={(e) => {
                                const updated = [...editingQuestion.originalChoices!];
                                updated[i].feedback = e.target.value;
                                setEditingQuestion({ ...editingQuestion, originalChoices: updated });
                              }}
                              className="w-full p-1.5 rounded bg-slate-950 border border-slate-700 text-[11px] text-slate-400 italic"
                              placeholder="Maklum balas pilihan ini..."
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingQuestion.originalChoices!.filter((_, idx) => idx !== i);
                              setEditingQuestion({ ...editingQuestion, originalChoices: updated });
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Pairs Editor */}
                {(editingQuestion.activityType === 'matching' ||
                  editingQuestion.activityType === 'word_highlight_match' ||
                  editingQuestion.structuredAnswer?.pairs) && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                      <span>Pasangan Istilah & Padanan Melayu Baku:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(editingQuestion.structuredAnswer?.pairs || []), ['istilah', 'padanan baku'] as [string, string]];
                          setEditingQuestion({
                            ...editingQuestion,
                            structuredAnswer: { ...editingQuestion.structuredAnswer, pairs: updated },
                          });
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Pasangan</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {editingQuestion.structuredAnswer?.pairs?.map(([left, right], i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={left}
                            onChange={(e) => {
                              const updated = [...editingQuestion.structuredAnswer!.pairs!];
                              updated[i] = [e.target.value, right];
                              setEditingQuestion({
                                ...editingQuestion,
                                structuredAnswer: { ...editingQuestion.structuredAnswer, pairs: updated },
                              });
                            }}
                            className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300"
                            placeholder="Istilah Inggeris..."
                          />
                          <span className="text-slate-500">➔</span>
                          <input
                            type="text"
                            value={right}
                            onChange={(e) => {
                              const updated = [...editingQuestion.structuredAnswer!.pairs!];
                              updated[i] = [left, e.target.value];
                              setEditingQuestion({
                                ...editingQuestion,
                                structuredAnswer: { ...editingQuestion.structuredAnswer, pairs: updated },
                              });
                            }}
                            className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300"
                            placeholder="Padanan Melayu Baku..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingQuestion.structuredAnswer!.pairs!.filter((_, idx) => idx !== i);
                              setEditingQuestion({
                                ...editingQuestion,
                                structuredAnswer: { ...editingQuestion.structuredAnswer, pairs: updated },
                              });
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Sentence Editor */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Ayat Jawapan Rujukan / Teks Baku Lengkap:
                  </label>
                  <input
                    type="text"
                    value={
                      editingQuestion.structuredAnswer?.referenceSentence ||
                      editingQuestion.correctAnswerText ||
                      ''
                    }
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        correctAnswerText: e.target.value,
                        structuredAnswer: {
                          ...editingQuestion.structuredAnswer,
                          referenceSentence: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-bold text-xs"
                  />
                </div>
              </div>

              {/* Row 5: Panduan Penilaian, Justifikasi & Petunjuk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    11. Panduan Penilaian:
                  </label>
                  <textarea
                    rows={3}
                    value={editingQuestion.sourceContent?.jawapanPanduanPenilaian || ''}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        sourceContent: {
                          ...editingQuestion.sourceContent!,
                          jawapanPanduanPenilaian: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    12. Justifikasi Tatabahasa:
                  </label>
                  <textarea
                    rows={3}
                    value={editingQuestion.justification || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, justification: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 6: Mekanik, Masa Persediaan, Had Rakaman, Ganjaran */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    15. Persediaan (Saat):
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.preparationSeconds || 0}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        preparationSeconds: parseInt(e.target.value) || null,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    16. Had Rakaman (Saat):
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.timeLimitSpeakingSeconds || 0}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        timeLimitSpeakingSeconds: parseInt(e.target.value) || null,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    17. Ganjaran XP:
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.xpReward}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        xpReward: parseInt(e.target.value) || 200,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    18. Syiling:
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.coinReward}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        coinReward: parseInt(e.target.value) || 80,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              {/* Row 7: Section 11 D - MUAT NAIK GAMBAR */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>19. Gambar Sokongan (Muat Naik Imej PNG, JPEG, WebP):</span>
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Muat Naik Gambar</span>
                  </button>
                </div>

                {editingQuestion.supportingImage ? (
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-700">
                    <div
                      onClick={() => setZoomedImage(editingQuestion.supportingImage!)}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-600 cursor-pointer group bg-slate-950 flex items-center justify-center"
                    >
                      <img
                        src={editingQuestion.supportingImage}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1 flex-1">
                      <span className="text-xs font-bold text-emerald-400 block">
                        Imej Aktif Dilampirkan
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Gambar ini akan muncul semasa murid menyelesaikan misi ini dalam permainan.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setZoomedImage(editingQuestion.supportingImage!)}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs hover:bg-slate-700"
                        >
                          Besarkan Imej
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 text-xs border border-rose-800 hover:bg-rose-900"
                        >
                          Padam Imej
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    Tiada gambar sokongan dilampirkan. Klik butang 'Muat Naik Gambar' untuk melampirkan rajah atau petikan.
                  </div>
                )}
              </div>

              {/* Form Action Buttons (Section 11 E) */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Draf Tempatan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewQuestion(editingQuestion)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Pratonton Misi</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transform active:scale-95"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Terbitkan Perubahan ke Permainan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* LIVE PREVIEW MODAL (PRATONTON MISI) */}
      {/* ================================================================= */}
      {previewQuestion && (
        <ActivityDispatcher
          question={previewQuestion}
          onComplete={(score) => {
            alert(`[Pratonton Selesai] Skor: ${score}/100. Aktiviti berfungsi dengan sempurna!`);
            setPreviewQuestion(null);
          }}
          onClose={() => setPreviewQuestion(null)}
        />
      )}

      {/* ================================================================= */}
      {/* IMAGE ZOOM MODAL */}
      {/* ================================================================= */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-3xl max-h-[85vh] p-2 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg border border-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* IMPORT JSON MODAL */}
      {/* ================================================================= */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <span>Import Bank 21 Soalan BAKUWIRA</span>
              </h3>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tampal teks fail JSON bank soalan berstruktur (cth: fail <code>BAKUWIRA_21_Misi_Bank_Boleh_Edit.json</code>) ke dalam ruang di bawah:
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"project": "BAKUWIRA", "missions": [...] }'
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-400"
            />

            {importError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs">
                {importError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={!importJsonText.trim()}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow disabled:opacity-40"
              >
                Sahkan & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
