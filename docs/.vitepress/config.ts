import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'KMI',
  description: '为 Umi.js 提供极速构建体验',
  cleanUrls: true,
  head: [['link', { rel: 'icon', href: '/kmi.png' }]],
  themeConfig: {
    logo: '/kmi.png',
    siteTitle: 'KMI',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/kmijs/kmi' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kmijs/kmi' }
    ],
    search: { provider: 'local' },
    editLink: {
      pattern: 'https://github.com/kmijs/kmi/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    sidebar: {
      '/guide/': [{ text: 'Guide', items: [{ text: 'Guide', link: '/guide/' }] }],
      '/config/': [{ text: 'Config', link: '/config/' }],
      '/api/': [{ text: 'API', link: '/api/' }]
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Kmi'
    }
  }
});
