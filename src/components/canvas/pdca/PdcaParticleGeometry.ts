import * as THREE from "three";

export interface PdcaGeometryData {
  geometry: THREE.BufferGeometry;
  totalCount: number;
}

/**
 * Creates the parametric 3D particle geometry for the PDCA + AI cycle diagram.
 * Generates exact STATIC geometry matching the reference design:
 * - Central Hub (CICLO PDCA + IA)
 * - Main circular orbital tracks (4 segments)
 * - 4 Directional clockwise arrowheads
 * - 4 Nodes (P, D, C, A) at cardinal points (top, right, bottom, left)
 * - Outer subtle dotted orbital guide
 * - Subtle ambient sparkles
 * 
 * ALL particles are static in their target shape (no running/flowing particles).
 * Only react dynamically to mouse interaction.
 */
export function createPdcaParticleGeometry(): PdcaGeometryData {
  const positions: number[] = [];
  const origins: number[] = [];
  const exitVectors: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  const alphas: number[] = [];
  const types: number[] = [];

  // Linearized Brand Colors for Three.js shaders
  const colorOrange = new THREE.Color("#D95B26");
  const colorDark = new THREE.Color("#1D1D1F");
  const colorLightGray = new THREE.Color("#86868B");
  const colorAmber = new THREE.Color("#F59E0B");

  const R_ORBIT = 2.4;
  const R_OUTER = 3.35;
  const R_NODE = 0.58;
  const R_CENTER = 1.05;

  function addPoint(
    targetX: number,
    targetY: number,
    targetZ: number,
    col: THREE.Color,
    size: number,
    alpha: number,
    type: number
  ) {
    positions.push(targetX, targetY, targetZ);

    // Initial scattered origin for smooth entry assembly
    const spreadR = 3.5 + Math.random() * 4.2;
    const spreadAngle = Math.random() * Math.PI * 2;
    const spreadZ = (Math.random() - 0.5) * 4.5;
    origins.push(
      Math.cos(spreadAngle) * spreadR,
      Math.sin(spreadAngle) * spreadR,
      spreadZ
    );

    // Dispersal vector for smooth exit explosion
    const exitAngle = Math.atan2(targetY, targetX) + (Math.random() - 0.5) * 0.7;
    const exitSpeed = 2.2 + Math.random() * 4.0;
    const exitZ = 1.8 + Math.random() * 3.8;
    exitVectors.push(
      Math.cos(exitAngle) * exitSpeed,
      Math.sin(exitAngle) * exitSpeed,
      exitZ
    );

    colors.push(col.r, col.g, col.b);
    sizes.push(size);
    alphas.push(alpha);
    types.push(type);
  }

  // ----------------------------------------------------
  // 1. Outer Dotted Orbital Guide
  // ----------------------------------------------------
  const outerSteps = 96;
  for (let i = 0; i < outerSteps; i++) {
    if (i % 2 === 0) {
      const theta = (i / outerSteps) * Math.PI * 2;
      const x = Math.cos(theta) * R_OUTER;
      const y = Math.sin(theta) * R_OUTER;
      addPoint(x, y, 0, colorLightGray, 2.2, 0.35, 1);
    }
  }

  // ----------------------------------------------------
  // 2. Main Circular Tracks between Nodes (Clockwise arcs)
  // P: 90 deg (PI/2)
  // D: 0 deg (0)
  // C: 270 deg (-PI/2)
  // A: 180 deg (PI)
  // ----------------------------------------------------
  const trackArcMargin = 0.32; // clearance for node circles
  const quadrants = [
    { start: Math.PI * 0.5 - trackArcMargin, end: 0 + trackArcMargin },
    { start: 0 - trackArcMargin, end: -Math.PI * 0.5 + trackArcMargin },
    { start: -Math.PI * 0.5 - trackArcMargin, end: -Math.PI + trackArcMargin },
    { start: Math.PI - trackArcMargin, end: Math.PI * 0.5 + trackArcMargin },
  ];

  quadrants.forEach((quad) => {
    // 160 static points along each circular arc
    const pointsInArc = 160;
    for (let i = 0; i < pointsInArc; i++) {
      const frac = i / (pointsInArc - 1);
      const theta = THREE.MathUtils.lerp(quad.start, quad.end, frac);
      const radJitter = (Math.random() - 0.5) * 0.035;
      const x = Math.cos(theta) * (R_ORBIT + radJitter);
      const y = Math.sin(theta) * (R_ORBIT + radJitter);
      const z = (Math.random() - 0.5) * 0.02;

      // Color gradation towards orange as it approaches arrowhead
      const isNearEnd = frac > 0.4;
      const col = isNearEnd ? colorOrange : colorDark;
      const alpha = isNearEnd ? 0.9 : 0.5;
      const size = isNearEnd ? 3.4 : 2.6;

      addPoint(x, y, z, col, size, alpha, 0);
    }

    // Static crisp triangular arrowhead at the end of each arc
    // Pointing clockwise:
    // Tangent for clockwise is (sin(theta), -cos(theta))
    const arrowTheta = quad.end;
    const arrowTipX = Math.cos(arrowTheta) * R_ORBIT;
    const arrowTipY = Math.sin(arrowTheta) * R_ORBIT;

    const tx = Math.sin(arrowTheta);
    const ty = -Math.cos(arrowTheta);
    const nx = Math.cos(arrowTheta);
    const ny = Math.sin(arrowTheta);

    // Form 45 static points outlining the arrow head
    for (let a = 0; a < 45; a++) {
      const p = Math.random(); // 0 is tip, 1 is base
      const tipDist = p * 0.32;
      const wingDist = (Math.random() - 0.5) * p * 0.26;

      const px = arrowTipX - tx * tipDist + nx * wingDist;
      const py = arrowTipY - ty * tipDist + ny * wingDist;
      addPoint(px, py, 0.02, colorOrange, 3.8, 0.95, 3);
    }
  });

  // ----------------------------------------------------
  // 3. Four Circular Nodes (P, D, C, A)
  // ----------------------------------------------------
  const nodeCenters = [
    { x: 0, y: R_ORBIT, label: "P" },
    { x: R_ORBIT, y: 0, label: "D" },
    { x: 0, y: -R_ORBIT, label: "C" },
    { x: -R_ORBIT, y: 0, label: "A" },
  ];

  nodeCenters.forEach((node) => {
    // Outer concentric ring
    const outerRingCount = 120;
    for (let i = 0; i < outerRingCount; i++) {
      const a = (i / outerRingCount) * Math.PI * 2;
      const r = R_NODE + (Math.random() - 0.5) * 0.02;
      const px = node.x + Math.cos(a) * r;
      const py = node.y + Math.sin(a) * r;
      addPoint(px, py, 0.04, colorOrange, 3.2, 0.85, 2);
    }

    // Inner concentric ring
    const innerRingCount = 90;
    for (let i = 0; i < innerRingCount; i++) {
      const a = (i / innerRingCount) * Math.PI * 2;
      const r = R_NODE * 0.85 + (Math.random() - 0.5) * 0.02;
      const px = node.x + Math.cos(a) * r;
      const py = node.y + Math.sin(a) * r;
      addPoint(px, py, 0.04, colorOrange, 2.6, 0.65, 2);
    }

    // Subtle core aura
    for (let i = 0; i < 45; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * (R_NODE * 0.7);
      const px = node.x + Math.cos(a) * r;
      const py = node.y + Math.sin(a) * r;
      addPoint(px, py, 0.02, colorAmber, 2.0, 0.35, 2);
    }
  });

  // ----------------------------------------------------
  // 4. Central Hub (CICLO PDCA + IA)
  // ----------------------------------------------------
  const centerRingCount = 180;
  for (let i = 0; i < centerRingCount; i++) {
    const a = (i / centerRingCount) * Math.PI * 2;
    const r = R_CENTER + (Math.random() - 0.5) * 0.03;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    addPoint(px, py, 0.04, colorLightGray, 2.6, 0.55, 4);
  }

  for (let i = 0; i < 110; i++) {
    const a = (i / 110) * Math.PI * 2;
    const r = R_CENTER * 0.92;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    addPoint(px, py, 0.04, colorOrange, 2.4, 0.45, 4);
  }

  // Soft glowing center aura particles
  for (let i = 0; i < 120; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * (R_CENTER * 0.8);
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    addPoint(px, py, 0.02, colorAmber, 2.0, 0.25, 4);
  }

  // ----------------------------------------------------
  // 5. Ambient Depth Micro-Sparks
  // ----------------------------------------------------
  const ambientCount = 180;
  for (let i = 0; i < ambientCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.6 + Math.random() * 3.1;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    const pz = (Math.random() - 0.5) * 0.5;
    addPoint(px, py, pz, colorLightGray, 1.8, 0.2, 5);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute(
    "aOrigin",
    new THREE.Float32BufferAttribute(origins, 3)
  );
  geometry.setAttribute(
    "aExit",
    new THREE.Float32BufferAttribute(exitVectors, 3)
  );
  geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute("aAlpha", new THREE.Float32BufferAttribute(alphas, 1));
  geometry.setAttribute("aType", new THREE.Float32BufferAttribute(types, 1));

  return {
    geometry,
    totalCount: positions.length / 3,
  };
}
