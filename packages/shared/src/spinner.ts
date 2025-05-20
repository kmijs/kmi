import process from 'node:process'
import { block } from '../compiled/@clack/core'
import color from '../compiled/picocolors'
import { cursor, erase } from '../compiled/sisteransi'

const unicode = isUnicodeSupported()
const s = (c: string, fallback: string) => (unicode ? c : fallback)

const S_STEP_SUBMIT = s('✔', 'o')
const S_STEP_CANCEL = s('■', 'x')
const S_STEP_ERROR = s('▲', 'x')

export const spinner = () => {
  const frames = unicode ? ['◒', '◐', '◓', '◑'] : ['•', 'o', 'O', '0']
  const delay = unicode ? 80 : 120
  const isCI = process.env.CI === 'true'

  let unblock: () => void
  let loop: NodeJS.Timeout
  let isSpinnerActive = false
  let _message = ''
  let _prevMessage: string | undefined = undefined

  const handleExit = (code: number) => {
    const msg = code > 1 ? 'Something went wrong' : 'Canceled'
    if (isSpinnerActive) stop(msg, code)
  }

  const errorEventHandler = () => handleExit(2)
  const signalEventHandler = () => handleExit(1)

  const registerHooks = () => {
    // Reference: https://nodejs.org/api/process.html#event-uncaughtexception
    process.on('uncaughtExceptionMonitor', errorEventHandler)
    // Reference: https://nodejs.org/api/process.html#event-unhandledrejection
    process.on('unhandledRejection', errorEventHandler)
    // Reference Signal Events: https://nodejs.org/api/process.html#signal-events
    process.on('SIGINT', signalEventHandler)
    process.on('SIGTERM', signalEventHandler)
    process.on('exit', handleExit)
  }

  const clearHooks = () => {
    process.removeListener('uncaughtExceptionMonitor', errorEventHandler)
    process.removeListener('unhandledRejection', errorEventHandler)
    process.removeListener('SIGINT', signalEventHandler)
    process.removeListener('SIGTERM', signalEventHandler)
    process.removeListener('exit', handleExit)
  }

  const clearPrevMessage = () => {
    if (_prevMessage === undefined) return
    if (isCI) process.stdout.write('\n')
    const prevLines = _prevMessage.split('\n')
    process.stdout.write(cursor.move(-999, prevLines.length - 1))
    process.stdout.write(erase.down(prevLines.length))
  }

  const parseMessage = (msg: string): string => {
    return msg.replace(/\.+$/, '')
  }

  const start = (msg = ''): void => {
    isSpinnerActive = true
    unblock = block()
    _message = parseMessage(msg)
    // process.stdout.write(`${color.gray(S_BAR)}\n`)
    let frameIndex = 0
    let dotsTimer = 0
    registerHooks()
    loop = setInterval(() => {
      if (isCI && _message === _prevMessage) {
        return
      }
      clearPrevMessage()
      _prevMessage = _message
      const frame = color.magenta(frames[frameIndex])
      const loadingDots = isCI
        ? '...'
        : '.'.repeat(Math.floor(dotsTimer)).slice(0, 3)
      process.stdout.write(`${frame} ${_message}${loadingDots}`)
      frameIndex = frameIndex + 1 < frames.length ? frameIndex + 1 : 0
      dotsTimer = dotsTimer < frames.length ? dotsTimer + 0.125 : 0
    }, delay)
  }

  const stop = (msg = '', code = 0): void => {
    isSpinnerActive = false
    clearInterval(loop)
    clearPrevMessage()
    const step =
      code === 0
        ? color.green(S_STEP_SUBMIT)
        : code === 1
        ? color.red(S_STEP_CANCEL)
        : color.red(S_STEP_ERROR)
    _message = parseMessage(msg ?? _message)
    process.stdout.write(`${step} ${_message}\n`)
    clearHooks()
    unblock()
  }

  const message = (msg = ''): void => {
    _message = parseMessage(msg ?? _message)
  }

  return {
    start,
    stop,
    message,
  }
}

function isUnicodeSupported() {
  if (process.platform !== 'win32') {
    return process.env.TERM !== 'linux' // Linux console (kernel)
  }

  return (
    Boolean(process.env.CI) ||
    Boolean(process.env.WT_SESSION) || // Windows Terminal
    Boolean(process.env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
    process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
    process.env.TERM_PROGRAM === 'Terminus-Sublime' ||
    process.env.TERM_PROGRAM === 'vscode' ||
    process.env.TERM === 'xterm-256color' ||
    process.env.TERM === 'alacritty' ||
    process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
  )
}
