import { test, expect } from '@playwright/test'

test.describe('Basic react-max', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', (route) => {
      route.continue({
        headers: { ...route.request().headers(), 'Cache-Control': 'no-cache' },
      })
    })
    await page.context().clearCookies()
  })

  test('display page normally', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=index page')).toBeVisible()

    await expect(page.locator('button:has-text("Button")')).toBeVisible()
    await expect(page.locator('input.ant-input')).toHaveAttribute(
      'type',
      'text',
    )
    await expect(page.locator('div.ant-picker input')).toBeVisible()
  })
})
