import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import cp from 'node:child_process'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const pkg = require('./package.json')

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

const shortHash8 = cp.execSync('git rev-parse --short=8 HEAD').toString().trim()

const buildDate = new Date().toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
    NEXT_PUBLIC_APP_VERSION: pkg.version + '@' + shortHash8,
  },
  images: {
    remotePatterns: [{ hostname: 'github.com' }, { hostname: 'music-cover.tingyuan.in' }],
  },
  serverExternalPackages: ['module', 'resend'],
  experimental: {
    // useCache: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
    reactCompiler: true,
    // nodeMiddleware: true,
  },
}

export default nextConfig
