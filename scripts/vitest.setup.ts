import { createSnapshotSerializer, pathe } from '@scripts/test-utils'
import { expect } from 'vitest'

// @ts-ignore
process.env.KMI_CLI_TEST = true
process.env.KMI_NO_PLUGINS = 'none'
process.env.KMI_REMOTE_PLUGINS = 'none'

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    workspace: pathe.join(__dirname, '..'),
  }),
)
