{
  "name": "@e2e/{{{ name }}}",
  "private": true,
  "scripts": {
    "dev": "PORT={{{ port }}} kmi dev",
    "build": "kmi build",
    "setup": "kmi setup",
    "e2e": "playwright test",
    "preview": "kmi preview",
    "test:e2e": "start-test dev :{{{ port }}}/__kmi/api/status e2e",
    "test:open": "playwright codegen localhost:{{{ port }}}"
  },
  "dependencies": {
    "@kmijs/kmijs": "workspace:*"
  }
}
