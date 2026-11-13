export interface DataIntelligenceFeature {
  id: string;
  numberStr: string;
  title: string;
  description: string;
  iconName: "reports" | "predictive" | "insights";
}

export interface ChartMonthData {
  month: string;
  fullMonth: string;
  heightPercent: number; // 0 - 100
  color: string;
  metricValue: string;
  kpiSubtitle: string;
  growth: string;
}

export interface MetricViewMode {
  id: "efficiency" | "automation" | "cost-saving";
  label: string;
  badgePercent: string;
  data: ChartMonthData[];
}

export interface DataIntelligenceConfig {
  header: {
    tag: string;
    title: string;
    subtitle: string;
  };
  features: DataIntelligenceFeature[];
  card: {
    title: string;
    modes: MetricViewMode[];
  };
}

export const DATA_INTELLIGENCE_CONFIG: DataIntelligenceConfig = {
  header: {
    tag: "INTELIGÊNCIA DE DADOS",
    title: "O JARIS trabalha para você — entregando a informação pronta.",
    subtitle:
      "Esqueça planilhas manuais e relatórios que demoram dias. Nossa IA consolida dados de todos os módulos e entrega insights acionáveis em tempo real.",
  },
  features: [
    {
      id: "relatorios-automaticos",
      numberStr: "01",
      title: "Relatórios Automáticos",
      description:
        "Geração instantânea de DRE, balancetes e KPIs sem intervenção manual.",
      iconName: "reports",
    },
    {
      id: "analises-preditivas",
      numberStr: "02",
      title: "Análises Preditivas",
      description:
        "A IA identifica tendências e desvios antes que aconteçam, permitindo gestão proativa.",
      iconName: "predictive",
    },
    {
      id: "insights-estrategicos",
      numberStr: "03",
      title: "Insights Estratégicos",
      description:
        "Assistente inteligente que sugere ações de otimização baseadas no comportamento real da empresa.",
      iconName: "insights",
    },
  ],
  card: {
    title: "Performance Operacional",
    modes: [
      {
        id: "efficiency",
        label: "Eficiência",
        badgePercent: "+24%",
        data: [
          {
            month: "Jan",
            fullMonth: "Janeiro",
            heightPercent: 35,
            color: "#F3D0B6",
            metricValue: "68.2%",
            kpiSubtitle: "Eficiência média",
            growth: "+4.1%",
          },
          {
            month: "Fev",
            fullMonth: "Fevereiro",
            heightPercent: 50,
            color: "#EAB38E",
            metricValue: "74.5%",
            kpiSubtitle: "Eficiência média",
            growth: "+6.3%",
          },
          {
            month: "Mar",
            fullMonth: "Março",
            heightPercent: 45,
            color: "#E29D6E",
            metricValue: "72.0%",
            kpiSubtitle: "Ajuste de safra",
            growth: "-2.5%",
          },
          {
            month: "Abr",
            fullMonth: "Abril",
            heightPercent: 65,
            color: "#DB8249",
            metricValue: "83.4%",
            kpiSubtitle: "Módulos integrados",
            growth: "+11.4%",
          },
          {
            month: "Mai",
            fullMonth: "Maio",
            heightPercent: 60,
            color: "#E28E54",
            metricValue: "81.9%",
            kpiSubtitle: "Estabilização IA",
            growth: "-1.5%",
          },
          {
            month: "Jun",
            fullMonth: "Junho",
            heightPercent: 82,
            color: "#D95B26",
            metricValue: "92.6%",
            kpiSubtitle: "Pico de automação",
            growth: "+24.0%",
          },
        ],
      },
      {
        id: "automation",
        label: "Automação",
        badgePercent: "+42%",
        data: [
          {
            month: "Jan",
            fullMonth: "Janeiro",
            heightPercent: 30,
            color: "#F3D0B6",
            metricValue: "45.0%",
            kpiSubtitle: "Tarefas sem humano",
            growth: "+3.2%",
          },
          {
            month: "Fev",
            fullMonth: "Fevereiro",
            heightPercent: 44,
            color: "#EAB38E",
            metricValue: "58.2%",
            kpiSubtitle: "Tarefas sem humano",
            growth: "+13.2%",
          },
          {
            month: "Mar",
            fullMonth: "Março",
            heightPercent: 52,
            color: "#E29D6E",
            metricValue: "64.8%",
            kpiSubtitle: "Expansão de robôs",
            growth: "+6.6%",
          },
          {
            month: "Abr",
            fullMonth: "Abril",
            heightPercent: 68,
            color: "#DB8249",
            metricValue: "76.1%",
            kpiSubtitle: "eSocial automatizado",
            growth: "+11.3%",
          },
          {
            month: "Mai",
            fullMonth: "Maio",
            heightPercent: 74,
            color: "#E28E54",
            metricValue: "82.5%",
            kpiSubtitle: "Conciliação diária",
            growth: "+6.4%",
          },
          {
            month: "Jun",
            fullMonth: "Junho",
            heightPercent: 88,
            color: "#D95B26",
            metricValue: "91.4%",
            kpiSubtitle: "Autonomia sistêmica",
            growth: "+42.0%",
          },
        ],
      },
      {
        id: "cost-saving",
        label: "Redução de Custos",
        badgePercent: "-38%",
        data: [
          {
            month: "Jan",
            fullMonth: "Janeiro",
            heightPercent: 40,
            color: "#F3D0B6",
            metricValue: "-12.5%",
            kpiSubtitle: "Eliminação de multas",
            growth: "R$ 45k",
          },
          {
            month: "Fev",
            fullMonth: "Fevereiro",
            heightPercent: 48,
            color: "#EAB38E",
            metricValue: "-18.2%",
            kpiSubtitle: "Otimização de horas",
            growth: "R$ 68k",
          },
          {
            month: "Mar",
            fullMonth: "Março",
            heightPercent: 56,
            color: "#E29D6E",
            metricValue: "-23.0%",
            kpiSubtitle: "Redução de retrabalho",
            growth: "R$ 94k",
          },
          {
            month: "Abr",
            fullMonth: "Abril",
            heightPercent: 62,
            color: "#DB8249",
            metricValue: "-29.4%",
            kpiSubtitle: "Insumos & compras",
            growth: "R$ 130k",
          },
          {
            month: "Mai",
            fullMonth: "Maio",
            heightPercent: 70,
            color: "#E28E54",
            metricValue: "-33.8%",
            kpiSubtitle: "Eficiência fiscal",
            growth: "R$ 165k",
          },
          {
            month: "Jun",
            fullMonth: "Junho",
            heightPercent: 85,
            color: "#D95B26",
            metricValue: "-38.6%",
            kpiSubtitle: "Economia acumulada",
            growth: "R$ 210k",
          },
        ],
      },
    ],
  },
};

