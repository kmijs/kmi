import os from 'node:os'
import path from 'node:path'
import { Piscina } from '@kmijs/bundler-shared/piscina'
import type { LoaderContext } from '@kmijs/bundler-shared/rspack'
import type { LessLoaderOpts, LessOptions } from '.'

export const createParallelLoader = (
  loaderContext: LoaderContext<LessLoaderOpts>,
) => {
  const piscina = new Piscina<
    {
      content: string
      opts: LessOptions
      alias: Record<string, any>
      context: string
      modules: string[]
      cwd: string
    },
    Less.RenderOutput
  >({
    filename: process.env.KMI_CLI_TEST
      ? // 单侧跑在 ts 这里拼接会有问题、所以指定编译后的路径
        path.join(__dirname, '../../../../dist/config/css/less/render.js')
      : path.join(__dirname, '/render.js'),
    minThreads: 2,
    maxThreads: Math.max(4, Math.floor(os.cpus().length * 0.8)),
    idleTimeout: 5000,
    useAtomics: true,
    recordTiming: false,
  })

  const messageHandler = ({
    type,
    filename,
  }: {
    type: string
    filename: string
  }) => {
    if (type === 'addDependency') {
      loaderContext.addDependency(filename)
    }
  }

  piscina.on('message', messageHandler)

  // @ts-expect-error 自定义销毁事件
  piscina.__terminate = () => {
    piscina.destroy()
  }
  return piscina
}
