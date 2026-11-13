import * as THREE from "three";
import { DeviceTier, PARTICLE_CONFIG } from "@/lib/config/particle-config";
import { createAntCamera, updateAntCameraFrustum } from "@/lib/three/camera";
import { createAntRenderer } from "@/lib/three/renderer";
import { createAntParticleGeometry, ParticleTargetBuffers } from "./ParticleGeometry";
import { createAntParticleMaterial } from "./ParticleMaterial";
import { ParticlePhysics, PointerState } from "./ParticlePhysics";
import { detectDeviceTier, processReferenceParticles } from "./ReferenceProcessor";
import { HERO_INTRO_CONFIG } from "@/lib/config/hero-intro-config";

export class AntParticleSystem {
  private readonly container: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly geometry: THREE.BufferGeometry;
  private readonly positionAttribute: THREE.BufferAttribute;
  private readonly material: THREE.ShaderMaterial;
  private readonly points: THREE.Points;
  private readonly physics: ParticlePhysics;
  private readonly targets: ParticleTargetBuffers;

  private deviceTier: DeviceTier;
  private halfWidth = 1;
  private halfHeight = 1;
  private baseWorldOffsetY = 0;
  private morphProgress = 0;

  private readonly pointerWorld: PointerState = { x: 0, y: 0, active: false };
  private reducedMotion = false;
  private isVisible = true;
  private isDocumentHidden = false;
  private isRunning = false;
  private needsOneRender = true;
  private rafId: number | null = null;
  private lastTimestamp = 0;

  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly reducedMotionQuery: MediaQueryList | null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.deviceTier = detectDeviceTier(container.clientWidth || window.innerWidth);
    const profile = PARTICLE_CONFIG.tiers[this.deviceTier];

    this.reducedMotionQuery =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    this.reducedMotion = this.reducedMotionQuery?.matches ?? false;

    this.scene = new THREE.Scene();
    this.camera = createAntCamera();
    this.renderer = createAntRenderer(container, profile.maxPixelRatio);

    const processed = processReferenceParticles(this.deviceTier);
    const bundle = createAntParticleGeometry(processed);
    this.geometry = bundle.geometry;
    this.positionAttribute = bundle.positionAttribute;
    this.targets = bundle.targets;

    this.physics = new ParticlePhysics(this.targets.antPositions, this.targets.count);
    this.physics.updateMorphTargets(this.targets, 0, this.reducedMotion);

    const dpr = this.renderer.getPixelRatio();
    this.material = createAntParticleMaterial(profile.minPointSizeCss, dpr);
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.container.appendChild(this.renderer.domElement);
    this.syncViewportSize();

