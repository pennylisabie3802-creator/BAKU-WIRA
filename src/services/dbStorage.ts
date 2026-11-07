/**
 * BAKUWIRA: IndexedDB & Persistence System
 * Implements Part 10 specifications:
 * Stores active region, current location, unlocked locations, player coordinates,
 * completed activities, quest state, and safe checkpoints with automatic fallback.
 */

import { PlayerProfile, RegionId } from '../types/game';

const DB_NAME = 'bakuwira_rpg_db';
const DB_VERSION = 2;
const STORE_PROFILE = 'player_profile';
const STORE_CHECKPOINT = 'safe_checkpoint';

let dbInstance: IDBDatabase | null = null;

export async function initIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return null;
  }

  if (dbInstance) return dbInstance;

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_PROFILE)) {
          db.createObjectStore(STORE_PROFILE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_CHECKPOINT)) {
          db.createObjectStore(STORE_CHECKPOINT, { keyPath: 'profileId' });
        }
      };

      request.onsuccess = (e: any) => {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB open error, falling back to localStorage:', e);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB init caught error:', err);
      resolve(null);
    }
  });
}

export async function saveProfileToIndexedDB(profile: PlayerProfile): Promise<void> {
  const db = await initIndexedDB();
  if (db) {
    try {
      const tx = db.transaction([STORE_PROFILE, STORE_CHECKPOINT], 'readwrite');
      const storeProfile = tx.objectStore(STORE_PROFILE);
      storeProfile.put(profile);

      // Save safe checkpoint
      const storeCheckpoint = tx.objectStore(STORE_CHECKPOINT);
      storeCheckpoint.put({
        profileId: profile.id,
        region: profile.currentRegion,
        locationId: profile.currentLocationId,
        coordinates: profile.playerCoordinates || [0, 0, 0],
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('IndexedDB put error:', e);
    }
  }

  // Dual backup to localStorage for instant sync & robustness
  try {
    localStorage.setItem(`bakuwira_profile_${profile.id}`, JSON.stringify(profile));
    localStorage.setItem('bakuwira_last_active_id', profile.id);
  } catch (e) {
    // ignore
  }
}

export async function loadProfileFromIndexedDB(profileId?: string): Promise<PlayerProfile | null> {
  const db = await initIndexedDB();
  if (db && profileId) {
    try {
      const tx = db.transaction([STORE_PROFILE], 'readonly');
      const store = tx.objectStore(STORE_PROFILE);
      const req = store.get(profileId);
      const result = await new Promise<PlayerProfile | null>((res) => {
        req.onsuccess = () => res(req.result || null);
        req.onerror = () => res(null);
      });
      if (result) return result;
    } catch (e) {
      console.warn('IndexedDB get error:', e);
    }
  }

  // Fallback to localStorage
  try {
    const idToLoad = profileId || localStorage.getItem('bakuwira_last_active_id');
    if (idToLoad) {
      const raw = localStorage.getItem(`bakuwira_profile_${idToLoad}`);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }

  return null;
}
