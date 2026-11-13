"use client";

import React, { useRef, useState, useCallback } from "react";
import { OPERATIONAL_PAINS_CONFIG } from "@/lib/config/pains-config";

// --- Design System 15 Duotone & Linear SVG Icons ---

function ObjectScanIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 8V5C3 3.89543 3.89543 3 5 3H8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16 3H19C20.1046 3 21 3.89543 21 5V8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M21 16V19C21 20.1046 20.1046 21 19 21H16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8 21H5C3.89543 21 3 20.1046 3 19V16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.25" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function BoltIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        opacity="0.3"
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="currentColor"
      />
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FragmentationIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeDasharray="2 2"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeDasharray="2 2"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M10 6.5H14M6.5 10V14M17.5 10V14M10 17.5H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

function ManualIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 7V12L15.5 14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function InefficiencyIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 20H21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4 15L9 11L13 14L19 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 7H19V11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="4"
        y1="5"
        x2="20"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.4"
      />
    </svg>
  );
}

function AiNativeIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="3" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="21" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="3" cy="12" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="21" cy="12" r="2" fill="currentColor" opacity="0.8" />
      <path
        d="M12 5V8.5M12 15.5V19M5 12H8.5M15.5 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ModularIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L20 6.5V15.5L12 20L4 15.5V6.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11L20 6.5M12 11L4 6.5M12 11V20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AutomationIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );
}

function renderPainIcon(name: string) {
  switch (name) {
    case "fragmentation":
      return <FragmentationIcon className="size-5 sm:size-6" />;
    case "manual":
      return <ManualIcon className="size-5 sm:size-6" />;
    case "inefficiency":
      return <InefficiencyIcon className="size-5 sm:size-6" />;
    case "ai":
      return <AiNativeIcon className="size-5 sm:size-6" />;
    case "modular":
      return <ModularIcon className="size-5 sm:size-6" />;
    case "automation":
      return <AutomationIcon className="size-5 sm:size-6" />;
    default:
      return null;
  }
}

// --- Design System 15 Interactive Card Component with 3D Tilt & Bouncy Spring ---
interface DesignSystemCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

