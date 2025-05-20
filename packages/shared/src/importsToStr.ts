import { winPath } from './winPath'

export function importsToStr(
  imports: { source: string; specifier?: string }[],
) {
  return imports.map((imp) => {
    const { source, specifier } = imp
    if (specifier) {
      return `import ${specifier} from '${winPath(source)}';`
    }
    return `import '${winPath(source)}';`
  })
}
