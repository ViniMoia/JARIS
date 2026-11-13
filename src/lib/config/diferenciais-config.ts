export interface DiferencialCardItem {
  id: string;
  number: string;
  pillar: string;
  title: string;
  text: string;
  badge: string;
}

export interface DiferenciaisConfig {
  tag: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cards: DiferencialCardItem[];
}

export const DIFERENCIAIS_CONFIG: DiferenciaisConfig = {
  tag: "DIFERENCIAIS",
  title: "Por que o JARIS é ",
  titleHighlight: "diferente?",
  subtitle:
    "Três pilares fundamentais projetados para eliminar o achismo, blindar sua operação e acelerar resultados estratégicos.",
  cards: [
    {
      id: "agilidade-estrategica",
      number: "01",
      pillar: "VELOCIDADE",
      title: "Agilidade Estratégica",
      text: "Decisões rápidas baseadas em dados concretos. Eliminamos o “achismo” da gestão.",
      badge: "Decisão Ágil",
    },
    {
      id: "seguranca-dados",
      number: "02",
      pillar: "SEGURANÇA",
      title: "Segurança de Dados",
      text: "Controle absoluto sobre as informações da sua empresa com auditoria inteligente nativa.",
      badge: "Blindagem Operacional",
    },
    {
      id: "visao-360",
      number: "03",
      pillar: "CONTROLE",
      title: "Visão 360°",
      text: "Entenda a saúde financeira, operacional e de pessoas em um único clique.",
      badge: "Unificação Total",
    },
  ],
};
