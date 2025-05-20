import type { NextConfig } from 'next'
import cp from 'node:child_process'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const pkg = require('./package.json')
const shortHash8 = cp.execSync('git rev-parse --short=8 HEAD').toString().trim()

const buildDate = new Date().toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})
const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
    NEXT_PUBLIC_APP_VERSION: pkg.version + '@' + shortHash8,
  },
  experimental: {
    reactCompiler: true,
    // nodeMiddleware: true,
  },
}

export default nextConfig

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()
