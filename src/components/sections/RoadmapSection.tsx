"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ROADMAP_CONFIG,
  type RoadmapPhaseItem,
} from "@/lib/config/roadmap-config";

// --- SVG Icons (Design System V15) ---

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function OrbitIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function getPhaseIcon(id: string) {
  switch (id) {
    case "fase-1":
      return <UsersIcon />;
    case "fase-2":
      return <TrendingIcon />;
    case "fase-3":
      return <DocumentIcon />;
    case "fase-4":
      return <PackageIcon />;
    case "fase-5":
      return <OrbitIcon />;
    default:
      return <UsersIcon />;
  }
}

// --- Card Azul com Efeito 3D Tilt do Design System 15 ---

interface RoadmapCardProps {
  item: RoadmapPhaseItem;
  isActive: boolean;
}

function RoadmapCard({ item, isActive }: RoadmapCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
    isHovered: false,
  });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;
      const tiltX = -normY * 4.0;
      const tiltY = normX * 4.0;

      setCoords({
        x,
        y,
        tiltX,
        tiltY,
        isHovered: true,
      });
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    setCoords((prev) => ({
      ...prev,
      tiltX: 0,
      tiltY: 0,
      isHovered: false,
    }));
  }, []);

  // Transição orgânica, suave e fluida para o surgimento do card
  const transformStyle = coords.isHovered
    ? `perspective(1000px) rotateX(${coords.tiltX.toFixed(2)}deg) rotateY(${coords.tiltY.toFixed(2)}deg) translateY(-6px) scale(1.02)`
    : isActive
    ? "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)"
    : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(28px) scale(0.96)";

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: transformStyle,
        transition: coords.isHovered
          ? "transform 0.12s ease-out, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
          : "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-none p-6 sm:p-8 lg:p-9 will-change-transform ${
        isActive
          ? "border border-white/15 text-white opacity-100 shadow-[0_25px_60px_rgba(11,30,54,0.28)] hover:border-[#D95B26]/50 blur-0 pointer-events-auto"
          : "border border-transparent text-slate-400 opacity-0 shadow-none blur-[6px] pointer-events-none"
      }`}
    >
      {/* Background Gradient Azul Noturno Base - Sempre presente para permitir transições perfeitamente contínuas sem flash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#0B1E36] via-[#0D2444] to-[#0A1B30]"
      />

      {/* Dynamic Flashlight Spotlight Zone com Glow Âmbar JARIS */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
        style={{
          opacity: coords.isHovered && isActive ? 1 : 0,
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(217, 91, 38, 0.22), transparent 65%)`,
        }}
      />

      {/* Linha superior de brilho laranja ativa quando a linha de luz passa */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-[3px] transition-all duration-700 ease-out ${
          isActive
            ? "bg-gradient-to-r from-transparent via-[#D95B26] to-transparent opacity-90 scale-x-100"
            : "bg-transparent opacity-0 scale-x-0"
        }`}
      />

      {/* Conteúdo do Card */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Top Row: Tag / Categoria & Ícone */}
          <div className="flex items-center justify-between mb-6">
            <span
              className={`font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-none border transition-colors duration-500 ${
                isActive
                  ? "bg-[#D95B26]/15 border-[#D95B26]/30 text-[#D95B26]"
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {item.category}
            </span>

            <div
              className={`size-10 flex items-center justify-center rounded-none border transition-all duration-500 ${
                isActive
                  ? "bg-[#D95B26]/15 border-[#D95B26]/35 text-[#D95B26]"
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {getPhaseIcon(item.id)}
            </div>
          </div>

          {/* Título da Fase */}
          <h3
            className={`font-sans text-xl sm:text-2xl font-extrabold tracking-[-0.02em] mb-3 leading-snug transition-colors duration-500 ${
              isActive ? "text-white" : "text-slate-300"
            }`}
          >
            {item.title}
          </h3>

          {/* Texto descritivo exato solicitado pelo usuário */}
          <p
            className={`font-sans text-sm sm:text-base leading-relaxed mb-6 font-normal transition-colors duration-500 ${
              isActive ? "text-blue-100/85" : "text-slate-400"
            }`}
          >
            {item.description}
          </p>
        </div>

        {/* Rodapé Interno do Card */}
        <div
          className={`pt-4 border-t flex items-center justify-between transition-colors duration-500 ${
            isActive ? "border-white/10" : "border-white/5"
          }`}
        >
          <span
            className={`font-sans text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-500 ${
              isActive ? "text-blue-200/70" : "text-slate-500"
            }`}
          >
            {item.statusLabel}
          </span>
          <span
            className={`size-2 rounded-none transition-all duration-500 ${
              isActive
                ? "bg-[#D95B26] shadow-[0_0_8px_#D95B26]"
                : "bg-slate-500/40"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// --- Seção Principal de Roteiro de Evolução com Linha de Luz Vertical ---

export function RoadmapSection() {
  const { tag, titlePrefix, titleHighlight, subtitle, phases } =
    ROADMAP_CONFIG;

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 75%",
        scrub: 0.2,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="roteiro-evolucao"
      aria-label="Roteiro de Evolução JARIS — Roadmap 5 Fases"
      className="relative w-full bg-[#FFFFFF] py-24 sm:py-32 lg:py-36 text-[#1D1D1F] overflow-hidden scroll-mt-20"
    >
      {/* Luz ambiente arquitetural suave sobre fundo branco */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-0 size-[600px] rounded-full bg-[#D95B26]/4 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 left-0 size-[500px] rounded-full bg-black/[0.02] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 relative z-10">
        {/* =========================================================
            CABEÇALHO DA SEÇÃO (Topo, Centralizado)
            ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          {/* Tag de Contexto: "ROTEIRO DE EVOLUÇÃO" */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="size-2 rounded-none bg-[#D95B26] animate-pulse" />
            <span className="font-sans text-[0.75rem] font-bold tracking-[0.25em] text-[#D95B26] uppercase">
              {tag}
            </span>
          </div>

          {/* Título Principal com destaque laranja na ideia central */}
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#1D1D1F] leading-[1.12] mb-5">
            {titlePrefix}
            <span className="text-[#D95B26]">{titleHighlight}</span>
          </h2>

          {/* Subtítulo explicativo */}
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* =========================================================
            CONTAINER DA TIMELINE COM A LINHA DE LUZ CENTRAL E CARDS
            ========================================================= */}
        <div ref={trackRef} className="relative mx-auto max-w-[1100px]">
          {/* Linha de Luz Vertical (Central no Desktop, Esquerda no Mobile) */}
          <div
            aria-hidden="true"
            className="absolute top-8 bottom-8 left-5 sm:left-6 md:left-1/2 md:-translate-x-1/2 w-[2px] bg-black/[0.08]"
          >
            {/* Feixe de Luz Laranja Ativo descendo com o scroll */}
            <div
              style={{
                height: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
                boxShadow:
                  "0 0 10px #D95B26, 0 0 20px rgba(217, 91, 38, 0.6), 0 0 40px rgba(217, 91, 38, 0.3)",
              }}
              className="absolute top-0 left-0 w-[2px] bg-[#D95B26] transition-all duration-75"
            >
              {/* Esfera / Ponto de Luz Laranja na ponta da linha (como na imagem de referência) */}
              <div className="absolute -bottom-2 -left-[4px] size-2.5 rounded-full bg-[#D95B26] shadow-[0_0_12px_#D95B26,0_0_24px_#D95B26]" />
            </div>
          </div>

          {/* 5 Fases em Layout Alternado (Desktop) / Alinhado (Mobile) */}
          <div className="space-y-12 sm:space-y-16 lg:space-y-24 pl-12 sm:pl-16 md:pl-0">
            {phases.map((phase) => {
              const isActive = scrollProgress >= phase.threshold;
              const isLeft = phase.side === "left";

              return (
                <div
                  key={phase.id}
                  className="relative md:grid md:grid-cols-2 md:gap-16 lg:gap-20 md:items-center"
                >
                  {/* Conector Horizontal para a Linha Central (Desktop) com expansão fluida */}
                  <div
                    aria-hidden="true"
                    style={{
                      transformOrigin: isLeft ? "right center" : "left center",
                      transition:
                        "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out, box-shadow 0.7s ease-out",
                    }}
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] w-8 lg:w-10 z-0 ${
                      isLeft ? "left-1/2 -translate-x-full" : "left-1/2"
                    } ${
                      isActive
                        ? "scale-x-100 opacity-100 bg-[#D95B26] shadow-[0_0_8px_rgba(217,91,38,0.7)]"
                        : "scale-x-0 opacity-0 bg-[#D95B26]"
                    }`}
                  />

                  {/* Marcador Central Junction Node (Desktop) */}
                  <div
                    aria-hidden="true"
                    className={`hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 size-3 rounded-full border transition-all duration-500 ease-out ${
                      isActive
                        ? "border-white bg-[#D95B26] shadow-[0_0_12px_#D95B26,0_0_24px_rgba(217,91,38,0.7)] scale-125 opacity-100"
                        : "border-zinc-300 bg-white scale-75 opacity-30"
                    }`}
                  />

                  {/* Conector Horizontal (Mobile) com expansão fluida */}
                  <div
                    aria-hidden="true"
                    style={{
                      transformOrigin: "left center",
                      transition:
                        "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out, box-shadow 0.7s ease-out",
                    }}
                    className={`md:hidden absolute top-1/2 -translate-y-1/2 -left-7 sm:-left-10 h-[2px] w-7 sm:w-10 z-0 ${
                      isActive
                        ? "scale-x-100 opacity-100 bg-[#D95B26] shadow-[0_0_8px_rgba(217,91,38,0.7)]"
                        : "scale-x-0 opacity-0 bg-[#D95B26]"
                    }`}
                  />

                  {/* Marcador Central Junction Node (Mobile) */}
                  <div
                    aria-hidden="true"
                    className={`md:hidden absolute -left-7 sm:-left-10 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 size-2.5 rounded-full border transition-all duration-500 ease-out ${
                      isActive
                        ? "border-white bg-[#D95B26] shadow-[0_0_12px_#D95B26] scale-125 opacity-100"
                        : "border-zinc-300 bg-white scale-75 opacity-30"
                    }`}
                  />

                  {/* LADO ESQUERDO */}
                  <div className={isLeft ? "md:block" : "hidden md:block"}>
                    {isLeft ? (
                      <RoadmapCard item={phase} isActive={isActive} />
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  {/* LADO DIREITO */}
                  <div className={!isLeft ? "md:block" : "hidden md:block"}>
                    {!isLeft ? (
                      <RoadmapCard item={phase} isActive={isActive} />
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

