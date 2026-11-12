"use client";

import { useRef } from "react";
import { AntParticleSystem } from "@/components/hero/particles/ParticleSystem";
import { useAntParticles } from "@/hooks/useAntParticles";

export interface AntParticleSceneProps {
  onSystemReady?: (system: AntParticleSystem | null) => void;
}

export function AntParticleScene({ onSystemReady }: AntParticleSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { webglAvailable } = useAntParticles(containerRef, onSystemReady);

  return (
    <div
      ref={containerRef}
      aria-label="Formação tridimensional minimalista em partículas da identidade JARIS"
      role="img"
      className="relative h-full w-full bg-[#ffffff] select-none"
    >
      {!webglAvailable && (
        <div className="flex h-full w-full items-center justify-center bg-[#ffffff] text-xs font-medium tracking-[0.2em] text-[#4b5563] uppercase">
          WebGL indisponível neste dispositivo
        </div>
      )}
    </div>
  );
}
