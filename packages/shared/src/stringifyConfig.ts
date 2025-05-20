export function stringifyConfig(
  config: unknown,
  { verbose = false, configPrefix = 'config', removeApiProperty = false } = {},
) {
  const { stringify } = require('../compiled/javascript-stringify')
  return stringify(
    config,
    (value: any, indent: number, stringify: any) => {
      // improve plugin output
      if (value?.__pluginName) {
        const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */\n`
        const constructorExpression = value.__pluginPath
          ? // The path is stringified to ensure special characters are escaped
            // (such as the backslashes in Windows-style paths).
            `(require(${stringify(value.__pluginPath)}))`
          : value.__pluginConstructorName

        if (constructorExpression) {
          // 移除 kmi api 因为很大
          const [pluginArgs] = value.__pluginArgs || []
          if (removeApiProperty && pluginArgs?.api) {
            pluginArgs.api = 'PluginAPI {/* kmi api */}'
          }
          // get correct indentation for args by stringifying the args array and
          // discarding the square brackets.
          const args = stringify(value.__pluginArgs).slice(1, -1)
          return `${prefix}new ${constructorExpression}(${args})`
        }
        return (
          prefix +
          stringify(
            value.__pluginArgs?.length ? { args: value.__pluginArgs } : {},
          )
        )
      }

      // improve rule/use output
      if (value?.__ruleNames) {
        const ruleTypes = value.__ruleTypes
        const prefix = `/* ${configPrefix}.module${value.__ruleNames
          .map(
            (r: any, index: number) =>
              `.${ruleTypes ? ruleTypes[index] : 'rule'}('${r}')`,
          )
          .join('')}${value.__useName ? `.use('${value.__useName}')` : ''} */\n`
        return prefix + stringify(value)
      }

      if (value?.__expression) {
        return value.__expression
      }

      // shorten long functions
      if (typeof value === 'function') {
        if (!verbose && value.toString().length > 100) {
          return 'function () { /* omitted long function */ }'
        }
      }

      return stringify(value)
    },
    2,
  )
}
