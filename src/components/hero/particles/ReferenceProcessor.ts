import antParticlesData from "@/data/ant-particles.json";
import brainParticlesData from "@/data/brain-particles.json";
import {
  DeviceTier,
  PARTICLE_CONFIG,
} from "@/lib/config/particle-config";

export interface ProcessedParticleData {
  count: number;
  positions: Float32Array;
  scatterPositions: Float32Array;
  brainPositions: Float32Array;
  seeds: Float32Array;
  scales: Float32Array;
  tiers: Uint8Array;
}

type RawParticleTuple = [number, number, number, number];

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/**
 * Classifies the client device to balance point density and GPU fill-rate
 * without compromising silhouette recognition on mobile or low-end hardware.
 */
export function detectDeviceTier(viewportWidth?: number): DeviceTier {
  if (typeof window === "undefined") return "desktop";

  const width = viewportWidth ?? window.innerWidth;
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 8;

  if (width < 768 || (isCoarsePointer && width < 900) || cores <= 2 || memory <= 2) {
    return "mobile";
  }

  if (width < 1100 || isCoarsePointer || cores <= 4 || memory <= 4) {
    return "tablet";
  }

  return "desktop";
}

function hashUnit(index: number): number {
  let x = (index + 1) * 0x27d4eb2d;
  x = ((x >>> 15) ^ x) * 0x85ebca6b;
  x = ((x >>> 13) ^ x) * 0xc2b2ae35;
  return ((x ^ (x >>> 16)) >>> 0) / 4294967295;
}

function selectByTier(
  raw: RawParticleTuple[],
  maxInteriorCount: number
): { structural: RawParticleTuple[]; interior: RawParticleTuple[] } {
  const structural: RawParticleTuple[] = [];
  const interior: RawParticleTuple[] = [];

  for (let i = 0; i < raw.length; i++) {
    const entry = raw[i];
    if (entry[3] <= 1) {
      structural.push(entry);
    } else {
      interior.push(entry);
    }
  }

  const maxInterior = Math.min(maxInteriorCount, interior.length);
  const selectedInterior: RawParticleTuple[] = [];

  if (maxInterior >= interior.length) {
    for (let i = 0; i < interior.length; i++) {
      selectedInterior.push(interior[i]);
    }
  } else {
    const step = interior.length / maxInterior;
    for (let i = 0; i < maxInterior; i++) {
      const idx = Math.min(interior.length - 1, Math.floor(i * step));
      selectedInterior.push(interior[idx]);
    }
  }

  return { structural, interior: selectedInterior };
}

function sortCohesively(tuples: RawParticleTuple[]): RawParticleTuple[] {
  return [...tuples].sort((a, b) => {
    const angA = Math.atan2(a[1], a[0]);
    const angB = Math.atan2(b[1], b[0]);
    if (Math.abs(angA - angB) > 0.04) return angA - angB;
    return Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]);
  });
}

/**
 * Loads both ant and brain reference coordinates, applies consistent structural
 * tier subsampling so both targets share identical count & stable IDs, pairs
 * points coherently by polar region, and generates the intermediate scatter cloud.
 */
export function processReferenceParticles(deviceTier: DeviceTier): ProcessedParticleData {
  const rawAnt = antParticlesData.particles as RawParticleTuple[];
  const rawBrain = brainParticlesData.particles as RawParticleTuple[];
  const profile = PARTICLE_CONFIG.tiers[deviceTier];

  const antBuckets = selectByTier(rawAnt, profile.maxInteriorCount);
  const brainBuckets = selectByTier(rawBrain, profile.maxInteriorCount);

  const antStructural = sortCohesively(antBuckets.structural);
  const antInterior = sortCohesively(antBuckets.interior);
  const brainStructural = sortCohesively(brainBuckets.structural);
  const brainInterior = sortCohesively(brainBuckets.interior);

  const structuralCount = Math.min(antStructural.length, brainStructural.length);
  const interiorCount = Math.min(antInterior.length, brainInterior.length);
  const totalCount = structuralCount + interiorCount;

  const positions = new Float32Array(totalCount * 3);
  const scatterPositions = new Float32Array(totalCount * 3);
  const brainPositions = new Float32Array(totalCount * 3);
  const seeds = new Float32Array(totalCount);
  const scales = new Float32Array(totalCount);
  const tiers = new Uint8Array(totalCount);

  const depthScale = PARTICLE_CONFIG.depthScale;
  const sizeVariance = PARTICLE_CONFIG.sizeVariance;
  const brainScale =
    deviceTier === "mobile"
      ? PARTICLE_CONFIG.morph.brainScaleMobile
      : PARTICLE_CONFIG.morph.brainScaleDesktop;
  const { burstMinReach, burstReachMultiplier } = PARTICLE_CONFIG.morph;

  let writeIdx = 0;
  const appendPair = (ant: RawParticleTuple, brain: RawParticleTuple) => {
    const i3 = writeIdx * 3;
    const ax = ant[0];
    const ay = ant[1];
    const az = ant[2] * depthScale;

    const bx = brain[0] * brainScale;
    const by = brain[1] * brainScale;
    const bz = brain[2] * brainScale * depthScale;

    positions[i3] = ax;
    positions[i3 + 1] = ay;
    positions[i3 + 2] = az;

    brainPositions[i3] = bx;
    brainPositions[i3 + 1] = by;
    brainPositions[i3 + 2] = bz;

    const seed = hashUnit(writeIdx);
    const seed2 = hashUnit(writeIdx + 7919);
    const seed3 = hashUnit(writeIdx + 15485);

    // Normalized 3D explosion direction vector (radial XY + seeded Vesper-style turbulence)
    // stored in scatterPositions so ParticlePhysics can scale it proportionally to viewport bounds.
    const mx = (ax + bx) * 0.5;
    const my = (ay + by) * 0.5;
    const mLen = Math.hypot(mx, my) || 1;
    const rx = mx / mLen;
    const ry = my / mLen;

    const turbX = Math.sin(seed * 41.0) * 0.58;
    const turbY = Math.cos(seed * 57.0) * 0.58;
    const exLen = Math.hypot(rx + turbX, ry + turbY) || 1;
    const dirX = (rx + turbX) / exLen;
    const dirY = (ry + turbY) / exLen;

    // Layered radial reach from center (0.28x) to beyond screen edges (1.45x)
    const reach =
      burstMinReach +
      Math.pow(seed2, 0.72) * (burstReachMultiplier - burstMinReach);

    scatterPositions[i3] = dirX * reach;
    scatterPositions[i3 + 1] = dirY * reach;
    // Asymmetric Z surge: majority approach camera (+Z), others recede (-Z) for deep 3D cloud
    scatterPositions[i3 + 2] = -0.45 + Math.pow(seed3, 0.65) * 1.45;

    seeds[writeIdx] = seed;
    scales[writeIdx] = 1 - sizeVariance + seed * (sizeVariance * 2);
    tiers[writeIdx] = ant[3];
    writeIdx++;
  };

  for (let i = 0; i < structuralCount; i++) {
    appendPair(antStructural[i], brainStructural[i]);
  }
  for (let i = 0; i < interiorCount; i++) {
    appendPair(antInterior[i], brainInterior[i]);
  }

  return {
    count: totalCount,
    positions,
    scatterPositions,
    brainPositions,
    seeds,
    scales,
    tiers,
  };
}
