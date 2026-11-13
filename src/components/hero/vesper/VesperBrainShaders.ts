import * as THREE from "three";

export const VESPER_BRAIN_CONFIG = {
  /** Bottom/base: Rich, deep terracotta-amber orange for high contrast on white */
  colorCool: "#C45500",
  /** Top/cortex: Vibrant luminous golden-orange */
  colorWarm: "#FF8C00",
  /** Silhouette edge: Crisp electric orange */
  colorEdge: "#E66700",
  /** Internal crevices and folds: Rich deep amber-copper (volumetric depth) */
  colorCenter: "#9E3B00",
  /** Synaptic firing: Fiery saturated high-energy orange pulse */
  colorSynapse: "#FF4500",
  /** Deep occlusion shadow in brain fissures */
  colorDeep: "#822E00",
  /** Cursor neuron highlight: Radiant golden amber */
  colorCursor: "#FFA000",
  centerRadius: 0.37,
  centerFalloff: 4,
  size: 0.074,
  synapseRate: 0.12,
  flowSpeed: 2.3,
  flowAmount: 0.025,
  glow: 1.0,
  depthDarkness: 0.5,
  radius: 1.15,
  countDesktop: 130000,
  countLaptop: 90000,
  countTablet: 50000,
  countMobile: 26000,
  cursorTilt: 0.22,
  scrollSpin: 0.0,
  baseRotationY: -1.484, // -85 deg (pure lateral profile matching user reference)
  baseRotationX: 0.0, // 0 deg (neutral eye-level horizon, neither top-down nor bottom-up)
  approach: 2.5,
} as const;

export const VESPER_BRAIN_VERTEX_SHADER = /* glsl */ `
  attribute float aSeed;
  attribute float aOcclusion;
  attribute vec3 aNormal;

  uniform float iTime;
  uniform float iResolutionY;
  uniform float uSize;
  uniform float uSynapseRate;
  uniform float uCenterRadius;
  uniform float uFlowSpeed;
  uniform float uFlowAmount;
  uniform vec3 uHighlightPos;
  uniform float uHighlightRadius;
  uniform float uHighlightStrength;
  uniform float uExplode;
  uniform float uExplodeDist;
  uniform vec2 uMouse;
  uniform float uCursor;
  uniform float uAspect;
  uniform float uCursorRadius;

  varying float vSeed;
  varying float vSynapse;
  varying float vHemi;
  varying float vDepth;
  varying float vFrontness;
  varying float vCenterness;
  varying float vOcclusion;
  varying float vHighlight;
  varying float vFar;
  varying float vCursor;
  varying vec3 vWorldPos;

  void main() {
    vSeed = aSeed;
    vOcclusion = aOcclusion;
    vec3 p = position;
    vWorldPos = p;
    vHemi = step(0.0, p.x);

    vHighlight = (1.0 - smoothstep(0.0, uHighlightRadius, distance(position, uHighlightPos))) * uHighlightStrength;
    vec3 focalDir = normalize(uHighlightPos + vec3(1e-5));
    float align = dot(normalize(position + vec3(1e-5)), focalDir);
    vFar = smoothstep(0.55, -0.35, align);

    vec3 rad = normalize(p + vec3(1e-5));
    float breathe = sin(iTime * 1.6 + aSeed * 6.0) * 0.012;
    p += rad * breathe;

    vec3 nrm = normalize(aNormal + vec3(1e-5));
    vec3 ref = abs(nrm.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tA = normalize(cross(nrm, ref));
    vec3 tB = cross(nrm, tA);
    float ph = iTime * uFlowSpeed + aSeed * 6.2831;
    vec3 loopDir = tA * cos(ph) + tB * sin(ph);
    p += loopDir * uFlowAmount;

    vec3 exDir = normalize(rad + vec3(sin(aSeed * 41.0), cos(aSeed * 57.0), sin(aSeed * 73.0)) * 0.45);
    p += exDir * uExplode * uExplodeDist;

    float period = mix(3.0, 9.0, aSeed);
    float firePhase = aSeed * period;
    float ft = mod(iTime + firePhase, period);
    float fire = pow(clamp(1.0 - ft / 0.4, 0.0, 1.0), 2.5);
    if (aSeed > uSynapseRate) fire = 0.0;
    vSynapse = fire;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 centerMv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float rel = centerMv.z - mv.z;
    vFrontness = clamp(rel * 0.6 + 0.5, 0.0, 1.0);

    gl_Position = projectionMatrix * mv;

    vec4 centerClip = projectionMatrix * centerMv;
    vec2 centerNDC = centerClip.xy / max(0.0001, centerClip.w);
    vec2 pNDC = gl_Position.xy / max(0.0001, gl_Position.w);
    float screenDist = length(pNDC - centerNDC);
    vCenterness = 1.0 - clamp(screenDist / max(0.05, uCenterRadius), 0.0, 1.0);

    vec2 dMouse = pNDC - uMouse;
    dMouse.x *= uAspect;
    vCursor = (1.0 - smoothstep(0.0, uCursorRadius, length(dMouse))) * uCursor;

    float safeDepth = max(1.8, -mv.z);
    float baseSize = uSize * (iResolutionY / 720.0) * (200.0 / safeDepth);
    gl_PointSize = baseSize * (1.0 + fire * 1.5 + vHighlight * 1.8 + vCursor * 1.3);
    vDepth = -mv.z;
  }
`;

