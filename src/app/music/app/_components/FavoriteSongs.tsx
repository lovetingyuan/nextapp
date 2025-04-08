'use client'

import { SongListType } from '@/app/api/music/songs/db'
import MusicItem from './MusicItem'
import { useFavoriteSongs } from '../_swr/useFavoriteSongs'

export default function FavoriteSongs(props: { list?: SongListType }) {
  const { data, error, isLoading } = useFavoriteSongs(props.list)
  if (typeof document !== 'undefined') {
    if (props.list) {
      document.cookie = 'cacheddhskfsd=true'
    } else {
      // delete this cookie
      document.cookie = 'cacheddhskfsd=true; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

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
