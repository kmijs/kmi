import { expect, test } from 'vitest'
import { resolveDefine } from './resolveDefine'

test('normal', () => {
  expect(
    resolveDefine({
      userConfig: {
        define: { foo: 'bar' },
      },
      bundler: 'rspack',
    } as any),
  ).toEqual({
    foo: '"bar"',
    'process.env': {
      BASE_URL: '"/"',
      KMI_ENV: '"local"',
      NODE_ENV: '"test"',
      // PUBLIC_PATH: '"/"',
    },
    'process.env.SSR_MANIFEST': 'process.env.SSR_MANIFEST',
    'process.env.KMI_BUNDLER': '"rspack"',
  })
})

test('env variables', () => {
  process.env.UMI_APP_FOO = 'BAR'
  process.env.KMI_APP_DEMO = 'DEMO'
  process.env.APP_FOO = 'BAR'
  expect(
    resolveDefine({
      userConfig: {
        define: {},
      },
      bundler: 'rspack',
      isDev: false,
      isProd: true,
    } as any),
  ).toEqual({
    'import.meta.env.DEV': 'false',
    'import.meta.env.PROD': 'true',
    'process.env': {
      NODE_ENV: '"test"',
      BASE_URL: '"/"',
      KMI_ENV: '"local"',
      UMI_APP_FOO: '"BAR"',
      KMI_APP_DEMO: '"DEMO"',
      // PUBLIC_PATH: '"/"',
    },
    'process.env.SSR_MANIFEST': 'process.env.SSR_MANIFEST',
    'process.env.KMI_BUNDLER': '"rspack"',
  })
})

test('should get SOCKET_SERVER if SOCKET_SERVER exists', () => {
  process.env.SOCKET_SERVER = 'socket.server'
  expect(
    resolveDefine({
      userConfig: {
        define: {},
      },
      host: 'test.host',
    } as any)['process.env'].SOCKET_SERVER,
  ).toEqual('"socket.server"')
})

test('should get SOCKET_SERVER if HOST exists', () => {
  delete process.env.SOCKET_SERVER
  expect(
    resolveDefine({
      userConfig: {
        define: {},
      },
      host: 'test.host',
    } as any)['process.env'].SOCKET_SERVER,
  ).toEqual('"http://test.host:8000"')
})

test('should get https SOCKET_SERVER if exists', () => {
  delete process.env.SOCKET_SERVER
  expect(
    resolveDefine({
      userConfig: {
        define: {},
        https: false,
      },
      host: 'test.host',
      port: 6666,
    } as any)['process.env'].SOCKET_SERVER,
  ).toEqual('"http://test.host:6666"')
})
