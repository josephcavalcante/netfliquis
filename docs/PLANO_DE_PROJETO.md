# Netfliquis — Plano de Projeto e Arquitetura (Expo & React Native)

> **Disciplina:** Desenvolvimento Mobile  
> **Stack:** Expo (Managed Workflow) • React Native • TypeScript • Expo Router  
> **Persistência:** Estruturas em Memória (Context API + Reducer / Imutabilidade JS)

---

## 1. Visão Geral e Objetivos

O **Netfliquis** é uma aplicação mobile (compatível também com Web via Expo) inspirada em plataformas de streaming como a Netflix. O objetivo é oferecer uma experiência visual cinematográfica (Dark UI), fluida e escalável para o **gerenciamento completo (CRUD) de um catálogo de filmes e séries**, além de um sistema interativo de **avaliações por notas e comentários** com cálculo dinâmico de média.

### Requisitos Atendidos
- **CRUD de Conteúdos:** Cadastrar filmes (com duração), cadastrar séries (com temporadas e episódios), editar conteúdos pré-existentes e excluir conteúdos.
- **Listagem e Catálogo:** Exibição de capas, títulos, gêneros, anos de lançamento, badge identificador de tipo (`Filme` ou `Série`) e média de avaliações, com busca e filtro por categoria.
- **Detalhes do Conteúdo:** Visualização completa dos metadados específicos de cada tipo e histórico de avaliações.
- **Sistema de Avaliação:** Atribuição de nota (`score` de 1 a 10) e comentário (`comment`), listagem de avaliações existentes e recálculo automático do `rating` médio do título.
- **Armazenamento em Memória:** Manipulação reativa de arrays e objetos JavaScript em memória, inicializados com a estrutura de dados oficial da especificação.

---

## 2. Arquitetura e Stack Tecnológica

Para garantir um código limpo, modular, fácil de manter e com padrão de mercado, utilizaremos:

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Mobile** | **Expo SDK 52+ (React Native)** | Setup rápido, execução instantânea via Expo Go (Android/iOS) e suporte Web. |
| **Linguagem** | **TypeScript** | Tipagem estática para garantir segurança na distinção entre `movie` e `series` e contratos de dados claros. |
| **Navegação** | **Expo Router (File-based)** | Navegação declarativa baseada em arquivos (Stack Navigation), facilitando passagem de parâmetros (`[id]`). |
| **Gerenciamento de Estado** | **React Context API + `useReducer`** | Centraliza o array `contents` em memória e expõe ações puras (`ADD_CONTENT`, `UPDATE_CONTENT`, `DELETE_CONTENT`, `ADD_EVALUATION`). |
| **Estilização** | **StyleSheet API + Design Tokens** | Zero dependências pesadas, alta performance nativa e tema centralizado (*Cinema Dark Theme*). |
| **Ícones** | **`@expo/vector-icons` (Ionicons)** | Ícones nativos já inclusos no Expo para estrelas, badges, botões de ação e navegação. |

---

## 3. Design System ("Cinema Dark UI")

Inspirado na identidade visual de serviços de streaming modernos:

- **Paleta de Cores (`src/theme/colors.ts`):**
  - `background`: `#0B0B0F` (Preto cinematográfico profundo)
  - `surface`: `#16161E` (Cards e containers)
  - `surfaceElevated`: `#22222E` (Inputs, modais e chips)
  - `primary`: `#E50914` (Vermelho Netfliquis para CTAs principais)
  - `accent`: `#F5C518` (Amarelo ouro estilo IMDb para notas e estrelas)
  - `badgeMovie`: `#2563EB` (Azul para badge de Filme)
  - `badgeSeries`: `#9333EA` (Roxo para badge de Série)
  - `textPrimary`: `#FFFFFF`
  - `textSecondary`: `#A1A1AA`
  - `textMuted`: `#71717A`
  - `danger`: `#EF4444` (Ação de exclusão)
  - `success`: `#22C55E`
  - `border`: `#27272A`

