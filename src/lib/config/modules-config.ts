export type ModuleStatusType = "core" | "construction" | "roadmap" | "core-highlight";

export interface EcosystemModule {
  id: string;
  title: string;
  category: string;
  status: string;
  statusType: ModuleStatusType;
  iconName: "hr" | "finance" | "supplies" | "contracts" | "budget" | "ai-core";
  isHighlight?: boolean;
  features: string[];
}

export const MODULAR_ECOSYSTEM_CONFIG = {
  header: {
    tag: "ECOSSISTEMA MODULAR",
    title: "Um ecossistema. Seis módulos. Uma inteligência central.",
    subtitle:
      "Cada módulo opera de forma independente, mas conversa em tempo real com os demais. Adote apenas o que sua empresa precisa hoje — escale quando quiser.",
  },
  modules: [
    {
      id: "rh-dp",
      title: "RH / DP Inteligente",
      category: "Gestão de Pessoas",
      status: "EM CONSTRUÇÃO",
      statusType: "construction",
      iconName: "hr",
      features: [
        "Recrutamento e fluxo de contratação com IA",
        "Gestão de ponto com validação facial",
        "Folha de pagamento automatizada",
        "Gestão de férias estratégica",
        "Painel do colaborador",
      ],
    },
    {
      id: "financeiro",
      title: "Financeiro IA",
      category: "Controladoria & Caixa",
      status: "CORE",
      statusType: "core",
      iconName: "finance",
      features: [
        "Contas a pagar e receber",
        "Fluxo de caixa em tempo real",
        "Projeção financeira com IA",
        "Assistente de análise inteligente",
        "Conciliação bancária automática",
      ],
    },
    {
      id: "suprimentos",
      title: "Suprimentos IA",
      category: "Compras & Estoque",
      status: "EM CONSTRUÇÃO",
      statusType: "construction",
      iconName: "supplies",
      features: [
        "Gestão de compras inteligente",
        "Controle de estoque preditivo",
        "Homologação automática de fornecedores",
        "Cotação com análise de custo-benefício",
        "Requisições via fluxo de aprovação",
      ],
    },
    {
      id: "contratos",
      title: "Gestão de Contratos",
      category: "Jurídico & Compliance",
      status: "ROADMAP",
      statusType: "roadmap",
      iconName: "contracts",
      features: [
        "Ciclo de vida documental completo",
        "Assinatura digital integrada",
        "Alertas de renovação via IA",
        "Auditoria automática de cláusulas",
        "Repositório com busca inteligente",
      ],
    },
    {
      id: "orcamentos",
      title: "Orçamentos IA",
      category: "Comercial & Propostas",
      status: "EM CONSTRUÇÃO",
      statusType: "construction",
      iconName: "budget",
      features: [
        "Criação rápida de propostas",
        "Análise automática de margens e custos",
        "Fluxo de aprovação por alçada",
        "Histórico de revisões e versões",
        "Sugestão de condições para conversão",
      ],
    },
    {
      id: "inteligencia-central",
      title: "Inteligência Central (IA Core)",
      category: "Núcleo de Integração",
      status: "CORE",
      statusType: "core-highlight",
      isHighlight: true,
      iconName: "ai-core",
      features: [
        "Conecta todos os módulos em uma única inteligência",
        "Análises preditivas cross-módulo",
        "Dashboards 360° em tempo real",
        "Insights estratégicos automáticos",
        "Auditoria inteligente nativa",
      ],
    },
  ] as EcosystemModule[],
} as const;

