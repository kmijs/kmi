import { copyFileSync, statSync } from 'node:fs'
import { dirname } from 'node:path'
import type prompts from 'prompts'
import fsExtra from '../../compiled/fs-extra'
import Generator, { type IGeneratorOpts } from '../Generator/Generator'

interface IBaseGeneratorOpts extends Partial<Omit<IGeneratorOpts, 'args'>> {
  path: string
  target: string
  data?: any
  questions?: prompts.PromptObject[]
}

export default class BaseGenerator extends Generator {
  path: string
  target: string
  data: any
  questions: prompts.PromptObject[]

  constructor({
    path,
    target,
    data,
    questions,
    baseDir,
    slient,
  }: IBaseGeneratorOpts) {
    super({ baseDir: baseDir || target, args: data, slient })
    this.path = path
    this.target = target
    this.data = data
    this.questions = questions || []
  }

  prompting(): prompts.PromptObject[] {
    return this.questions
  }

  async writing(): Promise<void> {
    const context = {
      ...this.data,
      ...this.prompts,
    }
    if (statSync(this.path).isDirectory()) {
      this.copyDirectory({
        context,
        path: this.path,
        target: this.target,
      })
    } else {
      if (this.path.endsWith('.tpl')) {
        this.copyTpl({
          templatePath: this.path,
          target: this.target,
          context,
        })
      } else {
        const absTarget = this.target
        fsExtra.mkdirpSync(dirname(absTarget))
        copyFileSync(this.path, absTarget)
      }
    }
  }
}
