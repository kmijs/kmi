import fs from 'node:fs'
import inspector from 'node:inspector'
import path from 'node:path'
import { rspack } from '@kmijs/bundler-rspack'
import { fsExtra, logger } from '@kmijs/shared'
import type { IApi } from '@kmijs/types'

const stopProfiler = (output: string, profileSession?: inspector.Session) => {
  if (!profileSession) {
    return
  }

  profileSession.post('Profiler.stop', (error, param) => {
    if (error) {
      logger.error('Failed to generate JS CPU profile:', error)
      return
    }
    fs.writeFileSync(output, JSON.stringify(param.profile))
  })
}

export default (api: IApi) => {
  api.describe({
    key: 'preset-uni:rspackProfile',
    enableBy: () => {
      return Boolean(!!process.env.RSPACK_PROFILE && api.userConfig.rspack)
    },
  })

  /**
   * RSPACK_PROFILE=ALL
   * RSPACK_PROFILE=TRACE|CPU|LOGGING
   */
  const RSPACK_PROFILE = process.env.RSPACK_PROFILE?.toUpperCase()
  if (!RSPACK_PROFILE) {
    return
  }

  const timestamp = Date.now()
  const profileDirName = `rspack-profile-${timestamp}`

  let profileSession: inspector.Session | undefined

  const enableProfileTrace =
    RSPACK_PROFILE === 'ALL' || RSPACK_PROFILE.includes('TRACE')

  const enableCPUProfile =
    RSPACK_PROFILE === 'ALL' || RSPACK_PROFILE.includes('CPU')

  const enableLogging =
    RSPACK_PROFILE === 'ALL' || RSPACK_PROFILE.includes('LOGGING')

  const profileDir = path.join(api.paths.absOutputPath, profileDirName)

  const onStart = () => {
    const traceFilePath = path.join(profileDir, 'trace.json')

    fsExtra.mkdirpSync(profileDir)

    if (enableProfileTrace) {
      rspack.experiments.globalTrace.register('trace', 'chrome', traceFilePath)
    }

    if (enableCPUProfile) {
      profileSession = new inspector.Session()
      profileSession.connect()
      profileSession.post('Profiler.enable')
      profileSession.post('Profiler.start')
    }
  }

  const onGenJscpuprofile = () => {
    if (enableProfileTrace) {
      rspack.experiments.globalTrace.cleanup()
    }
    const cpuProfilePath = path.join(profileDir, 'jscpuprofile.json')

    stopProfiler(cpuProfilePath, profileSession)

    api.logger.info(`Saved Rspack profile file to ${profileDir}`)
  }

  const onGetLoggingFile = (stats: any) => {
    const loggingFilePath = path.join(profileDir, 'logging.json')
    if (enableLogging && stats) {
      const logging = stats.toJson({
        all: false,
        logging: 'verbose',
        loggingTrace: true,
      })
      fs.writeFileSync(loggingFilePath, JSON.stringify(logging))
    }
  }

  api.onBeforeCompiler(() => {
    onStart()
  })

  api.onDevCompileDone(({ isFirstCompile, stats }) => {
    if (isFirstCompile) {
      onGetLoggingFile(stats)
      onGenJscpuprofile()
    }
  })

  api.onBuildComplete(({ err, stats }) => {
    if (!err && !stats.hasErrors()) {
      onGetLoggingFile(stats)
    }
  })

  api.onBuildHtmlComplete(() => {
    onGenJscpuprofile()
  })
}
