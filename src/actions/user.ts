'use server'

import { db } from '@/db'
import { feedbacks } from '@/db/schema'
import { verifySession } from '@/lib/dal'

export async function $addFeedback(content: string) {
  const { userId } = await verifySession()
  await db.insert(feedbacks).values({
    content,
    userId,
  })
  return true
}
