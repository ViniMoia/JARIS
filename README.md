# JARIS — Gestão Empresarial com Inteligência Artificial

Landing page institucional da plataforma **JARIS**, desenvolvida com arquitetura moderna orientada a performance, renderização 3D WebGL e design system minimalista de alta precisão.

---

## 🚀 Tecnologias

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gráficos 3D & Partículas:** [Three.js](https://threejs.org/)
- **Animações & Scroll Choreography:** [GSAP](https://gsap.com/) + [ScrollTrigger](https://gsap.com/scrolltrigger/)
- **Tipografia:** General Sans & Mulish (carregamento local otimizado em `.woff2`)

---

## 🏛️ Estrutura das Dobras

1. **Hero Interativa & Identidade:**
   - **Estado Inicial (Logo Mark):** Formiga em partículas Three.js com elevação calibrada no espaço 3D e palavra **JARIS** ampliada e centralizada no eixo X, recriando fielmente o logotipo oficial.
   - **Transição & Morphing:** Explosão radial expansiva sem cortes de canvas (`100vh`), convergindo na formação do Cérebro 3D Vesper.
   - **Split Overlay:** Apresentação da proposta de valor com botões de ação e cabeçalho dinâmico sincronizado.

2. **Cenário Atual (Desafios & Solução):**
   - Comparativo interativo entre a operação fragmentada tradicional e o ecossistema integrado JARIS com micro-interações 3D Tilt.

3. **Ecossistema Modular (Gestão):**
   - Grid de 6 módulos estruturantes (RH, Financeiro, Suprimentos, Contratos, Orçamento e IA Core) com arquitetura de ângulos retos.

4. **Destaques com IA (Impacto):**
   - Apresentação horizontal com pinning de 3 etapas estruturantes (Contratação, Projeção Financeira e Cotação Preditiva) com métricas de impacto comprovado.

5. **Diferenciais Competitivos:**
   - 3 pilares estratégicos (Agilidade Estratégica, Segurança de Dados e Visão 360°) em cards brancos de alto contraste e micro-interação 3D.

6. **Inteligência de Dados e Performance (Inteligência):**
   - Visualização preditiva com gráfico interativo e alternância de modos analíticos operacionais.

7. **Roteiro de Evolução (Roadmap):**
   - Linha do tempo vertical com feixe de luz laranja contínuo e 5 cards azuis em ângulos retos que emergem de forma suave e orgânica.

8. **Contato / Conversão:**
   - Formulário de agendamento de demonstração e contato direto com a equipe.

9. **Rodapé Institucional:**
   - Links institucionais, status operacional e volta ao topo suave.

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ (recomendado Node.js 20 ou 22)
- npm, yarn ou pnpm

### Instalação das dependências
```bash
npm install
```

### Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build de Produção (Export Estático para Netlify)
```bash
npm run build
```
O build estático gera a pasta `out/`, pronta para deploy.

### Deploy na Netlify (Drag and Drop)
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste e solte a pasta **`out`** (localizada em `Projeto/v1/out`) na área indicada
3. O deploy é publicado instantaneamente com HTTPS e CDN global.

---

## 🎛️ Configuração Rápida

- **Formiga & Wordmark da Hero:** `src/lib/config/hero-intro-config.ts` (permite ligar/desligar a palavra JARIS e ajustar elevação via `showLogoWordmark: boolean`).
- **Navegação do Header:** `src/lib/config/particle-config.ts` (`HERO_STAGE_02_COPY.headerNav`).
- **Módulos:** `src/lib/config/modules-config.ts`.
- **Roadmap:** `src/lib/config/roadmap-config.ts`.
