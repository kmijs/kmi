import { pathe } from '@kmijs/shared'
import { createSnapshotSerializer } from 'path-serializer'
import { expect } from 'vitest'

// @ts-ignore
process.env.KMI_CLI_TEST = true
process.env.KMI_NO_PLUGINS = 'none'
process.env.KMI_REMOTE_PLUGINS = 'none'

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: pathe.join(__dirname, '..'),
  }),
)
