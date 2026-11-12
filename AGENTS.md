<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# JARIS — Decisões Permanentes do Projeto

## Stack & Arquitetura
- **Framework**: Next.js (App Router, TypeScript, Tailwind CSS) em `src/`.
- **Renderização 3D**: Three.js puro encapsulado em módulos client-only (`src/components/hero/particles/` e `src/lib/three/`), com carregamento dinâmico (`ssr: false`).
- **Animações**: GSAP + ScrollTrigger controlam a transição scroll-driven da Hero (Estado 01 Formiga → Dispersão → Estado 02 Cérebro + Split Overlay).

## Paleta Oficial JARIS
- Background principal: `#FFFFFF` (Branco puro — não sobrescrever com dark mode do sistema)
- Superfícies alternativas: `#FDFBF7` (Off-white)
- Títulos e textos principais: `#111827` (Azul-marinho)
- Textos secundários: `#4B5563` (Azul-acinzentado)
- Destaque das partículas: Laranja da identidade da formiga (`#D95B26` / `#E0652B`)

## Design Systems de Referência
- **V15 — Premium Aura** (`Referencias/Design_System/DS_1/rerencia_1/design_sistem15.html`): fonte `Inter`, grid de 12 colunas, curvas `--ease-out` e `--ease-bouncy`, reveal e microinterações.
- **Vesper** (`Referencias/Design_System/DS_2/vesper-design-system/design-system.html`): referência estrutural de palco 3D e overlays (Seções 03 e 14), **sem** adotar fundo escuro, bloom, névoa ou estética neon.

## Direção de Arte — Hero (Formiga & Cérebro em Partículas)
- Tanto a formiga (Estado 01) quanto o cérebro (Estado 02) são construídos exclusivamente por pontos circulares individuais laranja sobre fundo `#FFFFFF`, sem texturas, superfícies sólidas, linhas de conexão, PBR ou bloom.
- O cérebro utiliza coordenadas pré-geradas (`src/data/brain-particles.json`) com os mesmos tiers estruturais e contagem da formiga (`1.196` desktop / `1.033` tablet / `863` mobile).
- O Split Overlay do Estado 02 segue a estrutura da terceira dobra do Vesper (`section-brain.tsx`), adaptado estritamente para a paleta oficial JARIS (`#FFFFFF`, `#111827`, `#4B5563`) e tipografia `Inter`.
- Proibido: modelo GLB, superfície sólida, textura, material metálico/PBR, linhas conectando pontos, excesso de bloom/brilho.
- Otimização obrigatória multi-dispositivo e mobile: subamostragem adaptativa preservando estruturas principais, loop com auto-sleep em repouso, pausa fora de tela e zero alocações no render loop.
- Buffers tipados `antPositions`, `scatterPositions` e `brainPositions` mantêm contagem e IDs estáveis.
