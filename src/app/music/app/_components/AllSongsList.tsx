'use client'

import { SongListType } from '@/app/api/music/songs/db'
import MusicItem from './MusicItem'
import { useAllSongs } from '../_swr/useAllSongs'

export default function AllSongsList(props: { list?: SongListType }) {
  const { data, error, isLoading } = useAllSongs(props.list)

  if (!data && isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }
  if (!data) {
    return <div>No data</div>
  }
  return (
    <div>
      {data.map(song => {
        return <MusicItem key={song.id} song={song} />
      })}
    </div>
  )
}
