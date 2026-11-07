/**
 * BAKUWIRA: Animate Images into Video Modal
 * Implements the Gemini Omni Flash (gemini-omni-1.2-flash) video animation feature.
 * Generates 16:9 or 9:16 animated videos from images via the server Interactions API.
 */

import React, { useState } from 'react';
import {
  Film,
  Upload,
  Sparkles,
  Play,
  Download,
  AlertCircle,
  X,
  CheckCircle2,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface AnimateVideoModalProps {
  onClose: () => void;
}

export const AnimateVideoModal: React.FC<AnimateVideoModalProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    '/assets/aistudio/menu_game_bc7c0e58.jpeg'
  );
  const [motionPrompt, setMotionPrompt] = useState<string>(
    'Anime fantasy game scene coming alive with sakura petals gently falling, glowing magical particles rising from the spellbook, and soft camera zoom in 4K anime style.'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Sila muat naik fail imej yang sah (PNG/JPEG/WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      setErrorMessage('Sila pilih atau muat naik imej terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedVideoUrl(null);
    setStatusMessage('Menghubungi Gemini Omni Flash (gemini-omni-1.2-flash)...');

    try {
      // Extract base64
      let base64Data = selectedImage;
      let mimeType = 'image/jpeg';

      if (selectedImage.startsWith('data:')) {
        const parts = selectedImage.split(';base64,');
        mimeType = parts[0].replace('data:', '');
        base64Data = parts[1];
      } else {
        // Fetch local asset and convert to base64
        const resp = await fetch(selectedImage);
        const blob = await resp.blob();
        mimeType = blob.type || 'image/jpeg';
        const buffer = await blob.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64Data = btoa(binary);
      }

      setStatusMessage('Menjana video animasi 16:9 dengan model Gemini Omni Flash...');

      const response = await fetch('/api/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType,
          motionPrompt,
          aspectRatio,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Ralat pelayan: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.videoBase64) {
        const videoSrc = `data:${data.mimeType || 'video/mp4'};base64,${data.videoBase64}`;
        setGeneratedVideoUrl(videoSrc);
        setStatusMessage('Video animasi berjaya dihasilkan!');
      } else {
        throw new Error('Tiada data video diterima daripada pelayan.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'Gagal menjana video. Sila pastikan kunci API Gemini mempunyai akses kuota aktif.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
              <Film className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text">
                Studio Animasi Video Wira
              </h2>
              <p className="text-xs text-slate-400">
                Jana video animasi daripada gambar menggunakan Gemini Omni Flash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview & Upload Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-amber-400">Imej Sumber</label>
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center group">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Source"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-500 text-xs">
                  <Upload className="w-6 h-6" />
                  <span>Tiada imej dipilih</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <label className="cursor-pointer py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-600 transition-all">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Muat Naik Imej</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() =>
                  setSelectedImage('/assets/aistudio/kota_media_sosial_d0e7f169.jpeg')
                }
                className="py-1.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-xs font-bold text-purple-300 border border-purple-500/40 transition-all"
              >
                Kota Media Sosial
              </button>
              <button
                onClick={() =>
                  setSelectedImage('/assets/aistudio/menu_game_bc7c0e58.jpeg')
                }
                className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-500/40 transition-all"
              >
                Menu Bakuwira
              </button>
            </div>
          </div>

          {/* Settings & Configuration */}
          <div className="flex flex-col space-y-3">
            <div>
              <label className="text-xs font-bold text-amber-400">
                Nisbah Aspek (Aspect Ratio)
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  16:9 (Lanskap)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  9:16 (Potret)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-amber-400">
                Arahan Gerakan (Motion Prompt)
              </label>
              <textarea
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
                rows={3}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                placeholder="Terangkan gerakan animasi..."
              />
            </div>
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/50 text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Video Output Player */}
        {generatedVideoUrl && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/50 flex flex-col items-center space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Video Animasi Berjaya Dihasilkan!</span>
            </div>
            <video
              src={generatedVideoUrl}
              controls
              autoPlay
              loop
              className="w-full max-h-56 rounded-xl border border-slate-800 object-contain shadow-lg"
            />
            <div className="flex items-center gap-3">
              <a
                href={generatedVideoUrl}
                download={`bakuwira-animasi-${Date.now()}.mp4`}
                className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Muat Turun Video (.mp4)</span>
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            Model: <strong className="text-amber-300">gemini-omni-1.2-flash</strong>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-all"
            >
              Tutup
            </button>
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{statusMessage || 'Menjana Video...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Jana Video Animasi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
