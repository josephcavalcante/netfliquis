import { expect, test } from '@playwright/test';

test.describe('Netfliquis E2E — Fluxo Completo das 5 Telas Obrigatórias', () => {
  test('1. Tela 1 (Catálogo): lista filmes e séries, filtra por categoria e busca por título', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByTestId('header-logo')).toHaveText('NETFLIQUIS');
    await expect(page.getByTestId('card-title-1')).toHaveText('Interestelar');
    await expect(page.getByTestId('card-title-2')).toHaveText('Stranger Things');

    // Filtrar apenas Filmes
    await page.getByTestId('filter-tab-movie').click();
    await expect(page.getByTestId('card-title-1')).toBeVisible();
    await expect(page.getByTestId('card-title-2')).toHaveCount(0);

    // Filtrar apenas Séries
    await page.getByTestId('filter-tab-series').click();
    await expect(page.getByTestId('card-title-2')).toBeVisible();
    await expect(page.getByTestId('card-title-1')).toHaveCount(0);

    // Voltar para Todos e buscar "Interestelar"
    await page.getByTestId('filter-tab-all').click();
    await page.getByTestId('catalog-search-input').fill('Interestelar');
    await expect(page.getByTestId('card-title-1')).toBeVisible();
    await expect(page.getByTestId('card-title-2')).toHaveCount(0);
  });

  test('2. Fluxo Completo Série: Cadastrar Série (Tela 2) -> Detalhes (Tela 4) -> Editar (Tela 3) -> Avaliar com Média Dinâmica (Tela 5) -> Excluir', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Navegar da Tela 1 (Catálogo) para Tela 2 (Cadastrar Conteúdo)
    await page.getByTestId('btn-go-create').click();
    await expect(page.getByTestId('create-content-screen')).toBeVisible();

    // 2. Selecionar tipo Série e preencher formulário
    await page.getByTestId('form-type-series').click();
    await page.getByTestId('form-input-title').fill('Chernobyl');
    await page
      .getByTestId('form-input-description')
      .fill('Minissérie dramática sobre o desastre nuclear de 1986.');
    await page.getByTestId('form-input-genre').fill('Drama');
    await page.getByTestId('form-input-year').fill('2019');
    await page.getByTestId('form-input-seasons').fill('1');
    await page.getByTestId('form-input-episodes').fill('5');
    await page.getByTestId('form-submit-btn').click();

    // 3. Tela 4 (Detalhes): Verificar dados da série recém-cadastrada
    await expect(page.getByTestId('details-content-screen')).toBeVisible();
    await expect(page.getByTestId('details-title')).toHaveText('Chernobyl');
    await expect(page.getByTestId('details-specific-meta')).toHaveText(
      '1 temporada • 5 episódios'
    );

    // 4. Tela 3 (Editar): Alterar título e salvar
    await page.getByTestId('details-btn-edit').click();
    await expect(page.getByTestId('edit-content-screen')).toBeVisible();
    await page.getByTestId('form-input-title').fill('Chernobyl (HBO)');
    await page.getByTestId('form-submit-btn').click();

    // Verificar atualização imediata na Tela 4 (Detalhes)
    await expect(page.getByTestId('details-title')).toHaveText('Chernobyl (HBO)');

    // 5. Tela 5 (Avaliar): Atribuir duas avaliações (10 e 8 -> média 9.0)
    await page.getByTestId('details-btn-evaluate').click();
    await expect(page.getByTestId('evaluate-content-screen')).toBeVisible();

    await page.getByTestId('score-option-10').click();
    await page
      .getByTestId('evaluate-input-comment')
      .fill('Produção histórica impecável!');
    await page.getByTestId('evaluate-btn-submit').click();

    await page.getByTestId('score-option-8').click();
    await page
      .getByTestId('evaluate-input-comment')
      .fill('Tensão do início ao fim.');
    await page.getByTestId('evaluate-btn-submit').click();

    await expect(page.getByTestId('evaluate-average-summary')).toContainText('9.0');

    // Voltar para Tela 4 (Detalhes) e verificar média 9.0 e comentários listados
    await page.getByTestId('evaluate-btn-back').click();
    await expect(page.getByTestId('details-average-score')).toContainText('9.0 / 10');
    await expect(page.getByText('Produção histórica impecável!')).toBeVisible();
    await expect(page.getByText('Tensão do início ao fim.')).toBeVisible();

    // 6. Excluir conteúdo na Tela 4 e verificar retorno à Tela 1 (Catálogo)
    await page.getByTestId('details-btn-delete').click();
    await expect(page.getByTestId('confirm-modal')).toBeVisible();
    await page.getByTestId('confirm-modal-confirm').click();

    await expect(page.getByTestId('header-logo').first()).toHaveText('NETFLIQUIS');
    await expect(page.getByText('Chernobyl (HBO)')).toHaveCount(0);
  });

  test('3. Fluxo Completo Filme: Cadastrar Filme com duração em minutos e avaliar', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByTestId('btn-go-create').click();

    await page.getByTestId('form-type-movie').click();
    await page.getByTestId('form-input-title').fill('Parasita');
    await page
      .getByTestId('form-input-description')
      .fill('Uma família infiltrada na casa de uma família rica.');
    await page.getByTestId('form-input-genre').fill('Suspense');
    await page.getByTestId('form-input-year').fill('2019');
    await page.getByTestId('form-input-duration').fill('132');
    await page.getByTestId('form-submit-btn').click();

    await expect(page.getByTestId('details-title')).toHaveText('Parasita');
    await expect(page.getByTestId('details-specific-meta')).toHaveText(
      '132 min (2h 12m)'
    );
  });
});
