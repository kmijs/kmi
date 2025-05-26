import assert from 'node:assert'
import fs from 'node:fs'
// 创建模版
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $, BaseGenerator, logger, prompts, yParser } from '@kmijs/shared'
import { version } from '../../../packages/bundler-rspack/package.json'

const BASE_DIR_MAP: Record<string, string> = {
  basic: 'packages',
  plugin: 'packages',
  example: 'examples',
  e2e: 'e2e',
}

const e2eportsPath = join(
  dirname(fileURLToPath(import.meta.url)),
  './e2eports.json',
)

async function main() {
  const ports = JSON.parse(fs.readFileSync(e2eportsPath, 'utf-8'))
  const args = yParser(process.argv.slice(2))
  const [projectName] = args._
  const { template, name, description, port } = await prompts(
    [
      {
        message: '请选择模版类型',
        name: 'template',
        type: 'select',
        choices: [
          {
            title: 'kmi 基础包',
            value: 'basic',
          },
          {
            title: 'kmi 插件',
            value: 'plugin',
          },
          {
            title: 'kmi 示例',
            value: 'example',
          },
          {
            title: 'kmi e2e',
            value: 'e2e',
          },
        ],
      },
      {
        name: 'name',
        type: 'text',
        message: '请输入包名',
        initial: projectName,
        validate: (value: any) =>
          value === undefined || value == null ? '包名不能为空?' : true,
      },
      {
        name: 'description',
        type: 'text',
        message: '描述',
      },
      {
        type: (pre: any, values: any) =>
          values.template === 'e2e' ? 'number' : null,
        name: 'port',
        message: 'e2e 服务端口号(不能重复哦)',
        initial: ports.at(-1)! + 1,
        validate: (value: any) => {
          if (value === undefined || value == null) {
            return '端口号不能为空'
          }
          if (value >= 1024) {
            return '端口号不能小于 1024'
          }
          if (ports.includes(value)) {
            return '端口号已存在'
          }
          return true
        },
      },
    ],
    {
      onCancel() {
        logger.error('取消模版创建')
        process.exit(0)
      },
    },
  )

  assert(template, 'template 不能为空')
  assert(name, 'template 不能为空')

  if (port) {
    const newPorts = [...ports, port]
    fs.writeFileSync(e2eportsPath, JSON.stringify(newPorts, null, 2))
  }

  const pkgName = () => {
    if (template === 'plugin') {
      return `plugin-${name}`
    }
    if (template === 'preset') {
      return `preset-${name}`
    }
    return name
  }

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const target = join(__dirname, '../../../', BASE_DIR_MAP[template], pkgName())

  $.verbose = false
  const gitName = (await $`git config --get user.name`).stdout.trim()
  const gitEmail = (await $`git config --get user.email`).stdout.trim()
  $.verbose = true

  const generator = new BaseGenerator({
    path: join(__dirname, '../templates', template),
    target,
    slient: true,
    data: {
      version,
      name,
      description,
      gitName,
      gitEmail,
      port,
    },
  })

  await generator.run()

  logger.event(`模版创建成功: ${target}`)
}

main()
