/**
 * BAKUWIRA: Storage & State Persistence Service
 * Handles Canonical 21 Mission Question Bank, Teacher Drafts, and Player Profiles.
 * Dual-layered persistence: IndexedDB primary + localStorage fallback.
 */

import { INITIAL_MISSION_QUESTIONS, REGIONS_DATA } from '../data/missionBank';
import { OFFICIAL_21_MISSIONS } from '../data/official21Missions';
import { MissionQuestion, PlayerProfile, RegionId } from '../types/game';
import { saveProfileToIndexedDB } from './dbStorage';

const QUESTIONS_KEY = 'bakuwira_official_21_questions_v3';
const DRAFTS_KEY = 'bakuwira_teacher_drafts_v1';
const PROFILES_KEY = 'bakuwira_player_profiles_v3';
const ACTIVE_PROFILE_ID_KEY = 'bakuwira_active_profile_id_v3';

// ----------------- Mission Questions Management -----------------

export function getMissionQuestions(): MissionQuestion[] {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load mission questions from storage:', e);
  }
  return [...INITIAL_MISSION_QUESTIONS];
}

export function saveMissionQuestions(questions: MissionQuestion[]): void {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save mission questions to storage:', e);
  }
}

export function saveSingleMissionQuestion(updated: MissionQuestion): MissionQuestion[] {
  const current = getMissionQuestions();
  const index = current.findIndex((q) => q.id === updated.id);
  let updatedList: MissionQuestion[];
  const stamped = {
    ...updated,
    lastEdited: new Date().toISOString(),
    publishedVersion: (updated.publishedVersion || 1) + 1,
  };

  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = stamped;
  } else {
    updatedList = [...current, stamped];
  }
  saveMissionQuestions(updatedList);
  return updatedList;
}

export function restoreSingleMissionQuestionToOriginal(id: string): MissionQuestion[] {
  const canonical = OFFICIAL_21_MISSIONS.find((m) => m.id === id);
  if (!canonical) return getMissionQuestions();

  const current = getMissionQuestions();
  const index = current.findIndex((q) => q.id === id);
  let updatedList: MissionQuestion[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = { ...canonical };
  } else {
    updatedList = [...current, { ...canonical }];
  }
  saveMissionQuestions(updatedList);
  // Clear any draft
  deleteDraftMissionQuestion(id);
  return updatedList;
}

export function deleteMissionQuestion(id: string): MissionQuestion[] {
  const current = getMissionQuestions();
  const filtered = current.filter((q) => q.id !== id);
  saveMissionQuestions(filtered);
  return filtered;
}

export function resetMissionQuestionsToDefault(): MissionQuestion[] {
  try {
    localStorage.removeItem(QUESTIONS_KEY);
    localStorage.removeItem(DRAFTS_KEY);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
  return [...OFFICIAL_21_MISSIONS];
}

export function exportMissionQuestionsJson(): string {
  const data = getMissionQuestions();
  return JSON.stringify(data, null, 2);
}

export function importMissionQuestionsJson(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const list = Array.isArray(parsed) ? parsed : parsed.missions;
    if (!Array.isArray(list)) {
      return { success: false, error: 'Format JSON mestilah mengandungi senarai array soalan atau medan "missions".' };
    }
    for (const item of list) {
      if (!item.id || !item.prompt) {
        return { success: false, error: `Item ${item.id || 'tanpa ID'} tidak mempunyai medan ID atau prompt yang sah.` };
      }
    }
    saveMissionQuestions(list);
    return { success: true, count: list.length };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal memproses fail JSON.' };
  }
}

// ----------------- Teacher Drafts Management (Local/IndexedDB) -----------------

export function getDraftMissionQuestions(): Record<string, MissionQuestion> {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

export function saveDraftMissionQuestion(draft: MissionQuestion): void {
  try {
    const drafts = getDraftMissionQuestions();
    drafts[draft.id] = {
      ...draft,
      lastEdited: new Date().toISOString(),
      reviewStatus: 'edited',
    };
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error('Failed to save draft:', e);
  }
}

export function deleteDraftMissionQuestion(id: string): void {
  try {
    const drafts = getDraftMissionQuestions();
    delete drafts[id];
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // ignore
  }
}

export function publishAllDrafts(): MissionQuestion[] {
  const drafts = getDraftMissionQuestions();
  let questions = getMissionQuestions();

  for (const [id, draft] of Object.entries(drafts)) {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx >= 0) {
      questions[idx] = { ...draft, reviewStatus: 'confirmed' };
    } else {
      questions.push({ ...draft, reviewStatus: 'confirmed' });
    }
  }

  saveMissionQuestions(questions);
  try {
    localStorage.removeItem(DRAFTS_KEY);
  } catch {}
  return questions;
}

export function getQuestionStats(questions: MissionQuestion[]) {
  const byMission: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const byRegion: Record<string, number> = {
    kota_media: 0,
    akademi: 0,
    bengkel: 0,
    kampung: 0,
    istana: 0,
  };
  let confirmedCount = 0;
  let needsReviewCount = 0;
  let editedCount = 0;

  for (const q of questions) {
    byMission[q.missionId] = (byMission[q.missionId] || 0) + 1;
    if (q.regionId && byRegion[q.regionId] !== undefined) {
      byRegion[q.regionId]++;
    }
    if (q.reviewStatus === 'confirmed') confirmedCount++;
    else if (q.reviewStatus === 'needs_review') needsReviewCount++;
    else if (q.reviewStatus === 'edited') editedCount++;
  }

  return {
    total: questions.length,
    byMission,
    byRegion,
    confirmedCount,
    needsReviewCount,
    editedCount,
  };
}

