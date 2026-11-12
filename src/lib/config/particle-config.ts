export type DeviceTier = "desktop" | "tablet" | "mobile";

export interface DeviceTierProfile {
  /** Maximum interior (tier 2) points retained; tiers 0 and 1 are always kept 100%. */
  maxInteriorCount: number;
  /** Maximum devicePixelRatio to cap fragment shader fill-rate on high-DPI displays. */
  maxPixelRatio: number;
  /** Minimum and maximum CSS diameter (px) for each rendered circular point. */
  minPointSizeCss: number;
  maxPointSizeCss: number;
  /** Relative point diameter as a fraction of the rendered formation CSS height. */
  pointSizeRatio: number;
  /** Fraction of viewport span occupied by the formation's major dimension. */
  viewportFillRatio: number;
}

export const HERO_STAGE_02_COPY = {
  headlineLines: ["Inteligência", "coletiva em", "operação"] as const,
  leftDescription:
    "MÚLTIPLOS AGENTES DE IA ATUANDO DE FORMA INTEGRADA EM TODA A EMPRESA.",
  ctaLabel: "Explorar Plataforma",
  ctaHref: "#plataforma",
  rightTag: "DIVISÃO DE TAREFAS, RESULTADO ÚNICO",
  rightQuoteLines: ["Uma colônia,", "uma mente"] as const,
} as const;

export const PARTICLE_CONFIG = {
  colors: {
    background: "#FFFFFF",
    /** Warm copper-orange aligned with the JARIS ant identity */
    primary: "#D95B26",
    /** Subtle secondary tone for organic, non-metallic micro-variation */
    secondary: "#E66D2E",
  },

  /** Depth along Z in normalized space ([-1, 1] XY). Kept subtle to preserve silhouette clarity. */
  depthScale: 1.0,

  /** Subtle organic per-point size variance (0.88x to 1.12x) */
  sizeVariance: 0.12,

  /** Morphing parameters for Stage 01 (ant) -> expansive burst -> Stage 02 (brain) */
  morph: {
    /** Outermost particles reach 1.45x viewport half-extents (crossing off-screen edges) */
    burstReachMultiplier: 1.45,
    /** Innermost radial reach keeps the center/mid-field populated during explosion */
    burstMinReach: 0.28,
    /** Forward +Z surge toward the camera during peak explosion */
    burstDepthApproach: 2.1,
    /** Per-particle stagger window inside [0, 1] morph phases */
    staggerAmount: 0.14,
    /** Final brain scale relative to normalized [-1, 1] stage so Split Overlay text has breathing room */
    brainScaleDesktop: 0.94,
    brainScaleMobile: 0.86,
  },

  /** Physics parameters for localized cursor interaction (world units, stage spans [-1, 1]). */
  physics: {
    influenceRadius: 0.34,
    repulsionStrength: 0.016,
    springStiffness: 0.115,
    damping: 0.80,
    maxDisplacement: 0.22,
    /** Z-axis lift when cursor interacts near particles for subtle 3D responsiveness */
    zLiftFactor: 0.35,
    /** Below this squared displacement/velocity, the particle system enters 0% CPU/GPU idle sleep */
    sleepEpsilonSq: 1e-7,
  },

  /** Responsive framing & performance profiles by device tier */
  tiers: {
    desktop: {
      maxInteriorCount: 2480,
      maxPixelRatio: 2,
      minPointSizeCss: 2.2,
      maxPointSizeCss: 3.4,
      pointSizeRatio: 0.0048,
      viewportFillRatio: 0.62,
    },
    tablet: {
      maxInteriorCount: 1370,
      maxPixelRatio: 1.75,
      minPointSizeCss: 2.0,
      maxPointSizeCss: 3.0,
      pointSizeRatio: 0.0052,
      viewportFillRatio: 0.66,
    },
    mobile: {
      maxInteriorCount: 570,
      maxPixelRatio: 1.75,
      minPointSizeCss: 1.8,
      maxPointSizeCss: 2.6,
      pointSizeRatio: 0.0058,
      viewportFillRatio: 0.74,
    },
  } satisfies Record<DeviceTier, DeviceTierProfile>,
} as const;
