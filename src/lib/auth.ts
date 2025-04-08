import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db' // your drizzle instance
import { nextCookies } from 'better-auth/next-js'
import { EmailTemplate } from '@/components/email-template'

import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('env RESEND_API_KEY is missing')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
    // schema:
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: 'Welcome <hello@tingyuan.in>',
        to: [user.email],
        subject: 'Welcome to music',
        react: EmailTemplate({ firstName: user.name, url }),
      })
      if (error) {
        console.error(error)
        return Promise.reject(error)
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // },
  },
  plugins: [nextCookies()],
})
