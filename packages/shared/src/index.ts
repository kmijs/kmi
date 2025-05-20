import remapping from '../compiled/@ampproject/remapping'
import * as clackPrompts from '../compiled/@clack/prompts'
import address from '../compiled/address'
import axios from '../compiled/axios'
import boxen from '../compiled/boxen'
import chalk from '../compiled/chalk'
// 三方
import * as chokidar from '../compiled/chokidar'
import crossSpawn from '../compiled/cross-spawn'
import dayjs from '../compiled/dayjs'
import debug from '../compiled/debug'
import deepmerge from '../compiled/deepmerge'
import defu from '../compiled/defu'
import enquirer from '../compiled/enquirer'
import execa from '../compiled/execa'
import * as fastestLevenshtein from '../compiled/fastest-levenshtein'
import * as filesize from '../compiled/filesize'
import fsExtra from '../compiled/fs-extra'
import glob from '../compiled/glob'
import * as gzipSize from '../compiled/gzip-size'
import json5 from '../compiled/json5'
import lodash from '../compiled/lodash'
import MagicString from '../compiled/magic-string'
import { minimatch } from '../compiled/minimatch'
import Mustache from '../compiled/mustache'
// @ts-expect-error 无类型文件
import npa from '../compiled/npm-package-arg'
import open from '../compiled/open'
import ora from '../compiled/ora'
import pathe from '../compiled/pathe'
import picocolors from '../compiled/picocolors'
import * as pkgUp from '../compiled/pkg-up'
import portfinder from '../compiled/portfinder'
import prompts from '../compiled/prompts'
import resolve from '../compiled/resolve'
import rimraf from '../compiled/rimraf'
import semver from '../compiled/semver'
import stdEnv from '../compiled/std-env'
import stripAnsi from '../compiled/strip-ansi'
import * as tsconfigPaths from '../compiled/tsconfig-paths'
import webpackMerge from '../compiled/webpack-merge'
import yParser from '../compiled/yargs-parser'
import yoctoSpinner from '../compiled/yocto-spinner'

// 工具函数
import BaseGenerator from './BaseGenerator/BaseGenerator'
import generateFile from './BaseGenerator/generateFile'
import Generator from './Generator/Generator'
import * as logger from './logger'
import { spinner } from './spinner'

export {
  chalk,
  prompts,
  yParser,
  lodash,
  semver,
  glob,
  fsExtra,
  Mustache,
  rimraf,
  pathe,
  chokidar,
  resolve,
  fastestLevenshtein,
  MagicString,
  remapping,
  debug,
  portfinder,
  pkgUp,
  deepmerge,
  execa,
  address,
  crossSpawn,
  enquirer,
  /**
   * ora 会导致进程不退出
   * @deprecated 使用 yocto-spinner 替代 ora
   */
  ora,
  axios,
  json5,
  dayjs,
  npa,
  filesize,
  gzipSize,
  stripAnsi,
  open,
  minimatch,
  defu,
  picocolors,
  boxen,
  clackPrompts,
  webpackMerge,
  tsconfigPaths,
  stdEnv,
  yoctoSpinner,
  // 业务
  logger,
  BaseGenerator,
  generateFile,
  Generator,
  spinner,
}

export * from './zod'
export * as register from './register'
export * from './installDeps'
export * from './zx'
export * from './updatePackageJSON'
export * from './winPath'
export * from './pkgUp'
export * from './importLazy'
export * from './isTypeScriptFile'
export * from './cliExample'
export * from './npmClient'
export * from './isLocalDev'
export * from './browsersList'
export * from './tryPaths'
export * from './getDevBanner'
export * from './getArgsValueAndAlias'
export * from './node'
export * from './resolveProjectDep'
export * from './isMonorepo'
export * from './importsToStr'
export * from './withTmpPath'
export * from './errorcode'
export * from './tryFiles'
export * from './sleep'
export * from './getCorejsVersion'
export * from './constants'
export * from './clearTmp'
export * from './package'
export * as aliasUtils from './aliasUtils'
export * from './isJavaScriptFile'
export * from './CodeFrameError'
export * from './resolveNodeModulePath'
export * from './stringify'
export * from './nodeEnv'
export * from './splitChunks'
export * from './stringifyConfig'
export * from './packageManager'
export * from './castArray'
export * from './openBrowser'
export * from './globalConfig'
export * from './laneId'
export * from './downloadNpm'
export * from './loadEnvByJia'
