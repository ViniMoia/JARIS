"use client";

import React, { useState } from "react";
import { CONTACT_CONFIG } from "@/lib/config/contact-config";

function PaperPlaneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4.5 sm:size-5"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-[#D95B26]"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6 text-[#D95B26]"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// Formatação automática de telefone brasileiro (00) 00000-0000
function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function ContactSection() {
  const { header, benefits, slaCard, form } = CONTACT_CONFIG;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    headcount: "",
    selectedModules: [] as string[],
    message: "",
    agreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleModule = (moduleName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedModules.includes(moduleName);
      if (exists) {
        return {
          ...prev,
          selectedModules: prev.selectedModules.filter((m) => m !== moduleName),
        };
      } else {
        return {
          ...prev,
          selectedModules: [...prev.selectedModules, moduleName],
        };
      }
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert("Por favor, confirme a concordância com a Política de Privacidade para prosseguir.");
      return;
    }

    setIsSubmitting(true);
    // Simulação do envio do formulário com feedback visual imediato
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <section
      id="fale-com-time"
      aria-label="Fale com o Time e Agendamento de Demonstração"
      className="relative w-full bg-gradient-to-b from-[#0B1E36] via-[#0D2444] to-[#0A1B30] text-white py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Iluminação ambiente azul tecnológica com realce âmbar sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-0 size-[600px] rounded-full bg-[#1e40af]/15 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 right-0 size-[500px] rounded-full bg-[#D95B26]/12 blur-[140px]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* =========================================================
              LADO ESQUERDO: Argumentação, Autoridade & Benefícios
              ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Tag de Contexto */}
            <div className="flex items-center gap-2 mb-3.5">
              <span className="size-2 rounded-full bg-[#D95B26] animate-pulse" />
              <span className="font-sans text-[0.75rem] font-bold tracking-[0.2em] text-[#D95B26] uppercase">
                {header.tag}
              </span>
            </div>

            {/* Título Principal */}
            <h2 className="mb-5 font-sans text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.03em] text-white leading-[1.14]">
              {header.title}
            </h2>

            {/* Parágrafo de Apoio */}
            <p className="mb-8 font-sans text-base sm:text-lg leading-relaxed text-blue-100/80">
              {header.paragraph}
            </p>

            {/* 4 Pontos de Benefício / Qualificação */}
            <div className="space-y-3 mb-10">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#D95B26]/40 hover:bg-white/[0.08]"
                >
                  <div className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-[#D95B26]/15 border border-[#D95B26]/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckmarkIcon />
                  </div>
                  <span className="font-sans text-sm sm:text-[0.95rem] font-medium text-white/90">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Card de Garantia / SLA de Atendimento */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-5 backdrop-blur-md shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#D95B26]/20 border border-[#D95B26]/30">
                  <ClockIcon />
                </div>
                <div>
                  <h4 className="font-sans text-sm sm:text-base font-bold text-white mb-1">
                    {slaCard.title}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-blue-100/70 leading-relaxed">
                    {slaCard.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              LADO DIREITO: Formulário Completo (Card Branco Apple)
              ========================================================= */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[2.5rem] border border-white/20 bg-white p-6 sm:p-9 text-[#1D1D1F] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              {isSuccess ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <CheckmarkIcon />
                  </div>
                  <h3 className="font-sans text-2xl font-extrabold text-[#1D1D1F] mb-2">
                    Solicitação Recebida com Sucesso!
                  </h3>
                  <p className="font-sans text-sm text-zinc-600 max-w-md mx-auto leading-relaxed mb-6">
                    Agradecemos o seu interesse no JARIS. Nossa equipe de especialistas em IA entrará em contato com você pelo e-mail ou WhatsApp nas próximas 24 horas úteis.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        role: "",
                        headcount: "",
                        selectedModules: [],
                        message: "",
                        agreed: false,
                      });
                    }}
                    className="font-sans text-xs font-bold text-[#D95B26] hover:underline uppercase tracking-wider"
                  >
                    Enviar outra solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Linha 1: Nome Completo & E-mail Corporativo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                        NOME COMPLETO *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Seu nome"
                        className="w-full rounded-xl border border-black/10 bg-[#FAF9F6] px-3.5 py-2.5 sm:py-3 font-sans text-sm text-[#1D1D1F] placeholder:text-zinc-400 focus:border-[#D95B26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95B26]/20 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                        E-MAIL CORPORATIVO *
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="voce@empresa.com.br"
                        className="w-full rounded-xl border border-black/10 bg-[#FAF9F6] px-3.5 py-2.5 sm:py-3 font-sans text-sm text-[#1D1D1F] placeholder:text-zinc-400 focus:border-[#D95B26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95B26]/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Linha 2: Telefone / WhatsApp & Empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                        TELEFONE / WHATSAPP *
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="(00) 00000-0000"
                        className="w-full rounded-xl border border-black/10 bg-[#FAF9F6] px-3.5 py-2.5 sm:py-3 font-sans text-sm text-[#1D1D1F] placeholder:text-zinc-400 focus:border-[#D95B26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95B26]/20 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                        EMPRESA *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="Nome da sua empresa"
                        className="w-full rounded-xl border border-black/10 bg-[#FAF9F6] px-3.5 py-2.5 sm:py-3 font-sans text-sm text-[#1D1D1F] placeholder:text-zinc-400 focus:border-[#D95B26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95B26]/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Linha 3: Cargo & Nº de Colaboradores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                        CARGO *
                      </label>
                      <select
                        required
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full rounded-xl border border-black/10 bg-[#FAF9F6] px-3.5 py-2.5 sm:py-3 font-sans text-sm text-[#1D1D1F] focus:border-[#D95B26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95B26]/20 transition-all duration-200 cursor-pointer"
                      >
                        {form.roles.map((r, i) => (
                          <option key={i} value={i === 0 ? "" : r} disabled={i === 0}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                        Nº DE COLABORADORES *
                      </label>
                      <select
                        required
                        value={formData.headcount}
                        onChange={(e) =>
                          setFormData({ ...formData, headcount: e.target.value })
                        }
                        className="w-full rounded-xl border border-black/10 bg-[#FAF9F6] px-3.5 py-2.5 sm:py-3 font-sans text-sm text-[#1D1D1F] focus:border-[#D95B26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95B26]/20 transition-all duration-200 cursor-pointer"
                      >
                        {form.headcounts.map((h, i) => (
                          <option key={i} value={i === 0 ? "" : h} disabled={i === 0}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Linha 4: Quais módulos mais interessam? (Pills de Seleção Múltipla) */}
                  <div>
                    <label className="mb-2 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                      QUAIS MÓDULOS MAIS INTERESSAM? *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {form.modules.map((modName) => {
                        const isSelected = formData.selectedModules.includes(modName);
                        return (
                          <button
                            type="button"
                            key={modName}
                            onClick={() => toggleModule(modName)}
                            className={`rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 font-sans text-xs sm:text-[0.82rem] font-semibold transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-[#D95B26] text-white border border-[#D95B26] shadow-sm scale-102"
                                : "bg-[#FAF9F6] text-[#1D1D1F] border border-black/8 hover:border-black/20 hover:bg-zinc-100"
                            }`}
                          >
                            {modName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Linha 5: Mensagem */}
                  <div>
                    <label className="mb-1.5 block font-sans text-[0.68rem] font-bold tracking-[0.16em] uppercase text-zinc-500">
                      MENSAGEM (OPCIONAL)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Conte um pouco sobre as principais dores ou objetivos da sua empresa..."
                      className="w-full rounded-xl border border-black/10 bg-[#FAF9F6] px-3.5 py-2.5 font-sans text-sm text-[#1D1D1F] placeholder:text-zinc-400 focus:border-[#D95B26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95B26]/20 transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Linha 6: Checkbox de Política de Privacidade */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.agreed}
                        onChange={(e) =>
                          setFormData({ ...formData, agreed: e.target.checked })
                        }
                        className="mt-0.5 size-4 rounded border-black/20 text-[#D95B26] focus:ring-[#D95B26] cursor-pointer"
                      />
                      <span className="font-sans text-xs sm:text-[0.82rem] text-zinc-600 leading-snug">
                        {form.privacyText}
                      </span>
                    </label>
                  </div>

                  {/* Linha 7: Botão de Envio (CTA Principal com estilo btn-shimmer) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-shimmer group w-full rounded-2xl bg-[#D95B26] py-3.5 sm:py-4 px-6 text-sm sm:text-base font-extrabold uppercase tracking-wider text-white shadow-[0_12px_28px_rgba(217,91,38,0.3)] hover:shadow-[0_16px_36px_rgba(217,91,38,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        <PaperPlaneIcon />
                      </span>
                      <span>
                        {isSubmitting ? "ENVIANDO SOLICITAÇÃO..." : form.ctaButtonText}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

