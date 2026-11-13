"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HERO_STAGE_02_COPY } from "@/lib/config/particle-config";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 1. Fallback / check on direct scroll or page load at lower sections
    const checkScroll = () => {
      const scrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 1.9;
      const glassThreshold = window.innerHeight * 3.2;

      if (scrollY >= heroThreshold) {
        setIsVisible(true);
        setIsScrolled(scrollY >= glassThreshold);
      } else if (scrollY < 50) {
        // At the very top (ant stage): header must NOT be visible
        setIsVisible(false);
        setIsScrolled(false);
      }
    };

    // 2. Exact synchronization with Hero Stage 02 brain formation
    const handleHeroStage = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        if (typeof detail.isRevealed === "boolean") {
          setIsVisible(detail.isRevealed);
        }
        if (typeof detail.isGlass === "boolean") {
          setIsScrolled(detail.isGlass);
        }
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("jaris:hero-stage", handleHeroStage);
    checkScroll();

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("jaris:hero-stage", handleHeroStage);
    };
  }, []);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection =
      document.getElementById("fale-com-time") ||
      document.getElementById("contato");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      id="jaris-global-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-4"
      } ${
        isScrolled
          ? "bg-white/85 backdrop-blur-md border-b border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-2.5 sm:py-3"
          : "bg-transparent py-4 sm:py-5 lg:py-6"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-[2.2vw]">
        {/* Left: JARIS Logo */}
        <a
          href="#hero"
          onClick={handleScrollToTop}
          className="group flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
          aria-label="JARIS — Voltar ao início da Hero"
        >
          <div className="relative h-[2.5rem] w-[2.5rem] sm:h-[2.85rem] sm:w-[2.85rem] transition-transform duration-300 group-hover:scale-105">
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
          className="hidden items-center gap-7 lg:gap-9 font-sans text-[0.875rem] lg:text-[0.9375rem] font-medium tracking-[0.01em] text-[#1D1D1F]/80 md:flex"
        >
          {HERO_STAGE_02_COPY.headerNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="outline-none transition-colors duration-200 hover:text-[#D95B26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: "Solicitar Demo" button in project orange (#D95B26) */}
        <div>
          <a
            href={HERO_STAGE_02_COPY.headerCtaHref}
            onClick={handleScrollToContact}
            className="group inline-flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95B26]"
          >
            <span className="flex h-[2.35rem] sm:h-[2.55rem] items-center justify-center rounded-none bg-[#D95B26] px-4 sm:px-5 font-sans text-[0.8125rem] sm:text-[0.875rem] font-medium tracking-[0.01em] text-white transition-colors duration-300 group-hover:bg-[#c44e1c]">
              {HERO_STAGE_02_COPY.headerCtaLabel}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
