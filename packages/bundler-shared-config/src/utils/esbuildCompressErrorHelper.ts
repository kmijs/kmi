import { picocolors } from '@kmijs/shared'

export function esbuildCompressErrorHelper(errorMsg: string) {
  if (typeof errorMsg !== 'string') return
  if (
    // https://github.com/evanw/esbuild/blob/a5f781ecd5edeb3fb6ae8d1045507ab850462614/internal/js_parser/js_parser_lower.go#L18
    errorMsg.includes('configured target environment') &&
    errorMsg.includes('es2015')
  ) {
    const terserRecommend = {
      label: picocolors.green('change jsMinifier'),
      details: picocolors.cyan(`  jsMinifier: 'terser'`),
    }
    const upgradeTargetRecommend = {
      label: picocolors.green('upgrade target'),
      details: picocolors.cyan(`  jsMinifierOptions: {
    target: ['chrome80', 'es2020']
  }`),
    }
    const ieRecommend = {
      details:
        'Note: For legacy browser compatibility, please refer to: https://umijs.org/blog/legacy-browser',
    }
    console.log()
    console.log(picocolors.bgRed(' COMPRESSION ERROR '))
    console.log(
      picocolors.yellow(
        `esbuild minify failed, please ${terserRecommend.label} or ${upgradeTargetRecommend.label}:`,
      ),
    )
    console.log('e.g. ')
    console.log(terserRecommend.details)
    console.log('   or')
    console.log(upgradeTargetRecommend.details)
    console.log(ieRecommend.details)
    console.log()
  }
}
