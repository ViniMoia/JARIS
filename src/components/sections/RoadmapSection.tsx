"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ROADMAP_CONFIG,
  type RoadmapPhaseItem,
} from "@/lib/config/roadmap-config";

// --- SVG Icons por Fase (Design System V15 Inspired) ---

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 sm:size-6"
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
      className="size-5 sm:size-6"
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
      className="size-5 sm:size-6"
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
      className="size-5 sm:size-6"
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
      className="size-5 sm:size-6"
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

// --- Card Azul com Micro-interação 3D Tilt do Design System ---

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

  const transformStyle = coords.isHovered
    ? `perspective(1000px) rotateX(${coords.tiltX.toFixed(2)}deg) rotateY(${coords.tiltY.toFixed(2)}deg) translateY(-6px) scale(1.015)`
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
      className={`group relative w-full cursor-pointer overflow-hidden rounded-none p-6 sm:p-8 lg:p-9 transition-all duration-700 ${
        isActive
          ? "border border-white/15 bg-gradient-to-br from-[#0B1E36] via-[#0D2444] to-[#0A1B30] opacity-100 shadow-[0_20px_50px_rgba(11,30,54,0.22)] scale-100 hover:border-[#D95B26]/50"
          : "border border-black/5 bg-[#0B1E36]/80 opacity-40 scale-[0.98] shadow-none"
      }`}
    >
      {/* Dynamic Flashlight Spotlight Zone com Âmbar JARIS */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: coords.isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(217, 91, 38, 0.20), transparent 65%)`,
        }}
      />

      {/* Linha superior de brilho laranja ativa quando a linha de luz passa */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] transition-all duration-700 ${
          isActive
            ? "bg-gradient-to-r from-transparent via-[#D95B26] to-transparent opacity-90"
            : "bg-transparent opacity-0"
        }`}
      />

      {/* Conteúdo do Card */}
      <div className="relative z-10 flex flex-col justify-between h-full text-white">
        <div>
          {/* Top Row: Fase Label & Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.72rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase bg-[#D95B26]/15 px-3 py-1 border border-[#D95B26]/30 rounded-none">
                {item.phaseLabel}
              </span>
              <span className="font-sans text-xs font-semibold text-blue-200/70 tracking-wider uppercase">
                {item.statusLabel}
              </span>
            </div>

            <div
              className={`size-11 flex items-center justify-center rounded-none border transition-all duration-300 ${
                isActive
                  ? "bg-[#D95B26]/15 border-[#D95B26]/35 text-[#D95B26]"
                  : "bg-white/5 border-white/10 text-white/40"
              }`}
            >
              {getPhaseIcon(item.id)}
            </div>
          </div>

          {/* Título da Fase */}
          <h3 className="font-sans text-2xl sm:text-[1.65rem] font-extrabold text-white tracking-[-0.02em] mb-3 leading-snug">
            {item.phaseLabel} — {item.title}
          </h3>

          {/* Descrição Principal solicitada pelo usuário */}
          <p className="font-sans text-base sm:text-[1.05rem] text-blue-100/90 leading-relaxed mb-6 font-medium">
            {item.description}
          </p>

          {/* Módulos e Entregas detalhadas da Fase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/10">
            {item.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-none bg-white/[0.04] p-2.5 border border-white/5 text-xs text-blue-100/80 font-sans"
              >
                <span className="size-1.5 rounded-none bg-[#D95B26] flex-shrink-0" />
                <span className="line-clamp-2">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Seção Principal de Roadmap / Linha do Tempo ---

export function RoadmapSection() {
  const { tag, titlePrefix, titleHighlight, subtitle, earlyAdopterCard, phases } =
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
        end: "bottom 80%",
        scrub: 0.25,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Thresholds de ativação de cada card conforme a linha de luz desce
  // 5 cards distribuídos ao longo do percurso vertical (0.0 a 1.0)
  const phaseThresholds = [0.08, 0.28, 0.48, 0.68, 0.88];

  return (
    <section
      ref={sectionRef}
      id="roteiro-evolucao"
      aria-label="Roteiro de Evolução JARIS — Roadmap 5 Fases"
      className="relative w-full bg-[#FFFFFF] py-24 sm:py-32 lg:py-36 text-[#1D1D1F] overflow-hidden scroll-mt-20"
    >
      {/* Luzes arquiteturais minimalistas de fundo em tons de cinza suave e âmbar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-0 size-[600px] rounded-full bg-[#D95B26]/5 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 left-0 size-[550px] rounded-full bg-black/[0.02] blur-[140px]"
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

          {/* Título Principal: "Evolução contínua em 5 fases estratégicas." */}
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#1D1D1F] leading-[1.12] mb-5">
            {titlePrefix}
            <span className="text-[#D95B26]">{titleHighlight}</span>
          </h2>

          {/* Subtítulo explicativo / Transparência e Early Adopter */}
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* =========================================================
            TIMELINE VERTICAL: LINHA DE LUZ LARANJA + 5 CARDS AZUIS
            ========================================================= */}
        <div ref={trackRef} className="relative mx-auto max-w-[1040px]">
          {/* Trilho Vertical (Linha Base Cinza) */}
          <div
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-5 sm:left-7 lg:left-8 w-[2px] bg-zinc-200"
          >
            {/* Linha de Luz Laranja Ativa que Desce com o Scroll */}
            <div
              style={{ height: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
              className="absolute top-0 left-0 w-[2px] bg-[#D95B26] shadow-[0_0_12px_#D95B26,0_0_24px_rgba(217,91,38,0.7)] transition-all duration-75"
            >
              {/* Ponto / Faísca de Luz na Ponta da Linha */}
              <div className="absolute -bottom-2 -left-[4px] size-2.5 rounded-none bg-[#D95B26] shadow-[0_0_16px_#D95B26,0_0_32px_#D95B26] animate-pulse" />
            </div>
          </div>

          {/* Lista das 5 Fases ao Lado da Linha */}
          <div className="space-y-12 sm:space-y-16 lg:space-y-20 pl-14 sm:pl-20 lg:pl-24">
            {phases.map((phase, index) => {
              const isActive = scrollProgress >= phaseThresholds[index];

              return (
                <div key={phase.id} className="relative flex items-center">
                  {/* Conector Horizontal e Node da Linha de Luz */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-14 sm:-left-20 lg:-left-24 top-1/2 -translate-y-1/2 flex items-center"
                  >
                    {/* Marcador / Node Quadrado da Fase */}
                    <div
                      className={`relative z-10 size-10 sm:size-11 flex items-center justify-center rounded-none font-mono text-xs sm:text-[0.8rem] font-bold border transition-all duration-500 ${
                        isActive
                          ? "border-[#D95B26] bg-[#D95B26] text-white shadow-[0_0_20px_rgba(217,91,38,0.55)] scale-110"
                          : "border-zinc-300 bg-white text-zinc-400"
                      }`}
                    >
                      0{phase.phaseNumber}
                    </div>

                    {/* Conector Horizontal até o Card */}
                    <div
                      className={`h-[2px] w-4 sm:w-9 lg:w-13 transition-all duration-500 ${
                        isActive
                          ? "bg-[#D95B26] shadow-[0_0_8px_rgba(217,91,38,0.5)]"
                          : "bg-zinc-200"
                      }`}
                    />
                  </div>

                  {/* Card Azul com Design JARIS */}
                  <RoadmapCard item={phase} isActive={isActive} />
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            CARD DE CONVITE EARLY ADOPTER (Conversão para Formulário)
            ========================================================= */}
        <div className="mt-20 sm:mt-28 max-w-[1040px] mx-auto">
          <div className="relative overflow-hidden rounded-none border border-black/10 bg-gradient-to-r from-[#0B1E36] to-[#0A1B30] p-8 sm:p-12 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            {/* Brilho âmbar de destaque */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 size-[400px] rounded-full bg-[#D95B26]/15 blur-[120px]"
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="size-2 rounded-none bg-[#D95B26] animate-pulse" />
                  <span className="font-sans text-[0.75rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
                    {earlyAdopterCard.tag}
                  </span>
                </div>
                <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.02em] mb-3">
                  {earlyAdopterCard.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-blue-100/80 leading-relaxed">
                  {earlyAdopterCard.description}
                </p>
              </div>

              <div className="flex-shrink-0">
                <a
                  href={earlyAdopterCard.ctaHref}
                  onClick={(e) => {
                    e.preventDefault();
                    const contactSection =
                      document.getElementById("fale-com-time") ||
                      document.getElementById("contato");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="group inline-flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
                >
                  <span className="flex h-[3rem] items-center justify-center rounded-none bg-[#D95B26] px-6 sm:px-8 font-sans text-sm sm:text-base font-bold tracking-[0.02em] text-white transition-all duration-300 group-hover:bg-[#c44e1c] group-hover:shadow-[0_10px_30px_rgba(217,91,38,0.4)]">
                    {earlyAdopterCard.ctaLabel}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
