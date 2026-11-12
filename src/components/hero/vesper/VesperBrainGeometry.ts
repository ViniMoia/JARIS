import * as THREE from "three";
import meshData from "@/data/vesper-brain-mesh.json";

const MAGIC = 1314013782; // 'VBRN'
const HEADER_BYTES = 16;
const QUANT = 32767;

export interface DecodedMesh {
  positions: Float32Array;
  indices: Uint16Array;
}

export function decodeVesperMesh(): DecodedMesh {
  const binaryString = atob(meshData.base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(0, true) !== MAGIC) {
    throw new Error("Vesper brain mesh: invalid magic header");
  }

  const version = view.getUint32(4, true);
  if (version !== 1) {
    throw new Error(`Vesper brain mesh: unsupported version ${version}`);
  }

  const vertexCount = view.getUint32(8, true);
  const indexCount = view.getUint32(12, true);

  const quantised = new Int16Array(
    bytes.buffer,
    bytes.byteOffset + HEADER_BYTES,
    vertexCount * 3
  );
  const positions = new Float32Array(vertexCount * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = quantised[i] / QUANT;
  }

  const indexBase = bytes.byteOffset + HEADER_BYTES + vertexCount * 3 * 2;
  const indices = new Uint16Array(
    bytes.buffer.slice(indexBase, indexBase + indexCount * 2)
  );

  return { positions, indices };
}

/**
 * Deterministic RNG (Mulberry32) so particle distributions remain stable.
 */
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

/**
 * Builds the exact Three.js BufferGeometry with 130k / 90k / 50k / 26k points
 * sampled across triangle surface areas using cumulative distribution function (CDF).
 */
export function buildVesperBrainGeometry(
  count: number,
  radius = 1.15
): THREE.BufferGeometry {
  const mesh = decodeVesperMesh();
  const { positions: verts, indices } = mesh;
  const triangleCount = indices.length / 3;
  const cdf = new Float32Array(triangleCount);
  let total = 0;

  for (let t = 0; t < triangleCount; t++) {
    const a = indices[t * 3] * 3;
    const b = indices[t * 3 + 1] * 3;
    const c = indices[t * 3 + 2] * 3;

    const ux = verts[b] - verts[a];
    const uy = verts[b + 1] - verts[a + 1];
    const uz = verts[b + 2] - verts[a + 2];

    const vx = verts[c] - verts[a];
    const vy = verts[c + 1] - verts[a + 1];
    const vz = verts[c + 2] - verts[a + 2];

    total +=
      Math.hypot(
        uy * vz - uz * vy,
        uz * vx - ux * vz,
        ux * vy - uy * vx
      ) * 0.5;
    cdf[t] = total;
  }

  for (let t = 0; t < triangleCount; t++) {
    cdf[t] /= total;
  }

  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const occlusion = new Float32Array(count);
  const rng = createRng(20261112);

  for (let s = 0; s < count; s++) {
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

    positions[s * 3] =
      (w * verts[a] + u * verts[b] + v * verts[c]) * radius;
    positions[s * 3 + 1] =
      (w * verts[a + 1] + u * verts[b + 1] + v * verts[c + 1]) * radius;
    positions[s * 3 + 2] =
      (w * verts[a + 2] + u * verts[b + 2] + v * verts[c + 2]) * radius;

    const e1x = verts[b] - verts[a];
    const e1y = verts[b + 1] - verts[a + 1];
    const e1z = verts[b + 2] - verts[a + 2];

    const e2x = verts[c] - verts[a];
    const e2y = verts[c + 1] - verts[a + 1];
    const e2z = verts[c + 2] - verts[a + 2];

    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    const length = Math.hypot(nx, ny, nz) || 1;

    normals[s * 3] = nx / length;
    normals[s * 3 + 1] = ny / length;
    normals[s * 3 + 2] = nz / length;

    seeds[s] = rng();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aNormal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aOcclusion", new THREE.BufferAttribute(occlusion, 1));

  return geometry;
}

