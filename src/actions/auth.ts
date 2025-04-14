'use server'

import { auth } from '@/lib/auth'
// import { authClient } from '@/lib/auth-client'
// import { headers } from 'next/headers'
// import { redirect } from 'next/navigation'

export const resendEmail = async (email: string) => {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // })
  // if (!session) {
  //   redirect('/music/sign-in')
  // }
  await auth.api.sendVerificationEmail({
    body: {
      email: email,
      callbackURL: '/music/app', // The redirect URL after verification
    },
  })
  return true
  // return authClient.sendVerificationEmail({
  //   email: session.user.email,
  //   callbackURL: '/', // The redirect URL after verification
  // })
}
