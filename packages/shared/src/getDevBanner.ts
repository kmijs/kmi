import address from '../compiled/address'
import chalk from '../compiled/chalk'
import stripAnsi from '../compiled/strip-ansi'
import { DEFAULT_DEV_HOST } from './constants'

const BORDERS = {
  TL: chalk.gray.dim('╔'),
  TR: chalk.gray.dim('╗'),
  BL: chalk.gray.dim('╚'),
  BR: chalk.gray.dim('╝'),
  V: chalk.gray.dim('║'),
  H_PURE: '═',
}

export function getDevBanner(opts: {
  protocol: string
  host?: string
  port: number
  offset?: number
}) {
  const { protocol, host = DEFAULT_DEV_HOST, port, offset = 8 } = opts
  // 准备所有源代码行
  const header = ' App listening at:'
  const footer = chalk.bold(
    ' Now you can open browser with the above addresses↑ ',
  )
  const local = `  ${chalk.gray('>')}   Local: ${chalk.green(
    `${protocol}//${host === DEFAULT_DEV_HOST ? 'localhost' : host}:${port}`,
  )} `
  const ip = address.ip()
  const network = `  ${chalk.gray('>')} Network: ${
    ip ? chalk.green(`${protocol}//${ip}:${port}`) : chalk.gray('Not available')
  } `

  const clouddev = `  ${chalk.gray('>')} CloudDev: ${
    process.env.KMI_CLOUDDEV_HOST
      ? chalk.green(process.env.KMI_CLOUDDEV_HOST)
      : chalk.gray('Not available')
  } `
  const maxLen = Math.max(
    ...[header, footer, local, network, clouddev].map(
      (x) => stripAnsi(x || '').length,
    ),
  )

  // prepare all output lines
  const beforeLines = [
    `${BORDERS.TL}${chalk.gray.dim(''.padStart(maxLen, BORDERS.H_PURE))}${
      BORDERS.TR
    }`,
    `${BORDERS.V}${header}${''.padStart(maxLen - header.length)}${BORDERS.V}`,
    `${BORDERS.V}${local}${''.padStart(maxLen - stripAnsi(local).length)}${
      BORDERS.V
    }`,
  ]

  const mainLine: string[] = [
    `${BORDERS.V}${network}${''.padStart(maxLen - stripAnsi(network).length)}${
      BORDERS.V
    }`,
  ]

  if (process.env.KMI_CLOUDDEV_HOST) {
    mainLine.push(
      `${''.padStart(offset)}${BORDERS.V}${clouddev}${''.padStart(
        maxLen - stripAnsi(clouddev).length,
      )}${BORDERS.V}`,
    )
  }

  const afterLines = [
    `${BORDERS.V}${''.padStart(maxLen)}${BORDERS.V}`,
    `${BORDERS.V}${footer}${''.padStart(maxLen - stripAnsi(footer).length)}${
      BORDERS.V
    }`,
    `${BORDERS.BL}${chalk.gray.dim(''.padStart(maxLen, BORDERS.H_PURE))}${
      BORDERS.BR
    }`,
  ]

  // join lines as 3 parts for vertical middle output with logger
  return {
    before: beforeLines.map((l) => l.padStart(l.length + offset)).join('\n'),
    main: mainLine.join('\n'),
    after: afterLines.map((l) => l.padStart(l.length + offset)).join('\n'),
  }
}
