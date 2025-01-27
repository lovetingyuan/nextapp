import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'
import { z } from 'zod'

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})

const Schema = z.object({
  query: z.string(),
})

export async function POST(request: Request) {
  const payload = await request.json()
  const { query } = Schema.parse(payload)

  const { text } = await generateText({
    model: deepseek('deepseek-reasoner'),
    system: [
      'You are a professional translator.',
      'If the user input is in a language other than English, please translate it into English. If it is in English, please translate it into Chinese. ',
      'Please try to keep the user enter the format, such as changing lines, blank, etc.',
      "You only need to return the result of the translation, don't include any other content.",
    ].join('\n'),
    prompt: `please translate the following text to english: ${query}`,
  }).catch(error => {
    console.error(error)
    throw error
  })

  return new Response(JSON.stringify({ text }), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
