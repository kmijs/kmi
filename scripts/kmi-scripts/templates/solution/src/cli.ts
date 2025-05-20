import { dirname } from 'node:path'
import { run } from '@kmijs/kmijs'

process.env.KMI_SOLUTION_DIR = dirname(require.resolve('../package.json'))

run({
  presets: [require.resolve('./preset')],
}).catch((e) => {
  console.error(e)
  process.exit(1)
})
