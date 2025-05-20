import { expect, test } from '@playwright/test'

test.describe('Basic Test', () => {
  test('display page normallly', async ({ page }) => {
    await page.goto('/hello-bar')
    await expect(page.getByText('Hello Bar')).toBeVisible()
    await page.getByRole('link', { name: 'to hello' }).click()
    await expect(page.getByText('Hello Page')).toBeVisible()
  })

  test('display page foo', async ({ page }) => {
    await page.goto('/foo')
    await expect(page.getByText('Hello Foo')).toBeVisible()
  })
})
