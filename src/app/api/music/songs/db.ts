export type SongListType = {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  published: string
  cover: string
  url?: string
}[]

const mockList = [
  {
    id: '1',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    duration: 5345,
    published: '2021-01-01',
    album: 'A Night at the Opera',
    details: 'Released in 1975, from the album A Night at the Opera',
  },
  {
    id: '2',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    title: 'Imagine',
    artist: 'John Lennon',
    duration: 453,
    published: '2021-01-01',
    album: 'Imagine',
    details: 'Released in 1971, from the album Imagine',
  },
  {
    id: '3',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    duration: 543,
    published: '2021-01-01',
    album: 'Thriller',
    details: 'Released in 1983, from the album Thriller',
  },
]

export async function queryAllSongs() {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return mockList
}

export async function queryFavoritesSongs() {
  await new Promise(resolve => setTimeout(resolve, 10000))
  return mockList
}

export async function queryRecentSongs() {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return mockList.slice(0, 2)
}
