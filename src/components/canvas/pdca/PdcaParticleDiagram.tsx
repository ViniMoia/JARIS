"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { PdcaParticleSystem } from "./PdcaParticleSystem";

export interface PdcaDiagramRef {
  setEntrance: (val: number) => void;
  setExit: (val: number) => void;
}

export interface PdcaParticleDiagramProps {
  activeStep?: string | null;
  onStepHover?: (stepId: string | null) => void;
}

export const PdcaParticleDiagram = forwardRef<
  PdcaDiagramRef,
  PdcaParticleDiagramProps
>(function PdcaParticleDiagram({ activeStep, onStepHover }, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const systemRef = useRef<PdcaParticleSystem | null>(null);
  const [mounted, setMounted] = useState(false);

  const entranceRef = useRef(1);
  const exitRef = useRef(0);

  const updateHudStyles = useCallback((ent: number, ext: number) => {
    if (!hudRef.current) return;
    const hudOpacity = Math.max(
      0,
      Math.min(1, ent * 1.5) * (1 - ext * 1.3)
    );
    const hudScale = 0.85 + 0.15 * ent - 0.2 * ext;
    hudRef.current.style.opacity = hudOpacity.toFixed(3);
    hudRef.current.style.transform = `scale(${hudScale.toFixed(3)})`;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setEntrance: (val: number) => {
        entranceRef.current = val;
        systemRef.current?.setEntrance(val);
        updateHudStyles(val, exitRef.current);
      },
      setExit: (val: number) => {
        exitRef.current = val;
        systemRef.current?.setExit(val);
        updateHudStyles(entranceRef.current, val);
      },
    }),
    [updateHudStyles]
  );

  useEffect(() => {
    setMounted(true);
    const container = containerRef.current;
    if (!container) return;

    const system = new PdcaParticleSystem(container);
    systemRef.current = system;

    system.setEntrance(entranceRef.current);
    system.setExit(exitRef.current);
    updateHudStyles(entranceRef.current, exitRef.current);

    const handleResize = () => {
      system.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      system.destroy();
      systemRef.current = null;
    };
  }, [updateHudStyles]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!systemRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      systemRef.current.setPointer(ndcX, ndcY, true);
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    if (!systemRef.current) return;
    systemRef.current.setPointer(0, 0, false);
    onStepHover?.(null);
  }, [onStepHover]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative aspect-square w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[540px] select-none mx-auto cursor-crosshair"
      style={{ touchAction: "none" }}
      aria-label="Diagrama 3D interativo do Ciclo PDCA e Inteligência Artificial"
      role="img"
    >
      {/* 
        Center Hub & Node Labels Overlay:
        Synchronized with 3D coordinate space for razor-sharp Retina typography
      */}
      {mounted && (
        <div
          ref={hudRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200"
          style={{
            transformOrigin: "center center",
          }}
        >
          {/* Ambient Warm Radial Glow behind the central hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-44 sm:size-52 rounded-full bg-[#D95B26]/8 blur-3xl pointer-events-none" />

          {/* Central Hub Disc */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-28 sm:size-32 rounded-full border border-black/8 bg-white/95 shadow-[0_8px_24px_rgba(217,91,38,0.08)] backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <span className="font-sans text-[0.62rem] sm:text-[0.68rem] font-bold tracking-[0.18em] text-[#1D1D1F] uppercase">
              CICLO
            </span>
            <span className="font-sans text-sm sm:text-base font-extrabold tracking-wider text-[#D95B26] leading-none my-0.5">
              PDCA
            </span>
            <span className="font-sans text-[0.60rem] sm:text-[0.65rem] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              + IA
            </span>
          </div>

          {/* Node P (Top: 90 deg) */}
          <div
            className={`pointer-events-auto absolute top-[8%] left-1/2 -translate-x-1/2 size-12 sm:size-14 rounded-full border-2 bg-white/90 shadow-sm flex items-center justify-center transition-all duration-300 ${
              activeStep === "P"
                ? "border-[#D95B26] scale-110 shadow-[0_0_18px_rgba(217,91,38,0.35)]"
                : "border-[#D95B26]/30 hover:border-[#D95B26] hover:scale-105"
            }`}
            onPointerEnter={() => onStepHover?.("P")}
          >
            <span className="pointer-events-none font-sans text-lg sm:text-xl font-black text-[#D95B26]">
              P
            </span>
          </div>

          {/* Node D (Right: 0 deg) */}
          <div
            className={`pointer-events-auto absolute top-1/2 right-[8%] -translate-y-1/2 size-12 sm:size-14 rounded-full border-2 bg-white/90 shadow-sm flex items-center justify-center transition-all duration-300 ${
              activeStep === "D"
                ? "border-[#D95B26] scale-110 shadow-[0_0_18px_rgba(217,91,38,0.35)]"
                : "border-[#D95B26]/30 hover:border-[#D95B26] hover:scale-105"
            }`}
            onPointerEnter={() => onStepHover?.("D")}
          >
            <span className="pointer-events-none font-sans text-lg sm:text-xl font-black text-[#D95B26]">
              D
            </span>
          </div>

          {/* Node C (Bottom: 270 deg) */}
          <div
            className={`pointer-events-auto absolute bottom-[8%] left-1/2 -translate-x-1/2 size-12 sm:size-14 rounded-full border-2 bg-white/90 shadow-sm flex items-center justify-center transition-all duration-300 ${
              activeStep === "C"
                ? "border-[#D95B26] scale-110 shadow-[0_0_18px_rgba(217,91,38,0.35)]"
                : "border-[#D95B26]/30 hover:border-[#D95B26] hover:scale-105"
            }`}
            onPointerEnter={() => onStepHover?.("C")}
          >
            <span className="pointer-events-none font-sans text-lg sm:text-xl font-black text-[#D95B26]">
              C
            </span>
          </div>

          {/* Node A (Left: 180 deg) */}
          <div
            className={`pointer-events-auto absolute top-1/2 left-[8%] -translate-y-1/2 size-12 sm:size-14 rounded-full border-2 bg-white/90 shadow-sm flex items-center justify-center transition-all duration-300 ${
              activeStep === "A"
                ? "border-[#D95B26] scale-110 shadow-[0_0_18px_rgba(217,91,38,0.35)]"
                : "border-[#D95B26]/30 hover:border-[#D95B26] hover:scale-105"
            }`}
            onPointerEnter={() => onStepHover?.("A")}
          >
            <span className="pointer-events-none font-sans text-lg sm:text-xl font-black text-[#D95B26]">
              A
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
