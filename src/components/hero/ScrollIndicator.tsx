import { forwardRef } from "react";

export const ScrollIndicator = forwardRef<HTMLDivElement>(
  function ScrollIndicator(_, ref) {
    return (
      <div
        ref={ref}
        aria-label="Role para explorar"
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2.5 sm:bottom-8"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.26em] text-[#4b5563]/80">
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="flex h-7 w-4 items-start justify-center rounded-full border border-[#111827]/20 p-1"
        >
          <span className="scroll-indicator-dot h-1.5 w-1 rounded-full bg-[#111827]/60" />
        </span>
      </div>
    );
  }
);
