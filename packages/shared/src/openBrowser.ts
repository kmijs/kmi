import { exec } from 'node:child_process'
import net from 'node:net'
import { promisify } from 'node:util'
import { DEFAULT_DEV_HOST, IS_CLOUDDEV } from './constants'
import * as logger from './logger'

const execAsync = promisify(exec)

const supportedChromiumBrowsers = [
  'Google Chrome Canary',
  'Google Chrome Dev',
  'Google Chrome Beta',
  'Google Chrome',
  'Microsoft Edge',
  'Brave Browser',
  'Vivaldi',
  'Chromium',
]

const getTargetBrowser = async () => {
  // Use user setting first
  let targetBrowser = process.env.BROWSER
  // If user setting not found or not support, use opening browser first
  if (!targetBrowser || !supportedChromiumBrowsers.includes(targetBrowser)) {
    const { stdout: ps } = await execAsync('ps cax')
    targetBrowser = supportedChromiumBrowsers.find((b) => ps.includes(b))
  }
  return targetBrowser
}

let openedURLs: string[] = []

const clearOpenedURLs = () => {
  openedURLs = []
}

const normalizeOpenConfig = (
  open?: boolean | string | string[],
): { targets: string[] } => {
  if (!open) {
    return { targets: [] }
  }

  if (Array.isArray(open)) {
    return { targets: open }
  }

  return { targets: typeof open === 'string' ? [open] : [] }
}

export async function openKmiUrl({
  protocol,
  port,
  host,
  open,
}: {
  protocol: string
  port: number
  host: string
  open?: boolean | string | string[]
}) {
  // cloudedev 不打开浏览器
  if (IS_CLOUDDEV) {
    return
  }

  clearOpenedURLs()
  const localHost = getHostInUrl(host)
  const baseUrl = `${protocol}//${localHost}:${port}`
  const { targets } = normalizeOpenConfig(open)
  const urls: string[] = []

  if (!targets.length) {
    urls.push(baseUrl)
  } else {
    urls.push(
      ...targets.map((target) =>
        resolveUrl(replacePortPlaceholder(target, port), baseUrl),
      ),
    )
  }

  for (const url of urls) {
    /**
     * If an URL has been opened in current process, we will not open it again.
     * It can prevent opening the same URL multiple times.
     */
    if (!openedURLs.includes(url)) {
      await openBrowser(url)
      openedURLs.push(url)
    }
  }
}

export async function openBrowser(url: string) {
  // If we're on OS X, the user hasn't specifically
  // requested a different browser, we can try opening
  // a Chromium browser with AppleScript. This lets us reuse an
  // existing tab when possible instead of creating a new one.
  const shouldTryOpenChromeWithAppleScript = process.platform === 'darwin'
  if (shouldTryOpenChromeWithAppleScript) {
    try {
      const targetBrowser = await getTargetBrowser()
      if (targetBrowser) {
        // Try to reuse existing tab with AppleScript
        await execAsync(
          `osascript openChrome.applescript "${encodeURI(
            url,
          )}" "${targetBrowser}"`,
          {
            cwd: __dirname,
          },
        )

        return true
      }
      logger.debug('未找到目标浏览器。')
    } catch (err) {
      logger.debug('使用 apple script 打开启动 URL 失败。')
      logger.debug(err)
    }
  }

  // 如果 命中 open fallback, 并且是重启 不执行 打开浏览器
  if (process.env.KMI_RESTART) {
    logger.debug(
      '使用 apple script 打开启动 URL 失败, 检测到重启操作,跳过自动打开浏览器',
    )
    return
  }

  // Fallback to open
  // (It will always open new tab)
  try {
    const { default: open } = await import('../compiled/open/index.js')
    await open(url)
    return true
  } catch (err) {
    logger.error('Failed to open start URL.')
    logger.error(err)
    return false
  }
}

const getHostInUrl = (host: string): string => {
  if (host === DEFAULT_DEV_HOST) {
    return 'localhost'
  }
  if (net.isIPv6(host)) {
    return host === '::' ? '[::1]' : `[${host}]`
  }
  return host
}

function resolveUrl(str: string, base: string): string {
  if (canParse(str)) {
    return str
  }

  try {
    const url = new URL(str, base)
    return url.href
  } catch (e) {
    throw new Error('[kmi:open]: 无效输入: 不是有效的 URL 或路径')
  }
}

const canParse = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const replacePortPlaceholder = (url: string, port: number): string =>
  url.replace(/<port>/g, String(port))
