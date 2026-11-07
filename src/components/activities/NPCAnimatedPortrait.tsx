/**
 * BAKUWIRA: Animated Anime NPC Character Portrait
 * Renders high-fidelity anime portraits with dynamic lip-sync mouth movements,
 * blinking eyes, idle breathing bob, and speaking wave indicators.
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';

export type MouthFrame = 'closed' | 'half' | 'open' | 'wide';

interface NPCAnimatedPortraitProps {
  npcName: string;
  npcRole?: string;
  npcAvatar?: string;
  isTalking: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showVoiceWave?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  className?: string;
}

export const NPCAnimatedPortrait: React.FC<NPCAnimatedPortraitProps> = ({
  npcName,
  npcRole,
  npcAvatar,
  isTalking,
  size = 'md',
  showVoiceWave = true,
  soundEnabled,
  onToggleSound,
  className = '',
}) => {
  const [mouthFrame, setMouthFrame] = useState<MouthFrame>('closed');
  const [isBlinking, setIsBlinking] = useState(false);

  // Lip-sync animation loop when isTalking is true
  useEffect(() => {
    if (!isTalking) {
      setMouthFrame('closed');
      return;
    }

    const frames: MouthFrame[] = ['open', 'half', 'wide', 'open', 'closed', 'half', 'wide'];
    let frameIdx = 0;

    const interval = window.setInterval(() => {
      // Natural cadence: randomize slightly between vowel frames
      const pick = frames[frameIdx % frames.length];
      setMouthFrame(pick);
      frameIdx++;
    }, 110);

    return () => {
      clearInterval(interval);
      setMouthFrame('closed');
    };
  }, [isTalking]);

  // Periodic eye blink loop
  useEffect(() => {
    let blinkTimer: number;

    const scheduleBlink = () => {
      // Blink every 3.2 - 4.5 seconds
      const delay = 3200 + Math.random() * 1300;
      blinkTimer = window.setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  // Determine character archetype based on npcName
  const charType = (() => {
    const lower = npcName.toLowerCase();
    if (lower.includes('zahra')) return 'zahra';
    if (lower.includes('faris') || lower.includes('adik')) return 'faris';
    if (lower.includes('tok') || lower.includes('penghulu') || lower.includes('samad')) return 'samad';
    if (lower.includes('tukang') || lower.includes('manap') || lower.includes('besi') || lower.includes('mekanik')) return 'artisan';
    if (lower.includes('raja') || lower.includes('tuanku')) return 'king';
    if (lower.includes('aiman') || lower.includes('detektif')) return 'detective';
    return 'default';
  })();

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44',
  }[size];

  return (
    <div className={`relative flex flex-col items-center shrink-0 ${className}`}>
      {/* Outer Glow Halo when speaking */}
      <div
        className={`relative rounded-3xl p-1 transition-all duration-300 ${
          isTalking
            ? 'ring-4 ring-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.5)] bg-gradient-to-b from-amber-400 via-purple-600 to-indigo-600'
            : 'ring-2 ring-purple-500/40 shadow-lg bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900'
        }`}
      >
        {/* Animated Portrait Viewport */}
        <div
          className={`${sizeClasses} rounded-[22px] overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 relative flex items-center justify-center`}
        >
          {/* Subtle Ambient Radial Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(216,180,254,0.3),transparent_70%)] pointer-events-none" />

          {/* Character SVG with Lip-Sync and Blinking */}
          <div
            className={`w-full h-full relative transition-transform duration-150 ${
              isTalking ? 'translate-y-[-1px] scale-[1.02]' : 'translate-y-0 scale-100'
            }`}
          >
            <CharacterVector
              charType={charType}
              mouthFrame={mouthFrame}
              isBlinking={isBlinking}
              isTalking={isTalking}
              fallbackAvatar={npcAvatar}
            />
          </div>

          {/* Speaking Audio Waves Badge in Corner */}
          {isTalking && (
            <div className="absolute bottom-1.5 right-1.5 flex items-end gap-0.5 bg-slate-950/85 px-1.5 py-1 rounded-md border border-amber-400/60 shadow">
              <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          {/* Sound Toggle Button (if onToggleSound provided) */}
          {onToggleSound !== undefined && (
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan Suara Dialog' : 'Hidupkan Suara Dialog'}
              className="absolute top-1.5 right-1.5 p-1 rounded-md bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          )}
        </div>
      </div>

      {/* Speaking / Listening Status Ribbon */}
      {showVoiceWave && (
        <div className="mt-2 flex items-center gap-1.5">
          {isTalking ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-amber-300 bg-amber-950/80 border border-amber-500/60 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <Mic className="w-3 h-3 text-amber-400" />
              <span>Sedang Bertutur...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Menunggu Respons</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================================
// VECTOR ANIME RENDERER WITH MOUTH SHAPES & BLINKING EYES
// =====================================================================
interface CharacterVectorProps {
  charType: 'zahra' | 'faris' | 'samad' | 'artisan' | 'king' | 'detective' | 'default';
  mouthFrame: MouthFrame;
  isBlinking: boolean;
  isTalking: boolean;
  fallbackAvatar?: string;
}

const CharacterVector: React.FC<CharacterVectorProps> = ({
  charType,
  mouthFrame,
  isBlinking,
  isTalking,
  fallbackAvatar,
}) => {
  // Render mouth SVG path based on lip-sync frame
  const renderMouth = (cx = 50, cy = 68) => {
    switch (mouthFrame) {
      case 'wide':
        return (
          <g>
            {/* Wide smiling speaking mouth with teeth & tongue */}
            <path
              d={`M ${cx - 9} ${cy - 1} Q ${cx} ${cy - 3} ${cx + 9} ${cy - 1} Q ${cx + 7} ${cy + 9} ${cx} ${cy + 10} Q ${cx - 7} ${cy + 9} ${cx - 9} ${cy - 1} Z`}
              fill="#581c87"
              stroke="#831843"
              strokeWidth="0.8"
            />
            {/* Upper teeth white strip */}
            <path
              d={`M ${cx - 7} ${cy - 0.5} Q ${cx} ${cy - 2} ${cx + 7} ${cy - 0.5} Q ${cx + 5} ${cy + 3} ${cx} ${cy + 3} Q ${cx - 5} ${cy + 3} ${cx - 7} ${cy - 0.5} Z`}
              fill="#ffffff"
            />
            {/* Tongue */}
            <path
              d={`M ${cx - 5} ${cy + 9} Q ${cx} ${cy + 5} ${cx + 5} ${cy + 9} Q ${cx} ${cy + 10} ${cx - 5} ${cy + 9} Z`}
              fill="#f43f5e"
            />
          </g>
        );
      case 'open':
        return (
          <g>
            {/* Open 'a'/'o' vowel mouth */}
            <ellipse cx={cx} cy={cy + 3} rx="6" ry="6" fill="#4a044e" stroke="#831843" strokeWidth="0.8" />
            <path
              d={`M ${cx - 4} ${cy + 6} Q ${cx} ${cy + 3} ${cx + 4} ${cy + 6} Q ${cx} ${cy + 8} ${cx - 4} ${cy + 6} Z`}
              fill="#f43f5e"
            />
          </g>
        );
      case 'half':
        return (
          <g>
            {/* Half open mouth */}
            <path
              d={`M ${cx - 7} ${cy} Q ${cx} ${cy - 1} ${cx + 7} ${cy} Q ${cx + 5} ${cy + 5} ${cx} ${cy + 5.5} Q ${cx - 5} ${cy + 5} ${cx - 7} ${cy} Z`}
              fill="#581c87"
              stroke="#831843"
              strokeWidth="0.8"
            />
            <path
              d={`M ${cx - 5} ${cy + 0.5} Q ${cx} ${cy} ${cx + 5} ${cy + 0.5} Q ${cx + 4} ${cy + 2.5} ${cx} ${cy + 2.5} Q ${cx - 4} ${cy + 2.5} ${cx - 5} ${cy + 0.5} Z`}
              fill="#ffffff"
            />
          </g>
        );
      case 'closed':
      default:
        return (
          <g>
            {/* Friendly smiling line */}
            <path
              d={`M ${cx - 6} ${cy} Q ${cx} ${cy + 3} ${cx + 6} ${cy}`}
              fill="none"
              stroke="#9d174d"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Dimple accent */}
            <circle cx={cx - 6.5} cy={cy - 0.5} r="0.6" fill="#be185d" />
            <circle cx={cx + 6.5} cy={cy - 0.5} r="0.6" fill="#be185d" />
          </g>
        );
    }
  };

  // Eyes rendering: open anime eyes vs closed blinking lines
  const renderEyes = (lx = 38, rx = 62, ey = 48) => {
    if (isBlinking) {
      return (
        <g stroke="#3730a3" strokeWidth="2.2" strokeLinecap="round" fill="none">
          {/* Closed smiling curved lashes */}
          <path d={`M ${lx - 6} ${ey} Q ${lx} ${ey + 3} ${lx + 6} ${ey}`} />
          <path d={`M ${rx - 6} ${ey} Q ${rx} ${ey + 3} ${rx + 6} ${ey}`} />
        </g>
      );
    }

    return (
      <g>
        {/* Left Eye */}
        <ellipse cx={lx} cy={ey} rx="5.5" ry="6.5" fill="#1e1b4b" />
        <ellipse cx={lx} cy={ey + 1} rx="4.5" ry="5.5" fill="#4338ca" />
        {/* Eye highlight glints */}
        <circle cx={lx - 1.8} cy={ey - 2} r="2" fill="#ffffff" />
        <circle cx={lx + 1.8} cy={ey + 2} r="1" fill="#ffffff" opacity="0.8" />
        {/* Upper Eyelash curve */}
        <path
          d={`M ${lx - 7.5} ${ey - 4} Q ${lx} ${ey - 8} ${lx + 7.5} ${ey - 4}`}
          stroke="#1e1b4b"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Eye */}
        <ellipse cx={rx} cy={ey} rx="5.5" ry="6.5" fill="#1e1b4b" />
        <ellipse cx={rx} cy={ey + 1} rx="4.5" ry="5.5" fill="#4338ca" />
        {/* Eye highlight glints */}
        <circle cx={rx - 1.8} cy={ey - 2} r="2" fill="#ffffff" />
        <circle cx={rx + 1.8} cy={ey + 2} r="1" fill="#ffffff" opacity="0.8" />
        {/* Upper Eyelash curve */}
        <path
          d={`M ${rx - 7.5} ${ey - 4} Q ${rx} ${ey - 8} ${rx + 7.5} ${ey - 4}`}
          stroke="#1e1b4b"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Anime Eyebrows */}
        <path
          d={`M ${lx - 6} ${ey - 10} Q ${lx} ${ey - 13} ${lx + 5} ${ey - 9.5}`}
          stroke="#4338ca"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${rx - 5} ${ey - 9.5} Q ${rx} ${ey - 13} ${rx + 6} ${ey - 10}`}
          stroke="#4338ca"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  };

  // 1. PUAN ZAHRA (Anime teacher with purple hijab, stylish glasses, kind smile)
  if (charType === 'zahra') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="hijabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
          <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Hijab Backing */}
        <ellipse cx="50" cy="50" rx="36" ry="39" fill="url(#hijabGrad)" />

        {/* Shoulders & Detective Uniform */}
        <path d="M 12 100 Q 50 78 88 100 L 88 100 L 12 100 Z" fill="url(#robeGrad)" />
        {/* Uniform Gold Lapels */}
        <path d="M 32 84 L 50 100 L 68 84" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
        {/* Hijab Drape over Chest */}
        <path d="M 30 76 Q 50 92 70 76 Q 60 98 50 98 Q 40 98 30 76 Z" fill="#6d28d9" />

        {/* Face Oval */}
        <ellipse cx="50" cy="54" rx="21" ry="24" fill="url(#skinGrad)" />

        {/* Inner Hijab Frame hugging face */}
        <path
          d="M 28 48 C 28 30, 72 30, 72 48 C 72 65, 66 74, 50 75 C 34 74, 28 65, 28 48 Z"
          fill="none"
          stroke="#581c87"
          strokeWidth="3.5"
        />

        {/* Soft Cheek Blush */}
        <ellipse cx="36" cy="57" rx="4.5" ry="2.5" fill="#fda4af" opacity="0.55" />
        <ellipse cx="64" cy="57" rx="4.5" ry="2.5" fill="#fda4af" opacity="0.55" />

        {/* Cute Anime Nose */}
        <circle cx="50" cy="58.5" r="1.1" fill="#ea580c" opacity="0.6" />

        {/* Anime Eyes with Blinking */}
        {renderEyes(39, 61, 48)}

        {/* Puan Zahra's Signature Stylish Gold Glasses */}
        <g stroke="#f59e0b" strokeWidth="1.5" fill="none">
          {/* Left Lens */}
          <rect x="30" y="42" width="17" height="12" rx="3.5" stroke="#f59e0b" fill="#ffffff" fillOpacity="0.12" />
          {/* Right Lens */}
          <rect x="53" y="42" width="17" height="12" rx="3.5" stroke="#f59e0b" fill="#ffffff" fillOpacity="0.12" />
          {/* Bridge */}
          <path d="M 47 47 L 53 47" />
          {/* Frame temple accents */}
          <path d="M 30 46 L 27 45" />
          <path d="M 70 46 L 73 45" />
        </g>

        {/* Golden Hijab Brooch */}
        <circle cx="50" cy="78" r="3.2" fill="#f59e0b" />
        <circle cx="50" cy="78" r="1.6" fill="#10b981" />

        {/* Synchronized Mouth Movement */}
        {renderMouth(50, 66)}
      </svg>
    );
  }

  // 2. ADIK FARIS (Young schoolboy w/ energetic anime hair & school uniform)
  if (charType === 'faris') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="hairBoy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="skinBoy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>

        {/* Hair Back */}
        <ellipse cx="50" cy="45" rx="32" ry="30" fill="url(#hairBoy)" />

        {/* Shoulders & White School Shirt */}
        <path d="M 16 100 Q 50 82 84 100 Z" fill="#f8fafc" />
        {/* Navy School Tie & Collar */}
        <path d="M 38 88 L 50 96 L 62 88" stroke="#1e3a8a" strokeWidth="2.5" fill="none" />
        <path d="M 48 94 L 52 94 L 54 100 L 46 100 Z" fill="#1e3a8a" />

        {/* Neck */}
        <rect x="44" y="68" width="12" height="12" fill="#fdba74" />

        {/* Face */}
        <path
          d="M 28 46 Q 28 72 50 74 Q 72 72 72 46 Q 72 32 50 32 Q 28 32 28 46 Z"
          fill="url(#skinBoy)"
        />

        {/* Ears */}
        <circle cx="27" cy="51" r="4.5" fill="#fed7aa" />
        <circle cx="73" cy="51" r="4.5" fill="#fed7aa" />

        {/* Spiky Anime Hair Bangs */}
        <path
          d="M 24 38 Q 36 22 50 22 Q 64 22 76 38 Q 66 32 58 38 Q 50 29 42 39 Q 33 30 24 38 Z"
          fill="url(#hairBoy)"
        />

        {/* Big Cheerful Eyes */}
        {renderEyes(39, 61, 49)}

        {/* Rosy energetic cheeks */}
        <ellipse cx="34" cy="56" rx="4" ry="2" fill="#f43f5e" opacity="0.5" />
        <ellipse cx="66" cy="56" rx="4" ry="2" fill="#f43f5e" opacity="0.5" />

        {/* Small Nose */}
        <circle cx="50" cy="56.5" r="1" fill="#ea580c" opacity="0.5" />

        {/* Mouth */}
        {renderMouth(50, 64)}
      </svg>
    );
  }

  // 3. TOK PENGHULU SAMAD (Elder Malay leader with black velvet Songkok & silver mustache)
  if (charType === 'samad') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="songkokGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* Shoulders & Emerald Baju Melayu */}
        <path d="M 12 100 Q 50 80 88 100 Z" fill="#065f46" />
        {/* Teluk Belanga Collar & Golden Buttons */}
        <path d="M 40 85 Q 50 90 60 85" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <circle cx="50" cy="91" r="1.5" fill="#fbbf24" />
        <circle cx="50" cy="96" r="1.5" fill="#fbbf24" />

        {/* Neck */}
        <rect x="43" y="66" width="14" height="12" fill="#fdba74" />

        {/* Face */}
        <ellipse cx="50" cy="52" rx="22" ry="22" fill="#fed7aa" />

        {/* Ears */}
        <circle cx="26" cy="52" r="4.5" fill="#fdba74" />
        <circle cx="74" cy="52" r="4.5" fill="#fdba74" />

        {/* Traditional Malay Songkok */}
        <path
          d="M 23 40 Q 50 34 77 40 L 75 22 Q 50 17 25 22 Z"
          fill="url(#songkokGrad)"
        />
        {/* Songkok Gold Thread Border */}
        <path d="M 23 40 Q 50 34 77 40" stroke="#f59e0b" strokeWidth="2" fill="none" />

        {/* Wise Eyes with Wrinkle Crows Feet */}
        {renderEyes(39, 61, 48)}
        <path d="M 30 48 L 27 47 M 30 50 L 26 51" stroke="#9a3412" strokeWidth="1" />
        <path d="M 70 48 L 73 47 M 70 50 L 74 51" stroke="#9a3412" strokeWidth="1" />

        {/* Elder Nose */}
        <path d="M 48 54 Q 50 57 52 54" stroke="#9a3412" strokeWidth="1.2" fill="none" />

        {/* Silver Mustache & Beard */}
        <path
          d="M 37 63 Q 50 60 63 63 Q 57 66 50 65 Q 43 66 37 63 Z"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="0.8"
        />
        {/* Neat Goatee below mouth */}
        <path d="M 47 70 Q 50 78 53 70 Z" fill="#e2e8f0" />

        {/* Mouth */}
        {renderMouth(50, 64)}
      </svg>
    );
  }

  // 4. ARTISAN / TUKANG BESI / MEKANIK
  if (charType === 'artisan') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Work Clothes & Leather Apron */}
        <path d="M 12 100 Q 50 82 88 100 Z" fill="#b45309" />
        <path d="M 34 86 L 50 100 L 66 86" stroke="#f59e0b" strokeWidth="2.5" fill="none" />

        {/* Face */}
        <ellipse cx="50" cy="52" rx="22" ry="22" fill="#fed7aa" />

        {/* Orange Workshop Headband */}
        <rect x="25" y="32" width="50" height="9" rx="3" fill="#ea580c" />
        <circle cx="50" cy="36.5" r="2.2" fill="#fbbf24" />

        {/* Short Dark Hair peeking */}
        <path d="M 24 33 Q 50 20 76 33" stroke="#451a03" strokeWidth="4" fill="none" />

        {/* Determined Anime Eyes */}
        {renderEyes(39, 61, 48)}

        {/* Craftsman Smudge */}
        <circle cx="36" cy="57" r="2" fill="#78350f" opacity="0.3" />

        {/* Mouth */}
        {renderMouth(50, 65)}
      </svg>
    );
  }

  // 5. KING / RAJA BAHASA
  if (charType === 'king') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Royal Mantle */}
        <path d="M 10 100 Q 50 78 90 100 Z" fill="#7e22ce" />
        <path d="M 28 84 Q 50 96 72 84" stroke="#fbbf24" strokeWidth="4" fill="none" />

        {/* Face */}
        <ellipse cx="50" cy="53" rx="21" ry="23" fill="#ffedd5" />

        {/* Royal Crown */}
        <path
          d="M 28 36 L 32 20 L 41 28 L 50 16 L 59 28 L 68 20 L 72 36 Z"
          fill="#fbbf24"
          stroke="#b45309"
          strokeWidth="1.2"
        />
        <circle cx="50" cy="24" r="2" fill="#dc2626" />
        <circle cx="37" cy="27" r="1.5" fill="#2563eb" />
        <circle cx="63" cy="27" r="1.5" fill="#2563eb" />

        {/* Regal Eyes */}
        {renderEyes(39, 61, 49)}

        {/* Mouth */}
        {renderMouth(50, 66)}
      </svg>
    );
  }

  // 6. DEFAULT / SCHOLAR / DETECTIVE FALLBACK
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="text-4xl mb-1 filter drop-shadow">
        {fallbackAvatar || '🧙‍♂️'}
      </div>
      {/* Animated Lip-Sync Overlay Indicator */}
      <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-400/50">
        <span
          className={`w-2.5 h-1.5 rounded-full bg-amber-400 transition-all ${
            isTalking ? 'scale-y-150 animate-pulse' : 'scale-y-75 opacity-60'
          }`}
        />
        <span className="text-[10px] font-bold text-amber-300">
          {isTalking ? 'Bercakap' : 'Sedia'}
        </span>
      </div>
    </div>
  );
};
