import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

async function pressLink(link: Locator) {
  await link.dispatchEvent('pointerdown', { button: 0, pointerType: 'mouse' });
}

test('a book navigation reveals its shell immediately', async ({ page }) => {
  await page.goto('/');
  const book = page.getByRole('link', { name: /W\.C\. Fields/ });
  await book.hover();
  const bounds = await book.boundingBox();
  if (!bounds) throw new Error('Expected the book link to have a visible bounding box');
  const historyLength = await page.evaluate(() => history.length);
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

  await instant(page, async () => {
    await page.mouse.down();
    try {
      await page.waitForURL(url => url.pathname === '/5333265');
      await expect(page.getByText('Back to books')).toBeVisible();
    } finally {
      await page.mouse.up();
    }
  });

  await expect(page.getByRole('heading', { name: 'W.C. Fields: A Life on Film' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => history.length)).toBe(historyLength + 1);
  await expect(page.getByRole('button', { name: 'Back to books' })).toBeVisible();
});

test('the back button works on a direct book visit', async ({ page }) => {
  await page.goto('/5333265');
  await page.getByRole('button', { name: 'Back to books' }).click();

  await expect(page).toHaveURL('/');
});

test('hover intent warms the book page before the click', async ({ page }) => {
  await page.goto('/');
  const book = page.getByRole('link', { name: /Unschooled Wizard/ });

  await book.hover();
  await instant(page, async () => {
    await pressLink(book);
    await page.waitForURL(url => url.pathname === '/7327624');
    await expect(page.getByRole('heading', { name: 'The Unschooled Wizard' })).toBeVisible();
  });
});

test('a book page keeps the catalog filters for the back navigation', async ({ page }) => {
  await page.goto('/?search=wizard');
  const book = page.getByRole('link', { name: /Unschooled Wizard/ });

  await pressLink(book);
  await expect(page.getByRole('heading', { name: 'The Unschooled Wizard' })).toBeVisible();

  const back = page.getByRole('button', { name: 'Back to books' });

  await instant(page, async () => {
    await back.click();
    await page.waitForURL('/?search=wizard');
    await expect(page.getByRole('link', { name: /Unschooled Wizard/ })).toBeVisible();
  });

  await expect(page.getByRole('searchbox', { name: 'Search books' })).toHaveValue('wizard');
});

test('a later catalog page is restored from the visited router cache', async ({ page }) => {
  await page.goto('/?page=2');
  const book = page
    .locator('main a')
    .filter({ has: page.locator('img') })
    .first();
  const bookName = await book.locator('img').getAttribute('alt');

  await pressLink(book);
  const back = page.getByRole('button', { name: 'Back to books' });
  await expect(back).toBeVisible();

  await instant(page, async () => {
    await back.click();
    await page.waitForURL('/?page=2');
    await expect(page.getByRole('link', { name: bookName! }).first()).toBeVisible();
  });
});

test('an unknown book id renders the not-found state', async ({ page }) => {
  await page.goto('/99999999');
  await expect(page.getByText('Book not found', { exact: true }).filter({ visible: true })).toBeVisible();
});
