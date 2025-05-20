import type { PluginItem as BabelPlugin } from '../../compiled/@babel/core'

export interface ICopy {
  from: string
  to: string
}

export type { BabelPlugin }

export enum CSSMinifier {
  esbuild = 'esbuild',
  cssnano = 'cssnano',
  lightningcss = 'lightningcss',
  none = 'none',
}

export enum JSMinifier {
  swc = 'swc',
  none = 'none',
  terser = 'terser',
  esbuild = 'esbuild',
}
