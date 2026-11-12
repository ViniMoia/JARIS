import * as THREE from "three";

export interface CameraFitResult {
  halfWidth: number;
  halfHeight: number;
  antHeightPx: number;
}

const ANT_HALF_HEIGHT = 1.0;
const ANT_HALF_WIDTH = 0.84;

/**
 * Creates a frontal OrthographicCamera positioned along +Z looking at the origin.
 */
export function createAntCamera(): THREE.OrthographicCamera {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  return camera;
}

/**
 * Updates orthographic frustum bounds so the ant silhouette stays centered
 * and proportionally framed across desktop, tablet, and narrow mobile screens.
 */
export function updateAntCameraFrustum(
  camera: THREE.OrthographicCamera,
  viewportWidth: number,
  viewportHeight: number,
  fillRatio: number
): CameraFitResult {
  const safeW = Math.max(1, viewportWidth);
  const safeH = Math.max(1, viewportHeight);
  const viewportAspect = safeW / safeH;

  // Allow slightly wider relative fill on portrait screens so the ant remains legible
  const horizontalFill = Math.min(0.84, fillRatio + 0.08);

  let halfHeight = ANT_HALF_HEIGHT / fillRatio;
  let halfWidth = halfHeight * viewportAspect;

  const minHalfWidth = ANT_HALF_WIDTH / horizontalFill;
  if (halfWidth < minHalfWidth) {
    halfWidth = minHalfWidth;
    halfHeight = halfWidth / viewportAspect;
  }

  camera.left = -halfWidth;
  camera.right = halfWidth;
  camera.top = halfHeight;
  camera.bottom = -halfHeight;
  camera.updateProjectionMatrix();

  const antHeightPx = safeH * (ANT_HALF_HEIGHT / halfHeight);

  return {
    halfWidth,
    halfHeight,
    antHeightPx,
  };
}

