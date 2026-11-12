import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, "public", "references", "jaris-ant-reference.webp");
const OUTPUT_PATH = path.join(ROOT, "src", "data", "ant-particles.json");

/**
 * Deterministic PRNG (Mulberry32) so particle IDs and coordinates remain
 * 100% reproducible across builds (required for future ant -> brain morphing).
 */
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

async function main() {
  const { data, info } = await sharp(INPUT_PATH)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;

  // Exclude the "JARIS" typography region in the lower portion of the image
  const maxScanY = Math.floor(H * 0.66);

  // Build binary foreground mask using warm orange/copper chromaticity
  // so pure white background, black JARIS typography, and neutral gray drop shadow are excluded.
  const rawMask = new Uint8Array(W * maxScanY);
  let minX = W;
  let maxX = 0;
  let minY = maxScanY;
  let maxY = 0;

  for (let y = 0; y < maxScanY; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const chroma = r - b;

      const isAntPixel =
        (chroma >= 14 && r >= g) ||
        (luma < 145 && chroma >= 8 && r >= g);

      if (isAntPixel) {
        rawMask[y * W + x] = 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Pad crop region by 2px for clean boundary distance transform
  const pad = 2;
  const cX0 = Math.max(0, minX - pad);
  const cY0 = Math.max(0, minY - pad);
  const cX1 = Math.min(W - 1, maxX + pad);
  const cY1 = Math.min(maxScanY - 1, maxY + pad);
  const cw = cX1 - cX0 + 1;
  const ch = cY1 - cY0 + 1;

  const mask = new Uint8Array(cw * ch);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const sx = cX0 + x;
      const sy = cY0 + y;
      mask[y * cw + x] = rawMask[sy * W + sx];
    }
  }

  // Remove isolated 1px speckles
  const cleanMask = new Uint8Array(mask);
  for (let y = 1; y < ch - 1; y++) {
    for (let x = 1; x < cw - 1; x++) {
      const p = y * cw + x;
      if (!mask[p]) continue;
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (mask[(y + dy) * cw + (x + dx)]) neighbors++;
        }
      }
      if (neighbors === 0) cleanMask[p] = 0;
    }
  }

  // 2-pass Chamfer (3-4) distance transform to background (scaled by 3, so 3 units = 1px)
  const INF = 1e6;
  const dist = new Float32Array(cw * ch);
  for (let i = 0; i < cw * ch; i++) {
    dist[i] = cleanMask[i] ? INF : 0;
  }

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      if (dist[i] === 0) continue;
      let d = dist[i];
      if (x > 0) d = Math.min(d, dist[i - 1] + 1);
      if (y > 0) d = Math.min(d, dist[i - cw] + 1);
      if (x > 0 && y > 0) d = Math.min(d, dist[i - cw - 1] + 1.4142);
      if (x < cw - 1 && y > 0) d = Math.min(d, dist[i - cw + 1] + 1.4142);
      dist[i] = d;
    }
  }

  for (let y = ch - 1; y >= 0; y--) {
    for (let x = cw - 1; x >= 0; x--) {
      const i = y * cw + x;
      if (dist[i] === 0) continue;
      let d = dist[i];
      if (x < cw - 1) d = Math.min(d, dist[i + 1] + 1);
      if (y < ch - 1) d = Math.min(d, dist[i + cw] + 1);
      if (x < cw - 1 && y < ch - 1) d = Math.min(d, dist[i + cw + 1] + 1.4142);
      if (x > 0 && y < ch - 1) d = Math.min(d, dist[i + cw - 1] + 1.4142);
      dist[i] = d;
    }
  }

  // Estimate local max distance in a 7px neighborhood to distinguish truly thin limbs
  // (antennae, legs, mandibles) from outer rims of thick body segments (head, thorax, gaster).
  const localMax = new Float32Array(cw * ch);
  const rad = 7;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      if (cleanMask[i] === 0) continue;
      let m = dist[i];
      const yStart = Math.max(0, y - rad);
      const yEnd = Math.min(ch - 1, y + rad);
      const xStart = Math.max(0, x - rad);
      const xEnd = Math.min(cw - 1, x + rad);
      for (let yy = yStart; yy <= yEnd; yy++) {
        for (let xx = xStart; xx <= xEnd; xx++) {
          const v = dist[yy * cw + xx];
          if (v > m) m = v;
        }
      }
      localMax[i] = m;
    }
  }

  // Classify foreground pixels into structural tiers:
  // Tier 0: Narrow structures (antennae, mandibles, 6 legs, petiole) -> localMax <= 8.5
  // Tier 1: Outer contour / rim of body segments (head, thorax, gaster) -> dist <= 2.6 && localMax > 8.5
  // Tier 2: Interior of body segments -> dist > 2.6
  const tier0 = [];
  const tier1 = [];
  const tier2 = [];

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      if (cleanMask[i] === 0) continue;
      const d = dist[i];
      const lm = localMax[i];

      const sx = cX0 + x;
      const sy = cY0 + y;
      const pIdx = (sy * W + sx) * 4;
      const luma = 0.299 * data[pIdx] + 0.587 * data[pIdx + 1] + 0.114 * data[pIdx + 2];

      if (lm <= 8.5) {
        tier0.push({ x, y, d, lm, luma });
      } else if (d <= 2.4) {
        tier1.push({ x, y, d, lm, luma });
      } else {
        tier2.push({ x, y, d, lm, luma });
      }
    }
  }

  const rng = createRng(20261112);

  // Shuffle within each tier deterministically (for Tier 0, sort by higher distance first so medial axis wins)
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }

  shuffle(tier0);
  // Prefer medial axis of thin limbs so antennae/tarsi stay centered and crisp
  tier0.sort((a, b) => b.d - a.d);
  shuffle(tier1);
  shuffle(tier2);
  // Slightly favor darker anatomical seam lines inside the body so head/thorax/gaster rings remain readable
  tier2.sort((a, b) => a.luma - b.luma + (rng() - 0.5) * 45);

  // Spatial hash grid for fast Poisson-disk spacing enforcement
  const cellSize = 4;
  const gridW = Math.ceil(cw / cellSize);
  const gridH = Math.ceil(ch / cellSize);
  const grid = Array.from({ length: gridW * gridH }, () => []);
  const accepted = [];

  function canPlace(px, py, minDist) {
    const minDistSq = minDist * minDist;
    const gx = Math.floor(px / cellSize);
    const gy = Math.floor(py / cellSize);
    const range = Math.ceil(minDist / cellSize);

    for (let yy = Math.max(0, gy - range); yy <= Math.min(gridH - 1, gy + range); yy++) {
      for (let xx = Math.max(0, gx - range); xx <= Math.min(gridW - 1, gx + range); xx++) {
        const bucket = grid[yy * gridW + xx];
        for (let k = 0; k < bucket.length; k++) {
          const p = accepted[bucket[k]];
          const dx = p.x - px;
          const dy = p.y - py;
          if (dx * dx + dy * dy < minDistSq) return false;
        }
      }
    }
    return true;
  }

  function addPoint(px, py, d, lm, tier) {
    const id = accepted.length;
    accepted.push({ x: px, y: py, d, lm, tier });
    const gx = Math.floor(px / cellSize);
    const gy = Math.floor(py / cellSize);
    grid[gy * gridW + gx].push(id);
  }

  // Harmonized Poisson-disk spacing across limbs, contour, and interior
  // so no region clusters into a solid mass while thin antennae/legs remain crisp
  // and point budget (~1,100-1,300) supports future ant -> brain morphing.
  const SPACING_THIN_LIMB = 4.9;
  const SPACING_THICK_LIMB = 5.6;
  const SPACING_CONTOUR = 4.8;
  const SPACING_INTERIOR = 5.8;

  for (const pt of tier0) {
    const px = pt.x + (rng() - 0.5) * 0.3;
    const py = pt.y + (rng() - 0.5) * 0.3;
    const spacing = pt.lm <= 5.0 ? SPACING_THIN_LIMB : SPACING_THICK_LIMB;
    if (canPlace(px, py, spacing)) {
      addPoint(px, py, pt.d, pt.lm, 0);
    }
  }

  for (const pt of tier1) {
    const px = pt.x + (rng() - 0.5) * 0.35;
    const py = pt.y + (rng() - 0.5) * 0.35;
    if (canPlace(px, py, SPACING_CONTOUR)) {
      addPoint(px, py, pt.d, pt.lm, 1);
    }
  }

  for (const pt of tier2) {
    const px = pt.x + (rng() - 0.5) * 0.45;
    const py = pt.y + (rng() - 0.5) * 0.45;
    if (canPlace(px, py, SPACING_INTERIOR)) {
      addPoint(px, py, pt.d, pt.lm, 2);
    }
  }

  // Center and normalize coordinates preserving 1:1 aspect ratio.
  // Scale by max(antWidth, antHeight) / 2 so coordinates span approximately [-1, 1] along major axis.
  let aMinX = Infinity;
  let aMaxX = -Infinity;
  let aMinY = Infinity;
  let aMaxY = -Infinity;
  let maxDist = 1;

  for (const p of accepted) {
    if (p.x < aMinX) aMinX = p.x;
    if (p.x > aMaxX) aMaxX = p.x;
    if (p.y < aMinY) aMinY = p.y;
    if (p.y > aMaxY) aMaxY = p.y;
    if (p.d > maxDist) maxDist = p.d;
  }

  const centerX = (aMinX + aMaxX) * 0.5;
  const centerY = (aMinY + aMaxY) * 0.5;
  const span = Math.max(aMaxX - aMinX, aMaxY - aMinY);
  const halfSpan = span * 0.5;

  // Compact interleaved arrays for fast hydration and minimal JSON size:
  // For each particle: [x, y, z, tier]
  // Note: y is flipped so +Y points upward in Three.js world space.
  // z has subtle, controlled 3D dome profile + tiny deterministic variation.
  const particles = accepted.map((p) => {
    const nx = Number(((p.x - centerX) / halfSpan).toFixed(5));
    const ny = Number((-(p.y - centerY) / halfSpan).toFixed(5));
    const normDepth = Math.min(1, p.d / maxDist);
    // Subtle 3D relief: thicker segments lift gently toward camera, thin limbs sit near z=0
    const nz = Number(
      (Math.sqrt(normDepth) * 0.11 - 0.03 + (rng() - 0.5) * 0.025).toFixed(5)
    );
    return [nx, ny, nz, p.tier];
  });

  const tierCounts = [0, 0, 0];
  for (const p of accepted) tierCounts[p.tier]++;

  const payload = {
    meta: {
      sourceWidth: W,
      sourceHeight: H,
      antBoundingBox: {
        width: Number((aMaxX - aMinX).toFixed(1)),
        height: Number((aMaxY - aMinY).toFixed(1)),
      },
      aspectRatio: Number(((aMaxX - aMinX) / (aMaxY - aMinY)).toFixed(4)),
      totalCount: particles.length,
      tierCounts: {
        limbsAndAntennae: tierCounts[0],
        bodyContour: tierCounts[1],
        bodyInterior: tierCounts[2],
      },
    },
    particles,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload));
  console.log("Extracted ant particles:", payload.meta);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
