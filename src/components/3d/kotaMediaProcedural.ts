/**
 * BAKUWIRA: Kota Media Sosial Procedural 3D Environment Builder
 * Faithfully constructs the Grand Fantasy Cyber Plaza based on the official illustrations:
 * - 3D_MEDIA_SOSIAL_P_0ff331c2.jpeg & 3d_media_sosial_L_82f78c73.jpeg
 * 
 * Features:
 * 1. Grand Polished Courtyard Floor with concentric glowing gold & cyan runic circuits
 * 2. Majestic Grand Cyber Palace Facade at North with golden spires & "Kota Media Sosial" royal banner
 * 3. Central Holographic Pavilion at z = -12 with glowing translucent cyber dome (no camera-blocking wireframe!)
 * 4. Floating curved social media feed boards & 3D reaction badges (👍, ❤️, 💬, 🔗, 🔔, 📸, ▶️)
 * 5. East & West two-story classical palace arcades with golden lantern pillars & Bakuwira banners
 * 6. Procedural pink blooming Sakura trees and falling cherry blossom petals
 * 7. Student NPCs in purple uniforms along the colonnades
 * 8. Floating sky islands with cascading waterfalls in background
 * 9. Precise collision box data for walkable pathways
 */

import * as THREE from 'three';

export interface AnimatedProp {
  mesh: THREE.Object3D;
  update: (time: number, delta: number) => void;
}

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Procedural Canvas Texture: Courtyard Floor Tile with Gold & Cyan Concentric Glyphs
 */
