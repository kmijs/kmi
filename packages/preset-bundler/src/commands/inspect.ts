import fs from 'node:fs'
import {
  picocolors as color,
  lodash,
  logger,
  pathe,
  stringifyConfig,
} from '@kmijs/shared'
import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.registerCommand({
    name: 'inspect',
    description:
      'The inspect command is used to view the Umi configuration and Rspack(Webpack) configuration of the project.',
    configResolveMode: 'loose',
    details: 'umi inspect --mode development',
    // umi not support args
    // args: {
    //   mode: {
    //     description:
    //       '指定构建模式，可以是 `development`，`production`, 默认是 production',
    //     type: 'enum',
    //     options: ['development', 'production'],
    //   },
    //   verbose: {
    //     type: 'boolean',
    //     description: '在结果中展示函数的完整内容',
    //     default: false,
    //   },
    // },
    async fn() {
      try {
        const opts = await api.applyPlugins({
          key: 'modifyUniBundlerOpts',
          initialValue: {
            config: api.config,
            cwd: api.cwd,
            cache: {
              buildDependencies: [
                api.pkgPath,
                api.service.configManager!.mainConfigFile || '',
              ].filter(Boolean),
            },
            clean: api.args.clean,
          },
          args: {
            bundler: api.appData.bundler,
          },
        })

        const bundler = await api.applyPlugins({
          key: 'modifyUniBundler',
          args: {
            bundler: api.appData.bundler,
            opts,
          },
        })

        const bundlerConfig = await bundler.getConfig({
          ...opts,
          env: process.env.NODE_ENV,
          userConfig: opts.config,
        })

        const absOutputPath = pathe.resolve(opts.cwd, api.appData.outputPath)
        const inspectPath = pathe.resolve(absOutputPath, '.umi')
        const files = [
          {
            path: pathe.join(inspectPath, `${api.appData.bundler}.config.mjs`),
            label: `${lodash.capitalize(api.appData.bundler)} Config`,
            content: stringifyConfig(bundlerConfig, {
              removeApiProperty: true,
              verbose: api.args.verbose,
            }),
          },
          {
            path: pathe.join(inspectPath, 'umi.config.mjs'),
            label: 'Umi Config',
            content: stringifyConfig(api.config, {
              verbose: api.args.verbose,
            }),
          },
        ]
        await fs.promises.mkdir(inspectPath, { recursive: true })

        await Promise.all(
          files.map(async (item) => {
            return fs.promises.writeFile(
              item.path,
              `export default ${item.content}`,
            )
          }),
        )

        const fileInfos = files
          .map(
            (item) =>
              `  - ${color.bold(color.yellow(item.label))}: ${color.underline(
                item.path,
              )}`,
          )
          .join('\n')

        logger.ready(
          `Inspect configuration successful, please open the following files to view the content:\n\n${fileInfos}\n`,
        )
      } catch (err) {
        logger.error('Failed to inspect config.')
        logger.error(err)
        process.exit(1)
      }
    },
  })
}
