export const LessLoaderOptionsSchema = {
  type: 'object',
  properties: {
    lessOptions: {
      anyOf: [
        {
          type: 'object',
          additionalProperties: true,
          description: 'Less 配置',
          properties: {
            modifyVars: {
              type: 'object',
              patternProperties: {
                '.*': { type: 'string' },
              },
              nullable: true,
            },
            globalVars: {
              type: 'object',
              patternProperties: {
                '.*': { type: 'string' },
              },
              nullable: true,
            },
            math: {
              type: ['string', 'number', 'null'],
              enum: [
                'always',
                'strict',
                'parens-division',
                'parens',
                'strict-legacy',
                null,
              ],
            },
            plugins: {
              type: 'array',
              items: {
                anyOf: [
                  { type: 'string' },
                  {
                    type: 'array',
                    items: [
                      { type: 'string' },
                      { type: 'object', additionalProperties: true },
                    ],
                    minItems: 2,
                    maxItems: 2,
                  },
                ],
              },
              nullable: true,
            },
          },
        },
        {
          instanceof: 'Function',
          description: 'Less 配置函数',
        },
      ],
    },
    sourceMap: {
      description: '启用/禁用 source maps 的生成。',
      type: 'boolean',
      nullable: true,
    },
    additionalData: {
      description: '在实际入口文件前/后追加 `Less` 代码。',
      anyOf: [
        {
          type: 'string',
        },
        {
          instanceof: 'Function',
        },
      ],
    },
  },
  additionalProperties: false,
}
