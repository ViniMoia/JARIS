"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { HERO_STAGE_02_COPY } from "@/lib/config/particle-config";

export const BrainSplitOverlay = forwardRef<HTMLDivElement>(
  function BrainSplitOverlay(_, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-5 pt-4 pb-6 text-[#0a0a0a] opacity-0 sm:px-8 sm:pt-6 sm:pb-8 lg:block lg:p-0"
      >
        {/* Top Header: invisible background, no borders, reveals seamlessly with Hero Stage 02 */}
        <header
          data-brain-reveal
          className="flex w-full items-center justify-between pb-4 sm:pb-6 lg:absolute lg:top-[1.6vw] lg:left-0 lg:right-0 lg:px-[2.2vw] lg:pb-0"
        >
          {/* Left: Original JARIS logo, centered on Y-axis, redirects back to hero */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              const heroEl = document.getElementById("hero");
              const targetY = heroEl
                ? heroEl.offsetTop + window.innerHeight * 2.6
                : window.innerHeight * 2.6;
              window.scrollTo({
                top: targetY,
                behavior: "smooth",
              });
            }}
            className="group flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
            aria-label="JARIS — Voltar ao início da Hero"
          >
            <div className="relative h-[2.8vw] min-h-[36px] max-h-[46px] w-[2.8vw] min-w-[36px] max-w-[46px] transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/jaris-logo.webp"
                alt="JARIS Logo"
                fill
                sizes="64px"
                priority
                className="object-contain"
              />
            </div>
          </a>

          {/* Center: Plataforma, Soluções, Sobre */}
          <nav
            aria-label="Navegação Principal"
            className="hidden items-center gap-[2.4vw] font-sans text-[0.9375rem] font-normal tracking-[0.01em] text-[#0a0a0a]/80 lg:flex lg:text-[0.95vw]"
          >
            {HERO_STAGE_02_COPY.headerNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="outline-none transition-colors duration-200 hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right: "Solicitar Demo" button in project orange (#D95B26) */}
          <div>
            <a
              href={HERO_STAGE_02_COPY.headerCtaHref}
              className="group inline-flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
            >
              <span className="flex h-[2.35vw] min-h-[34px] max-h-[38px] items-center justify-center bg-[#D95B26] px-4 font-sans text-[0.8125rem] font-medium tracking-[0.01em] text-white transition-colors duration-300 group-hover:bg-[#c44e1c] sm:px-5 lg:h-[2.35vw] lg:px-[1.25vw] lg:text-[0.85vw]">
                {HERO_STAGE_02_COPY.headerCtaLabel}
              </span>
            </a>
          </div>
        </header>

        {/* Top-left: 3-line thin display headline */}
        <h1
          data-brain-reveal
          className="font-sans text-[2.25rem] leading-[0.94] font-light tracking-[-0.03em] text-[#0a0a0a] sm:text-[3rem] lg:absolute lg:top-[8.5vw] lg:left-[2.2vw] lg:w-[34vw] lg:text-[4.6vw]"
        >
          {HERO_STAGE_02_COPY.headlineLines.map((line, index) => {
            const isJarisLine = line.includes("JARIS");
            return (
              <span key={line} className="block">
                {isJarisLine ? (
                  <>
                    <span className="text-[#D95B26] font-normal">JARIS</span>
                    {line.replace("JARIS", "")}
                  </>
                ) : (
                  line
                )}
                {index < HERO_STAGE_02_COPY.headlineLines.length - 1 ? " " : ""}
              </span>
            );
          })}
        </h1>

        {/* Mobile/Tablet lower stack sits cleanly below the centered 3D brain */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:contents">
          {/* Mid-left: descriptive copy */}
          <p
            data-brain-reveal
            className="max-w-[24rem] font-sans text-[0.8125rem] leading-[1.4] font-normal tracking-[0.01em] text-zinc-600 sm:text-[0.9375rem] lg:absolute lg:top-[calc(50%+2.361vw)] lg:left-[2.2vw] lg:w-[24vw] lg:max-w-none lg:text-[1vw]"
          >
            {HERO_STAGE_02_COPY.leftDescription}
          </p>

          {/* Mid-right: right-aligned micro-block */}
          <p
            data-brain-reveal
            className="font-sans text-[0.75rem] leading-[1.35] font-normal tracking-[0.01em] text-zinc-600 sm:text-[0.875rem] lg:absolute lg:top-[calc(50%+2.361vw)] lg:right-[2.2vw] lg:w-[18vw] lg:text-right lg:text-[0.95vw]"
          >
            {HERO_STAGE_02_COPY.rightTagLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>

          {/* Bottom-right: large right-aligned display quote */}
          <p
            data-brain-reveal
            className="font-sans text-[2rem] leading-[0.94] font-light tracking-[-0.03em] text-[#0a0a0a] sm:text-[2.75rem] lg:absolute lg:right-[2.2vw] lg:bottom-[2.2vw] lg:w-[44vw] lg:text-right lg:text-[3.9vw]"
          >
            {HERO_STAGE_02_COPY.rightQuoteLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>

          {/* Bottom-left: primary CTA structured after Vesper Split Overlay with high contrast on white */}
          <div
            data-brain-reveal
            data-brain-cta
            className="pt-1 lg:absolute lg:bottom-[2.2vw] lg:left-[2.2vw] lg:pt-0"
          >
            <a
              href={HERO_STAGE_02_COPY.ctaHref}
              className="group inline-flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a0a0a]"
            >
              <span className="flex h-[2.875rem] items-center justify-center bg-[#0a0a0a] px-6 font-sans text-[0.9375rem] leading-[1.2] font-medium text-white transition-colors duration-300 group-hover:bg-[#27272a] sm:px-8 lg:h-[3.35vw] lg:px-[3.2vw] lg:text-[1vw]">
                {HERO_STAGE_02_COPY.ctaLabel}
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }
);

