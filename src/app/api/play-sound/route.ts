import { NextRequest } from 'next/server'
import { createClient } from '@deepgram/sdk'

const deepgram = createClient(process.env.DEEPGRAM_API_KEY)

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { text } = (await req.json()) as { text: string }
  const response = await deepgram.speak.request(
    { text },
    {
      model: 'aura-asteria-en',
      encoding: 'linear16',
      container: 'wav',
    }
  )
  return response.result
}