export function createPlazaTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep royal violet/indigo marble base
  const bgGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 512);
  bgGrad.addColorStop(0, '#1c1038');
  bgGrad.addColorStop(0.5, '#140a2b');
  bgGrad.addColorStop(1, '#0c061a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle marble tile paving lines
  ctx.strokeStyle = 'rgba(216, 180, 254, 0.08)';
  ctx.lineWidth = 2;
  const tileSize = 64;
  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Concentric Celestial Gold & Cyan Rings (Matching the illustration floor)
  const drawRing = (r: number, color: string, width: number, dashed = false) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dashed) ctx.setLineDash([12, 10]);
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  };

  drawRing(460, 'rgba(250, 204, 21, 0.55)', 4);
  drawRing(430, 'rgba(56, 189, 248, 0.45)', 2, true);
  drawRing(340, 'rgba(250, 204, 21, 0.75)', 3);
  drawRing(260, 'rgba(168, 85, 247, 0.65)', 2, true);
  drawRing(180, 'rgba(56, 189, 248, 0.85)', 3);
  drawRing(110, 'rgba(250, 204, 21, 0.9)', 4);

  // 8-Point Starburst at center
  ctx.save();
  ctx.translate(512, 512);
  for (let i = 0; i < 8; i++) {
    ctx.rotate((Math.PI * 2) / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(16, 70);
    ctx.lineTo(0, 160);
    ctx.lineTo(-16, 70);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(250, 204, 21, 0.85)' : 'rgba(56, 189, 248, 0.75)';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 12;
    ctx.fill();
  }
  ctx.restore();

  // Digital circuit traces radiating outward
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 16; i++) {
    const ang = (i * Math.PI * 2) / 16;
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(ang) * 190, 512 + Math.sin(ang) * 190);
    ctx.lineTo(512 + Math.cos(ang) * 330, 512 + Math.sin(ang) * 330);
    ctx.stroke();

    // Small circular glyph nodes
    ctx.beginPath();
    ctx.arc(512 + Math.cos(ang) * 330, 512 + Math.sin(ang) * 330, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Canvas Texture: "Kota Media Sosial" Royal Signboard
 */
export function createPalaceSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Gradient royal shield plaque
  const grad = ctx.createLinearGradient(0, 0, 1024, 320);
  grad.addColorStop(0, '#1e1038');
  grad.addColorStop(0.5, '#2e1065');
  grad.addColorStop(1, '#1e1038');
  ctx.fillStyle = grad;
  ctx.roundRect(20, 20, 984, 280, 40);
  ctx.fill();

  // Golden filigree border
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 10;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 20;
  ctx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.roundRect(36, 36, 952, 248, 30);
  ctx.stroke();

  // Top Wi-Fi / Digital Signal Icon
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📶  💬  ✨', 512, 85);

  // Main Title: "Kota Media Sosial"
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 68px "Cinzel", Georgia, serif';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 18;
  ctx.fillText('Kota Media Sosial', 512, 175);

  // Subtitle
  ctx.fillStyle = '#e9d5ff';
  ctx.font = '600 28px sans-serif';
  ctx.shadowBlur = 8;
  ctx.fillText('✦ PUSAT KOMUNIKASI DIGITAL EMPAYAR BAHASA ✦', 512, 235);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Canvas Texture: Curved Social Media Feed Display
 */
export function createSocialFeedTexture(type: 'profile' | 'feed' | 'chat'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark glass background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.roundRect(10, 10, 492, 320, 24);
  ctx.fill();

  // Glowing neon frame
  ctx.strokeStyle = type === 'profile' ? '#38bdf8' : type === 'feed' ? '#ec4899' : '#a855f7';
  ctx.lineWidth = 6;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 15;
  ctx.stroke();

  if (type === 'profile') {
    // Avatar circle
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(80, 85, 45, 0, Math.PI * 2);
    ctx.fill();

    // Avatar silhouette
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(80, 75, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(80, 115, 28, 18, 0, 0, Math.PI);
    ctx.fill();

    // User details
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Wira Bahasa', 145, 75);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '18px sans-serif';
    ctx.fillText('@bakuwira_official • 99.8k Pengikut', 145, 105);

    // Stats bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.roundRect(30, 155, 452, 60, 12);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('❤️ 45.2K Suka', 50, 192);
    ctx.fillStyle = '#a855f7';
    ctx.fillText('💬 12.8K Mesej', 220, 192);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('⭐ Tahap 5', 380, 192);

    // Sample message text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 18px sans-serif';
    ctx.fillText('"Gunakan bahasa baku, perkasa adab siber!"', 45, 275);
  } else if (type === 'feed') {
    // Header
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('❤️ Siaran Trending', 35, 60);

    // Feed message card 1
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    ctx.roundRect(25, 85, 462, 100, 14);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Puan Zahra: "Ucap salam sebelum bertanya."', 45, 125);
    ctx.fillStyle = '#f472b6';
    ctx.font = '16px sans-serif';
    ctx.fillText('➔ 2,410 Perkongsian • Rasmi Sekolah', 45, 158);

    // Feed message card 2
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.roundRect(25, 205, 462, 100, 14);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Adik Amir: "Terima kasih atas panduan tatabahasa!"', 45, 245);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px sans-serif';
    ctx.fillText('➔ 1,180 Suka • Murid Teladan', 45, 278);
  } else {
    // Chat screen
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('💬 Bilik Bual Siber', 35, 60);

    // Chat bubble left
    ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.roundRect(30, 90, 360, 65, 16);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px sans-serif';
    ctx.fillText('Adik Faris: "Cikgu, ejaan rasmi ini betul?"', 45, 130);

    // Chat bubble right
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.roundRect(120, 175, 360, 65, 16);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px sans-serif';
    ctx.fillText('Detektif Siber: "Tepat sekali, teruskan!"', 140, 215);

    // Active status
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(45, 280, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px sans-serif';
    ctx.fillText('Rangkaian Bebas Glit • 100% Baku', 65, 286);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates 3D Procedural Floating Social Media Reaction Badges
 */
export function createFloatingReactionIcon(
  type: 'like' | 'heart' | 'comment' | 'share' | 'bell' | 'video' | 'camera'
): THREE.Group {
  const group = new THREE.Group();

  let baseColor = 0x38bdf8;
  let symbol = '👍';

  switch (type) {
    case 'like':
      baseColor = 0x2563eb;
      symbol = '👍';
      break;
    case 'heart':
      baseColor = 0xec4899;
      symbol = '❤️';
      break;
    case 'comment':
      baseColor = 0x06b6d4;
      symbol = '💬';
      break;
    case 'share':
      baseColor = 0x8b5cf6;
      symbol = '🔗';
      break;
    case 'bell':
      baseColor = 0xf59e0b;
      symbol = '🔔';
      break;
    case 'video':
      baseColor = 0x7c3aed;
      symbol = '▶️';
      break;
    case 'camera':
      baseColor = 0x0ea5e9;
      symbol = '📸';
      break;
  }

  // Rounded icon plate
  const plateGeo = new THREE.BoxGeometry(1.3, 1.3, 0.2);
  const plateMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.25,
    metalness: 0.8,
    emissive: baseColor,
    emissiveIntensity: 0.5,
  });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  group.add(plate);

  // Outer glowing gold rim
  const rimGeo = new THREE.BoxGeometry(1.42, 1.42, 0.16);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.3,
    metalness: 0.9,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  group.add(rim);

  // Procedural canvas symbol
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 64, 68);
  }
  const symbolTex = new THREE.CanvasTexture(canvas);
  symbolTex.colorSpace = THREE.SRGBColorSpace;

  const decalMat = new THREE.MeshBasicMaterial({
    map: symbolTex,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const decalGeo = new THREE.PlaneGeometry(1.0, 1.0);
  const frontDecal = new THREE.Mesh(decalGeo, decalMat);
  frontDecal.position.z = 0.11;
  group.add(frontDecal);

  const backDecal = new THREE.Mesh(decalGeo, decalMat);
  backDecal.position.z = -0.11;
  backDecal.rotation.y = Math.PI;
  group.add(backDecal);

  return group;
}

/**
 * Procedural Stylized Anime Sakura Tree (Multi-part organic hierarchy matching Three.js skill)
 * Features curved organic trunk, flaring roots, 14 cloud-like canopy cushions,
 * flowering shrub planter base, and fallen petal scatter.
 */
export function createSakuraTree(): THREE.Group {
  const tree = new THREE.Group();

  // 1. Organic Curved Trunk with Root Buttresses
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x3d1a08,
    roughness: 0.85,
    metalness: 0.08,
  });

  // Lower flared trunk base
  const lowerTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.75, 2.2, 10), trunkMat);
  lowerTrunk.position.y = 1.6;
  lowerTrunk.rotation.z = 0.08;
  tree.add(lowerTrunk);

  // Upper curved trunk extending into canopy
  const upperTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.44, 2.8, 10), trunkMat);
  upperTrunk.position.set(0.12, 3.8, -0.05);
  upperTrunk.rotation.z = -0.12;
  upperTrunk.rotation.x = 0.06;
  tree.add(upperTrunk);

  // Root Buttresses flaring into planter soil
  for (let r = 0; r < 5; r++) {
    const rootAng = (r * Math.PI * 2) / 5 + 0.2;
    const root = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.4, 6), trunkMat);
    root.position.set(Math.cos(rootAng) * 0.55, 0.9, Math.sin(rootAng) * 0.55);
    root.rotation.x = Math.sin(rootAng) * 0.4;
    root.rotation.z = -Math.cos(rootAng) * 0.4;
    tree.add(root);
  }

  // 2. Organic Twisting Canopy Branches
  const branchConfigs = [
    { x: -0.4, y: 3.6, z: 0.3, len: 2.2, rotZ: 0.7, rotX: 0.3 },
    { x: 0.5, y: 3.8, z: -0.2, len: 2.4, rotZ: -0.65, rotX: -0.2 },
    { x: 0.1, y: 4.2, z: 0.6, len: 2.0, rotZ: 0.1, rotX: 0.75 },
    { x: -0.2, y: 4.4, z: -0.5, len: 2.1, rotZ: -0.2, rotX: -0.7 },
    { x: 0.35, y: 4.6, z: 0.4, len: 1.8, rotZ: -0.4, rotX: 0.5 },
  ];

  branchConfigs.forEach((cfg) => {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, cfg.len, 7), trunkMat);
    branch.position.set(cfg.x, cfg.y, cfg.z);
    branch.rotation.z = cfg.rotZ;
    branch.rotation.x = cfg.rotX;
    tree.add(branch);
  });

  // 3. Stylized Anime Cloud-Like Canopy Cushions (Layered pastels with varied hues)
  const foliageTints = [
    { color: 0xfbcfe8, emissive: 0x831843, rough: 0.55 }, // Soft blush
    { color: 0xf472b6, emissive: 0x9d174d, rough: 0.5 },  // Radiant rose
    { color: 0xf9a8d4, emissive: 0x701a75, rough: 0.55 }, // Pastel cherry
    { color: 0xfff1f2, emissive: 0x9f1239, rough: 0.6 },  // White cherry blossom highlight
    { color: 0xec4899, emissive: 0xbe185d, rough: 0.48 }, // Rich pink
  ];

  // Multi-tier cloud cushions arranged in an organic anime silhouette
  const canopyCushions = [
    // Core crown
    { x: 0, y: 6.2, z: 0, rx: 1.6, ry: 1.1, rz: 1.6, matIdx: 3 },
    { x: 0, y: 5.4, z: 0, rx: 2.2, ry: 1.3, rz: 2.2, matIdx: 1 },
    // Outward cloud puffs
    { x: -1.4, y: 4.8, z: 0.8, rx: 1.6, ry: 1.0, rz: 1.4, matIdx: 0 },
    { x: 1.5, y: 5.1, z: -0.6, rx: 1.7, ry: 1.1, rz: 1.5, matIdx: 2 },
    { x: 0.8, y: 4.7, z: 1.4, rx: 1.5, ry: 0.95, rz: 1.3, matIdx: 4 },
    { x: -0.9, y: 5.2, z: -1.3, rx: 1.6, ry: 1.0, rz: 1.4, matIdx: 1 },
    // Upper crests
    { x: -0.7, y: 6.5, z: 0.4, rx: 1.2, ry: 0.85, rz: 1.1, matIdx: 3 },
    { x: 0.6, y: 6.4, z: -0.5, rx: 1.3, ry: 0.9, rz: 1.2, matIdx: 0 },
    // Lower dangling flowering clusters
    { x: -1.8, y: 4.0, z: 0.5, rx: 1.1, ry: 0.75, rz: 1.0, matIdx: 1 },
    { x: 1.7, y: 4.1, z: -0.4, rx: 1.1, ry: 0.75, rz: 1.0, matIdx: 2 },
    { x: 0.4, y: 3.9, z: 1.6, rx: 1.0, ry: 0.7, rz: 0.9, matIdx: 0 },
  ];

  canopyCushions.forEach((c) => {
    const tint = foliageTints[c.matIdx];
    const foliageMat = new THREE.MeshStandardMaterial({
      color: tint.color,
      emissive: tint.emissive,
      emissiveIntensity: 0.18,
      roughness: tint.rough,
      metalness: 0.04,
    });
    const cushionGeo = new THREE.SphereGeometry(1, 14, 12);
    cushionGeo.scale(c.rx, c.ry, c.rz);
    const cushionMesh = new THREE.Mesh(cushionGeo, foliageMat);
    cushionMesh.position.set(c.x, c.y, c.z);
    tree.add(cushionMesh);
  });

  // 4. Ornate Octagonal White Marble Planter Base with Gold Filigree
  const planterMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.32,
    metalness: 0.25,
  });
  const planterGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.22,
    metalness: 0.88,
  });

  // Octagonal base plinth
  const planterPlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.05, 0.4, 8), planterMat);
  planterPlinth.position.y = 0.2;
  tree.add(planterPlinth);

  // Main planter body
  const planterBody = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.85, 0.6, 8), planterMat);
  planterBody.position.y = 0.7;
  tree.add(planterBody);

  // Gold molding rim around upper ledge
  const goldMolding = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 1.74, 0.1, 8), planterGoldMat);
  goldMolding.position.y = 1.02;
  tree.add(goldMolding);

  // Dark enriched planter soil
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.95 });
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.15, 8), soilMat);
  soil.position.y = 0.96;
  tree.add(soil);

  // 5. Flowering Shrub Base around Trunk with Colorful Blossoms
  const shrubGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 });
  const flowerColors = [0xf472b6, 0xa855f7, 0x38bdf8, 0xfacc15];

  for (let s = 0; s < 6; s++) {
    const ang = (s * Math.PI * 2) / 6 + 0.15;
    const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), shrubGreenMat);
    shrub.scale.set(1.2, 0.75, 1.1);
    shrub.position.set(Math.cos(ang) * 0.95, 1.08, Math.sin(ang) * 0.95);
    tree.add(shrub);

    // Mini flower blossom on shrub
    const flwMat = new THREE.MeshBasicMaterial({ color: flowerColors[s % flowerColors.length] });
    const flw = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), flwMat);
    flw.position.set(Math.cos(ang) * 1.05, 1.25, Math.sin(ang) * 1.05);
    tree.add(flw);
  }

  // 6. Fallen Sakura Petal Scatter on Soil
  for (let p = 0; p < 8; p++) {
    const pAng = Math.random() * Math.PI * 2;
    const pDist = 0.6 + Math.random() * 0.8;
    const petalDecal = new THREE.Mesh(
      new THREE.CircleGeometry(0.065, 5),
      new THREE.MeshBasicMaterial({ color: 0xfbcfe8, side: THREE.DoubleSide })
    );
    petalDecal.rotation.x = -Math.PI / 2;
    petalDecal.position.set(Math.cos(pAng) * pDist, 1.04, Math.sin(pAng) * pDist);
    tree.add(petalDecal);
  }

  return tree;
}

