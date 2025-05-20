import esbuild, { transform, transformSync } from 'esbuild'

export { esbuild, transform, transformSync }
export type {
  BuildResult,
  BuildContext,
  BuildOptions,
  BuildFailure,
  Message,
  TransformOptions,
  Plugin as ESBuildPlugin,
  Loader,
  TransformResult,
} from 'esbuild'
