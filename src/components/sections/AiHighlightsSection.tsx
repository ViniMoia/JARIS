"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HIGHLIGHTS_CONFIG,
  type HighlightCardItem,
} from "@/lib/config/highlights-config";

// --- Minimalist SVG UI Simulations (Replacing stock photos with sleek Apple/JARIS system UI) ---

function RecruitmentUiSimulation() {
  return (
    <div className="w-full rounded-none border border-black/8 bg-[#FAF9F6] p-4 text-left select-none">
      <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2.5">
        <span className="font-sans text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase">
          AI MATCHING ENGINE
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-none bg-emerald-500/10 px-2 py-0.5 font-sans text-[0.62rem] font-semibold text-emerald-600">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Triagem Concluída
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-none bg-white p-2.5 border border-black/5 shadow-sm">
          <div>
            <p className="font-sans text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Candidato A • Engenheiro de Dados
            </p>
            <p className="font-sans text-[0.7rem] text-zinc-500">
              Score: 98.4% aderência • ASO Agendado
            </p>
          </div>
          <span className="rounded-none bg-[#D95B26]/10 px-2 py-1 font-sans text-[0.68rem] font-bold text-[#D95B26]">
            98.4%
          </span>
        </div>

        <div className="flex items-center justify-between rounded-none bg-white p-2.5 border border-black/5 shadow-sm">
          <div>
            <p className="font-sans text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Candidata B • Product Manager
            </p>
            <p className="font-sans text-[0.7rem] text-zinc-500">
              Score: 94.2% aderência • Onboarding pronto
            </p>
          </div>
          <span className="rounded-none bg-[#D95B26]/10 px-2 py-1 font-sans text-[0.68rem] font-bold text-[#D95B26]">
            94.2%
          </span>
        </div>
      </div>
    </div>
  );
}

function PayrollUiSimulation() {
  return (
    <div className="w-full rounded-none border border-black/8 bg-[#FAF9F6] p-4 text-left select-none">
      <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2.5">
        <span className="font-sans text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase">
          AUDITORIA eSOCIAL & PONTO
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-none bg-blue-500/10 px-2 py-0.5 font-sans text-[0.62rem] font-semibold text-blue-600">
          <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
          Conformidade 100%
        </span>
      </div>

      <div className="space-y-2">
        <div className="rounded-none bg-white p-2.5 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Ponto com Reconhecimento Facial
            </span>
            <span className="font-sans text-[0.65rem] font-bold text-emerald-600">
              Prova de Vida OK
            </span>
          </div>
          <div className="h-1.5 w-full rounded-none bg-zinc-100 overflow-hidden">
            <div className="h-full w-full rounded-none bg-emerald-500" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-none bg-white p-2.5 border border-black/5 shadow-sm">
          <div>
            <p className="font-sans text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Cálculo de Proventos & Encargos
            </p>
            <p className="font-sans text-[0.7rem] text-zinc-500">
              Totalmente automatizado sem intervenção manual
            </p>
          </div>
          <span className="rounded-none bg-zinc-100 px-2 py-1 font-sans text-[0.68rem] font-bold text-[#1D1D1F]">
            0 ERROS
          </span>
        </div>
      </div>
    </div>
  );
}

function FinanceUiSimulation() {
  return (
    <div className="w-full rounded-none border border-black/8 bg-[#FAF9F6] p-4 text-left select-none">
      <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2.5">
        <span className="font-sans text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase">
          PROJEÇÃO FINANCEIRA COM IA
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-none bg-amber-500/10 px-2 py-0.5 font-sans text-[0.62rem] font-semibold text-amber-700">
          <span className="size-1.5 rounded-full bg-[#D95B26] animate-pulse" />
          Tempo Real
        </span>
      </div>

      <div className="space-y-2">
        <div className="rounded-none bg-white p-2.5 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-sans text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Fluxo de Caixa Preditivo (90d)
            </span>
            <span className="font-sans text-[0.68rem] font-bold text-emerald-600">
              +18.4% Previsão
            </span>
          </div>
          <div className="h-8 w-full">
            <svg
              viewBox="0 0 200 35"
              className="w-full h-full text-[#D95B26]"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M 5,26 Q 50,22 90,14 T 150,12 T 195,4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="195" cy="4" r="3" fill="#D95B26" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-none bg-white p-2.5 border border-black/5 shadow-sm">
          <div>
            <p className="font-sans text-xs sm:text-sm font-bold text-[#1D1D1F]">
              Assistente de Desvios
            </p>
            <p className="font-sans text-[0.7rem] text-zinc-500">
              Alertas proativos emitidos automaticamente
            </p>
          </div>
          <span className="rounded-none bg-emerald-50 px-2 py-1 font-sans text-[0.68rem] font-bold text-emerald-700">
            AUDITADO
          </span>
        </div>
      </div>
    </div>
  );
}