/**
 * Creates Classical Colonnade Promenade (Left and Right Flanks)
 */
export function createPlazaColonnade(isRightSide: boolean): THREE.Group {
  const colonnade = new THREE.Group();
  const sideX = isRightSide ? 20 : -20;
  colonnade.position.set(sideX, 0, 0);

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.2,
  });
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.9,
    roughness: 0.25,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    roughness: 0.4,
    metalness: 0.7,
  });

  // Base promenade floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 44), marbleMat);
  floor.position.set(0, 0.3, -3);
  colonnade.add(floor);

  // Pillars along length
  for (let z = -20; z <= 16; z += 5) {
    // Column
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 7.5, 12), marbleMat);
    pillar.position.set(isRightSide ? -2.2 : 2.2, 4.05, z);
    colonnade.add(pillar);

    // Gilded Capital
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 1.1), goldTrimMat);
    cap.position.set(isRightSide ? -2.2 : 2.2, 7.8, z);
    colonnade.add(cap);

    // Back wall section
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8, 4.8), marbleMat);
    backWall.position.set(isRightSide ? 2.5 : -2.5, 4.3, z);
    colonnade.add(backWall);

    // Glowing blue arched window in back wall
    const win = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 3.8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    win.position.set(isRightSide ? 1.85 : -1.85, 4.5, z);
    win.rotation.y = isRightSide ? -Math.PI / 2 : Math.PI / 2;
    colonnade.add(win);
  }

  // Upper architrave and roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.2, 44.5), roofMat);
  roof.position.set(0, 8.4, -3);
  colonnade.add(roof);

  // Balustrade railing on upper roof
  const railing = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.1, 44),
    goldTrimMat
  );
  railing.position.set(isRightSide ? -3.4 : 3.4, 9.4, -3);
  colonnade.add(railing);

  // Gothic Spires on roof top
  for (let z = -18; z <= 14; z += 10) {
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.65, 3.5, 8), goldTrimMat);
    spire.position.set(isRightSide ? -3.4 : 3.4, 10.8, z);
    colonnade.add(spire);
  }

  return colonnade;
}

/**
 * Creates Ornate Royal Lamp-Post with Hanging Bakuwira Banner
 */
export function createBannerLampPost(side: 'left' | 'right'): THREE.Group {
  const post = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.8 });
  const bannerMat = new THREE.MeshStandardMaterial({
    color: 0x6b21a8,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });

  // Base & Pole
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.0, 10), darkMetal);
  base.position.y = 0.5;
  post.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 6.5, 10), goldMat);
  pole.position.y = 4.0;
  post.add(pole);

  // Lantern lamp at top
  const lantern = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  lantern.position.y = 7.2;
  post.add(lantern);

  // Cross arm
  const crossArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), goldMat);
  crossArm.rotation.z = Math.PI / 2;
  crossArm.position.set(side === 'left' ? 0.8 : -0.8, 6.2, 0);
  post.add(crossArm);

  // Royal Purple Bakuwira Banner
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 3.4), bannerMat);
  banner.position.set(side === 'left' ? 0.8 : -0.8, 4.4, 0);
  post.add(banner);

  // Gold Star Badge on Banner
  const starGeo = new THREE.OctahedronGeometry(0.32, 0);
  const starMesh = new THREE.Mesh(starGeo, goldMat);
  starMesh.position.set(side === 'left' ? 0.8 : -0.8, 4.8, 0.04);
  post.add(starMesh);

  return post;
}

/**
 * Creates Student NPC procedural model (Academy Uniform)
 */
export function createStudentNPC(colorHex = 0x4338ca): THREE.Group {
  const npc = new THREE.Group();

  const tunicMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.7 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.8 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3b1e08, roughness: 0.9 });
  const goldAccent = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 });

  // Body Tunic
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.7, 8), tunicMat);
  torso.position.y = 1.15;
  npc.add(torso);

  // Gold neck collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.1, 8), goldAccent);
  collar.position.y = 1.52;
  npc.add(collar);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), skinMat);
  head.position.y = 1.74;
  npc.add(head);

  // Anime Spiky Hair
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10, 0, Math.PI * 2, 0, Math.PI / 1.7), hairMat);
  hair.position.y = 1.82;
  npc.add(hair);

  // Legs
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.75, 6), pantsMat);
  leftLeg.position.set(-0.11, 0.4, 0);
  npc.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.75, 6), pantsMat);
  rightLeg.position.set(0.11, 0.4, 0);
  npc.add(rightLeg);

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.4, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  npc.add(shadow);

  return npc;
}

/**
 * Creates Grand Fantasy Cyber Palace Facade at North Plaza
 * Faithfully captures the majestic anime fantasy castle architecture from the illustrations:
 * multi-tier gothic spires, golden filigree pinnacles, glowing stained glass,
 * and grand balustrade terraces.
 */
