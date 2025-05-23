// e2e/qiankun.spec.ts
import { expect, test } from '@playwright/test'

test.describe('QianKun Plugin', () => {
  test('can navigate to slave', async ({ page }) => {
    await page.goto('/home')
    await page.click('a[href*="/slave/home"]')

    await expect(page.getByText('Slave Home Page')).toBeVisible()
  })

  test('support hooks in slave app', async ({ page }) => {
    await page.goto('/slave/count')

    await expect(page.getByText('slave Count')).toBeVisible()
    await expect(page.getByText('count:0')).toBeVisible()
    await page.click('button')
    await expect(page.getByText('count:1')).toBeVisible()
  })

  test.describe('manual loaded app', () => {
    test('be loaded', async ({ page }) => {
      await page.goto('/manual-slave/home')
      await expect(page.getByText('Slave Home Page')).toBeVisible()
    })

    test('support hooks in slave app', async ({ page }) => {
      await page.goto('/manual-slave/count')

      await expect(page.getByText('count:0')).toBeVisible()
      await page.click('button')
      await expect(page.getByText('count:1')).toBeVisible()
    })
  })

  test.describe('microApp route first', () => {
    test('not hit indexApp route', async ({ page }) => {
      await page.goto('/nav')
      await expect(page.getByText('never seen')).not.toBeVisible()
    })
  })

  test.describe('microApp route prepend ok', () => {
    test('hit microApp route', async ({ page }) => {
      await page.goto('/prefix/nav')
      await expect(page.getByText('goto slave app2')).toBeVisible()
    })

    test('mount with /prefix should ignore childapp.config.base manual-slave', async ({
      page,
    }) => {
      await page.goto('/prefix/basename')
      const link = page.locator('a')
      await expect(link).toHaveAttribute('href', '/prefix/')
      await expect(link).not.toHaveAttribute('href', '/manual-slave/')
    })

    test('mount with /* should ignore childapp.config.base manual-slave', async ({
      page,
    }) => {
      await page.goto('/basename')
      const link = page.locator('a')
      await expect(link).toHaveAttribute('href', '/')
      await expect(link).not.toHaveAttribute('href', '/manual-slave/')
    })
  })

  test.describe('MicroAppLink crossing multi apps', () => {
    test('jump between slave and slave-app2', async ({ page }) => {
      await page.goto('/slave/nav')

      await page.click('a[href*="hello"]')
      await expect(page.getByText('App2 HelloPage')).toBeVisible()

      await page.click('a[href*="nav"]')
      await expect(page.getByText('goto slave app2')).toBeVisible()
    })

    test('slave-app2 to master', async ({ page }) => {
      await page.goto('/animal/ant/hello')
      await page.click('a[href*="home"]')

      await expect(page.getByText('Qiankun Master Page')).toBeVisible()
    })
  })
})
