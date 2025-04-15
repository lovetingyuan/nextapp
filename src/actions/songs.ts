'use server'

import { db } from '@/db'
import { verifySession } from '@/lib/dal'
import { playlists, playlistSongs, songs } from '@/db/schema/music'
import { uploadMusicCover, uploadMusicMp3 } from './r2'
import type { FormValueType } from '@/app/music/app/add-song/_components/types'
import { and, eq, isNotNull, desc, asc, inArray, max } from 'drizzle-orm'

export async function $getAllSongs() {
  const { userId } = await verifySession()
  const list = await db.select().from(songs).where(eq(songs.userId, userId))
  return list
}

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
      throw new Error(error)
    } else {
      dbItem.cover = fileKey
    }
  }
  let maxPositions: { playlistId: number; maxPosition: number | null }[] = []
  if (song.playlists?.length) {
    maxPositions = await db
      .select({
        playlistId: playlistSongs.playlistId,
        maxPosition: max(playlistSongs.position),
      })
      .from(playlistSongs)
      .where(inArray(playlistSongs.playlistId, song.playlists))
      .groupBy(playlistSongs.playlistId)
  }
  const maxPositionMap = new Map<number, number>()
  for (const { playlistId, maxPosition } of maxPositions) {
    maxPositionMap.set(playlistId, (maxPosition ?? 0) + 1)
  }
  const id = await db.transaction(async tx => {
    const [{ id: songId }] = await tx.insert(songs).values(dbItem).returning()
    if (song.playlists?.length) {
      const position = maxPositionMap.get(song.playlists[0]) ?? 0
      await tx
        .insert(playlistSongs)
        .values(song.playlists.map(id => ({ songId, playlistId: id, position })))
    }
    return songId
  })
  return id
}

export async function $removeSong(songId: number) {
  const { userId } = await verifySession()
  await db.delete(songs).where(and(eq(songs.id, songId), eq(songs.userId, userId)))
  return true
}

export async function $updatePlayTime(songId: number) {
  const { userId } = await verifySession()
  await db
    .update(songs)
    .set({ lastPlayedAt: new Date() })
    .where(and(eq(songs.id, songId), eq(songs.userId, userId)))
  return true
}

// 获取歌曲所属歌单
export async function $getPlayListBySong(songId: number) {
  const { userId } = await verifySession()
  const song = await db
    .select()
    .from(songs)
    .where(and(eq(songs.id, songId), eq(songs.userId, userId)))
  if (!song) {
    throw new Error('歌曲不存在')
  }
  const playListIds = await db
    .select({ id: playlistSongs.playlistId })
    .from(playlistSongs)
    .where(eq(playlistSongs.songId, songId))
  return playListIds.map(v => v.id)
}

// 更新歌曲所属歌单
export async function $updateSongPlayList(songId: number, playListIds: number[]) {
  const { userId } = await verifySession()
  const song = await db
    .select()
    .from(songs)
    .where(and(eq(songs.id, songId), eq(songs.userId, userId)))
  if (!song) {
    throw new Error('歌曲不存在')
  }
  const newPlayListIds: number[] = []
  const removePlayListIds: number[] = []
  const currentPlayListIds = await db
    .select({ id: playlistSongs.playlistId })
    .from(playlistSongs)
    .where(eq(playlistSongs.songId, songId))
  // currentPlayListIds, playListIds,
  // 2 4 5 6， 1 2 3 4， new 1,3, remove 5, 6
  for (const id of playListIds) {
    if (!currentPlayListIds.find(v => v.id === id)) {
      newPlayListIds.push(id)
    }
  }
  for (const { id } of currentPlayListIds) {
    if (!playListIds.find(v => v === id)) {
      removePlayListIds.push(id)
    }
  }
  const maxPositions = await db
    .select({
      playlistId: playlistSongs.playlistId,
      maxPosition: max(playlistSongs.position),
    })
    .from(playlistSongs)
    .where(inArray(playlistSongs.playlistId, newPlayListIds))
    .groupBy(playlistSongs.playlistId)
  const maxPositionMap = new Map<number, number>()
  for (const { playlistId, maxPosition } of maxPositions) {
    maxPositionMap.set(playlistId, (maxPosition ?? 0) + 1)
  }
  await db.transaction(async tx => {
    if (removePlayListIds.length) {
      await tx
        .delete(playlistSongs)
        .where(
          and(
            eq(playlistSongs.songId, songId),
            inArray(playlistSongs.playlistId, removePlayListIds)
          )
        )
    }
    if (newPlayListIds.length) {
      await tx.insert(playlistSongs).values(
        newPlayListIds.map(id => ({
          songId,
          playlistId: id,
          addedAt: new Date(),
          position: maxPositionMap.get(id) ?? 0,
        }))
      )
    }
  })
  return true
}

export async function $getPlayListSongs(playListId: number) {
  const { userId } = await verifySession()
  const playList = await db
    .select()
    .from(playlists)
    .where(and(eq(playlists.id, playListId), eq(playlists.userId, userId)))
  if (!playList) {
    throw new Error('歌单不存在')
  }
  const songsInPlaylist = await db.query.playlistSongs.findMany({
    where: eq(playlistSongs.playlistId, playListId),
    with: {
      song: true,
    },
    orderBy: [asc(playlistSongs.position)],
  })
  return songsInPlaylist.map(v => v.song)
}
