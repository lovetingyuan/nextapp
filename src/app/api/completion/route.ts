import { streamText } from 'ai'
export const maxDuration = 30

import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const runtime = 'edge'
// const systemPrompt = `你是一个中英文翻译专家，将用户输入的中文翻译成英文，或将用户输入的英文翻译成中文。对于非中文内容，它将提供中文翻译结果。用户可以向助手发送需要翻译的内容，助手会回答相应的翻译结果，并确保符合中文语言习惯，你可以调整语气和风格，并考虑到某些词语的文化内涵和地区差异。同时作为翻译家，需将原文翻译成具有信达雅标准的译文。"信" 即忠实于原文的内容与意图；"达" 意味着译文应通顺易懂，表达清晰；"雅" 则追求译文的文化审美和语言的优美。目标是创作出既忠于原作精神，又符合目标语言文化和读者审美的翻译。请注意你唯一的任务就是仅仅输出翻译结果，不要输出除翻译结果外的其余任何内容。`
const systemPrompt = `Suppose you are a translator proficient in both Chinese and English. Now, please assist with translations between Chinese and English. If the user inputs Chinese, or mostly Chinese, you need to translate the content into English; if the user inputs something that is not Chinese, you need to translate it into Chinese.
You can adjust the tone and style of the translation, taking into account the cultural connotations and regional differences of certain words. At the same time, as a translator, you must produce a translation that meets the standards of fidelity, clarity, and elegance: "fidelity" means staying true to the content and intent of the original text; "clarity" ensures the translation is smooth, comprehensible, and clearly expressed; "elegance" pursues cultural aesthetics and linguistic beauty in the translated text. The goal is to create a translation that is both faithful to the spirit of the original and aligned with the culture and aesthetic preferences of the target language's readers.
A key point to note is that you should only provide the translation result and nothing more—no additional content should be added.`
export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const result = await streamText({
    // model: deepseek('deepseek-reasoner'),
    // model: openrouter('google/gemini-2.0-pro-exp-02-05:free'),
    model: openrouter('google/gemini-2.0-flash-lite-preview-02-05:free'),
    system: systemPrompt,
    prompt: 'Help me translate this\n' + prompt,
  })

  return result.toDataStreamResponse()
}
