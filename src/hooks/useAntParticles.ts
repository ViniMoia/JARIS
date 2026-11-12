"use client";

import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AntParticleSystem } from "@/components/hero/particles/ParticleSystem";
import { usePointerPosition } from "./usePointerPosition";

export interface UseAntParticlesResult {
  webglAvailable: boolean;
}

const emptySubscribe = () => () => {};

function getWebGLSnapshot(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return true;
}

/**
 * Manages the lifecycle of AntParticleSystem inside a DOM container,
 * connecting pointer input, optional external controller registration,
 * and disposing WebGL resources on unmount.
 */
export function useAntParticles(
  containerRef: RefObject<HTMLDivElement | null>,
  onSystemReady?: (system: AntParticleSystem | null) => void
): UseAntParticlesResult {
  const systemRef = useRef<AntParticleSystem | null>(null);
  const webglSupported = useSyncExternalStore(
    emptySubscribe,
    getWebGLSnapshot,
    getServerSnapshot
  );
  const [initFailed, setInitFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !webglSupported) return;

    let system: AntParticleSystem | null = null;
    try {
      system = new AntParticleSystem(container);
      systemRef.current = system;
      onSystemReady?.(system);
    } catch {
      queueMicrotask(() => setInitFailed(true));
      return;
    }

    return () => {
      onSystemReady?.(null);
      systemRef.current = null;
      system?.dispose();
    };
  }, [containerRef, webglSupported, onSystemReady]);

  const handlePointer = useCallback(
    (ndcX: number, ndcY: number, active: boolean) => {
      systemRef.current?.setPointerFromNormalizedDevice(ndcX, ndcY, active);
    },
    []
  );

  usePointerPosition(containerRef, handlePointer);

  return { webglAvailable: webglSupported && !initFailed };
}
