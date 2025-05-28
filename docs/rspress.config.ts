import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'KMI',
  icon: '/kmi.png',
  logoText: 'KMI',
  logo: '/kmi.png',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/kmijs/kmi',
      },
    ],
  },
});
