import * as THREE from "three";
import { ProcessedParticleData } from "./ReferenceProcessor";

/**
 * Independent typed coordinate sets sharing identical particle count and IDs
 * for ant -> scatter -> brain morphing driven by GSAP ScrollTrigger.
 */
export interface ParticleTargetBuffers {
  count: number;
  antPositions: Float32Array;
  scatterPositions: Float32Array;
  brainPositions: Float32Array;
  seeds: Float32Array;
}

export interface AntGeometryBundle {
  geometry: THREE.BufferGeometry;
  positionAttribute: THREE.BufferAttribute;
  targets: ParticleTargetBuffers;
}

export function createAntParticleGeometry(
  data: ProcessedParticleData
): AntGeometryBundle {
  const { count, positions, scatterPositions, brainPositions, seeds, scales } = data;

  const antPositions = new Float32Array(positions);
  const activePositions = new Float32Array(positions);

  const geometry = new THREE.BufferGeometry();

  const positionAttribute = new THREE.BufferAttribute(activePositions, 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);

  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.computeBoundingSphere();

  return {
    geometry,
    positionAttribute,
    targets: {
      count,
      antPositions,
      scatterPositions,
      brainPositions,
      seeds,
    },
  };
}
