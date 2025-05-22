import { expect, test } from '@playwright/test'

test.describe('导航和路由测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', (route) => {
      route.continue({
        headers: { ...route.request().headers(), 'Cache-Control': 'no-cache' },
      })
    })
    await page.context().clearCookies()
  })

  test('直接访问不同页面', async ({ page }) => {
    // 首页
    await page.goto('/')
    await expect(page.locator('text=index page')).toBeVisible()

    // 用户页面
    await page.goto('/users')
    await expect(page.locator('h1:has-text("users")')).toBeVisible()

    // 历史页面
    await page.goto('/history')
    await expect(page).toHaveURL('/history')
  })

  test('通过UI导航', async ({ page }) => {
    await page.goto('/')

    // 导航到用户页面
    await page.locator('button:has-text("Go to /users")').click()
    await expect(page).toHaveURL(/\/users/)
    await expect(page.locator('h1:has-text("users")')).toBeVisible()

    // 通过浏览器后退按钮返回
    await page.goBack()
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=index page')).toBeVisible()

    // 通过浏览器前进按钮
    await page.goForward()
    await expect(page).toHaveURL(/\/users/)
  })

  test('路由参数处理', async ({ page }) => {
    // 测试带参数的路由
    await page.goto('/users?id=123')
    await expect(page).toHaveURL(/\/users\?id=123/)
    await expect(page.locator('h1:has-text("users")')).toBeVisible()
  })

  test('404页面处理', async ({ page }) => {
    // 访问不存在的页面
    await page.goto('/non-existent-page')

    // 可能会重定向到404页面或显示特定错误信息
    // 这里的具体断言需要根据应用的实际行为调整
    await expect(page).toHaveURL(/\/non-existent-page|\/404/)
  })
})
