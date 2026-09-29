import { expect, test } from '@playwright/test';

test('gallery loads images, filters, and fits the viewport', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page).toHaveTitle(/Carexplosion/);
  await expect(page.locator('.art-card')).toHaveCount(15);
  await expect(page.locator('.hero-art img')).toHaveJSProperty('complete', true);
  expect(await page.locator('.hero-art img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('button', { name: /Sketchbook/ }).click();
  await expect(page.locator('.art-card')).toHaveCount(10);
  await page.getByRole('button', { name: /Digital/ }).click();
  await expect(page.locator('.art-card')).toHaveCount(4);
  await page.getByRole('button', { name: /Motion/ }).click();
  await expect(page.locator('.art-card')).toHaveCount(1);
  await page.getByRole('button', { name: /All work/ }).click();
  await expect(page.locator('.art-card')).toHaveCount(15);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('viewer shows full resolution, supports keyboard navigation, and restores focus', async ({ page }) => {
  await page.goto('./');
  const card = page.locator('.art-card').first();
  await card.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.viewer-title h2')).toHaveText('Lillian & Jane');
  await expect(dialog.locator('.viewer-stage img')).toHaveAttribute('src', /originals/);
  await dialog.getByRole('button', { name: 'Zoom to original size', exact: true }).last().click();
  await expect(dialog.locator('.viewer-stage')).toHaveClass(/zoomed/);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('.viewer-title h2')).toHaveText('Lambs');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('.viewer-title h2')).toHaveText('Lillian & Jane');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(card).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('animations are still until explicitly played', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /Motion/ }).click();
  await page.locator('.art-card').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.viewer-stage img')).toHaveAttribute('src', /previews/);
  await dialog.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(dialog.locator('.viewer-stage img')).toHaveAttribute('src', /lou.gif/);
  await dialog.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(dialog.locator('.viewer-stage img')).toHaveAttribute('src', /previews/);
});

test('artwork pages work on direct load and expose the original file', async ({ page, request }) => {
  await page.goto('work/knife-girl/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Knife girl');
  const original = page.getByRole('link', { name: 'Open original' });
  const href = await original.getAttribute('href');
  const response = await request.get(href!);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/jpeg');
  expect((await response.body()).byteLength).toBe(388051);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Knife girl');
  await page.getByRole('link', { name: /Back to the collection/ }).click();
  await expect(page.getByRole('heading', { name: /Selected work/ })).toBeVisible();
});

test('gallery and detail pages remain usable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('.art-card')).toHaveCount(15);
  await page.locator('.art-card').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lillian & Jane');
  await expect(page.getByRole('link', { name: 'Open original' })).toBeVisible();
  await context.close();
});
