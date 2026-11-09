/**
 * BAKUWIRA: Region 5 - Istana Wira Bahasa Procedural 3D Environment Builder
 * Matches the official illustration: istana_wira_bahasa_72d8e7c2.jpeg
 * 
 * Locations:
 * 1. Dewan Diraja ([0, 0, 0]) - Central royal marble plaza, feather quill fountain, rotating gold rings
 * 2. Galeri Kristal ([-24, 0, 8]) - West crystal cloister, hovering crystal shards, stained glass
 * 3. Pentas Pengucapan ([24, 0, 10]) - East royal oratory stage, golden eagle rostrum, banners
 * 4. Balairung Bahasa ([0, 0, -28]) - North Imperial Palace, grand staircases, golden spires
 * 5. Cabaran Penamat ([0, 0, -38]) - Deep North Sanctum, Floating Crown of Bakuwira
 */

import * as THREE from 'three';
import { AnimatedProp, CollisionBox } from './kotaMediaProcedural';

export function getIstanaColliders(): CollisionBox[] {
  return [
    // North Imperial Palace & Balairung Bahasa
    { minX: -26, maxX: 26, minZ: -46, maxZ: -20 },
    // West Galeri Kristal
    { minX: -36, maxX: -18, minZ: 0, maxZ: 18 },
    // East Pentas Pengucapan
    { minX: 18, maxX: 36, minZ: 2, maxZ: 20 },
    // South Terrace Wall
    { minX: -38, maxX: 38, minZ: 26, maxZ: 32 },
    // Boundaries
    { minX: -44, maxX: -38, minZ: -48, maxZ: 30 },
    { minX: 38, maxX: 44, minZ: -48, maxZ: 30 },
  ];
}

/**
 * Creates Royal Marble & Gold Inlaid Floor Texture for Istana Wira Bahasa
 */
