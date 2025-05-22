import { expect, test } from '@playwright/test'

test.describe('表单交互测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', (route) => {
      route.continue({
        headers: { ...route.request().headers(), 'Cache-Control': 'no-cache' },
      })
    })
    await page.context().clearCookies()
  })

  test('输入框交互', async ({ page }) => {
    await page.goto('/')

    // 定位到输入框并输入文本
    const input = page.locator('input.ant-input')
    await input.click()
    await input.fill('测试输入')
    await expect(input).toHaveValue('测试输入')

    // 清空输入框
    await input.clear()
    await expect(input).toHaveValue('')
  })

  test('日期选择器交互', async ({ page }) => {
    await page.goto('/')

    // 打开日期选择器
    await page.locator('div.ant-picker').click()

    // 验证日期选择面板可见
    await expect(page.locator('.ant-picker-dropdown')).toBeVisible()

    // 选择当前日期
    await page.locator('.ant-picker-cell-today').click()

    // 验证日期选择器已关闭
    await expect(page.locator('.ant-picker-dropdown')).not.toBeVisible()

    // 验证日期输入框有值
    await expect(page.locator('div.ant-picker input')).not.toHaveValue('')
  })
})