export function createGrandPalaceFacade(signTexture: THREE.CanvasTexture): THREE.Group {
  const palace = new THREE.Group();
  palace.position.set(0, 0, -25);

  const whiteStone = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.28,
    metalness: 0.22,
  });
  const palaceGold = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.92,
    roughness: 0.18,
  });
  const royalViolet = new THREE.MeshStandardMaterial({
    color: 0x1e1038,
    roughness: 0.35,
    metalness: 0.65,
  });
  const cyanGlass = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.88,
  });
  const purpleGlass = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0.82,
  });

  // 1. Multi-Tier Foundation & Palace Wings
  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(52, 14, 15), whiteStone);
  mainBlock.position.y = 7;
  palace.add(mainBlock);

  // Upper recessed palace block
  const upperBlock = new THREE.Mesh(new THREE.BoxGeometry(40, 9, 12), whiteStone);
  upperBlock.position.set(0, 18.5, -1);
  palace.add(upperBlock);

  // Decorative Golden Cornice Ledges
  const lowerCornice = new THREE.Mesh(new THREE.BoxGeometry(53, 0.8, 15.8), palaceGold);
  lowerCornice.position.y = 14;
  palace.add(lowerCornice);

  const upperCornice = new THREE.Mesh(new THREE.BoxGeometry(41, 0.7, 12.8), palaceGold);
  upperCornice.position.set(0, 23, -1);
  palace.add(upperCornice);

  // 2. Grand Arched Entrance Recess with Golden Portal Filigree
  const portalArch = new THREE.Mesh(new THREE.BoxGeometry(11, 9.5, 3.5), royalViolet);
  portalArch.position.set(0, 4.75, 7.2);
  palace.add(portalArch);

  // Glowing Cyber Gate
  const portalGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(8.5, 8.5),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.88 })
  );
  portalGlow.position.set(0, 4.75, 8.8);
  palace.add(portalGlow);

  // Gold Arch Trim on Portal
  const portalArchTrim = new THREE.Mesh(
    new THREE.TorusGeometry(4.4, 0.25, 8, 20, Math.PI),
    palaceGold
  );
  portalArchTrim.position.set(0, 4.75, 8.85);
  palace.add(portalArchTrim);

  // 3. Grand Entrance Marble Staircase
  const stairSteps = 7;
  for (let s = 0; s < stairSteps; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(15 + (stairSteps - s) * 0.9, 0.35, 1.2),
      whiteStone
    );
    step.position.set(0, s * 0.35 + 0.175, 8.6 + (stairSteps - s) * 0.75);
    palace.add(step);
  }

  // 4. Balustrades along 1st & 2nd Floor Terraces
  for (let b = -24; b <= 24; b += 2.4) {
    if (Math.abs(b) < 6) continue; // Skip above portal
    const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 8), whiteStone);
    baluster.position.set(b, 14.8, 7.6);
    palace.add(baluster);

    const miniFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), palaceGold);
    miniFinial.position.set(b, 15.5, 7.6);
    palace.add(miniFinial);
  }

  // 5. Arched Stained Glass Windows Across Palace Facade
  for (let wx = -22; wx <= 22; wx += 5.5) {
    if (Math.abs(wx) < 6) continue; // Skip portal area
    // Lower level windows
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.4, 0.4), royalViolet);
    winFrame.position.set(wx, 6.5, 7.6);
    palace.add(winFrame);

    const winGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 3.8),
      Math.abs(wx) % 2 === 0 ? cyanGlass : purpleGlass
    );
    winGlass.position.set(wx, 6.5, 7.82);
    palace.add(winGlass);

    // Pointed Gothic Window Hood
    const winHood = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.4, 4), palaceGold);
    winHood.position.set(wx, 9.2, 7.8);
    palace.add(winHood);

    // Upper level windows
    if (Math.abs(wx) <= 18) {
      const upWin = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.2), cyanGlass);
      upWin.position.set(wx, 18.5, 5.05);
      palace.add(upWin);
    }
  }

  // 6. Central Grand Spire & Clockwork Dome (Matching Illustration Spire)
  const centralBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.0, 10, 16), whiteStone);
  centralBase.position.set(0, 24, 0);
  palace.add(centralBase);

  const centralSpire = new THREE.Mesh(new THREE.ConeGeometry(3.6, 16, 16), palaceGold);
  centralSpire.position.set(0, 37, 0);
  palace.add(centralSpire);

  // Crown Starburst Crystal Beacon atop main spire
  const starburst = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.4, 0),
    new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
  );
  starburst.position.set(0, 45.5, 0);
  palace.add(starburst);

  // Glowing Holographic Wifi Arches over Central Spire (matching logo in illustration)
  for (let w = 1; w <= 3; w++) {
    const wifiArch = new THREE.Mesh(
      new THREE.TorusGeometry(w * 1.4, 0.16, 6, 16, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })
    );
    wifiArch.position.set(0, 22.5 + w * 1.5, 5.2);
    palace.add(wifiArch);
  }

  // 7. Flanking Gothic Towers with Needle Pinnacles (Left & Right)
  [-21, 21, -12, 12].forEach((x, idx) => {
    const isOuter = Math.abs(x) > 16;
    const height = isOuter ? 24 : 29;
    const towerBody = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, height, 14), whiteStone);
    towerBody.position.set(x, height / 2 + 3, 2.5);
    palace.add(towerBody);

    // Decorative tower belt rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.15, 6, 14), palaceGold);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.set(x, height * 0.5, 2.5);
    palace.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.15, 6, 14), palaceGold);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.set(x, height * 0.85, 2.5);
    palace.add(ring2);

    // Pointed Spire Roof
    const spireRoof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 9.5, 14), idx % 2 === 0 ? palaceGold : royalViolet);
    spireRoof.position.set(x, height + 7.7, 2.5);
    palace.add(spireRoof);

    // Golden Needle Pinnacle on top of each tower
    const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 3.2, 8), palaceGold);
    pinnacle.position.set(x, height + 13.5, 2.5);
    palace.add(pinnacle);

    const pinCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), cyanGlass);
    pinCrystal.position.set(x, height + 15.2, 2.5);
    palace.add(pinCrystal);

    // Glowing vertical window slots
    for (let w = 8; w < height - 2; w += 5) {
      const winSlot = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 3.2), cyanGlass);
      winSlot.position.set(x, w, 4.65);
      palace.add(winSlot);
    }
  });

  // 8. Royal Golden Signboard Plaque: "Kota Media Sosial"
  const signMat = new THREE.MeshBasicMaterial({
    map: signTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(16, 5.0), signMat);
  signBoard.position.set(0, 13.8, 7.8);
  palace.add(signBoard);

  // Floating Sky Sanctums behind the palace (Matching Illustration Sky)
  for (const [ix, iy, iz, scale] of [
    [-28, 22, -22, 1.2],
    [26, 24, -20, 1.3],
    [-12, 28, -28, 1.0],
    [10, 27, -26, 1.1],
  ]) {
    const island = new THREE.Group();
    island.position.set(ix, iy, iz);
    island.scale.setScalar(scale);

    // Inverted rocky cone island base
    const islandBase = new THREE.Mesh(
      new THREE.ConeGeometry(5, 7, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 })
    );
    islandBase.rotation.x = Math.PI;
    island.add(islandBase);

    // Green grassy plateau top
    const islandTop = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 5.0, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 })
    );
    islandTop.position.y = 0.6;
    island.add(islandTop);

    // Mini fantasy castle on island
    const miniCastle = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), whiteStone);
    miniCastle.position.y = 3.0;
    island.add(miniCastle);

    const miniSpire = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4, 8), palaceGold);
    miniSpire.position.y = 6.5;
    island.add(miniSpire);

    // Celestial rotating aurora ring around island
    const auroraRing = new THREE.Mesh(
      new THREE.TorusGeometry(6.8, 0.12, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
    );
    auroraRing.rotation.x = Math.PI / 3;
    island.add(auroraRing);

    palace.add(island);
  }

  return palace;
}

