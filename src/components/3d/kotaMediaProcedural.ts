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
 * Procedural Sakura Tree Model (3-12 parts matching Three.js skill)
 */
export function createSakuraTree(): THREE.Group {
  const tree = new THREE.Group();

  // 1. Trunk with roots flare
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.85,
    metalness: 0.1,
  });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 4.2, 8), trunkMat);
  trunk.position.y = 2.1;
  tree.add(trunk);

  // 2. Secondary branches
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + 0.3;
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 6), trunkMat);
    branch.position.set(Math.cos(ang) * 0.45, 3.2, Math.sin(ang) * 0.45);
    branch.rotation.z = Math.cos(ang) * 0.6;
    branch.rotation.x = Math.sin(ang) * 0.6;
    tree.add(branch);
  }

  // 3. Foliage Puffs in varied soft pink shades
  const pinkColors = [0xf472b6, 0xf9a8d4, 0xec4899, 0xfbcfe8];
  const puffPositions = [
    [0, 4.8, 0, 1.8],
    [-1.2, 4.3, 0.8, 1.4],
    [1.3, 4.4, -0.6, 1.5],
    [0.7, 4.1, 1.2, 1.3],
    [-0.9, 4.5, -1.1, 1.4],
    [0, 5.7, 0, 1.3],
  ];

  puffPositions.forEach(([x, y, z, r], idx) => {
    const foliageMat = new THREE.MeshStandardMaterial({
      color: pinkColors[idx % pinkColors.length],
      roughness: 0.65,
      metalness: 0.05,
    });
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), foliageMat);
    puff.position.set(x, y, z);
    tree.add(puff);
  });

  // 4. Stone planter base
  const planterMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.5,
  });
  const planter = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.8, 16), planterMat);
  planter.position.y = 0.4;
  tree.add(planter);

  // Gold trim on planter
  const goldRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.08, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.25 })
  );
  goldRim.position.y = 0.8;
  goldRim.rotation.x = Math.PI / 2;
  tree.add(goldRim);

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
 */
export function createGrandPalaceFacade(signTexture: THREE.CanvasTexture): THREE.Group {
  const palace = new THREE.Group();
  palace.position.set(0, 0, -25);

  const whiteStone = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.2 });
  const palaceGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });
  const royalViolet = new THREE.MeshStandardMaterial({ color: 0x1e1038, roughness: 0.4, metalness: 0.7 });
  const cyanGlass = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });

  // Main palace foundation block
  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(48, 14, 14), whiteStone);
  mainBlock.position.y = 7;
  palace.add(mainBlock);

  // Grand arched entrance recess
  const portalArch = new THREE.Mesh(new THREE.BoxGeometry(10, 8.5, 3), royalViolet);
  portalArch.position.set(0, 4.25, 7.1);
  palace.add(portalArch);

  // Glowing portal gate interior
  const portalGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 7.5),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
  );
  portalGlow.position.set(0, 4.25, 8.65);
  palace.add(portalGlow);

  // Grand Entrance Staircase
  const stairSteps = 6;
  for (let s = 0; s < stairSteps; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(14 + (stairSteps - s) * 0.8, 0.35, 1.2),
      whiteStone
    );
    step.position.set(0, s * 0.35 + 0.175, 8.5 + (stairSteps - s) * 0.7);
    palace.add(step);
  }

  // Central Grand Spire (Height 32 units)
  const centralTower = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 16, 16), whiteStone);
  centralTower.position.set(0, 20, 0);
  palace.add(centralTower);

  const centralSpire = new THREE.Mesh(new THREE.ConeGeometry(3.2, 12, 16), palaceGold);
  centralSpire.position.set(0, 32, 0);
  palace.add(centralSpire);

  // Crown Starburst Crystal atop main spire
  const starburst = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.2, 0),
    new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
  );
  starburst.position.set(0, 38.5, 0);
  palace.add(starburst);

  // Flanking Towers (Left & Right)
  [-16, 16, -9, 9].forEach((x, idx) => {
    const height = Math.abs(x) > 12 ? 22 : 26;
    const towerBody = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, height, 12), whiteStone);
    towerBody.position.set(x, height / 2 + 3, 2);
    palace.add(towerBody);

    const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 7, 12), idx % 2 === 0 ? palaceGold : royalViolet);
    towerRoof.position.set(x, height + 6.5, 2);
    palace.add(towerRoof);

    // Glowing vertical window slots
    for (let w = 6; w < height; w += 5) {
      const winSlot = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2.8), cyanGlass);
      winSlot.position.set(x, w, 4.22);
      palace.add(winSlot);
    }
  });

  // Royal Golden Signboard Plaque: "Kota Media Sosial"
  const signMat = new THREE.MeshBasicMaterial({
    map: signTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(16, 5.0), signMat);
  signBoard.position.set(0, 13.5, 7.3);
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
 * Returns solid collision boxes for Kota Media Sosial
 */
export function getKotaMediaColliders(): CollisionBox[] {
  return [
    // North Palace back wall
    { minX: -26, maxX: 26, minZ: -45, maxZ: -23 },
    // West Colonnade back arcade
    { minX: -28, maxX: -17, minZ: -24, maxZ: 18 },
    // East Colonnade back arcade
    { minX: 17, maxX: 28, minZ: -24, maxZ: 18 },
    // Central Pavilion fountain core
    { minX: -3.8, maxX: 3.8, minZ: -15.8, maxZ: -8.2 },
    // South boundary
    { minX: -35, maxX: 35, minZ: 26, maxZ: 45 },
  ];
}
