'use client'

import { useParams } from 'next/navigation'
import { useGetPlayListSongs } from '../../_swr/useSongs'
import { useGetAllPlayLists } from '../../_swr/usePlayList'
import MusicList from '../../_components/music-list/MusicList'
import Loading from '@/app/music/_components/Loading'
import { useEffect } from 'react'
import { useAppStore } from '../../_context/context'
export default function PlayListPage() {
  const params = useParams<{ id: string }>()
  const playListId = params.id

  const { data, error, isLoading, mutate } = useGetPlayListSongs(parseInt(playListId))
  const { setReloadSongListFn } = useAppStore()
  const { data: playLists } = useGetAllPlayLists()
  const playList = playListId ? playLists?.find(v => v.id === parseInt(playListId)) : null
  let content = null

  if (!data && isLoading) {
    content = <Loading />
  } else if (error) {
    content = <div className="text-left m-8 text-red-500">抱歉，出错了：{error.message}</div>
  } else if (playListId && playLists && !playList) {
    content = <div className="text-left m-8 text-red-500">歌单不存在</div>
  } else if (data) {
    content = <MusicList list={data} />
  }
  useEffect(() => {
    setReloadSongListFn(() => mutate)
  }, [setReloadSongListFn, mutate])
  return (
    <div>
      <h2 className="text-xl flex mb-4 gap-4 animate-in slide-in-from-left-72">
        <span className="shrink-0">歌单</span>{' '}
        <span className="line-clamp-2 text-ellipsis">{playList?.title}</span>
      </h2>
      {content}
    </div>
  )
}
