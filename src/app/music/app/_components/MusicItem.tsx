import { SongListType } from '@/app/api/music/songs/db'

export default function MusicItem(props: { song: SongListType[0] }) {
  return <div className="border-b border-gray-200 py-2">song: {props.song.title}</div>
}