// ----------------- Profile Management -----------------

export function createDefaultProfiles(): PlayerProfile[] {
  const profile1: PlayerProfile = {
    id: 'prof_1',
    name: 'Wira Aiman',
    level: 12,
    xp: 2440,
    maxXp: 2640,
    coins: 450,
    currentRegion: 'kota_media',
    currentLocationId: 'W01-L01',
    currentLocationName: 'Dataran Mesej',
    targetDestinationId: 'W01-L02',
    avatar: {
      gender: 'lelaki',
      hairStyle: 1,
      hairColor: '#451a03',
      outfitColor: '#2563eb',
      accessory: 'bandana',
    },
    completedActivities: ['BW-M01'],
    unlockedRegions: ['kota_media', 'akademi'],
    unlockedLocations: ['W01-L01', 'W01-L02', 'W02-L01'],
    collectedCrystals: ['Kristal Komunikasi Digital'],
    tutorialCompleted: true,
    playerCoordinates: [0, 0, 2],
    playerRotationY: 0,
    badges: ['Detektif Bahasa Pemula', 'Pemeriksa Tatabahasa', 'Pendengar Santun'],
    inventory: [
      { id: 'inv_kanta', name: 'Kanta Siasatan Baku', description: 'Mendedahkan perkataan rojak yang tersembunyi', icon: '🔍', count: 1 },
      { id: 'inv_buku', name: 'Kamus Dewan Digital', description: 'Rujukan ejaan dan makna kata rasmi', icon: '📖', count: 1 },
      { id: 'inv_mikrofon', name: 'Mikrofon Emas Pengucapan', description: 'Meningkatkan keyakinan bertutur', icon: '🎙️', count: 1 },
    ],
    languageModules: [
      {
        id: 'mod_1',
        title: 'Kesantunan Bersama Guru',
        category: 'Adab Komunikasi',
        description: 'Cara menyapa dan menyampaikan mesej dengan tertib.',
        exampleRojak: 'Cikgu sy xdtg arini',
        exampleBaku: 'Selamat pagi cikgu, saya tidak dapat hadir hari ini.',
        unlockedAt: 'Misi 02',
      },
      {
        id: 'mod_2',
        title: 'Penguasaan Padanan Istilah Siber',
        category: 'Tatabahasa',
        description: 'Menggantikan kata pinjaman digital dengan kosa kata baku.',
        exampleRojak: 'please submit homework b4 Friday',
        exampleBaku: 'sila hantar kerja sekolah sebelum hari Jumaat',
        unlockedAt: 'Misi 01',
      },
    ],
    playtimeSeconds: 12258, // 03:24:18
    speechScores: { 'BW-M04': 92 },
    writingScores: { 'BW-M03': 85 },
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: new Date().toISOString(),
  };

  const profile2: PlayerProfile = {
    id: 'prof_2',
    name: 'Wira Maya',
    level: 5,
    xp: 680,
    maxXp: 1200,
    coins: 180,
    currentRegion: 'kota_media',
    currentLocationId: 'W01-L01',
    currentLocationName: 'Dataran Mesej',
    targetDestinationId: 'W01-L01',
    avatar: {
      gender: 'perempuan',
      hairStyle: 2,
      hairColor: '#1e293b',
      outfitColor: '#9333ea',
      accessory: 'tudung',
    },
    completedActivities: [],
    unlockedRegions: ['kota_media'],
    unlockedLocations: ['W01-L01'],
    collectedCrystals: [],
    tutorialCompleted: true,
    playerCoordinates: [0, 0, 4],
    playerRotationY: 0,
    badges: ['Detektif Bahasa Pemula'],
    inventory: [
      { id: 'inv_kanta', name: 'Kanta Siasatan Baku', description: 'Mendedahkan perkataan rojak yang tersembunyi', icon: '🔍', count: 1 },
    ],
    languageModules: [],
    playtimeSeconds: 3367, // 00:56:07
    speechScores: {},
    writingScores: {},
    createdAt: '2026-03-02T10:30:00Z',
    updatedAt: new Date().toISOString(),
  };

  return [profile1, profile2];
}

export function getPlayerProfiles(): PlayerProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load profiles from storage:', e);
  }
  const defaults = createDefaultProfiles();
  savePlayerProfiles(defaults);
  return defaults;
}

export function savePlayerProfiles(profiles: PlayerProfile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles to storage:', e);
  }
}

export function getActiveProfileId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
    if (id) return id;
  } catch {}
  return 'prof_1';
}

export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
  } catch {}
}

export function getActiveProfile(): PlayerProfile {
  const profiles = getPlayerProfiles();
  const activeId = getActiveProfileId();
  const match = profiles.find((p) => p.id === activeId);
  return match || profiles[0];
}

export function updateActiveProfile(updater: (prev: PlayerProfile) => PlayerProfile): PlayerProfile {
  const profiles = getPlayerProfiles();
  const activeId = getActiveProfileId();
  const index = profiles.findIndex((p) => p.id === activeId);

  let updatedProfile: PlayerProfile;
  if (index >= 0) {
    updatedProfile = updater(profiles[index]);
    profiles[index] = { ...updatedProfile, updatedAt: new Date().toISOString() };
  } else {
    updatedProfile = updater(profiles[0]);
    profiles[0] = { ...updatedProfile, updatedAt: new Date().toISOString() };
  }

  savePlayerProfiles(profiles);
  saveProfileToIndexedDB(updatedProfile);
  return updatedProfile;
}
