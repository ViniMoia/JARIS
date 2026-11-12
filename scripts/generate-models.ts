import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = "c:/Diversos/TI/Trabalhos/2026/11-Novembro/JARIS_V2/Projeto/v1";
const ANT_INPUT = path.join(ROOT, "public", "references", "jaris-ant-reference.webp");
const ANT_OUTPUT = path.join(ROOT, "src", "data", "ant-particles.json");
const BRAIN_OUTPUT = path.join(ROOT, "src", "data", "brain-particles.json");
const VESPER_ASSETS = "c:/Diversos/TI/Trabalhos/2026/11-Novembro/JARIS_V2/Referencias/Design_System/DS_2/vesper-design-system/assets/overview/assets/js/embedded-assets.js";

function createRng(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 1. EXTRACT ANT PARTICLES (Target: ~4,200 points with high structural definition)
async function generateAntParticles() {
  const { data, info } = await sharp(ANT_INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;
  const maxScanY = Math.floor(H * 0.66);

  const rawMask = new Uint8Array(W * maxScanY);
  let minX = W, maxX = 0, minY = maxScanY, maxY = 0;

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
      mask[y * cw + x] = rawMask[(cY0 + y) * W + (cX0 + x)];
    }
  }

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

  const INF = 1e6;
  const dist = new Float32Array(cw * ch);
  for (let i = 0; i < cw * ch; i++) dist[i] = cleanMask[i] ? INF : 0;

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

  interface AntCandidate {
    x: number;
    y: number;
    d: number;
    lm: number;
    luma: number;
  }

  interface AntAccepted {
    x: number;
    y: number;
    d: number;
    lm: number;
    tier: number;
  }

  const tier0: AntCandidate[] = [];
  const tier1: AntCandidate[] = [];
  const tier2: AntCandidate[] = [];

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      if (cleanMask[i] === 0) continue;
      const d = dist[i];
      const lm = localMax[i];
      const pIdx = ((cY0 + y) * W + (cX0 + x)) * 4;
      const luma = 0.299 * data[pIdx] + 0.587 * data[pIdx + 1] + 0.114 * data[pIdx + 2];
      if (lm <= 8.5) tier0.push({ x, y, d, lm, luma });
      else if (d <= 2.4) tier1.push({ x, y, d, lm, luma });
      else tier2.push({ x, y, d, lm, luma });
    }
  }

  const rng = createRng(20261112);

  function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }
  shuffle(tier0);
  tier0.sort((a, b) => b.d - a.d);
  shuffle(tier1);
  shuffle(tier2);
  tier2.sort((a, b) => a.luma - b.luma + (rng() - 0.5) * 45);

  const cellSize = 3;
  const gridW = Math.ceil(cw / cellSize);
  const gridH = Math.ceil(ch / cellSize);
  const grid: number[][] = Array.from({ length: gridW * gridH }, () => []);
  const accepted: AntAccepted[] = [];

  function canPlace(px: number, py: number, minDist: number) {
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

  function addPoint(px: number, py: number, d: number, lm: number, tier: number) {
    const id = accepted.length;
    accepted.push({ x: px, y: py, d, lm, tier });
    const gx = Math.floor(px / cellSize);
    const gy = Math.floor(py / cellSize);
    grid[gy * gridW + gx].push(id);
  }

  const SPACING_LIMB = 2.6;
  const SPACING_CONTOUR = 2.7;
  const SPACING_INTERIOR = 3.0;

  for (const pt of tier0) {
    if (canPlace(pt.x, pt.y, SPACING_LIMB)) addPoint(pt.x, pt.y, pt.d, pt.lm, 0);
  }
  for (const pt of tier1) {
    if (canPlace(pt.x, pt.y, SPACING_CONTOUR)) addPoint(pt.x, pt.y, pt.d, pt.lm, 1);
  }
  for (const pt of tier2) {
    if (canPlace(pt.x, pt.y, SPACING_INTERIOR)) addPoint(pt.x, pt.y, pt.d, pt.lm, 2);
  }

  let aMinX = Infinity, aMaxX = -Infinity;
  let aMinY = Infinity, aMaxY = -Infinity;
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

  const particles = accepted.map((p) => {
    const nx = Number(((p.x - centerX) / halfSpan).toFixed(5));
    const ny = Number((-(p.y - centerY) / halfSpan).toFixed(5));
    const normDepth = Math.min(1, p.d / maxDist);
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

  fs.writeFileSync(ANT_OUTPUT, JSON.stringify(payload));
  console.log("Generated high-res ant particles:", payload.meta);
  return payload.meta.totalCount;
}

// 2. GENERATE BRAIN PARTICLES FROM VESPER 3D MESH
async function generateBrainParticles(targetCount: number) {
  const content = fs.readFileSync(VESPER_ASSETS, "utf-8");
  const match = content.match(/"\/assets\/brain\/brain-mesh\.bin":\s*\{\s*"type":\s*"application\/octet-stream",\s*"base64":\s*"([^"]+)"/);
  if (!match) throw new Error("Vesper brain mesh not found in embedded-assets.js");

  const buf = Buffer.from(match[1], "base64");
  const HEADER_BYTES = 16;
  const QUANT = 32767;

  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const vertexCount = view.getUint32(8, true);
  const indexCount = view.getUint32(12, true);

  const quantised = new Int16Array(buf.buffer, buf.byteOffset + HEADER_BYTES, vertexCount * 3);
  const rawPositions = new Float32Array(vertexCount * 3);
  for (let i = 0; i < rawPositions.length; i++) {
    rawPositions[i] = quantised[i] / QUANT;
  }

  const indexBase = buf.byteOffset + HEADER_BYTES + vertexCount * 3 * 2;
  const indices = new Uint16Array(
    buf.buffer.slice(indexBase, indexBase + indexCount * 2)
  );

  const triangleCount = indexCount / 3;
  const cdf = new Float32Array(triangleCount);
  let totalArea = 0;
  for (let t = 0; t < triangleCount; t++) {
    const a = indices[t * 3] * 3;
    const b = indices[t * 3 + 1] * 3;
    const c = indices[t * 3 + 2] * 3;
    const ux = rawPositions[b] - rawPositions[a];
    const uy = rawPositions[b + 1] - rawPositions[a + 1];
    const uz = rawPositions[b + 2] - rawPositions[a + 2];
    const vx = rawPositions[c] - rawPositions[a];
    const vy = rawPositions[c + 1] - rawPositions[a + 1];
    const vz = rawPositions[c + 2] - rawPositions[a + 2];
    const area = Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx) * 0.5;
    totalArea += area;
    cdf[t] = totalArea;
  }
  for (let t = 0; t < triangleCount; t++) cdf[t] /= totalArea;

  const rng = createRng(20261112);
  // User-specified 230° lateral angle with -12° isometric tilt matching Vesper reference
  const degY = 230;
  const degX = -12;
  const radY = (degY * Math.PI) / 180;
  const radX = (degX * Math.PI) / 180;
  const cosY = Math.cos(radY), sinY = Math.sin(radY);
  const cosX = Math.cos(radX), sinX = Math.sin(radX);

  const rawSampled: [number, number, number][] = [];
  for (let s = 0; s < targetCount; s++) {
    const pick = rng();
    let lo = 0;
    let hi = triangleCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < pick) lo = mid + 1;
      else hi = mid;
    }
    const a = indices[lo * 3] * 3;
    const b = indices[lo * 3 + 1] * 3;
    const c = indices[lo * 3 + 2] * 3;
    let u = rng();
    let v = rng();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    const px = w * rawPositions[a] + u * rawPositions[b] + v * rawPositions[c];
    const py = w * rawPositions[a + 1] + u * rawPositions[b + 1] + v * rawPositions[c + 1];
    const pz = w * rawPositions[a + 2] + u * rawPositions[b + 2] + v * rawPositions[c + 2];

    // 1. Rotate around Y (230°)
    const x1 = px * cosY + pz * sinY;
    const y1 = py;
    const z1 = -px * sinY + pz * cosY;

    // 2. Tilt slightly around X (-12°) for true 3D isometric perspective
    const x2 = x1;
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    rawSampled.push([x2, y2, z2]);
  }

  // Find bounding box for normalization
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  for (const [x, y, z] of rawSampled) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;
  const span = Math.max(maxX - minX, maxY - minY);
  const halfSpan = span * 0.5;

  // Sort by radius from center so outer cortical surface forms structural tier
  // exactly matching ant structural count (1730 structural, 2480 interior).
  const withDist = rawSampled.map(([x, y, z]) => {
    const nx = Number(((x - cx) / halfSpan).toFixed(5));
    const ny = Number(((y - cy) / halfSpan).toFixed(5));
    const nz = Number(((z - cz) / halfSpan).toFixed(5));
    const r = Math.hypot(nx, ny, nz);
    return { nx, ny, nz, r };
  });

  // Sort descending by radius: highest radius (outer cortical surface and sulci) first
  withDist.sort((a, b) => b.r - a.r);

  const targetStructural = 1730;
  const particles = withDist.map((p, idx) => {
    const tier = idx < targetStructural ? 1 : 2;
    return [p.nx, p.ny, p.nz, tier];
  });

  const payload = {
    meta: {
      source: "Vesper 3D Brain Mesh (brain-mesh.bin)",
      triangles: triangleCount,
      totalCount: particles.length,
      bounds: {
        width: Number((maxX - minX).toFixed(3)),
        height: Number((maxY - minY).toFixed(3)),
        depth: Number((maxZ - minZ).toFixed(3)),
      },
    },
    particles,
  };

  fs.writeFileSync(BRAIN_OUTPUT, JSON.stringify(payload));
  console.log("Generated high-res 3D brain particles:", payload.meta);
}

async function main() {
  const antCount = await generateAntParticles();
  await generateBrainParticles(antCount);
  console.log(`\nBoth datasets generated with EXACT count: ${antCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