---

## 4. Modelagem de Dados em Memória

A modelagem respeita **exatamente** a estrutura exigida pelo professor na especificação:

```typescript
export type ContentType = 'movie' | 'series';

export interface Evaluation {
  id: number;
  score: number;      // Nota atribuída (ex: 1 a 10)
  comment: string;    // Comentário do usuário
  createdAt: Date;    // Data da avaliação
}

export interface Content {
  id: number;
  type: ContentType;  // "movie" | "series"
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  duration?: number;  // Exclusivo para type === "movie" (em minutos)
  seasons?: number;   // Exclusivo para type === "series"
  episodes?: number;  // Exclusivo para type === "series"
  image: string;      // Caminho local mapeado ou URL externa
  rating: number;     // Média dinâmica das notas (0 a 10)
  evaluations: Evaluation[];
  createdAt: Date;
}
```

### Regra de Cálculo Dinâmico da Média (`rating`)
Sempre que uma avaliação é inserida no array `evaluations` de um conteúdo:
1. Soma-se o `score` de todos os itens em `evaluations`.
2. Divide-se pelo total de avaliações (`evaluations.length`).
3. Arredonda-se para 1 casa decimal (`Number((sum / count).toFixed(1))`).
4. Caso `evaluations` esteja vazio na criação de um novo conteúdo, `rating` inicia em `0`.

### Tratamento Inteligente de Imagens (`imageResolver`)
O exemplo da especificação utiliza caminhos como `"/images/interestelar.jpg"` e `"/images/stranger-things.jpg"`. Como o componente `<Image />` do React Native requer `require(...)` para assets locais ou `{ uri: 'https://...' }` para imagens remotas, criaremos um utilitário `resolveContentImage(imagePath: string)`:
- Mantém os valores originais `"/images/interestelar.jpg"` e `"/images/stranger-things.jpg"` no array em memória exatamente como no PDF.
- Mapeia esses caminhos para pôsteres de alta definição (ou assets locais) na camada de apresentação, além de aceitar qualquer URL `http://` ou `https://` informada pelo usuário no cadastro/edição e oferecer sugestões rápidas de capas no formulário.

---

## 5. Estrutura de Pastas Escalável

```text
netfliquis/
├── app/                              # Rotas do Expo Router (As 5 Telas Obrigatórias)
│   ├── _layout.tsx                   # Layout raiz (ContentProvider + StatusBar + Stack Header)
│   ├── index.tsx                     # TELA 1: Catálogo de conteúdos
│   └── content/
│       ├── create.tsx                # TELA 2: Cadastrar conteúdo
│       ├── [id].tsx                  # TELA 4: Detalhes do conteúdo
│       ├── edit/
│       │   └── [id].tsx              # TELA 3: Editar conteúdo
│       └── evaluate/
│           └── [id].tsx              # TELA 5: Avaliar conteúdo
├── src/
│   ├── components/                   # Componentes de UI reutilizáveis
│   │   ├── catalog/
│   │   │   ├── ContentCard.tsx       # Card de filme/série com capa, tipo, ano e nota
│   │   │   ├── FeaturedHero.tsx      # Destaque principal no topo do catálogo
│   │   │   └── FilterBar.tsx         # Filtro por Todos / Filmes / Séries + Busca
│   │   ├── form/
│   │   │   └── ContentForm.tsx       # Formulário compartilhado entre Cadastro e Edição
│   │   ├── evaluation/
│   │   │   ├── EvaluationCard.tsx    # Item de comentário + nota + data formatada
│   │   │   └── ScoreSelector.tsx     # Seletor interativo de nota (1 a 10)
│   │   └── ui/
│   │       ├── Badge.tsx             # Tag visual ("Filme" / "Série" / Gênero)
│   │       ├── Button.tsx            # Botão customizado com variantes (primary, outline, danger)
│   │       ├── EmptyState.tsx        # Feedback visual quando listas estão vazias
│   │       └── RatingBadge.tsx       # Estrela + nota formatada (ex: ★ 9.0)
│   ├── context/
│   │   └── ContentContext.tsx        # Estado global em memória + operações CRUD e Avaliação
│   ├── data/
│   │   └── initialContents.ts        # Dados iniciais exigidos na especificação + catálogo base
│   ├── theme/
│   │   └── index.ts                  # Cores, espaçamentos, tipografia e sombras
│   ├── types/
│   │   └── content.ts                # Interfaces TypeScript (Content, Evaluation, Inputs)
│   └── utils/
│       ├── formatters.ts             # Formatação de duração (169 min -> 2h 49m), datas e notas
│       ├── imageResolver.ts          # Resolução segura de URLs e caminhos "/images/..."
│       └── ratingCalculator.ts       # Função pura para cálculo da média de avaliações
├── assets/                           # Ícones, splash screen e imagens locais
├── docs/
│   └── PLANO_DE_PROJETO.md           # Documentação arquitetural e roteiro de implementação
├── app.json                          # Configuração do Expo
├── package.json
└── tsconfig.json
```

