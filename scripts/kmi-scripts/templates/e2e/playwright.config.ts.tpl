import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import baseConfig from '../../playwright.config.base'

const config: PlaywrightTestConfig = {
  ...baseConfig,
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:{{{ port }}}',
      },
    },
  ],
}

export default config
