export interface RoadmapPhaseItem {
  id: string;
  phaseNumber: number;
  phaseLabel: string;
  category: string;
  title: string;
  description: string;
  statusLabel: string;
  side: "left" | "right";
  threshold: number;
}

export interface RoadmapConfig {
  tag: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  phases: RoadmapPhaseItem[];
  earlyAdopterCard: {
    tag: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

export const ROADMAP_CONFIG: RoadmapConfig = {
  tag: "ROTEIRO DE EVOLUÇÃO",
  titlePrefix: "Evolução contínua em ",
  titleHighlight: "5 fases estratégicas.",
  subtitle:
    "Transparência total no desenvolvimento da plataforma. Conheça as etapas de entrega e participe como parceiro Early Adopter moldando o produto com benefícios de acesso antecipado.",
  earlyAdopterCard: {
    tag: "ACESSO ANTECIPADO",
    title: "Seja uma Empresa Parceira Early Adopter",
    description:
      "Empresas parceiras testam novas fases em primeira mão, recebem condições comerciais exclusivas e possuem canal direto com nosso time de engenharia para priorizar demandas reais da sua operação.",
    ctaLabel: "Solicitar Demonstração & Acesso Antecipado",
    ctaHref: "#fale-com-time",
  },
  phases: [
    {
      id: "fase-1",
      phaseNumber: 1,
      phaseLabel: "Fase 1",
      category: "DP INTELIGENTE",
      title: "Fase 1 — DP Inteligente",
      description: "Fluxo de contratação IA, Ponto e Folha Digital, Férias.",
      statusLabel: "Operando • Disponível",
      side: "left",
      threshold: 0.08,
    },
    {
      id: "fase-2",
      phaseNumber: 2,
      phaseLabel: "Fase 2",
      category: "FINANCEIRO IA",
      title: "Fase 2 — Financeiro IA",
      description: "Projeções preditivas e Assistente de Análise.",
      statusLabel: "Próximo Lançamento • Q1",
      side: "right",
      threshold: 0.28,
    },
    {
      id: "fase-3",
      phaseNumber: 3,
      phaseLabel: "Fase 3",
      category: "CONTRATOS IA",
      title: "Fase 3 — Contratos IA",
      description: "Ciclo documental e Auditoria Inteligente.",
      statusLabel: "Em Desenvolvimento • Q2",
      side: "left",
      threshold: 0.48,
    },
    {
      id: "fase-4",
      phaseNumber: 4,
      phaseLabel: "Fase 4",
      category: "SUPRIMENTOS IA",
      title: "Fase 4 — Suprimentos IA",
      description: "Cotações automáticas e Compras Preditivas.",
      statusLabel: "Planejado • Q3",
      side: "right",
      threshold: 0.68,
    },
    {
      id: "fase-5",
      phaseNumber: 5,
      phaseLabel: "Fase 5",
      category: "ECOSSISTEMA 360°",
      title: "Fase 5 — Ecossistema 360°",
      description: "Integração total com IA Avançada Core.",
      statusLabel: "Visão Global • Q4",
      side: "left",
      threshold: 0.88,
    },
  ],
};
