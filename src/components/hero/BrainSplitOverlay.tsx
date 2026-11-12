"use client";

import { forwardRef } from "react";
import { HERO_STAGE_02_COPY } from "@/lib/config/particle-config";

export const BrainSplitOverlay = forwardRef<HTMLDivElement>(
  function BrainSplitOverlay(_, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-5 pt-[5.5rem] pb-6 text-[#0a0a0a] opacity-0 sm:px-8 sm:pt-[6rem] sm:pb-8 lg:block lg:p-0"
      >
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

