import { defineConfig } from '@umijs/max'
import { createDependenciesRegExp } from '@kmijs/shared'

export default defineConfig({
  routes: [
    {
      title: 'site.title',
      path: '/',
      icon: 'ic:baseline-14mp',
      component: 'index',
      name: 'index',
    },
    {
      path: '/users',
      icon: 'local:rice',
      component: 'users',
      name: 'users',
      wrappers: ['@/wrappers/foo', '@/wrappers/bar'],
    },
    {
      path: '/accessAllow',
      icon: 'SmileFilled',
      component: 'users',
      name: 'Allow',
      access: 'canReadFoo',
    },
    {
      path: '/accessDeny',
      icon: 'SmileFilled',
      component: 'users',
      name: 'Deny',
      access: 'canReadBar',
    },
    { path: '/app1/*', icon: 'SmileFilled', name: 'app1', microApp: 'app1' },
    {
      path: '/data-flow',
      component: 'data-flow',
      name: 'data-flow',
      icon: 'SmileFilled',
      routes: [
        {
          path: '/data-flow/use-model',
          component: 'use-model',
          name: 'use-model',
          icon: 'SwitcherFilled',
        },
        {
          path: '/data-flow/dva',
          component: 'dva',
          name: 'dva',
          icon: 'TagFilled',
        },
      ],
    },
    {
      path: '/history',
      component: 'history',
    },
  ],
  antd: {
    // import: true,
    style: 'less',
    // dark: true,
  },
  initialState: {
    loading: '@/components/Loading',
  },
  access: {},
  dva: {},
  model: {},
  analytics: {
    baidu: 'test',
  },
  moment2dayjs: {},
  mock: {
    include: ['pages/**/_mock.ts'],
  },
  layout: {
    title: 'Ant Design Pro',
  },
  request: {},
  locale: {
    title: true,
  },
  tailwindcss: {},
  // lowImport: {},
  codeSplitting: {
    jsStrategy: 'granularChunks',
    jsStrategyOptions: {
      forceSplitting: {
        'lib-icon': createDependenciesRegExp('@ant-design/icons'),
        'lib-antd': createDependenciesRegExp('antd'),
        'lib-dayjs': createDependenciesRegExp('dayjs'),
      },
      override: {
        usedExports: true,
        minSize: 15000,
      },
    },
  },
  icons: {
    autoInstall: {},
    include: ['local:rice', 'local:logo/umi', 'ant-design:fire-twotone'],
  },
  presets: ['@kmijs/preset-bundler'],
  rspack: {},
  javascriptExportsPresence: false,
})
