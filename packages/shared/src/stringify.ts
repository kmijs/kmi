type ReplacerFn = (key: string, value: any) => any
type CycleReplacerFn = (key: string, value: any) => string

/**
 * 与 JSON.stringify 类似，但不会引发循环引用。
 * @param obj - 要序列化的对象
 * @param replacer - 替换函数
 * @param spaces - 空格数或字符串
 * @param cycleReplacer - 循环引用替换函数
 * @returns 序列化后的字符串
 */
export function stringify(
  obj: any,
  replacer?: ReplacerFn,
  spaces?: number | string,
  cycleReplacer?: CycleReplacerFn,
): string {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer?: ReplacerFn, cycleReplacer?: CycleReplacerFn) {
  const stack: any[] = []
  const keys: string[] = []

  if (!cycleReplacer) {
    cycleReplacer = (key: string, value: any): string => {
      if (stack[0] === value) return '[Circular ~]'
      return `[Circular ~.${keys.slice(0, stack.indexOf(value)).join('.')}]`
    }
  }

  return function (this: any, key: string, value: any) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this)
      if (~thisPos) {
        stack.splice(thisPos + 1)
        keys.splice(thisPos, Number.POSITIVE_INFINITY, key)
      } else {
        stack.push(this)
        keys.push(key)
      }

      if (~stack.indexOf(value)) {
        value = cycleReplacer!.call(this, key, value)
      }
    } else {
      stack.push(value)
    }

    return replacer ? replacer.call(this, key, value) : value
  }
}
