"use client";

import React from "react";
import Image from "next/image";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Rodapé Institucional JARIS"
      className="relative w-full bg-gradient-to-b from-[#0A1B30] to-[#06111e] text-white border-t border-white/10 pt-16 sm:pt-20 pb-12 overflow-hidden"
    >
      {/* Luz ambiente arquitetural difusa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/3 size-[500px] -translate-y-1/2 rounded-full bg-[#1e40af]/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 size-[350px] rounded-full bg-[#D95B26]/8 blur-[100px]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 relative z-10">
        {/* Top Grid: 4 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Coluna 1: Marca & Tagline (5 colunas) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Logo e Nome da Marca */}
              <div
                onClick={scrollToTop}
                className="inline-flex items-center gap-3 cursor-pointer group mb-4"
              >
                <div className="relative size-9 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/jaris-logo.webp"
                    alt="JARIS Logo"
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>
                <span className="font-sans text-2xl font-black tracking-tight text-white">
                  JARIS<span className="text-[#D95B26]">.</span>
                </span>
              </div>

              {/* Tagline */}
              <p className="font-sans text-sm text-blue-100/75 leading-relaxed max-w-sm mb-6">
                Gestão estratégica unificada, operada continuamente por agentes
                autônomos de Inteligência Artificial.
              </p>
            </div>

            {/* Status do Sistema (Pill minimalista do Design System - cantos retos) */}
            <div className="inline-flex items-center gap-2.5 rounded-none border border-white/10 bg-white/5 px-3.5 py-1.5 font-sans text-[0.68rem] font-semibold text-blue-200/90 w-fit backdrop-blur-sm">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SISTEMA OPERACIONAL • SLA 99.98%</span>
            </div>
          </div>

          {/* Coluna 2: Plataforma (2 ou 3 colunas) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#D95B26] mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-blue-100/70">
              <li>
                <a
                  href="#cenario-atual"
                  className="hover:text-white transition-colors duration-200"
                >
                  Cenário Operacional
                </a>
              </li>
              <li>
                <a
                  href="#ecossistema"
                  className="hover:text-white transition-colors duration-200"
                >
                  Ecossistema Modular
                </a>
              </li>
              <li>
                <a
                  href="#como-funciona"
                  className="hover:text-white transition-colors duration-200"
                >
                  Ciclo PDCA + IA
                </a>
              </li>
              <li>
                <a
                  href="#destaques-ia"
                  className="hover:text-white transition-colors duration-200"
                >
                  Destaques com IA
                </a>
              </li>
              <li>
                <a
                  href="#inteligencia-dados"
                  className="hover:text-white transition-colors duration-200"
                >
                  Inteligência de Dados
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Soluções (2 ou 3 colunas) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#D95B26] mb-4">
              Módulos
            </h4>
            <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-blue-100/70">
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Contratação Inteligente
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Ponto & Folha Automatizados
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Fluxo Financeiro Preditivo
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Gestão de Suprimentos
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Auditoria eSocial Contínua
                </span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Governança & Contato (3 colunas) */}
          <div className="lg:col-span-3">
            <h4 className="font-sans text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#D95B26] mb-4">
              Atendimento & Segurança
            </h4>
            <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-blue-100/70 mb-5">
              <li>
                <a
                  href="#fale-com-time"
                  className="text-white font-medium hover:text-[#D95B26] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>Agendar Demonstração</span>
                  <span className="text-[0.65rem] font-sans text-[#D95B26]">→</span>
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Segurança & Criptografia Ponta a Ponta
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Conformidade LGPD
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                  Termos de Serviço & Privacidade
                </span>
              </li>
            </ul>

            {/* Badges de Certificação / Confiança (cantos retos) */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-none border border-white/10 bg-white/5 px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-wider text-blue-200/80">
                SOC-2 TYPE II
              </span>
              <span className="rounded-none border border-white/10 bg-white/5 px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-wider text-blue-200/80">
                ISO 27001
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright e Voltar ao Topo */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-blue-200/60">
          <p>© 2026 JARIS Technologies. Todos os direitos reservados.</p>

          <button
            onClick={scrollToTop}
            aria-label="Voltar ao início da página"
            className="group flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-blue-200/70 hover:text-white transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-1"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

