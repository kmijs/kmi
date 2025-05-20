import fs from 'node:fs'
import { dirname, isAbsolute, join, normalize, sep } from 'node:path'
import type {
  PluginItem as BabelPlugin,
  PluginOptions as BabelPluginOptions,
  TransformOptions as BabelTransformOptions,
} from '@kmijs/bundler-compiled/compiled/babel/core'
import { reduceConfigsWithContext } from '@kmijs/bundler-shared/compiled/reduce-configs'
// @ts-expect-error
import upath from '../../compiled/upath'
import type {
  BabelConfigUtils,
  BabelLoaderOptions,
  ConfigChainWithContext,
  IConfig,
  PresetTypescriptOptions,
} from '../types'

type UserBabelConfig = ConfigChainWithContext<
  BabelLoaderOptions,
  BabelConfigUtils
>

export async function getCacheIdentifier(options: BabelLoaderOptions) {
  let identifier = `${process.env.NODE_ENV}${
    process.env.KMI_ENV || 'local'
  }${JSON.stringify(options)}`

  // 兼容老项目环境变量
  const envs = [
    process.env.BUILD_ENV,
    process.env.KMI_APP_ENV,
    process.env.REACT_APP_ENV,
    process.env.VUE_APP_ENV,
  ].filter(Boolean)

  identifier += envs.join('')

  const { version: coreVersion } = await import(
    '@kmijs/bundler-compiled/compiled/babel/core.js'
  )
  const rawPkgJson = await fs.promises.readFile(
    join(
      __dirname,
      '@kmijs/bundler-compiled/compiled/babel-loader/package.json',
    ),
    'utf-8',
  )
  const loaderVersion: string = JSON.parse(rawPkgJson).version ?? ''

  identifier += `@babel/core@${coreVersion}`
  identifier += `babel-loader@${loaderVersion}`
  identifier += `kmi-version@${require('../../package.json').version}`

  return identifier
}

export async function getDefaultBabelOptions(opts: {
  userConfig: IConfig
  cwd: string
  transpiler: 'extra-babel' | 'babel'
  extraBabelPlugins: any[]
  extraBabelPresets: any[]
}): Promise<BabelLoaderOptions> {
  const { cwd, userConfig, transpiler = 'babel' } = opts
  const cacheDirectory = join(
    cwd,
    'node_modules',
    `.cache/babel-loader/rspack-${transpiler}`,
  )

  const options: BabelLoaderOptions = {
    babelrc: false,
    configFile: false,
    browserslistConfigFile: false,
    cacheDirectory: process.env.BABEL_CACHE === 'none' ? false : cacheDirectory,
    plugins: [
      [
        require.resolve(
          '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-decorators',
        ),
        { legacy: true },
      ],
      [
        require.resolve(
          '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-class-properties',
        ),
      ],
      // 添加 transform-runtime 插件减少重复的 runtime 代码
      [
        require.resolve(
          '@kmijs/bundler-compiled/compiled/babel/plugin-transform-runtime',
        ),
        {
          absoluteRuntime: dirname(require.resolve('../../package.json')),
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: true,
          version: `^${require('@babel/runtime/package.json').version}`,
        },
      ],
      ...opts.extraBabelPlugins,
      ...(userConfig.extraBabelPlugins || []).filter(Boolean),
    ],
    presets: [
      [
        require.resolve(
          '@kmijs/bundler-compiled/compiled/babel/preset-typescript',
        ),
        {
          // 支持vue 后缀
          allExtensions: true,
          // 支持tsx
          isTSX: true,
          allowNamespaces: true,
          allowDeclareFields: true,
          // Why false?
          // 如果为 true，babel 只删除 import type 语句，会保留其他通过 import 引入的 type
          // 这些 type 引用走到 webpack 之后，就会报错
          onlyRemoveTypeImports: false,
          // aligns Babel's behavior with TypeScript's default behavior.
          // https://babeljs.io/docs/en/babel-preset-typescript#optimizeconstenums
          optimizeConstEnums: true,
        },
      ],
      ...opts.extraBabelPresets,
      ...(userConfig.extraBabelPresets || []).filter(Boolean),
    ],
  }

  // turn off compression to reduce overhead
  // options.cacheCompression = false
  // options.cacheIdentifier = await getCacheIdentifier(options)
  return options
}

const addPlugins = (plugins: BabelPlugin[], config: BabelTransformOptions) => {
  if (config.plugins) {
    config.plugins.push(...plugins)
  } else {
    config.plugins = plugins
  }
}

