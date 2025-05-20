{
  "name": "@kmijs/{{{ name }}}",
  "version": "{{{ version }}}",
  "description": "{{{ description }}}",
  "repository": {
    "type": "git",
    "url": "https://github.com/kmijs/kmi/-/tree/main/packages/{{{ name }}}"
  },
  "files": [
    "compiled",
    "dist"
  ],
  "scripts": {
    "dev": "father dev --no-clean",
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
  "dependencies": {
  },
  "engines": {
    "node": ">=16.10.0"
  }
}
