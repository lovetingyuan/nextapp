import 'server-only'

import { headers } from 'next/headers'
import { auth } from './auth'
import { cache } from 'react'

export const verifySession = cache(async () => {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session?.session?.userId) {
    throw new Error('未登录')
  }

  return { userId: session.session.userId }
})
