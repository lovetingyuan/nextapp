import { NextResponse } from 'next/server'
import { queryAllSongs } from './db'


export async function GET() {

  const songs = await queryAllSongs()
  return NextResponse.json({
    code: 0,
    message: 'ok',
    data: {
      list: songs,
    },
  })
}
