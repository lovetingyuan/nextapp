import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// export const runtime = 'edge'

const handler = toNextJsHandler(auth.handler)
export const { GET, POST } = handler
