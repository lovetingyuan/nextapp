'use server'

import { db } from '@/db'
import { verifySession } from '@/lib/dal'
import { songs } from '@/db/schema/music'
import { uploadMusicCover, uploadMusicMp3 } from './r2'
import type { FormValueType } from '@/app/music/app/add-song/_components/types'
import { and, eq, isNotNull, desc } from 'drizzle-orm'

export async function $getAllSongs() {
  const { userId } = await verifySession()
  const list = await db.select().from(songs).where(eq(songs.userId, userId))
  return list
}

export async function $getPlayListSongs() {}

export async function $getFavoriteSongs() {
  const { userId } = await verifySession()
  const list = await db
    .select()
    .from(songs)
    .where(and(eq(songs.userId, userId), eq(songs.rating, 10)))
  return list
}

export async function $getRecentPlayedSongs(limit = 10) {
  const { userId } = await verifySession()
  const list = await db
    .select()
    .from(songs)
    .where(and(eq(songs.userId, userId), isNotNull(songs.lastPlayedAt)))
    .orderBy(desc(songs.lastPlayedAt))
    .limit(limit)
  return list
}

export async function $addSong(song: FormValueType & { duration: number }) {
  const { userId } = await verifySession()
  if (!song.audioFile && !song.thirdUrl) {
    throw new Error('请选择文件或输入网址')
  }
  const dbItem = {
    userId,
    title: song.title,
    artist: song.artist ?? '',
    album: song.album ?? '',
    duration: song.duration,
    rating: song.rating,
    composer: song.composer ?? '',
    lyricist: song.lyricist ?? '',
    description: song.description ?? '',
    fileName: '',
    cover: '',
    publishDate: song.year ?? '',
  }
  if (song.audioFile) {
    const { error, fileKey } = await uploadMusicMp3(song.audioFile, song.title + '.mp3')
    if (error === null) {
      dbItem.fileName = fileKey
    } else {
      throw new Error(error)
    }
  }
  if (song.thirdUrl) {
    // TODO: 下载第三方音乐
    throw new Error('暂未支持第三方音乐')
  }
  if (song.cover) {
    const { error, fileKey } = await uploadMusicCover(
      song.cover,
      song.title + '_' + song.cover.name
    )
    if (error !== null) {
      console.log(43423, error)
      throw new Error(error)
    } else {
      dbItem.cover = fileKey
    }
  }
  // add song to db
  const [{ id }] = await db.insert(songs).values(dbItem).returning()
  // add song to r2
  return id
}

export async function $removeSong(songId: number) {
  const { userId } = await verifySession()
  await db.delete(songs).where(and(eq(songs.id, songId), eq(songs.userId, userId)))
  return true
}

export async function $updateSong() {}

export async function $updatePlayTime(songId: number) {
  const { userId } = await verifySession()
  await db
    .update(songs)
    .set({ lastPlayedAt: new Date() })
    .where(and(eq(songs.id, songId), eq(songs.userId, userId)))
  return true
}
