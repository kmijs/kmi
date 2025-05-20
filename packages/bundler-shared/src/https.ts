import { existsSync, promises, readFileSync } from 'node:fs'
import type { RequestListener } from 'node:http'
import https from 'node:https'
import { join } from 'node:path'
import { execa, fsExtra, logger } from '@kmijs/shared'
import type { HttpsServerOptions } from './types'

const DEFAULT_HTTPS_HOSTS = ['localhost', '127.0.0.1']
const EXPIRE_DAYS = 30 // 证书过期时间(天)
const CERT_FILE_NAME = 'kmi.https.pem'
const KEY_FILE_NAME = 'kmi.https.key.pem'
const JSON_FILE_NAME = 'kmi.https.json'

/**
 * 检查 mkcert 是否已安装
 */
const isMkcertInstalled = async (): Promise<boolean> => {
  try {
    await execa('mkcert', ['-help'])
    return true
  } catch {
    return false
  }
}
/**
 * 检查证书配置信息
 * @param jsonFile 配置文件路径
 * @param hosts 主机列表
 * @returns 配置信息对象，如果文件不存在或解析失败则返回null
 */
function getCertConfig(
  jsonFile: string,
): { hosts: string[]; type: string } | null {
  try {
    return JSON.parse(readFileSync(jsonFile, 'utf-8'))
  } catch {
    return null
  }
}

/**
 * 检查证书有效性
 */
async function checkCertificateValidity(
  cert: string,
  jsonPath: string,
  key: string,
  hosts: string[],
): Promise<boolean> {
  // 检查所有文件是否存在
  if (!existsSync(cert) || !existsSync(jsonPath) || !existsSync(key)) {
    return false
  }

  // 获取证书配置信息
  const config = getCertConfig(jsonPath)
  if (!config) return false

  // 检查hosts是否变化
  if (config.hosts.join(',') !== hosts.join(',')) {
    return false
  }

  // 如果mkcert已安装但之前未使用mkcert生成证书，则重新生成
  if ((await isMkcertInstalled()) && config.type !== 'mkcert') {
    logger.verbose(
      '[HTTPS] mkcert 已安装，但之前未使用 mkcert 生成证书，重新生成...',
    )
    return false
  }

  // 检查证书是否过期
  const stats = await promises.stat(cert)
  const daysDiff = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24)
  return daysDiff < EXPIRE_DAYS
}

/**
 * 使用 mkcert 生成证书
 */
async function generateMkcertCertificate(
  cert: string,
  key: string,
  hosts: string[],
  jsonPath: string,
) {
  logger.info('使用 mkcert 生成证书和密钥文件...')
  await execa('mkcert', ['-cert-file', cert, '-key-file', key, ...hosts])
  await fsExtra.writeFile(
    jsonPath,
    JSON.stringify({ hosts, type: 'mkcert' }),
    'utf-8',
  )
}

/**
 * 使用 selfsigned 生成自签名证书
 */
async function generateSelfSignedCertificate(
  cert: string,
  key: string,
  hosts: string[],
  jsonPath: string,
) {
  const selfsigned = require('../compiled/selfsigned')
  const pems = selfsigned.generate(
    [{ name: 'commonName', value: 'localhost' }],
    {
      algorithm: 'sha256',
      days: EXPIRE_DAYS,
      keySize: 2048,
      extensions: [
        {
          name: 'basicConstraints',
          cA: true,
        },
        {
          name: 'keyUsage',
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true,
        },
        {
          name: 'extKeyUsage',
          serverAuth: true,
          clientAuth: true,
          codeSigning: true,
          timeStamping: true,
        },
        {
          name: 'subjectAltName',
          altNames: [
            { type: 2, value: 'localhost' },
            { type: 2, value: 'localhost.localdomain' },
            { type: 2, value: 'lvh.me' },
            { type: 2, value: '*.lvh.me' },
            { type: 2, value: '[::1]' },
            { type: 7, ip: '127.0.0.1' },
            { type: 7, ip: 'fe80::1' },
          ],
        },
      ],
    },
  )

  logger.info('使用 selfsigned 生成证书和密钥文件...')
  const content = pems.private + pems.cert
  await Promise.all([
    fsExtra.writeFile(key, content),
    fsExtra.writeFile(cert, content),
    fsExtra.writeFile(
      jsonPath,
      JSON.stringify({ hosts, type: 'selfsigned' }),
      'utf-8',
    ),
  ])
}

/**
 * 解析 HTTPS 配置
 */
export async function resolveHttpsConfig(httpsConfig: HttpsServerOptions) {
  let { key, cert, hosts = DEFAULT_HTTPS_HOSTS } = httpsConfig

  // 如果已提供 key 和 cert,直接返回
  if (key && cert) {
    return { key, cert }
  }

  const outputPath = httpsConfig.outputPath ?? __dirname
  key = join(outputPath, KEY_FILE_NAME)
  cert = join(outputPath, CERT_FILE_NAME)
  const jsonPath = join(outputPath, JSON_FILE_NAME)

  // 检查证书是否存在且未过期
  const isCertValid = await checkCertificateValidity(cert, jsonPath, key, hosts)
  if (isCertValid) {
    return { key, cert }
  }

  // 生成新证书
  logger.wait('[HTTPS] 正在生成证书和密钥文件...')

  if (httpsConfig.outputPath) {
    await fsExtra.ensureDir(httpsConfig.outputPath)
  }

  if (await isMkcertInstalled()) {
    await generateMkcertCertificate(cert, key, hosts, jsonPath)
  } else {
    await generateSelfSignedCertificate(cert, key, hosts, jsonPath)
  }

  return { key, cert }
}

/**
 * 创建 HTTPS 服务器
 */
export async function createHttpsServer(
  app: RequestListener,
  httpsConfig: HttpsServerOptions,
) {
  logger.wait('[HTTPS] 正在启动 HTTPS 服务...')

  const { key, cert } = await resolveHttpsConfig(httpsConfig)
  if (httpsConfig.http2) {
    const { createSecureServer } = await import('node:http2')
    return createSecureServer(
      {
        key: readFileSync(key, 'utf-8'),
        cert: readFileSync(cert, 'utf-8'),
        allowHTTP1: true,
        // increase the maximum memory (MiB)
        maxSessionMemory: 1024,
      },
      // @ts-expect-error 无类型
      app,
    )
  }

  // Create server
  const createServer = https.createServer
  return createServer(
    {
      key: readFileSync(key, 'utf-8'),
      cert: readFileSync(cert, 'utf-8'),
    },
    app,
  )
}
