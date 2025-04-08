import useSWR from 'swr'
import { fetchGet } from '@/lib/fetcher'
import { SongListType } from '@/app/api/music/songs/db'

export function useRecentHeard() {
  const { data, error, isLoading } = useSWR<{ list: SongListType }>(
    `/api/music/songs/recent`,
    fetchGet
  )
  return { data: data?.list, error, isLoading }
}
