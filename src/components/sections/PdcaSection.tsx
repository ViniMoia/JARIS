"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PDCA_CONFIG, type PdcaStepItem } from "@/lib/config/pdca-config";
import type { PdcaDiagramRef } from "../canvas/pdca/PdcaParticleDiagram";

// Dynamically import the 3D particle diagram to prevent SSR canvas issues
const PdcaParticleDiagram = dynamic(
  () =>
    import("../canvas/pdca/PdcaParticleDiagram").then(
      (mod) => mod.PdcaParticleDiagram
    ),
  {
    ssr: false,
    loading: () => (
      <div className="relative aspect-square w-full max-w-[500px] rounded-3xl bg-[#FAF9F6]/20 flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-[#D95B26] border-t-transparent animate-spin" />
      </div>
    ),
  }
);

interface PdcaCardProps {
  step: PdcaStepItem;
  index: number;
  isActive: boolean;
  onHover: (id: string | null) => void;
}

function PdcaCard({ step, index, isActive, onHover }: PdcaCardProps) {
  return (
    <article
      aria-label={`Etapa ${step.letter}: ${step.title}`}
      onPointerEnter={() => onHover(step.id)}
      onPointerLeave={() => onHover(null)}
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
        isActive
          ? "border-black/20 bg-[#FAF9F6] shadow-[0_14px_36px_rgba(0,0,0,0.06)] pl-7 sm:pl-8"
          : "border-black/8 hover:border-black/15 hover:bg-[#FAF9F6]/60 hover:shadow-[0_14px_36px_rgba(0,0,0,0.05)] hover:pl-7 sm:hover:pl-8"
      }`}
    >
      {/* 
        Microinteração da Barra Lateral Esquerda (design_sistem15.html .typo-row):
        Desce verticalmente no hover a partir do topo (transform-origin: top; scaleY: 0 -> 1)
      */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-[4px] bg-[#D95B26] origin-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
        {/* Nó Circular / Letra da Etapa */}
        <div className="flex-shrink-0">
          <div
            className={`relative flex size-12 sm:size-13 items-center justify-center rounded-full border-2 bg-white shadow-sm transition-all duration-300 ease-out ${
              isActive
                ? "border-[#D95B26] scale-105 shadow-[0_0_16px_rgba(217,91,38,0.3)]"
                : "border-[#D95B26]/30 group-hover:border-[#D95B26] group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(217,91,38,0.25)]"
            }`}
          >
            <span className="font-sans text-lg sm:text-xl font-black text-[#D95B26] tracking-tight">
              {step.letter}
            </span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 rounded-full border border-[#D95B26]/20 transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
        </div>

        {/* Conteúdo da Etapa: Título + 3 Bullets com Marcadores Laranjas */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2.5">
            <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] transition-colors duration-300">
              {step.title}
            </h3>
            <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-zinc-400">
              0{index + 1}
            </span>
          </div>

          <ul className="space-y-2">
            {step.bullets.map((bullet, bIndex) => (
              <li
                key={bIndex}
                className="flex items-start gap-2.5 text-sm sm:text-[0.925rem] text-zinc-600 leading-relaxed font-sans"
              >
                {/* Marcador visual laranja */}
                <span
                  aria-hidden="true"
                  className={`mt-2 size-1.5 flex-shrink-0 rounded-full bg-[#D95B26] transition-transform duration-300 ${
                    isActive ? "scale-125" : "group-hover:scale-125"
                  }`}
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function PdcaSection() {
  const { header, steps } = PDCA_CONFIG;

  const sectionRef = useRef<HTMLElement | null>(null);
  const diagramRef = useRef<PdcaDiagramRef | null>(null);

  const [activeStep, setActiveStep] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      diagramRef.current?.setEntrance(1);
      diagramRef.current?.setExit(0);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrada Suave: Monta o diagrama quando a dobra entra no campo de visão
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        end: "top 25%",
        scrub: 0.6,
        onUpdate: (self) => {
          diagramRef.current?.setEntrance(self.progress);
        },
      });

      // 2. Saída Suave: Só desmonta o diagrama quando o usuário estiver de fato saindo desta dobra!
      // Durante todo o tempo em que a dobra estiver na tela, exit = 0.
      ScrollTrigger.create({
        trigger: section,
        start: "bottom 90%",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          // self.progress vai de 0 (início da saída da dobra) a 1 (quando a dobra sai por completo da tela)
          diagramRef.current?.setExit(self.progress);
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
      id="como-funciona"
      aria-label="Como Funciona: Ciclo PDCA com Agentes de IA"
      className="relative w-full bg-[#FFFFFF] py-20 sm:py-28 lg:py-32 text-[#1D1D1F]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
        {/* 
          1. Cabeçalho da Seção (Centralizado no Topo)
        */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="mb-3.5 inline-block font-sans text-[0.75rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
            {header.tag}
          </span>
          <h2 className="mb-5 font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#1D1D1F] leading-[1.12]">
            {header.title}
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-zinc-600">
            {header.subtitle}
          </p>
        </div>

        {/* 
          2. Corpo da Seção: Dividido em 2 Colunas
          - Lado Esquerdo: Diagrama 3D em Malha de Pontos (Three.js WebGL) com posicionamento sticky
          - Lado Direito: Detalhamento Prático com 4 Cards Verticais
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Lado Esquerdo: Diagrama 3D WebGL (Sticky no viewport para acompanhar os 4 cards) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 xl:top-32 flex items-center justify-center">
            <PdcaParticleDiagram
              ref={diagramRef}
              activeStep={activeStep}
              onStepHover={setActiveStep}
            />
          </div>

          {/* Lado Direito: Detalhamento Prático (4 Cards Verticais) */}
          <div className="lg:col-span-6">
            <div className="space-y-4 sm:space-y-4.5">
              {steps.map((step, index) => (
                <PdcaCard
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={activeStep === step.id}
                  onHover={setActiveStep}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
