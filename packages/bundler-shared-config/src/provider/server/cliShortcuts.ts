import readline from 'node:readline'
import { picocolors as color, logger } from '@kmijs/shared'
import { isTTY } from './utils/isTTY'

type CliShortcut = {
  /**
   * The key to trigger the shortcut.
   */
  key: string
  /**
   * The description of the shortcut.
   */
  description: string
  /**
   * The action to execute when the shortcut is triggered.
   */
  action: () => void | Promise<void>
}

export const isCliShortcutsEnabled = (): boolean => {
  return process.env.KMI_SHORTCUTS !== 'none' && isTTY('stdin')
}

export function setupCliShortcuts({
  help = true,
  openPage,
  closeServer,
  printUrls,
}: {
  help?: boolean
  openPage: () => Promise<void>
  closeServer: () => Promise<void>
  printUrls: () => void
}) {
  // 创建快捷键描述文本
  const createShortcutDesc = (key: string, desc: string) => {
    return `${color.dim('press')} ${color.bold(
      color.cyan(`${key} + enter`),
    )} ${color.dim(desc)}`
  }

  const shortcuts: CliShortcut[] = [
    {
      key: 'c',
      description: createShortcutDesc('c', 'to clear console'),
      action: () => {
        logger.clearScreen()
      },
    },
    {
      key: 'o',
      description: createShortcutDesc('o', 'to open in browser'),
      action: openPage,
    },
    {
      key: 'q',
      description: createShortcutDesc('q', 'to quit'),
      action: async () => {
        try {
          await closeServer()
        } finally {
          process.exit()
        }
      },
    },
    {
      key: 'r',
      description: createShortcutDesc('r', 'to restart the server'),
      action: () => process.emit('KMI_RESTART_SERVER' as any),
    },
    {
      key: 'u',
      description: createShortcutDesc('u', 'to show server url'),
      action: printUrls,
    },
  ]

  if (help) {
    const helpText = createShortcutDesc('h', 'to show help')
    logger.log(` ➜ ${helpText}\n`)
  }

  const rl = readline.createInterface({
    input: process.stdin,
  })

  rl.on('line', (input) => {
    if (input === 'h') {
      let message = `\n${color.bold('Shortcuts Help:')}\n`
      for (const shortcut of shortcuts) {
        message += `  ${shortcut.description}\n`
      }
      console.log(message)
    }

    for (const shortcut of shortcuts) {
      if (input === shortcut.key) {
        shortcut.action()
        return
      }
    }
  })

  return () => {
    rl.close()
  }
}
