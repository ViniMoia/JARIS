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
  antLiftClass: "-translate-y-[5.5vh] sm:-translate-y-[6.5vh] lg:-translate-y-[7.5vh]",

  // Posição calculada logo abaixo das patas traseiras e abdômen
  wordmarkPositionClass: "top-[72vh] sm:top-[72.5vh] lg:top-[73vh]",

  // Tipografia do logotipo: preta sólida (#111827), caixa alta, peso black, tamanho imponente e tracking calibrado
  // O -mr-[0.24em] compensa o tracking da última letra ("S"), garantindo centralização matemática absoluta da letra "R" no eixo X
  wordmarkTypographyClass:
    "font-sans font-black tracking-[0.24em] text-[#111827] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem] select-none uppercase inline-block -mr-[0.24em]",
};
