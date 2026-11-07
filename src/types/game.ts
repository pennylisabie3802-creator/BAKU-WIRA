/**
 * BAKUWIRA: Misi Penyelamat Bahasa
 * Domain Types and Data Definitions
 */

export type ActivityType =
  | 'kuiz_interaktif'
  | 'simulasi_npc'
  | 'simulasi_pertuturan'
  | 'cabaran_penulisan'
  | 'penerokaan'
  | 'word_highlight_match'
  | 'single_choice'
  | 'writing_rewrite'
  | 'speaking_announcement'
  | 'investigation_writing'
  | 'multiple_choice'
  | 'matching'
  | 'npc_dialogue'
  | 'word_order'
  | 'writing_message'
  | 'writing_announcement'
  | 'speaking_npc'
  | 'speaking_transaction'
  | 'speaking_interview'
  | 'speaking_forum'
  | 'writing_invitation'
  | 'speaking_speech'
  | 'integrated_final';

export type RegionId =
  | 'kota_media'
  | 'akademi'
  | 'bengkel'
  | 'kampung'
  | 'istana';

export type MissionProgressionState = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'COMPLETED';

export type ReviewStatus = 'confirmed' | 'needs_review' | 'edited';

export interface QuizChoice {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ClueItem {
  id: string;
  label: string;
  rojakText: string;
  bakuText: string;
  explanation: string;
  position: [number, number, number];
}

export interface SpeechCriteria {
  prompt: string;
  targetPhrase: string;
  minSeconds: number;
  maxSeconds: number;
  tips: string[];
}

export interface WritingRubricCategory {
  name: string; // e.g. "Isi", "Tatabahasa", "Ejaan", "Gaya Bahasa"
  maxMarks: number;
  description: string;
}

export interface WritingTask {
  promptTemplate: string;
  sampleGoodAnswer: string;
  keyKeywords: string[];
  rubricCategories: WritingRubricCategory[];
}

export interface SubLocationInfo {
  id: string;
  order: number; // 1, 2, 3, 4
  name: string;
  description: string;
  coordinates: [number, number, number];
  primaryNpc: string;
  activityId: string;
  iconType: 'blue_diamond' | 'green_bubble' | 'purple_crystal' | 'gold_star';
}

export interface RegionInfo {
  id: RegionId;
  orderNumber: number; // 1 to 5
  name: string;
  tagline: string;
  color: string;
  accentColor: number;
  skyColor: number;
  groundColor: number;
  ambientColor: number;
  crystalName: string;
  crystalIcon: string;
  icon: string;
  description: string;
  image: string;
  missionIntro: string;
  floatingThemedIcons: string[];
  sublocations: SubLocationInfo[];
  mapCoords: { x: number; y: number }; // percentage on PETA_LOKASI artwork
}

export interface MissionQuestion {
  id: string; // e.g. "BW-M01"
  number?: number; // 1 to 21
  missionId: number; // 1 to 5
  missionTitle: string;
  regionId: RegionId;
  regionName: string;
  locationId: string;
  locationName: string;
  activityType: ActivityType;
  sequenceNumber?: number; // 1, 2, 3...
  title: string;
  narrativeContext?: string;
  npcName?: string;
  npcRole?: string;
  npcAvatar?: string;
  npcDialoguePrompt?: string;
  originalSource: string; // Document source, page, or curricular reference
  sourceType?: string;
  sourceContent?: {
    situasi: string;
    bahanDialogSoalan: string;
    arahanPemain: string;
    jawapanPanduanPenilaian: string;
    mekanikPermainan: string;
    had?: string;
  };
  structuredAnswer?: {
    pairs?: [string, string][];
    options?: { key: string; text: string }[];
    correctKeys?: string[];
    evidence?: string[];
    referenceSentence?: string;
    phases?: string[];
    acceptedAnswers?: string[];
  };
  assessmentMode?: 'objective' | 'rubric_or_teacher_review';
  timeLimitSpeakingSeconds?: number | null;
  preparationSeconds?: number | null;
  editable?: boolean;
  source?: {
    file: string;
    page: number;
  };
  reviewStatus: ReviewStatus;
  reviewNotes?: string;
  prompt: string;
  originalChoices?: QuizChoice[];
  correctAnswerText: string;
  justification: string;
  supportingImage?: string;
  supportingAudio?: string;
  hints?: string[];
  maxMarks?: number;
  explorationClues?: ClueItem[];
  speechCriteria?: SpeechCriteria;
  writingTask?: WritingTask;
  xpReward: number;
  coinReward: number;
  moduleReward?: string;
  nextLocationId?: string;
  lastEdited?: string;
  publishedVersion?: number;
}

export interface AvatarCustomization {
  gender: 'lelaki' | 'perempuan';
  hairStyle: number | string;
  hairColor: string;
  outfitColor: string;
  accessory: string;
  skinTone?: string;
}

export interface LanguageModuleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  exampleRojak: string;
  exampleBaku: string;
  unlockedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  coins: number;
  currentRegion: RegionId;
  currentLocationId: string;
  currentLocationName: string;
  targetDestinationId?: string;
  avatar: AvatarCustomization;
  completedActivities: string[]; // question ids
  unlockedRegions: RegionId[];
  unlockedLocations: string[]; // location ids
  collectedCrystals: string[]; // e.g. ['Kristal Komunikasi']
  tutorialCompleted: boolean;
  playerCoordinates: [number, number, number];
  playerRotationY: number;
  badges: string[];
  inventory: InventoryItem[];
  languageModules: LanguageModuleItem[];
  playtimeSeconds: number;
  speechScores: Record<string, number>;
  writingScores: Record<string, number>;
  selectedHero?: 'lelaki' | 'perempuan';
  heroModelId?: string;
  selectionConfirmed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GameScreen =
  | 'start_screen'
  | 'main_menu'
  | 'hero_selection'
  | 'hero_transition'
  | 'profile_select'
  | 'character_creator'
  | 'story_cinematic'
  | 'tutorial_controls'
  | 'world_map'
  | 'exploration_3d'
  | 'climax_battle'
  | 'game_over_credits';
