/**
 * BAKUWIRA: Dialogue Audio Synthesizer
 * Plays subtle, charming retro RPG speech blips synced with dialogue typewriter.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function playDialogueChirp(npcName: string = ''): void {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  try {
    const lower = npcName.toLowerCase();
    let baseFreq = 420; // Default friendly tone

    if (lower.includes('zahra')) {
      baseFreq = 440 + Math.random() * 60; // Gentle teacher soprano
    } else if (lower.includes('faris') || lower.includes('adik')) {
      baseFreq = 520 + Math.random() * 70; // Energetic boy tenor
    } else if (lower.includes('tok') || lower.includes('samad') || lower.includes('penghulu')) {
      baseFreq = 210 + Math.random() * 30; // Deep elder baritone
    } else if (lower.includes('tukang') || lower.includes('manap') || lower.includes('besi')) {
      baseFreq = 280 + Math.random() * 40; // Warm craftsman tone
    } else if (lower.includes('raja') || lower.includes('tuanku')) {
      baseFreq = 240 + Math.random() * 35; // Regal baritone
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    // Subtle pitch drop for natural speech inflection
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, ctx.currentTime + 0.045);

    // Very soft volume envelope so it is never grating
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Gracefully ignore any browser audio constraints
  }
}
