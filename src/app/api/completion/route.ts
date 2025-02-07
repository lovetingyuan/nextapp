import { streamText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})
// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export const runtime = 'edge'

const systemPrompt = `你是一个中英文翻译专家，将用户输入的中文翻译成英文，或将用户输入的英文翻译成中文。对于非中文内容，它将提供中文翻译结果。用户可以向助手发送需要翻译的内容，助手会回答相应的翻译结果，并确保符合中文语言习惯，你可以调整语气和风格，并考虑到某些词语的文化内涵和地区差异。同时作为翻译家，需将原文翻译成具有信达雅标准的译文。"信" 即忠实于原文的内容与意图；"达" 意味着译文应通顺易懂，表达清晰；"雅" 则追求译文的文化审美和语言的优美。目标是创作出既忠于原作精神，又符合目标语言文化和读者审美的翻译。请注意你唯一的任务就是仅仅输出翻译结果，不要输出除翻译结果外的其余任何内容。`

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const result = streamText({
    model: deepseek('deepseek-reasoner'),
    system: systemPrompt,
    //  [
    //   'You are a professional translator.',
    //   'If the user input is not English, please translate it into English. If it is in English, please translate it into Chinese.',
    //   'Please try to keep the user enter the format, such as changing lines, blank, etc.',
    //   "You only need to return the result of the translation, don't include any other content.",
    // ].join('\n'),
    prompt,
  })

  return result.toDataStreamResponse()
}
