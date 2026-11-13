"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  MODULAR_ECOSYSTEM_CONFIG,
  type ModuleStatusType,
} from "@/lib/config/modules-config";

// --- Dedicated Minimalist Duotone SVG Icons ---

function HrIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M2 20C2 16.134 5.13401 13 9 13C12.866 13 16 16.134 16 20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle
        cx="18"
        cy="9"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <path
        d="M17 14.5C19.5 15.2 21.5 17.3 22 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

function FinanceIcon({ className = "size-5" }: { className?: string }) {
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
        r="9"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 6V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15 9.5C15 8.12 13.66 7 12 7C10.34 7 9 8.12 9 9.5C9 10.88 10.34 12 12 12C13.66 12 15 13.12 15 14.5C15 15.88 13.66 17 12 17C10.34 17 9 15.88 9 14.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SuppliesIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L21 7M12 12V22M12 12L3 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 4.5L16.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

function ContractsIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2V8H20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13H16M8 17H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="16" cy="17" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function BudgetIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="7"
        y="6"
        width="10"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.2"
      />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
      <circle cx="12" cy="13" r="1" fill="currentColor" />
      <circle cx="16" cy="13" r="1" fill="currentColor" />
      <circle cx="8" cy="17" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
      <circle cx="16" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function AiCoreIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="12" cy="21" r="1.5" fill="currentColor" />
      <circle cx="3" cy="12" r="1.5" fill="currentColor" />
      <circle cx="21" cy="12" r="1.5" fill="currentColor" />
      <path
        d="M12 5V8M12 16V19M5 12H8M16 12H19"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6.5 6.5L8.5 8.5M15.5 15.5L17.5 17.5M17.5 6.5L15.5 8.5M8.5 15.5L6.5 17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

function CheckmarkIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M13.25 4.75L6.5 11.5L2.75 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderModuleIcon(name: string) {
  switch (name) {
    case "hr":
      return <HrIcon className="size-5 sm:size-6" />;
    case "finance":
      return <FinanceIcon className="size-5 sm:size-6" />;
    case "supplies":
      return <SuppliesIcon className="size-5 sm:size-6" />;
    case "contracts":
      return <ContractsIcon className="size-5 sm:size-6" />;
    case "budget":
      return <BudgetIcon className="size-5 sm:size-6" />;
    case "ai-core":
      return <AiCoreIcon className="size-5 sm:size-6" />;
    default:
      return null;
  }
}

// Helper for status badge styling following Design System 15 (straight angles)
function renderStatusBadge(status: string, type: ModuleStatusType) {
  switch (type) {
    case "core-highlight":
      return (
        <span className="rounded-none bg-[#D95B26] px-3 py-1 font-sans text-[0.625rem] font-bold tracking-[0.15em] text-white uppercase shadow-sm">
          {status}
        </span>
      );
    case "core":
      return (
        <span className="rounded-none border border-[#D95B26]/30 bg-[#D95B26]/10 px-3 py-1 font-sans text-[0.625rem] font-bold tracking-[0.15em] text-[#D95B26] uppercase">
          {status}
        </span>
      );
    case "construction":
      return (
        <span className="rounded-none border border-amber-500/25 bg-amber-500/10 px-3 py-1 font-sans text-[0.625rem] font-bold tracking-[0.15em] text-amber-700 uppercase">
          {status}
        </span>
      );
    case "roadmap":
      return (
        <span className="rounded-none border border-zinc-400/30 bg-zinc-400/10 px-3 py-1 font-sans text-[0.625rem] font-bold tracking-[0.15em] text-zinc-600 uppercase">
          {status}
        </span>
      );
    default:
      return null;
  }
}

// --- High-Performance 3D Card with Dynamic Spring Transition ---
interface Module3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  isHighlight?: boolean;
}

