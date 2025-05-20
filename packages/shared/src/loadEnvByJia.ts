import { castArray } from './castArray'

/**
 * 加载环境变量并返回格式化后的对象数组 by jia
 * @param env 单个环境变量名或环境变量名数组
 * @param vals 可选的环境变量值对象，优先级高于process.env
 * @returns 格式化后的环境变量对象数组
 */
export function loadEnvByJia(
  env: string | string[],
  vals?: Record<string, string>,
) {
  const envs = castArray(env)
  const publicVars: Record<string, string> = {}

  for (const envKey of envs) {
    const val = vals?.[envKey] ?? process.env[envKey]
    if (val) {
      publicVars[`process.env.${envKey}`] = val
      publicVars[`import.meta.env.${envKey}`] = val
    }
  }

  return {
    publicVars,
  }
}
