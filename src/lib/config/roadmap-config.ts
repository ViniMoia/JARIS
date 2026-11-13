export interface RoadmapPhaseItem {
  id: string;
  phaseNumber: number;
  phaseLabel: string;
  title: string;
  description: string;
  status: "disponivel" | "em-breve" | "desenvolvimento" | "planejado" | "futuro";
  statusLabel: string;
  features: string[];
}

export interface RoadmapConfig {
  tag: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  earlyAdopterCard: {
    tag: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  phases: RoadmapPhaseItem[];
}

export const ROADMAP_CONFIG: RoadmapConfig = {
  tag: "ROTEIRO DE EVOLUÇÃO",
  titlePrefix: "Evolução contínua em ",
  titleHighlight: "5 fases estratégicas.",
  subtitle:
    "Transparência total na entrega da plataforma. Conheça as etapas de desenvolvimento e torne-se um parceiro Early Adopter para moldar o produto com acesso antecipado.",
  earlyAdopterCard: {
    tag: "ACESSO ANTECIPADO",
    title: "Seja uma Empresa Parceira Early Adopter",
    description:
      "Empresas pioneiras testam módulos em primeira mão, recebem condições comerciais exclusivas e têm canal direto com nossos engenheiros de produto para priorizar suas demandas operacionais.",
    ctaLabel: "Solicitar Demonstração & Acesso Antecipado",
    ctaHref: "#fale-com-time",
  },
  phases: [
    {
      id: "fase-1",
      phaseNumber: 1,
      phaseLabel: "Fase 1",
      title: "DP Inteligente",
      description: "Fluxo de contratação IA, Ponto e Folha Digital, Férias.",
      status: "disponivel",
      statusLabel: "Operando • Disponível",
      features: [
        "Fluxo de contratação IA de ponta a ponta",
        "Ponto e Folha Digital com automação nativa",
        "Gestão inteligente e autônoma de Férias",
      ],
    },
    {
      id: "fase-2",
      phaseNumber: 2,
      phaseLabel: "Fase 2",
      title: "Financeiro IA",
      description: "Projeções preditivas e Assistente de Análise.",
      status: "em-breve",
      statusLabel: "Próximo Lançamento • Q1",
      features: [
        "Projeções preditivas de fluxo de caixa",
        "Assistente de Análise financeira 24/7",
        "Diagnóstico antecipado de gargalos e custos",
      ],
    },
    {
      id: "fase-3",
      phaseNumber: 3,
      phaseLabel: "Fase 3",
      title: "Contratos IA",
      description: "Ciclo documental e Auditoria Inteligente.",
      status: "desenvolvimento",
      statusLabel: "Em Desenvolvimento • Q2",
      features: [
        "Ciclo documental unificado e digital",
        "Auditoria Inteligente de cláusulas de risco",
        "Rastreamento de renovações e compliance",
      ],
    },
    {
      id: "fase-4",
      phaseNumber: 4,
      phaseLabel: "Fase 4",
      title: "Suprimentos IA",
      description: "Cotações automáticas e Compras Preditivas.",
      status: "planejado",
      statusLabel: "Planejado • Q3",
      features: [
        "Cotações automáticas com fornecedores",
        "Compras Preditivas com reposição inteligente",
        "Equalização de orçamentos e menor custo operacional",
      ],
    },
    {
      id: "fase-5",
      phaseNumber: 5,
      phaseLabel: "Fase 5",
      title: "Ecossistema 360°",
      description: "Integração total com IA Avançada Core.",
      status: "futuro",
      statusLabel: "Visão Global • Q4",
      features: [
        "Integração total entre todos os módulos",
        "IA Avançada Core com tomada de decisão orquestrada",
        "Cockpit executivo com visibilidade estratégica 360°",
      ],
    },
  ],
};
