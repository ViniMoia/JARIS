"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  DIFERENCIAIS_CONFIG,
  type DiferencialCardItem,
} from "@/lib/config/diferenciais-config";

// --- SVG Icons (Design System V15) ---

function SpeedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function getCardIcon(id: string) {
  switch (id) {
    case "agilidade-estrategica":
      return <SpeedIcon />;
    case "seguranca-dados":
      return <SecurityIcon />;
    case "visao-360":
      return <VisionIcon />;
    default:
      return <SpeedIcon />;
  }
}

// --- Card com Micro-interação 3D Tilt do Design System 15 ---

function DiferencialCard({ item }: { item: DiferencialCardItem }) {
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

      // Coordenadas normalizadas (-1 a 1) para tilt 3D com amplitude refinada
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
      className="group relative cursor-pointer overflow-hidden rounded-none border border-white/10 bg-white/[0.04] p-8 sm:p-9 lg:p-10 backdrop-blur-md transition-colors duration-300 hover:border-[#D95B26]/50 hover:bg-white/[0.07] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      {/* Dynamic Flashlight Spotlight Zone com Glow Âmbar JARIS */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: coords.isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${coords.x}px ${coords.y}px, rgba(217, 91, 38, 0.18), transparent 70%)`,
        }}
      />

      {/* Linha de brilho sutil no topo do card ao passar o mouse */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D95B26]/0 to-transparent transition-all duration-500 group-hover:via-[#D95B26]/80" />

      {/* Conteúdo do Card */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Top Row: Tag / Número do Pilar & Ícone */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-mono text-[0.72rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase bg-[#D95B26]/10 px-3 py-1 border border-[#D95B26]/25 rounded-none">
              {item.number} • {item.pillar}
            </span>

            <div className="size-12 flex items-center justify-center rounded-none bg-white/5 border border-white/10 text-[#D95B26] transition-all duration-300 group-hover:bg-[#D95B26]/15 group-hover:border-[#D95B26]/40 group-hover:scale-105">
              {getCardIcon(item.id)}
            </div>
          </div>

          {/* Título do Card */}
          <h3 className="font-sans text-2xl sm:text-[1.65rem] font-extrabold text-white tracking-[-0.02em] mb-4 leading-snug transition-colors duration-300">
            {item.title}
          </h3>

          {/* Texto Explicativo */}
          <p className="font-sans text-[0.9375rem] sm:text-base text-blue-100/75 leading-relaxed">
            {item.text}
          </p>
        </div>

        {/* Rodapé Interno do Card */}
        <div className="mt-10 pt-5 border-t border-white/10 flex items-center justify-between">
          <span className="font-sans text-[0.75rem] font-semibold tracking-[0.12em] text-white/40 uppercase transition-colors duration-300 group-hover:text-[#D95B26]">
            {item.badge}
          </span>
          <span className="size-2 rounded-none bg-[#D95B26] transition-transform duration-300 group-hover:scale-150" />
        </div>
      </div>
    </div>
  );
}

// --- Seção Principal de Diferenciais ---

export function DiferenciaisSection() {
  const { tag, title, titleHighlight, subtitle, cards } = DIFERENCIAIS_CONFIG;

  return (
    <section
      id="diferenciais"
      aria-label="Diferenciais Competitivos JARIS"
      className="relative w-full bg-gradient-to-b from-[#0A1B30] via-[#0B1E36] to-[#0A1B30] text-white py-24 sm:py-32 lg:py-36 overflow-hidden scroll-mt-20"
    >
      {/* Luzes arquiteturais ambientes (azul escuro + âmbar JARIS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/4 size-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e40af]/15 blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 right-1/4 size-[550px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#D95B26]/10 blur-[150px]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 relative z-10">
        {/* =========================================================
            CABEÇALHO DA SEÇÃO (Topo, Centralizado)
            ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Tag de Contexto: "DIFERENCIAIS" */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="size-2 rounded-none bg-[#D95B26] animate-pulse" />
            <span className="font-sans text-[0.75rem] font-bold tracking-[0.25em] text-[#D95B26] uppercase">
              {tag}
            </span>
          </div>

          {/* Título Principal: "Por que o JARIS é diferente?" */}
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-white leading-[1.12] mb-5">
            {title}
            <span className="text-[#D95B26]">{titleHighlight}</span>
          </h2>

          {/* Subtítulo / Resumo de Valor */}
          <p className="font-sans text-base sm:text-lg text-blue-100/75 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* =========================================================
            GRID DE BENEFÍCIOS (Centro, Layout em 3 Colunas)
            ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {cards.map((card) => (
            <DiferencialCard key={card.id} item={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
