'use server'

import { db } from '@/db'
import { playlists } from '@/db/schema'
import { verifySession } from '@/lib/dal'
import { eq, and, asc, max } from 'drizzle-orm'

export async function $addPlayList(payload: { title: string; description: string }) {
  const { userId } = await verifySession()

  const maxPosition = await db
    .select({ maxPosition: max(playlists.position) })
    .from(playlists)
    .where(eq(playlists.userId, userId))
  const newPosition = maxPosition[0] ? (maxPosition[0].maxPosition ?? 0) + 1 : 1
  const ret = await db
    .insert(playlists)
    .values({ ...payload, userId, position: newPosition })
    .returning()
  return ret[0]
}

export type PlayListType = Awaited<ReturnType<typeof $addPlayList>>

export async function $getAllPlayLists() {
  const { userId } = await verifySession()
  const ret = await db
    .select()
    .from(playlists)
    .where(eq(playlists.userId, userId))
    .orderBy(asc(playlists.position))
  return ret
}

export async function $deletePlayList(playListId: number) {
  const { userId } = await verifySession()
  await db.delete(playlists).where(and(eq(playlists.id, playListId), eq(playlists.userId, userId)))
  return true
}

export async function $updatePlayList(payload: {
  playListId: number
  title: string
  description: string
}) {
  const { userId } = await verifySession()

  const ret = await db
    .update(playlists)
    .set({
      ...payload,
      updatedAt: new Date(),
    })
    .where(and(eq(playlists.id, payload.playListId), eq(playlists.userId, userId)))
    .returning()
  return ret[0]
}

export async function $getThePlayList(playListId: number) {
  const { userId } = await verifySession()
  const ret = await db
    .select()
    .from(playlists)
    .where(and(eq(playlists.id, playListId), eq(playlists.userId, userId)))
  return ret[0]
}
