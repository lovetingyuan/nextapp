'use client'

import MusicList from '../_components/MusicList'
import { useGetFavoriteSongs } from '../_swr/useSongs'
import Loading from '../../_components/Loading'

export default function FavoritesPage() {
  const { data, error, isLoading } = useGetFavoriteSongs()
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
      <h2 className="text-xl mb-4 animate-in slide-in-from-left-72">我的最爱</h2>
      {content}
    </div>
  )
}
