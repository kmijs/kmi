import { DEFAULT_OUTPUT_PATH } from './constants'

export function getOutputPath(outputPath: any) {
  if (typeof outputPath === 'string') {
    return outputPath
  }
  if (typeof outputPath === 'object' && outputPath?.root) {
    return outputPath.root
  }
  return DEFAULT_OUTPUT_PATH
}
