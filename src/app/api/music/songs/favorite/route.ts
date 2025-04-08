import { NextResponse } from 'next/server'
import { queryFavoritesSongs } from '../db'

export async function GET() {
  const songs = await queryFavoritesSongs()
  return NextResponse.json({
    code: 0,
    message: 'ok',
    data: {
      list: songs,
    },
  })
}
