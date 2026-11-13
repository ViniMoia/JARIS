"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AntParticleSystem } from "./particles/ParticleSystem";
import { VesperBrainSystem } from "./vesper/VesperBrainSystem";
import { BrainSplitOverlay } from "./BrainSplitOverlay";
import { ScrollIndicator } from "./ScrollIndicator";

const AntParticleScene = dynamic(
  () => import("./AntParticleScene").then((mod) => mod.AntParticleScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#ffffff]" />,
  }
);

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function HeroExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const vesperContainerRef = useRef<HTMLDivElement | null>(null);
  const antContainerRef = useRef<HTMLDivElement | null>(null);

  const systemRef = useRef<AntParticleSystem | null>(null);
  const vesperSystemRef = useRef<VesperBrainSystem | null>(null);
  const morphProgressRef = useRef(0);

  const handleSystemReady = useCallback((system: AntParticleSystem | null) => {
    systemRef.current = system;
    if (system) {
      system.setMorphProgress(morphProgressRef.current);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const indicator = scrollIndicatorRef.current;
    const overlay = overlayRef.current;
    const vesperContainer = vesperContainerRef.current;
    const antContainer = antContainerRef.current;
    if (!section || !stage || !overlay || !vesperContainer) return;

    // Initialize original Vesper Brain 3D System
    const vesperSystem = new VesperBrainSystem(vesperContainer);
    vesperSystemRef.current = vesperSystem;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const revealItems = Array.from(
      overlay.querySelectorAll<HTMLElement>("[data-brain-reveal]")
    );
    const interactiveElements = Array.from(
      overlay.querySelectorAll<HTMLElement>("a, button, [data-brain-cta]")
    );

    let headerRevealed = false;
    let headerGlass = false;

    const syncStage = (scrollProgress: number) => {
      // 1. Ant burst & fade out as scroll reaches the mid-stage
      const morphP = Math.min(1, Math.max(0, scrollProgress / 0.50));
      morphProgressRef.current = morphP;
      systemRef.current?.setMorphProgress(morphP);

      if (antContainer) {
        const antAlpha = Math.max(0, 1 - smoothstep(0.24, 0.48, scrollProgress));
        antContainer.style.opacity = antAlpha.toFixed(3);
      }

      // 2. Outro progression (Stage 02 -> Dobra 02)
      // Generous outro window: 25% of 3.8vh = ~0.95vh of dedicated scroll distance
      const outro = clamp((scrollProgress - 0.75) / 0.25, 0, 1);
      const brainProgress = clamp(scrollProgress / 0.58, 0, 1);
      vesperSystem.setScrollProgress(brainProgress, outro);

      if (indicator) {
        const indicatorAlpha = Math.max(0, 1 - scrollProgress / 0.08);
        indicator.style.opacity = indicatorAlpha.toFixed(3);
        indicator.style.transform = reducedMotion
          ? "translate(-50%, 0)"
          : `translate(-50%, ${((1 - indicatorAlpha) * -10).toFixed(2)}px)`;
      }

      // 3. Hero overlay copy & header reveal & exit fade
      // Reveals between 0.52 and 0.64; fades out gently during the initial rotation phase (outro 0.0 -> 0.30)
      const revealIn = smoothstep(0.52, 0.64, scrollProgress);
      const outroFade = 1 - smoothstep(0.0, 0.30, outro);
      const overlayAlpha = revealIn * outroFade;
      overlay.style.opacity = overlayAlpha.toFixed(3);

      const interactive = scrollProgress >= 0.60 && outro <= 0.05;
      overlay.setAttribute("aria-hidden", interactive ? "false" : "true");
      interactiveElements.forEach((el) => {
        el.style.pointerEvents = interactive ? "auto" : "none";
      });

      for (let i = 0; i < revealItems.length; i++) {
        const item = revealItems[i];
        const start = 0.52 + i * 0.022;
        const end = Math.min(0.68, start + 0.09);
        const itemAlpha = smoothstep(start, end, scrollProgress) * outroFade;
        item.style.opacity = itemAlpha.toFixed(3);
        if (!reducedMotion) {
          const offsetY = (1 - smoothstep(start, end, scrollProgress)) * 18;
          item.style.transform = `translate3d(0, ${offsetY.toFixed(2)}px, 0)`;
        }
      }

      // 4. Synchronize global fixed header:
      // Completely hidden during initial ant phase; reveals when brain forms (scrollProgress >= 0.50);
      // acquires frosted glass backdrop during outro and subsequent dobras (scrollProgress >= 0.78).
      let nextRevealed = headerRevealed;
      if (scrollProgress >= 0.50) {
        nextRevealed = true;
      } else if (scrollProgress < 0.46) {
        nextRevealed = false;
      }

      let nextGlass = headerGlass;
      if (scrollProgress >= 0.78) {
        nextGlass = true;
      } else if (scrollProgress < 0.74) {
        nextGlass = false;
      }

      if (nextRevealed !== headerRevealed || nextGlass !== headerGlass) {
        headerRevealed = nextRevealed;
        headerGlass = nextGlass;
        window.dispatchEvent(
          new CustomEvent("jaris:hero-stage", {
            detail: {
              isRevealed: headerRevealed,
              isGlass: headerGlass,
            },
          })
        );
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      systemRef.current?.setPointerFromNormalizedDevice(ndcX, ndcY, true);
      vesperSystem.setPointerNdc(ndcX, ndcY, true);
    };

    const handlePointerLeave = () => {
      systemRef.current?.setPointerFromNormalizedDevice(0, 0, false);
      vesperSystem.setPointerNdc(-10, -10, false);
    };

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);

    const ctx = gsap.context(() => {
      syncStage(0);

      ScrollTrigger.create({
        trigger: section,
        pin: stage,
        pinType: "fixed",
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 4.2)}`,
        scrub: reducedMotion ? false : 0.85,
        onUpdate: (self) => {
          syncStage(self.progress);
        },
      });
    }, sectionRef);

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      vesperSystem.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Experiência interativa JARIS"
      className="relative w-full bg-[#ffffff]"
    >
      <div
        ref={stageRef}
        className="relative h-[100dvh] w-full overflow-hidden bg-[#ffffff]"
      >
        {/* Layer 1: Vesper 3D Brain Stage (130k particles with Normal Blending on pure white canvas) */}
        <div ref={vesperContainerRef} className="absolute inset-0 z-0" />

        {/* Layer 2: Ant Particle Scene (Estado 01 pure white background and orange particles) */}
        <div ref={antContainerRef} className="absolute inset-0 z-[1] transition-opacity duration-300">
          <AntParticleScene onSystemReady={handleSystemReady} />
        </div>

        {/* Layer 3: Split Overlay Copy & Indicator */}
        <BrainSplitOverlay ref={overlayRef} />
        <ScrollIndicator ref={scrollIndicatorRef} />
      </div>
    </section>
  );
}
