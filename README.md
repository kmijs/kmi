# Kmi
> Based on Umi to provide Rspack support and other best practices

## Introduction

Kmi provides [Rspack](https://www.rspack.dev/) support and modern web development best practices for [UmiJS](https://umijs.org/). It aims to provide faster and more efficient development experience with better build performance.

## Features
- **Rspack Integration**: Uses Rspack as the build tool, providing several times faster build speed compared to Webpack
- **Smooth Fallback**: Provides support for traditional toolchains like terser and postcss to ensure project stability. New projects can seamlessly use next-generation toolchains like lightningcss and swc for performance improvements
- **Easy to Use**: Easily switch between Rspack/Webpack build modes through configuration toggles, with quick fallback when issues arise
- **Unified Interface**: Provides unified configuration interface that abstracts away differences in underlying build tools, reducing learning costs

## Quick Start

### Installation

```bash
# Create a new Umi project
npx create-umi@latest my-rspack-app
cd my-rspack-app

# Install dependencies
pnpm install
```

### Configuration

Create or modify the `.umirc.ts` file in the project root directory:

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // Configure Kmi preset
  presets: ['@kmijs/preset-bundler'],
  // Enable Rspack
  rspack: {},
  // Other Umi configurations...
  routes: [
    { path: '/', component: 'index' },
    { path: '/users', component: 'users' },
  ],
});
```

### Custom Build Configuration

- Modify Webpack(Rspack) configuration object via bundler option

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // Configure Kmi preset
  presets: ['@kmijs/preset-bundler'],
  // Enable Rspack
  rspack: {},
  // Modify Webpack(Rspack) configuration object via bundler option
  bundler: {
    resolve: {
      // Merged with built-in resolve.extensions
      extensions: ['.web.tsx'],
    }
  }
});
```
- Modify Webpack(Rspack) configuration in function form
```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // Configure Kmi preset
  presets: ['@kmijs/preset-bundler'],
  // Enable Rspack
  rspack: {},
  // Modify Webpack(Rspack) configuration in function form
  async bundler (config, { isProd }) {
    // This is just an example
    if (isProd) {
      chain.devtool('source-map');
    }
    const { default: ESLintPlugin } = await import('eslint-webpack-plugin');
    config.plugins?.push(new ESLintPlugin());
    return config
  }
});
```

- Modify Webpack(Rspack) configuration using chain programming

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // Configure Kmi preset
  presets: ['@kmijs/preset-bundler'],
  // Enable Rspack
  rspack: {},
  // Through bundler you can get plugins that are compatible with both Webpack and Rspack
  bundlerChain (config, { bundler }) {
    // This is just an example
    config.plugin('custom-define').use(bundler.DefinePlugin, [
      {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    ]);
    return config;
  }
});
```

### Development

```bash
# Start the development server
pnpm dev
```

### Production Build

```bash
# Build the application
pnpm build
```

## License

[MIT](./LICENSE)
