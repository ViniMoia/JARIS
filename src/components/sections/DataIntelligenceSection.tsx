"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DATA_INTELLIGENCE_CONFIG,
  type ChartMonthData,
} from "@/lib/config/data-intelligence-config";

// --- SVG Icons (Design System V15 Inspired) ---

function DocumentReportsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 sm:size-6 transition-colors duration-300"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function PredictiveAnalyticsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 sm:size-6 transition-colors duration-300"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 16l4-4 3 3 4-5" />
      <path d="M18 10h-3v3" />
    </svg>
  );
}

function StrategicInsightsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 sm:size-6 transition-colors duration-300"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChartHeaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5 sm:size-6 text-[#D95B26]"
    >
      <path d="M4 19h16v2H4z" />
      <rect x="6" y="11" width="3" height="6" rx="1" />
      <rect x="11" y="7" width="3" height="10" rx="1" />
      <rect x="16" y="4" width="3" height="13" rx="1" />
    </svg>
  );
}

export function DataIntelligenceSection() {
  const { header, features, card } = DATA_INTELLIGENCE_CONFIG;

  const sectionRef = useRef<HTMLElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [hoveredMonth, setHoveredMonth] = useState<ChartMonthData | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const currentMode = card.modes[activeModeIndex];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setHasEntered(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          setHasEntered(true);
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inteligencia-dados"
      aria-label="Inteligência de Dados e Performance Operacional"
      className="relative w-full bg-[#FFFFFF] py-20 sm:py-28 lg:py-32 text-[#1D1D1F] overflow-hidden"
    >
      {/* Luz ambiente arquitetural minimalista de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-0 size-[600px] rounded-full bg-[#D95B26]/5 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 left-0 size-[500px] rounded-full bg-black/[0.02] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* =========================================================
              LADO ESQUERDO: Cabeçalho & Argumentação Analítica
              ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Tag de Contexto */}
            <div className="flex items-center gap-2 mb-3.5">
              <span className="size-2 rounded-full bg-[#D95B26] animate-pulse" />
              <span className="font-sans text-[0.75rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
                {header.tag}
              </span>
            </div>

            {/* Título Principal */}
            <h2 className="mb-5 font-sans text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.03em] text-[#1D1D1F] leading-[1.14]">
              {header.title}
            </h2>

            {/* Subtítulo Descritivo */}
            <p className="mb-10 font-sans text-base sm:text-lg leading-relaxed text-zinc-600 max-w-xl">
              {header.subtitle}
            </p>

            {/* Lista Vertical de 3 Funcionalidades com Ícones e Microinterações */}
            <div className="space-y-4">
              {features.map((feature) => (
                <article
                  key={feature.id}
                  className="group relative overflow-hidden rounded-none border border-black/8 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-black/15 hover:bg-[#FAF9F6]/80 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:pl-7 sm:hover:pl-8 cursor-pointer"
                >
                  {/* Microinteração da barra lateral esquerda laranja (design_sistem15.html) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 bottom-0 w-[4px] bg-[#D95B26] origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  />

                  <div className="flex items-start gap-4 sm:gap-5">
                    {/* Ícone Temático */}
                    <div className="flex-shrink-0">
                      <div className="flex size-12 sm:size-13 items-center justify-center rounded-none border border-[#D95B26]/20 bg-[#D95B26]/10 text-[#D95B26] transition-all duration-500 ease-out group-hover:scale-105 group-hover:bg-[#D95B26] group-hover:text-white group-hover:border-[#D95B26] shadow-sm">
                        {feature.iconName === "reports" && <DocumentReportsIcon />}
                        {feature.iconName === "predictive" && <PredictiveAnalyticsIcon />}
                        {feature.iconName === "insights" && <StrategicInsightsIcon />}
                      </div>
                    </div>

                    {/* Texto da Funcionalidade */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#1D1D1F] transition-transform duration-400 ease-out group-hover:translate-x-1">
                          {feature.title}
                        </h3>
                        <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-zinc-400">
                          {feature.numberStr}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-zinc-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* =========================================================
              LADO DIREITO: Dashboard Interativo (Fiel à Imagem de Referência)
              ========================================================= */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-[540px]">
              {/* Card Container com visual Apple Glass / Soft Surface */}
              <div
                ref={chartRef}
                className="relative overflow-hidden rounded-none border border-black/8 bg-white p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_35px_80px_rgba(0,0,0,0.08)] transition-all duration-700 select-none"
              >
                {/* Realce radial de fundo decorativo */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 size-[280px] rounded-full bg-gradient-to-bl from-[#D95B26]/10 via-[#D95B26]/5 to-transparent blur-[60px]"
                />

                {/* 1. Header do Dashboard (Ícone + Título + Badge de Crescimento) */}
                <div className="relative z-10 flex items-center justify-between border-b border-black/5 pb-5 mb-5">
                  <div className="flex items-center gap-3.5">
                    {/* Ícone em caixa com tom pêssego/âmbar sutil */}
                    <div className="flex size-11 items-center justify-center rounded-none bg-[#D95B26]/10 border border-[#D95B26]/15 shadow-sm">
                      <ChartHeaderIcon />
                    </div>

                    <div>
                      <h3 className="font-sans text-lg sm:text-xl font-extrabold tracking-tight text-[#1D1D1F]">
                        {card.title}
                      </h3>
                      <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                        Indicadores Consolidados
                      </p>
                    </div>
                  </div>

                  {/* Badge de Destaque Verde Menta (+24%) */}
                  <span className="inline-flex items-center gap-1.5 rounded-none bg-emerald-500/10 px-3.5 py-1.5 font-sans text-xs sm:text-sm font-bold text-emerald-600 border border-emerald-500/20 shadow-sm">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {currentMode.badgePercent}
                  </span>
                </div>

                {/* 2. Seletor de Modos / Indicadores (Filtro Interativo de KPIs) */}
                <div className="relative z-10 flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
                  {card.modes.map((mode, idx) => (
                    <button
                      key={mode.id}
                      onClick={() => setActiveModeIndex(idx)}
                      className={`rounded-none px-3.5 py-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        activeModeIndex === idx
                          ? "bg-[#1D1D1F] text-white shadow-sm"
                          : "bg-[#FAF9F6] text-zinc-500 hover:bg-zinc-200/70 hover:text-[#1D1D1F] border border-black/5"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* 3. Área Gráfica com Linhas de Grade e Barras Proporcionais */}
                <div className="relative z-10 w-full pt-4">
                  {/* Linhas de Grade Dotted Horizontais */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between bottom-8">
                    <div className="w-full border-b border-dashed border-black/8" />
                    <div className="w-full border-b border-dashed border-black/8" />
                    <div className="w-full border-b border-dashed border-black/8" />
                    <div className="w-full border-b border-black/10" />
                  </div>

                  {/* Container das 6 Barras (Jan - Jun) */}
                  <div className="relative h-[220px] sm:h-[250px] w-full flex items-end justify-between gap-2.5 sm:gap-4 pb-8 px-1">
                    {currentMode.data.map((item, idx) => {
                      const isHovered = hoveredMonth?.month === item.month;
                      const targetHeight = hasEntered ? item.heightPercent : 0;

                      return (
                        <div
                          key={item.month}
                          onPointerEnter={() => setHoveredMonth(item)}
                          onPointerLeave={() => setHoveredMonth(null)}
                          className="group relative flex-1 h-full flex flex-col items-center justify-end cursor-pointer"
                        >
                          {/* Tooltip Flutuante Dinâmico no Hover */}
                          <div
                            className={`pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-none bg-[#1D1D1F] px-2.5 py-1.5 text-center text-white shadow-xl transition-all duration-300 z-30 ${
                              isHovered
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-2 scale-90"
                            }`}
                          >
                            <span className="block font-sans text-[0.65rem] font-bold text-[#D95B26] uppercase">
                              {item.fullMonth}
                            </span>
                            <span className="block font-sans text-xs font-bold text-white">
                              {item.metricValue} ({item.growth})
                            </span>
                            {/* Setinha inferior do tooltip */}
                            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1D1D1F]" />
                          </div>

                          {/* A Barra Colorida com cantos retos (border-radius: 0) */}
                          <div
                            style={{
                              height: `${targetHeight}%`,
                              backgroundColor: item.color,
                            }}
                            className={`w-full rounded-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative ${
                              isHovered
                                ? "brightness-105 shadow-[0_0_20px_rgba(217,91,38,0.35)] scale-y-[1.03] origin-bottom"
                                : "group-hover:brightness-105"
                            }`}
                          >
                            {/* Brilho superior sutil na barra de pico (Junho) */}
                            {idx === currentMode.data.length - 1 && (
                              <div
                                aria-hidden="true"
                                className="absolute top-0 inset-x-0 h-1.5 rounded-none bg-white/30"
                              />
                            )}
                          </div>

                          {/* Rótulo do Mês no Eixo X */}
                          <span
                            className={`absolute bottom-1 font-sans text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                              isHovered
                                ? "text-[#D95B26] font-bold scale-105"
                                : "text-zinc-500"
                            }`}
                          >
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Rodapé Informativo: Insight em Tempo Real da IA */}
                <div className="relative z-10 mt-3 pt-4 border-t border-black/5 flex items-center justify-between gap-3 bg-[#FAF9F6] rounded-none p-3 border border-black/5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="size-2 flex-shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="font-sans text-[0.75rem] sm:text-xs text-zinc-600 truncate">
                      <span className="font-bold text-[#1D1D1F]">
                        Assistente JARIS:{" "}
                      </span>
                      {hoveredMonth
                        ? `${hoveredMonth.fullMonth}: ${hoveredMonth.kpiSubtitle} com evolução de ${hoveredMonth.growth}`
                        : "Consolidação contínua de métricas sem intervenção humana"}
                    </p>
                  </div>
                  <span className="flex-shrink-0 font-sans text-[0.65rem] font-bold uppercase tracking-wider text-[#D95B26]">
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

