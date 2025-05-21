import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'bundlerChain',
    config: {
      schema({ zod }) {
        return zod.function()
      },
    },
    enableBy: api.EnableBy.config,
  })

  api.bundlerChain(async (memo, args) => {
    const { bundlerChain } = api.config
    const result = await bundlerChain(memo, args)
    return result || memo
  })
}
