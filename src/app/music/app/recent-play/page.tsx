'use client'

import { useGetRecentPlayedSongs } from '../_swr/useSongs'
import MusicList from '../_components/music-list/MusicList'
import Loading from '../../_components/Loading'

export default function RecentHeardPage() {
  const { data, error, isLoading } = useGetRecentPlayedSongs()
  let content = null

  if (!data && isLoading) {
    content = <Loading />
  } else if (error) {
    content = <div className="text-left m-8 text-red-500">抱歉，出错了：{error.message}</div>
  } else if (data) {
    content = <MusicList list={data} />
  }

  return (
    <div>
      <h2 className="text-xl mb-4 animate-in slide-in-from-left-72">最近听过</h2>
      {content}
    </div>
  )
}