/**
 * Creates Central Holographic Social Media Pavilion at z = -12
 * (Elegant, open, beautiful — NO wireframe obstructing player camera!)
 */
export function createCentralHoloPavilion(
  feedTextureProfile: THREE.CanvasTexture,
  feedTextureTrend: THREE.CanvasTexture,
  feedTextureChat: THREE.CanvasTexture
): { group: THREE.Group; animatedList: AnimatedProp[] } {
  const group = new THREE.Group();
  group.position.set(0, 0, -12);

  const animatedList: AnimatedProp[] = [];

  const whiteMarble = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 });
  const goldTrim = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });

  // 1. Stepped circular golden and marble dais
  const daisBase = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.4, 0.45, 32), whiteMarble);
  daisBase.position.y = 0.225;
  group.add(daisBase);

  const innerDais = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.4, 0.35, 32), goldTrim);
  innerDais.position.y = 0.5;
  group.add(innerDais);

  // Glowing cyan water/pool ring
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(3.6, 3.6, 0.1, 32),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
  );
  pool.position.y = 0.68;
  group.add(pool);

  // 2. The Translucent Cyber Holographic Dome (Elegant glass, not blocking wireframe!)
  const domeMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.38,
    roughness: 0.1,
    metalness: 0.15,
    transmission: 0.5,
    depthWrite: false,
  });
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
    domeMat
  );
  dome.position.y = 0.7;
  group.add(dome);

  // Glowing white avatar silhouettes standing proudly inside the dome
  const avatarGroup = new THREE.Group();
  avatarGroup.position.set(0, 0.7, 0);

  const avatarMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });

  // Center tall avatar
  const centerHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), avatarMat);
  centerHead.position.set(0, 1.45, 0);
  avatarGroup.add(centerHead);

  const centerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 1.0, 8), avatarMat);
  centerBody.position.set(0, 0.75, 0);
  avatarGroup.add(centerBody);

  // Left child avatar
  const leftHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), avatarMat);
  leftHead.position.set(-0.75, 1.15, 0.2);
  avatarGroup.add(leftHead);

  const leftBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.75, 8), avatarMat);
  leftBody.position.set(-0.75, 0.6, 0.2);
  avatarGroup.add(leftBody);

  // Right child avatar
  const rightHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), avatarMat);
  rightHead.position.set(0.75, 1.15, 0.2);
  avatarGroup.add(rightHead);

  const rightBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.75, 8), avatarMat);
  rightBody.position.set(0.75, 0.6, 0.2);
  avatarGroup.add(rightBody);

  group.add(avatarGroup);

  // Soft slow rotation of the inside avatars
  animatedList.push({
    mesh: avatarGroup,
    update: (time) => {
      avatarGroup.rotation.y = Math.sin(time * 0.5) * 0.15;
    },
  });

  // 3. Curved Tiered Social Media Holographic Displays (Above the dome)
  // Display 1: Center Profile Card
  const profileScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 3.2),
    new THREE.MeshBasicMaterial({
      map: feedTextureProfile,
      transparent: true,
      side: THREE.DoubleSide,
    })
  );
  profileScreen.position.set(0, 4.6, 0.4);
  group.add(profileScreen);

  // Display 2: Left Trending Feed Card
  const feedScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 2.8),
    new THREE.MeshBasicMaterial({
      map: feedTextureTrend,
      transparent: true,
      side: THREE.DoubleSide,
    })
  );
  feedScreen.position.set(-4.2, 4.4, -0.6);
  feedScreen.rotation.y = Math.PI / 6;
  group.add(feedScreen);

  // Display 3: Right Chat Feed Card
  const chatScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 2.8),
    new THREE.MeshBasicMaterial({
      map: feedTextureChat,
      transparent: true,
      side: THREE.DoubleSide,
    })
  );
  chatScreen.position.set(4.2, 4.4, -0.6);
  chatScreen.rotation.y = -Math.PI / 6;
  group.add(chatScreen);

  // Floating bobbing motion on the screens
  animatedList.push({
    mesh: profileScreen,
    update: (time) => {
      profileScreen.position.y = 4.6 + Math.sin(time * 1.5) * 0.12;
      feedScreen.position.y = 4.4 + Math.sin(time * 1.5 + 1) * 0.12;
      chatScreen.position.y = 4.4 + Math.sin(time * 1.5 + 2) * 0.12;
    },
  });

  // Concentric holographic neon halo hovering over the pavilion
  const halo1 = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.06, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 })
  );
  halo1.position.y = 3.4;
  halo1.rotation.x = Math.PI / 2;
  group.add(halo1);

  const halo2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.6, 0.06, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.75 })
  );
  halo2.position.y = 3.6;
  halo2.rotation.x = Math.PI / 2;
  group.add(halo2);

  animatedList.push({
    mesh: halo1,
    update: (time) => {
      halo1.rotation.z = time * 0.8;
      halo2.rotation.z = -time * 0.6;
    },
  });

  return { group, animatedList };
}

/**
 * Procedural Canvas Texture: Directional Crossroad Sign Plaque
 */
export function createDirectionSignTexture(text: string, direction: 'left' | 'right' | 'up' | 'down'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 512, 140);
  grad.addColorStop(0, '#110c2a');
  grad.addColorStop(0.5, '#241447');
  grad.addColorStop(1, '#110c2a');
  ctx.fillStyle = grad;
  ctx.roundRect(10, 10, 492, 120, 24);
  ctx.fill();

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.roundRect(10, 10, 492, 120, 24);
  ctx.stroke();

  // Glow cyan border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.roundRect(16, 16, 480, 108, 18);
  ctx.stroke();

  // Arrow symbol
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const arrows = {
    left: '◀',
    right: '▶',
    up: '▲',
    down: '▼',
  };

  const arrow = arrows[direction] || '★';

  if (direction === 'left') {
    ctx.fillText(arrow, 50, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(text, 90, 70);
  } else if (direction === 'right') {
    ctx.fillText(arrow, 460, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(text, 420, 70);
  } else {
    ctx.fillText(arrow, 50, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(text, 90, 70);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Canvas Texture: Cyber Acronym Decode Billboard
 */
export function createAcronymBillboardTexture(acronym: string, baku: string, note: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Cyber dark glass background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 256);

  // Glowing neon frame
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, 488, 232);

  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 476, 220);

  // Header tag
  ctx.fillStyle = '#f43f5e';
  ctx.font = '900 18px sans-serif';
  ctx.fillText('⚡ NYAHKOD SINGKATAN SIBER', 32, 50);

  // Slang / Acronym (Red warning)
  ctx.fillStyle = '#fb7185';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(`"${acronym}"`, 32, 105);

  // Arrow down
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('➔ BAHASA BAKU:', 32, 150);

  // Baku Melayu translation (Emerald green)
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(baku, 32, 195);

  // Small context note
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText(note, 32, 228);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Canvas Texture: Menara Hologram Royal Broadcast Display
 */
export function createBroadcastBillboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 1024, 512);
  grad.addColorStop(0, '#1e1b4b');
  grad.addColorStop(0.5, '#311042');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Hologram grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 1024; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y < 512; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 10;
  ctx.strokeRect(15, 15, 994, 482);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(25, 25, 974, 462);

  // Spire Badge Header
  ctx.fillStyle = '#facc15';
  ctx.font = '900 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📡 MENARA HOLOGRAM KOTA MEDIA SOSIAL', 512, 85);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('GELOMBANG PENYIARAN RASMI KERAJAAN BAKUWIRA', 512, 130);

  // Big Banner Card
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.roundRect(60, 170, 904, 280, 24);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;
  ctx.roundRect(60, 170, 904, 280, 24);
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('PROGRAM MEMBACA DIGITAL (MISI 04)', 512, 230);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Masa: Esok, 8.00 pagi  |  Tempat: Makmal Komputer', 512, 290);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Ajakan: Marilah kita menyertai program ini untuk memartabatkan bahasa!', 512, 350);

  ctx.fillStyle = '#a855f7';
  ctx.font = 'italic 20px sans-serif';
  ctx.fillText('Sampaikan pengumuman ini secara langsung bersama Pengurus Menara!', 512, 410);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates the Central Crossroads Directional Signpost
 */