export const VESPER_BRAIN_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uCool;
  uniform vec3 uWarm;
  uniform vec3 uEdgeColor;
  uniform vec3 uCenterColor;
  uniform float uCenterFalloff;
  uniform vec3 uSynapse;
  uniform float iAlpha;
  uniform float uGlow;
  uniform float uDepthDarkness;
  uniform vec3 uDeepColor;
  uniform float uOcclusionStrength;
  uniform vec3 uHighlightColor;
  uniform float uHighlightStrength;
  uniform float uFocusFadeStrength;
  uniform float uIsolateStrength;
  uniform float uExplode;
  uniform vec3 uCursorColor;

  varying float vSeed;
  varying float vSynapse;
  varying float vHemi;
  varying float vDepth;
  varying float vFrontness;
  varying float vCenterness;
  varying float vOcclusion;
  varying float vHighlight;
  varying float vFar;
  varying float vCursor;
  varying vec3 vWorldPos;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p);
    if (r > 0.5) discard;

    // Smooth radial falloff for natural anti-aliased particle volume on white
    float core = pow(smoothstep(0.5, 0.0, r), 1.6);
    float t = pow(vCenterness, max(0.05, uCenterFalloff));

    float vt = clamp(smoothstep(-0.7, 0.9, vWorldPos.y) + vSeed * 0.12, 0.0, 1.0);
    vec3 grad = mix(uCool, uWarm, vt);
    vec3 base = mix(grad, uCenterColor, t * 0.5);
    base = mix(base, uEdgeColor, (1.0 - t) * 0.25);
    base = mix(base, uDeepColor, clamp(vOcclusion * uOcclusionStrength, 0.0, 1.0));

    vec3 col = base;
    // Synapse firing: high-energy saturated fiery orange pulse
    col = mix(col, uSynapse, vSynapse * 0.9);
    col = mix(col, uHighlightColor, vHighlight * 0.5);
    col += uHighlightColor * vHighlight * 0.3;

    float nonFocus = (1.0 - vHighlight) * uHighlightStrength;
    col = mix(col, uDeepColor, nonFocus * uIsolateStrength * 0.5);

    // In NormalBlending against white, alphaOut sculpts the 3D volume:
    // Overlapping particles accumulate opacity smoothly without creating flat opaque blocks.
    float baseAlpha = 0.36;
    float alphaOut = core * iAlpha * (baseAlpha + vFrontness * 0.22);
    alphaOut *= 1.0 + vHighlight * 0.7;
    alphaOut += vCursor * core * 0.35;
    alphaOut += vSynapse * core * 0.55;

    float focusDim = 1.0 - uHighlightStrength * uFocusFadeStrength * vFar;
    alphaOut *= focusDim;
    alphaOut *= 1.0 - smoothstep(0.4, 1.2, uExplode) * 0.7;
    alphaOut = clamp(alphaOut, 0.0, 1.0);

    gl_FragColor = vec4(col, alphaOut);
  }
`;

export function hexToLinearVec3(hex: string): THREE.Vector3 {
  const color = new THREE.Color(hex);
  // Three.js Color constructor already converts sRGB hex to linear-sRGB.
  // Returning the linear RGB components directly preserves the intended green channel
  // and prevents shifting warm oranges into crimson/red.
  return new THREE.Vector3(color.r, color.g, color.b);
}

