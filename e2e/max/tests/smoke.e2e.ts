import { expect, test } from '@playwright/test'

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

  test('navigate to users page', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Go to /users")').click()

    // 验证导航到用户页面
    await expect(page).toHaveURL(/\/users/)
    await expect(page.locator('h1:has-text("users")')).toBeVisible()
  })

  test('error request handling', async ({ page }) => {
    await page.goto('/users')

    // 检查页面上显示的用户
    await expect(page.locator('text=admin')).toBeVisible()
    await expect(page.locator('text=test')).toBeVisible()

    // 发送错误请求并验证
    const consoleMessages: string[] = []
    page.on('console', (msg) => {
      consoleMessages.push(msg.text())
    })

    await page.locator('button:has-text("发送一个错误请求")').click()

    // 等待控制台消息
    await page.waitForTimeout(2000)
    expect(consoleMessages.some((msg) => msg.includes('Error'))).toBeTruthy()
  })

  test('check i18n functionality', async ({ page }) => {
    await page.goto('/')

    // 检查默认语言文本
    await expect(page.locator('section#locales .hello')).toBeVisible()
    await expect(page.locator('section#locales .user-welcome')).toBeVisible()
  })

  test('verify tailwind CSS', async ({ page }) => {
    await page.goto('/')

    // 检查tailwind CSS元素是否存在
    await expect(page.locator('[data-testid="tailwind-header"]')).toBeVisible()
  })
})
