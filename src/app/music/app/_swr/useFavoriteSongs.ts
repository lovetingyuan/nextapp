import useSWR from 'swr'
import { fetchGet } from '@/lib/fetcher'
import { SongListType } from '@/app/api/music/songs/db'

export function useFavoriteSongs(list?: SongListType) {
  const { data, error, isLoading } = useSWR<{ list: SongListType }>(
    `/api/music/songs/favorite`,
    fetchGet,
    {
      fallbackData: list ? { list } : undefined,
    }
  )
  return { data: data?.list, error, isLoading }
}
