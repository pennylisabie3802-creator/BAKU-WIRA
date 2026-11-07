/**
 * BAKUWIRA: Mobile Fullscreen & Orientation Lock Manager
 * Implements standard Fullscreen API with webkit fallbacks and screen.orientation.lock('landscape').
 */

export const isFullscreenSupported = (): boolean => {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenEnabled ||
      (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled ||
      (document as unknown as { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled ||
      (document as unknown as { msFullscreenEnabled?: boolean }).msFullscreenEnabled
  );
};

export const getIsFullscreen = (): boolean => {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
      (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
  );
};

export const requestGameFullscreen = async (element?: HTMLElement): Promise<boolean> => {
  if (typeof document === 'undefined') return false;
  const target = element || document.documentElement;

  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen({ navigationUI: 'hide' } as FullscreenOptions);
    } else if ((target as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
      await (target as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
    } else if ((target as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
      await (target as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
    } else if ((target as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
      await (target as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
    } else {
      return false;
    }

    // Attempt orientation lock to landscape if supported
    if (typeof screen !== 'undefined' && screen.orientation && 'lock' in screen.orientation) {
      try {
        await (screen.orientation as unknown as { lock: (orientation: string) => Promise<void> }).lock('landscape');
      } catch {
        // Not all platforms allow programmatic orientation lock; manual rotation handles the rest
      }
    }

    return true;
  } catch (err) {
    console.warn('Fullscreen request failed or was cancelled:', err);
    return false;
  }
};

export const exitGameFullscreen = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;

  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
      await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
    } else if ((document as unknown as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
      await (document as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
    } else if ((document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
      await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
    }

    // Unlock orientation if previously locked
    if (typeof screen !== 'undefined' && screen.orientation && 'unlock' in screen.orientation) {
      try {
        screen.orientation.unlock();
      } catch {
        // ignore
      }
    }

    return true;
  } catch (err) {
    console.warn('Exit fullscreen failed:', err);
    return false;
  }
};
