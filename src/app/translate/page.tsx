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
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg=="
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
