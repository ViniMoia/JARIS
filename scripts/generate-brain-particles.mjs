import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ANT_PATH = path.join(ROOT, "src", "data", "ant-particles.json");
const OUTPUT_PATH = path.join(ROOT, "src", "data", "brain-particles.json");

function createRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smin(a, b, k) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

/**
 * Refined anatomical 3D brain SDF matching the lateral 3/4 profile of the reference:
 * - Smoothly rounded frontal lobe (left)
 * - High arched parietal dome (top)
 * - Curved occipital pole (right)
 * - Distinct temporal lobe + Sylvian fissure separation (bottom-left-center)
 * - Distinct tucked cerebellum with clear occipital notch (bottom-right)
 * - Slender curved brainstem (bottom-center)
 */
function brainSdf(x, y, z) {
  const az = Math.abs(z);

  // 1. Main cerebral dome (rounded frontal pole, fuller parietal-occipital curve)
  const archY = 0.16 - 0.08 * x * x;
  const heightScale = y > 0 ? 0.56 : 0.36; // Fuller upper crown, tucked lower frontal base
  const cx = (x - 0.02) / 0.84;
  const cy = (y - archY) / heightScale;
  const cz = (az - 0.22) / 0.33;
  let dCerebrum = (Math.sqrt(cx * cx + cy * cy + cz * cz) - 1.0) * 0.42;

  // Smoothly tuck the underside of the frontal lobe upward with a gentle curved arc
  if (x < -0.10) {
    const frontFactor = Math.min(1, (-x - 0.10) / 0.72);
    const smoothFloor = -0.17 + Math.pow(frontFactor, 1.55) * 0.22;
    if (y < smoothFloor) {
      dCerebrum = Math.max(dCerebrum, (smoothFloor - y) * 0.65);
    }
  }

  // 2. Temporal lobe (distinct rounded lateral bulge below Sylvian fissure)
  const tx = (x + 0.06) / 0.40;
  const ty = (y + 0.15) / 0.19;
  const tz = (az - 0.32) / 0.22;
  const dTemporal = (Math.sqrt(tx * tx + ty * ty + tz * tz) - 1.0) * 0.22;

  let dCortex = smin(dCerebrum, dTemporal, 0.065);

  // Longitudinal fissure between left & right hemispheres
  const medialIndent = Math.exp(-az * az * 150) * 0.075;
  dCortex += medialIndent;

  // Gentle gyri/sulci cortical undulation
  const fold =
    Math.sin(x * 12.0 + y * 5.5 + Math.sin(z * 7.5) * 1.3) *
    Math.cos(y * 11.5 - x * 4.2 + z * 6.0);
  dCortex += fold * 0.012;

  // 3. Cerebellum tucked cleanly beneath occipital lobe with clear separation notch
  const cbx = (x - 0.42) / 0.27;
  const cby = (y + 0.28) / 0.17;
  const cbz = (az - 0.17) / 0.22;
  let dCerebellum = (Math.sqrt(cbx * cbx + cby * cby + cbz * cbz) - 1.0) * 0.20;
  dCerebellum += Math.sin(y * 44.0) * 0.005;

  // 4. Slender curved brainstem (pons + medulla)
  const stemTopY = -0.16;
  const stemBotY = -0.66;
  const tStem = Math.max(0, Math.min(1, (stemTopY - y) / (stemTopY - stemBotY)));
  const stemCenterX = 0.04 - tStem * 0.04;
  const stemRadius = 0.115 * (1.0 - 0.38 * tStem);
  const dxStem = x - stemCenterX;
  const dzStem = z;
  const radialStem = Math.sqrt(dxStem * dxStem + dzStem * dzStem) - stemRadius;
  const verticalStem = Math.max(y - stemTopY, stemBotY - y);
  const dStem = Math.max(radialStem, verticalStem);

  let d = smin(dCortex, dCerebellum, 0.018);
  d = smin(d, dStem, 0.028);
  return d;
}

