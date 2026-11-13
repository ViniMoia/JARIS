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
   * Classe Tailwind que eleva a formiga em relação ao centro da tela.
   */
  antLiftClass: string;

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

  // Elevação harmônica da formiga para criar o espaço ideal para o texto do logo
  antLiftClass: "-translate-y-[6vh] sm:-translate-y-[7.5vh] lg:-translate-y-[8.5vh]",

  // Posição equilibrada logo abaixo das patas traseiras e abdômen
  wordmarkPositionClass: "top-[73.5vh] sm:top-[74.5vh] lg:top-[75.5vh]",

  // Tipografia: preta sólida, caixa alta, peso black e tracking largo fiel ao logotipo
  wordmarkTypographyClass:
    "font-sans font-black tracking-[0.26em] text-[#111827] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] select-none pl-[0.26em]",
};
