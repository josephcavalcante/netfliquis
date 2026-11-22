# 🎬 Netfliquis — Catálogo e Avaliação de Filmes e Séries (Expo & React Native)

Aplicação mobile e multiplataforma (Android, iOS e Web) desenvolvida em **Expo (SDK 52) + React Native + TypeScript + Expo Router**, inspirada em plataformas de streaming modernas (*Cinema Dark UI*).

O projeto atende **100% dos requisitos da especificação acadêmica** (`03_netfliquis.pdf`), utilizando **estruturas de dados em memória** (arrays e objetos JavaScript gerenciados via Context API + Reducer Puro) para o cadastro, edição, exclusão, visualização detalhada e avaliação com cálculo dinâmico de média.

---

## 📋 Checklist de Requisitos Atendidos

### Funcionalidades (CRUD, Listagem, Interação e Complementar)
- [x] **Cadastrar filmes** (`type: "movie"`, com campo específico `duration` em minutos)
- [x] **Cadastrar séries** (`type: "series"`, com campos específicos `seasons` e `episodes`)
- [x] **Editar conteúdos** pré-cadastrados apresentando os dados atuais preenchidos no formulário
- [x] **Excluir conteúdos** com modal de confirmação multiplataforma
- [x] **Exibir catálogo** organizado de filmes e séries com capas, títulos, gêneros e anos de lançamento
- [x] **Identificar o tipo de conteúdo** visualmente (`Filme` vs. `Série`) e filtrar por categoria ou busca textual
- [x] **Avaliar filmes e séries** com notas (`1` a `10`) e comentários
- [x] **Exibir média das avaliações (`rating`)** recalculada dinamicamente a cada nova avaliação
- [x] **Armazenamento 100% em memória** inicializado com a estrutura exata do exemplo (*Interestelar*, *Stranger Things* e catálogo expandido)

### As 5 Telas Obrigatórias
| # | Tela | Rota (Expo Router) | Arquivo |
| :-: | :--- | :--- | :--- |
| **1** | **Catálogo de conteúdos** | `/` | `app/index.tsx` |
| **2** | **Cadastrar conteúdo** | `/content/create` | `app/content/create.tsx` |
| **3** | **Editar conteúdo** | `/content/edit/[id]` | `app/content/edit/[id].tsx` |
| **4** | **Detalhes do conteúdo** | `/content/[id]` | `app/content/[id].tsx` |
| **5** | **Avaliar conteúdo** | `/content/evaluate/[id]` | `app/content/evaluate/[id].tsx` |

---

## 🏗️ Arquitetura do Projeto

```text
netfliquis/
├── app/                              # Rotas declarativas (Expo Router - 5 Telas)
│   ├── _layout.tsx                   # Layout raiz (ContentProvider + Stack Dark UI)
│   ├── index.tsx                     # Tela 1: Catálogo de conteúdos
│   └── content/
│       ├── create.tsx                # Tela 2: Cadastrar conteúdo
│       ├── [id].tsx                  # Tela 4: Detalhes do conteúdo
│       ├── edit/[id].tsx             # Tela 3: Editar conteúdo
│       └── evaluate/[id].tsx         # Tela 5: Avaliar conteúdo
├── src/
│   ├── components/                   # Design System (Cinema Dark UI) e componentes
│   │   ├── catalog/                  # FeaturedHero, FilterBar, ContentCard
│   │   ├── evaluation/               # ScoreSelector, EvaluationCard
│   │   ├── form/                     # ContentForm (compartilhado entre Criar e Editar)
│   │   └── ui/                       # Badge, RatingBadge, Button, EmptyState, ConfirmModal
│   ├── context/
│   │   └── ContentContext.tsx        # Estado em memória (useReducer + Context API)
│   ├── data/
│   │   └── initialContents.ts        # Dados iniciais da especificação
│   ├── theme/
│   │   └── index.ts                  # Tokens visuais (cores, espaçamento, tipografia)
│   ├── types/
│   │   └── content.ts                # Interfaces TypeScript (Content, Evaluation)
│   └── utils/
│       ├── formatters.ts             # Formatação de duração, temporadas, datas e notas
│       ├── imageResolver.ts          # Resolução de caminhos "/images/..." e URLs
│       └── ratingCalculator.ts       # Cálculo dinâmico da média de avaliações
├── __tests__/
│   ├── unit/                         # Testes de Unidade (Domínio, Reducer, Componentes e 5 Telas)
│   └── integration/                  # Testes de Integração por Milestone (M1, M2 e M3)
├── e2e/
│   ├── netfliquis.spec.ts            # Testes End-to-End (Playwright) das 5 Telas
│   └── serve-dist.js                 # Servidor SPA estático para execução E2E
└── docs/
    └── PLANO_DE_PROJETO.md           # Documentação arquitetural completa
```

---

## 🚀 Como Executar o Projeto

### 1. Instalar dependências
```bash
npm install --legacy-peer-deps
```

### 2. Iniciar o servidor de desenvolvimento do Expo
```bash
npx expo start
```
- **No Celular (Android / iOS):** Escaneie o QR Code no terminal com o aplicativo **Expo Go**.
- **No Navegador Web:** Pressione `w` no terminal (ou execute `npm run web`).
- **No Emulador Android:** Pressione `a` no terminal (ou execute `npm run android`).

---

## 🧪 Suíte Completa de Testes (Unidade, Integração e E2E)

O projeto conta com cobertura automatizada em **3 níveis**:

### 1. Checagem Estrita de Tipos (TypeScript)
```bash
npm run typecheck
```

### 2. Testes Unitários e de Integração por Milestone (Jest + React Native Testing Library)
```bash
# Rodar todos os testes unitários e de integração
npm test

# Rodar apenas testes unitários
npm run test:unit

# Rodar apenas testes de integração das Milestones (M1, M2 e M3)
npm run test:integration
```

### 3. Testes End-to-End (Playwright no navegador real)
```bash
npx expo export --platform web
npm run test:e2e
```

---

## 📌 Gestão Ágil e Kanban

Todo o desenvolvimento foi estruturado em **4 Milestones** e **10 Issues** rastreadas no GitHub Projects:
- **Repositório:** [https://github.com/josephcavalcante/netfliquis](https://github.com/josephcavalcante/netfliquis)
- **Quadro Kanban:** [https://github.com/users/josephcavalcante/projects/2](https://github.com/users/josephcavalcante/projects/2)
