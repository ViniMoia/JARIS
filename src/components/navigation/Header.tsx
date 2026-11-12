"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="site-header"
      className="pointer-events-auto fixed top-[0.8vw] left-1/2 z-50 h-[3.4vw] min-h-[48px] max-h-[56px] w-[68vw] max-w-[1040px] -translate-x-1/2 border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-[12px] max-lg:top-[1rem] max-lg:h-[3.5rem] max-lg:w-[calc(100%-2.5rem)]"
    >
      <div className="flex h-full items-center justify-between px-3 sm:px-4 lg:px-[1.2vw]">
        {/* Left: Brand logo with metallic ant icon + wide-tracked wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26] lg:gap-[0.55vw]"
          aria-label="JARIS — Início"
        >
          <div className="relative size-6 shrink-0 transition-transform duration-300 group-hover:scale-105 lg:size-[1.65vw]">
            <Image
              src="/jaris-ant-icon.webp"
              alt="JARIS Ant Symbol"
              fill
              sizes="32px"
              priority
              className="object-contain"
            />
          </div>
          <span className="font-sans text-[0.95rem] font-semibold tracking-[0.22em] text-white transition-colors duration-200 lg:text-[1.05vw]">
            JARIS
          </span>
        </Link>

        {/* Center: Minimalist navigation links (Desktop) */}
        <nav
          aria-label="Navegação Principal"
          className="hidden items-center gap-[2.2vw] font-sans text-[0.82vw] font-normal tracking-[0.02em] whitespace-nowrap lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-white/70 outline-none transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: CTA Button and Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CTA: "Solicitar demo" in official project orange (#D95B26), compact version of "Explorar Plataforma" */}
          <a
            href="#contato"
            className="group inline-flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
          >
            <span className="flex h-[2.2vw] min-h-[32px] max-h-[36px] items-center justify-center bg-[#D95B26] px-3.5 font-sans text-[0.75rem] font-medium tracking-[0.01em] text-white transition-colors duration-300 group-hover:bg-[#c44e1c] sm:px-4 lg:h-[2.2vw] lg:px-[1.1vw] lg:text-[0.8vw]">
              Solicitar demo
            </span>
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="relative flex size-9 shrink-0 items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26] lg:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute block h-px w-5 bg-white transition-transform duration-300 ${
                mobileMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute block h-px w-5 bg-white transition-transform duration-300 ${
                mobileMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navegação Mobile"
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 flex flex-col border border-white/10 bg-[#0a0a0a]/95 p-4 backdrop-blur-[12px] lg:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 font-sans text-[0.875rem] font-normal tracking-[0.02em] text-white/80 outline-none transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
