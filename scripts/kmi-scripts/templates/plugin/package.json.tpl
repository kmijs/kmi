{
  "name": "@kmijs/plugin-{{{ name }}}",
  "version": "{{{ version }}}",
  "description": "{{{ description }}}",
  "repository": {
    "type": "git",
    "url": "https://github.com/kmijs/kmi/-/tree/main/plugins/plugin-{{{ name }}}"
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
     "access": "public"
  },
  "devDependencies": {
    "@kmijs/kmijs": "workspace:*",
    "@kmijs/test-utils": "workspace:*"
  },
  "engines": {
    "node": ">=16.10.0"
  }
}
