import * as THREE from "three";
import { PARTICLE_CONFIG } from "@/lib/config/particle-config";

/**
 * Creates an optimized WebGLRenderer tailored for pure-white backgrounds
 * and mobile GPU efficiency:
 * - alpha: false avoids DOM alpha compositing
 * - antialias: false saves MSAA bandwidth (point edges are anti-aliased in GLSL)
 * - depth/stencil: false minimizes mobile tile-memory overhead
 * - NoToneMapping preserves exact #FFFFFF pure white background
 */
export function createAntRenderer(
  container: HTMLElement,
  maxPixelRatio: number
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });

  const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
  renderer.setPixelRatio(dpr);
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.setClearColor(PARTICLE_CONFIG.colors.background, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  // Allow vertical page scrolling on touch devices without trapping gestures on the canvas
  canvas.style.touchAction = "pan-y";

  return renderer;
}

