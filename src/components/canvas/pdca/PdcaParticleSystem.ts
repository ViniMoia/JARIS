import * as THREE from "three";
import { createPdcaParticleGeometry } from "./PdcaParticleGeometry";
import { createPdcaMaterial } from "./PdcaParticleMaterial";

export interface PdcaSystemOptions {
  onVisibilityChange?: (visible: boolean) => void;
}

export class PdcaParticleSystem {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private material: THREE.ShaderMaterial;
  private points: THREE.Points;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;

  private isVisible = true;
  private observer: IntersectionObserver | null = null;

  // Inertial pointer with world coordinates: x, y, active (0 or 1)
  private targetPointer = new THREE.Vector3(0, 0, 0);
  private currentPointer = new THREE.Vector3(0, 0, 0);

  // Entrance & Exit progress (0..1)
  private entranceProgress = 1;
  private exitProgress = 0;

  constructor(container: HTMLElement, options?: PdcaSystemOptions) {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    this.camera.position.set(0, 0, 7.8);

    // 2. Geometry & Shader Material (1 Single Draw Call, Static Points)
    const { geometry } = createPdcaParticleGeometry();
    this.material = createPdcaMaterial();
    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);

    // 3. Renderer with optimal settings
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio : 1,
        2.0
      );
      this.renderer.setPixelRatio(dpr);
      this.material.uniforms.uPixelRatio.value = dpr;

      this.renderer.setClearColor(0x000000, 0);
      this.renderer.domElement.style.width = "100%";
      this.renderer.domElement.style.height = "100%";
      this.renderer.domElement.style.display = "block";
      this.renderer.domElement.style.pointerEvents = "none";
      this.container.appendChild(this.renderer.domElement);
    } catch (e) {
      console.warn("PdcaParticleSystem: WebGL initialization failed", e);
    }

    // 4. Resize initial
    this.resize();

    // 5. Visibility observer to pause RAF when offscreen (100% idle GPU savings)
    if (typeof IntersectionObserver !== "undefined") {
      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          this.isVisible = entry ? entry.isIntersecting : false;
          options?.onVisibilityChange?.(this.isVisible);

          if (this.isVisible && !this.animationFrameId) {
            this.animate();
          } else if (!this.isVisible && this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
        },
        { threshold: 0.05 }
      );
      this.observer.observe(this.container);
    }

    // 6. Start loop
    this.animate();
  }

  public setEntrance(progress: number) {
    this.entranceProgress = THREE.MathUtils.clamp(progress, 0, 1);
    this.material.uniforms.uEntrance.value = this.entranceProgress;
  }

  public setExit(progress: number) {
    this.exitProgress = THREE.MathUtils.clamp(progress, 0, 1);
    this.material.uniforms.uExit.value = this.exitProgress;
  }

  public setPointer(ndcX: number, ndcY: number, active: boolean) {
    if (!active) {
      this.targetPointer.z = 0; // Inactive
      return;
    }

    // Unproject NDC (-1 to 1) onto Z=0 world plane
    const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
    vector.unproject(this.camera);
    vector.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / vector.z;
    const worldPos = this.camera.position
      .clone()
      .add(vector.multiplyScalar(distance));

    this.targetPointer.set(worldPos.x, worldPos.y, 1.0);
  }

  public resize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;
    this.camera.aspect = aspect;

    // Adjust camera distance for narrower viewports to keep entire diagram visible
    if (aspect < 1.0) {
      this.camera.position.z = 7.8 / Math.max(0.65, aspect);
    } else {
      this.camera.position.z = 7.8;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private animate = () => {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }

    const elapsedTime = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = elapsedTime;

    // Smooth inertia lerp for pointer (spring-damper response like the ant)
    if (this.targetPointer.z > 0.5) {
      this.currentPointer.x += (this.targetPointer.x - this.currentPointer.x) * 0.16;
      this.currentPointer.y += (this.targetPointer.y - this.currentPointer.y) * 0.16;
      this.currentPointer.z = 1.0;
    } else {
      // Return smoothly when pointer leaves
      this.currentPointer.z *= 0.88;
      if (this.currentPointer.z < 0.01) {
        this.currentPointer.z = 0.0;
      }
    }
    this.material.uniforms.uPointer.value.copy(this.currentPointer);

    // Subtle gentle 3D tilt reactive to pointer
    if (this.currentPointer.z > 0.01) {
      this.points.rotation.y = (this.currentPointer.x / 4.0) * 0.08 * this.currentPointer.z;
      this.points.rotation.x = -(this.currentPointer.y / 4.0) * 0.08 * this.currentPointer.z;
    } else {
      this.points.rotation.y *= 0.92;
      this.points.rotation.x *= 0.92;
    }

    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.points.geometry.dispose();
    this.material.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(
          this.renderer.domElement
        );
      }
      this.renderer = null;
    }
  }
}
