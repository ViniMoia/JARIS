import * as THREE from "three";
import { PARTICLE_CONFIG } from "@/lib/config/particle-config";

const VERTEX_SHADER = /* glsl */ `
  attribute float aSeed;
  attribute float aScale;

  varying float vSeed;
  varying float vDepth;
  varying float vDepthAlpha;

  uniform float uPointSize;
  uniform float uPixelRatio;

  void main() {
    vSeed = aSeed;
    vDepth = position.z;

    // Preserve exact orthographic silhouette near z=0 (ant & brain rest states),
    // while giving surging burst particles (+Z) subtle perspective fan-out & scale.
    float burstForward = max(0.0, position.z - 0.14);
    float burstBack = max(0.0, -position.z - 0.14);

    vec3 p = position;
    p.xy *= 1.0 + burstForward * 0.16;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

    float restCue = 1.0 + clamp(position.z * 0.55, -0.08, 0.10);
    float burstScale = 1.0 + clamp(burstForward * 0.55, 0.0, 1.25) - clamp(burstBack * 0.30, 0.0, 0.32);
    gl_PointSize = max(1.5, uPointSize * uPixelRatio * aScale * restCue * burstScale);

    // Keep large foreground edge-approaching points airy & refined on pure #FFFFFF
    vDepthAlpha = 1.0 - clamp(burstForward * 0.14, 0.0, 0.28) - clamp(burstBack * 0.18, 0.0, 0.20);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying float vSeed;
  varying float vDepth;
  varying float vDepthAlpha;

  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform float uOpacity;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);
    if (dist > 0.5) discard;

    float alpha = (1.0 - smoothstep(0.35, 0.50, dist)) * uOpacity * vDepthAlpha;
    float warmthMix = mix(vSeed, clamp(vDepth * 1.5 + 0.35, 0.0, 1.0), 0.40);
    vec3 color = mix(uColorPrimary, uColorSecondary, warmthMix);

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export function createAntParticleMaterial(
  pointSizeCss: number,
  pixelRatio: number
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uPointSize: { value: pointSizeCss },
      uPixelRatio: { value: pixelRatio },
      uColorPrimary: { value: new THREE.Color(PARTICLE_CONFIG.colors.primary) },
      uColorSecondary: { value: new THREE.Color(PARTICLE_CONFIG.colors.secondary) },
      uOpacity: { value: 0.96 },
    },
  });
}
