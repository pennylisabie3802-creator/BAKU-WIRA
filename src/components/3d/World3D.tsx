/**
 * BAKUWIRA: 3D World Viewport
 * Powered by Three.js with PBR materials, smooth third-person camera,
 * interactive NPCs, exploration beacons, active navigation waypoint beam,
 * and mobile virtual joystick support.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AvatarCustomization, MissionQuestion, RegionId, SubLocationInfo } from '../../types/game';
import { REGIONS_DATA } from '../../data/missionBank';
import { soundEffects } from '../../utils/audioEffects';
import {
  createPlazaTileTexture,
  createPalaceSignTexture,
  createSocialFeedTexture,
  createFloatingReactionIcon,
  createSakuraTree,
  createPlazaColonnade,
  createBannerLampPost,
  createStudentNPC,
  createGrandPalaceFacade,
  createCentralHoloPavilion,
  createCrossroadDirectionalSignposts,
  createWestFantasyBridge,
  createPusatKomunikasiDistrict,
  createEastSakuraGardenAndPromenade,
  createLorongSingkatanDistrict,
  createMenaraHologramDistrict,
  getKotaMediaColliders,
} from './kotaMediaProcedural';

interface World3DProps {
  regionId: RegionId;
  avatar: AvatarCustomization;
  activeQuestion?: MissionQuestion;
  currentSublocation?: SubLocationInfo;
  targetDestination?: SubLocationInfo;
  onPositionUpdate?: (coords: [number, number, number], rotY: number) => void;
  onInteractNPC: (npcName: string) => void;
  onInspectClue: (clueId: string) => void;
  onTriggerMission?: () => void;
}

export const World3D: React.FC<World3DProps> = ({
  regionId,
  avatar,
  activeQuestion,
  currentSublocation,
  targetDestination,
  onPositionUpdate,
  onInteractNPC,
  onInspectClue,
  onTriggerMission,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [nearbyPrompt, setNearbyPrompt] = useState<{ text: string; action: () => void } | null>(null);

  // Virtual mobile joystick & action states
  const touchMovementRef = useRef<{ dx: number; dz: number }>({ dx: 0, dz: 0 });
  const [joystickThumb, setJoystickThumb] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSprintActive, setIsSprintActive] = useState(false);
  const isSprintRef = useRef(false);
  const joystickTouchIdRef = useRef<number | null>(null);
  const joystickPointerIdRef = useRef<number | null>(null);
  const [showTouchControls, setShowTouchControls] = useState(true);
  const [isJoystickActive, setIsJoystickActive] = useState(true);
  const joystickFadeTimerRef = useRef<number | null>(null);

  const notifyJoystickActivity = () => {
    setIsJoystickActive(true);
    if (joystickFadeTimerRef.current !== null) {
      window.clearTimeout(joystickFadeTimerRef.current);
    }
    joystickFadeTimerRef.current = window.setTimeout(() => {
      if (joystickTouchIdRef.current === null && joystickPointerIdRef.current === null) {
        setIsJoystickActive(false);
      }
    }, 1800);
  };

  useEffect(() => {
    // Show initially for 2.5s then fade gently to idle opacity
    joystickFadeTimerRef.current = window.setTimeout(() => {
      setIsJoystickActive(false);
    }, 2500);
    return () => {
      if (joystickFadeTimerRef.current !== null) {
        window.clearTimeout(joystickFadeTimerRef.current);
      }
    };
  }, []);

  // Detect touch device or mobile/compact landscape screen
  useEffect(() => {
    const checkTouch = () => {
      if (typeof window === 'undefined') return;
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      const isMobileLandscape = window.innerWidth <= 1024 || window.innerHeight <= 600;
      setShowTouchControls(hasTouch || isMobileLandscape);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Use refs for animation loop access without re-mounting Three.js
  const activeQuestionRef = useRef(activeQuestion);
  activeQuestionRef.current = activeQuestion;

  const targetDestinationRef = useRef(targetDestination);
  targetDestinationRef.current = targetDestination;

  const onInteractNPCRef = useRef(onInteractNPC);
  onInteractNPCRef.current = onInteractNPC;

  const onInspectClueRef = useRef(onInspectClue);
  onInspectClueRef.current = onInspectClue;

  const onPositionUpdateRef = useRef(onPositionUpdate);
  onPositionUpdateRef.current = onPositionUpdate;

  const onTriggerMissionRef = useRef(onTriggerMission);
  onTriggerMissionRef.current = onTriggerMission;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    const regionConfig = REGIONS_DATA.find((r) => r.id === regionId) || REGIONS_DATA[0];

    // Horizon matched fog & background
    scene.background = new THREE.Color(regionConfig.skyColor);
    scene.fog = new THREE.FogExp2(regionConfig.skyColor, 0.022);

    const userQuality = typeof window !== 'undefined' ? (localStorage.getItem('bakuwira_graphics_quality') || 'high') : 'high';
    const enableShadows = !isSoftwareGl && userQuality !== 'low';
    const maxPixel = userQuality === 'low' ? 1 : userQuality === 'medium' ? 1.25 : 2;

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 160);
    const renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl && userQuality !== 'low', powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, maxPixel));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = enableShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig
    const hemiLight = new THREE.HemisphereLight(regionConfig.ambientColor, regionConfig.groundColor, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    keyLight.position.set(25, 35, 20);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(140, 140, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: regionConfig.groundColor,
      roughness: 0.85,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Grid Floor Overlay
    const gridHelper = new THREE.GridHelper(120, 48, regionConfig.accentColor, 0x334155);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // ----------------------------------------------------
    // BUILD REGIONAL ARCHITECTURE (Procedural 3D landmarks matching illustrations)
    // ----------------------------------------------------
    const envGroup = new THREE.Group();
    scene.add(envGroup);

    const animatedObjects: { mesh: THREE.Object3D; update: (t: number) => void }[] = [];

    const buildEnvironment = () => {
      if (regionId === 'kota_media') {
        // ==========================================
        // REGION 1: KOTA MEDIA SOSIAL (Official Anime Cyber Plaza Upgrade)
        // Matching official illustrations 3D_MEDIA_SOSIAL_P & 3d_media_sosial_L
        // ==========================================

        // 1. Polished Royal Marble Courtyard Floor with Concentric Runic Circuits
        const plazaTex = createPlazaTileTexture();
        plazaTex.repeat.set(1, 1);
        const plazaFloorGeo = new THREE.PlaneGeometry(42, 54, 16, 16);
        const plazaFloorMat = new THREE.MeshStandardMaterial({
          map: plazaTex,
          roughness: 0.22,
          metalness: 0.4,
        });
        const plazaFloor = new THREE.Mesh(plazaFloorGeo, plazaFloorMat);
        plazaFloor.rotation.x = -Math.PI / 2;
        plazaFloor.position.set(0, 0.03, 0);
        plazaFloor.receiveShadow = !isSoftwareGl;
        envGroup.add(plazaFloor);

        // 2. Grand Cyber Palace Facade at North (Spanning z = -25 to -35)
        const palaceSignTex = createPalaceSignTexture();
        const palaceFacade = createGrandPalaceFacade(palaceSignTex);
        envGroup.add(palaceFacade);

        // 3. Central Holographic Social Media Pavilion (Positioned at z = -12)
        // (Open and beautiful — NO wireframe sphere blocking the camera view!)
        const feedProfileTex = createSocialFeedTexture('profile');
        const feedTrendTex = createSocialFeedTexture('feed');
        const feedChatTex = createSocialFeedTexture('chat');
        const holoPavilion = createCentralHoloPavilion(feedProfileTex, feedTrendTex, feedChatTex);
        envGroup.add(holoPavilion.group);
        holoPavilion.animatedList.forEach((anim) => {
          animatedObjects.push({
            mesh: anim.mesh,
            update: (t) => anim.update(t, 0.016),
          });
        });

        // 4. Classical Two-Story Palace Colonnades (Left/West and Right/East Flanks)
        const leftColonnade = createPlazaColonnade(false);
        envGroup.add(leftColonnade);

        const rightColonnade = createPlazaColonnade(true);
        envGroup.add(rightColonnade);

        // 5. Blooming Sakura Cherry Blossom Trees in Stone Planters
        const sakuraCoords = [
          [-14, -16], [14, -16],
          [-14, -8], [14, -8],
          [-14, 0], [14, 0],
          [-14, 8], [14, 8],
          [-14, 16], [14, 16],
        ];
        sakuraCoords.forEach(([sx, sz]) => {
          const tree = createSakuraTree();
          tree.position.set(sx, 0, sz);
          envGroup.add(tree);
        });

        // 6. Royal Lamp-Posts with Hanging Bakuwira Purple Pennants
        const bannerCoords: [number, number, 'left' | 'right'][] = [
          [-10, -14, 'left'],
          [10, -14, 'right'],
          [-10, -5, 'left'],
          [10, -5, 'right'],
          [-10, 4, 'left'],
          [10, 4, 'right'],
          [-10, 13, 'left'],
          [10, 13, 'right'],
        ];
        bannerCoords.forEach(([bx, bz, side]) => {
          const lampPost = createBannerLampPost(side);
          lampPost.position.set(bx, 0, bz);
          envGroup.add(lampPost);
        });

        // 7. Student NPCs in Purple Uniforms (Academy Disciples chatting along promenades)
        const studentCoords = [
          [-13, -3, 0.4],
          [-12.2, -4, -0.8],
          [-13.5, 5, 1.2],
          [13, -3, -0.5],
          [12.2, -4, 0.9],
          [13.5, 6, -1.1],
          [-13, 11, 0.2],
          [13, 11, -0.3],
        ];
        studentCoords.forEach(([stX, stZ, rotY]) => {
          const student = createStudentNPC();
          student.position.set(stX, 0, stZ);
          student.rotation.y = rotY;
          envGroup.add(student);
          animatedObjects.push({
            mesh: student,
            update: (t) => {
              student.position.y = Math.sin(t * 2 + stX) * 0.02;
            },
          });
        });

        // 8. Floating 3D Social Media Reaction Icons (Hovering gently around the plaza)
        const reactions: [ 'like' | 'heart' | 'comment' | 'share' | 'bell' | 'video' | 'camera', number, number, number ][] = [
          ['like', -8, 3.2, -6],
          ['heart', -9, 3.6, 1],
          ['comment', 8, 3.2, -6],
          ['share', 9, 3.6, 1],
          ['bell', 11, 3.8, -12],
          ['camera', -11, 3.8, -12],
          ['video', 9, 3.5, 9],
          ['like', -9, 3.5, 9],
        ];
        reactions.forEach(([type, rx, ry, rz], idx) => {
          const icon = createFloatingReactionIcon(type);
          icon.position.set(rx, ry, rz);
          envGroup.add(icon);
          animatedObjects.push({
            mesh: icon,
            update: (t) => {
              icon.position.y = ry + Math.sin(t * 2 + idx) * 0.25;
              icon.rotation.y = t * 0.6 + idx;
            },
          });
        });

        // 9. Falling Sakura Petals Particle System
        const petalCount = 50;
        const petalGeo = new THREE.BufferGeometry();
        const petalPos = new Float32Array(petalCount * 3);
        const petalVel: { x: number; y: number; z: number; speed: number }[] = [];
        for (let i = 0; i < petalCount; i++) {
          petalPos[i * 3] = (Math.random() - 0.5) * 36;
          petalPos[i * 3 + 1] = Math.random() * 8 + 0.5;
          petalPos[i * 3 + 2] = (Math.random() - 0.5) * 44;
          petalVel.push({
            x: (Math.random() - 0.5) * 0.3,
            y: -(Math.random() * 0.6 + 0.3),
            z: Math.random() * 0.4 + 0.1,
            speed: Math.random() * 2 + 1,
          });
        }
        petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
        const petalMat = new THREE.PointsMaterial({
          color: 0xfbcfe8,
          size: 0.18,
          transparent: true,
          opacity: 0.85,
        });
        const petalSystem = new THREE.Points(petalGeo, petalMat);
        envGroup.add(petalSystem);

        animatedObjects.push({
          mesh: petalSystem,
          update: (t) => {
            const posAttr = petalGeo.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < petalCount; i++) {
              let y = posAttr.getY(i) + petalVel[i].y * 0.016;
              let x = posAttr.getX(i) + Math.sin(t * petalVel[i].speed + i) * 0.01;
              let z = posAttr.getZ(i) + petalVel[i].z * 0.016;
              if (y < 0.05) {
                y = 8;
                x = (Math.random() - 0.5) * 36;
                z = (Math.random() - 0.5) * 44;
              }
              posAttr.setXYZ(i, x, y, z);
            }
            posAttr.needsUpdate = true;
          },
        });

        // 10. The 4 Expanded Canonical Sublocations & Connected Districts
        // ----------------------------------------------------
        // 10A. Dataran Mesej ([0, 0, 0]) - Central Mission Runic Hub & Crossroads Signposts
        const dataranHubRing = new THREE.Mesh(
          new THREE.TorusGeometry(3.2, 0.1, 8, 36),
          new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.9 })
        );
        dataranHubRing.rotation.x = Math.PI / 2;
        dataranHubRing.position.set(0, 0.05, 0);
        envGroup.add(dataranHubRing);

        animatedObjects.push({
          mesh: dataranHubRing,
          update: (t) => {
            dataranHubRing.rotation.z = t * 0.5;
          },
        });

        // Directional crossroad signpost at Dataran Mesej crossroads [0, 0, 5]
        const crossroadsSign = createCrossroadDirectionalSignposts();
        envGroup.add(crossroadsSign);

        // 10B. West Fantasy Bridge over Canal leading to Pusat Komunikasi
        const westBridge = createWestFantasyBridge();
        envGroup.add(westBridge);

        // 10C. Pusat Komunikasi District ([-28, 0, 8]) - Digital Messaging Hub (Adik Amir)
        const pusatDistrict = createPusatKomunikasiDistrict();
        envGroup.add(pusatDistrict.group);
        pusatDistrict.animatedList.forEach((anim) => {
          animatedObjects.push({
            mesh: anim.mesh,
            update: (t) => anim.update(t, 0.016),
          });
        });

        // 10D. East Sakura Garden & Promenade leading to Lorong Singkatan
        const eastSakuraWalk = createEastSakuraGardenAndPromenade();
        envGroup.add(eastSakuraWalk);

        // 10E. Lorong Singkatan District ([28, 0, 10]) - Cyber Alley & Decode Pillars (Detektif Siber)
        const lorongDistrict = createLorongSingkatanDistrict();
        envGroup.add(lorongDistrict.group);
        lorongDistrict.animatedList.forEach((anim) => {
          animatedObjects.push({
            mesh: anim.mesh,
            update: (t) => anim.update(t, 0.016),
          });
        });

        // 10F. Menara Hologram District ([0, 0, -32]) - 35m Celestial Broadcast Spire (Pengurus Menara)
        const menaraDistrict = createMenaraHologramDistrict();
        envGroup.add(menaraDistrict.group);
        menaraDistrict.animatedList.forEach((anim) => {
          animatedObjects.push({
            mesh: anim.mesh,
            update: (t) => anim.update(t, 0.016),
          });
        });
      } else if (regionId === 'akademi') {
        // ==========================================
        // REGION 2: AKADEMI DETEKTIF BAHASA (Illustration 2)
        // Grand Academy Castle, Celestial Armillary Sphere, Owl Signpost & Evidence Boards
        // ==========================================

        // 1. Grand Academy Castle Facade
        const castle = new THREE.Group();
        castle.position.set(0, 0, -22);

        const mainHall = new THREE.Mesh(
          new THREE.BoxGeometry(26, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5, metalness: 0.2 })
        );
        mainHall.position.y = 6;
        castle.add(mainHall);

        // Entrance Archway
        const arch = new THREE.Mesh(
          new THREE.BoxGeometry(6, 7, 2),
          new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.7 })
        );
        arch.position.set(0, 3.5, 6.1);
        castle.add(arch);

        // Detective Insignia Crest over arch
        const crest = new THREE.Mesh(
          new THREE.CylinderGeometry(1.2, 1.2, 0.2, 16),
          new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.2 })
        );
        crest.rotation.x = Math.PI / 2;
        crest.position.set(0, 8.5, 6.2);
        castle.add(crest);

        // Spire Towers
        for (const sx of [-14, -7, 7, 14]) {
          const spireBase = new THREE.Mesh(
            new THREE.CylinderGeometry(1.8, 2.0, 16, 12),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
          );
          spireBase.position.set(sx, 8, 0);
          castle.add(spireBase);

          const roofCone = new THREE.Mesh(
            new THREE.ConeGeometry(2.2, 6, 12),
            new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.3 })
          );
          roofCone.position.set(sx, 19, 0);
          castle.add(roofCone);
        }

        // Purple Academy Banners
        for (const bx of [-10, -4, 4, 10]) {
          const banner = new THREE.Mesh(
            new THREE.PlaneGeometry(1.4, 4),
            new THREE.MeshStandardMaterial({ color: 0x6b21a8, side: THREE.DoubleSide })
          );
          banner.position.set(bx, 6, 6.2);
          castle.add(banner);
        }

        envGroup.add(castle);

        // 2. Central Celestial Armillary Sphere
        const armillary = new THREE.Group();
        armillary.position.set(0, 0, 0);

        const marblePlinth = new THREE.Mesh(
          new THREE.CylinderGeometry(2.5, 3.0, 0.8, 16),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
        );
        marblePlinth.position.y = 0.4;
        armillary.add(marblePlinth);

        const goldRing1 = new THREE.Mesh(
          new THREE.TorusGeometry(1.6, 0.08, 12, 32),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 })
        );
        goldRing1.position.y = 2.2;
        armillary.add(goldRing1);

        const goldRing2 = new THREE.Mesh(
          new THREE.TorusGeometry(1.8, 0.08, 12, 32),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
        );
        goldRing2.position.y = 2.2;
        goldRing2.rotation.x = Math.PI / 3;
        armillary.add(goldRing2);

        const energyCore = new THREE.Mesh(
          new THREE.SphereGeometry(0.6, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true })
        );
        energyCore.position.y = 2.2;
        armillary.add(energyCore);

        animatedObjects.push({
          mesh: armillary,
          update: (t) => {
            goldRing1.rotation.y = t * 0.7;
            goldRing2.rotation.z = t * 0.9;
            energyCore.rotation.y = -t * 1.2;
          },
        });
        envGroup.add(armillary);

        // 3. Wooden Detective Signpost with Owl Motif
        const signpost = new THREE.Group();
        signpost.position.set(-6, 0, 4);

        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.2, 3.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x78350f })
        );
        post.position.y = 1.75;
        signpost.add(post);

        for (let i = 0; i < 4; i++) {
          const board = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.35, 0.08),
            new THREE.MeshStandardMaterial({ color: 0xd97706 })
          );
          board.position.set(0.6, 1.4 + i * 0.45, 0);
          signpost.add(board);
        }

        // Owl sculpture atop
        const owl = new THREE.Mesh(
          new THREE.ConeGeometry(0.3, 0.6, 8),
          new THREE.MeshStandardMaterial({ color: 0x92400e })
        );
        owl.position.set(0, 3.7, 0);
        signpost.add(owl);
        envGroup.add(signpost);

        // 4. Floating Glowing Books
        for (let b = 0; b < 3; b++) {
          const book = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.15, 1.1),
            new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x6d28d9, emissiveIntensity: 0.6 })
          );
          book.position.set(4 + b * 2, 2.5 + b * 0.4, -4 + b * 3);
          envGroup.add(book);
          animatedObjects.push({
            mesh: book,
            update: (t) => {
              book.position.y = 2.2 + Math.sin(t * 1.5 + b) * 0.3;
              book.rotation.y = t * 0.6 + b;
            },
          });
        }
      } else if (regionId === 'bengkel') {
        // ==========================================
        // REGION 3: BENGKEL BAHASA MELAYU (Illustration 3)
        // Timber Workshop, Rotating Roof Book-Gear, Study Desks & Floating Checklist
        // ==========================================

        // 1. Large Fantasy Timber Workshop Hall
        const workshop = new THREE.Group();
        workshop.position.set(0, 0, -18);

        const timberHall = new THREE.Mesh(
          new THREE.BoxGeometry(24, 10, 14),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 })
        );
        timberHall.position.y = 5;
        workshop.add(timberHall);

        // Pitched Roof
        const roof = new THREE.Mesh(
          new THREE.ConeGeometry(17, 6, 4),
          new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 })
        );
        roof.position.y = 13;
        roof.rotation.y = Math.PI / 4;
        workshop.add(roof);

        // Giant Rotating Roof Gear with Open Book Cog
        const roofGear = new THREE.Mesh(
          new THREE.CylinderGeometry(3.2, 3.2, 0.5, 16),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 })
        );
        roofGear.rotation.x = Math.PI / 2;
        roofGear.position.set(0, 14, 7.3);
        workshop.add(roofGear);

        animatedObjects.push({
          mesh: roofGear,
          update: (t) => {
            roofGear.rotation.z = t * 0.5;
          },
        });

        // Warm Hanging Lanterns
        for (const lx of [-9, -3, 3, 9]) {
          const lantern = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 0.7, 8),
            new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.5 })
          );
          lantern.position.set(lx, 6.5, 7.3);
          workshop.add(lantern);
        }

        envGroup.add(workshop);

        // 2. Study Desks with Stacks of Dictionaries
        for (const [dx, dz] of [
          [-8, -6],
          [8, -6],
        ]) {
          const desk = new THREE.Group();
          desk.position.set(dx, 0, dz);

          const table = new THREE.Mesh(
            new THREE.BoxGeometry(4, 1.8, 2),
            new THREE.MeshStandardMaterial({ color: 0x9a3412 })
          );
          table.position.y = 0.9;
          desk.add(table);

          // Stacks of books ("Kamus", "Tatabahasa", "Ejaan")
          for (let s = 0; s < 3; s++) {
            const bookItem = new THREE.Mesh(
              new THREE.BoxGeometry(1.2, 0.2, 0.8),
              new THREE.MeshStandardMaterial({ color: s === 0 ? 0x1d4ed8 : s === 1 ? 0xb45309 : 0x047857 })
            );
            bookItem.position.set(-0.8, 1.9 + s * 0.22, 0);
            desk.add(bookItem);
          }

          // Desk lantern
          const deskLamp = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.2, 0.6, 8),
            new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 1.2 })
          );
          deskLamp.position.set(1.2, 2.1, 0);
          desk.add(deskLamp);

          envGroup.add(desk);
        }

        // 3. Floating Holographic Checklist Screen
        const checklist = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 2.4),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
        );
        checklist.position.set(0, 2.6, 0);
        envGroup.add(checklist);

        animatedObjects.push({
          mesh: checklist,
          update: (t) => {
            checklist.position.y = 2.4 + Math.sin(t * 1.8) * 0.2;
            checklist.rotation.y = Math.sin(t * 0.6) * 0.2;
          },
        });
      } else if (regionId === 'kampung') {
        // ==========================================
        // REGION 4: KAMPUNG KOMUNIKASI (Illustration 4)
        // Traditional Malay Stilt House, Winding River, Wooden Bridge & Water Wheel
        // ==========================================

        // 1. Traditional Malay Stilt House
        const stiltHouse = new THREE.Group();
        stiltHouse.position.set(-14, 0, -12);

        // Wooden Stilts
        for (const sx of [-3.5, 3.5]) {
          for (const sz of [-3.5, 3.5]) {
            const stilt = new THREE.Mesh(
              new THREE.CylinderGeometry(0.2, 0.2, 3, 8),
              new THREE.MeshStandardMaterial({ color: 0x451a03 })
            );
            stilt.position.set(sx, 1.5, sz);
            stiltHouse.add(stilt);
          }
        }

        // House Body
        const houseBody = new THREE.Mesh(
          new THREE.BoxGeometry(8, 4.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 })
        );
        houseBody.position.y = 4.8;
        stiltHouse.add(houseBody);

        // Pitched Roof
        const kampungRoof = new THREE.Mesh(
          new THREE.ConeGeometry(7, 3.8, 4),
          new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 })
        );
        kampungRoof.position.y = 8.8;
        kampungRoof.rotation.y = Math.PI / 4;
        stiltHouse.add(kampungRoof);

        envGroup.add(stiltHouse);

        // 2. Village Community Gazebo (Balai Raya)
        const gazebo = new THREE.Group();
        gazebo.position.set(14, 0, -12);

        const gazBase = new THREE.Mesh(
          new THREE.CylinderGeometry(4.5, 4.5, 0.6, 12),
          new THREE.MeshStandardMaterial({ color: 0x78350f })
        );
        gazBase.position.y = 0.3;
        gazebo.add(gazBase);

        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x451a03 })
          );
          pole.position.set(Math.cos(ang) * 3.8, 2.3, Math.sin(ang) * 3.8);
          gazebo.add(pole);
        }

        const gazRoof = new THREE.Mesh(
          new THREE.ConeGeometry(5.2, 3, 6),
          new THREE.MeshStandardMaterial({ color: 0xb45309 })
        );
        gazRoof.position.y = 5.6;
        gazebo.add(gazRoof);

        envGroup.add(gazebo);

        // 3. Flowing River Stream (Blue Translucent Plane)
        const river = new THREE.Mesh(
          new THREE.PlaneGeometry(60, 6),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.75 })
        );
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, 0.08, 0);
        envGroup.add(river);

        // 4. Arched Wooden Footbridge
        const bridge = new THREE.Group();
        bridge.position.set(0, 0, 0);

        const bridgePlanks = new THREE.Mesh(
          new THREE.BoxGeometry(4, 0.35, 7.5),
          new THREE.MeshStandardMaterial({ color: 0x9a3412 })
        );
        bridgePlanks.position.y = 0.45;
        bridge.add(bridgePlanks);

        // Bridge Handrails
        for (const bx of [-1.9, 1.9]) {
          const rail = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.9, 7.5),
            new THREE.MeshStandardMaterial({ color: 0x451a03 })
          );
          rail.position.set(bx, 1.1, 0);
          bridge.add(rail);
        }

        envGroup.add(bridge);

        // 5. Turning Wooden Water Wheel
        const waterWheel = new THREE.Mesh(
          new THREE.CylinderGeometry(2.4, 2.4, 0.5, 12),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
        );
        waterWheel.rotation.z = Math.PI / 2;
        waterWheel.position.set(-6, 2.2, 0);
        envGroup.add(waterWheel);

        animatedObjects.push({
          mesh: waterWheel,
          update: (t) => {
            waterWheel.rotation.x = t * 1.1;
          },
        });

        // 6. Wooden Directional Signpost ("Bertutur", "Berbincang", "Berkomunikasi", "Berhemah")
        const kampungSign = new THREE.Group();
        kampungSign.position.set(-4, 0, 5);
        const kPost = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.18, 3.2, 8),
          new THREE.MeshStandardMaterial({ color: 0x78350f })
        );
        kPost.position.y = 1.6;
        kampungSign.add(kPost);

        for (let s = 0; s < 4; s++) {
          const plate = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.35, 0.08),
            new THREE.MeshStandardMaterial({ color: 0xd97706 })
          );
          plate.position.set(0.6, 1.2 + s * 0.45, 0);
          kampungSign.add(plate);
        }
        envGroup.add(kampungSign);

        // 7. Green Trees and Flower Bushes
        for (const [gx, gz] of [
          [-8, 12],
          [8, 12],
          [-18, 2],
          [18, 2],
        ]) {
          const tree = new THREE.Group();
          tree.position.set(gx, 0, gz);
          const tTrunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 3, 8),
            new THREE.MeshStandardMaterial({ color: 0x582c12 })
          );
          tTrunk.position.y = 1.5;
          tree.add(tTrunk);

          const tFoliage = new THREE.Mesh(
            new THREE.SphereGeometry(1.8, 10, 10),
            new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
          );
          tFoliage.position.y = 3.6;
          tree.add(tFoliage);
          envGroup.add(tree);
        }
      } else if (regionId === 'istana') {
        // ==========================================
        // REGION 5: ISTANA WIRA BAHASA (Illustration 5)
        // Golden Palace, Grand Marble Stairs, Celestial Feather Fountain & Royal Banners
        // ==========================================

        // 1. Majestic Golden Palace
        const royalPalace = new THREE.Group();
        royalPalace.position.set(0, 0, -24);

        // Marble Stepped Terrace
        for (let st = 0; st < 4; st++) {
          const step = new THREE.Mesh(
            new THREE.BoxGeometry(32 - st * 3, 0.6, 16 - st * 1.5),
            new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3, metalness: 0.3 })
          );
          step.position.y = 0.3 + st * 0.6;
          royalPalace.add(step);
        }

        // Grand Palace Facade
        const mainPalace = new THREE.Mesh(
          new THREE.BoxGeometry(24, 15, 12),
          new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.25, metalness: 0.5 })
        );
        mainPalace.position.y = 9;
        royalPalace.add(mainPalace);

        // Grand Central Arch
        const grandArch = new THREE.Mesh(
          new THREE.BoxGeometry(7, 9, 2),
          new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.3 })
        );
        grandArch.position.set(0, 6, 6.1);
        royalPalace.add(grandArch);

        // Soaring Golden Crystal Spires
        for (const [px, pz] of [
          [-12, -4],
          [12, -4],
          [-6, 6],
          [6, 6],
          [0, 6],
        ]) {
          const towerBase = new THREE.Mesh(
            new THREE.CylinderGeometry(1.5, 1.8, 16, 12),
            new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.6, roughness: 0.3 })
          );
          towerBase.position.set(px, 10, pz);
          royalPalace.add(towerBase);

          const goldSpire = new THREE.Mesh(
            new THREE.ConeGeometry(1.8, 9, 12),
            new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.15 })
          );
          goldSpire.position.set(px, 22.5, pz);
          royalPalace.add(goldSpire);
        }

        // Royal Purple & Gold Banners
        for (const bx of [-9, -4, 4, 9]) {
          const banner = new THREE.Mesh(
            new THREE.PlaneGeometry(1.6, 5),
            new THREE.MeshStandardMaterial({ color: 0x581c87, side: THREE.DoubleSide })
          );
          banner.position.set(bx, 8, 6.2);
          royalPalace.add(banner);
        }

        envGroup.add(royalPalace);

        // 2. Central Celestial Fountain with Feather Quill
        const royalFountain = new THREE.Group();
        royalFountain.position.set(0, 0, 0);

        const fountainBasin = new THREE.Mesh(
          new THREE.CylinderGeometry(3.5, 4.0, 0.8, 24),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.25, metalness: 0.6 })
        );
        fountainBasin.position.y = 0.4;
        royalFountain.add(fountainBasin);

        // Celestial Gold Rings
        const rRing1 = new THREE.Mesh(
          new THREE.TorusGeometry(1.8, 0.08, 12, 32),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 })
        );
        rRing1.position.y = 2.2;
        royalFountain.add(rRing1);

        const rRing2 = new THREE.Mesh(
          new THREE.TorusGeometry(2.1, 0.08, 12, 32),
          new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.2 })
        );
        rRing2.position.y = 2.2;
        rRing2.rotation.x = Math.PI / 3;
        royalFountain.add(rRing2);

        // Golden Feather Quill suspended in center
        const featherQuill = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 1.8, 6),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 1.2 })
        );
        featherQuill.position.y = 2.2;
        royalFountain.add(featherQuill);

        animatedObjects.push({
          mesh: royalFountain,
          update: (t) => {
            rRing1.rotation.y = t * 0.9;
            rRing2.rotation.z = -t * 0.7;
            featherQuill.position.y = 2.2 + Math.sin(t * 2) * 0.2;
            featherQuill.rotation.y = t * 1.4;
          },
        });

        envGroup.add(royalFountain);
      }
    };
    buildEnvironment();

    // ----------------------------------------------------
    // BUILD WAYPOINT BEACON & GIANT DOWNWARD ARROW
    // ----------------------------------------------------
    const waypointGroup = new THREE.Group();
    scene.add(waypointGroup);

    // Glowing vertical light beam
    const beamGeo = new THREE.CylinderGeometry(0.2, 0.8, 40, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const waypointBeam = new THREE.Mesh(beamGeo, beamMat);
    waypointBeam.position.y = 20;
    waypointGroup.add(waypointBeam);

    // Ground target ring
    const ringGeo = new THREE.RingGeometry(1.2, 1.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const waypointRing = new THREE.Mesh(ringGeo, ringMat);
    waypointRing.rotation.x = -Math.PI / 2;
    waypointRing.position.y = 0.05;
    waypointGroup.add(waypointRing);

    // Pulsing outer gold ring on the ground
    const wpOuterRingGeo = new THREE.RingGeometry(2.0, 2.3, 32);
    const wpOuterRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const wpOuterRing = new THREE.Mesh(wpOuterRingGeo, wpOuterRingMat);
    wpOuterRing.rotation.x = -Math.PI / 2;
    wpOuterRing.position.y = 0.04;
    waypointGroup.add(wpOuterRing);

    // Giant 3D downward-pointing animated arrow above destination
    const waypointArrowGroup = new THREE.Group();
    waypointGroup.add(waypointArrowGroup);

    const wpMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.25,
      metalness: 0.85,
    });
    const wpConeGeo = new THREE.ConeGeometry(0.75, 1.8, 6);
    const wpCone = new THREE.Mesh(wpConeGeo, wpMat);
    wpCone.rotation.x = Math.PI; // Inverted cone pointing down
    wpCone.position.y = 4.2;
    waypointArrowGroup.add(wpCone);

    const wpShaftGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 16);
    const wpShaft = new THREE.Mesh(wpShaftGeo, wpMat);
    wpShaft.position.y = 5.2;
    waypointArrowGroup.add(wpShaft);

    const wpCrystalGeo = new THREE.OctahedronGeometry(0.55);
    const wpCrystalMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const wpCrystal = new THREE.Mesh(wpCrystalGeo, wpCrystalMat);
    wpCrystal.position.y = 6.1;
    waypointArrowGroup.add(wpCrystal);

    // ----------------------------------------------------
    // BUILD DYNAMIC 3D PLAYER GUIDANCE ARROW (ANAK PANAH WATAK)
    // Points directly towards the next game/activity
    // ----------------------------------------------------
    const playerGuideGroup = new THREE.Group();
    playerGuideGroup.position.set(0, 0, 4);
    scene.add(playerGuideGroup);

    const arrowGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8,
    });
    const arrowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // Compass Ground Ring around player
    const playerRingGeo = new THREE.RingGeometry(0.9, 1.15, 32);
    const playerRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const playerRing = new THREE.Mesh(playerRingGeo, playerRingMat);
    playerRing.rotation.x = -Math.PI / 2;
    playerRing.position.y = 0.06;
    playerGuideGroup.add(playerRing);

    // 4 Cardinal Star Points on compass ring
    for (let i = 0; i < 4; i++) {
      const notchGeo = new THREE.BoxGeometry(0.08, 0.05, 0.3);
      const notch = new THREE.Mesh(notchGeo, i === 0 ? arrowCyanMat : arrowGoldMat);
      notch.rotation.y = (i * Math.PI) / 2;
      notch.position.set(Math.sin((i * Math.PI) / 2) * 1.05, 0.07, Math.cos((i * Math.PI) / 2) * 1.05);
      playerGuideGroup.add(notch);
    }

    // Dynamic 3D Guide Arrow (Pointing towards Target Destination)
    const arrowMeshGroup = new THREE.Group();
    playerGuideGroup.add(arrowMeshGroup);

    // Guide Arrow Head (Cone pointing towards +Z)
    const guideConeGeo = new THREE.ConeGeometry(0.38, 0.85, 4);
    const guideCone = new THREE.Mesh(guideConeGeo, arrowGoldMat);
    guideCone.rotation.x = Math.PI / 2;
    guideCone.position.set(0, 0.12, 1.75);
    arrowMeshGroup.add(guideCone);

    // Glowing core crystal
    const guideCrystalGeo = new THREE.OctahedronGeometry(0.18);
    const guideCrystal = new THREE.Mesh(guideCrystalGeo, arrowCyanMat);
    guideCrystal.position.set(0, 0.22, 1.75);
    arrowMeshGroup.add(guideCrystal);

    // Arrow shaft
    const guideShaftGeo = new THREE.BoxGeometry(0.18, 0.06, 0.85);
    const guideShaft = new THREE.Mesh(guideShaftGeo, arrowGoldMat);
    guideShaft.position.set(0, 0.08, 1.1);
    arrowMeshGroup.add(guideShaft);

    // Chevron fin 1 & 2
    const chevron1Geo = new THREE.BoxGeometry(0.32, 0.05, 0.08);
    const chevron1 = new THREE.Mesh(chevron1Geo, arrowCyanMat);
    chevron1.position.set(0, 0.08, 0.7);
    arrowMeshGroup.add(chevron1);

    const chevron2Geo = new THREE.BoxGeometry(0.44, 0.05, 0.08);
    const chevron2 = new THREE.Mesh(chevron2Geo, arrowGoldMat);
    chevron2.position.set(0, 0.08, 1.35);
    arrowMeshGroup.add(chevron2);

    // Overhead billboard badge: "➔ PERMAINAN SETERUSNYA"
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 384;
    badgeCanvas.height = 80;
    const bctx = badgeCanvas.getContext('2d');
    if (bctx) {
      bctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      bctx.roundRect(10, 10, 364, 60, 24);
      bctx.fill();
      bctx.strokeStyle = '#f59e0b';
      bctx.lineWidth = 4;
      bctx.roundRect(10, 10, 364, 60, 24);
      bctx.stroke();

      bctx.font = 'bold 24px sans-serif';
      bctx.fillStyle = '#fbbf24';
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.fillText('➔ PERMAINAN SETERUSNYA', 192, 40);
    }
    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    badgeTex.colorSpace = THREE.SRGBColorSpace;
    const badgeSpriteMat = new THREE.SpriteMaterial({ map: badgeTex, transparent: true });
    const guideBadgeSprite = new THREE.Sprite(badgeSpriteMat);
    guideBadgeSprite.scale.set(2.4, 0.5, 1);
    guideBadgeSprite.position.set(0, 2.55, 0);
    playerGuideGroup.add(guideBadgeSprite);

    // ----------------------------------------------------
    // BUILD LIVING 3D PLAYER AVATAR (Wira Lelaki & Wira Perempuan)
    // ----------------------------------------------------
    // Safe player spawning according to current location / sublocation
    let spawnX = 0;
    let spawnZ = 4;
    if (regionId === 'kota_media' && currentSublocation) {
      if (currentSublocation.id === 'W01-L02') {
        spawnX = -24;
        spawnZ = 8;
      } else if (currentSublocation.id === 'W01-L03') {
        spawnX = 24;
        spawnZ = 10;
      } else if (currentSublocation.id === 'W01-L04') {
        spawnX = 0;
        spawnZ = -26;
      } else {
        spawnX = 0;
        spawnZ = 4;
      }
    }
    const playerGroup = new THREE.Group();
    playerGroup.position.set(spawnX, 0, spawnZ);
    scene.add(playerGroup);

    const isFemale = avatar.gender === 'perempuan';

    // Materials Palette matching Image A, B, F, G
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.65 });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const maleEyeMat = new THREE.MeshBasicMaterial({ color: 0xd97706 }); // Amber eyes
    const femaleEyeMat = new THREE.MeshBasicMaterial({ color: 0xd946ef }); // Magenta/Ruby eyes
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.25, metalness: 0.85 });
    const maleCapeMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.45, side: THREE.DoubleSide });
    const femaleCapeMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.45, side: THREE.DoubleSide });
    const whiteTunicMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const darkPantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const femaleDressMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.45 });
    const hairDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 }); // Anime dark brown/black
    const hairFemaleMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.55 }); // Flowing warm brown
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.4 }); // Purple ribbon
    const pinkSakuraMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 }); // Sakura flower
    const bootMat = new THREE.MeshStandardMaterial({ color: isFemale ? 0x6b21a8 : 0x1e293b, roughness: 0.5 });
    const cyanGemMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });

    // Root Pelvis
    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.y = 1.0;
    playerGroup.add(pelvisGroup);

    // Torso Group
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.35;
    pelvisGroup.add(torsoGroup);

    let mainTunic: THREE.Mesh;
    if (isFemale) {
      // Feminine bodice with layered violet and gold trim
      mainTunic = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.65, 12), whiteTunicMat);
      const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.12, 12), femaleDressMat);
      sash.position.y = -0.15;
      torsoGroup.add(sash);

      // Flared pleated skirt
      const skirt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.46, 0.45, 14, 1, true),
        femaleDressMat
      );
      skirt.position.y = -0.32;
      torsoGroup.add(skirt);

      // Sakura flower brooch on sash
      const sakuraBrooch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 5), pinkSakuraMat);
      sakuraBrooch.rotation.x = Math.PI / 2;
      sakuraBrooch.position.set(0.12, -0.14, 0.24);
      torsoGroup.add(sakuraBrooch);
    } else {
      // Male adventurer tunic with blue lapels and gold sash
      mainTunic = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.72, 12), whiteTunicMat);
      const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.14, 12), goldMat);
      sash.position.y = -0.18;
      torsoGroup.add(sash);

      // Gold four-pointed star brooch & cyan gem
      const starBrooch = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), goldMat);
      starBrooch.position.set(0, 0.16, 0.28);
      torsoGroup.add(starBrooch);

      const chestGem = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), cyanGemMat);
      chestGem.position.set(0, 0.16, 0.32);
      torsoGroup.add(chestGem);
    }
    torsoGroup.add(mainTunic);

    // Magic Tome (Buku Sihir) on Hip (matching Image A & B)
    const tomeGroup = new THREE.Group();
    tomeGroup.position.set(isFemale ? -0.28 : 0.28, -0.15, 0.05);
    tomeGroup.rotation.z = isFemale ? 0.15 : -0.15;
    tomeGroup.rotation.y = isFemale ? -Math.PI / 6 : Math.PI / 6;

    // Tome Book Mesh
    const bookCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.34, 0.24),
      new THREE.MeshStandardMaterial({ color: isFemale ? 0x6b21a8 : 0x1e1b4b, roughness: 0.35 })
    );
    tomeGroup.add(bookCover);

    const bookPages = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.32, 0.21),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 })
    );
    bookPages.position.x = isFemale ? 0.015 : -0.015;
    tomeGroup.add(bookPages);

    const tomeStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), goldMat);
    tomeStar.position.x = isFemale ? -0.065 : 0.065;
    tomeGroup.add(tomeStar);

    torsoGroup.add(tomeGroup);

    // Dynamic Cape with Upper Cowl & Hinged Lower Segment
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 0.28, -0.16);
    torsoGroup.add(capeGroup);

    const cowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.26, 0.14, 10),
      isFemale ? femaleCapeMat : maleCapeMat
    );
    capeGroup.add(cowl);

    const capeHinge = new THREE.Group();
    capeHinge.position.set(0, -0.05, -0.05);
    capeGroup.add(capeHinge);

    const capeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.95, 4, 6),
      isFemale ? femaleCapeMat : maleCapeMat
    );
    capeMesh.position.set(0, -0.45, 0);
    capeMesh.rotation.y = Math.PI;
    capeHinge.add(capeMesh);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.52;
    torsoGroup.add(headGroup);

    // Anime Head Sculpt
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 16), skinMat);
    headMesh.scale.set(1.0, 1.15, 1.0);
    headGroup.add(headMesh);

    // Anime Eyes
    const leftEyeWhite = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.1), eyeWhiteMat);
    leftEyeWhite.position.set(-0.09, 0.02, 0.26);
    headGroup.add(leftEyeWhite);

    const leftIris = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.08), isFemale ? femaleEyeMat : maleEyeMat);
    leftIris.position.set(-0.09, 0.02, 0.265);
    headGroup.add(leftIris);

    const rightEyeWhite = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.1), eyeWhiteMat);
    rightEyeWhite.position.set(0.09, 0.02, 0.26);
    headGroup.add(rightEyeWhite);

    const rightIris = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.08), isFemale ? femaleEyeMat : maleEyeMat);
    rightIris.position.set(0.09, 0.02, 0.265);
    headGroup.add(rightIris);

    // Hair Group
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    if (isFemale) {
      // Long flowing brown hair
      const hairCrown = new THREE.Mesh(
        new THREE.SphereGeometry(0.29, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.7),
        hairFemaleMat
      );
      hairCrown.position.y = 0.04;
      hairGroup.add(hairCrown);

      // Long flowing twin hair locks falling over back
      const backHair = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.32, 0.95, 10),
        hairFemaleMat
      );
      backHair.position.set(0, -0.4, -0.16);
      backHair.rotation.x = 0.15;
      hairGroup.add(backHair);

      // Signature Large Purple Bow Ribbon
      const bowLeft = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 5), ribbonMat);
      bowLeft.rotation.z = Math.PI / 2.8;
      bowLeft.position.set(-0.16, 0.26, 0.08);
      hairGroup.add(bowLeft);

      const bowRight = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 5), ribbonMat);
      bowRight.rotation.z = -Math.PI / 2.8;
      bowRight.position.set(0.16, 0.26, 0.08);
      hairGroup.add(bowRight);

      // Cherry blossom center
      const bowFlower = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), pinkSakuraMat);
      bowFlower.position.set(0, 0.26, 0.14);
      hairGroup.add(bowFlower);
    } else {
      // Ruffled anime adventurer hair
      const hairCrown = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.6),
        hairDarkMat
      );
      hairCrown.position.y = 0.05;
      hairGroup.add(hairCrown);

      // Spiky anime hair tufts
      for (let i = 0; i < 6; i++) {
        const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.24, 4), hairDarkMat);
        const ang = (i / 6) * Math.PI * 2;
        tuft.position.set(Math.cos(ang) * 0.22, 0.14, Math.sin(ang) * 0.22);
        tuft.rotation.x = Math.sin(ang) * 0.4;
        tuft.rotation.z = -Math.cos(ang) * 0.4;
        hairGroup.add(tuft);
      }
    }

    // Limbs: Arms
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.35, 0.22, 0);
    torsoGroup.add(leftArmGroup);

    const leftUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.35, 8),
      isFemale ? femaleDressMat : whiteTunicMat
    );
    leftUpperArm.position.y = -0.175;
    leftArmGroup.add(leftUpperArm);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 8), skinMat);
    leftForearm.position.y = -0.525;
    leftArmGroup.add(leftForearm);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.35, 0.22, 0);
    torsoGroup.add(rightArmGroup);

    const rightUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.35, 8),
      isFemale ? femaleDressMat : whiteTunicMat
    );
    rightUpperArm.position.y = -0.175;
    rightArmGroup.add(rightUpperArm);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 8), skinMat);
    rightForearm.position.y = -0.525;
    rightArmGroup.add(rightForearm);

    // Limbs: Legs
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.16, -0.05, 0);
    pelvisGroup.add(leftLegGroup);

    const leftThigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.1, 0.46, 8),
      isFemale ? whiteTunicMat : darkPantsMat
    );
    leftThigh.position.y = -0.23;
    leftLegGroup.add(leftThigh);

    const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.45, 8), bootMat);
    leftShin.position.y = -0.68;
    leftLegGroup.add(leftShin);

    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.24), bootMat);
    leftFoot.position.set(0, -0.92, 0.05);
    leftLegGroup.add(leftFoot);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.16, -0.05, 0);
    pelvisGroup.add(rightLegGroup);

    const rightThigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.1, 0.46, 8),
      isFemale ? whiteTunicMat : darkPantsMat
    );
    rightThigh.position.y = -0.23;
    rightLegGroup.add(rightThigh);

    const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.45, 8), bootMat);
    rightShin.position.y = -0.68;
    rightLegGroup.add(rightShin);

    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.24), bootMat);
    rightFoot.position.set(0, -0.92, 0.05);
    rightLegGroup.add(rightFoot);

    // Contact Ground Shadow
    const shadowGeo = new THREE.CircleGeometry(0.65, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.03;
    playerGroup.add(contactShadow);

    // ----------------------------------------------------
    // BUILD NPCS IN 3D WORLD
    // ----------------------------------------------------
    const npcs: { group: THREE.Group; name: string; pos: THREE.Vector3 }[] = [];
    const npcList = [
      { name: 'Puan Zahra', role: 'Guru Pembimbing', x: 0, z: -3, color: 0xec4899, region: 'kota_media' },
      { name: 'Adik Amir', role: 'Murid Sekolah', x: -28, z: 8, color: 0x8b5cf6, region: 'kota_media' },
      { name: 'Detektif Siber', role: 'Pemeriksa Kod', x: 28, z: 10, color: 0x06b6d4, region: 'kota_media' },
      { name: 'Pengurus Menara', role: 'Pengurus Siaran', x: 0, z: -32, color: 0x3b82f6, region: 'kota_media' },

      { name: 'Puan Zahra', role: 'Ketua Pengajar', x: 0, z: -4, color: 0xec4899, region: 'akademi' },
      { name: 'Detektif Aiman', role: 'Penjaga Arkib', x: -10, z: 8, color: 0x0ea5e9, region: 'akademi' },
      { name: 'Profesor Kata', role: 'Penyelidik', x: 12, z: 6, color: 0x6366f1, region: 'akademi' },
      { name: 'Detektif Kanan', role: 'Pegawai Kes', x: 0, z: -16, color: 0x1d4ed8, region: 'akademi' },

      { name: 'Tukang Besi Tatabahasa', role: 'Jurutera Bahasa', x: 0, z: -4, color: 0xf59e0b, region: 'bengkel' },
      { name: 'Pena Bestari', role: 'Penyunting Teks', x: -12, z: 10, color: 0xd97706, region: 'bengkel' },
      { name: 'Pustakawan Kitab', role: 'Penjaga Kosa Kata', x: 12, z: 12, color: 0xb45309, region: 'bengkel' },
      { name: 'Pengawas Sekolah', role: 'Pengawas Disiplin', x: 0, z: -18, color: 0x7c3aed, region: 'bengkel' },

      { name: 'Cikgu Aina', role: 'Guru Bahasa', x: 0, z: -4, color: 0x059669, region: 'kampung' },
      { name: 'Pak Cik Manap', role: 'Peniaga Pasar', x: -10, z: 12, color: 0x10b981, region: 'kampung' },
      { name: 'Tok Penghulu Samad', role: 'Ketua Kampung', x: 12, z: 8, color: 0x047857, region: 'kampung' },
      { name: 'Cikgu Rahman', role: 'Moderator Forum', x: 0, z: -16, color: 0x14b8a6, region: 'kampung' },

      { name: 'Utusan Diraja', role: 'Pegawai Warkah', x: 0, z: -4, color: 0xeab308, region: 'istana' },
      { name: 'Penjaga Kristal', role: 'Penjaga Sanctum', x: -12, z: 10, color: 0xa855f7, region: 'istana' },
      { name: 'Puan Zahra', role: 'Penasihat Khas', x: 12, z: 8, color: 0xec4899, region: 'istana' },
      { name: 'Tuanku Raja Bahasa', role: 'Raja Bahasa', x: 0, z: -18, color: 0xfacc15, region: 'istana' },
    ];

    for (const n of npcList) {
      if (n.region !== regionId) continue;
      const npcGrp = new THREE.Group();
      npcGrp.position.set(n.x, 0, n.z);

      const nBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.34, 1.15, 10),
        new THREE.MeshStandardMaterial({ color: n.color, roughness: 0.6 })
      );
      nBody.position.y = 1.35;
      npcGrp.add(nBody);

      const nHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0xfbd38d, roughness: 0.7 })
      );
      nHead.position.y = 2.15;
      npcGrp.add(nHead);

      const beacon = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.5, 6),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
      );
      beacon.rotation.x = Math.PI;
      beacon.position.y = 2.95;
      npcGrp.add(beacon);

      scene.add(npcGrp);
      npcs.push({ group: npcGrp, name: n.name, pos: npcGrp.position });
    }

    // ----------------------------------------------------
    // BUILD EXPLORATION CLUES
    // ----------------------------------------------------
    const clueMeshes: { mesh: THREE.Mesh; id: string; pos: THREE.Vector3 }[] = [];
    const activeQ = activeQuestionRef.current;
    if (activeQ?.explorationClues) {
      activeQ.explorationClues.forEach((c) => {
        const clueGeo = new THREE.OctahedronGeometry(0.55, 0);
        const clueMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.8,
          roughness: 0.2,
        });
        const cm = new THREE.Mesh(clueGeo, clueMat);
        cm.position.set(c.position[0], c.position[1] + 0.5, c.position[2]);
        scene.add(cm);
        clueMeshes.push({ mesh: cm, id: c.id, pos: cm.position });
      });
    }

    // ----------------------------------------------------
    // LIVING ANIMATIONS & STATE MACHINE CONTROLLER
    // ----------------------------------------------------
    let currentAnimState: 'idle' | 'walk' | 'run' | 'jump' | 'interact' | 'celebrate' = 'idle';
    let jumpVelocity = 0;
    let isJumping = false;
    let playerY = 0;
    let lastStepTime = 0;
    let interactTimer = 0;

    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys[k] = true;

      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', ' '].includes(k)) {
        notifyJoystickActivity();
      }

      if (k === 'e') {
        checkInteraction();
      }
      if (k === ' ' && !isJumping) {
        isJumping = true;
        jumpVelocity = 7.5;
        soundEffects.playJump();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Mouse & Touch Camera Orbiting (360° Horizontal + Pitch Control)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngle = 0;
    let cameraPitch = 0.28; // radians (~16 degrees)

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        cameraAngle -= deltaX * 0.006;
        cameraPitch = Math.max(0.12, Math.min(0.72, cameraPitch + deltaY * 0.004));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Swipe Camera Orbiting (Right side of screen: swipe 360° around player)
    let cameraTouchId: number | null = null;
    let prevTouchX = 0;
    let prevTouchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        // Swiping outside of virtual joystick zone rotates camera smoothly
        if (cameraTouchId === null && t.clientX > window.innerWidth * 0.35) {
          cameraTouchId = t.identifier;
          prevTouchX = t.clientX;
          prevTouchY = t.clientY;
          break;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (cameraTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === cameraTouchId) {
          const deltaX = t.clientX - prevTouchX;
          const deltaY = t.clientY - prevTouchY;
          cameraAngle -= deltaX * 0.007;
          cameraPitch = Math.max(0.12, Math.min(0.72, cameraPitch + deltaY * 0.004));
          prevTouchX = t.clientX;
          prevTouchY = t.clientY;
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (cameraTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === cameraTouchId) {
          cameraTouchId = null;
          break;
        }
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    function checkInteraction() {
      const playerPos = playerGroup.position;
      interactTimer = 1.2; // Trigger interact animation

      for (const npc of npcs) {
        if (playerPos.distanceTo(npc.pos) < 3.5) {
          // Face toward NPC
          const diff = npc.pos.clone().sub(playerPos);
          playerGroup.rotation.y = Math.atan2(diff.x, diff.z);
          soundEffects.playClick();
          onInteractNPCRef.current(npc.name);
          return;
        }
      }
      for (const clue of clueMeshes) {
        if (playerPos.distanceTo(clue.pos) < 3.4) {
          soundEffects.playClick();
          onInspectClueRef.current(clue.id);
          return;
        }
      }
    }

    const _camForward = new THREE.Vector3();
    const _camRight = new THREE.Vector3();
    const _worldUp = new THREE.Vector3(0, 1, 0);
    const _moveDir = new THREE.Vector3();
    const _camTargetPos = new THREE.Vector3();

    function animate() {
      const delta = Math.min(clock.getDelta(), 0.08);
      const time = clock.getElapsedTime();

      // Controls Input (Camera-relative screen space)
      const touch = touchMovementRef.current;
      const isShift = keys['shift'] || keys['run'] || isSprintRef.current;

      // Screen-relative movement components:
      // touch.dx: negative = screen left, positive = screen right
      // touch.dz: negative = screen up/forward, positive = screen down/backward
      let inputX = touch.dx;
      let inputY = -touch.dz; // Invert dz so up is positive forward

      if (keys['w'] || keys['arrowup']) inputY += 1;
      if (keys['s'] || keys['arrowdown']) inputY -= 1;
      if (keys['a'] || keys['arrowleft']) inputX -= 1;
      if (keys['d'] || keys['arrowright']) inputX += 1;

      const inputDist = Math.hypot(inputX, inputY);
      const isMoving = inputDist > 0.05;

      const moveSpeed = (isShift ? 7.8 : 4.6) * delta;

      // Jumping Physics
      if (isJumping) {
        playerY += jumpVelocity * delta;
        jumpVelocity -= 22 * delta; // Gravity
        if (playerY <= 0) {
          playerY = 0;
          isJumping = false;
          jumpVelocity = 0;
        }
      }
      playerGroup.position.y = playerY;

      // Animation State Determination
      if (interactTimer > 0) {
        interactTimer -= delta;
        currentAnimState = 'interact';
      } else if (isJumping) {
        currentAnimState = 'jump';
      } else if (isMoving) {
        currentAnimState = isShift ? 'run' : 'walk';
      } else {
        currentAnimState = 'idle';
      }

      // Movement execution & turning (True camera-relative vector movement)
      if (isMoving) {
        // 1. Normalize input vector to prevent diagonal speed boost
        const normX = inputX / inputDist;
        const normY = inputY / inputDist;
        const moveMagnitude = Math.min(1, inputDist);

        // 2. Camera-relative forward & right vectors projected onto horizontal XZ plane
        _camForward.set(0, 0, 0);
        camera.getWorldDirection(_camForward);
        _camForward.y = 0;
        _camForward.normalize();

        _camRight.crossVectors(_camForward, _worldUp).normalize();

        // 3. Composite world-space movement direction from camera perspective
        // normX > 0 (Right) moves along +camRight (Screen Right)
        // normX < 0 (Left) moves along -camRight (Screen Left)
        // normY > 0 (Up/Forward) moves along +camForward (Screen Forward)
        // normY < 0 (Down/Backward) moves along -camForward (Screen Backward)
        _moveDir.set(0, 0, 0);
        _moveDir.addScaledVector(_camRight, normX);
        _moveDir.addScaledVector(_camForward, normY);
        _moveDir.normalize();

        // 4. Smooth character rotation toward movement direction (shortest-arc interpolation)
        const targetRotation = Math.atan2(_moveDir.x, _moveDir.z);
        let angleDiff = targetRotation - playerGroup.rotation.y;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        playerGroup.rotation.y += angleDiff * 0.22;

        // 5. Scaled displacement steps with decoupled wall-sliding building collision
        const stepX = _moveDir.x * moveSpeed * moveMagnitude;
        const stepZ = _moveDir.z * moveSpeed * moveMagnitude;
        const nextX = playerGroup.position.x + stepX;
        const nextZ = playerGroup.position.z + stepZ;

        const colliders = regionId === 'kota_media' ? getKotaMediaColliders() : [];
        let blockedX = false;
        let blockedZ = false;
        const pRadius = 0.55;

        for (const col of colliders) {
          if (
            nextX + pRadius > col.minX &&
            nextX - pRadius < col.maxX &&
            playerGroup.position.z + pRadius > col.minZ &&
            playerGroup.position.z - pRadius < col.maxZ
          ) {
            blockedX = true;
          }
          if (
            playerGroup.position.x + pRadius > col.minX &&
            playerGroup.position.x - pRadius < col.maxX &&
            nextZ + pRadius > col.minZ &&
            nextZ - pRadius < col.maxZ
          ) {
            blockedZ = true;
          }
        }

        if (!blockedX) {
          const maxBoundX = regionId === 'kota_media' ? 42 : 36;
          playerGroup.position.x = Math.max(-maxBoundX, Math.min(maxBoundX, nextX));
        }
        if (!blockedZ) {
          const minBoundZ = regionId === 'kota_media' ? -44 : -36;
          const maxBoundZ = regionId === 'kota_media' ? 36 : 36;
          playerGroup.position.z = Math.max(minBoundZ, Math.min(maxBoundZ, nextZ));
        }

        // Footstep Audio with surface material detection
        const stepInterval = isShift ? 0.28 : 0.44;
        if (time - lastStepTime > stepInterval && !isJumping) {
          let surface: 'stone' | 'wood' | 'grass' | 'carpet' = 'stone';
          if (regionId === 'bengkel') {
            surface = 'wood';
          } else if (regionId === 'kampung') {
            surface = Math.abs(playerGroup.position.x) > 10 ? 'grass' : 'wood';
          } else if (regionId === 'istana') {
            surface = Math.abs(playerGroup.position.z) < 8 ? 'carpet' : 'stone';
          } else {
            surface = 'stone';
          }
          soundEffects.playFootstep(surface);
          lastStepTime = time;
        }
      }

      // --------------------------------------------------
      // BONE RIGGING & ANIMATION LOOPS PER STATE
      // --------------------------------------------------
      if (currentAnimState === 'idle') {
        // Natural gentle breathing
        const breath = Math.sin(time * 2.2);
        torsoGroup.position.y = 0.35 + breath * 0.015;
        headGroup.rotation.x = breath * 0.03;
        headGroup.rotation.y = Math.sin(time * 0.8) * 0.05;

        // Limbs in resting pose
        leftLegGroup.rotation.x = 0;
        rightLegGroup.rotation.x = 0;
        leftArmGroup.rotation.x = breath * 0.04;
        leftArmGroup.rotation.z = 0.05;
        rightArmGroup.rotation.x = -breath * 0.04;
        rightArmGroup.rotation.z = -0.05;

        // Cape gentle fluttering in breeze
        capeHinge.rotation.x = -0.15 + Math.sin(time * 2.5) * 0.08;

        // Hair secondary motion
        hairGroup.rotation.z = Math.sin(time * 2.8) * 0.03;
      } else if (currentAnimState === 'walk') {
        const walkPhase = time * 7.5;
        const swing = Math.sin(walkPhase);

        // Counter-balanced leg swing
        leftLegGroup.rotation.x = swing * 0.55;
        rightLegGroup.rotation.x = -swing * 0.55;

        // Counter-swing arms
        leftArmGroup.rotation.x = -swing * 0.45;
        leftArmGroup.rotation.z = 0.1;
        rightArmGroup.rotation.x = swing * 0.45;
        rightArmGroup.rotation.z = -0.1;

        // Torso vertical bounce and slight forward tilt
        torsoGroup.position.y = 0.35 + Math.abs(Math.sin(walkPhase)) * 0.05;
        torsoGroup.rotation.x = 0.06;

        // Cape trailing backward
        capeHinge.rotation.x = -0.28 + Math.sin(walkPhase) * 0.1;
        hairGroup.rotation.x = Math.sin(walkPhase) * 0.05;
      } else if (currentAnimState === 'run') {
        const runPhase = time * 13.5;
        const swing = Math.sin(runPhase);

        // Athletic wider strides
        leftLegGroup.rotation.x = swing * 0.85;
        rightLegGroup.rotation.x = -swing * 0.85;

        // Dynamic arm pumping
        leftArmGroup.rotation.x = -swing * 0.75;
        leftArmGroup.rotation.z = 0.18;
        rightArmGroup.rotation.x = swing * 0.75;
        rightArmGroup.rotation.z = -0.18;

        // Forward aggressive lean
        torsoGroup.position.y = 0.35 + Math.abs(Math.sin(runPhase)) * 0.08;
        torsoGroup.rotation.x = 0.18;

        // Cape flying backward dramatically with wind flutter
        capeHinge.rotation.x = -0.55 + Math.sin(runPhase * 1.5) * 0.15;
        hairGroup.rotation.x = 0.12 + Math.sin(runPhase) * 0.08;
      } else if (currentAnimState === 'jump') {
        // Airborne jump pose
        torsoGroup.rotation.x = -0.08;
        leftLegGroup.rotation.x = -0.35;
        rightLegGroup.rotation.x = -0.25;

        // Arms raised slightly outward for aerodynamic balance
        leftArmGroup.rotation.x = -0.3;
        leftArmGroup.rotation.z = 0.45;
        rightArmGroup.rotation.x = -0.3;
        rightArmGroup.rotation.z = -0.45;

        // Cape billowing upward in free fall
        capeHinge.rotation.x = 0.25;
      } else if (currentAnimState === 'interact') {
        // Welcoming signature gesture from Image A / Image C
        torsoGroup.rotation.x = 0.05;
        headGroup.rotation.x = 0.1;

        // Right arm raised forward holding out welcoming hand or tome
        rightArmGroup.rotation.x = -0.85;
        rightArmGroup.rotation.y = 0.25;
        rightArmGroup.rotation.z = -0.2;

        leftArmGroup.rotation.x = 0.1;
        leftLegGroup.rotation.x = 0;
        rightLegGroup.rotation.x = 0;

        // Tome floating slightly with mana glow
        tomeGroup.position.y = -0.1 + Math.sin(time * 5) * 0.03;
      }

      // Update parent coords for minimap
      if (onPositionUpdateRef.current) {
        onPositionUpdateRef.current(
          [playerGroup.position.x, playerGroup.position.y, playerGroup.position.z],
          playerGroup.rotation.y
        );
      }

      // --------------------------------------------------
      // THIRD-PERSON CAMERA (MATCHING IMAGE F & G)
      // --------------------------------------------------
      // Camera sits smoothly behind the hero looking towards the road & castle
      const camDist = 6.2 * Math.cos(cameraPitch);
      const camHeight = 1.45 + 6.2 * Math.sin(cameraPitch);

      const targetCamX = playerGroup.position.x - Math.sin(cameraAngle) * camDist;
      const targetCamZ = playerGroup.position.z - Math.cos(cameraAngle) * camDist;
      const targetCamY = playerGroup.position.y + camHeight;

      _camTargetPos.set(targetCamX, targetCamY, targetCamZ);
      camera.position.lerp(_camTargetPos, 0.09);
      camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.45, playerGroup.position.z);

      // Position active target destination waypoint beam and giant downward arrow
      const currentTarget = targetDestinationRef.current;
      if (currentTarget) {
        waypointGroup.visible = true;
        waypointGroup.position.set(currentTarget.coordinates[0], 0, currentTarget.coordinates[2]);
        waypointRing.scale.setScalar(1 + Math.sin(time * 3) * 0.15);
        wpOuterRing.scale.setScalar(1 + Math.cos(time * 2.5) * 0.12);
        waypointArrowGroup.rotation.y += delta * 1.5;
        waypointArrowGroup.position.y = 4.5 + Math.sin(time * 3.5) * 0.45;

        // Position & Orient dynamic Player Guidance Arrow
        playerGuideGroup.visible = true;
        playerGuideGroup.position.set(playerGroup.position.x, 0.05, playerGroup.position.z);

        const dx = currentTarget.coordinates[0] - playerGroup.position.x;
        const dz = currentTarget.coordinates[2] - playerGroup.position.z;
        const targetAngle = Math.atan2(dx, dz);

        // Smooth shortest angular interpolation
        let angleDiff = targetAngle - playerGuideGroup.rotation.y;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        playerGuideGroup.rotation.y += angleDiff * 0.14;

        // Gentle floating pulse & chevron trail animation
        arrowMeshGroup.position.y = 0.04 + Math.sin(time * 5) * 0.04;
        arrowMeshGroup.scale.setScalar(1 + Math.sin(time * 4) * 0.05);

        // Overhead badge floating
        guideBadgeSprite.visible = true;
        guideBadgeSprite.position.y = 2.55 + Math.sin(time * 3) * 0.06;
      } else {
        waypointGroup.visible = false;
        playerGuideGroup.visible = false;
        guideBadgeSprite.visible = false;
      }

      // Clue beacons animation
      clueMeshes.forEach((c, idx) => {
        c.mesh.rotation.y += delta * 2;
        c.mesh.position.y = 1.2 + Math.sin(time * 2 + idx) * 0.25;
      });

      // Animated regional architecture
      animatedObjects.forEach((obj) => obj.update(time));

      // Nearby prompts detection
      const playerPos = playerGroup.position;
      let nearestPrompt: { text: string; action: () => void } | null = null;

      // 1. Check destination proximity (Entering next game / mission)
      if (currentTarget) {
        const distToTarget = playerPos.distanceTo(
          new THREE.Vector3(currentTarget.coordinates[0], 0, currentTarget.coordinates[2])
        );
        if (distToTarget < 4.5) {
          nearestPrompt = {
            text: `🎯 Masuk Permainan: ${currentTarget.name}`,
            action: () => {
              checkInteraction();
              if (onTriggerMissionRef.current) {
                onTriggerMissionRef.current();
              }
            },
          };
        }
      }

      // 2. Check NPC proximity
      if (!nearestPrompt) {
        for (const npc of npcs) {
          if (playerPos.distanceTo(npc.pos) < 3.5) {
            nearestPrompt = {
              text: `Berbual dengan ${npc.name}`,
              action: () => {
                checkInteraction();
                onInteractNPCRef.current(npc.name);
              },
            };
            break;
          }
        }
      }

      // 3. Check Clue proximity
      if (!nearestPrompt) {
        for (const clue of clueMeshes) {
          if (playerPos.distanceTo(clue.pos) < 3.4) {
            nearestPrompt = {
              text: 'Imbas Petunjuk Bahasa Baku',
              action: () => {
                checkInteraction();
                onInspectClueRef.current(clue.id);
              },
            };
            break;
          }
        }
      }

      setNearbyPrompt(nearestPrompt);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // High performance ResizeObserver for seamless landscape & fullscreen resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width || container.clientWidth;
        const height = entry.contentRect.height || container.clientHeight;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        }
      }
    });
    resizeObserver.observe(container);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight, false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [regionId, avatar]);

  // Virtual Analog Joystick touch handlers
  const updateJoystickFromTouch = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawDx = clientX - centerX;
    const rawDy = clientY - centerY;
    const maxRadius = rect.width * 0.38;
    const dist = Math.hypot(rawDx, rawDy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(rawDy, rawDx);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setJoystickThumb({ x: clampedX, y: clampedY });

    if (dist > 6) {
      touchMovementRef.current = {
        dx: clampedX / maxRadius,
        dz: clampedY / maxRadius,
      };
    } else {
      touchMovementRef.current = { dx: 0, dz: 0 };
    }
    notifyJoystickActivity();
  };

  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      e.stopPropagation();
      joystickPointerIdRef.current = e.pointerId;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      notifyJoystickActivity();
      updateJoystickFromTouch(e.clientX, e.clientY);
    }
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && joystickPointerIdRef.current === e.pointerId) {
      e.stopPropagation();
      notifyJoystickActivity();
      updateJoystickFromTouch(e.clientX, e.clientY);
    }
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && joystickPointerIdRef.current === e.pointerId) {
      e.stopPropagation();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      joystickPointerIdRef.current = null;
      setJoystickThumb({ x: 0, y: 0 });
      touchMovementRef.current = { dx: 0, dz: 0 };
      notifyJoystickActivity();
    }
  };

  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    joystickTouchIdRef.current = touch.identifier;
    notifyJoystickActivity();
    updateJoystickFromTouch(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (joystickTouchIdRef.current === null) return;
    notifyJoystickActivity();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        updateJoystickFromTouch(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (joystickTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchIdRef.current) {
        joystickTouchIdRef.current = null;
        setJoystickThumb({ x: 0, y: 0 });
        touchMovementRef.current = { dx: 0, dz: 0 };
        notifyJoystickActivity();
        break;
      }
    }
  };

  const toggleSprint = () => {
    notifyJoystickActivity();
    const next = !isSprintActive;
    setIsSprintActive(next);
    isSprintRef.current = next;
    soundEffects.playHover();
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Interaction Prompt */}
      {nearbyPrompt && (
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            onClick={nearbyPrompt.action}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/95 hover:bg-amber-400 text-slate-950 font-black shadow-2xl backdrop-blur-sm border-2 border-amber-300 transition-all transform hover:scale-105 active:scale-95 animate-bounce"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-900 text-amber-300 text-xs font-black shadow">
              E
            </span>
            <span className="text-xs sm:text-sm tracking-wide">{nearbyPrompt.text}</span>
          </button>
        </div>
      )}

      {/* Mobile Virtual Controls (Shown on touch devices / mobile landscape viewports) */}
      {showTouchControls && (
        <>
          {/* 1. Left: Movement Virtual Analog Joystick with Dynamic Opacity (Fades slightly when idle) */}
          <div
            className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 pointer-events-auto select-none touch-none transition-all duration-500 ease-in-out ${
              isJoystickActive
                ? 'opacity-100 scale-100'
                : 'opacity-35 hover:opacity-100 scale-95'
            }`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div
              ref={joystickBaseRef}
              onPointerDown={handleJoystickPointerDown}
              onPointerMove={handleJoystickPointerMove}
              onPointerUp={handleJoystickPointerUp}
              onPointerCancel={handleJoystickPointerUp}
              onTouchStart={handleJoystickTouchStart}
              onTouchMove={handleJoystickTouchMove}
              onTouchEnd={handleJoystickTouchEnd}
              onTouchCancel={handleJoystickTouchEnd}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-950/75 border-2 border-amber-400/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(250,204,21,0.4)] cursor-pointer"
            >
              {/* Outer compass ring markings */}
              <div className="absolute inset-1 rounded-full border border-amber-400/25 pointer-events-none" />
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/20 pointer-events-none" />

              {/* 4 Cardinal Direction Chevrons */}
              <span className="absolute top-1.5 text-amber-300 font-black text-[10px] pointer-events-none opacity-80">▲</span>
              <span className="absolute bottom-1.5 text-amber-300 font-black text-[10px] pointer-events-none opacity-80">▼</span>
              <span className="absolute left-1.5 text-amber-300 font-black text-[10px] pointer-events-none opacity-80">◀</span>
              <span className="absolute right-1.5 text-amber-300 font-black text-[10px] pointer-events-none opacity-80">▶</span>

              {/* Dynamic Analog Thumb Knob */}
              <div
                style={{
                  transform: `translate(${joystickThumb.x}px, ${joystickThumb.y}px)`,
                  transition: joystickTouchIdRef.current === null ? 'transform 0.15s ease-out' : 'none',
                }}
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 shadow-[0_0_15px_rgba(250,204,21,0.8)] border-2 border-yellow-100 flex items-center justify-center pointer-events-none"
              >
                <div className="w-4 h-4 rounded-full bg-slate-950/40 border border-white/50" />
              </div>
            </div>
          </div>

          {/* 2. Right: Action Buttons (Sprint, Magic Tome, Jump, Interact) matching Image F & G */}
          <div
            className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 pointer-events-auto flex items-end gap-2 sm:gap-3 select-none"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Sprint / Lari Toggle Button */}
            <button
              onClick={toggleSprint}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 ${
                isSprintActive
                  ? 'bg-amber-500 border-yellow-200 text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.8)] scale-105'
                  : 'bg-slate-900/90 border-slate-600 text-amber-300 shadow-xl'
              } flex flex-col items-center justify-center text-xs font-black transition-all active:scale-90 cursor-pointer`}
              title="Lari Pantas (Sprint)"
            >
              <span className="text-sm">🏃</span>
              <span className="text-[8px] leading-tight font-black uppercase">
                {isSprintActive ? 'Lari' : 'Jalan'}
              </span>
            </button>

            {/* Magic Tome Action */}
            <button
              onClick={() => {
                soundEffects.playHeroSelect(avatar.gender);
                if (activeQuestion) onInteractNPC(currentSublocation?.primaryNpc || 'Puan Zahra');
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-purple-950/90 border-2 border-purple-400/90 text-purple-200 shadow-xl flex items-center justify-center text-lg active:scale-90 cursor-pointer hover:scale-105 transition-transform"
              title="Tome Sihir Bahasa"
            >
              📖
            </button>

            {/* Jump Button */}
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: ' ' });
                window.dispatchEvent(event);
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-indigo-950/90 border-2 border-indigo-400/90 text-cyan-300 shadow-xl flex items-center justify-center font-black text-sm active:scale-90 cursor-pointer hover:scale-105 transition-transform"
              title="Lompat"
            >
              ⬆️
            </button>

            {/* Primary Interact Button (E) */}
            <button
              onClick={() => {
                if (nearbyPrompt) {
                  nearbyPrompt.action();
                } else {
                  const event = new KeyboardEvent('keydown', { key: 'e' });
                  window.dispatchEvent(event);
                }
              }}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-[0_0_20px_rgba(250,204,21,0.8)] flex items-center justify-center border-2 border-amber-100 text-xl active:scale-90 hover:scale-105 transition-transform animate-pulse cursor-pointer"
              title="Interaksi (E)"
            >
              ⚔️
            </button>
          </div>
        </>
      )}
    </div>
  );
};
