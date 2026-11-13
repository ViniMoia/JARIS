export interface OperationalPainTopic {
  id: string;
  title: string;
  description: string;
  iconName: "fragmentation" | "manual" | "inefficiency";
}

export interface OperationalSolutionTopic {
  id: string;
  title: string;
  description: string;
  iconName: "ai" | "modular" | "automation";
}

export const OPERATIONAL_PAINS_CONFIG = {
  header: {
    tag: "O CENÁRIO ATUAL",
    title: "Sua empresa ainda opera assim?",
    subtitle:
      "A maior parte da dor operacional vem de três falhas estruturais — e o JARIS foi desenhado para resolver as três.",
  },
  challengeCard: {
    badge: "DESAFIO OPERACIONAL",
    title: "O DESAFIO",
    topics: [
      {
        id: "fragmentacao",
        title: "Fragmentação",
        description:
          "Dados espalhados em planilhas e sistemas que não se conversam.",
        iconName: "fragmentation",
      },
      {
        id: "processos-manuais",
        title: "Processos Manuais",
        description:
          "Gargalos operacionais e alto risco de erro humano.",
        iconName: "manual",
      },
      {
        id: "baixa-eficiencia",
        title: "Baixa Eficiência",
        description:
          "Dificuldade em escalar o negócio com a estrutura atual.",
        iconName: "inefficiency",
      },
    ] as OperationalPainTopic[],
  },
  solutionCard: {
    badge: "ECOSSISTEMA JARIS",
    title: "A SOLUÇÃO JARIS",
    topics: [
      {
        id: "integrado-ia",
        title: "100% Integrado com IA",
        description:
          "Inteligência Artificial nativa em todos os módulos e processos.",
        iconName: "ai",
      },
      {
        id: "plataforma-modular",
        title: "Plataforma Modular",
        description:
          "Ecossistema completo que se adapta ao tamanho da sua empresa.",
        iconName: "modular",
      },
      {
        id: "automacao-inteligente",
        title: "Automação Inteligente",
        description:
          "Fluxos movidos a IA para liberar o potencial da sua equipe.",
        iconName: "automation",
      },
    ] as OperationalSolutionTopic[],
  },
  closing: {
    quote:
      "Do caos manual à precisão preditiva: o JARIS conecta pessoas, processos e dados em uma única inteligência operacional.",
    ctaLabel: "Conhecer a Arquitetura JARIS",
    ctaHref: "#plataforma",
  },
} as const;

