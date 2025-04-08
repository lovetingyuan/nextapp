import { queryAllSongs } from '@/app/api/music/songs/db'
// import AllSongsList from '../_components/AllSongsList'
import { connection } from 'next/server'
import MusicList from '../_components/MusicList'

export default async function SongsPage() {
  await connection()
  const songList = await queryAllSongs()
  return (
    <div>
      <h2 className="text-xl mb-4">所有歌曲</h2>
      <MusicList list={songList} />
    </div>
  )
}