function brainNormal(x, y, z) {
  const e = 0.006;
  const nx = brainSdf(x + e, y, z) - brainSdf(x - e, y, z);
  const ny = brainSdf(x, y + e, z) - brainSdf(x, y - e, z);
  const nz = brainSdf(x, y, z + e) - brainSdf(x, y, z - e);
  const len = Math.hypot(nx, ny, nz) || 1;
  return [nx / len, ny / len, nz / len];
}

function orientBrain(x, y, z) {
  // Slight 3/4 lateral pose (-16 deg yaw, +5 deg pitch) matching the reference framing
  const yaw = -0.28;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;

  const pitch = 0.09;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;

  return [x1, y2, z2];
}

/**
 * Evaluates clean anatomical sulcus grooves (negative-space bands) so major
 * fissures and folds read unmistakably in a sparse minimalist point cloud.
 */
function isSulcusChannel(x, y, z) {
  const az = Math.abs(z);

  // 1. Sylvian fissure (lateral sulcus separating temporal lobe from frontal/parietal)
  if (x > -0.44 && x < 0.24 && az > 0.22) {
    const syY = -0.02 + (x + 0.34) * 0.24;
    if (Math.abs(y - syY) < 0.022) return true;
  }

  // 2. Occipital-cerebellar separation groove (keeps cerebellum distinct)
  if (x > 0.14 && x < 0.72 && az > 0.08) {
    const cbGrooveY = -0.13 - (x - 0.22) * 0.16;
    if (Math.abs(y - cbGrooveY) < 0.020) return true;
  }

  // 3. Central sulcus hint (subtle top-to-mid diagonal fold on lateral cortex)
  if (y > 0.08 && y < 0.65 && az > 0.20) {
    const csX = 0.02 + (y - 0.25) * 0.28;
    if (Math.abs(x - csX) < 0.017) return true;
  }

  return false;
}

