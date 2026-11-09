/**
 * BAKUWIRA: Region 3 - Bengkel Bahasa Melayu Procedural 3D Environment Builder
 * Matches the official illustration: bengkel_bahasa_melayu_643cfd3b.jpeg
 * 
 * Locations:
 * 1. Mesin Susun Ayat ([0, 0, 0]) - Central magical sentence assembler, rotating cogs, letter conveyor
 * 2. Dewan Penulis ([-24, 0, 8]) - West scribes' drafting hall, scroll racks, calligraphy desks
 * 3. Perpustakaan Kosa Kata ([24, 0, 10]) - East vocabulary archive, cedar shelves, golden book podium
 * 4. Taman Pena ([0, 0, -28]) - North Quill Garden, inkwell fountain, school noticeboards
 */

import * as THREE from 'three';
import { AnimatedProp, CollisionBox } from './kotaMediaProcedural';

export function getBengkelColliders(): CollisionBox[] {
  return [
    // North Workshop & Taman Pena Hall
    { minX: -24, maxX: 24, minZ: -38, maxZ: -20 },
    // West Dewan Penulis
    { minX: -36, maxX: -18, minZ: 0, maxZ: 18 },
    // East Perpustakaan Kosa Kata
    { minX: 18, maxX: 36, minZ: 2, maxZ: 20 },
    // South Wall & Entrance
    { minX: -38, maxX: 38, minZ: 26, maxZ: 32 },
    // Boundaries
    { minX: -44, maxX: -38, minZ: -40, maxZ: 30 },
    { minX: 38, maxX: 44, minZ: -40, maxZ: 30 },
  ];
}

/**
 * Creates Timber Workshop Floorboards Canvas Texture
 */
