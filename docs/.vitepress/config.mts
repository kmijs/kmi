import { defineConfig } from 'vitepress';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import lightbox from 'vitepress-plugin-lightbox'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  lang: 'zh-CN',
  title: 'KMI',
  description: '为 Umi.js 提供极速构建体验',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  base: '/kmi/',
  srcDir: './docs',
  head: [['link', { rel: 'icon', href: '/kmi/kmi.png' }]],
  themeConfig: {
    logo: '/kmi.png',
    siteTitle: 'KMI',
    nav: [
      { text: '指南', link: '/guide/quick-start' },
      { text: '配置', link: '/config/config' },
      { text: 'API', link: '/api' },
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
      '/guide/': [{
        text: '指南', items: [
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '使用 Rspack 构建', link: '/guide/rspack' },
          { text: '配置 bundler', link: '/guide/config-bundler' },
          { text: '配置 Swc', link: '/guide/config-swc' },
          { text: '配置 Babel', link: '/guide/config-babel' },
          { text: '配置 PostCSS', link: '/guide/config-postcss' },
          { text: '环境变量', link: '/guide/env-variables' },
          { text: '使用 HTTPS 进行本地开发', link: '/guide/https' },
        ]
      }],
      '/config/': [
        { text: '共享配置', link: '/config/config' },
        { text: 'bundler 配置', link: '/config/bundler-config' },
        { text: 'html 配置', link: '/config/html-config' },
      ],
      '/api': [
        {
          text: '插件 API', link: '/api'
        }
      ]
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Kmi'
    },
    outline: 'deep'
  },
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: 'INFO',
      detailsLabel: '详细信息',
    },
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config(md) {
      md.use(groupIconMdPlugin)
      md.use(lightbox)
    },
    // @ts-ignore
    codeTransformers: [transformerTwoslash({})],
  },
  vite: {
    plugins: [
      // @ts-expect-error
      groupIconVitePlugin()
    ],
  }
});
