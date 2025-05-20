import type { Chunk } from '@kmijs/bundler-shared/rspack'

interface FileDescriptor {
  chunk?: Chunk
  isAsset: boolean
  isChunk: boolean
  isInitial: boolean
  isModuleAsset: boolean
  name: string
  path: string
}
type Manifest = Record<string, any>

export interface ManifestOptions {
  assetHookStage: number
  basePath: string
  fileName: string
  filter: (file: FileDescriptor) => boolean
  generate: (
    seed: Record<any, any>,
    files: FileDescriptor[],
    entries: Record<string, string[]>,
  ) => Manifest
  map: (file: FileDescriptor) => FileDescriptor
  publicPath: string
  removeKeyHash: RegExp | false
  seed: Record<any, any>
  serialize: (manifest: Manifest) => string
  sort: (fileA: FileDescriptor, fileB: FileDescriptor) => number
  transformExtensions: RegExp
  useEntryKeys: boolean
  useLegacyEmit: boolean
  writeToFileEmit: boolean
  [key: string]: any
}
