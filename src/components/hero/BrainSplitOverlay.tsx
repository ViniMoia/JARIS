"use client";

import { forwardRef } from "react";
import { HERO_STAGE_02_COPY } from "@/lib/config/particle-config";

export const BrainSplitOverlay = forwardRef<HTMLDivElement>(
  function BrainSplitOverlay(_, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-5 py-6 text-[#111827] opacity-0 sm:px-8 sm:py-8 lg:block lg:p-0"
      >
        {/* Top-left: 3-line thin display headline */}
        <h1
          data-brain-reveal
          className="font-sans text-[2.25rem] leading-[0.94] font-light tracking-[-0.03em] text-[#111827] sm:text-[3rem] lg:absolute lg:top-[6.8vw] lg:left-[2.2vw] lg:w-[34vw] lg:text-[4.6vw]"
        >
          {HERO_STAGE_02_COPY.headlineLines.map((line, index) => (
            <span key={line} className="block">
              {line}
              {index < HERO_STAGE_02_COPY.headlineLines.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        {/* Mobile/Tablet lower stack sits cleanly below the centered 3D brain */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:contents">
          {/* Mid-left: uppercase descriptive copy */}
          <p
            data-brain-reveal
            className="max-w-[24rem] font-sans text-[0.75rem] leading-[1.35] font-normal tracking-[0.06em] text-[#4b5563] uppercase sm:text-[0.875rem] lg:absolute lg:top-[calc(50%+2.361vw)] lg:left-[2.2vw] lg:w-[24vw] lg:max-w-none lg:text-[0.95vw]"
          >
            {HERO_STAGE_02_COPY.leftDescription}
          </p>

          {/* Mid-right: uppercase right-aligned micro-block */}
          <p
            data-brain-reveal
            className="font-sans text-[0.75rem] leading-[1.35] font-normal tracking-[0.06em] text-[#4b5563] uppercase sm:text-[0.875rem] lg:absolute lg:top-[calc(50%+2.361vw)] lg:right-[2.2vw] lg:w-[15vw] lg:text-right lg:text-[0.95vw]"
          >
            {HERO_STAGE_02_COPY.rightTag}
          </p>

          {/* Bottom-right: large right-aligned display quote */}
          <p
            data-brain-reveal
            className="font-sans text-[2rem] leading-[0.94] font-light tracking-[-0.03em] text-[#111827] sm:text-[2.75rem] lg:absolute lg:right-[2.2vw] lg:bottom-[2.2vw] lg:w-[36vw] lg:text-right lg:text-[4.6vw]"
          >
            {HERO_STAGE_02_COPY.rightQuoteLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          {/* Bottom-left: primary CTA structured after Vesper Split Overlay */}
          <div
            data-brain-reveal
            data-brain-cta
            className="pt-1 lg:absolute lg:bottom-[2.2vw] lg:left-[2.2vw] lg:pt-0"
          >
            <a
              href={HERO_STAGE_02_COPY.ctaHref}
              className="group inline-flex items-center gap-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827] lg:gap-[0.278vw]"
            >
              <span className="flex h-[2.875rem] items-center justify-center bg-[#111827] px-6 font-sans text-[0.9375rem] leading-[1.2] font-medium text-[#ffffff] transition-colors duration-300 group-hover:bg-[#1f2937] sm:px-8 lg:h-[3.35vw] lg:px-[3.2vw] lg:text-[1vw]">
                {HERO_STAGE_02_COPY.ctaLabel}
              </span>
              <span
                aria-hidden="true"
                className="flex size-[2.875rem] shrink-0 items-center justify-center border border-[#111827]/15 bg-[#fdfbf7] text-[#111827] transition-colors duration-300 group-hover:border-[#111827]/35 group-hover:bg-[#ffffff] lg:size-[3.35vw]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-4 transition-transform duration-500 ease-out group-hover:rotate-45 lg:size-[1.25vw]"
                >
                  <path
                    d="M12 2.5V21.5M2.5 12H21.5M5.28 5.28L18.72 18.72M18.72 5.28L5.28 18.72"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }
);

