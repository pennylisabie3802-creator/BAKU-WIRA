/**
 * BAKUWIRA: Region 2 - Akademi Detektif Bahasa Procedural 3D Environment Builder
 * Matches the official illustration: akademi__detektif_tatabahasa_be2ddd03.jpeg
 * 
 * Locations:
 * 1. Dewan Bukti ([0, 0, 0]) - Central courtyard, evidence boards, celestial armillary sphere
 * 2. Perpustakaan Misteri ([-24, 0, 8]) - West vaulted library, bookcases, floating books
 * 3. Makmal Kata ([24, 0, 10]) - East syntax laboratory, alchemy vials, grammar analyzers
 * 4. Menara Pemerhatian ([0, 0, -28]) - North Grand Academy Castle, observatory spire, telescope
 */

import * as THREE from 'three';
import { AnimatedProp, CollisionBox } from './kotaMediaProcedural';

export function getAkademiColliders(): CollisionBox[] {
  return [
    // North Academy Castle
    { minX: -26, maxX: 26, minZ: -38, maxZ: -20 },
    // West Library Hall
    { minX: -36, maxX: -18, minZ: 0, maxZ: 18 },
    // East Laboratory
    { minX: 18, maxX: 36, minZ: 2, maxZ: 20 },
    // South Courtyard Balustrades
    { minX: -38, maxX: 38, minZ: 26, maxZ: 32 },
    // West & East Perimeters
    { minX: -44, maxX: -38, minZ: -40, maxZ: 30 },
    { minX: 38, maxX: 44, minZ: -40, maxZ: 30 },
  ];
}

/**
 * Creates Courtyard Floor Paving Texture for Akademi Detektif Bahasa
 */
export function createAkademiFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Cobblestone / slate tiles base
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 1024, 1024);

  // Diagonal slate paving
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 3;
  const step = 64;
  for (let x = -1024; x < 2048; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 1024, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 1024);
    ctx.lineTo(x + 1024, 0);
    ctx.stroke();
  }

  // Concentric Academic Runic Circles
  ctx.save();
  ctx.translate(512, 512);

  const drawRing = (r: number, color: string, w: number, dash = false) => {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    if (dash) ctx.setLineDash([14, 12]);
    else ctx.setLineDash([]);
    ctx.stroke();
  };

  drawRing(440, 'rgba(96, 165, 250, 0.4)', 4);
  drawRing(360, 'rgba(234, 179, 8, 0.65)', 3, true);
  drawRing(260, 'rgba(147, 197, 253, 0.5)', 3);
  drawRing(140, 'rgba(234, 179, 8, 0.8)', 4);

  // Magnifying Glass & Owl Insignia Silhouette at center
  ctx.beginPath();
  ctx.arc(0, -20, 60, 0, Math.PI * 2);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(42, 22);
  ctx.lineTo(95, 75);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Builds the entire Region 2 environment
 */
