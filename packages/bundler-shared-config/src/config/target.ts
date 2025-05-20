import type { SharedConfigOptions } from '../types'
import { getESVersion } from '../utils/target'

export function applyTarget(opts: SharedConfigOptions) {
  const { config, bundlerType, browsers } = opts

  // target
  const esVersion = bundlerType === 'rspack' ? getESVersion(browsers) : 'es5'
  config.target(['web', esVersion])
}
