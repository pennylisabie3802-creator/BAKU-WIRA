/**
 * BAKUWIRA: Region 4 - Kampung Komunikasi Procedural 3D Environment Builder
 * Matches the official illustration: kampung_komunikasi_16db432b.jpeg
 * 
 * Locations:
 * 1. Sekolah Harmoni ([0, 0, 0]) - Traditional wooden rural schoolhouse, veranda, bell tower
 * 2. Pasar Komuniti ([-24, 0, 8]) - Riverside market stalls, colorful canopies, wooden jetty
 * 3. Balai Penduduk ([24, 0, 10]) - Open-air timber community pavilion, gong stand, benches
 * 4. Pentas Bicara ([0, 0, -28]) - Riverside speech forum stage, acoustic shell, microphone
 */

import * as THREE from 'three';
import { AnimatedProp, CollisionBox } from './kotaMediaProcedural';

export function getKampungColliders(): CollisionBox[] {
  return [
    // North Pentas Bicara & River bank
    { minX: -26, maxX: 26, minZ: -38, maxZ: -20 },
    // West Pasar Komuniti
    { minX: -36, maxX: -18, minZ: 0, maxZ: 18 },
    // East Balai Penduduk
    { minX: 18, maxX: 36, minZ: 2, maxZ: 20 },
    // River Canal Boundaries
    { minX: -38, maxX: 38, minZ: 26, maxZ: 32 },
    // Village Boundaries
    { minX: -44, maxX: -38, minZ: -40, maxZ: 30 },
    { minX: 38, maxX: 44, minZ: -40, maxZ: 30 },
  ];
}

/**
 * Creates Tropical Grass & Earth Terrain Texture for Kampung Komunikasi
 */
export function createKampungFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Lush tropical grass green
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 0, 1024, 1024);

  // Winding dirt pathways and river bank
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  // Central village road
  ctx.arc(512, 512, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(440, 0, 144, 1024);
  ctx.fillRect(0, 440, 1024, 144);

  // Tropical floral flecks (hibiscus red, frangipani yellow)
  for (let i = 0; i < 80; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    ctx.beginPath();
    ctx.arc(rx, ry, 6, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : '#fef08a';
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Creates a tropical palm tree with curved trunk and fronds
 */
function createPalmTree(x: number, z: number): THREE.Group {
  const palm = new THREE.Group();
  palm.position.set(x, 0, z);

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const frondMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6, side: THREE.DoubleSide });

  // Curved segmented trunk
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 6.5, 8), trunkMat);
  trunk.position.set(0.2, 3.2, 0);
  trunk.rotation.z = -0.08;
  palm.add(trunk);

  // 6 Palm Fronds
  for (let f = 0; f < 6; f++) {
    const ang = (f * Math.PI * 2) / 6;
    const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 3.2), frondMat);
    frond.position.set(Math.cos(ang) * 1.2, 6.4, Math.sin(ang) * 1.2);
    frond.rotation.y = -ang + Math.PI / 2;
    frond.rotation.x = 0.55;
    palm.add(frond);
  }

  // Coconuts cluster
  const nutMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
  for (let c = 0; c < 3; c++) {
    const nut = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), nutMat);
    nut.position.set(Math.cos(c * 2) * 0.35, 6.1, Math.sin(c * 2) * 0.35);
    palm.add(nut);
  }

  return palm;
}

/**
 * Builds the entire Region 4 environment
 */
