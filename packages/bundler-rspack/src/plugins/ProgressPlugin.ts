import type { Compiler, Stats } from '@kmijs/bundler-shared/rspack'
import { logger } from '@kmijs/shared'

const PLUGIN_NAME = 'KmiProgressPlugin'
interface IOpts {
  name?: string
}

class KmiProgressPlugin {
  public options: IOpts

  constructor(options: IOpts) {
    this.options = options
  }

  apply(compiler: Compiler): void {
    const prefix = this.options.name ? `[${this.options.name}]` : '[Rspack]'
    compiler.hooks.invalid.tap(PLUGIN_NAME, () => {
      logger.wait(`${prefix} Compiling...`)
    })

    compiler.hooks.done.tap(PLUGIN_NAME, (stats: Stats) => {
      const { errors, warnings } = stats.toJson({
        all: false,
        warnings: true,
        errors: true,
        colors: true,
      })

      const hasErrors = !!errors?.length
      const hasWarnings = !!warnings?.length
      hasWarnings
      if (hasErrors) {
        errors.forEach((error) => {
          logger.error(
            `${error.moduleName!}${error.loc ? `:${error.loc}` : ''}`,
          )
          console.log(error.message)
        })
      } else {
        if (!stats.endTime) {
          return
        }
        logger.event(
          `${prefix} Compiled in ${
            stats.endTime - Number(stats.startTime)
          } ms (${stats.compilation.modules.size} modules)`,
        )
      }
    })
  }
}

export default KmiProgressPlugin
