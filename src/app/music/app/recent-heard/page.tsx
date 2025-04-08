'use client'
import { useRecentHeard } from '../_swr/useRecentHeard'
import MusicList from '../_components/MusicList'
import MusicListLoading from '../_components/MusicListLoading'

export default function RecentHeardPage() {
  console.log('RecentHeardPage')
  const { data, error, isLoading } = useRecentHeard()
  let content = null

  if (!data && isLoading) {
    content = <MusicListLoading />
  } else if (error) {
    content = <div>{error.message}</div>
  } else if (!data) {
    content = <div>No data</div>
  } else {
    content = <MusicList list={data} />
  }

  return (
    <div>
      <h2 className="text-xl mb-4">最近听过</h2>
      {content}
    </div>
  )
}
