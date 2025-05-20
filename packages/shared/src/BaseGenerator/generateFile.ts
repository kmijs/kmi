import type prompts from 'prompts'
import BaseGenerator from './BaseGenerator'

const generateFile = async ({
  path,
  target,
  baseDir,
  data,
  questions,
}: {
  path: string
  target: string
  baseDir?: string
  data?: any
  questions?: prompts.PromptObject[]
}): Promise<void> => {
  const generator = new BaseGenerator({
    path,
    target,
    baseDir,
    data,
    questions,
  })

  await generator.run()
}

export default generateFile
