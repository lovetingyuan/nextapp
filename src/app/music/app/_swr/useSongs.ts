import { $getMusicMp3TempUrl } from '@/actions/r2'
import {
  $getAllSongs,
  $getFavoriteSongs,
  $getRecentPlayedSongs,
  $removeSong,
  $addSong,
  $getPlayListBySong,
  $getPlayListSongs,
} from '@/actions/songs'
import { mutation } from '@/lib/utils'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export function useGetAllSongs() {
  const { data, error, isLoading, mutate } = useSWR('$/songs/getAll', $getAllSongs)
  return { data, error, isLoading, mutate }
}

export type SongListType = Awaited<ReturnType<typeof $getAllSongs>>

export function useAddSong() {
  const { trigger, error, isMutating } = useSWRMutation('$/songs/addSong', mutation($addSong), {
    revalidate: false,
  })
  return { trigger, error, isMutating }
}

export function useRemoveSong() {
  const { trigger, error, isMutating } = useSWRMutation('$/songs/removeSong', mutation($removeSong))
  return { trigger, error, isMutating }
}

export function useSongAudioUrl(fileKey?: string) {
  const { data, error, isLoading } = useSWR(
    fileKey ? [`$/r2/getMusicMp3TempUrl/`, fileKey] : null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, f]) => $getMusicMp3TempUrl(f),
    {
      dedupingInterval: 50 * 60 * 1000,
    }
  )
  return { data, error, isLoading }
}

export function useGetRecentPlayedSongs() {
  const { data, error, isLoading } = useSWR('$/songs/getRecentPlayedSongs', $getRecentPlayedSongs)
  return { data, error, isLoading }
}

export function useGetFavoriteSongs() {
  const { data, error, isLoading } = useSWR('$/songs/getFavoriteSongs', $getFavoriteSongs)
  return { data, error, isLoading }
}

export function useGetPlayListIdsBySong(songId?: number) {
  const { data, error, isLoading, isValidating } = useSWR(
    songId ? [`$/songs/getPlayListIdsBySong/`, songId] : null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, songId]) => $getPlayListBySong(songId)
  )
  return { data, error, isLoading, isValidating }
}

export function useGetPlayListSongs(playListId?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    Number.isInteger(playListId) ? [`$/songs/getPlayListSongs/`, playListId] : null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, playListId]) => $getPlayListSongs(playListId as number)
  )
  return { data, error, isLoading, mutate }
}
