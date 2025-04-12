import 'server-only'

import { headers } from 'next/headers'
import { auth } from './auth'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session?.session?.userId) {
    redirect('/music/sign-in')
    // throw new Error('未登录')
  }

  return {
    userId: session.session.userId,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
  }
})