export function createBengkelFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm cedar / oak plank base
  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, 0, 1024, 1024);

  // Horizontal plank seams
  const plankH = 64;
  ctx.strokeStyle = '#1c0a00';
  ctx.lineWidth = 3;
  for (let y = 0; y <= 1024; y += plankH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // Staggered vertical plank joints
    const shift = (y / plankH) % 2 === 0 ? 0 : 128;
    for (let x = shift; x <= 1024; x += 256) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + plankH);
      ctx.stroke();
    }
  }

  // Golden Gear & Quill Insignia at center
  ctx.save();
  ctx.translate(512, 512);

  // Gear ring
  ctx.beginPath();
  ctx.arc(0, 0, 140, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Gear teeth
  for (let t = 0; t < 12; t++) {
    const ang = (t * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.arc(Math.cos(ang) * 140, Math.sin(ang) * 140, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.fill();
  }

  // Crossing Quills
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-70, -70);
  ctx.lineTo(70, 70);
  ctx.moveTo(70, -70);
  ctx.lineTo(-70, 70);
  ctx.stroke();

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Builds the entire Region 3 environment
 */
export function buildBengkelEnvironment(
  envGroup: THREE.Group,
  animatedObjects: { mesh: THREE.Object3D; update: (t: number) => void }[]
) {
  const warmTimber = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85, metalness: 0.1 });
  const darkOak = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9, metalness: 0.1 });
  const brassMetal = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.88 });
  const copperMetal = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3, metalness: 0.85 });
  const warmLanternMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const greenClothMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.6 });

  // 1. Timber Floor
  const floorTex = createBengkelFloorTexture();
  const floorGeo = new THREE.PlaneGeometry(60, 60, 16, 16);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.6, metalness: 0.2 });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0.03, 0);
  envGroup.add(floorMesh);

  // 2. LOCATION 1: MESIN SUSUN AYAT ([0, 0, 0])
  // Giant Animated Sentence Assembler Foundry with Rotating Cogs & Alphabet Rollers
  const assemblerGroup = new THREE.Group();
  assemblerGroup.position.set(0, 0, 0);

  // Stone/Iron Forge Base
  const forgeBase = new THREE.Mesh(
    new THREE.BoxGeometry(7, 1.2, 5.5),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.5 })
  );
  forgeBase.position.y = 0.6;
  assemblerGroup.add(forgeBase);

  // Brass Word-Stamper Pistons (Left & Right)
  const pistonL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 8), brassMetal);
  pistonL.position.set(-2.2, 2.4, 0);
  assemblerGroup.add(pistonL);

  const pistonR = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 8), brassMetal);
  pistonR.position.set(2.2, 2.4, 0);
  assemblerGroup.add(pistonR);

  // Large Central Gear with Word Cogs
  const mainGear = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.4, 16), brassMetal);
  mainGear.rotation.x = Math.PI / 2;
  mainGear.position.set(0, 3.4, 0.5);
  assemblerGroup.add(mainGear);

  // Smaller Secondary Meshing Gear
  const subGear = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.35, 12), copperMetal);
  subGear.rotation.x = Math.PI / 2;
  subGear.position.set(2.5, 5.2, 0.5);
  assemblerGroup.add(subGear);

  // Steam exhaust pipes
  for (const px of [-1.5, 1.5]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 4.5, 8), copperMetal);
    pipe.position.set(px, 3.5, -1.8);
    assemblerGroup.add(pipe);
  }

  // Glowing Mana Foundry Pit at base
  const firePit = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.2, 2.8),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  );
  firePit.position.set(0, 1.22, 0);
  assemblerGroup.add(firePit);

  envGroup.add(assemblerGroup);
  animatedObjects.push({
    mesh: assemblerGroup,
    update: (t) => {
      mainGear.rotation.z = t * 0.7;
      subGear.rotation.z = -t * 1.2;
      pistonL.position.y = 2.4 + Math.sin(t * 3.5) * 0.25;
      pistonR.position.y = 2.4 + Math.sin(t * 3.5 + Math.PI) * 0.25;
    },
  });

  // 3. LOCATION 4: TAMAN PENA ([0, 0, -28])
  // North Workshop Facade & Landscaped Quill Garden with Inkwell Fountain
  const northHall = new THREE.Group();
  northHall.position.set(0, 0, -28);

  const hallBody = new THREE.Mesh(new THREE.BoxGeometry(42, 14, 14), warmTimber);
  hallBody.position.y = 7;
  northHall.add(hallBody);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(28, 7, 4), darkOak);
  roof.position.y = 17.5;
  roof.rotation.y = Math.PI / 4;
  northHall.add(roof);

  // Giant Rotating Roof Clockwork Book Cog
  const roofCog = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.6, 16), brassMetal);
  roofCog.rotation.x = Math.PI / 2;
  roofCog.position.set(0, 16, 7.3);
  northHall.add(roofCog);

  // Grand Entrance Portal
  const portal = new THREE.Mesh(new THREE.BoxGeometry(9, 8.5, 2), darkOak);
  portal.position.set(0, 4.25, 7.1);
  northHall.add(portal);

  const portalGlow = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 7.5), warmLanternMat);
  portalGlow.position.set(0, 4.25, 8.12);
  northHall.add(portalGlow);

  // Stone Inkwell Fountain in courtyard garden
  const fountain = new THREE.Group();
  fountain.position.set(0, 0, 13);

  const inkBasin = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 0.8, 16), darkOak);
  inkBasin.position.y = 0.4;
  fountain.add(inkBasin);

  const goldenQuill = new THREE.Mesh(new THREE.ConeGeometry(0.25, 3.2, 6), brassMetal);
  goldenQuill.position.set(0, 2.6, 0);
  goldenQuill.rotation.z = 0.2;
  fountain.add(goldenQuill);

  northHall.add(fountain);
  envGroup.add(northHall);

  animatedObjects.push({
    mesh: roofCog,
    update: (t) => {
      roofCog.rotation.z = t * 0.45;
      goldenQuill.position.y = 2.6 + Math.sin(t * 2) * 0.15;
    },
  });

  // 4. LOCATION 2: DEWAN PENULIS ([-24, 0, 8])
  // West Scribe Hall with drafting desks, rolled scrolls, and paper lanterns
  const scribeHall = new THREE.Group();
  scribeHall.position.set(-24, 0, 8);

  const scribeBody = new THREE.Mesh(new THREE.BoxGeometry(16, 11, 14), warmTimber);
  scribeBody.position.y = 5.5;
  scribeHall.add(scribeBody);

  const scribeRoof = new THREE.Mesh(new THREE.ConeGeometry(13, 6, 4), darkOak);
  scribeRoof.position.y = 14;
  scribeRoof.rotation.y = Math.PI / 4;
  scribeHall.add(scribeRoof);

  // Drafting desks with scrolls
  for (let d = -4; d <= 4; d += 4) {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 2.2), darkOak);
    desk.position.set(d, 0.9, 8.5);
    scribeHall.add(desk);

    // Parchment scroll
    const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 8), warmLanternMat);
    scroll.rotation.z = Math.PI / 2;
    scroll.position.set(d, 1.95, 8.5);
    scribeHall.add(scroll);
  }

  envGroup.add(scribeHall);

  // 5. LOCATION 3: PERPUSTAKAAN KOSA KATA ([24, 0, 10])
  // East Vocabulary Archive with Cedar Shelves & Golden Dictionaries
  const vocabHall = new THREE.Group();
  vocabHall.position.set(24, 0, 10);

  const vocabBody = new THREE.Mesh(new THREE.BoxGeometry(16, 11, 14), warmTimber);
  vocabBody.position.y = 5.5;
  vocabHall.add(vocabBody);

  const vocabRoof = new THREE.Mesh(new THREE.ConeGeometry(13, 6, 4), darkOak);
  vocabRoof.position.y = 14;
  vocabRoof.rotation.y = Math.PI / 4;
  vocabHall.add(vocabRoof);

  // Open Book Podium in front of library
  const podium = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2.2, 8), brassMetal);
  podium.position.set(0, 1.1, 8.5);
  vocabHall.add(podium);

  const openBook = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 1.1), warmLanternMat);
  openBook.position.set(0, 2.3, 8.5);
  openBook.rotation.x = 0.3;
  vocabHall.add(openBook);

  envGroup.add(vocabHall);

  // 6. Hanging Lanterns across workshop courtyard
  for (const [lx, lz] of [
    [-12, -10],
    [12, -10],
    [-12, 14],
    [12, 14],
    [-18, 0],
    [18, 0],
  ]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5, 8), darkOak);
    post.position.set(lx, 2.5, lz);
    envGroup.add(post);

    const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), warmLanternMat);
    lantern.position.set(lx, 5.2, lz);
    envGroup.add(lantern);
  }
}
