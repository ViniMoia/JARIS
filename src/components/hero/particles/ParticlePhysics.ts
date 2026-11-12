import { PARTICLE_CONFIG } from "@/lib/config/particle-config";
import { ParticleTargetBuffers } from "./ParticleGeometry";

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Zero-allocation spring-damper physics + viewport-aware expansive burst
 * morph interpolator. Separates underlying shape morphing (ant -> brain)
 * from an outward radial + Z-approach explosion envelope so particles burst
 * past screen edges and re-converge cleanly into the brain.
 */
export class ParticlePhysics {
  private readonly count: number;
  private readonly targets: Float32Array;
  private readonly velocities: Float32Array;
  private lastMorphProgress = -1;
  private lastHalfWidth = -1;
  private lastHalfHeight = -1;

  constructor(initialOrigins: Float32Array, count: number) {
    this.count = count;
    this.targets = new Float32Array(initialOrigins);
    this.velocities = new Float32Array(count * 3);
  }

  /**
   * Computes morphed target positions along ant -> off-screen radial burst -> brain.
   * Zero allocations.
   */
  updateMorphTargets(
    buffers: ParticleTargetBuffers,
    progress: number,
    reducedMotion: boolean,
    halfWidth = 2.5,
    halfHeight = 1.6
  ): boolean {
    const clamped = Math.max(0, Math.min(1, progress));
    if (
      Math.abs(clamped - this.lastMorphProgress) < 1e-5 &&
      Math.abs(halfWidth - this.lastHalfWidth) < 1e-4 &&
      Math.abs(halfHeight - this.lastHalfHeight) < 1e-4
    ) {
      return false;
    }
    this.lastMorphProgress = clamped;
    this.lastHalfWidth = halfWidth;
    this.lastHalfHeight = halfHeight;

    const { antPositions, scatterPositions, brainPositions, seeds } = buffers;
    const stagger = reducedMotion ? 0 : PARTICLE_CONFIG.morph.staggerAmount;
    const span = 1 - stagger;
    const depthApproach = PARTICLE_CONFIG.morph.burstDepthApproach;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const start = seeds[i] * stagger;
      const localP = stagger > 0 ? smoothstep(start, start + span, clamped) : clamped;

      const ax = antPositions[i3];
      const ay = antPositions[i3 + 1];
      const az = antPositions[i3 + 2];

      const bx = brainPositions[i3];
      const by = brainPositions[i3 + 1];
      const bz = brainPositions[i3 + 2];

      if (reducedMotion) {
        this.targets[i3] = ax + (bx - ax) * localP;
        this.targets[i3 + 1] = ay + (by - ay) * localP;
        this.targets[i3 + 2] = az + (bz - az) * localP;
      } else {
        // Underlying silhouette transition occurs while dispersed across the frame
        const shapeT = smoothstep(0.24, 0.80, localP);
        const baseX = ax + (bx - ax) * shapeT;
        const baseY = ay + (by - ay) * shapeT;
        const baseZ = az + (bz - az) * shapeT;

        // Asymmetric burst bell: fast outward explosion peaking near ~0.44, smooth inward assembly
        const warped = Math.pow(localP, 0.84);
        const explode = Math.pow(Math.sin(Math.PI * warped), 1.25);

        const exX = scatterPositions[i3];
        const exY = scatterPositions[i3 + 1];
        const exZ = scatterPositions[i3 + 2];

        this.targets[i3] = baseX + exX * halfWidth * explode;
        this.targets[i3 + 1] = baseY + exY * halfHeight * explode;
        this.targets[i3 + 2] = baseZ + exZ * depthApproach * explode;
      }
    }

    return true;
  }

  /**
   * Advances simulation by normalized delta (1.0 ~= 60fps frame).
   * Returns whether any particle still requires GPU buffer upload & re-render.
   */
  step(
    positions: Float32Array,
    pointer: PointerState,
    dtSeconds: number,
    reducedMotion: boolean
  ): boolean {
    const {
      influenceRadius,
      repulsionStrength,
      springStiffness,
      damping,
      maxDisplacement,
      zLiftFactor,
      sleepEpsilonSq,
    } = PARTICLE_CONFIG.physics;

    const dtScale = Math.min(2.5, Math.max(0.25, dtSeconds * 60));
    const dampFactor = Math.pow(damping, dtScale);

    const radiusSq = influenceRadius * influenceRadius;
    const maxDispSq = maxDisplacement * maxDisplacement;
    const canInteract = pointer.active && !reducedMotion;

    let maxEnergySq = 0;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      const ox = this.targets[i3];
      const oy = this.targets[i3 + 1];
      const oz = this.targets[i3 + 2];

      let cx = positions[i3];
      let cy = positions[i3 + 1];
      let cz = positions[i3 + 2];

      let vx = this.velocities[i3];
      let vy = this.velocities[i3 + 1];
      let vz = this.velocities[i3 + 2];

      if (canInteract) {
        const pdx = cx - pointer.x;
        const pdy = cy - pointer.y;
        const pDistSq = pdx * pdx + pdy * pdy;

        if (pDistSq < radiusSq && pDistSq > 1e-8) {
          const pDist = Math.sqrt(pDistSq);
          const falloff = 1 - pDist / influenceRadius;
          const impulse = falloff * falloff * repulsionStrength * dtScale;

          vx += (pdx / pDist) * impulse;
          vy += (pdy / pDist) * impulse;
          vz += falloff * repulsionStrength * zLiftFactor * dtScale;
        }
      }

      vx += (ox - cx) * springStiffness * dtScale;
      vy += (oy - cy) * springStiffness * dtScale;
      vz += (oz - cz) * springStiffness * dtScale;

      vx *= dampFactor;
      vy *= dampFactor;
      vz *= dampFactor;

      cx += vx * dtScale;
      cy += vy * dtScale;
      cz += vz * dtScale;

      let dx = cx - ox;
      let dy = cy - oy;
      let dz = cz - oz;
      const dispSq = dx * dx + dy * dy + dz * dz;

      if (canInteract && dispSq > maxDispSq) {
        const scale = maxDisplacement / Math.sqrt(dispSq);
        dx *= scale;
        dy *= scale;
        dz *= scale;
        cx = ox + dx;
        cy = oy + dy;
        cz = oz + dz;
        vx *= 0.6;
        vy *= 0.6;
        vz *= 0.6;
      }

      positions[i3] = cx;
      positions[i3 + 1] = cy;
      positions[i3 + 2] = cz;

      this.velocities[i3] = vx;
      this.velocities[i3 + 1] = vy;
      this.velocities[i3 + 2] = vz;

      const velSq = vx * vx + vy * vy + vz * vz;
      const energySq = dispSq + velSq;
      if (energySq > maxEnergySq) maxEnergySq = energySq;
    }

    if (!canInteract && maxEnergySq < sleepEpsilonSq) {
      positions.set(this.targets);
      this.velocities.fill(0);
      return false;
    }

    return true;
  }

  snapToTargets(positions: Float32Array): void {
    positions.set(this.targets);
    this.velocities.fill(0);
  }
}
