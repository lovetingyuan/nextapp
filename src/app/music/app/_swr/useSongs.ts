import { $getMusicMp3TempUrl } from '@/actions/r2'
import {
  $getAllSongs,
  $getFavoriteSongs,
  $getRecentPlayedSongs,
  $removeSong,
  $addSong,
  $updatePlayTime,
} from '@/actions/songs'
import { mutation } from '@/lib/utils'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export function useGetAllSongs() {
  const { data, error, isLoading, mutate } = useSWR('$/songs/getAll', $getAllSongs)
  return { data, error, isLoading, mutate }
}

export type SongListType = Awaited<ReturnType<typeof $getAllSongs>>

export function useGetPlayListSongs() {
  //
}

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

export function useUpdatePlayTime() {
  const { trigger } = useSWRMutation('$/songs/updatePlayTime', mutation($updatePlayTime))
  return trigger
}

export function useSongAudioUrl(fileKey?: string) {
  const { data, error, isLoading } = useSWR(
    fileKey ? [`$/r2/getMusicMp3TempUrl/`, fileKey] : null,
    $getMusicMp3TempUrl,
    {
      dedupingInterval: 59 * 60 * 1000,
    }
  )
  return { data, error, isLoading }
}

export function useGetSongAudioUrl() {
  const { trigger } = useSWRMutation('$/r2/getMusicMp3TempUrl', (_, { arg }: { arg: string }) => {
    return $getMusicMp3TempUrl([_, arg])
  })
  return trigger
}

export function useGetRecentPlayedSongs() {
  const { data, error, isLoading } = useSWR('$/songs/getRecentPlayedSongs', $getRecentPlayedSongs)
  return { data, error, isLoading }
}

export function useGetFavoriteSongs() {
  const { data, error, isLoading } = useSWR('$/songs/getFavoriteSongs', $getFavoriteSongs)
  return { data, error, isLoading }
}
