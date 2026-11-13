import * as THREE from "three";

export const PdcaVertexShader = /* glsl */ `
  attribute vec3 aOrigin;
  attribute vec3 aExit;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  attribute float aType;

  uniform float uTime;
  uniform float uEntrance;
  uniform float uExit;
  uniform vec3 uPointer; // x, y: world coordinates, z: active (1.0) or inactive (0.0)
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    // 1. Static base target position (NO drifting or running particles)
    vec3 targetPos = position;

    // 2. Interactive mouse pointer repulsion physics (similar to the ant in fold 1)
    if (uPointer.z > 0.5) {
      vec2 delta = targetPos.xy - uPointer.xy;
      float distSq = dot(delta, delta);
      float radius = 1.35;
      if (distSq < radius * radius && distSq > 0.0001) {
        float dist = sqrt(distSq);
        float falloff = 1.0 - (dist / radius);
        float impulse = falloff * falloff * 0.55;
        targetPos.xy += (delta / dist) * impulse;
        targetPos.z += falloff * 0.40;
      }
    }

    // 3. Entrance assembly interpolation: from scattered aOrigin to targetPos
    float entEase = smoothstep(0.0, 1.0, uEntrance);
    vec3 currentPos = mix(aOrigin, targetPos, entEase);

    // 4. Exit dispersion: exploding smoothly along aExit when exiting the fold
    float exitEase = smoothstep(0.0, 1.0, uExit);
    currentPos += aExit * (exitEase * exitEase * 1.4);

    // Alpha calculation: fade in on entrance, stay 100% visible, fade out only on exit
    float alpha = aAlpha * entEase * (1.0 - smoothstep(0.35, 1.0, uExit));
    vAlpha = max(0.0, alpha);

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Responsive point size with distance attenuation
    float sizeFactor = (300.0 / -mvPosition.z);
    gl_PointSize = aSize * uPixelRatio * (sizeFactor / 50.0);
    
    // Scale down to zero only during exit dispersion
    gl_PointSize *= entEase * (1.0 - smoothstep(0.65, 1.0, uExit));
  }
`;

export const PdcaFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Circle mask with smooth antialiased edge
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distSq = dot(coord, coord);
    if (distSq > 0.25) {
      discard;
    }

    // Soft antialiasing on outer radius
    float edge = smoothstep(0.25, 0.16, distSq);
    float finalAlpha = vAlpha * edge;

    if (finalAlpha <= 0.01) {
      discard;
    }

    gl_FragColor = vec4(vColor, finalAlpha);
  }
`;

export function createPdcaMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: PdcaVertexShader,
    fragmentShader: PdcaFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uEntrance: { value: 0 },
      uExit: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uPixelRatio: { value: 1.0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
}
