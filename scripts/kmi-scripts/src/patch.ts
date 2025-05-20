import { logger, yParser } from '@kmijs/shared'
import { writePackage } from './utils/writePackage'

export const PKG_NAME = '@umijs/plugins'
;(async () => {
  const args = yParser(process.argv.slice(2), {
    default: {
      pkgName: '@umijs/plugins',
      message: '@kmijs/react/package.json',
    },
  })

  logger.ready('args:', args)

  writePackage(args.pkgName, args.message)
})()