export function createCrossroadDirectionalSignposts(): THREE.Group {
  const postGroup = new THREE.Group();
  postGroup.position.set(0, 0, 5);

  // Stone base pedestal
  const baseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.7, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
  );
  baseMesh.position.y = 0.3;
  postGroup.add(baseMesh);

  // Golden fluted pillar post
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 3.8, 12),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.25 })
  );
  pillar.position.y = 2.2;
  postGroup.add(pillar);

  // Glowing crystal orb finial at top
  const finialOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.0 })
  );
  finialOrb.position.y = 4.2;
  postGroup.add(finialOrb);

  // 4 Directional Sign Plaques at different heights
  const signConfigs: [string, 'left' | 'right' | 'up' | 'down', number, number][] = [
    ['MENARA HOLOGRAM (35m)', 'up', 3.6, 0],
    ['PUSAT KOMUNIKASI (28m)', 'left', 3.0, Math.PI / 2],
    ['LORONG SINGKATAN (28m)', 'right', 2.4, -Math.PI / 2],
    ['DATARAN MESEJ (Hab)', 'down', 1.8, Math.PI],
  ];

  signConfigs.forEach(([label, dir, heightY, rotY]) => {
    const signTex = createDirectionSignTexture(label, dir);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.65),
      new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
    );
    signMesh.position.y = heightY;
    signMesh.rotation.y = rotY;

    // Small mounting bracket
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 })
    );
    bracket.position.y = heightY;
    bracket.rotation.y = rotY;

    postGroup.add(signMesh);
    postGroup.add(bracket);
  });

  return postGroup;
}

/**
 * Creates the West Fantasy Bridge spanning across the canal to Pusat Komunikasi
 */
export function createWestFantasyBridge(): THREE.Group {
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(-19, 0, 8);

  // Glowing Cyan Canal Water underneath
  const canalWater = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 36),
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.45,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88,
    })
  );
  canalWater.rotation.x = -Math.PI / 2;
  canalWater.position.set(0, 0.02, 0);
  bridgeGroup.add(canalWater);

  // Arched Stone Bridge Deck
  const bridgeDeck = new THREE.Mesh(
    new THREE.BoxGeometry(9.5, 0.4, 5.0),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4, metalness: 0.5 })
  );
  bridgeDeck.position.y = 0.22;
  bridgeGroup.add(bridgeDeck);

  // Decorative Golden Runic Center Path
  const bridgeRuneStrip = new THREE.Mesh(
    new THREE.BoxGeometry(9.2, 0.04, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.6, roughness: 0.3 })
  );
  bridgeRuneStrip.position.y = 0.43;
  bridgeGroup.add(bridgeRuneStrip);

  // North & South Stone Balustrades with Glowing Cyan Runes
  for (const zOffset of [-2.4, 2.4]) {
    const balustrade = new THREE.Mesh(
      new THREE.BoxGeometry(9.5, 0.85, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    balustrade.position.set(0, 0.65, zOffset);
    bridgeGroup.add(balustrade);

    const runeBar = new THREE.Mesh(
      new THREE.BoxGeometry(9.0, 0.12, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 })
    );
    runeBar.position.set(0, 0.65, zOffset + (zOffset > 0 ? -0.18 : 0.18));
    bridgeGroup.add(runeBar);

    // 4 Corner Lantern Pedestals on Balustrades
    for (const xOffset of [-4.5, 4.5]) {
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.35, 1.3, 8),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 })
      );
      pedestal.position.set(xOffset, 0.9, zOffset);
      bridgeGroup.add(pedestal);

      const lanternGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      lanternGlow.position.set(xOffset, 1.6, zOffset);
      bridgeGroup.add(lanternGlow);
    }
  }

  // Welcome Arch at Bridge Entrance with Sign
  const archSignTex = createDirectionSignTexture('PUSAT KOMUNIKASI (MISI 02)', 'left');
  const bridgeArchSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 0.9),
    new THREE.MeshBasicMaterial({ map: archSignTex, side: THREE.DoubleSide })
  );
  bridgeArchSign.position.set(-4.5, 3.2, 0);
  bridgeArchSign.rotation.y = Math.PI / 2;
  bridgeGroup.add(bridgeArchSign);

  return bridgeGroup;
}

/**
 * Creates the full Pusat Komunikasi District at [-28, 0, 8]
 */
