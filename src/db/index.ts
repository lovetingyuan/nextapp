import { drizzle } from 'drizzle-orm/neon-http'
// import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL || !process.env.DATABASE_DEV_URL) {
  throw new Error('POSTGRES_URL environment variable is not set')
}

// export const client = postgres(process.env.POSTGRES_URL)
// export const db = drizzle(process.env.DATABASE_URL, { schema })
import { neon } from '@neondatabase/serverless'

// config({ path: ".env" }); // or .env.local

const client = neon(
  process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_DEV_URL
)

export const db = drizzle({ client, casing: 'snake_case', schema })