export function buildAkademiEnvironment(
  envGroup: THREE.Group,
  animatedObjects: { mesh: THREE.Object3D; update: (t: number) => void }[]
) {
  // Shared PBR Materials
  const academyStone = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.38, metalness: 0.2 });
  const darkSlate = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.3 });
  const goldTrim = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.9 });
  const academyBlueRoof = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.4 });
  const purpleBannerMat = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.5, side: THREE.DoubleSide });
  const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
  const amberGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.9 });

  // 1. Central Courtyard Floor
  const floorTex = createAkademiFloorTexture();
  const floorGeo = new THREE.PlaneGeometry(60, 60, 16, 16);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.3, metalness: 0.3 });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0.03, 0);
  envGroup.add(floorMesh);

  // 2. LOCATION 1: DEWAN BUKTI ([0, 0, 0])
  // Celestial Armillary Sphere & Evidence Investigation Stands
  const armillaryGroup = new THREE.Group();
  armillaryGroup.position.set(0, 0, 0);

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.6, 0.8, 16), academyStone);
  plinth.position.y = 0.4;
  armillaryGroup.add(plinth);

  const plinthGoldRim = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.1, 8, 24), goldTrim);
  plinthGoldRim.rotation.x = Math.PI / 2;
  plinthGoldRim.position.y = 0.8;
  armillaryGroup.add(plinthGoldRim);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 10, 32), goldTrim);
  ring1.position.y = 2.6;
  armillaryGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.08, 10, 32), goldTrim);
  ring2.position.y = 2.6;
  ring2.rotation.x = Math.PI / 3;
  armillaryGroup.add(ring2);

  const centerCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), cyanGlowMat);
  centerCrystal.position.y = 2.6;
  armillaryGroup.add(centerCrystal);

  envGroup.add(armillaryGroup);
  animatedObjects.push({
    mesh: armillaryGroup,
    update: (t) => {
      ring1.rotation.y = t * 0.8;
      ring2.rotation.z = -t * 0.6;
      centerCrystal.rotation.y = t * 1.2;
      centerCrystal.position.y = 2.6 + Math.sin(t * 2) * 0.12;
    },
  });

  // Evidence Boards around courtyard
  for (const [bx, bz, rotY] of [
    [-6, 4, 0.3],
    [6, 4, -0.3],
    [-4, -6, 0],
  ]) {
    const boardGroup = new THREE.Group();
    boardGroup.position.set(bx, 0, bz);
    boardGroup.rotation.y = rotY;

    // Wooden easel stand
    const standL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), darkSlate);
    standL.position.set(-0.7, 1.2, 0);
    boardGroup.add(standL);

    const standR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), darkSlate);
    standR.position.set(0.7, 1.2, 0);
    boardGroup.add(standR);

    // Board canvas
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.3, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 })
    );
    board.position.set(0, 1.6, 0.05);
    boardGroup.add(board);

    // Magnifying Glass prop on board
    const mag = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 6, 16), goldTrim);
    mag.position.set(0.4, 1.8, 0.12);
    boardGroup.add(mag);

    envGroup.add(boardGroup);
  }

  // 3. LOCATION 4: MENARA PEMERHATIAN ([0, 0, -28])
  // Grand Academy Castle Facade with Observatory Tower & Telescope
  const castle = new THREE.Group();
  castle.position.set(0, 0, -28);

  const mainHall = new THREE.Mesh(new THREE.BoxGeometry(44, 15, 14), academyStone);
  mainHall.position.y = 7.5;
  castle.add(mainHall);

  // Grand Entrance Arch
  const arch = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 3), darkSlate);
  arch.position.set(0, 4.5, 7.1);
  castle.add(arch);

  const archPortal = new THREE.Mesh(new THREE.PlaneGeometry(7, 8), cyanGlowMat);
  archPortal.position.set(0, 4.5, 8.62);
  castle.add(archPortal);

  // Golden Owl Crest above arch
  const crest = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 16), goldTrim);
  crest.rotation.x = Math.PI / 2;
  crest.position.set(0, 11, 7.2);
  castle.add(crest);

  // Staircase
  for (let s = 0; s < 6; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(14 + (6 - s) * 0.8, 0.35, 1.1), academyStone);
    step.position.set(0, s * 0.35 + 0.175, 8.5 + (6 - s) * 0.7);
    castle.add(step);
  }

  // Tower Spires
  [-18, -9, 9, 18].forEach((tx, idx) => {
    const h = idx === 1 || idx === 2 ? 26 : 22;
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, h, 12), academyStone);
    tower.position.set(tx, h / 2 + 2, 2);
    castle.add(tower);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(2.8, 8, 12), academyBlueRoof);
    spire.position.set(tx, h + 6, 2);
    castle.add(spire);

    const pin = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), goldTrim);
    pin.position.set(tx, h + 10.5, 2);
    castle.add(pin);
  });

  // Central Observatory Tower (Menara Pemerhatian proper)
  const obsTower = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.2, 34, 16), academyStone);
  obsTower.position.set(0, 20, -2);
  castle.add(obsTower);

  const obsDome = new THREE.Mesh(
    new THREE.SphereGeometry(4.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    goldTrim
  );
  obsDome.position.set(0, 37, -2);
  castle.add(obsDome);

  // Giant Golden Astronomical Telescope protruding from dome
  const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 7, 10), goldTrim);
  telescope.rotation.x = -0.55;
  telescope.position.set(0, 39, 2.5);
  castle.add(telescope);

  envGroup.add(castle);

  // 4. LOCATION 2: PERPUSTAKAAN MISTERI ([-24, 0, 8])
  // West Library Wing with Bookshelves, Floating Grimoires & Reading Desks
  const libraryGroup = new THREE.Group();
  libraryGroup.position.set(-24, 0, 8);

  const libHall = new THREE.Mesh(new THREE.BoxGeometry(16, 12, 14), academyStone);
  libHall.position.y = 6;
  libraryGroup.add(libHall);

  const libRoof = new THREE.Mesh(new THREE.ConeGeometry(13, 6, 4), academyBlueRoof);
  libRoof.position.y = 15;
  libRoof.rotation.y = Math.PI / 4;
  libraryGroup.add(libRoof);

  // Bookshelves inside / along colonnade
  for (let b = -4; b <= 4; b += 4) {
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 5, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    shelf.position.set(b, 2.5, 7.1);
    libraryGroup.add(shelf);

    // Colorful books in shelf
    for (let row = 0; row < 3; row++) {
      const bookStack = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.7, 0.9),
        new THREE.MeshStandardMaterial({
          color: row === 0 ? 0x1d4ed8 : row === 1 ? 0xb45309 : 0x6b21a8,
        })
      );
      bookStack.position.set(b, 1.0 + row * 1.3, 7.2);
      libraryGroup.add(bookStack);
    }
  }

  // Floating Grimoire with Mana Light
  const floatingBook = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.25, 0.85),
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.3 })
  );
  floatingBook.position.set(0, 3.2, 9.5);
  libraryGroup.add(floatingBook);

  const bookGlow = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), amberGlowMat);
  bookGlow.position.set(0, 3.5, 9.5);
  libraryGroup.add(bookGlow);

  envGroup.add(libraryGroup);
  animatedObjects.push({
    mesh: floatingBook,
    update: (t) => {
      floatingBook.position.y = 3.2 + Math.sin(t * 2.2) * 0.25;
      floatingBook.rotation.y = t * 0.6;
      bookGlow.position.y = 3.5 + Math.sin(t * 2.2) * 0.25;
    },
  });

  // 5. LOCATION 3: MAKMAL KATA ([24, 0, 10])
  // East Syntax Lab with Alchemy Vials, Grammar Cogs, and Specimen Pods
  const labGroup = new THREE.Group();
  labGroup.position.set(24, 0, 10);

  const labHall = new THREE.Mesh(new THREE.BoxGeometry(16, 12, 14), academyStone);
  labHall.position.y = 6;
  labGroup.add(labHall);

  const labRoof = new THREE.Mesh(new THREE.ConeGeometry(13, 6, 4), academyBlueRoof);
  labRoof.position.y = 15;
  labRoof.rotation.y = Math.PI / 4;
  labGroup.add(labRoof);

  // Giant Brass Linguistic Gear Mechanism
  const labGear = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.4, 16), goldTrim);
  labGear.rotation.x = Math.PI / 2;
  labGear.position.set(0, 7.5, 7.2);
  labGroup.add(labGear);

  // Alchemy Retort Tables with Glowing Flasks
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 1.8, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 })
  );
  table.position.set(0, 0.9, 9.5);
  labGroup.add(table);

  // 3 Bubbling Glass Flasks (Cyan, Purple, Gold)
  const flaskColors = [0x38bdf8, 0xc084fc, 0xfacc15];
  flaskColors.forEach((col, idx) => {
    const flask = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 10, 10),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.88 })
    );
    flask.position.set(-1.2 + idx * 1.2, 2.1, 9.5);
    labGroup.add(flask);
  });

  envGroup.add(labGroup);
  animatedObjects.push({
    mesh: labGear,
    update: (t) => {
      labGear.rotation.z = -t * 0.5;
    },
  });

  // 6. Connective Pathways, Hedges & Academic Street Lamps
  for (const [lx, lz] of [
    [-12, -12],
    [12, -12],
    [-12, 16],
    [12, 16],
    [-22, -4],
    [22, -4],
  ]) {
    const lamp = new THREE.Group();
    lamp.position.set(lx, 0, lz);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5, 8), darkSlate);
    post.position.y = 2.5;
    lamp.add(post);

    const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), amberGlowMat);
    lantern.position.y = 5.2;
    lamp.add(lantern);

    envGroup.add(lamp);
  }
}
