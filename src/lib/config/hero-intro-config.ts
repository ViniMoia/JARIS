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

  // Elevação aumentada para afastar a formiga do texto e dar respiro elegante
  antLiftClass: "-translate-y-[8vh] sm:-translate-y-[9.5vh] lg:-translate-y-[10.5vh]",

  // Posição vertical mais espaçada abaixo da formiga
  wordmarkPositionClass: "top-[75vh] sm:top-[75.5vh] lg:top-[76vh]",

  // Tipografia do logotipo ampliada para ultrapassar a largura da formiga,
  // com tracking calibrado e centralização matemática absoluta no eixo X (-mr-[0.24em])
  wordmarkTypographyClass:
    "font-sans font-black tracking-[0.24em] text-[#111827] text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] 2xl:text-[9.5rem] leading-none select-none uppercase inline-block -mr-[0.24em]",
};
