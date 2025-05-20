{
  "name": "@kmijs/preset-{{{ name }}}",
  "version": "{{{ version }}}",
  "description": "{{{ description }}}",
  "repository": {
    "type": "git",
    "url": "https://git.corp.kuaishou.com/kmijs/core/-/tree/master/presets/preset-{{{ name }}}"
  },
  "files": [
    "compiled",
    "dist"
  ],
  "scripts": {
    "dev": "father dev",
    "build": "father build",
    "build:deps": "kmi-scripts bundleDeps",
    "prepublishOnly": "pnpm build"
  },
  "types": "./dist/index.d.ts",
  "main": "./dist/index.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "keywords": [],
  "authors": [
    "{{{ gitEmail }}}"
  ],
  "license": "ISC",
  "publishConfig": {
    "registry": "https://npm.corp.kuaishou.com"
  },
  "devDependencies": {
    "@kmijs/kmijs": "workspace:*",
    "@kmijs/test-utils": "workspace:*"
  },
  "engines": {
    "node": ">=16.10.0"
  }
}