---

## 6. Mapeamento das 5 Telas Obrigatórias

### Tela 1: Catálogo de Conteúdos (`app/index.tsx`)
- **Cabeçalho:** Logo **NETFLIQUIS** + Botão `+ Novo` para acesso rápido ao cadastro.
- **Filtros e Busca:** Barra de pesquisa por título/gênero e abas de filtro (`Todos`, `Filmes`, `Séries`).
- **Destaque & Grid:** Lista em 2 colunas (responsiva) exibindo cards com:
  - Imagem de capa (`image`)
  - Badge identificador de tipo (`Filme` ou `Série`)
  - Nota média (`rating`) em destaque
  - Título (`title`), Gênero (`genre`) e Ano de lançamento (`releaseYear`)
- **Interação:** Toque no card navega para **Detalhes do conteúdo** (`/content/[id]`); botão flutuante/topo navega para **Cadastrar conteúdo** (`/content/create`).

### Tela 2: Cadastrar Conteúdo (`app/content/create.tsx`)
- **Seletor de Tipo (`type`):** Alternância visual entre **Filme (`movie`)** e **Série (`series`)**.
- **Campos Comuns:**
  - Título (`title`) — texto obrigatório
  - Descrição (`description`) — área de texto (sinopse)
  - Gênero (`genre`) — seleção rápida por chips (Ficção científica, Suspense, Ação, Drama, Comédia, etc.) ou digitação livre
  - Ano de lançamento (`releaseYear`) — numérico (ex: `2024`)
  - Imagem de capa (`image`) — input de URL com preview instantâneo + galeria de capas pré-configuradas para facilitar testes em aula
- **Campos Condicionais:**
  - Se `type === "movie"`: Campo **Duração em minutos (`duration`)** (ex: `169`).
  - Se `type === "series"`: Campos **Temporadas (`seasons`)** e **Episódios (`episodes`)** lado a lado.
- **Validação:** Verifica campos obrigatórios e valores numéricos válidos antes de salvar em memória e redirecionar ao catálogo.

### Tela 3: Editar Conteúdo (`app/content/edit/[id].tsx`)
- Busca o conteúdo pelo `id` no estado em memória.
- Reutiliza o `ContentForm` pré-populando todos os campos atuais (`type`, `title`, `description`, `genre`, `releaseYear`, `image`, e `duration` ou `seasons`/`episodes`).
- Ao salvar, atualiza o registro correspondente no array `contents` preservando suas `evaluations`, `rating` e `createdAt`, e retorna automaticamente para a tela de Detalhes.

### Tela 4: Detalhes do Conteúdo (`app/content/[id].tsx`)
- **Hero de Capa:** Imagem em destaque com gradiente escuro, badge de tipo (`Filme` ou `Série`), título, ano, gênero e nota média (`★ 9.0` + total de avaliações).
- **Metadados Específicos:**
  - Para Filme: exibe duração formatada (ex: `169 min (2h 49m)`).
  - Para Série: exibe quantidade de temporadas e episódios (ex: `4 temporadas • 34 episódios`).
