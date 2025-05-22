import path from 'node:path'
import { createSnapshotSerializer } from 'path-serializer'
import { expect } from 'vitest'

// @ts-ignore
process.env.KMI_CLI_TEST = true
process.env.KMI_NO_PLUGINS = 'none'
process.env.KMI_REMOTE_PLUGINS = 'none'

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    workspace: path.join(__dirname, '..'),
    features: {
      replaceRoot: true,
      replaceWorkspace: true,
      replacePnpmInner: true,
      replaceTmpDir: true,
      replaceHomeDir: true,
      transformWin32Path: true,
      escapeDoubleQuotes: true,
      escapeEOL: true,
    },
  }),
)
