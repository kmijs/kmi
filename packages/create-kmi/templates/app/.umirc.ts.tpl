import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: '{{{ npmClient }}}',
  presets: ['@kmijs/preset-bundler'],
  rspack: {}
});