export function buildKampungEnvironment(
  envGroup: THREE.Group,
  animatedObjects: { mesh: THREE.Object3D; update: (t: number) => void }[]
) {
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.85 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const roofThatch = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.95 });
  const waterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.82 });
  const warmLampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  // 1. Terrain Ground
  const floorTex = createKampungFloorTexture();
  const floorGeo = new THREE.PlaneGeometry(60, 60, 16, 16);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8, metalness: 0.05 });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0.03, 0);
  envGroup.add(floorMesh);

  // 2. Winding River Canal on South Border (z = 24 to 30)
  const riverGeo = new THREE.PlaneGeometry(60, 8);
  const riverMesh = new THREE.Mesh(riverGeo, waterMat);
  riverMesh.rotation.x = -Math.PI / 2;
  riverMesh.position.set(0, 0.08, 27);
  envGroup.add(riverMesh);

  // Wooden Arched Footbridge over the river
  const bridge = new THREE.Group();
  bridge.position.set(0, 0.2, 27);

  const bridgePlank = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.25, 9), darkWood);
  bridge.add(bridgePlank);

  for (let bx = -2.1; bx <= 2.1; bx += 4.2) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.1, 9), timberMat);
    rail.position.set(bx, 0.7, 0);
    bridge.add(rail);
  }
  envGroup.add(bridge);

  // 3. LOCATION 1: SEKOLAH HARMONI ([0, 0, 0])
  // Traditional Wooden Schoolhouse with Veranda and Bell Tower
  const school = new THREE.Group();
  school.position.set(0, 0, 0);

  // Stilts
  for (const sx of [-4.5, -1.5, 1.5, 4.5]) {
    for (const sz of [-3, 3]) {
      const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.2, 8), darkWood);
      stilt.position.set(sx, 0.6, sz);
      school.add(stilt);
    }
  }

  // School Hall Body
  const schoolHall = new THREE.Mesh(new THREE.BoxGeometry(11, 4.5, 7.5), timberMat);
  schoolHall.position.y = 3.4;
  school.add(schoolHall);

  // Pitched Rumah Limas Roof
  const schoolRoof = new THREE.Mesh(new THREE.ConeGeometry(8.5, 4.2, 4), roofThatch);
  schoolRoof.position.y = 7.7;
  schoolRoof.rotation.y = Math.PI / 4;
  school.add(schoolRoof);

  // School Bell Tower
  const bellTower = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 3, 6), darkWood);
  bellTower.position.set(0, 10.5, 0);
  school.add(bellTower);

  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 }));
  bell.position.set(0, 10.2, 0);
  school.add(bell);

  // Front Veranda
  const veranda = new THREE.Mesh(new THREE.BoxGeometry(9, 0.25, 3), darkWood);
  veranda.position.set(0, 1.2, 4.5);
  school.add(veranda);

  envGroup.add(school);

  // 4. LOCATION 4: PENTAS BICARA ([0, 0, -28])
  // Riverside Public Forum Amphitheater with Acoustic Wooden Shell Stage
  const stageGroup = new THREE.Group();
  stageGroup.position.set(0, 0, -28);

  const stageBase = new THREE.Mesh(new THREE.BoxGeometry(18, 1.4, 12), darkWood);
  stageBase.position.y = 0.7;
  stageGroup.add(stageBase);

  // Curved acoustic wooden canopy shell
  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 8, 16, 1, true, 0, Math.PI),
    timberMat
  );
  shell.rotation.z = Math.PI / 2;
  shell.position.set(0, 5.5, -4);
  stageGroup.add(shell);

  // Vintage Microphone on stand at center stage
  const micStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.8, 6), darkWood);
  micStand.position.set(0, 2.3, 0);
  stageGroup.add(micStand);

  const micHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 })
  );
  micHead.position.set(0, 3.2, 0);
  stageGroup.add(micHead);

  // Benches for forum attendees
  for (const bx of [-5, 0, 5]) {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.6, 0.8), timberMat);
    bench.position.set(bx, 1.8, 4.5);
    stageGroup.add(bench);
  }

  envGroup.add(stageGroup);

  // 5. LOCATION 2: PASAR KOMUNITI ([-24, 0, 8])
  // Riverside Marketplace with Colorful Fabric Stalls & Fruit Baskets
  const marketGroup = new THREE.Group();
  marketGroup.position.set(-24, 0, 8);

  const stallColors = [0xef4444, 0xfacc15, 0x3b82f6];
  for (let s = -4; s <= 4; s += 4) {
    const stall = new THREE.Group();
    stall.position.set(s, 0, 0);

    const table = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 2), darkWood);
    table.position.y = 0.7;
    stall.add(table);

    // Striped Awning
    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.2, 2.6),
      new THREE.MeshStandardMaterial({ color: stallColors[Math.abs(s / 4)] || 0xef4444, roughness: 0.5 })
    );
    awning.position.set(0, 2.6, 0);
    awning.rotation.x = 0.15;
    stall.add(awning);

    marketGroup.add(stall);
  }

  envGroup.add(marketGroup);

  // 6. LOCATION 3: BALAI PENDUDUK ([24, 0, 10])
  // Open-air timber Balai Raya pavilion with hanging pelita lanterns & gong
  const balaiGroup = new THREE.Group();
  balaiGroup.position.set(24, 0, 10);

  const balaiPlatform = new THREE.Mesh(new THREE.BoxGeometry(14, 1.0, 12), darkWood);
  balaiPlatform.position.y = 0.5;
  balaiGroup.add(balaiPlatform);

  // 6 Pillars
  for (const px of [-5.5, 0, 5.5]) {
    for (const pz of [-4.5, 4.5]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 4.5, 8), timberMat);
      pillar.position.set(px, 3.25, pz);
      balaiGroup.add(pillar);
    }
  }

  // Woven Bamboo Roof
  const balaiRoof = new THREE.Mesh(new THREE.ConeGeometry(11, 4.5, 4), roofThatch);
  balaiRoof.position.y = 7.7;
  balaiRoof.rotation.y = Math.PI / 4;
  balaiGroup.add(balaiRoof);

  // Traditional Village Gong Stand
  const gongStand = new THREE.Group();
  gongStand.position.set(0, 1.0, 0);

  const gongRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.08, 8, 20), darkWood);
  gongRing.position.y = 1.6;
  gongStand.add(gongRing);

  const gongPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 })
  );
  gongPlate.rotation.x = Math.PI / 2;
  gongPlate.position.y = 1.6;
  gongStand.add(gongPlate);

  balaiGroup.add(gongStand);
  envGroup.add(balaiGroup);

  // 7. Tropical Palm Groves
  const palmCoords = [
    [-16, -16],
    [16, -16],
    [-28, -6],
    [28, -4],
    [-12, 18],
    [14, 18],
  ];
  palmCoords.forEach(([px, pz]) => {
    envGroup.add(createPalmTree(px, pz));
  });
}
