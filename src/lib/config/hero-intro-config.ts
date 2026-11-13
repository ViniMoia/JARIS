export interface HeroIntroConfig {
  /**
   * Ativa ou desativa a composição estilo logotipo na dobra inicial (formiga elevada + palavra JARIS).
   * Para desfazer instantaneamente e voltar ao layout original (formiga 100% centralizada sem texto),
   * basta alterar esta propriedade para `false`.
   */
  showLogoWordmark: boolean;

  /** Texto exibido abaixo da formiga */
  wordmarkText: string;

  /**
   * Fração de elevação da formiga em relação à altura total do viewport no espaço WebGL 3D.
   * Ex: desktop 0.115 = 11.5% da altura da tela (11.5vh).
   */
  antLiftRatio: {
    desktop: number;
    tablet: number;
    mobile: number;
  };

  /**
   * Posicionamento vertical da palavra JARIS na tela.
   */
  wordmarkPositionClass: string;

  /**
   * Estilo e tipografia da palavra JARIS (fiel ao logotipo oficial).
   */
  wordmarkTypographyClass: string;
}

export const HERO_INTRO_CONFIG: HeroIntroConfig = {
  // Alterne para false para desfazer rapidamente a qualquer momento
  showLogoWordmark: true,

  wordmarkText: "JARIS",

  // Elevação matemática no WebGL (Three.js) para preservar o canvas em 100% de tela
  antLiftRatio: {
    desktop: 0.115,
    tablet: 0.105,
    mobile: 0.09,
  },

  // Posição vertical elevada para afastar o texto do aviso de "Scroll"
  wordmarkPositionClass: "top-[71vh] sm:top-[71.5vh] lg:top-[72vh]",

  // Tipografia do logotipo ampliada para ultrapassar a largura da formiga,
  // com tracking calibrado e centralização matemática absoluta no eixo X (-mr-[0.24em])
  wordmarkTypographyClass:
    "font-sans font-black tracking-[0.24em] text-[#111827] text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] 2xl:text-[9.5rem] leading-none select-none uppercase inline-block -mr-[0.24em]",
};
