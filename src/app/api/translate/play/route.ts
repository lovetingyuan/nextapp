import { NextRequest } from 'next/server'

export const runtime = 'edge'

//   async function _POST(req: NextRequest) {
//   const { text } = (await req.json()) as { text: string }

//   const url = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en'

//   const body = JSON.stringify({
//     text,
//   })

//   const headers = {
//     Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
//     'Content-Type': 'application/json',
//   }

//   const options = {
//     method: 'POST',
//     headers: headers,
//     body: body,
//   }

//   return fetch(url, options).then(response => {
//     if (!response.ok) {
//       throw new Error('Failed to make request to deepgram:' + response.statusText)
//     }
//     return response
//   })
// }

export async function POST(req: NextRequest) {
  const { text } = (await req.json()) as { text: string }
  return await fetch('https://ttsapi.site/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      voice: 'alloy',
      // instructions: 'Speak in a cheerful and upbeat tone.'  // Optional
    }),
  })
}
