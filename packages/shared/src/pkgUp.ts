import findUp from '../compiled/find-up'
import fse from '../compiled/fs-extra'

interface Options {
  /**
	The directory to start from.

	@default process.cwd()
	*/
  readonly cwd?: string
}

export async function pkgUp({ cwd }: Options = {}): Promise<
  string | undefined
> {
  return findUp('package.json', { cwd })
}

export function pkgUpSync({ cwd }: Options = {}): string | undefined {
  return findUp.sync('package.json', { cwd })
}

export function getPkgJsonSync(
  cwd: string,
  ignore = false,
): object | undefined {
  const pkgPath = findUp.sync('package.json', { cwd })
  if (!pkgPath || !fse.existsSync(pkgPath)) {
    if (ignore) return {}
    throw Error(`${pkgPath}不存在，请检查`)
  }
  return fse.readJSONSync(pkgPath, 'utf-8')
}