interface StackedCardProps {
  card: HighlightCardItem;
  index: number;
  activeIndex: number;
  onClick: () => void;
}

function StackedCard({ card, index, activeIndex, onClick }: StackedCardProps) {
  const isCurrent = index === activeIndex;
  const isPast = index < activeIndex;

  let transformStyle = "";
  let opacityStyle = 1;
  let zIndexStyle = 30;

  if (isCurrent) {
    transformStyle = "translateY(0px) scale(1) rotate(0deg)";
    opacityStyle = 1;
    zIndexStyle = 30;
  } else if (isPast) {
    transformStyle = "translateY(-60px) scale(0.92) rotate(-5deg)";
    opacityStyle = 0;
    zIndexStyle = 5;
  } else {
    // Future cards stacked behind
    const diff = index - activeIndex;
    const yOffset = diff * 16;
    const scale = 1 - diff * 0.06;
    const rotate = diff % 2 === 1 ? 3 : -3;
    transformStyle = `translateY(${yOffset}px) scale(${scale}) rotate(${rotate}deg)`;
    opacityStyle = diff === 1 ? 0.75 : 0.45;
    zIndexStyle = 30 - diff * 10;
  }

  return (
    <div
      onClick={onClick}
      style={{
        transform: transformStyle,
        opacity: opacityStyle,
        zIndex: zIndexStyle,
        perspective: "1000px",
      }}
      className={`absolute inset-0 rounded-none border border-white/20 bg-white p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.35)] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex flex-col justify-between select-none ${
        isCurrent ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-[0.7rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
            {card.tag}
          </span>
          <span className="size-2 rounded-full bg-[#D95B26] animate-pulse" />
        </div>

        <h3 className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight text-[#1D1D1F] mb-2">
          {card.title}
        </h3>

        <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
          {card.text}
        </p>
      </div>

      <div>
        {card.uiSimulationType === "recruitment" && <RecruitmentUiSimulation />}
        {card.uiSimulationType === "payroll" && <PayrollUiSimulation />}
        {card.uiSimulationType === "finance" && <FinanceUiSimulation />}
      </div>
    </div>
  );
}

export function AiHighlightsSection() {
  const { header, cards } = HIGHLIGHTS_CONFIG;
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    // Garante que inicia rigorosamente no Card 1
    setActiveIndex(0);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Pinning com GSAP ScrollTrigger diretamente na <section>:
      // 1. A dobra desce completamente pela tela até ancorar no topo (start: "top top").
      // 2. Durante toda a aproximação, Card 1 permanece intacto.
      // 3. Somente após estar ancorada no topo é que os cards mudam com o scroll.
      // 4. Ao chegar no Card 3 (progress = 1.0), a dobra desancora imediatamente,
      //    sem deixar nenhum espaço azul vazio para trás.
      ScrollTrigger.create({
        trigger: section,
        pin: section,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: "top top",
        end: "+=120%",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;

          // Margem confortável e deliberada de leitura:
          // De 0.00 a 0.35: Card 1 (Contratação Inteligente)
          // De 0.35 a 0.70: Card 2 (Ponto e Folha Automatizados)
          // De 0.70 a 1.00: Card 3 (Fluxo Financeiro Preditivo)
          const targetIdx = p < 0.35 ? 0 : p < 0.7 ? 1 : 2;
          setActiveIndex((curr) => (curr !== targetIdx ? targetIdx : curr));
        },
      });
    });

    return () => {
      mm.revert();
    };
  }, [cards.length]);

  const activeCard = cards[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="destaques-ia"
      aria-label="Destaques com IA e Fundo de Funil"
      className="relative w-full min-h-screen lg:h-[100dvh] lg:min-h-[660px] bg-gradient-to-b from-[#0B1E36] via-[#0D2444] to-[#0A1B30] text-white flex flex-col justify-center px-5 sm:px-8 lg:px-10 overflow-hidden scroll-mt-20"
    >
      <span id="solucoes" className="scroll-mt-20 pointer-events-none absolute top-0" />
      <span id="impacto" className="scroll-mt-20 pointer-events-none absolute top-0" />
      {/* Iluminação ambiente azul tecnológica com realce âmbar sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 size-[650px] rounded-full bg-[#1e40af]/20 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-1/4 size-[450px] rounded-full bg-[#D95B26]/12 blur-[130px]"
      />

      <div className="mx-auto w-full max-w-[1240px] relative z-10 py-10 lg:py-0">
        {/* 
          1. Cabeçalho da Seção (Centralizado no Topo sobre Fundo Azul)
        */}
        <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8 lg:mb-10">
          <span className="mb-2.5 inline-block font-sans text-[0.72rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
            {header.tag}
          </span>
          <h2 className="mb-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-white leading-[1.14]">
            Tecnologia prática gerando{" "}
            <span className="text-[#D95B26]">impacto mensurável</span> no seu negócio.
          </h2>
          <p className="mx-auto max-w-xl font-sans text-sm sm:text-base leading-relaxed text-blue-100/80">
            {header.subtitle}
          </p>
        </div>

          {/* 
            2. Corpo da Seção: 2 Colunas
            - Lado Esquerdo: 3 Cards Empilhados em perspectiva 3D
            - Lado Direito: Informações Externas correspondentes ao card ativo
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Lado Esquerdo: Stacked Deck (3 Cards em Profundidade) */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] max-w-[380px] sm:max-w-[420px]">
                {cards.map((card, idx) => (
                  <StackedCard
                    key={card.id}
                    card={card}
                    index={idx}
                    activeIndex={activeIndex}
                    onClick={() => setActiveIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Lado Direito: Informações Externas (Pontos + Benefício + Controles) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="transition-all duration-400 ease-out">
                {/* Indicador de Passo */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#D95B26]">
                    ETAPA {activeCard.indexStr} DE 03
                  </span>
                  <div className="h-px w-12 bg-white/20" />
                </div>

                <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-4">
                  {activeCard.title}
                </h3>

                {/* Lista de Pontos com Marcadores Laranjas */}
                <div className="mb-6">
                  <p className="font-sans text-[0.7rem] font-bold uppercase tracking-wider text-blue-200/70 mb-3">
                    O que o JARIS entrega nesta etapa:
                  </p>
                  <ul className="space-y-2.5">
                    {activeCard.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2.5 font-sans text-xs sm:text-sm text-blue-50 leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-[#D95B26]"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bloco de Benefício de Alto Impacto com acabamento translúcido */}
                <div className="rounded-none border border-[#D95B26]/30 bg-[#D95B26]/15 p-4 sm:p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(217,91,38,0.1)]">
                  <span className="mb-1 block font-sans text-[0.68rem] font-bold tracking-[0.16em] text-[#D95B26] uppercase">
                    BENEFÍCIO COMPROVADO
                  </span>
                  <p className="font-sans text-sm sm:text-base font-bold text-white">
                    {activeCard.benefit}
                  </p>
                </div>
              </div>

              {/* Controles de Navegação (Scroll ou Clique) */}
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10">
                {/* Pagination Dots / Rectangular Indicators */}
                <div className="flex items-center gap-2">
                  {cards.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Ir para ${c.title}`}
                      className={`h-1.5 rounded-none transition-all duration-400 cursor-pointer ${
                        i === activeIndex
                          ? "w-8 bg-[#D95B26]"
                          : "w-3 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                {/* Botões de Avanço / Retrocesso */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Destaque anterior"
                    className="flex size-9 items-center justify-center rounded-none border border-white/15 bg-white/5 text-white transition-all hover:border-white/30 hover:bg-white/15 focus:outline-none cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-4"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Próximo destaque"
                    className="flex size-9 items-center justify-center rounded-none border border-white/15 bg-white/5 text-white transition-all hover:border-white/30 hover:bg-white/15 focus:outline-none cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-4"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
