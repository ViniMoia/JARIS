export interface ContactBenefitItem {
  id: string;
  text: string;
}

export interface ContactConfig {
  header: {
    tag: string;
    title: string;
    paragraph: string;
  };
  benefits: ContactBenefitItem[];
  slaCard: {
    title: string;
    subtitle: string;
  };
  form: {
    roles: string[];
    headcounts: string[];
    modules: string[];
    privacyText: string;
    ctaButtonText: string;
  };
}

export const CONTACT_CONFIG: ContactConfig = {
  header: {
    tag: "FALE COM O TIME",
    title: "Pronto para centralizar sua gestão com IA?",
    paragraph:
      "Agende uma demonstração personalizada e descubra como o JARIS pode transformar a operação da sua empresa. Nosso time entra em contato em até 24 horas úteis.",
  },
  benefits: [
    {
      id: "setor",
      text: "Demonstração personalizada ao seu setor",
    },
    {
      id: "maturidade",
      text: "Análise gratuita de maturidade digital",
    },
    {
      id: "early-adopter",
      text: "Condições especiais para early adopters",
    },
    {
      id: "especialista",
      text: "Sem compromisso — converse com um especialista",
    },
  ],
  slaCard: {
    title: "Atendimento prioritário em até 24h úteis",
    subtitle: "Conectamos você diretamente com um especialista sênior em arquitetura de IA.",
  },
  form: {
    roles: [
      "Selecione seu cargo",
      "Diretoria / C-Level",
      "Gerência / Coordenação",
      "Supervisão",
      "Especialista / Analista",
      "Sócio / Proprietário",
      "Outro",
    ],
    headcounts: [
      "Selecione a faixa",
      "1 a 20 colaboradores",
      "21 a 50 colaboradores",
      "51 a 200 colaboradores",
      "201 a 500 colaboradores",
      "Mais de 500 colaboradores",
    ],
    modules: [
      "DP / RH",
      "Financeiro",
      "Suprimentos",
      "Contratos",
      "Orçamentos",
      "Ecossistema completo",
    ],
    privacyText:
      "Concordo com a Política de Privacidade e autorizo o contato da equipe JARIS.",
    ctaButtonText: "SOLICITAR DEMONSTRAÇÃO",
  },
};

