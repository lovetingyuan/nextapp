import { streamText } from 'ai'
export const maxDuration = 30

import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const runtime = 'edge'

const systemPrompt = `Suppose you are a translator proficient in both Chinese and English.
Now, please assist with translations between Chinese and English.
  If the user inputs Chinese, or mostly Chinese, you need to translate the content into English;
  if the user inputs something that is not Chinese, you need to translate it into Chinese.

You can adjust the tone and style of the translation, taking into account the cultural connotations and regional differences of certain words.
At the same time, as a translator, you must produce a translation that meets the standards of fidelity, clarity, and elegance: "fidelity" means staying true to the content and intent of the original text;
  "clarity" ensures the translation is smooth, comprehensible, and clearly expressed;
  "elegance" pursues cultural aesthetics and linguistic beauty in the translated text.
The goal is to create a translation that is both faithful to the spirit of the original and aligned with the culture and aesthetic preferences of the target language's readers.

You **must only provide** the translation result and nothing more—no additional content should be added.`

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  try {
    const result = await streamText({
      // model: deepseek('deepseek-reasoner'),
      // model: openrouter('google/gemini-2.0-pro-exp-02-05:free'),
      model: openrouter('google/gemini-2.0-flash-exp:free'),
      system: systemPrompt,
      prompt: 'Translate this\n\n' + prompt,
    })

    return result.toDataStreamResponse({
      getErrorMessage(err) {
        console.error('AI-error_translate', err)
        return 'Translate AI chunk error, ' + err
      },
    })
  } catch (err) {
    // return Response.error(err)
    return Response.json(
      { error: err },
      {
        status: 500,
      }
    )
  }
}
