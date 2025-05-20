import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { axios, glob } from '@kmijs/shared'
import type { Low } from 'lowdb'
import { JSONFilePreset } from 'lowdb/node'
import MarkdownIt from 'markdown-it'

const BlackList = ['README.md', 'index.md', 'changelog.md', 'contributing.md']

type Doc = {
  docId: string
  openDocUrl: string
  docType: string
  mdPath: string
  title: string
}

type Data = {
  docs: Record<string, Doc>
}

const request = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
})

class SyncDocs {
  private db!: Low<Data>
  private cwd: string
  private mds: string[] = []
  private srcPath: string

  private parentViewStrId = 'VYzpMEFFmW6Q'
  constructor() {
    this.cwd = process.cwd()
    assert(this.cwd.endsWith('docs'), '必须在 docs 目录下运行知识库同步')
    this.srcPath = path.join(this.cwd, 'src')
    this.mds = glob.sync('**/*.md', {
      cwd: this.srcPath,
      ignore: [
        'node_modules/**',
        'contributing.md',
        'guide/basic/config-kmi.md',
      ],
    })
  }

  async run() {
    this.db = await JSONFilePreset<Data>('docs.json', { docs: {} })
    await this.db.read()

    for (const md of this.mds) {
      await this.sync(md)
    }

    await this.db.write()
  }

  private async create(title: string, parentViewStrId: string) {
    const res = await request.post(
      'https://automate.corp.kuaishou.com/res/task/run?taskId=399&token=F8j8TR32ZfAFS7BDRGG63B5DZe',
      {
        docName: title,
        operationType: 'create',
        parentViewStrId,
      },
    )

    const docId = res?.data?.data?.docId

    const openDocUrl = res?.data?.data?.openDocUrl

    return {
      docId,
      openDocUrl,
    }
  }

  private async update({ docId, content }: { docId: string; content: string }) {
    // TODO 更新文档
    await request.post(
      'https://automate.corp.kuaishou.com/res/task/run?taskId=399&token=F8j8TR32ZfAFS7BDRGG63B5DZe',
      {
        docId,
        operationType: 'update',
        editContent: content,
      },
    )
  }

  private getTitle(content: string): string | null {
    const markdownit = new MarkdownIt()
    const tokens = markdownit.parse(content, {})

    // 优先查找 h1 标题，其次查找 h2 标题
    for (const headingLevel of ['h1', 'h2', 'h3']) {
      for (let i = 0; i < tokens.length - 1; i++) {
        const token = tokens[i]
        if (token.type === 'heading_open' && token.tag === headingLevel) {
          const headingToken = tokens[i + 1]
          if (headingToken && headingToken.type === 'inline') {
            return headingToken.content
          }
        }
      }
    }

    return null
  }

  async sync(md: string) {
    if (BlackList.includes(md)) return
    const mdPath = path.join(this.srcPath, md)
    const content = fs.readFileSync(mdPath, 'utf-8')
    const title = this.getTitle(content)
    if (!title) {
      return
    }
    assert(title, `无法获取 ${md} 的标题`)
    let doc = this.db.data.docs[md]
    // 如果 md 不存在
    if (!doc) {
      const { docId, openDocUrl } = await this.create(
        title,
        this.parentViewStrId,
      )
      doc = {
        docId,
        openDocUrl,
        docType: 'md',
        mdPath: md,
        title,
      }

      this.db.data.docs[md] = doc
    }

    await this.update({
      docId: doc.docId,
      content,
    })
  }
}

new SyncDocs().run()
