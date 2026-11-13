export interface PdcaStepItem {
  id: "P" | "D" | "C" | "A";
  letter: string;
  title: string;
  stageName: string;
  description?: string;
  bullets: string[];
}

export interface PdcaSectionConfig {
  header: {
    tag: string;
    title: string;
    subtitle: string;
  };
  steps: PdcaStepItem[];
}

export const PDCA_CONFIG: PdcaSectionConfig = {
  header: {
    tag: "COMO FUNCIONA",
    title: "Gestão estratégica, agora operada por agentes de IA.",
    subtitle:
      "O JARIS automatiza o ciclo PDCA com agentes inteligentes que planejam, executam, auditam e otimizam seus processos continuamente.",
  },
  steps: [
    {
      id: "P",
      letter: "P",
      title: "Planejar",
      stageName: "Plan",
      bullets: [
        "Identificar o problema",
        "Analisar o processo via IA",
        "Criar plano de ação inteligente",
      ],
    },
    {
      id: "D",
      letter: "D",
      title: "Executar",
      stageName: "Do",
      bullets: [
        "Executar via módulos integrados",
        "Operação unificada",
        "Coleta de dados em tempo real",
      ],
    },
    {
      id: "C",
      letter: "C",
      title: "Verificar",
      stageName: "Check",
      bullets: [
        "Checar resultados obtidos",
        "Análise preditiva de desvios",
        "Dashboards de performance",
      ],
    },
    {
      id: "A",
      letter: "A",
      title: "Agir",
      stageName: "Act",
      bullets: [
        "Análise de resultados via IA",
        "Otimização contínua",
        "Escalabilidade do processo",
      ],
    },
  ],
};

