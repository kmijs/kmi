import { describe, expect, test } from 'vitest'
import { stringify } from './stringify'

// 单元测试
describe('stringify', () => {
  test('基本类型序列化', () => {
    expect(stringify('test')).toBe('"test"')
    expect(stringify(123)).toBe('123')
    expect(stringify(true)).toBe('true')
    expect(stringify(null)).toBe('null')
  })

  test('对象序列化', () => {
    const obj = { a: 1, b: 'test' }
    expect(stringify(obj)).toBe('{"a":1,"b":"test"}')
  })

  test('数组序列化', () => {
    const arr = [1, 'test', { a: 1 }]
    expect(stringify(arr)).toBe('[1,"test",{"a":1}]')
  })

  test('循环引用处理', () => {
    const obj: any = { a: 1 }
    obj.self = obj
    expect(stringify(obj)).toBe('{"a":1,"self":"[Circular ~]"}')
  })

  test('嵌套循环引用处理', () => {
    const obj: any = { a: 1 }
    const child = { parent: obj }
    obj.child = child
    expect(stringify(obj)).toBe('{"a":1,"child":{"parent":"[Circular ~]"}}')
  })

  test('自定义replacer', () => {
    const obj = { a: 1, b: 2 }
    const replacer = (key: string, value: any) => {
      if (typeof value === 'number') return value * 2
      return value
    }
    expect(stringify(obj, replacer)).toBe('{"a":2,"b":4}')
  })

  test('自定义cycleReplacer', () => {
    const obj: any = { a: 1 }
    obj.self = obj
    const cycleReplacer = () => '[CYCLE]'
    expect(stringify(obj, undefined, undefined, cycleReplacer)).toBe(
      '{"a":1,"self":"[CYCLE]"}',
    )
  })

  test('格式化输出', () => {
    const obj = { a: 1 }
    expect(stringify(obj, undefined, 2)).toBe('{\n  "a": 1\n}')
  })
})