function DesignSystemCard({
  children,
  className = "",
  glowColor = "rgba(0, 0, 0, 0.05)",
}: DesignSystemCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
    isHovered: false,
  });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Center-normalized coordinates (-1 to 1) for 3D tilt
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;
    const tiltX = -normY * 4.5;
    const tiltY = normX * 4.5;

    setCoords({
      x,
      y,
      tiltX,
      tiltY,
      isHovered: true,
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setCoords((prev) => ({
      ...prev,
      tiltX: 0,
      tiltY: 0,
      isHovered: false,
    }));
  }, []);

  // Design System 15: transition with cubic-bezier(0.68, -0.55, 0.265, 1.55) bouncy spring
  const transformStyle = coords.isHovered
    ? `perspective(1000px) rotateX(${coords.tiltX.toFixed(2)}deg) rotateY(${coords.tiltY.toFixed(2)}deg) translateY(-8px) scale(1.025)`
    : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: transformStyle,
        transition: coords.isHovered
          ? "transform 0.12s ease-out, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
          : "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-none p-7 sm:p-10 ${className}`}
    >
      {/* Dynamic Flashlight Spotlight Zone from Design System 15 */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: coords.isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 65%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

export function OperationalPainsSection() {
  const { header, challengeCard, solutionCard, closing } =
    OPERATIONAL_PAINS_CONFIG;

  return (
    <section
      id="cenario-atual"
      aria-label="Cenário Atual — O Desafio e a Solução JARIS"
      className="relative w-full bg-[#FFFFFF] py-24 sm:py-32 lg:py-36 text-[#1D1D1F]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
        {/* 1. Section Header: Top, Left-aligned */}
        <div className="mb-14 sm:mb-16 lg:mb-20">
          <span className="mb-3 block font-sans text-[0.75rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
            {header.tag}
          </span>
          <h2 className="mb-4 font-sans text-3xl font-extrabold tracking-[-0.03em] text-[#1D1D1F] sm:text-4xl lg:text-5xl">
            Sua empresa{" "}
            <span className="text-[#D95B26]">ainda opera assim?</span>
          </h2>
          <p className="max-w-2xl font-sans text-base leading-relaxed text-zinc-600 sm:text-lg">
            {header.subtitle}
          </p>
        </div>

        {/* 2. Comparative Body: 2 Columns Side-by-Side with Design System 15 Swatch Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Card Esquerdo: NEUTRAL (Page Base - O Desafio) */}
          <DesignSystemCard
            glowColor="rgba(29, 29, 31, 0.06)"
            className="border border-black/[0.08] bg-[#F5F5F7] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)]"
          >
            <div>
              {/* Header: Neutral tag on left, object scan icon on right (faithful to reference image) */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-sans text-[0.65rem] font-bold tracking-[0.2em] text-black uppercase">
                    NEUTRAL
                  </span>
                  <span className="ml-2 font-sans text-[0.65rem] font-medium tracking-[0.1em] text-stone-500 uppercase">
                    · {challengeCard.badge}
                  </span>
                </div>
                <div className="text-black transition-transform duration-300 group-hover:scale-110">
                  <ObjectScanIcon className="size-5 text-black" />
                </div>
              </div>

              {/* Title & Meta Block */}
              <div className="mt-6 mb-8">
                <h3 className="font-sans text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                  {challengeCard.title}
                </h3>
                <div className="mt-1 font-sans text-xs text-stone-500">
                  Cenário Operacional Tradicional
                </div>
              </div>

              {/* 3 Pain Topics with interactive row microinteractions */}
              <div className="space-y-4 sm:space-y-5">
                {challengeCard.topics.map((item) => (
                  <div
                    key={item.id}
                    className="group/item flex items-start gap-4 rounded-none border border-black/[0.04] bg-white/70 p-4.5 backdrop-blur-sm transition-all duration-300 hover:translate-x-2 hover:border-black/[0.1] hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)] sm:p-5"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-none bg-black/[0.04] text-zinc-700 transition-colors duration-300 group-hover/item:bg-[#1D1D1F] group-hover/item:text-white sm:size-12">
                      {renderPainIcon(item.iconName)}
                    </div>
                    <div>
                      <h4 className="font-sans text-[0.9375rem] font-bold text-[#1D1D1F] sm:text-[1rem]">
                        {item.title}
                      </h4>
                      <p className="mt-1 font-sans text-[0.8125rem] leading-snug text-zinc-600 sm:text-[0.875rem]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DesignSystemCard>

          {/* Card Direito: INTERACTIVE & FOCUS (Architect White / JARIS Orange Focus) */}
          <DesignSystemCard
            glowColor="rgba(217, 91, 38, 0.12)"
            className="border border-[#D95B26]/30 bg-[#FFFFFF] shadow-[0_15px_40px_rgba(0,0,0,0.06)] ring-1 ring-[#D95B26]/20 hover:shadow-[0_30px_70px_rgba(217,91,38,0.16)]"
          >
            {/* Ambient orange glow bloom */}
            <div className="pointer-events-none absolute top-0 right-0 h-[280px] w-[280px] -translate-y-1/4 translate-x-1/4 rounded-full bg-gradient-to-bl from-[#D95B26]/12 to-transparent blur-[70px] transition-transform duration-700 group-hover:scale-125" />

            <div>
              {/* Header: Interactive & Focus tag on left, Bolt icon on right (faithful to reference image) */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-sans text-[0.65rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
                    INTERACTIVE & FOCUS
                  </span>
                  <span className="ml-2 font-sans text-[0.65rem] font-medium tracking-[0.1em] text-stone-500 uppercase">
                    · {solutionCard.badge}
                  </span>
                </div>
                <div className="text-[#D95B26] transition-transform duration-300 group-hover:scale-110">
                  <BoltIcon className="size-5 text-[#D95B26]" />
                </div>
              </div>

              {/* Title & Meta Block */}
              <div className="mt-6 mb-8">
                <h3 className="font-sans text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                  {solutionCard.title}
                </h3>
                <div className="mt-1 font-sans text-xs text-[#D95B26]">
                  Ecossistema Inteligente Unificado
                </div>
              </div>

              {/* 3 Antidote Topics with interactive row microinteractions */}
              <div className="space-y-4 sm:space-y-5">
                {solutionCard.topics.map((item) => (
                  <div
                    key={item.id}
                    className="group/item flex items-start gap-4 rounded-none border border-[#D95B26]/15 bg-[#FDFEFE] p-4.5 transition-all duration-300 hover:translate-x-2 hover:border-[#D95B26]/40 hover:bg-white hover:shadow-[0_12px_30px_rgba(217,91,38,0.1)] sm:p-5"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-none bg-[#D95B26]/10 text-[#D95B26] shadow-xs transition-all duration-300 group-hover/item:scale-105 group-hover/item:bg-[#D95B26] group-hover/item:text-white sm:size-12">
                      {renderPainIcon(item.iconName)}
                    </div>
                    <div>
                      <h4 className="font-sans text-[0.9375rem] font-bold text-[#1D1D1F] sm:text-[1rem]">
                        {item.title}
                      </h4>
                      <p className="mt-1 font-sans text-[0.8125rem] leading-snug text-zinc-600 sm:text-[0.875rem]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DesignSystemCard>
        </div>

        {/* 3. Fechamento: Síntese e Conexão de Valor */}
        <div className="mt-10 sm:mt-14">
          <div className="flex flex-col items-center justify-between gap-6 rounded-none border border-black/[0.06] bg-[#F5F5F7] p-6 sm:p-8 md:flex-row md:gap-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4">
              <div className="hidden size-2.5 shrink-0 rounded-full bg-[#D95B26] sm:block animate-pulse" />
              <p className="font-sans text-sm font-medium leading-relaxed text-[#1D1D1F] sm:text-base">
                {closing.quote}
              </p>
            </div>
            <div className="w-full shrink-0 md:w-auto">
              <a
                href={closing.ctaHref}
                className="group flex h-11 w-full items-center justify-center bg-[#D95B26] px-6 font-sans text-[0.875rem] font-medium tracking-[0.01em] text-white transition-colors duration-300 hover:bg-[#c44e1c] md:w-auto"
              >
                {closing.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
