import { streamText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})
// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const result = streamText({
    model: deepseek('deepseek-reasoner'),
    system: [
      'You are a professional translator.',
      'If the user input is not English, please translate it into English. If it is in English, please translate it into Chinese.',
      'Please try to keep the user enter the format, such as changing lines, blank, etc.',
      "You only need to return the result of the translation, don't include any other content.",
    ].join('\n'),
    prompt: `Please translate the following text to english: ${prompt}`,
  })

  return result.toDataStreamResponse()
}
