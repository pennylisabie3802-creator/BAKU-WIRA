/**
 * BAKUWIRA: Anime 3D Character Rigging & Stylized Procedural Modeling
 * Faithfully crafts 3D anime models matching the official turnaround illustrations:
 * - Male Hero: watak_lelaki_3D_c67ac61d.jpeg (Wira Lelaki)
 * - Female Hero: watak_perempuan_3d_1809a3e9.jpeg (Wira Perempuan)
 * 
 * Complies with Three.js Skill Directives:
 * - Composite 3-12+ part procedural meshes per limb/section
 * - High-detail procedural canvas textures (Anime faces, Star Cape emblems, Magic Tomes)
 * - Full PBR materials (roughness, metalness, emissive highlights)
 * - Fully articulated bone groups for idle, walk, run, jump, and interact animations
 * - Zero external 404 dependencies
 */

import * as THREE from 'three';
import { AvatarCustomization } from '../../types/game';

export interface AnimeCharacterRig {
  playerMeshGroup: THREE.Group;
  pelvisGroup: THREE.Group;
  torsoGroup: THREE.Group;
  headGroup: THREE.Group;
  hairGroup: THREE.Group;
  leftArmGroup: THREE.Group;
  rightArmGroup: THREE.Group;
  leftLegGroup: THREE.Group;
  rightLegGroup: THREE.Group;
  capeHinge: THREE.Group;
  tomeGroup: THREE.Group;
  contactShadow: THREE.Mesh;
  isFemale: boolean;
  updateAnimation: (
    time: number,
    delta: number,
    animState: 'idle' | 'walk' | 'run' | 'jump' | 'interact',
    isShift: boolean
  ) => void;
}

/**
 * Creates high-detail procedural canvas texture for Anime Face
 * Matches the expressive anime eyes, blush, and brows from the turnaround sheets.
 */
