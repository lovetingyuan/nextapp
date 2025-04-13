'use client'

import MusicList from '../_components/music-list/MusicList'
import { useGetAllSongs } from '../_swr/useSongs'
import Loading from '../../_components/Loading'

export default function SongsPage() {
  const { data: songList, mutate, error, isLoading } = useGetAllSongs()
  let content = null
  if (!songList && isLoading) {
    content = <Loading />
  } else if (error) {
    content = <div className="text-left m-8 text-red-500">抱歉，出错了：{error.message}</div>
  } else if (songList) {
    content = <MusicList list={songList} reload={mutate} />
  }
  return (
    <div>
      <h2 className="text-xl mb-4 animate-in slide-in-from-left-72">所有歌曲</h2>
      {content}
    </div>
  )
}
