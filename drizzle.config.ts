import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL || !process.env.DATABASE_DEV_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/schema/index.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_URL
        : process.env.DATABASE_DEV_URL,
  },
})
