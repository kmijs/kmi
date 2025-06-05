import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import './style.css'
// @ts-expect-error
import ApiMeta from './components/ApiMeta.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('ApiMeta', ApiMeta)
  },
} satisfies Theme
