import axios from '../compiled/axios'
import { RegistryURL } from './constants'

/**
 *
 * 获取npm 包配置
 * @export
 * @param {string} id
 * @param {string} [range='']
 * @return {*}
 */
export async function getNpmConfig(id: string, range = 'latest') {
  const url = `${RegistryURL}/${encodeURIComponent(id).replace(
    /^%40/,
    '@',
  )}/${range}`
  return axios(url)
}
