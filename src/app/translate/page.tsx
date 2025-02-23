import { CircleHelp, Languages } from 'lucide-react'

import TranslateForm from './_components/TranslateForm'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Translate',
  description: 'translate helper made by tingyuan',
}

export default function Translate() {
  return (
    <div className="px-4 pt-4 pb-12 sm:p-10 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-normal">
        中英小翻译
        <Languages className="w-6 h-6 inline-block ml-2 mr-2" />
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline" size="icon">
              <CircleHelp />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-60 flow-root">
            <p className="text-sm mt-2">
              Build with nextjs, tailwindcss, shadcn, grok3, vercel/ai, deepgram.
            </p>
            <a
              href="https://github.com/lovetingyuan/nextapp"
              target="_blank"
              className="float-right block"
            >
              <Image
                title="Github"
                alt="github"
                src="https://github.com/favicon.ico"
                width={16}
                height={16}
              />
            </a>
          </HoverCardContent>
        </HoverCard>
      </h2>
      <TranslateForm />
    </div>
  )
}