- **Sinopse:** Descrição completa do título.
- **Barra de Ações:**
  - Botão primário **Avaliar Conteúdo** → navega para `/content/evaluate/[id]`
  - Botão secundário **Editar** → navega para `/content/edit/[id]`
  - Botão de perigo **Excluir** → exibe confirmação modal e remove do array em memória, voltando ao Catálogo.
- **Seção de Avaliações:** Lista todas as avaliações (`evaluations`) cadastradas para o título (nota, comentário e data), ou estado vazio convidando a avaliar.

### Tela 5: Avaliar Conteúdo (`app/content/evaluate/[id].tsx`)
- **Resumo do Conteúdo:** Mini-cabeçalho com capa, título e média atual (`rating`).
- **Formulário de Nova Avaliação:**
  - Seletor interativo de nota (`score` de 1 a 10) com feedback visual de estrelas/cores.
  - Campo de texto para comentário (`comment`).
  - Botão **Publicar Avaliação** que insere o novo objeto `{ id, score, comment, createdAt: new Date() }` e recalcula imediatamente o `rating` do conteúdo.
- **Histórico de Avaliações Existentes:** Lista completa logo abaixo do formulário mostrando todas as avaliações já registradas para o filme ou série, atualizada em tempo real.

---

## 7. Roteiro de Implementação Passo a Passo

A implementação será dividida em **6 etapas incrementais e verificáveis**:

1. **Fase 1 — Bootstrap do Projeto Expo & Configuração Base**
   - Inicializar o projeto Expo com TypeScript e Expo Router.
   - Configurar `tsconfig.json`, `app.json` e estrutura de diretórios `src/`.

2. **Fase 2 — Modelagem, Dados Iniciais e Utilitários (`src/types`, `src/data`, `src/utils`)**
   - Criar interfaces TypeScript fiéis ao PDF (`Content`, `Evaluation`, `ContentType`).
   - Implementar `initialContents.ts` contendo os registros exatos do exemplo (*Interestelar* e *Stranger Things*) + títulos complementares.
   - Criar `ratingCalculator.ts`, `imageResolver.ts` e `formatters.ts`.

3. **Fase 3 — Gerenciamento de Estado em Memória (`src/context/ContentContext.tsx`)**
   - Implementar `ContentProvider` e hook `useContents()`.
   - Implementar ações em memória: `addContent`, `updateContent`, `deleteContent`, `addEvaluation` e `getContentById`.

4. **Fase 4 — Design System e Componentes Base (`src/theme`, `src/components`)**
   - Criar tokens de tema (`colors`, `spacing`, `typography`).
   - Construir `Badge`, `RatingBadge`, `Button`, `EmptyState`, `ContentCard`, `FilterBar`, `ScoreSelector`, `EvaluationCard` e `ContentForm`.

5. **Fase 5 — Construção das 5 Telas Obrigatórias (`app/`)**
   - Configurar `app/_layout.tsx` com tema escuro e navegação Stack.
   - Implementar `app/index.tsx` (Tela 1: Catálogo).
   - Implementar `app/content/create.tsx` (Tela 2: Cadastrar Conteúdo).
   - Implementar `app/content/edit/[id].tsx` (Tela 3: Editar Conteúdo).
   - Implementar `app/content/[id].tsx` (Tela 4: Detalhes do Conteúdo).
   - Implementar `app/content/evaluate/[id].tsx` (Tela 5: Avaliar Conteúdo).

6. **Fase 6 — Testes, Validação e Documentação de Uso (`README.md`)**
   - Validar tipagem (`tsc --noEmit`) e funcionamento de todo o fluxo CRUD e avaliações.
   - Documentar no `README.md` como rodar o projeto no celular (Expo Go), emulador Android/iOS e navegador Web.