export function createPusatKomunikasiDistrict(): { group: THREE.Group; animatedList: AnimatedProp[] } {
  const group = new THREE.Group();
  group.position.set(-28, 0, 8);
  const animatedList: AnimatedProp[] = [];

  // 1. Polished Circular Courtyard with Cyan Wave Inlay
  const courtyard = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10.5, 0.25, 24),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.35, metalness: 0.6 })
  );
  courtyard.position.y = 0.12;
  group.add(courtyard);

  const innerCircle = new THREE.Mesh(
    new THREE.RingGeometry(1, 8.5, 24),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
  );
  innerCircle.rotation.x = -Math.PI / 2;
  innerCircle.position.y = 0.26;
  group.add(innerCircle);

  // 2. Central Satellite Relay Spire
  const centralSpire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.8, 11, 10),
    new THREE.MeshStandardMaterial({ color: 0x4338ca, metalness: 0.85, roughness: 0.25 })
  );
  centralSpire.position.set(0, 5.8, -4);
  group.add(centralSpire);

  // Satellite dish
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2.2),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2, side: THREE.DoubleSide })
  );
  dish.rotation.x = Math.PI / 3;
  dish.position.set(0, 10.5, -4);
  group.add(dish);

  // 3. Giant Curved Message Screen
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024;
  screenCanvas.height = 512;
  const sCtx = screenCanvas.getContext('2d');
  if (sCtx) {
    sCtx.fillStyle = '#0f172a';
    sCtx.fillRect(0, 0, 1024, 512);

    sCtx.strokeStyle = '#38bdf8';
    sCtx.lineWidth = 6;
    sCtx.strokeRect(10, 10, 1004, 492);

    sCtx.fillStyle = '#facc15';
    sCtx.font = '900 32px sans-serif';
    sCtx.fillText('📱 PUSAT KOMUNIKASI & PESANAN DIGITAL', 40, 60);

    // Message 1 (Polite to Teacher)
    sCtx.fillStyle = '#1e293b';
    sCtx.roundRect(40, 95, 944, 90, 18);
    sCtx.fill();
    sCtx.strokeStyle = '#34d399';
    sCtx.lineWidth = 2.5;
    sCtx.roundRect(40, 95, 944, 90, 18);
    sCtx.stroke();

    sCtx.fillStyle = '#34d399';
    sCtx.font = 'bold 22px sans-serif';
    sCtx.fillText('✔ Mesej Rasmi (Sesuai kepada Guru):', 60, 135);
    sCtx.fillStyle = '#f8fafc';
    sCtx.font = '20px sans-serif';
    sCtx.fillText('"Selamat pagi, Cikgu. Bolehkah saya bertanya tentang tugasan Bahasa Melayu semalam?"', 60, 165);

    // Message 2 (Casual warning)
    sCtx.fillStyle = '#1e293b';
    sCtx.roundRect(40, 205, 944, 90, 18);
    sCtx.fill();
    sCtx.strokeStyle = '#f43f5e';
    sCtx.lineWidth = 2.5;
    sCtx.roundRect(40, 205, 944, 90, 18);
    sCtx.stroke();

    sCtx.fillStyle = '#fb7185';
    sCtx.font = 'bold 22px sans-serif';
    sCtx.fillText('✖ Mesej Tidak Formal (Elakkan kepada Guru):', 60, 245);
    sCtx.fillStyle = '#cbd5e1';
    sCtx.font = '20px sans-serif';
    sCtx.fillText('"Cikgu, hw semalam tu mcm mana? pening la..."', 60, 275);

    // Activity Prompt
    sCtx.fillStyle = '#38bdf8';
    sCtx.font = 'bold 24px sans-serif';
    sCtx.fillText('💬 Berbual dengan Adik Amir untuk membantu memilih mesej paling berhemah!', 60, 340);
  }
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;

  const curvedScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(6.8, 3.4),
    new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.DoubleSide })
  );
  curvedScreen.position.set(0, 3.6, -3.2);
  group.add(curvedScreen);

  // 4. Interactive Digital Mail Delivery Pod
  const mailPod = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.8, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x312e81, metalness: 0.7, roughness: 0.3 })
  );
  mailPod.position.set(3.8, 1.1, 1);
  group.add(mailPod);

  // Glowing Holographic Mail Symbol
  const mailGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.9),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
  );
  mailGlow.position.set(3.8, 2.5, 1);
  group.add(mailGlow);

  // 5. Floating Message Bubbles around courtyard
  for (let i = 0; i < 4; i++) {
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 10, 10),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0xa855f7, transparent: true, opacity: 0.75 })
    );
    const ang = (i / 4) * Math.PI * 2;
    const r = 5.2;
    bubble.position.set(Math.cos(ang) * r, 2.8, Math.sin(ang) * r);
    group.add(bubble);

    animatedList.push({
      mesh: bubble,
      update: (t) => {
        bubble.position.y = 2.8 + Math.sin(t * 2 + i) * 0.35;
      },
    });
  }

  // 6. District Gateway Arch with Name Sign
  const archGroup = new THREE.Group();
  archGroup.position.set(7.5, 0, 0);
  archGroup.rotation.y = Math.PI / 2;

  const archPillarL = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 4.2, 0.6),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 })
  );
  archPillarL.position.set(-2.2, 2.1, 0);
  archGroup.add(archPillarL);

  const archPillarR = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 4.2, 0.6),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 })
  );
  archPillarR.position.set(2.2, 2.1, 0);
  archGroup.add(archPillarR);

  const archTop = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.65, 0.6),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 })
  );
  archTop.position.set(0, 4.4, 0);
  archGroup.add(archTop);

  const signTex = createDirectionSignTexture('PUSAT KOMUNIKASI', 'up');
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 0.85),
    new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
  );
  signMesh.position.set(0, 3.5, 0);
  archGroup.add(signMesh);

  group.add(archGroup);

  return { group, animatedList };
}

/**
 * Creates the East Sakura Garden and Promenade leading to Lorong Singkatan
 */
export function createEastSakuraGardenAndPromenade(): THREE.Group {
  const gardenGroup = new THREE.Group();
  gardenGroup.position.set(19, 0, 10);

  // Marble Street Pathway (Walkable from x = 14 to x = 24)
  const streetMesh = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.08, 4.8),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.35, metalness: 0.4 })
  );
  streetMesh.position.y = 0.04;
  gardenGroup.add(streetMesh);

  // Golden Inlay Lines
  for (const zOffset of [-2.2, 2.2]) {
    const goldLine = new THREE.Mesh(
      new THREE.BoxGeometry(9.8, 0.04, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 })
    );
    goldLine.position.set(0, 0.09, zOffset);
    gardenGroup.add(goldLine);
  }

  // Sakura Trees along Garden Promenade
  const sakuraOffsets = [
    [-3.5, -3.4],
    [3.5, -3.4],
    [-3.5, 3.4],
    [3.5, 3.4],
  ];

  sakuraOffsets.forEach(([sx, sz]) => {
    const tree = createSakuraTree();
    tree.position.set(sx, 0, sz);
    gardenGroup.add(tree);

    // Stone Garden Bench
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.45, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 })
    );
    bench.position.set(sx, 0.22, sz > 0 ? sz - 1.2 : sz + 1.2);
    gardenGroup.add(bench);
  });

  // Welcome Arch into Lorong Singkatan
  const archSignTex = createDirectionSignTexture('LORONG SINGKATAN (MISI 03)', 'right');
  const gardenArchSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 0.9),
    new THREE.MeshBasicMaterial({ map: archSignTex, side: THREE.DoubleSide })
  );
  gardenArchSign.position.set(4.5, 3.2, 0);
  gardenArchSign.rotation.y = -Math.PI / 2;
  gardenGroup.add(gardenArchSign);

  return gardenGroup;
}

/**
 * Creates the Cyberpunk Lorong Singkatan District at [28, 0, 10]
 */
