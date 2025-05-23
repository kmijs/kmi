export default {
  rspack: {},
  model: {},
  qiankun: {
    slave: {},
  },
  base: 'manual-slave',
  routes: [
    { path: '/home', component: 'home' },
    { path: '/count', component: 'count' },
    { path: '/nav', component: 'nav' },
    { path: '/basename', component: 'basename' },
  ],
  hash: false,
  presets: ['@kmijs/preset-bundler'],
}
