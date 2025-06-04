import * as path from 'node:path';
import { defineConfig } from 'vitepress';

export default defineConfig({
  srcDir: path.join(__dirname, '../docs'),
  title: 'KMI',
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
    sidebar: {
      '/guide/': [{ text: 'Guide', items: [{ text: 'Guide', link: '/guide/' }] }],
      '/config/': [{ text: 'Config', link: '/config/' }],
      '/api/': [{ text: 'API', link: '/api/' }]
    }
  }
});
