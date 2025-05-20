{
  "name": "@kmijs/{{{ name }}}",
  "version": "{{{ version }}}",
  "description": "{{{ description }}}",
  "repository": {
    "type": "git",
    "url": "https://git.corp.kuaishou.com/kmijs/core/-/tree/master/solutions/{{{ name }}}"
  },
  "bin": {
    "kmi": "./bin/kmi.js"
  },
  "files": [
    "compiled",
    "dist",
    "bin",
    "plugin-utils.d.ts",
    "plugin-utils.js",
     "html.js",
    "html.d.ts"
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
    "./package.json": "./package.json",
    "./plugin-utils": {
      "types": "./plugin-utils.d.ts",
      "default": "./plugin-utils.js"
    },
    "./html": {
      "types": "./html.d.ts",
      "default": "./html.js"
    }
  },
  "typesVersions": {
    "*": {
      "plugin-utils": [
        "./plugin-utils.d.ts"
      ],
      "html": [
        "./html.d.ts"
      ]
    }
  },
  "keywords": [],
  "authors": [
    "{{{ gitEmail }}}"
  ],
  "license": "ISC",
  "publishConfig": {
    "registry": "https://npm.corp.kuaishou.com"
  },
  "dependencies": {
    "@kmijs/kmijs": "workspace:*"
  },
  "engines": {
    "node": ">=16.10.0"
  }
}