function main() {
  const antData = JSON.parse(fs.readFileSync(ANT_PATH, "utf8"));
  const targetTierCounts = antData.meta.tierCounts;
  const totalTarget = antData.meta.totalCount;

  const rng = createRng(20261113);

  const candidates = [];
  const attempts = 95000;
  for (let i = 0; i < attempts; i++) {
    let x = (rng() * 2 - 1) * 1.05;
    let y = (rng() * 2 - 1) * 0.90;
    let z = (rng() * 2 - 1) * 0.70;

    let valid = true;
    for (let s = 0; s < 5; s++) {
      const d = brainSdf(x, y, z);
      if (Math.abs(d) > 0.42 && s === 0) {
        valid = false;
        break;
      }
      const [nx, ny, nz] = brainNormal(x, y, z);
      x -= nx * d * 0.85;
      y -= ny * d * 0.85;
      z -= nz * d * 0.85;
    }
    if (!valid) continue;

    if (Math.abs(brainSdf(x, y, z)) > 0.02) continue;

    // Carve crisp anatomical sulcus negative-space channels on front-facing hemisphere
    if (isSulcusChannel(x, y, z)) continue;

    const [nx, ny, nz] = brainNormal(x, y, z);
    const [ox, oy, oz] = orientBrain(x, y, z);
    const [, , onz] = orientBrain(nx, ny, nz);

    // Filter out deep rear-facing interior points so the front profile stays clean & uncluttered
    if (onz < -0.55 && rng() < 0.75) continue;

    const rimScore = 1.0 - Math.abs(onz);

    // Highlight boundary edges just beside major fissures & lobes
    const nearSylvian =
      x > -0.44 && x < 0.24 && Math.abs(z) > 0.24 &&
      Math.abs(Math.abs(y - (-0.02 + (x + 0.34) * 0.24)) - 0.032) < 0.015;
    const nearCerebellum =
      x > 0.16 && x < 0.70 && y < -0.10 && y > -0.46;
    const isBrainstem = y < -0.20 && Math.abs(x - 0.03) < 0.16;

    const foldVal = Math.abs(
      Math.sin(x * 12.0 + y * 5.5 + Math.sin(z * 7.5) * 1.3) *
      Math.cos(y * 11.5 - x * 4.2 + z * 6.0)
    );

    candidates.push({
      x: ox,
      y: oy,
      z: oz,
      rimScore,
      isPrimaryFeature: rimScore > 0.76 || isBrainstem || nearSylvian,
      isSecondaryFeature: rimScore > 0.48 || nearCerebellum || foldVal > 0.65,
    });
  }

  const tier0Pool = candidates.filter((c) => c.isPrimaryFeature);
  const tier1Pool = candidates.filter((c) => !c.isPrimaryFeature && c.isSecondaryFeature);
  const tier2Pool = candidates.filter((c) => !c.isPrimaryFeature && !c.isSecondaryFeature);

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  }
  shuffle(tier0Pool);
  shuffle(tier1Pool);
  shuffle(tier2Pool);

  const accepted = [];
  function tryFill(pool, targetAdd, minSpacing, floorSpacing, tier) {
    let minD = minSpacing;
    let countInTier = 0;
    while (countInTier < targetAdd && minD >= floorSpacing) {
      for (const c of pool) {
        if (countInTier >= targetAdd) break;
        let ok = true;
        const minDSq = minD * minD;
        for (let i = 0; i < accepted.length; i++) {
          const p = accepted[i];
          const dx = p.x - c.x;
          const dy = p.y - c.y;
          const dz = p.z - c.z;
          // Screen-space XY spacing + gentle Z weight prevents visual clumping
          if (dx * dx + dy * dy + dz * dz * 0.35 < minDSq) {
            ok = false;
            break;
          }
        }
        if (ok) {
          accepted.push({ x: c.x, y: c.y, z: c.z, tier });
          countInTier++;
        }
      }
      minD *= 0.90;
    }
    return countInTier;
  }

  tryFill(tier0Pool, targetTierCounts.limbsAndAntennae, 0.056, 0.044, 0);
  // Overflow any remaining Tier 0 structural budget onto clean cortical contours without clumping
  const t0Count = accepted.filter((p) => p.tier === 0).length;
  if (t0Count < targetTierCounts.limbsAndAntennae) {
    tryFill(tier1Pool, targetTierCounts.limbsAndAntennae - t0Count, 0.054, 0.044, 0);
  }

  tryFill(tier1Pool, targetTierCounts.bodyContour, 0.062, 0.046, 1);
  tryFill(tier2Pool, targetTierCounts.bodyInterior, 0.068, 0.048, 2);

  if (accepted.length < totalTarget) {
    tryFill(candidates, totalTarget - accepted.length, 0.050, 0.036, 2);
  }
  if (accepted.length < totalTarget) {
    shuffle(candidates);
    for (const c of candidates) {
      if (accepted.length >= totalTarget) break;
      accepted.push({ x: c.x, y: c.y, z: c.z, tier: 2 });
    }
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of accepted) {
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    if (p.z < minZ) minZ = p.z; if (p.z > maxZ) maxZ = p.z;
  }
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;
  const span = Math.max(maxX - minX, maxY - minY);
  const targetRadius = 0.86;
  const scale = (targetRadius * 2) / span;

  const byTier = [
    accepted.filter((p) => p.tier === 0),
    accepted.filter((p) => p.tier === 1),
    accepted.filter((p) => p.tier === 2),
  ];

  for (const group of byTier) {
    group.sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
  }

  const ordered = [...byTier[0], ...byTier[1], ...byTier[2]].slice(0, totalTarget);

  const particles = ordered.map((p) => [
    Number(((p.x - cx) * scale).toFixed(5)),
    Number(((p.y - cy) * scale).toFixed(5)),
    Number(((p.z - cz) * scale * 0.6).toFixed(5)),
    p.tier,
  ]);

  const payload = {
    meta: {
      totalCount: particles.length,
      tierCounts: {
        silhouetteAndFeatures: byTier[0].length,
        corticalContours: byTier[1].length,
        surfaceInterior: byTier[2].length,
      },
    },
    particles,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload));
  console.log("Generated refined brain particles:", payload.meta);
}

main();
