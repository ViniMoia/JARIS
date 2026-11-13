export interface HighlightCardItem {
  id: string;
  indexStr: string;
  tag: string;
  title: string;
  text: string;
  bullets: string[];
  benefit: string;
  metricHighlight: string;
  uiSimulationType: "recruitment" | "payroll" | "finance";
}

export interface HighlightsConfig {
  header: {
    tag: string;
    title: string;
    subtitle: string;
  };
  cards: HighlightCardItem[];
}

export const HIGHLIGHTS_CONFIG: HighlightsConfig = {
  header: {
    tag: "DESTAQUES COM IA",
    title: "Tecnologia prática gerando impacto mensurável no seu negócio.",
    subtitle:
      "Veja como os agentes de IA do JARIS transformam processos críticos em vantagens competitivas reais para sua operação.",
  },
  cards: [
    {
      id: "contratacao",
      indexStr: "01",
      tag: "01 / RH & DP ESTRATÉGICO",
      title: "Contratação Inteligente",
      text: "Da triagem de currículos ao onboarding digital, tudo orquestrado por IA.",
      bullets: [
        "Triagem IA com score de compatibilidade",
        "Agendamento inteligente de entrevistas",
        "Validação automática de documentos",
        "Integração com clínica para ASO",
      ],
      benefit: "Redução de até 60% no tempo de contratação",
      metricHighlight: "-60% tempo de contratação",
      uiSimulationType: "recruitment",
    },
    {
      id: "folha",
      indexStr: "02",
      tag: "02 / COMPLIANCE & OPERAÇÃO",
      title: "Ponto e Folha Automatizados",
      text: "Jornada, cálculos e conformidade legal em um único fluxo.",
      bullets: [
        "Marcação via App, Web ou Biometria",
        "Reconhecimento facial e prova de vida",
        "Cálculo automático de proventos e encargos",
        "Auditoria automática de eSocial",
      ],
      benefit: "Zero erros e segurança jurídica absoluta",
      metricHighlight: "100% conformidade eSocial",
      uiSimulationType: "payroll",
    },
    {
      id: "financeiro",
      indexStr: "03",
      tag: "03 / GESTÃO FINANCEIRA",
      title: "Fluxo Financeiro Preditivo",
      text: "Do lançamento à projeção de cenários, com IA analisando cada movimento.",
      bullets: [
        "Lançamentos e vencimentos automáticos",
        "Visão do caixa em tempo real",
        "Projeção de cenários baseada em histórico",
        "Assistente IA de análise de desvios",
      ],
      benefit: "Controle total e previsibilidade financeira",
      metricHighlight: "Visão 360° em tempo real",
      uiSimulationType: "finance",
    },
  ],
};

