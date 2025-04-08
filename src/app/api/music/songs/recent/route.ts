import { NextResponse } from 'next/server'
import { queryRecentSongs } from '../db'
import { db } from '@/db'
export async function GET() {
  console.log(typeof db)
  const songs = await queryRecentSongs()
  return NextResponse.json({
    code: 0,
    message: 'ok',
    data: {
      list: songs,
    },
  })
}
