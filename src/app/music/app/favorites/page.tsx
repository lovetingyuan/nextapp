import { queryFavoritesSongs } from '@/app/api/music/songs/db'
import FavoriteSongs from '../_components/FavoriteSongs'

export default async function FavoritesPage() {
  console.log('FavoritesPage')
  const songList = await queryFavoritesSongs()
  // if (!cookie.includes('cacheddhskfsd=true')) {
  //   songList = await getFavoriteSongsCached()
  // }
  return (
    <div>
      <h3>最爱歌曲</h3>
      <FavoriteSongs list={songList} />
    </div>
  )
}
