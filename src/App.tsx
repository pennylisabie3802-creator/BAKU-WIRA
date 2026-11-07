/**
 * BAKUWIRA: Misi Penyelamat Bahasa
 * Master Application Entry Point
 * Orchestrates 3D exploration, the 7-screen Interactive Tutorial,
 * PETA LOKASI anime fantasy world map, automatic next-location/region progression,
 * and IndexedDB persistence.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  GameScreen,
  PlayerProfile,
  MissionQuestion,
  RegionId,
  AvatarCustomization,
  SubLocationInfo,
  RegionInfo,
} from './types/game';
import {
  getMissionQuestions,
  saveMissionQuestions,
  getActiveProfile,
  updateActiveProfile,
  getPlayerProfiles,
  savePlayerProfiles,
  setActiveProfileId,
} from './services/storage';
import { saveProfileToIndexedDB } from './services/dbStorage';
import { REGIONS_DATA } from './data/missionBank';

// Screens
import { StartScreen } from './components/screens/StartScreen';
import { MainMenu } from './components/screens/MainMenu';
import { ProfileSelect } from './components/screens/ProfileSelect';
import { CharacterCreator } from './components/screens/CharacterCreator';
import { HeroSelectionScreen, HeroGender } from './components/screens/HeroSelectionScreen';
import { HeroTransitionScreen } from './components/screens/HeroTransitionScreen';
import { StoryCinematic } from './components/screens/StoryCinematic';
import { TutorialControls } from './components/screens/TutorialControls';
import { WorldMap } from './components/screens/WorldMap';
import { ClimaxBossScreen } from './components/screens/ClimaxBossScreen';
import { GameOverCredits } from './components/screens/GameOverCredits';
import { LocationSuccessModal } from './components/screens/LocationSuccessModal';
import { RegionSuccessModal } from './components/screens/RegionSuccessModal';
import { TransitionOverlay } from './components/screens/TransitionOverlay';
import { SystemMenuModal } from './components/screens/SystemMenuModal';
import { AnimatedRegionEntrance } from './components/screens/AnimatedRegionEntrance';

// Modals
import { InventoryModal } from './components/modals/InventoryModal';
import { LanguageCollectionModal } from './components/modals/LanguageCollectionModal';

// Tutorial System (Part 1)
import { InteractiveTutorialModal } from './components/tutorial/InteractiveTutorialModal';

// 3D & HUD
import { World3D } from './components/3d/World3D';
import { GameHUD } from './components/hud/GameHUD';
import { OrientationGuideModal } from './components/modals/OrientationGuideModal';

// Interactive Educational Activities Dispatcher
import { ActivityDispatcher } from './components/activities/ActivityDispatcher';

// Admin / Teacher Suite
import { MissionContentManager } from './components/admin/MissionContentManager';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('main_menu');
  const [questions, setQuestions] = useState<MissionQuestion[]>([]);
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<PlayerProfile | null>(null);

  // Real-time 3D coordinates & rotation for Minimap
  const [playerCoords, setPlayerCoords] = useState<[number, number, number]>([0, 0, 4]);
  const [playerRotationY, setPlayerRotationY] = useState<number>(0);

  // Modals & Overlays
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [activeActivityQuestion, setActiveActivityQuestion] = useState<MissionQuestion | null>(null);
  const [inspectingClueId, setInspectingClueId] = useState<string | undefined>(undefined);

  // Completion Modals (Parts 6 & 7)
  const [locationSuccessData, setLocationSuccessData] = useState<{
    question: MissionQuestion;
    currentSublocationName: string;
    nextSublocation?: SubLocationInfo;
    isRegionComplete: boolean;
    leveledUp: boolean;
    newLevel: number;
  } | null>(null);

  const [regionSuccessData, setRegionSuccessData] = useState<{
    completedRegionId: RegionId;
    nextRegionId?: RegionId;
  } | null>(null);

  // Transition Animation Overlay (Part 9)
  const [transitionData, setTransitionData] = useState<{
    title: string;
    subtitle: string;
    educationalTip: string;
    onComplete: () => void;
  } | null>(null);

  // Layer A: Animated Region Entrance (Hybrid System)
  const [activeRegionEntrance, setActiveRegionEntrance] = useState<RegionInfo | null>(null);

  const [systemMenuOpen, setSystemMenuOpen] = useState(false);
  const [contentManagerOpen, setContentManagerOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [heroTransitionData, setHeroTransitionData] = useState<{
    gender: HeroGender;
    name: string;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedQuestions = getMissionQuestions();
    setQuestions(loadedQuestions);

    const loadedProfiles = getPlayerProfiles();
    setProfiles(loadedProfiles);

    const activeP = getActiveProfile();
    setActiveProfile(activeP);
    if (activeP.playerCoordinates) {
      setPlayerCoords(activeP.playerCoordinates);
    }
  }, []);

  // Current Region & Sublocations Data
  const currentRegion = useMemo(() => {
    if (!activeProfile) return REGIONS_DATA[0];
    return REGIONS_DATA.find((r) => r.id === activeProfile.currentRegion) || REGIONS_DATA[0];
  }, [activeProfile?.currentRegion]);

  const currentSublocation = useMemo(() => {
    if (!activeProfile) return currentRegion.sublocations[0];
    return (
      currentRegion.sublocations.find((s) => s.id === activeProfile.currentLocationId) ||
      currentRegion.sublocations[0]
    );
  }, [currentRegion, activeProfile?.currentLocationId]);

  const targetDestination = useMemo(() => {
    if (activeProfile?.targetDestinationId) {
      const found = currentRegion.sublocations.find((s) => s.id === activeProfile.targetDestinationId);
      if (found) return found;
    }
    // Fallback: first uncompleted sublocation in current region
    const incompleteSub = currentRegion.sublocations.find(
      (s) => !activeProfile?.completedActivities.includes(s.activityId)
    );
    if (incompleteSub) return incompleteSub;
    return currentRegion.sublocations[1] || currentRegion.sublocations[0];
  }, [currentRegion, activeProfile?.targetDestinationId, activeProfile?.completedActivities]);

  // Compute active question for current sublocation
  const activeQuestion = useMemo(() => {
    if (!activeProfile) return undefined;
    // Find question matching current sublocation's activity
    const matched = questions.find((q) => q.id === currentSublocation?.activityId);
    if (matched) return matched;

    // Fallback: first incomplete in region
    const regionQuestions = questions.filter((q) => q.regionId === activeProfile.currentRegion);
    const incomplete = regionQuestions.find(
      (q) => !activeProfile.completedActivities.includes(q.id)
    );
    return incomplete || regionQuestions[0];
  }, [questions, currentSublocation, activeProfile]);

  const [isEditingExistingProfile, setIsEditingExistingProfile] = useState(false);

  // Screen Transitions
  const handleStartGame = () => {
    setCurrentScreen('main_menu');
  };

  const handleStartNewProfile = () => {
    setIsEditingExistingProfile(false);
    setCurrentScreen('hero_selection');
  };

  const handleStartHeroSelection = () => {
    setCurrentScreen('hero_selection');
  };

  const handleStartAdventureFlow = () => {
    if (!activeProfile || !activeProfile.selectedHero) {
      setCurrentScreen('hero_selection');
    } else {
      setCurrentScreen('world_map');
    }
  };

  const handleHeroConfirm = (gender: HeroGender, name: string) => {
    const defaultHeroName = gender === 'lelaki' ? 'Wira Lelaki' : 'Wira Perempuan';
    const chosenName = name?.trim() || activeProfile?.name || defaultHeroName;
    const modelId = gender === 'lelaki' ? 'wira_lelaki_3d' : 'wira_perempuan_3d';

    if (activeProfile) {
      const updated = updateActiveProfile((prev) => ({
        ...prev,
        name: chosenName,
        selectedHero: gender,
        heroModelId: modelId,
        selectionConfirmed: true,
        avatar: {
          ...prev.avatar,
          gender,
          hairStyle: gender === 'perempuan' ? 'long_ribbon' : 'anime_spiky',
          hairColor: '#3d2314',
          outfitColor: gender === 'perempuan' ? '#9333ea' : '#2563eb',
        },
        updatedAt: new Date().toISOString(),
      }));
      setActiveProfile(updated);
      saveProfileToIndexedDB(updated);
    } else {
      const newProfile: PlayerProfile = {
        id: `prof_${Date.now()}`,
        name: chosenName,
        level: 1,
        xp: 0,
        maxXp: 1000,
        coins: 100,
        currentRegion: 'kota_media',
        currentLocationId: 'W01-L01',
        currentLocationName: 'Dataran Mesej',
        targetDestinationId: 'W01-L02',
        selectedHero: gender,
        heroModelId: modelId,
        selectionConfirmed: true,
        avatar: {
          gender,
          hairStyle: gender === 'perempuan' ? 'long_ribbon' : 'anime_spiky',
          hairColor: '#3d2314',
          skinTone: '#fcd34d',
          outfitColor: gender === 'perempuan' ? '#9333ea' : '#2563eb',
          accessory: 'magic_tome',
        },
        completedActivities: [],
        unlockedRegions: ['kota_media'],
        unlockedLocations: ['W01-L01'],
        collectedCrystals: [],
        tutorialCompleted: true,
        playerCoordinates: [0, 0, 4],
        playerRotationY: 0,
        badges: ['Wira Baru Mendaftar'],
        inventory: [
          { id: 'inv_kanta', name: 'Kanta Siasatan Baku', description: 'Mendedahkan glit bahasa rojak', icon: '🔍', count: 1 },
          { id: 'inv_buku', name: 'Kamus Dewan Mini', description: 'Rujukan ejaan dan makna kata rasmi', icon: '📖', count: 1 }
        ],
        languageModules: [],
        playtimeSeconds: 0,
        speechScores: {},
        writingScores: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      savePlayerProfiles(updatedProfiles);
      saveProfileToIndexedDB(newProfile);
      setActiveProfile(newProfile);
      setActiveProfileId(newProfile.id);
    }

    setHeroTransitionData({ gender, name: chosenName });
    setCurrentScreen('hero_transition');
  };

  const handleHeroTransitionComplete = () => {
    // Required flow: After transition completes, open PETA DUNIA BAKUWIRA (World Map)
    setCurrentScreen('world_map');
  };

  const handleCustomizeProfile = (profile: PlayerProfile) => {
    setActiveProfile(profile);
    setActiveProfileId(profile.id);
    setIsEditingExistingProfile(true);
    setCurrentScreen('character_creator');
  };

  const handleContinueGame = () => {
    if (activeProfile) {
      const regData = REGIONS_DATA.find((r) => r.id === activeProfile.currentRegion) || REGIONS_DATA[0];
      setActiveRegionEntrance(regData);
    } else {
      setCurrentScreen('hero_selection');
    }
  };

  const handleSelectProfile = (p: PlayerProfile) => {
    setActiveProfile(p);
    setActiveProfileId(p.id);
    const regData = REGIONS_DATA.find((r) => r.id === p.currentRegion) || REGIONS_DATA[0];
    setActiveRegionEntrance(regData);
  };

  const handleCreateProfileConfirm = (name: string, avatar: AvatarCustomization) => {
    if (isEditingExistingProfile && activeProfile) {
      const updated = updateActiveProfile((prev) => ({
        ...prev,
        name,
        avatar,
        updatedAt: new Date().toISOString(),
      }));
      setActiveProfile(updated);
      saveProfileToIndexedDB(updated);
      setIsEditingExistingProfile(false);
      setCurrentScreen('main_menu');
      return;
    }

    const newProfile: PlayerProfile = {
      id: `prof_${Date.now()}`,
      name,
      level: 1,
      xp: 0,
      maxXp: 1000,
      coins: 100,
      currentRegion: 'kota_media', // Starts in Kota Media Sosial (Part 3)
      currentLocationId: 'W01-L01',
      currentLocationName: 'Dataran Mesej',
      targetDestinationId: 'W01-L02',
      avatar,
      completedActivities: [],
      unlockedRegions: ['kota_media'],
      unlockedLocations: ['W01-L01'],
      collectedCrystals: [],
      tutorialCompleted: false, // Triggers tutorial modal!
      playerCoordinates: [0, 0, 4],
      playerRotationY: 0,
      badges: ['Wira Baru Mendaftar'],
      inventory: [
        { id: 'inv_kanta', name: 'Kanta Siasatan Baku', description: 'Mendedahkan glit bahasa rojak', icon: '🔍', count: 1 },
        { id: 'inv_buku', name: 'Kamus Dewan Mini', description: 'Rujukan ejaan dan makna kata rasmi', icon: '📖', count: 1 }
      ],
      languageModules: [],
      playtimeSeconds: 0,
      speechScores: {},
      writingScores: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    savePlayerProfiles(updatedProfiles);
    saveProfileToIndexedDB(newProfile);
    setActiveProfile(newProfile);
    setActiveProfileId(newProfile.id);

    // Enter cinematic story, then tutorial
    setCurrentScreen('story_cinematic');
  };

  const handleCinematicContinue = () => {
    // Open Interactive Gameplay Tutorial (Part 1)
    setTutorialOpen(true);
    setCurrentScreen('exploration_3d');
  };

  const handleFinishTutorial = () => {
    setTutorialOpen(false);
    // Mark tutorial completed and position player at Kota Media Sosial starting position
    const updated = updateActiveProfile((prev) => ({
      ...prev,
      tutorialCompleted: true,
      currentRegion: 'kota_media',
      currentLocationId: 'W01-L01',
      currentLocationName: 'Dataran Mesej',
      playerCoordinates: [0, 0, 4],
    }));
    setActiveProfile(updated);
    setPlayerCoords([0, 0, 4]);
    setActiveRegionEntrance(REGIONS_DATA[0]);
  };

  const handleSelectRegionAndLocation = (rId: RegionId, locId: string) => {
    const targetReg = REGIONS_DATA.find((r) => r.id === rId) || REGIONS_DATA[0];
    const targetSub = targetReg?.sublocations.find((s) => s.id === locId) || targetReg?.sublocations[0];

    const updated = updateActiveProfile((prev) => ({
      ...prev,
      currentRegion: rId,
      currentLocationId: targetSub?.id || locId,
      currentLocationName: targetSub?.name || 'Kawasan 3D',
      targetDestinationId: targetSub?.id,
      playerCoordinates: targetSub?.coordinates || [0, 0, 4],
    }));
    setActiveProfile(updated);
    setPlayerCoords(targetSub?.coordinates || [0, 0, 4]);
    setActiveRegionEntrance(targetReg);
  };

  const handleSetDestination = (destinationLocationId: string) => {
    const updated = updateActiveProfile((prev) => ({
      ...prev,
      targetDestinationId: destinationLocationId,
    }));
    setActiveProfile(updated);
  };

  // Activity Completion Handler
  const handleActivityComplete = (score: number, passed: boolean) => {
    if (!activeActivityQuestion || !activeProfile) return;

    const q = activeActivityQuestion;
    const isAlreadyCompleted = activeProfile.completedActivities.includes(q.id);

    const xpGained = isAlreadyCompleted ? 0 : q.xpReward;
    const coinsGained = isAlreadyCompleted ? 0 : q.coinReward;

    let newXp = activeProfile.xp + xpGained;
    let newLevel = activeProfile.level;
    let leveledUp = false;
    let maxXp = activeProfile.maxXp;

    if (newXp >= maxXp) {
      newLevel += 1;
      newXp = newXp - maxXp;
      maxXp = Math.round(maxXp * 1.25);
      leveledUp = true;
    }

    const updatedCompleted = isAlreadyCompleted
      ? activeProfile.completedActivities
      : [...activeProfile.completedActivities, q.id];

    // Find next sublocation in current region
    const subIdx = currentRegion.sublocations.findIndex((s) => s.id === currentSublocation?.id);
    const nextSub = subIdx >= 0 && subIdx < currentRegion.sublocations.length - 1
      ? currentRegion.sublocations[subIdx + 1]
      : undefined;

    // Check if region is completed (4th sublocation finished)
    const isRegionComplete = subIdx === currentRegion.sublocations.length - 1;

    // Unlock next sublocation
    let updatedUnlockedLocs = [...activeProfile.unlockedLocations];
    if (nextSub && !updatedUnlockedLocs.includes(nextSub.id)) {
      updatedUnlockedLocs.push(nextSub.id);
    }

    // Collected crystals update
    let updatedCrystals = [...activeProfile.collectedCrystals];
    if (isRegionComplete && !updatedCrystals.includes(currentRegion.crystalName)) {
      updatedCrystals.push(currentRegion.crystalName);
    }

    // Unlock next region if complete
    let updatedUnlockedRegions = [...activeProfile.unlockedRegions];
    const regionOrder: RegionId[] = ['kota_media', 'akademi', 'bengkel', 'kampung', 'istana'];
    const curRegIndex = regionOrder.indexOf(currentRegion.id);
    const nextRegId = curRegIndex >= 0 && curRegIndex < regionOrder.length - 1 ? regionOrder[curRegIndex + 1] : undefined;

    if (isRegionComplete && nextRegId && !updatedUnlockedRegions.includes(nextRegId)) {
      updatedUnlockedRegions.push(nextRegId);
      // Also unlock the first location of next region
      const nextRegData = REGIONS_DATA.find((r) => r.id === nextRegId);
      if (nextRegData && nextRegData.sublocations[0] && !updatedUnlockedLocs.includes(nextRegData.sublocations[0].id)) {
        updatedUnlockedLocs.push(nextRegData.sublocations[0].id);
      }
    }

    const updatedProfile = updateActiveProfile((prev) => ({
      ...prev,
      level: newLevel,
      xp: newXp,
      maxXp,
      coins: prev.coins + coinsGained,
      completedActivities: updatedCompleted,
      unlockedLocations: updatedUnlockedLocs,
      unlockedRegions: updatedUnlockedRegions,
      collectedCrystals: updatedCrystals,
    }));

    setActiveProfile(updatedProfile);
    saveProfileToIndexedDB(updatedProfile);
    setActiveActivityQuestion(null);
    setInspectingClueId(undefined);

    // Trigger Completion Modals (Parts 6 & 7)
    if (q.id === 'BW-M20') {
      setLocationSuccessData({
        question: q,
        currentSublocationName: currentSublocation?.name || 'Balairung Seri',
        isRegionComplete: false,
        leveledUp,
        newLevel,
      });
    } else if (q.id === 'BW-M21') {
      setLocationSuccessData({
        question: q,
        currentSublocationName: 'Dewan Mahkota Bahasa',
        isRegionComplete: true,
        leveledUp,
        newLevel,
      });
    } else if (isRegionComplete) {
      setRegionSuccessData({
        completedRegionId: currentRegion.id,
        nextRegionId: nextRegId,
      });
    } else {
      setLocationSuccessData({
        question: q,
        currentSublocationName: currentSublocation?.name || 'Lokasi Ini',
        nextSublocation: nextSub,
        isRegionComplete,
        leveledUp,
        newLevel,
      });
    }
  };

  // Progression Action 1: "TERUSKAN KE LOKASI SETERUSNYA" (Part 6)
  const handleContinueNextLocation = () => {
    if (!locationSuccessData || !activeProfile) return;
    const completedQ = locationSuccessData.question;
    setLocationSuccessData(null);

    // Special transition from Misi 20 to Misi 21 (Final Challenge)
    if (completedQ.id === 'BW-M20') {
      const finalQuestion = questions.find((q) => q.id === 'BW-M21');
      if (finalQuestion) {
        setTransitionData({
          title: 'DEWAN MAHKOTA BAHASA',
          subtitle: 'CABARAN PENAMAT KERAJAAN BAKUWIRA',
          educationalTip:
            'Tahniah kerana sampai ke cabaran terakhir! Siasat mesej, tulis pengumuman rasmi dan sampaikan ucapan wira bahasa untuk memulihkan seluruh empayar.',
          onComplete: () => {
            setTransitionData(null);
            setActiveActivityQuestion(finalQuestion);
          },
        });
        return;
      }
    }

    // Special transition from Misi 21 to Grand Ending Credits
    if (completedQ.id === 'BW-M21') {
      setCurrentScreen('game_over_credits');
      return;
    }

    if (!locationSuccessData.nextSublocation) return;
    const nextSub = locationSuccessData.nextSublocation;

    // Trigger smooth transition animation (Part 9)
    setTransitionData({
      title: nextSub.name,
      subtitle: `MENUJU KE SUBLOKASI SETERUSNYA (${nextSub.order}/4)`,
      educationalTip:
        'Sentiasa perhatikan laras bahasa yang tepat mengikut situasi dan penutur.',
      onComplete: () => {
        setTransitionData(null);
        // Position player at next objective spawn point
        const updated = updateActiveProfile((prev) => ({
          ...prev,
          currentLocationId: nextSub.id,
          currentLocationName: nextSub.name,
          targetDestinationId: nextSub.id,
          playerCoordinates: nextSub.coordinates,
        }));
        setActiveProfile(updated);
        setPlayerCoords(nextSub.coordinates);
      },
    });
  };

  // Progression Action: "TERUSKAN KE WILAYAH SETERUSNYA" (Part 7)
  const handleContinueNextRegion = () => {
    if (!regionSuccessData || !activeProfile) return;
    const nextRegId = regionSuccessData.nextRegionId;
    setRegionSuccessData(null);

    if (!nextRegId) {
      // Completed final region (Istana Wira Bahasa) -> Final Victory!
      setCurrentScreen('game_over_credits');
      return;
    }

    const nextRegData = REGIONS_DATA.find((r) => r.id === nextRegId) || REGIONS_DATA[0];
    const firstSub = nextRegData.sublocations[0];

    // Trigger region transition animation
    setTransitionData({
      title: nextRegData.name,
      subtitle: `WILAYAH KE-${nextRegData.orderNumber} DIBUKA!`,
      educationalTip: nextRegData.description,
      onComplete: () => {
        setTransitionData(null);
        const updated = updateActiveProfile((prev) => ({
          ...prev,
          currentRegion: nextRegId,
          currentLocationId: firstSub.id,
          currentLocationName: firstSub.name,
          targetDestinationId: firstSub.id,
          playerCoordinates: firstSub.coordinates,
        }));
        setActiveProfile(updated);
        setPlayerCoords(firstSub.coordinates);
        setActiveRegionEntrance(nextRegData);
      },
    });
  };

  // 3D World Interaction Triggers
  const handleInteractNPC = (npcName: string) => {
    if (activeQuestion) {
      setActiveActivityQuestion(activeQuestion);
    }
  };

  const handleInspectClue = (clueId: string) => {
    if (activeQuestion) {
      setInspectingClueId(clueId);
      setActiveActivityQuestion(activeQuestion);
    }
  };

  const handlePlayQuestionFromManager = (questionToPlay: MissionQuestion) => {
    setContentManagerOpen(false);
    if (activeProfile && activeProfile.currentRegion !== questionToPlay.regionId) {
      const updated = updateActiveProfile((prev) => ({
        ...prev,
        currentRegion: questionToPlay.regionId,
        currentLocationId: questionToPlay.locationId,
        currentLocationName: questionToPlay.locationName,
      }));
      setActiveProfile(updated);
    }
    setCurrentScreen('exploration_3d');
    setActiveActivityQuestion(questionToPlay);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1 & 2. MAIN MENU (Game launches immediately into Main Menu) */}
      {(currentScreen === 'main_menu' || currentScreen === 'start_screen') && (
        <MainMenu
          onStartAdventure={handleStartAdventureFlow}
          onStartNew={handleStartHeroSelection}
          onContinue={handleContinueGame}
          onOpenTutorial={() => setTutorialOpen(true)}
          onOpenMissions={() => setCurrentScreen('world_map')}
          onOpenAchievements={() => setSystemMenuOpen(true)}
          onOpenContentManager={() => setContentManagerOpen(true)}
          onOpenSettings={() => setSystemMenuOpen(true)}
          onOpenProfileSelect={handleStartHeroSelection}
          activeProfile={activeProfile}
          onSelectRegion={(regId) => {
            const regData = REGIONS_DATA.find((r) => r.id === regId) || REGIONS_DATA[0];
            const firstSub = regData.sublocations[0];
            if (activeProfile) {
              const updated = updateActiveProfile((prev) => ({
                ...prev,
                currentRegion: regId as RegionId,
                currentLocationId: firstSub.id,
                currentLocationName: firstSub.name,
                targetDestinationId: firstSub.id,
                playerCoordinates: firstSub.coordinates,
              }));
              setActiveProfile(updated);
              setPlayerCoords(firstSub.coordinates);
            }
            setActiveRegionEntrance(regData);
          }}
        />
      )}

      {/* 3. PROFILE SELECT */}
      {currentScreen === 'profile_select' && (
        <ProfileSelect
          profiles={profiles}
          activeProfileId={activeProfile?.id || ''}
          onSelectProfile={handleSelectProfile}
          onCustomizeProfile={handleCustomizeProfile}
          onCreateNew={handleStartHeroSelection}
          onBack={() => setCurrentScreen('main_menu')}
        />
      )}

      {/* 3B. HERO SELECTION (IMAGE C: Pemilihan Watak Utama) */}
      {currentScreen === 'hero_selection' && (
        <HeroSelectionScreen
          initialGender={(activeProfile?.avatar.gender as HeroGender) || 'lelaki'}
          initialName={activeProfile?.name || 'Wira Bahasa'}
          onConfirm={handleHeroConfirm}
          onBack={() => setCurrentScreen('main_menu')}
        />
      )}

      {/* 3C. HERO WORLD ENTRANCE TRANSITION (IMAGE D & E: 3 Transisi Masuk Dunia) */}
      {currentScreen === 'hero_transition' && heroTransitionData && (
        <HeroTransitionScreen
          heroGender={heroTransitionData.gender}
          heroName={heroTransitionData.name}
          regionName={currentRegion.name}
          onTransitionComplete={handleHeroTransitionComplete}
        />
      )}

      {/* 4. CHARACTER CREATOR */}
      {currentScreen === 'character_creator' && (
        <CharacterCreator
          initialAvatar={activeProfile?.avatar}
          initialName={activeProfile?.name || 'Wira Bahasa'}
          onConfirm={handleCreateProfileConfirm}
          onBack={() => setCurrentScreen('main_menu')}
        />
      )}

      {/* 5. STORY CINEMATIC */}
      {currentScreen === 'story_cinematic' && (
        <StoryCinematic onContinue={handleCinematicContinue} />
      )}

      {/* 6. TUTORIAL CONTROLS (Standalone preview) */}
      {currentScreen === 'tutorial_controls' && (
        <TutorialControls onContinue={() => setCurrentScreen('exploration_3d')} />
      )}

      {/* 7. WORLD MAP (PETA DUNIA BAKUWIRA) */}
      {currentScreen === 'world_map' && activeProfile && (
        <WorldMap
          currentRegion={activeProfile.currentRegion}
          currentLocationId={activeProfile.currentLocationId}
          unlockedRegions={activeProfile.unlockedRegions}
          unlockedLocations={activeProfile.unlockedLocations}
          completedActivities={activeProfile.completedActivities}
          collectedCrystals={activeProfile.collectedCrystals}
          targetDestinationId={activeProfile.targetDestinationId}
          onSelectRegionAndLocation={handleSelectRegionAndLocation}
          onSetDestination={handleSetDestination}
          onBack={() => setCurrentScreen('main_menu')}
          onSelectRegion={(reg) => {
            setActiveRegionEntrance(reg);
          }}
        />
      )}

      {/* 8. 3D EXPLORATION & HUD */}
      {currentScreen === 'exploration_3d' && activeProfile && (
        <div className="relative w-full h-full">
          {/* Three.js 3D Canvas */}
          <World3D
            regionId={activeProfile.currentRegion}
            avatar={activeProfile.avatar}
            activeQuestion={activeQuestion}
            currentSublocation={currentSublocation}
            targetDestination={targetDestination}
            onPositionUpdate={(coords, rotY) => {
              setPlayerCoords(coords);
              setPlayerRotationY(rotY);
            }}
            onInteractNPC={handleInteractNPC}
            onInspectClue={handleInspectClue}
            onTriggerMission={() => {
              if (activeQuestion) setActiveActivityQuestion(activeQuestion);
            }}
          />

          {/* Game HUD Overlay with Top-Left Avatar Portrait & Quest Tracker */}
          <GameHUD
            profile={activeProfile}
            activeQuestion={activeQuestion}
            currentSublocation={currentSublocation}
            targetDestination={targetDestination}
            playerCoords={playerCoords}
            playerRotationY={playerRotationY}
            onOpenSystemMenu={() => setSystemMenuOpen(true)}
            onOpenWorldMap={() => setCurrentScreen('world_map')}
            onOpenContentManager={() => setContentManagerOpen(true)}
            onOpenTutorial={() => setTutorialOpen(true)}
            onTriggerActiveActivity={() => {
              if (activeQuestion) setActiveActivityQuestion(activeQuestion);
            }}
            onReturnToRegionEntrance={() => setActiveRegionEntrance(currentRegion)}
            onReturnToMainMenu={() => setCurrentScreen('main_menu')}
            onChangeHero={handleStartHeroSelection}
            onOpenInventory={() => setInventoryOpen(true)}
            onOpenCollection={() => setCollectionOpen(true)}
          />

          {/* Shortcut to Climax Battle when in Region 5 (Istana Wira Bahasa) */}
          {activeProfile.currentRegion === 'istana' && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={() => setCurrentScreen('climax_battle')}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-black text-xs shadow-xl border-2 border-yellow-300 animate-pulse hover:scale-105 transition-all"
              >
                ⚔️ Konfrontasi Boss Kekeliruan Bahasa (Klimaks)
              </button>
            </div>
          )}
        </div>
      )}

      {/* 9. CLIMAX BOSS BATTLE */}
      {currentScreen === 'climax_battle' && (
        <ClimaxBossScreen
          onVictory={() => setCurrentScreen('game_over_credits')}
          onBack={() => setCurrentScreen('exploration_3d')}
        />
      )}

      {/* 10. GAME OVER CREDITS */}
      {currentScreen === 'game_over_credits' && (
        <GameOverCredits
          onContinueExplore={() => setCurrentScreen('exploration_3d')}
          onRestartMenu={() => setCurrentScreen('main_menu')}
        />
      )}

      {/* ==================================================== */}
      {/* INTERACTIVE GAMEPLAY GUIDE (PANDUAN PERMAINAN BAKUWIRA - Part 1) */}
      {/* ==================================================== */}
      {tutorialOpen && activeProfile && (
        <InteractiveTutorialModal
          profile={activeProfile}
          onFinishTutorial={handleFinishTutorial}
          onSkipTutorial={() => setTutorialOpen(false)}
          onClose={() => setTutorialOpen(false)}
        />
      )}

      {/* ==================================================== */}
      {/* LOCATION COMPLETION PANEL (Part 6) */}
      {/* ==================================================== */}
      {locationSuccessData && (
        <LocationSuccessModal
          question={locationSuccessData.question}
          currentSublocationName={locationSuccessData.currentSublocationName}
          nextSublocation={locationSuccessData.nextSublocation}
          isRegionComplete={locationSuccessData.isRegionComplete}
          leveledUp={locationSuccessData.leveledUp}
          newLevel={locationSuccessData.newLevel}
          onContinueNextLocation={handleContinueNextLocation}
          onOpenMap={() => {
            setLocationSuccessData(null);
            setCurrentScreen('world_map');
          }}
          onReplayActivity={() => {
            const q = locationSuccessData.question;
            setLocationSuccessData(null);
            setActiveActivityQuestion(q);
          }}
        />
      )}

      {/* ==================================================== */}
      {/* REGION COMPLETION PANEL (Part 7) */}
      {/* ==================================================== */}
      {regionSuccessData && (
        <RegionSuccessModal
          completedRegion={currentRegion}
          nextRegion={
            regionSuccessData.nextRegionId
              ? REGIONS_DATA.find((r) => r.id === regionSuccessData.nextRegionId)
              : undefined
          }
          onContinueNextRegion={handleContinueNextRegion}
          onOpenWorldMap={() => {
            setRegionSuccessData(null);
            setCurrentScreen('world_map');
          }}
          onContinueExploration={() => setRegionSuccessData(null)}
        />
      )}

      {/* ==================================================== */}
      {/* TRANSITION ANIMATION OVERLAY (Part 9) */}
      {/* ==================================================== */}
      {transitionData && (
        <TransitionOverlay
          title={transitionData.title}
          subtitle={transitionData.subtitle}
          educationalTip={transitionData.educationalTip}
          onTransitionComplete={transitionData.onComplete}
          onReturnToMap={() => {
            setTransitionData(null);
            setCurrentScreen('world_map');
          }}
        />
      )}

      {/* ==================================================== */}
      {/* INTERACTIVE EDUCATIONAL ACTIVITIES (21 MISSIONS) */}
      {/* ==================================================== */}
      {activeActivityQuestion && (
        <ActivityDispatcher
          question={activeActivityQuestion}
          clueId={inspectingClueId}
          onComplete={handleActivityComplete}
          onClose={() => {
            setActiveActivityQuestion(null);
            setInspectingClueId(undefined);
          }}
        />
      )}

      {/* ==================================================== */}
      {/* SYSTEM MENU MODAL */}
      {/* ==================================================== */}
      {systemMenuOpen && activeProfile && (
        <SystemMenuModal
          profile={activeProfile}
          questions={questions}
          onClose={() => setSystemMenuOpen(false)}
          onOpenContentManager={() => {
            setSystemMenuOpen(false);
            setContentManagerOpen(true);
          }}
          onOpenWorldMap={() => {
            setSystemMenuOpen(false);
            setCurrentScreen('world_map');
          }}
        />
      )}

      {/* ==================================================== */}
      {/* MISSION CONTENT MANAGER (TEACHER SUITE) */}
      {/* ==================================================== */}
      {contentManagerOpen && (
        <MissionContentManager
          questions={questions}
          onQuestionsChange={(newQList) => {
            setQuestions(newQList);
            saveMissionQuestions(newQList);
          }}
          onPlayQuestion={handlePlayQuestionFromManager}
          onClose={() => setContentManagerOpen(false)}
        />
      )}

      {/* ==================================================== */}
      {/* LAYER A: ANIMATED REGION ENTRANCE (Official Artwork & Fanfare) */}
      {/* ==================================================== */}
      {activeRegionEntrance && (
        <AnimatedRegionEntrance
          region={activeRegionEntrance}
          activeQuestion={activeQuestion}
          allQuestions={questions}
          completedActivities={activeProfile?.completedActivities || []}
          onEnterPlayable3D={(sublocationId) => {
            if (activeProfile) {
              const reg = activeRegionEntrance;
              const sub = reg.sublocations.find((s) => s.id === sublocationId) || reg.sublocations[0];
              const updated = updateActiveProfile((prev) => ({
                ...prev,
                currentRegion: reg.id,
                currentLocationId: sub.id,
                currentLocationName: sub.name,
                targetDestinationId: sub.id,
                playerCoordinates: sub.coordinates,
              }));
              setActiveProfile(updated);
              setPlayerCoords(sub.coordinates);
            }
            setActiveRegionEntrance(null);
            setCurrentScreen('exploration_3d');
          }}
          onReturnToMap={() => {
            setActiveRegionEntrance(null);
            setCurrentScreen('world_map');
          }}
          onReturnToMainMenu={() => {
            setActiveRegionEntrance(null);
            setCurrentScreen('main_menu');
          }}
        />
      )}

      {/* ==================================================== */}
      {/* INVENTORY MODAL (Part 5) */}
      {/* ==================================================== */}
      {inventoryOpen && (
        <InventoryModal onClose={() => setInventoryOpen(false)} />
      )}

      {/* ==================================================== */}
      {/* LANGUAGE COLLECTION & GLOSSARY MODAL (Part 4) */}
      {/* ==================================================== */}
      {collectionOpen && (
        <LanguageCollectionModal onClose={() => setCollectionOpen(false)} />
      )}

      {/* ==================================================== */}
      {/* MOBILE LANDSCAPE ORIENTATION GUIDE (PUTARKAN TELEFON) */}
      {/* ==================================================== */}
      <OrientationGuideModal />
    </div>
  );
}