export function createIstanaFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Polished ivory / royal purple marble base
  const grad = ctx.createRadialGradient(512, 512, 40, 512, 512, 512);
  grad.addColorStop(0, '#3b0764'); // Imperial purple
  grad.addColorStop(0.6, '#2e1065');
  grad.addColorStop(1, '#0f051d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Marble tile grid lines
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.2)';
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

  // Concentric Imperial Gold Rings & 8-Point Star
  ctx.save();
  ctx.translate(512, 512);

  const drawRing = (r: number, color: string, w: number, dash = false) => {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    if (dash) ctx.setLineDash([16, 12]);
    else ctx.setLineDash([]);
    ctx.stroke();
  };

  drawRing(460, 'rgba(250, 204, 21, 0.85)', 4);
  drawRing(360, 'rgba(216, 180, 254, 0.6)', 3, true);
  drawRing(260, 'rgba(250, 204, 21, 0.9)', 3);
  drawRing(160, 'rgba(250, 204, 21, 1)', 5);

  // Radiant 8-Point Imperial Crown Star
  for (let i = 0; i < 8; i++) {
    ctx.rotate((Math.PI * 2) / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(18, 60);
    ctx.lineTo(0, 140);
    ctx.lineTo(-18, 60);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#facc15' : '#fef08a';
    ctx.fill();
  }

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Builds the entire Region 5 environment
 */
export function buildIstanaEnvironment(
  envGroup: THREE.Group,
  animatedObjects: { mesh: THREE.Object3D; update: (t: number) => void }[]
) {
  const whiteMarble = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0.25 });
  const imperialGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.18, metalness: 0.92 });
  const royalPurple = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.35, metalness: 0.65 });
  const crystalCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.88 });
  const crystalMagenta = new THREE.MeshBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.85 });

  // 1. Royal Marble Floor
  const floorTex = createIstanaFloorTexture();
  const floorGeo = new THREE.PlaneGeometry(60, 60, 16, 16);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.25, metalness: 0.35 });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0.03, 0);
  envGroup.add(floorMesh);

  // 2. LOCATION 1: DEWAN DIRAJA ([0, 0, 0])
  // Celestial Feather Quill Fountain with Floating Rotating Golden Rings
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, 0, 0);

  const basin = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.6, 0.9, 32), whiteMarble);
  basin.position.y = 0.45;
  fountainGroup.add(basin);

  const basinRim = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.15, 8, 32), imperialGold);
  basinRim.rotation.x = Math.PI / 2;
  basinRim.position.y = 0.9;
  fountainGroup.add(basinRim);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.09, 10, 32), imperialGold);
  ring1.position.y = 2.4;
  fountainGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.09, 10, 32), imperialGold);
  ring2.position.y = 2.4;
  ring2.rotation.x = Math.PI / 3;
  fountainGroup.add(ring2);

  const featherQuill = new THREE.Mesh(new THREE.ConeGeometry(0.28, 2.4, 6), imperialGold);
  featherQuill.position.y = 2.4;
  fountainGroup.add(featherQuill);

  envGroup.add(fountainGroup);
  animatedObjects.push({
    mesh: fountainGroup,
    update: (t) => {
      ring1.rotation.y = t * 0.9;
      ring2.rotation.z = -t * 0.7;
      featherQuill.position.y = 2.4 + Math.sin(t * 2) * 0.18;
      featherQuill.rotation.y = t * 1.5;
    },
  });

  // 3. LOCATION 4: BALAIRUNG BAHASA ([0, 0, -28])
  // Grand Imperial Palace Facade with Soaring Crystal Spires & Throne Canopy
  const palace = new THREE.Group();
  palace.position.set(0, 0, -28);

  const palaceHall = new THREE.Mesh(new THREE.BoxGeometry(46, 16, 15), whiteMarble);
  palaceHall.position.y = 8;
  palace.add(palaceHall);

  // Grand Symmetrical Entrance Staircase
  for (let s = 0; s < 7; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(16 + (7 - s) * 0.9, 0.35, 1.2), whiteMarble);
    step.position.set(0, s * 0.35 + 0.175, 8.8 + (7 - s) * 0.75);
    palace.add(step);
  }

  // Central Grand Spire
  const centralSpireBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.2, 14, 16), whiteMarble);
  centralSpireBase.position.set(0, 23, 0);
  palace.add(centralSpireBase);

  const centralSpireCone = new THREE.Mesh(new THREE.ConeGeometry(4.0, 16, 16), imperialGold);
  centralSpireCone.position.set(0, 38, 0);
  palace.add(centralSpireCone);

  // Crown Starburst Crystal Beacon
  const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), crystalCyan);
  beacon.position.set(0, 47, 0);
  palace.add(beacon);

  // Flanking Towers
  [-18, -9, 9, 18].forEach((tx, idx) => {
    const h = idx === 1 || idx === 2 ? 28 : 24;
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, h, 14), whiteMarble);
    tower.position.set(tx, h / 2 + 2, 2.5);
    palace.add(tower);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(2.8, 9, 14), imperialGold);
    spire.position.set(tx, h + 6.5, 2.5);
    palace.add(spire);

    const crystalTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), crystalMagenta);
    crystalTip.position.set(tx, h + 11.5, 2.5);
    palace.add(crystalTip);
  });

  envGroup.add(palace);

  // 4. LOCATION 5: CABARAN PENAMAT ([0, 0, -38])
  // Deep North Sanctum: Floating Crown of Bakuwira
  const crownSanctum = new THREE.Group();
  crownSanctum.position.set(0, 0, -38);

  // Elevated Dais
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.6, 1.2, 24), whiteMarble);
  dais.position.y = 0.6;
  crownSanctum.add(dais);

  // Floating Golden Crown of Bakuwira
  const crown = new THREE.Group();
  crown.position.set(0, 3.8, 0);

  const crownBand = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.3, 0.4, 16, 1, true), imperialGold);
  crown.add(crownBand);

  // Crown spikes & jewels
  for (let p = 0; p < 8; p++) {
    const ang = (p * Math.PI * 2) / 8;
    const peak = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 4), imperialGold);
    peak.position.set(Math.cos(ang) * 1.35, 0.45, Math.sin(ang) * 1.35);
    crown.add(peak);

    const gem = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), crystalCyan);
    gem.position.set(Math.cos(ang) * 1.4, 0, Math.sin(ang) * 1.4);
    crown.add(gem);
  }

  crownSanctum.add(crown);
  envGroup.add(crownSanctum);

  animatedObjects.push({
    mesh: crown,
    update: (t) => {
      crown.rotation.y = t * 0.8;
      crown.position.y = 3.8 + Math.sin(t * 2.5) * 0.22;
    },
  });

  // 5. LOCATION 2: GALERI KRISTAL ([-24, 0, 8])
  // West Crystal Cloister with Hovering Prism Shards
  const crystalGallery = new THREE.Group();
  crystalGallery.position.set(-24, 0, 8);

  const gallHall = new THREE.Mesh(new THREE.BoxGeometry(16, 12, 14), whiteMarble);
  gallHall.position.y = 6;
  crystalGallery.add(gallHall);

  const gallRoof = new THREE.Mesh(new THREE.ConeGeometry(13, 6, 4), imperialGold);
  gallRoof.position.y = 15;
  gallRoof.rotation.y = Math.PI / 4;
  crystalGallery.add(gallRoof);

  // Hovering Crystal Shards in front of gallery
  const crystalColors = [0x38bdf8, 0xd946ef, 0xfacc15];
  const shards: THREE.Mesh[] = [];
  crystalColors.forEach((col, idx) => {
    const shard = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.88 })
    );
    shard.position.set(-1.6 + idx * 1.6, 2.8, 9.5);
    crystalGallery.add(shard);
    shards.push(shard);
  });

  envGroup.add(crystalGallery);
  animatedObjects.push({
    mesh: crystalGallery,
    update: (t) => {
      shards.forEach((s, idx) => {
        s.rotation.y = t * (0.8 + idx * 0.3);
        s.position.y = 2.8 + Math.sin(t * 2.5 + idx * 1.2) * 0.25;
      });
    },
  });

  // 6. LOCATION 3: PENTAS PENGUCAPAN ([24, 0, 10])
  // East Royal Oratory Stage with Golden Eagle Rostrum & Royal Banners
  const oratoryStage = new THREE.Group();
  oratoryStage.position.set(24, 0, 10);

  const stageFloor = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, 14), whiteMarble);
  stageFloor.position.y = 0.6;
  oratoryStage.add(stageFloor);

  // Golden Eagle Rostrum Podiums
  const podium = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 2.2, 8), imperialGold);
  podium.position.set(0, 1.7, 4);
  oratoryStage.add(podium);

  // Grand Throne / Orator Backdrop
  const backdrop = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 1.2), royalPurple);
  backdrop.position.set(0, 4.6, -5);
  oratoryStage.add(backdrop);

  // Royal Bakuwira Gold Crest on backdrop
  const backdropCrest = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 0), imperialGold);
  backdropCrest.position.set(0, 6.5, -4.3);
  oratoryStage.add(backdropCrest);

  envGroup.add(oratoryStage);

  // 7. Golden Palace Street Lanterns
  for (const [lx, lz] of [
    [-12, -10],
    [12, -10],
    [-12, 14],
    [12, 14],
    [-20, 0],
    [20, 0],
  ]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5.5, 8), whiteMarble);
    post.position.set(lx, 2.75, lz);
    envGroup.add(post);

    const lantern = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    lantern.position.set(lx, 5.7, lz);
    envGroup.add(lantern);
  }
}
