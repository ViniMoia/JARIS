import * as THREE from "three";
import {
  hexToLinearVec3,
  VESPER_BRAIN_CONFIG,
  VESPER_BRAIN_FRAGMENT_SHADER,
  VESPER_BRAIN_VERTEX_SHADER,
} from "./VesperBrainShaders";

export interface VesperBrainUniforms {
  [uniform: string]: THREE.IUniform;
  iTime: THREE.IUniform<number>;
  iAlpha: THREE.IUniform<number>;
  iResolutionY: THREE.IUniform<number>;
  uCool: THREE.IUniform<THREE.Vector3>;
  uWarm: THREE.IUniform<THREE.Vector3>;
  uEdgeColor: THREE.IUniform<THREE.Vector3>;
  uCenterColor: THREE.IUniform<THREE.Vector3>;
  uSynapse: THREE.IUniform<THREE.Vector3>;
  uDeepColor: THREE.IUniform<THREE.Vector3>;
  uCursorColor: THREE.IUniform<THREE.Vector3>;
  uHighlightColor: THREE.IUniform<THREE.Vector3>;
  uCenterRadius: THREE.IUniform<number>;
  uCenterFalloff: THREE.IUniform<number>;
  uSize: THREE.IUniform<number>;
  uSynapseRate: THREE.IUniform<number>;
  uFlowSpeed: THREE.IUniform<number>;
  uFlowAmount: THREE.IUniform<number>;
  uGlow: THREE.IUniform<number>;
  uDepthDarkness: THREE.IUniform<number>;
  uOcclusionStrength: THREE.IUniform<number>;
  uHighlightPos: THREE.IUniform<THREE.Vector3>;
  uHighlightRadius: THREE.IUniform<number>;
  uHighlightStrength: THREE.IUniform<number>;
  uFocusFadeStrength: THREE.IUniform<number>;
  uIsolateStrength: THREE.IUniform<number>;
  uExplode: THREE.IUniform<number>;
  uExplodeDist: THREE.IUniform<number>;
  uMouse: THREE.IUniform<THREE.Vector2>;
  uCursor: THREE.IUniform<number>;
  uAspect: THREE.IUniform<number>;
  uCursorRadius: THREE.IUniform<number>;
}

export function createVesperBrainMaterial(
  viewportHeight: number,
  pixelRatio: number,
  aspect: number
): { material: THREE.ShaderMaterial; uniforms: VesperBrainUniforms } {
  const uniforms: VesperBrainUniforms = {
    iTime: { value: 0 },
    iAlpha: { value: 0 },
    iResolutionY: { value: viewportHeight * pixelRatio },
    uCool: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorCool) },
    uWarm: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorWarm) },
    uEdgeColor: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorEdge) },
    uCenterColor: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorCenter) },
    uSynapse: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorSynapse) },
    uDeepColor: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorDeep) },
    uCursorColor: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorCursor) },
    uHighlightColor: { value: hexToLinearVec3(VESPER_BRAIN_CONFIG.colorWarm) },
    uCenterRadius: { value: VESPER_BRAIN_CONFIG.centerRadius },
    uCenterFalloff: { value: VESPER_BRAIN_CONFIG.centerFalloff },
    uSize: { value: VESPER_BRAIN_CONFIG.size },
    uSynapseRate: { value: VESPER_BRAIN_CONFIG.synapseRate },
    uFlowSpeed: { value: VESPER_BRAIN_CONFIG.flowSpeed },
    uFlowAmount: { value: VESPER_BRAIN_CONFIG.flowAmount },
    uGlow: { value: VESPER_BRAIN_CONFIG.glow },
    uDepthDarkness: { value: VESPER_BRAIN_CONFIG.depthDarkness },
    uOcclusionStrength: { value: 0.6 },
    uHighlightPos: { value: new THREE.Vector3(0, 0, 0) },
    uHighlightRadius: { value: 0.6 },
    uHighlightStrength: { value: 0 },
    uFocusFadeStrength: { value: 0.55 },
    uIsolateStrength: { value: 0.88 },
    uExplode: { value: 1.0 },
    uExplodeDist: { value: 5.0 },
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uCursor: { value: 0 },
    uAspect: { value: aspect },
    uCursorRadius: { value: 0.1 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VESPER_BRAIN_VERTEX_SHADER,
    fragmentShader: VESPER_BRAIN_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  return { material, uniforms };
}

