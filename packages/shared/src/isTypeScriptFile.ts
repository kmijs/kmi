export function isTypeScriptFile(path: string): boolean {
  return !/\.d\.ts$/.test(path) && /\.(ts|tsx)$/.test(path)
}