function createAnimeFaceTexture(isFemale: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Soft peach porcelain anime skin base
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(0, 0, 512, 512);

  // Soft cheek blush gradients
  const drawBlush = (x: number, y: number) => {
    const grad = ctx.createRadialGradient(x, y, 4, x, y, 38);
    grad.addColorStop(0, 'rgba(244, 114, 182, 0.45)');
    grad.addColorStop(0.6, 'rgba(251, 146, 60, 0.2)');
    grad.addColorStop(1, 'rgba(254, 215, 170, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 38, 0, Math.PI * 2);
    ctx.fill();

    // 3 subtle blush hatch marks
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 8 - 4, y - 6);
      ctx.lineTo(x + i * 8 + 4, y + 6);
      ctx.stroke();
    }
  };
  drawBlush(150, 310);
  drawBlush(362, 310);

  // Anime Eyes Generator
  const drawAnimeEye = (cx: number, cy: number, flip: boolean) => {
    ctx.save();
    ctx.translate(cx, cy);
    if (flip) ctx.scale(-1, 1);

    // Sclera (Eye White)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 62, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sclera subtle top shadow
    const scleraShadow = ctx.createLinearGradient(0, -62, 0, 0);
    scleraShadow.addColorStop(0, 'rgba(148, 163, 184, 0.35)');
    scleraShadow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = scleraShadow;
    ctx.fill();

    // Iris Base (Amber-Gold for Male, Ruby-Magenta for Female)
    const irisGrad = ctx.createRadialGradient(0, 10, 8, 0, 0, 42);
    if (isFemale) {
      irisGrad.addColorStop(0, '#f472b6'); // Bright inner pink
      irisGrad.addColorStop(0.45, '#c026d3'); // Radiant magenta
      irisGrad.addColorStop(0.85, '#701a75'); // Deep purple edge
      irisGrad.addColorStop(1, '#3b0764');
    } else {
      irisGrad.addColorStop(0, '#fef08a'); // Warm luminous gold
      irisGrad.addColorStop(0.4, '#f59e0b'); // Amber orange
      irisGrad.addColorStop(0.8, '#b45309'); // Deep warm brown
      irisGrad.addColorStop(1, '#451a03');
    }

    ctx.beginPath();
    ctx.ellipse(0, 2, 34, 46, 0, 0, Math.PI * 2);
    ctx.fillStyle = irisGrad;
    ctx.fill();

    // Dark Pupil
    ctx.beginPath();
    ctx.ellipse(0, -2, 14, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = isFemale ? '#2e1065' : '#1c1917';
    ctx.fill();

    // Iris Star Glint / Lower Caustic Crescent
    ctx.beginPath();
    ctx.arc(0, 16, 20, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = isFemale ? 'rgba(244, 217, 240, 0.75)' : 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // High-Light Specular Sparkles (Signature anime eye highlights)
    // Large primary reflection
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-12, -18, 12, 16, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Small secondary sparkle
    ctx.beginPath();
    ctx.arc(14, 12, 6, 0, Math.PI * 2);
    ctx.fill();

    // Micro star glint
    ctx.beginPath();
    ctx.arc(8, -24, 3, 0, Math.PI * 2);
    ctx.fill();

    // Upper Eyelash & Dark Winged Eyeliner
    ctx.strokeStyle = isFemale ? '#3b0764' : '#1e1b4b';
    ctx.lineWidth = isFemale ? 9 : 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-46, -42);
    ctx.bezierCurveTo(-20, -68, 20, -68, 50, -46);
    ctx.stroke();

    // Delicate outer eyelash flick
    if (isFemale) {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(42, -52);
      ctx.lineTo(58, -62);
      ctx.stroke();
    }

    // Lower subtle lash line
    ctx.strokeStyle = isFemale ? 'rgba(112, 26, 117, 0.5)' : 'rgba(30, 27, 75, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 8, 38, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Anime Double Eyelid Crease
    ctx.strokeStyle = isFemale ? 'rgba(168, 85, 247, 0.4)' : 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -56, 36, 1.2 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();

    ctx.restore();
  };

  // Draw Eyes (Centered in face map)
  drawAnimeEye(160, 240, false);
  drawAnimeEye(352, 240, true);

  // Stylized Eyebrows
  const drawEyebrow = (cx: number, cy: number, flip: boolean) => {
    ctx.save();
    ctx.translate(cx, cy);
    if (flip) ctx.scale(-1, 1);
    ctx.strokeStyle = isFemale ? '#581c87' : '#1e1b4b';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-45, 6);
    ctx.quadraticCurveTo(0, -12, 45, 2);
    ctx.stroke();
    ctx.restore();
  };
  drawEyebrow(160, 160, false);
  drawEyebrow(352, 160, true);

  // Delicate Anime Nose (subtle shadow point)
  ctx.fillStyle = 'rgba(217, 119, 6, 0.45)';
  ctx.beginPath();
  ctx.ellipse(256, 310, 2.5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheerful Anime Mouth
  ctx.strokeStyle = isFemale ? '#e11d48' : '#9a3412';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(256, 360, 18, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Mouth Interior Tint
  ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
  ctx.beginPath();
  ctx.arc(256, 360, 16, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates Procedural Canvas Texture for Hero Cape / Coat-Tails Back Emblem
 * Male: Deep Royal Blue with Radiant 8-Point Golden Star Burst & Filigree
 * Female: Magenta/Purple Gradient with Gold Starburst & Sacred Glyphs
 */
function createCapeEmblemTexture(isFemale: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Cape background gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 1024);
  if (isFemale) {
    grad.addColorStop(0, '#581c87'); // Deep purple
    grad.addColorStop(0.35, '#7e22ce');
    grad.addColorStop(0.7, '#a21caf'); // Magenta
    grad.addColorStop(1, '#c026d3');
  } else {
    grad.addColorStop(0, '#172554'); // Dark royal blue
    grad.addColorStop(0.3, '#1d4ed8');
    grad.addColorStop(0.75, '#2563eb');
    grad.addColorStop(1, '#1e40af');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Golden Border Trim
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 14;
  ctx.strokeRect(14, 14, 484, 996);

  // Inner filigree border
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, 456, 968);

  // Grand 8-Point Golden Starburst Emblem (Centerpiece of the Cape)
  const drawStar = (cx: number, cy: number, outerR: number, innerR: number, points: number, color: string) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  };

  // Main Emblem Star
  drawStar(256, 512, 130, 48, 8, '#facc15');
  drawStar(256, 512, 70, 28, 8, '#ffffff');

  // Cyan Magic Core
  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 512, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.restore();

  // Radiant Golden Ray Lines & Diamonds
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Vertical axis
  ctx.moveTo(256, 120);
  ctx.lineTo(256, 900);
  // Horizontal axis
  ctx.moveTo(70, 512);
  ctx.lineTo(442, 512);
  ctx.stroke();

  // Diamond accents along the rays
  const drawDiamond = (x: number, y: number, s: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.65, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.65, 0);
    ctx.closePath();
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.restore();
  };
  drawDiamond(256, 260, 20);
  drawDiamond(256, 760, 20);
  drawDiamond(120, 512, 16);
  drawDiamond(392, 512, 16);

  // Decorative Golden Swirls / Filigree at Hem
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(150, 930, 40, 0, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(362, 930, 40, -Math.PI * 0.5, Math.PI);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates Procedural Canvas Texture for Magic Spellbook (Buku Sihir) Cover
 */
function createTomeCoverTexture(isFemale: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Leather book cover base
  ctx.fillStyle = isFemale ? '#4c1d95' : '#1e1b4b';
  ctx.fillRect(0, 0, 256, 384);

  // Leather grain texture
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 384; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  // Golden corner braces
  ctx.fillStyle = '#facc15';
  const drawCorner = (x: number, y: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(45, 0);
    ctx.lineTo(45, 12);
    ctx.lineTo(12, 45);
    ctx.lineTo(0, 45);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawCorner(0, 0, 0);
  drawCorner(256, 0, Math.PI / 2);
  drawCorner(256, 384, Math.PI);
  drawCorner(0, 384, -Math.PI / 2);

  // Golden filigree frame
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 220, 348);

  // Starburst emblem on tome cover
  ctx.save();
  ctx.translate(128, 192);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? 55 : 22;
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = '#fde047';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Central Gem
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fillStyle = isFemale ? '#ec4899' : '#38bdf8';
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Builds the complete, high-fidelity Anime 3D Character matching the official illustrations.
 */
export function buildAnimeCharacter(avatar: AvatarCustomization): AnimeCharacterRig {
  const isFemale = avatar.gender === 'perempuan';
  const playerMeshGroup = new THREE.Group();

  // -----------------------------------------------------------------
  // 1. MATERIAL PALETTE (Studio PBR with Varied Roughness & Metalness)
  // -----------------------------------------------------------------
  const faceTexture = createAnimeFaceTexture(isFemale);
  const capeTexture = createCapeEmblemTexture(isFemale);
  const tomeTexture = createTomeCoverTexture(isFemale);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfed7aa,
    roughness: 0.6,
    metalness: 0.05,
  });

  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.55,
    metalness: 0.05,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: isFemale ? 0x451a03 : 0x1e1b4b, // Warm chestnut for female, dark anime brown for male
    roughness: 0.45,
    metalness: 0.1,
  });

  const goldFiligreeMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.22,
    metalness: 0.88,
  });

  const whiteSilkMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.38,
    metalness: 0.1,
  });

  const navyClothMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.6,
    metalness: 0.15,
  });

  const purpleVelvetMat = new THREE.MeshStandardMaterial({
    color: 0x7e22ce,
    roughness: 0.42,
    metalness: 0.2,
  });

  const magentaSilkMat = new THREE.MeshStandardMaterial({
    color: 0xc026d3,
    roughness: 0.35,
    metalness: 0.18,
  });

  const pinkSakuraMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.3,
    metalness: 0.15,
  });

  const capeMat = new THREE.MeshStandardMaterial({
    map: capeTexture,
    roughness: 0.4,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });

  const capeInnerMat = new THREE.MeshStandardMaterial({
    color: isFemale ? 0xfae8ff : 0xbae6fd, // Sky blue lining for male, soft pink lining for female
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  const bootLeatherMat = new THREE.MeshStandardMaterial({
    color: isFemale ? 0x581c87 : 0x0f172a,
    roughness: 0.38,
    metalness: 0.25,
  });

  const cyanCrystalMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    roughness: 0.15,
    metalness: 0.8,
  });

  // -----------------------------------------------------------------
  // 2. SKELETON / JOINT HIERARCHY
  // -----------------------------------------------------------------
  // Root Pelvis
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.y = 1.0;
  playerMeshGroup.add(pelvisGroup);

  // Torso
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.35;
  pelvisGroup.add(torsoGroup);

  // -----------------------------------------------------------------
  // 3. TORSO & OUTFIT (Faithfully matched to turnaround illustrations)
  // -----------------------------------------------------------------
  if (isFemale) {
    // --- FEMALE HERO OUTFIT ---
    // A. Main Fitted Bodice with curved waist
    const bodiceGeo = new THREE.CylinderGeometry(0.23, 0.2, 0.58, 14);
    const mainBodice = new THREE.Mesh(bodiceGeo, whiteSilkMat);
    torsoGroup.add(mainBodice);

    // B. Black Underbust Corset with Gold Filigree
    const corsetGeo = new THREE.CylinderGeometry(0.235, 0.208, 0.22, 14);
    const corset = new THREE.Mesh(corsetGeo, navyClothMat);
    corset.position.y = -0.12;
    torsoGroup.add(corset);

    // Corset Gold Rim
    const corsetRimTop = new THREE.Mesh(new THREE.TorusGeometry(0.232, 0.015, 6, 16), goldFiligreeMat);
    corsetRimTop.rotation.x = Math.PI / 2;
    corsetRimTop.position.y = -0.01;
    torsoGroup.add(corsetRimTop);

    const corsetRimBottom = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.015, 6, 16), goldFiligreeMat);
    corsetRimBottom.rotation.x = Math.PI / 2;
    corsetRimBottom.position.y = -0.23;
    torsoGroup.add(corsetRimBottom);

    // Pink Criss-Cross Lacing on Corset Front
    for (let i = 0; i < 3; i++) {
      const laceCross = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.01), pinkSakuraMat);
      laceCross.position.set(0, -0.06 - i * 0.05, 0.218);
      laceCross.rotation.z = (i % 2 === 0 ? 0.3 : -0.3);
      torsoGroup.add(laceCross);
    }

    // C. Chest Ribbon & Gold Starburst Brooch
    const chestRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.02), magentaSilkMat);
    chestRibbon.position.set(0, 0.14, 0.22);
    torsoGroup.add(chestRibbon);

    const chestStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), goldFiligreeMat);
    chestStar.position.set(0, 0.16, 0.235);
    torsoGroup.add(chestStar);

    const chestGem = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), cyanCrystalMat);
    chestGem.position.set(0, 0.16, 0.26);
    torsoGroup.add(chestGem);

    // D. White Pleated Petticoat (Inner Skirt)
    const petticoatGeo = new THREE.CylinderGeometry(0.21, 0.44, 0.36, 16, 1, true);
    const petticoat = new THREE.Mesh(petticoatGeo, whiteSilkMat);
    petticoat.position.y = -0.36;
    torsoGroup.add(petticoat);

    // E. 4-Panel Flared Coat-Tails (Signature Magenta/Purple Skirt with Gold Star Trim)
    // Front Apron
    const frontApron = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.38, 2, 2), purpleVelvetMat);
    frontApron.position.set(0, -0.36, 0.22);
    frontApron.rotation.x = 0.25;
    torsoGroup.add(frontApron);

    // Back Flared Coat-Tails (2 panels with Gold Star Trim)
    const backSkirtLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.65, 3, 4), capeMat);
    backSkirtLeft.position.set(-0.16, -0.44, -0.16);
    backSkirtLeft.rotation.y = Math.PI - 0.25;
    backSkirtLeft.rotation.x = -0.28;
    torsoGroup.add(backSkirtLeft);

    const backSkirtRight = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.65, 3, 4), capeMat);
    backSkirtRight.position.set(0.16, -0.44, -0.16);
    backSkirtRight.rotation.y = Math.PI + 0.25;
    backSkirtRight.rotation.x = -0.28;
    torsoGroup.add(backSkirtRight);

    // Left & Right Flank Flaps
    const sideSkirtLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.52), magentaSilkMat);
    sideSkirtLeft.position.set(-0.24, -0.4, 0.02);
    sideSkirtLeft.rotation.y = -Math.PI / 2.3;
    sideSkirtLeft.rotation.x = 0.15;
    torsoGroup.add(sideSkirtLeft);

    const sideSkirtRight = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.52), magentaSilkMat);
    sideSkirtRight.position.set(0.24, -0.4, 0.02);
    sideSkirtRight.rotation.y = Math.PI / 2.3;
    sideSkirtRight.rotation.x = 0.15;
    torsoGroup.add(sideSkirtRight);

    // F. 3D Sakura Flower on Left Hip
    const hipFlowerGroup = new THREE.Group();
    hipFlowerGroup.position.set(-0.22, -0.22, 0.15);
    hipFlowerGroup.rotation.y = -0.6;
    for (let p = 0; p < 5; p++) {
      const petal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.015, 6), pinkSakuraMat);
      const ang = (p * Math.PI * 2) / 5;
      petal.position.set(Math.cos(ang) * 0.05, Math.sin(ang) * 0.05, 0);
      petal.rotation.z = ang - Math.PI / 2;
      petal.rotation.x = Math.PI / 2;
      hipFlowerGroup.add(petal);
    }
    const flowerPistil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), goldFiligreeMat);
    flowerPistil.position.z = 0.02;
    hipFlowerGroup.add(flowerPistil);
    torsoGroup.add(hipFlowerGroup);

  } else {
    // --- MALE HERO OUTFIT ---
    // A. Main Adventurer Fantasy Tunic
    const tunicGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.68, 14);
    const mainTunic = new THREE.Mesh(tunicGeo, whiteSilkMat);
    torsoGroup.add(mainTunic);

    // B. Stand-up High Collar with Gold Edging
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.14, 12, 1, true), navyClothMat);
    collar.position.y = 0.38;
    torsoGroup.add(collar);

    const collarGoldTrim = new THREE.Mesh(new THREE.TorusGeometry(0.182, 0.012, 6, 14), goldFiligreeMat);
    collarGoldTrim.rotation.x = Math.PI / 2;
    collarGoldTrim.position.y = 0.44;
    torsoGroup.add(collarGoldTrim);

    // C. Chest Harness & Royal Blue V-Lapel
    const chestVest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.14), navyClothMat);
    chestVest.position.set(0, 0.08, 0.18);
    torsoGroup.add(chestVest);

    // Radiant Gold 8-Point Star Brooch & Cyan Magic Core
    const starBrooch = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), goldFiligreeMat);
    starBrooch.position.set(0, 0.18, 0.28);
    torsoGroup.add(starBrooch);

    const chestGem = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), cyanCrystalMat);
    chestGem.position.set(0, 0.18, 0.32);
    torsoGroup.add(chestGem);

    // Gold Tassels hanging below brooch
    for (let t = -1; t <= 1; t += 2) {
      const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.14, 5), goldFiligreeMat);
      tassel.position.set(t * 0.045, 0.07, 0.28);
      torsoGroup.add(tassel);
    }

    // D. Dual Shoulder Epaulette Mantles (Navy + Gold 8-point star relief)
    for (let side = -1; side <= 1; side += 2) {
      const epauletteGroup = new THREE.Group();
      epauletteGroup.position.set(side * 0.34, 0.32, 0);

      // Gold Curved Shoulder Pad
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.08, 8), goldFiligreeMat);
      pad.rotation.z = side * -0.3;
      epauletteGroup.add(pad);

      // Navy mantle cloth overlay
      const clothMantle = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), navyClothMat);
      clothMantle.position.y = 0.04;
      epauletteGroup.add(clothMantle);

      // Star crest on shoulder
      const epauletteStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), goldFiligreeMat);
      epauletteStar.position.set(0, 0.09, 0.05);
      epauletteGroup.add(epauletteStar);

      torsoGroup.add(epauletteGroup);
    }

    // E. Adventurer Gold Waist Sash & Belt
    const waistSash = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.265, 0.14, 12), goldFiligreeMat);
    waistSash.position.y = -0.16;
    torsoGroup.add(waistSash);

    const beltBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.04), goldFiligreeMat);
    beltBuckle.position.set(0, -0.16, 0.27);
    torsoGroup.add(beltBuckle);

    // Flared Hip Tunic Lapels (White & Gold)
    const tunicFlapLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.28), whiteSilkMat);
    tunicFlapLeft.position.set(-0.16, -0.32, 0.18);
    tunicFlapLeft.rotation.x = 0.2;
    torsoGroup.add(tunicFlapLeft);

    const tunicFlapRight = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.28), whiteSilkMat);
    tunicFlapRight.position.set(0.16, -0.32, 0.18);
    tunicFlapRight.rotation.x = 0.2;
    torsoGroup.add(tunicFlapRight);
  }

  // -----------------------------------------------------------------
  // 4. DYNAMIC HERO CAPE (With Back Emblem & Wind Flutter Segment)
  // -----------------------------------------------------------------
  const capeGroup = new THREE.Group();
  capeGroup.position.set(0, 0.32, -0.15);
  torsoGroup.add(capeGroup);

  // Cape Upper Mantle / Cowl (Navy for Male, Purple for Female)
  const cowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.28, 0.16, 12, 1, true),
    isFemale ? purpleVelvetMat : navyClothMat
  );
  capeGroup.add(cowl);

  // Cape Hinge (Animated in wind during walk/run/jump)
  const capeHinge = new THREE.Group();
  capeHinge.position.set(0, -0.06, -0.06);
  capeGroup.add(capeHinge);

  // Outer Decorative Cape Mesh (with Star Texture)
  const capeGeo = new THREE.PlaneGeometry(0.68, 1.15, 6, 8);
  const capeMesh = new THREE.Mesh(capeGeo, capeMat);
  capeMesh.position.set(0, -0.56, 0);
  capeMesh.rotation.y = Math.PI; // Face outwards toward camera
  capeHinge.add(capeMesh);

  // Inner Lining (Contrasting lighter sky-blue / soft-pink)
  const capeInnerMesh = new THREE.Mesh(capeGeo, capeInnerMat);
  capeInnerMesh.position.set(0, -0.56, -0.005);
  capeHinge.add(capeInnerMesh);

  // Gold Trim Border Along Cape Hem
  const capeGoldBorder = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.02), goldFiligreeMat);
  capeGoldBorder.position.set(0, -1.13, 0);
  capeHinge.add(capeGoldBorder);

  // -----------------------------------------------------------------
  // 5. MAGIC TOME (BUKU SIHIR) HANGING ON HIP
  // -----------------------------------------------------------------
  const tomeGroup = new THREE.Group();
  tomeGroup.position.set(isFemale ? -0.28 : 0.28, -0.16, 0.06);
  tomeGroup.rotation.z = isFemale ? 0.18 : -0.18;
  tomeGroup.rotation.y = isFemale ? -Math.PI / 5 : Math.PI / 5;

  const tomeMat = new THREE.MeshStandardMaterial({
    map: tomeTexture,
    roughness: 0.35,
    metalness: 0.4,
  });

  const tomeBook = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.28), tomeMat);
  tomeGroup.add(tomeBook);

  // Parchment Pages Block (Gold edge gilded)
  const tomePages = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.35, 0.25),
    new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 })
  );
  tomePages.position.x = isFemale ? 0.015 : -0.015;
  tomeGroup.add(tomePages);

  // Golden Star clasp on tome
  const tomeStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), goldFiligreeMat);
  tomeStar.position.x = isFemale ? -0.075 : 0.075;
  tomeGroup.add(tomeStar);

  // Leather hanging strap
  const strapMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
  const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.24, 6), strapMat);
  strap.position.set(0, 0.22, 0);
  tomeGroup.add(strap);

  torsoGroup.add(tomeGroup);

  // -----------------------------------------------------------------
  // 6. HEAD, ANIME FACE & EXPANSIVE HAIR
  // -----------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.54;
  torsoGroup.add(headGroup);

  // Stylized Anime Head Sculpt (Chiseled chin & contoured jaw)
  const headGeo = new THREE.SphereGeometry(0.28, 20, 20);
  headGeo.scale(1.0, 1.18, 1.05);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headGroup.add(headMesh);

  // 2D Decal Face Plate with Anime Eyes, Blush, and Eyebrows
  // Positioned flush on front curvature of face
  const faceDecalGeo = new THREE.PlaneGeometry(0.38, 0.38);
  const faceDecalMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    transparent: true,
    roughness: 0.55,
    metalness: 0.02,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const faceDecal = new THREE.Mesh(faceDecalGeo, faceDecalMat);
  faceDecal.position.set(0, 0.02, 0.285);
  headGroup.add(faceDecal);

  // Hair Group
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  if (isFemale) {
    // --- FEMALE ANIME HAIR (Chestnut Brown, Flowing Locks, Signature Ribbon) ---
    // 1. Hair Crown
    const hairCrownGeo = new THREE.SphereGeometry(0.31, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.55);
    const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
    hairCrown.position.set(0, 0.05, -0.02);
    hairGroup.add(hairCrown);

    // 2. Parted Front Bangs (Anime layered tufts)
    for (let b = -3; b <= 3; b++) {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 5), hairMat);
      bang.position.set(b * 0.07, 0.12 - Math.abs(b) * 0.02, 0.28);
      bang.rotation.x = -0.4;
      bang.rotation.z = -b * 0.12;
      hairGroup.add(bang);
    }

    // 3. Side Cheek Locks Framing Face
    const leftLock = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.55, 6), hairMat);
    leftLock.position.set(-0.24, -0.12, 0.16);
    leftLock.rotation.z = 0.18;
    leftLock.rotation.x = 0.1;
    hairGroup.add(leftLock);

    const rightLock = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.55, 6), hairMat);
    rightLock.position.set(0.24, -0.12, 0.16);
    rightLock.rotation.z = -0.18;
    rightLock.rotation.x = 0.1;
    hairGroup.add(rightLock);

    // 4. Cascading Twin Back Hair Tresses (Flowing down past shoulders)
    for (let side = -1; side <= 1; side += 2) {
      const backTress = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.24, 0.95, 8), hairMat);
      backTress.position.set(side * 0.14, -0.42, -0.2);
      backTress.rotation.x = 0.2;
      backTress.rotation.z = side * 0.14;
      hairGroup.add(backTress);
    }

    // 5. Signature Giant Magenta/Purple Silk Hair Ribbon (Crown)
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, 0.32, -0.06);

    // Left Wing of Bow
    const bowWingL = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.32, 6), purpleVelvetMat);
    bowWingL.rotation.z = Math.PI / 2.6;
    bowWingL.position.set(-0.2, 0.04, 0);
    bowGroup.add(bowWingL);

    // Right Wing of Bow
    const bowWingR = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.32, 6), purpleVelvetMat);
    bowWingR.rotation.z = -Math.PI / 2.6;
    bowWingR.position.set(0.2, 0.04, 0);
    bowGroup.add(bowWingR);

    // Trailing Ribbon Tails
    const ribbonTailL = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.45), purpleVelvetMat);
    ribbonTailL.position.set(-0.16, -0.22, -0.08);
    ribbonTailL.rotation.z = 0.3;
    ribbonTailL.rotation.x = 0.2;
    bowGroup.add(ribbonTailL);

    const ribbonTailR = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.45), purpleVelvetMat);
    ribbonTailR.position.set(0.16, -0.22, -0.08);
    ribbonTailR.rotation.z = -0.3;
    ribbonTailR.rotation.x = 0.2;
    bowGroup.add(ribbonTailR);

    // Golden 5-Petal Sakura Flower Centerpiece
    for (let p = 0; p < 5; p++) {
      const petal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.02, 6), goldFiligreeMat);
      const ang = (p * Math.PI * 2) / 5;
      petal.position.set(Math.cos(ang) * 0.06, Math.sin(ang) * 0.06, 0.06);
      petal.rotation.z = ang - Math.PI / 2;
      petal.rotation.x = Math.PI / 2;
      bowGroup.add(petal);
    }
    const bowCenterGem = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), magentaSilkMat);
    bowCenterGem.position.set(0, 0, 0.08);
    bowGroup.add(bowCenterGem);

    hairGroup.add(bowGroup);

    // 6. Dangling Gold Star Earrings
    for (let side = -1; side <= 1; side += 2) {
      const earringGroup = new THREE.Group();
      earringGroup.position.set(side * 0.29, -0.04, 0.02);

      const stud = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), goldFiligreeMat);
      earringGroup.add(stud);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.1, 4), goldFiligreeMat);
      chain.position.y = -0.06;
      earringGroup.add(chain);

      const starDrop = new THREE.Mesh(new THREE.OctahedronGeometry(0.03, 0), goldFiligreeMat);
      starDrop.position.y = -0.13;
      earringGroup.add(starDrop);

      headGroup.add(earringGroup);
    }

  } else {
    // --- MALE ANIME HAIR (Dark Ruffled Anime Spikes, Ahoge, Layered Silhouette) ---
    // 1. Volumetric Crown Base
    const hairCrownGeo = new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.55);
    const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
    hairCrown.position.set(0, 0.06, -0.02);
    hairGroup.add(hairCrown);

    // 2. Front Ruffled Bangs (Layered over forehead)
    for (let b = -3; b <= 3; b++) {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 5), hairMat);
      bang.position.set(b * 0.08, 0.16 - Math.abs(b) * 0.03, 0.28);
      bang.rotation.x = -0.45;
      bang.rotation.z = -b * 0.16;
      hairGroup.add(bang);
    }

    // 3. Spiky Side & Top Tufts (8 spikes around the circumference)
    for (let s = 0; s < 8; s++) {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 4), hairMat);
      const ang = (s * Math.PI * 2) / 8 + 0.2;
      tuft.position.set(Math.cos(ang) * 0.25, 0.22, Math.sin(ang) * 0.24);
      tuft.rotation.x = Math.sin(ang) * 0.45;
      tuft.rotation.z = -Math.cos(ang) * 0.45;
      hairGroup.add(tuft);
    }

    // 4. Signature Ahoge (Playful curved cowlick spike on top)
    const ahoge = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.26, 5), hairMat);
    ahoge.position.set(0.04, 0.42, 0.08);
    ahoge.rotation.z = 0.3;
    ahoge.rotation.x = 0.2;
    hairGroup.add(ahoge);
  }

  // -----------------------------------------------------------------
  // 7. ARMS, GAUNTLETS & BELL SLEEVES
  // -----------------------------------------------------------------
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.35, 0.24, 0);
  torsoGroup.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.35, 0.24, 0);
  torsoGroup.add(rightArmGroup);

  const buildArm = (armGroup: THREE.Group, isLeft: boolean) => {
    // Upper Arm
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.34, 8), whiteSilkMat);
    upperArm.position.y = -0.17;
    armGroup.add(upperArm);

    if (isFemale) {
      // Signature Flared Bell Sleeve (Shrine Maiden / Mage style)
      const bellSleeveGeo = new THREE.CylinderGeometry(0.08, 0.18, 0.26, 12, 1, true);
      const bellSleeve = new THREE.Mesh(bellSleeveGeo, whiteSilkMat);
      bellSleeve.position.y = -0.32;
      armGroup.add(bellSleeve);

      // Gold Filigree Sleeve Hem
      const sleeveGoldTrim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 6, 14), goldFiligreeMat);
      sleeveGoldTrim.rotation.x = Math.PI / 2;
      sleeveGoldTrim.position.y = -0.45;
      armGroup.add(sleeveGoldTrim);

      // Exposed Bare Forearm
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.3, 8), skinMat);
      forearm.position.y = -0.52;
      armGroup.add(forearm);

      // Gold Wrist Cuff & Delicate Adventurer Hand
      const wristCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.06, 8), goldFiligreeMat);
      wristCuff.position.y = -0.66;
      armGroup.add(wristCuff);

      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.04), skinMat);
      hand.position.set(0, -0.73, 0.01);
      armGroup.add(hand);

    } else {
      // Male Adventurer Gauntlet / Vambrace
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.3, 8), skinMat);
      forearm.position.y = -0.52;
      armGroup.add(forearm);

      // Gold Vambrace Armor with Star Inlay
      const vambrace = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.075, 0.22, 8), goldFiligreeMat);
      vambrace.position.y = -0.54;
      armGroup.add(vambrace);

      const vambraceStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.03, 0), cyanCrystalMat);
      vambraceStar.position.set(isLeft ? -0.085 : 0.085, -0.54, 0);
      armGroup.add(vambraceStar);

      // Black Fingerless Adventurer Glove
      const glove = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.05), navyClothMat);
      glove.position.set(0, -0.74, 0.01);
      armGroup.add(glove);
    }
  };

  buildArm(leftArmGroup, true);
  buildArm(rightArmGroup, false);

  // -----------------------------------------------------------------
  // 8. LEGS, GREAVES & LACED BOOTS
  // -----------------------------------------------------------------
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.16, -0.06, 0);
  pelvisGroup.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.16, -0.06, 0);
  pelvisGroup.add(rightLegGroup);

  const buildLeg = (legGroup: THREE.Group, isLeft: boolean) => {
    if (isFemale) {
      // Female: Pure White Thigh-High Stockings
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.46, 10), whiteSilkMat);
      thigh.position.y = -0.23;
      legGroup.add(thigh);

      // Stocking Gold Lace Garter
      const garter = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.04, 10), goldFiligreeMat);
      garter.position.y = -0.04;
      legGroup.add(garter);

      // Lower Calf in White Stockings
      const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.22, 10), whiteSilkMat);
      calf.position.y = -0.55;
      legGroup.add(calf);

      // Royal Purple Laced High-Heel Boot
      const bootShin = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.09, 0.32, 10), bootLeatherMat);
      bootShin.position.y = -0.76;
      legGroup.add(bootShin);

      // Gold Star Buckle & Eyelet Laces
      const bootStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.035, 0), goldFiligreeMat);
      bootStar.position.set(isLeft ? -0.1 : 0.1, -0.72, 0);
      legGroup.add(bootStar);

      for (let l = 0; l < 4; l++) {
        const lace = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.01), goldFiligreeMat);
        lace.position.set(0, -0.66 - l * 0.05, 0.095);
        legGroup.add(lace);
      }

      // High-Heel Foot
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.22), bootLeatherMat);
      foot.position.set(0, -0.94, 0.04);
      legGroup.add(foot);

      // Gold Heel
      const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.1, 6), goldFiligreeMat);
      heel.position.set(0, -0.98, -0.05);
      legGroup.add(heel);

    } else {
      // Male: Dark Navy Combat Trousers with Gold Seams
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.105, 0.46, 10), navyClothMat);
      thigh.position.y = -0.23;
      legGroup.add(thigh);

      // Side Cargo Pocket
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.12), navyClothMat);
      pocket.position.set(isLeft ? -0.11 : 0.11, -0.24, 0);
      legGroup.add(pocket);

      const pocketGoldZip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.015, 0.1), goldFiligreeMat);
      pocketGoldZip.position.set(isLeft ? -0.11 : 0.11, -0.17, 0);
      legGroup.add(pocketGoldZip);

      // Flared White-and-Gold Greave Armor Cuff over Knee
      const greaveCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.115, 0.16, 10), whiteSilkMat);
      greaveCuff.position.y = -0.48;
      legGroup.add(greaveCuff);

      const greaveGoldRim = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.014, 6, 12), goldFiligreeMat);
      greaveGoldRim.rotation.x = Math.PI / 2;
      greaveGoldRim.position.y = -0.41;
      legGroup.add(greaveGoldRim);

      // Black Adventurer Combat Boot
      const bootShin = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.095, 0.36, 10), bootLeatherMat);
      bootShin.position.y = -0.72;
      legGroup.add(bootShin);

      // Gold Star Buckle
      const bootStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.038, 0), goldFiligreeMat);
      bootStar.position.set(0, -0.68, 0.11);
      legGroup.add(bootStar);

      // Combat Boot Sole & Toe
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.25), bootLeatherMat);
      foot.position.set(0, -0.93, 0.05);
      legGroup.add(foot);

      // Gold Sole Rim
      const soleRim = new THREE.Mesh(new THREE.BoxGeometry(0.148, 0.02, 0.26), goldFiligreeMat);
      soleRim.position.set(0, -0.98, 0.05);
      legGroup.add(soleRim);
    }
  };

  buildLeg(leftLegGroup, true);
  buildLeg(rightLegGroup, false);

  // -----------------------------------------------------------------
  // 9. CONTACT GROUND SHADOW (Three.js Directive Grounding)
  // -----------------------------------------------------------------
  const shadowGeo = new THREE.CircleGeometry(0.72, 24);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.025;
  playerMeshGroup.add(contactShadow);

  // -----------------------------------------------------------------
  // 10. ARTICULATED ANIMATION CONTROLLER
  // -----------------------------------------------------------------
  const updateAnimation = (
    time: number,
    delta: number,
    animState: 'idle' | 'walk' | 'run' | 'jump' | 'interact',
    isShift: boolean
  ) => {
    if (animState === 'idle') {
      // Natural gentle breathing
      const breath = Math.sin(time * 2.2);
      torsoGroup.position.y = 0.35 + breath * 0.015;
      torsoGroup.rotation.x = 0;
      headGroup.rotation.x = breath * 0.03;
      headGroup.rotation.y = Math.sin(time * 0.8) * 0.05;

      // Resting limbs
      leftLegGroup.rotation.x = 0;
      rightLegGroup.rotation.x = 0;
      leftArmGroup.rotation.x = breath * 0.04;
      leftArmGroup.rotation.z = 0.05;
      rightArmGroup.rotation.x = -breath * 0.04;
      rightArmGroup.rotation.z = -0.05;

      // Gentle breeze on cape & hair
      capeHinge.rotation.x = -0.14 + Math.sin(time * 2.4) * 0.08;
      hairGroup.rotation.z = Math.sin(time * 2.6) * 0.03;

    } else if (animState === 'walk') {
      const walkPhase = time * 7.5;
      const swing = Math.sin(walkPhase);

      // Stride swing
      leftLegGroup.rotation.x = swing * 0.55;
      rightLegGroup.rotation.x = -swing * 0.55;

      // Arm counter-swing
      leftArmGroup.rotation.x = -swing * 0.45;
      leftArmGroup.rotation.z = 0.1;
      rightArmGroup.rotation.x = swing * 0.45;
      rightArmGroup.rotation.z = -0.1;

      // Torso bounce
      torsoGroup.position.y = 0.35 + Math.abs(Math.sin(walkPhase)) * 0.05;
      torsoGroup.rotation.x = 0.06;

      // Cape flutter trailing behind
      capeHinge.rotation.x = -0.28 + Math.sin(walkPhase) * 0.1;
      hairGroup.rotation.x = Math.sin(walkPhase) * 0.05;

    } else if (animState === 'run') {
      const runPhase = time * 13.5;
      const swing = Math.sin(runPhase);

      // Fast athletic strides
      leftLegGroup.rotation.x = swing * 0.85;
      rightLegGroup.rotation.x = -swing * 0.85;

      // Arm pumping
      leftArmGroup.rotation.x = -swing * 0.75;
      leftArmGroup.rotation.z = 0.18;
      rightArmGroup.rotation.x = swing * 0.75;
      rightArmGroup.rotation.z = -0.18;

      // Forward lean
      torsoGroup.position.y = 0.35 + Math.abs(Math.sin(runPhase)) * 0.08;
      torsoGroup.rotation.x = 0.18;

      // Dramatic wind billowing cape
      capeHinge.rotation.x = -0.58 + Math.sin(runPhase * 1.5) * 0.16;
      hairGroup.rotation.x = 0.14 + Math.sin(runPhase) * 0.09;

    } else if (animState === 'jump') {
      // Airborne pose
      torsoGroup.rotation.x = -0.08;
      leftLegGroup.rotation.x = -0.35;
      rightLegGroup.rotation.x = -0.25;

      leftArmGroup.rotation.x = -0.3;
      leftArmGroup.rotation.z = 0.45;
      rightArmGroup.rotation.x = -0.3;
      rightArmGroup.rotation.z = -0.45;

      // Upward cape billow
      capeHinge.rotation.x = 0.28;

    } else if (animState === 'interact') {
      // Welcoming interactive gesture
      torsoGroup.rotation.x = 0.05;
      headGroup.rotation.x = 0.1;
      headGroup.rotation.y = 0;

      // Left hand on hip, right hand raised in greeting
      leftArmGroup.rotation.x = 0.2;
      leftArmGroup.rotation.z = 0.3;
      rightArmGroup.rotation.x = -1.2;
      rightArmGroup.rotation.z = -0.3;

      leftLegGroup.rotation.x = 0;
      rightLegGroup.rotation.x = 0;
      capeHinge.rotation.x = -0.15;
    }
  };

  return {
    playerMeshGroup,
    pelvisGroup,
    torsoGroup,
    headGroup,
    hairGroup,
    leftArmGroup,
    rightArmGroup,
    leftLegGroup,
    rightLegGroup,
    capeHinge,
    tomeGroup,
    contactShadow,
    isFemale,
    updateAnimation,
  };
}