export function createLorongSingkatanDistrict(): { group: THREE.Group; animatedList: AnimatedProp[] } {
  const group = new THREE.Group();
  group.position.set(28, 0, 10);
  const animatedList: AnimatedProp[] = [];

  // 1. Street paving
  const streetPaving = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.1, 14),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.3 })
  );
  streetPaving.position.y = 0.05;
  group.add(streetPaving);

  // 2. Gateway Arch
  const gatewayArch = new THREE.Group();
  gatewayArch.position.set(-6, 0, 0);
  gatewayArch.rotation.y = -Math.PI / 2;

  const pillarL = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 4.5, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.7 })
  );
  pillarL.position.set(-2.5, 2.25, 0);
  gatewayArch.add(pillarL);

  const pillarR = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 4.5, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.7 })
  );
  pillarR.position.set(2.5, 2.25, 0);
  gatewayArch.add(pillarR);

  const topBeam = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.7 })
  );
  topBeam.position.set(0, 4.7, 0);
  gatewayArch.add(topBeam);

  const mainSignTex = createDirectionSignTexture('LORONG SINGKATAN', 'up');
  const mainSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 1.0),
    new THREE.MeshBasicMaterial({ map: mainSignTex, side: THREE.DoubleSide })
  );
  mainSign.position.set(0, 3.6, 0);
  gatewayArch.add(mainSign);

  group.add(gatewayArch);

  // 3. Four Holographic Decode Billboards along Alley Walls
  const billboardsData = [
    { acronym: 'TBH', baku: 'SEBENARNYA', note: 'To Be Honest', x: -3.5, z: -4.8, rotY: 0 },
    { acronym: 'BRB', baku: 'AKAN KEMBALI', note: 'Be Right Back', x: 3.5, z: -4.8, rotY: 0 },
    { acronym: 'ASAP', baku: 'SEGERA', note: 'As Soon As Possible', x: -3.5, z: 4.8, rotY: Math.PI },
    { acronym: 'IDK', baku: 'TIDAK TAHU', note: 'I Do Not Know', x: 3.5, z: 4.8, rotY: Math.PI },
  ];

  billboardsData.forEach((bData, idx) => {
    const bbTex = createAcronymBillboardTexture(bData.acronym, bData.baku, bData.note);
    const bbMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 2.0),
      new THREE.MeshBasicMaterial({ map: bbTex, side: THREE.DoubleSide })
    );
    bbMesh.position.set(bData.x, 2.8, bData.z);
    bbMesh.rotation.y = bData.rotY;
    group.add(bbMesh);

    // Pillar stand
    const stand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 2.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8 })
    );
    stand.position.set(bData.x, 1.4, bData.z);
    group.add(stand);

    animatedList.push({
      mesh: bbMesh,
      update: (t) => {
        bbMesh.position.y = 2.8 + Math.sin(t * 2 + idx) * 0.1;
      },
    });
  });

  // 4. Central Decode Terminal Pod for Detektif Siber
  const decodePod = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.9, 0.8, 12),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.8, roughness: 0.3 })
  );
  decodePod.position.set(0, 0.4, 0);
  group.add(decodePod);

  const hologramPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 3.2, 12),
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.85,
    })
  );
  hologramPillar.position.set(0, 2.2, 0);
  group.add(hologramPillar);

  // Floating rotating ring
  const decodeRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.08, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  decodeRing.position.set(0, 2.5, 0);
  decodeRing.rotation.x = Math.PI / 2;
  group.add(decodeRing);

  animatedList.push({
    mesh: decodeRing,
    update: (t) => {
      decodeRing.rotation.z = t * 1.8;
      decodeRing.position.y = 2.5 + Math.sin(t * 3) * 0.15;
    },
  });

  return { group, animatedList };
}

/**
 * Creates the Grand Menara Hologram District at [0, 0, -32]
 */
export function createMenaraHologramDistrict(): { group: THREE.Group; animatedList: AnimatedProp[] } {
  const group = new THREE.Group();
  group.position.set(0, 0, -32);
  const animatedList: AnimatedProp[] = [];

  // 1. Grand Elevated Circular Royal Platform
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 13, 0.5, 32),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.7 })
  );
  platform.position.y = 0.25;
  group.add(platform);

  const concentricRing = new THREE.Mesh(
    new THREE.RingGeometry(2, 11, 32),
    new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
  );
  concentricRing.rotation.x = -Math.PI / 2;
  concentricRing.position.y = 0.51;
  group.add(concentricRing);

  // 2. Colossal 35-Meter Spire Core
  const spireBase = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 4.6, 3.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.85 })
  );
  spireBase.position.y = 2.1;
  group.add(spireBase);

  const mainShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 2.2, 32, 16),
    new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.8, roughness: 0.2 })
  );
  mainShaft.position.y = 18;
  group.add(mainShaft);

  // Spire Glowing Tip
  const spireTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 6.0, 12),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 })
  );
  spireTip.position.y = 37;
  group.add(spireTip);

  // 3. Rotating Celestial Energy Rings at different elevations
  const ringElevations = [12, 20, 28];
  ringElevations.forEach((h, idx) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.6 - idx * 0.8, 0.15, 12, 32),
      new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x38bdf8 : 0xfacc15 })
    );
    ring.position.y = h;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    animatedList.push({
      mesh: ring,
      update: (t) => {
        ring.rotation.z = t * (idx % 2 === 0 ? 1.2 : -1.0);
        ring.position.y = h + Math.sin(t * 2 + idx) * 0.3;
      },
    });
  });

  // 4. Giant 10-Meter Curved Broadcast Billboard
  const bTex = createBroadcastBillboardTexture();
  const broadcastScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 5.2),
    new THREE.MeshBasicMaterial({ map: bTex, side: THREE.DoubleSide })
  );
  broadcastScreen.position.set(0, 14, 2.8);
  group.add(broadcastScreen);

  // 5. Broadcast Horns / Transmitters
  for (const ang of [-Math.PI / 4, Math.PI / 4]) {
    const horn = new THREE.Mesh(
      new THREE.ConeGeometry(0.6, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 })
    );
    horn.rotation.x = Math.PI / 2;
    horn.rotation.y = ang;
    horn.position.set(Math.sin(ang) * 2.2, 18, Math.cos(ang) * 2.2);
    group.add(horn);
  }

  // 6. District Gateway Arch facing South towards Dataran Mesej
  const archGroup = new THREE.Group();
  archGroup.position.set(0, 0, 10);

  const pillarL = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 4.5, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 })
  );
  pillarL.position.set(-3.2, 2.25, 0);
  archGroup.add(pillarL);

  const pillarR = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 4.5, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 })
  );
  pillarR.position.set(3.2, 2.25, 0);
  archGroup.add(pillarR);

  const archTop = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 })
  );
  archTop.position.set(0, 4.7, 0);
  archGroup.add(archTop);

  const signTex = createDirectionSignTexture('MENARA HOLOGRAM', 'up');
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 0.95),
    new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
  );
  signMesh.position.set(0, 3.6, 0);
  archGroup.add(signMesh);

  group.add(archGroup);

  return { group, animatedList };
}

/**
 * Returns solid collision boxes for Kota Media Sosial (expanded semi-open world)
 * Carefully configured so all 4 districts and their connecting bridges/avenues are 100% walkable!
 */
export function getKotaMediaColliders(): CollisionBox[] {
  return [
    // 1. Central Pavilion Fountain Core (walkable all around)
    { minX: -3.6, maxX: 3.6, minZ: -14.8, maxZ: -9.2 },

    // 2. West Colonnade North Wing (leaves Bridge at z: 6 to 10 open!)
    { minX: -26, maxX: -16, minZ: -24, maxZ: 5 },
    // 2b. West Colonnade South Wing (leaves Bridge at z: 6 to 10 open!)
    { minX: -26, maxX: -16, minZ: 11, maxZ: 24 },

    // 3. East Colonnade North Wing (leaves Sakura Avenue at z: 7 to 13 open!)
    { minX: 16, maxX: 26, minZ: -24, maxZ: 6 },
    // 3b. East Colonnade South Wing (leaves Sakura Avenue at z: 7 to 13 open!)
    { minX: 16, maxX: 26, minZ: 14, maxZ: 24 },

    // 4. North Palace Spire Core Base (leaves Royal Avenue at x: -6 to 6 open!)
    { minX: -3.8, maxX: 3.8, minZ: -35.5, maxZ: -32.5 },

    // 5. West Canal Water barriers (North & South of bridge)
    { minX: -24, maxX: -14, minZ: -22, maxZ: 5.5 },
    { minX: -24, maxX: -14, minZ: 10.5, maxZ: 24 },

    // 6. Outer World Solid Perimeter Boundaries (Expanded to 54m)
    { minX: -65, maxX: 65, minZ: -65, maxZ: -48 }, // North outer boundary
    { minX: -65, maxX: 65, minZ: 38, maxZ: 65 },   // South outer boundary
    { minX: -65, maxX: -44, minZ: -65, maxZ: 65 }, // West outer boundary
    { minX: 44, maxX: 65, minZ: -65, maxZ: 65 },  // East outer boundary
  ];
}

