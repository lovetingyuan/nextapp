import { drizzle } from 'drizzle-orm/neon-serverless'
// import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL || !process.env.DATABASE_DEV_URL) {
  throw new Error('POSTGRES_URL environment variable is not set')
}

// export const client = postgres(process.env.POSTGRES_URL)
// export const db = drizzle(process.env.DATABASE_URL, { schema })
import { Pool } from '@neondatabase/serverless'

// config({ path: ".env" }); // or .env.local
const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_DEV_URL,
})

// const client = neon(
//   process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_DEV_URL
// )

export const db = drizzle({ client: pool, casing: 'snake_case', schema })