    this.resizeObserver = new ResizeObserver(() => {
      this.syncViewportSize();
      this.requestFrame();
    });
    this.resizeObserver.observe(this.container);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.isVisible = entry ? entry.isIntersecting : true;
        if (this.isVisible && !this.isDocumentHidden) {
          this.requestFrame();
        } else {
          this.stopLoop();
        }
      },
      { threshold: 0.01 }
    );
    this.intersectionObserver.observe(this.container);

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.reducedMotionQuery?.addEventListener("change", this.handleReducedMotionChange);

    // Render initial static frame immediately
    this.renderFrame();
  }

  public getTargetBuffers(): ParticleTargetBuffers {
    return this.targets;
  }

  /**
   * Drives the scroll-linked ant -> scatter -> brain morphing progress in [0, 1].
   */
  public setMorphProgress(progress: number): void {
    const clamped = Math.max(0, Math.min(1, progress));
    this.morphProgress = clamped;

    // Smoothly re-center particles toward the origin as they scatter into the brain
    const blend = Math.max(0, 1 - clamped / 0.35);
    const nextY = this.baseWorldOffsetY * blend;
    if (Math.abs(this.points.position.y - nextY) > 1e-4) {
      this.points.position.y = nextY;
      this.needsOneRender = true;
    }

    const changed = this.physics.updateMorphTargets(
      this.targets,
      clamped,
      this.reducedMotion,
      this.halfWidth,
      this.halfHeight
    );

    if (this.reducedMotion && changed) {
      this.physics.snapToTargets(this.positionAttribute.array as Float32Array);
      this.positionAttribute.needsUpdate = true;
      this.needsOneRender = true;
      this.renderFrame();
      return;
    }

    if (changed) {
      this.requestFrame();
    }
  }

  public setPointerFromNormalizedDevice(ndcX: number, ndcY: number, active: boolean): void {
    if (!active || this.reducedMotion) {
      if (this.pointerWorld.active) {
        this.pointerWorld.active = false;
        this.requestFrame();
      }
      return;
    }

    this.pointerWorld.x = ndcX * this.halfWidth;
    this.pointerWorld.y = ndcY * this.halfHeight - this.points.position.y;
    this.pointerWorld.active = true;
    this.requestFrame();
  }

  public syncViewportSize(): void {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);

    this.deviceTier = detectDeviceTier(width);
    const profile = PARTICLE_CONFIG.tiers[this.deviceTier];

    const dpr = Math.min(window.devicePixelRatio || 1, profile.maxPixelRatio);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);

    const fit = updateAntCameraFrustum(
      this.camera,
      width,
      height,
      profile.viewportFillRatio
    );
    this.halfWidth = fit.halfWidth;
    this.halfHeight = fit.halfHeight;

    // Set elevation in 3D world space (Three.js) so the canvas covers 100% of the screen without clipping
    const liftRatio = HERO_INTRO_CONFIG.showLogoWordmark
      ? HERO_INTRO_CONFIG.antLiftRatio[this.deviceTier]
      : 0;
    this.baseWorldOffsetY = liftRatio * (2 * this.halfHeight);
    const blend = Math.max(0, 1 - this.morphProgress / 0.35);
    this.points.position.y = this.baseWorldOffsetY * blend;

    const pointSizeCss = Math.min(
      profile.maxPointSizeCss,
      Math.max(profile.minPointSizeCss, fit.antHeightPx * profile.pointSizeRatio)
    );

    this.material.uniforms.uPointSize.value = pointSizeCss;
    this.material.uniforms.uPixelRatio.value = dpr;
    this.physics.updateMorphTargets(
      this.targets,
      this.morphProgress,
      this.reducedMotion,
      this.halfWidth,
      this.halfHeight
    );
    this.needsOneRender = true;
  }

  private handleVisibilityChange = (): void => {
    this.isDocumentHidden = document.hidden;
    if (this.isDocumentHidden) {
      this.stopLoop();
    } else if (this.isVisible) {
      this.requestFrame();
    }
  };

  private handleReducedMotionChange = (event: MediaQueryListEvent): void => {
    this.reducedMotion = event.matches;
    if (this.reducedMotion) {
      this.pointerWorld.active = false;
      this.physics.updateMorphTargets(this.targets, this.morphProgress, true);
      this.physics.snapToTargets(this.positionAttribute.array as Float32Array);
      this.positionAttribute.needsUpdate = true;
      this.needsOneRender = true;
      this.renderFrame();
      this.stopLoop();
    }
  };

  private requestFrame(): void {
    this.needsOneRender = true;
    if (this.isRunning || !this.isVisible || this.isDocumentHidden) return;

    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.rafId = window.requestAnimationFrame(this.tick);
  }

  private stopLoop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (now: number): void => {
    if (!this.isRunning || !this.isVisible || this.isDocumentHidden) {
      this.stopLoop();
      return;
    }

    const dtSeconds = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    const positions = this.positionAttribute.array as Float32Array;
    const active = this.physics.step(
      positions,
      this.pointerWorld,
      dtSeconds,
      this.reducedMotion
    );

    if (active || this.needsOneRender) {
      this.positionAttribute.needsUpdate = true;
      this.renderFrame();
      this.needsOneRender = false;
    }

    if (active) {
      this.rafId = window.requestAnimationFrame(this.tick);
    } else {
      // Enter 0% CPU/GPU idle sleep once particles have cleanly settled
      this.stopLoop();
    }
  };

  private renderFrame(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.stopLoop();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.reducedMotionQuery?.removeEventListener("change", this.handleReducedMotionChange);

    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();

    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