function Module3DCard({
  children,
  className = "",
  glowColor = "rgba(0, 0, 0, 0.04)",
  isHighlight = false,
}: Module3DCardProps) {
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

    // Normalizing tilt: max ±4.5 degrees for physical feedback
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

  // Design System 15 dynamic transition:
  // When hovered: 0.12s ease-out gives ultra-fast, stutter-free 3D cursor tracking.
  // When leaving: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) gives the signature bouncy spring back to rest.
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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-none p-7 sm:p-8 cursor-pointer ${
        isHighlight
          ? "border border-[#D95B26]/40 bg-[#FFFFFF] shadow-[0_15px_40px_rgba(217,91,38,0.08)] ring-1 ring-[#D95B26]/20 hover:shadow-[0_30px_70px_rgba(217,91,38,0.18)]"
          : "border border-black/[0.08] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)]"
      } ${className}`}
    >
      {/* High-speed spotlight flashlight layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: coords.isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 65%)`,
        }}
      />

      {/* Ambient gradient bloom for the AI Core signature card */}
      {isHighlight && (
        <div className="pointer-events-none absolute top-0 right-0 h-[220px] w-[220px] -translate-y-1/4 translate-x-1/4 rounded-full bg-gradient-to-bl from-[#D95B26]/15 to-transparent blur-[60px] transition-transform duration-700 group-hover:scale-125" />
      )}

      <div className="relative z-10 flex h-full flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

export function ModularEcosystemSection() {
  const { header, modules } = MODULAR_ECOSYSTEM_CONFIG;

  return (
    <section
      id="ecossistema-modular"
      aria-label="Ecossistema Modular JARIS"
      className="relative w-full bg-[#FFFFFF] py-24 sm:py-32 lg:py-36 text-[#1D1D1F]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
        {/* 1. Header: Top, Left-aligned */}
        <div className="mb-14 sm:mb-16 lg:mb-20">
          <span className="mb-3 block font-sans text-[0.75rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
            {header.tag}
          </span>
          <h2 className="mb-4 font-sans text-3xl font-extrabold tracking-[-0.03em] text-[#1D1D1F] sm:text-4xl lg:text-5xl">
            {header.title}
          </h2>
          <p className="max-w-2xl font-sans text-base leading-relaxed text-zinc-600 sm:text-lg">
            {header.subtitle}
          </p>
        </div>

        {/* 2. Grid de Módulos: 3 Colunas x 2 Linhas (3x2) */}
        <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {modules.map((module) => {
            const isHighlight = Boolean(module.isHighlight);
            const glowColor = isHighlight
              ? "rgba(217, 91, 38, 0.12)"
              : "rgba(29, 29, 31, 0.05)";

            return (
              <Module3DCard
                key={module.id}
                isHighlight={isHighlight}
                glowColor={glowColor}
              >
                <div>
                  {/* Card Header: Icon on Left, Status Badge on Right */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-none transition-all duration-300 sm:size-12 ${
                        isHighlight
                          ? "bg-[#D95B26]/10 text-[#D95B26] shadow-xs group-hover:scale-105 group-hover:bg-[#D95B26] group-hover:text-white"
                          : "bg-black/[0.04] text-zinc-700 group-hover:scale-105 group-hover:bg-[#1D1D1F] group-hover:text-white"
                      }`}
                    >
                      {renderModuleIcon(module.iconName)}
                    </div>
                    {renderStatusBadge(module.status, module.statusType)}
                  </div>

                  {/* Module Title & Category */}
                  <div className="mt-5 mb-6">
                    <h3 className="font-sans text-xl font-bold tracking-tight text-[#1D1D1F] sm:text-2xl">
                      {module.title}
                    </h3>
                    <p className="mt-0.5 font-sans text-[0.7rem] uppercase tracking-wider text-stone-400">
                      {module.category}
                    </p>
                  </div>

                  {/* Features Bullet List */}
                  <ul className="space-y-3 pt-4 border-t border-black/[0.05]">
                    {module.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-[0.875rem] leading-snug text-zinc-600 transition-colors duration-200 group-hover:text-zinc-800"
                      >
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-none bg-[#D95B26]/10 text-[#D95B26]">
                          <CheckmarkIcon className="size-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Module3DCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

