import * as THREE from "three";
import { buildVesperBrainGeometry } from "./VesperBrainGeometry";
import { createVesperBrainMaterial, VesperBrainUniforms } from "./VesperBrainMaterial";
import { hexToLinearVec3, VESPER_BRAIN_CONFIG } from "./VesperBrainShaders";

const BACKDROP_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const BACKDROP_FRAGMENT_SHADER = /* glsl */ `
  uniform float iTime;
  uniform vec3 uBg;
  uniform vec3 uFlameA;
  uniform vec3 uFlameB;
  uniform float uFlameAmt;
  uniform float uAlpha;
  varying vec2 vUv;

  vec3 warp3d(vec3 pos, float t) {
    float curv = 0.8, a = 1.9, b = 0.7;
    pos *= 2.0;
    pos.x += curv * sin(t + a * pos.y) + t * b;
    pos.y += curv * cos(t + a * pos.x);
    pos.y += curv * sin(t + a * pos.z) + t * b;
    pos.z += curv * cos(t + a * pos.y);
    pos.z += curv * sin(t + a * pos.x) + t * b;
    pos.x += curv * cos(t + a * pos.z);
    return 0.5 + 0.5 * cos(pos.xyz + vec3(1.0, 2.0, 4.0));
  }

  void main() {
    vec2 uv = 2.0 * vUv - 1.0;
    vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime * 1.5), vec3(1.5));
    vec3 flame = 1.5 * uFlameA * w.x;
    flame *= w.y;
    flame += uFlameB * w.z;
    flame *= smoothstep(0.25, 1.0, abs(uv.y));
    float md = smoothstep(-0.7, 1.0, -uv.y * uv.x);
    flame *= md * md;
    vec3 bg = uBg * (1.0 - 0.4 * length(uv));
    vec3 color = bg + flame * uFlameAmt;
    gl_FragColor = vec4(color, uAlpha);
  }
`;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function smoothstep(a: number, b: number, x: number): number {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

export class VesperBrainSystem {
  private readonly container: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly group: THREE.Group;
  private readonly brainPoints: THREE.Points;
  private readonly brainUniforms: VesperBrainUniforms;
  private readonly backdropMesh: THREE.Mesh;
  private readonly backdropUniforms: {
    iTime: THREE.IUniform<number>;
    uBg: THREE.IUniform<THREE.Vector3>;
    uFlameA: THREE.IUniform<THREE.Vector3>;
    uFlameB: THREE.IUniform<THREE.Vector3>;
    uFlameAmt: THREE.IUniform<number>;
    uAlpha: THREE.IUniform<number>;
  };

  private scrollProgress = 0;
  private pointerNdc = new THREE.Vector2(-10, -10);
  private pointerActive = false;
  private parallax = { rx: 0, ry: 0 };
  private isVisible = true;
  private isDocumentHidden = false;
  private rafId: number | null = null;
  private clock = new THREE.Clock();

  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / Math.max(1, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 400);
    this.camera.position.set(0, 0, 4.3);
    this.camera.lookAt(0, 0, 0);

    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      powerPreference: "high-performance",
      antialias: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.inset = "0";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.pointerEvents = "none";
    this.container.appendChild(this.renderer.domElement);

    // 1. Cosmic Backdrop Quad (disabled in white canvas mode to ensure clean pure white background)
    this.backdropUniforms = {
      iTime: { value: 0 },
      uBg: { value: hexToLinearVec3("#000000") },
      uFlameA: { value: hexToLinearVec3("#8b98fe") },
      uFlameB: { value: hexToLinearVec3("#6bfdff") },
      uFlameAmt: { value: 0.5 },
      uAlpha: { value: 0 },
    };
    const backdropMaterial = new THREE.ShaderMaterial({
      uniforms: this.backdropUniforms,
      vertexShader: BACKDROP_VERTEX_SHADER,
      fragmentShader: BACKDROP_FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const backdropGeo = new THREE.PlaneGeometry(2, 2);
    this.backdropMesh = new THREE.Mesh(backdropGeo, backdropMaterial);
    this.backdropMesh.frustumCulled = false;
    this.backdropMesh.renderOrder = -1;
    this.backdropMesh.visible = false;
    this.scene.add(this.backdropMesh);

    // 2. Vesper Brain Points (130k Desktop, 50k Tablet, 26k Mobile)
    const count =
      width < 640
        ? VESPER_BRAIN_CONFIG.countMobile
        : width < 1024
        ? VESPER_BRAIN_CONFIG.countTablet
        : VESPER_BRAIN_CONFIG.countDesktop;

    const brainGeometry = buildVesperBrainGeometry(count, VESPER_BRAIN_CONFIG.radius);
    const { material, uniforms } = createVesperBrainMaterial(height, dpr, aspect);
    this.brainUniforms = uniforms;

    this.brainPoints = new THREE.Points(brainGeometry, material);
    this.brainPoints.frustumCulled = false;

    this.group = new THREE.Group();
    this.group.rotation.y = VESPER_BRAIN_CONFIG.baseRotationY;
    this.group.add(this.brainPoints);
    this.scene.add(this.group);

    this.syncSize();

    this.resizeObserver = new ResizeObserver(() => {
      this.syncSize();
    });
    this.resizeObserver.observe(this.container);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.isVisible = entry ? entry.isIntersecting : true;
        if (this.isVisible && !this.isDocumentHidden) {
          this.startLoop();
        } else {
          this.stopLoop();
        }
      },
      { threshold: 0.01 }
    );
    this.intersectionObserver.observe(this.container);

    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    this.startLoop();
  }

  private handleVisibilityChange = (): void => {
    this.isDocumentHidden = document.hidden;
    if (this.isDocumentHidden) {
      this.stopLoop();
    } else if (this.isVisible) {
      this.startLoop();
    }
  };

  private syncSize(): void {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / Math.max(1, height);
    const dpr = this.renderer.getPixelRatio();

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    this.brainUniforms.iResolutionY.value = height * dpr;
    this.brainUniforms.uAspect.value = aspect;
    this.brainUniforms.uCursorRadius.value = clamp(
      (0.1 * 4.6) / this.camera.position.length(),
      0.04,
      0.13
    );
  }

  public setScrollProgress(progress: number): void {
    this.scrollProgress = clamp(progress, 0, 1);
  }

  public setPointerNdc(x: number, y: number, active: boolean): void {
    this.pointerActive = active;
    if (active) {
      this.pointerNdc.set(x, y);
    }
  }

  private startLoop(): void {
    if (this.rafId !== null) return;
    this.clock.start();
    const tick = () => {
      this.render();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private render(): void {
    const elapsedTime = this.clock.getElapsedTime();
    this.brainUniforms.iTime.value = elapsedTime;
    this.backdropUniforms.iTime.value = elapsedTime;

    // Scroll transitions:
    // When scroll = 0 (Estado 01 / Ant): backdrop and brain are 0% visible (pure white background)
    // Between scroll 0.15 and 0.78: backdrop fades in, uExplode goes from 1.0 -> 0.0 (exploding inward to form the brain!)
    // At scroll >= 0.78: Brain is 100% poised, alive and assembled in Estado 02!
    const appear = smoothstep(0.18, 0.78, this.scrollProgress);
    const backdropAlpha = smoothstep(0.15, 0.65, this.scrollProgress);
    const explode = clamp(1.0 - appear, 0, 1);

    this.backdropUniforms.uAlpha.value = backdropAlpha;
    this.brainUniforms.iAlpha.value = appear;
    this.brainUniforms.uExplode.value = explode;

    // Parallax & rotation from Vesper
    const cursorTarget = this.pointerActive ? 1 : 0;
    this.brainUniforms.uCursor.value +=
      (cursorTarget - this.brainUniforms.uCursor.value) * 0.1;

    if (this.pointerActive) {
      this.brainUniforms.uMouse.value.x +=
        (this.pointerNdc.x - this.brainUniforms.uMouse.value.x) * 0.18;
      this.brainUniforms.uMouse.value.y +=
        (this.pointerNdc.y - this.brainUniforms.uMouse.value.y) * 0.18;
    }

    const spin = clamp((this.scrollProgress - 0.5) / 0.5, 0, 1) * VESPER_BRAIN_CONFIG.scrollSpin;
    const cursor = this.brainUniforms.uCursor.value;
    const targetRy = clamp(this.pointerNdc.x, -1, 1) * VESPER_BRAIN_CONFIG.cursorTilt * cursor;
    const targetRx = -clamp(this.pointerNdc.y, -1, 1) * VESPER_BRAIN_CONFIG.cursorTilt * 0.65 * cursor;

    this.parallax.ry += (targetRy - this.parallax.ry) * 0.05;
    this.parallax.rx += (targetRx - this.parallax.rx) * 0.05;

    this.group.rotation.y = VESPER_BRAIN_CONFIG.baseRotationY + spin + this.parallax.ry;
    this.group.rotation.x = VESPER_BRAIN_CONFIG.baseRotationX + this.parallax.rx;

    this.group.visible = appear > 0.001;
    this.backdropMesh.visible = false;

    this.renderer.render(this.scene, this.camera);
  }

  public destroy(): void {
    this.stopLoop();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}