const addPresets = (presets: BabelPlugin[], config: BabelTransformOptions) => {
  if (config.presets) {
    config.presets.push(...presets)
  } else {
    config.presets = presets
  }
}

export const castArray = <T>(arr?: T | T[]): T[] => {
  if (arr === undefined) {
    return []
  }
  return Array.isArray(arr) ? arr : [arr]
}

// compatible with windows path
const formatPath = (originPath: string) => {
  if (isAbsolute(originPath)) {
    return originPath.split(sep).join('/')
  }
  return originPath
}

const getPluginItemName = (item: BabelPlugin) => {
  if (typeof item === 'string') {
    return formatPath(item)
  }
  if (Array.isArray(item) && typeof item[0] === 'string') {
    return formatPath(item[0])
  }
  return null
}

const removePlugins = (
  plugins: string | string[],
  config: BabelTransformOptions,
) => {
  if (!config.plugins) {
    return
  }

  const removeList = castArray(plugins)

  config.plugins = config.plugins.filter((item: BabelPlugin) => {
    const name = getPluginItemName(item)
    if (name) {
      return !removeList.find((removeItem) => name.includes(removeItem))
    }
    return true
  })
}

const removePresets = (
  presets: string | string[],
  config: BabelTransformOptions,
) => {
  if (!config.presets) {
    return
  }

  const removeList = castArray(presets)

  config.presets = config.presets.filter((item: BabelPlugin) => {
    const name = getPluginItemName(item)
    if (name) {
      return !removeList.find((removeItem) => name.includes(removeItem))
    }
    return true
  })
}

const normalizeToPosixPath = (p: string | undefined) =>
  upath
    .normalizeSafe(normalize(p || ''))
    .replace(/^([a-zA-Z]+):/, (_: any, m: string) => `/${m.toLowerCase()}`)

const modifyPresetOptions = <T>(
  presetName: string,
  options: T,
  presets: BabelPlugin[] = [],
) => {
  presets.forEach((preset: BabelPlugin, index) => {
    // 1. ['@babel/preset-env', ...]
    if (Array.isArray(preset)) {
      if (
        typeof preset[0] === 'string' &&
        normalizeToPosixPath(preset[0]).includes(presetName)
      ) {
        preset[1] = {
          ...(preset[1] || {}),
          ...options,
          // `options` is specific to different presets
        } as unknown as BabelPluginOptions
      }
    } else if (
      typeof preset === 'string' &&
      normalizeToPosixPath(preset).includes(presetName)
    ) {
      // 2. '@babel/preset-env'
      presets[index] = [preset, options]
    }
  })
}

const modifyPluginOptions = <T>(
  pluginName: string,
  options: T,
  plugins: BabelPlugin[] = [],
) => {
  plugins.forEach((plugin: BabelPlugin, index) => {
    if (Array.isArray(plugin)) {
      if (
        typeof plugin[0] === 'string' &&
        normalizeToPosixPath(plugin[0]).includes(pluginName)
      ) {
        plugin[1] = {
          ...(plugin[1] || {}),
          ...options,
        } as unknown as BabelPluginOptions
      }
    } else if (
      typeof plugin === 'string' &&
      normalizeToPosixPath(plugin).includes(pluginName)
    ) {
      plugins[index] = [plugin, options]
    }
  })
}

export const getBabelUtils = (
  config: BabelTransformOptions,
): BabelConfigUtils => {
  return {
    addPlugins: (plugins: BabelPlugin[]) => addPlugins(plugins, config),
    addPresets: (presets: BabelPlugin[]) => addPresets(presets, config),
    removePlugins: (plugins: string | string[]) =>
      removePlugins(plugins, config),
    removePresets: (presets: string | string[]) =>
      removePresets(presets, config),
    modifyPresetTypescriptOptions: (options: PresetTypescriptOptions) =>
      modifyPresetOptions(
        '@kmijs/bundler-compiled/compiled/babel/preset-typescript',
        options,
        config.presets || [],
      ),
    modifyPluginOptions: (pluginName: string, options: any) =>
      modifyPluginOptions(pluginName, options, config.plugins || []),
  }
}

export function applyUserBabelConfig(
  defaultOptions: BabelLoaderOptions,
  userBabelConfig?: UserBabelConfig,
  extraBabelUtils?: Partial<BabelConfigUtils>,
) {
  if (userBabelConfig) {
    const babelUtils = {
      ...getBabelUtils(defaultOptions),
      ...extraBabelUtils,
    } as BabelConfigUtils

    return reduceConfigsWithContext({
      initial: defaultOptions,
      config: userBabelConfig,
      ctx: babelUtils,
    })
  }

  return defaultOptions
}
