'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState, useRef } from 'react'
import { Check, Copy, Languages, LoaderPinwheel } from 'lucide-react'
import { useCompletion } from 'ai/react'

export default function Translate() {
  const [isCopied, setIsCopied] = useState(false)
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/completion',
  })

  const formRef = useRef<HTMLFormElement>(null)

  const handleCopy = async () => {
    if (isCopied) {
      return
    }
    await navigator.clipboard.writeText(completion || '')
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }
  return (
    <div className="p-4 mb-10 sm:p-10 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-normal">
        中英小翻译
        <Languages className="w-6 h-6 inline-block ml-2" />
      </h2>
      <form onSubmit={handleSubmit} ref={formRef}>
        <Textarea
          placeholder="Enter text to translate"
          className="w-full min-h-60 mt-6 field-sizing-content"
          value={input}
          autoFocus
          name="prompt"
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          onChange={handleInputChange}
        />
        <Button type="submit" disabled={isLoading} className="mt-8 w-full" size="lg">
          {isLoading ? 'Translating...' : 'Translate'}
        </Button>
      </form>

      <div className="group border border-gray-200 rounded-md p-4 mt-8 flow-root relative">
        {isLoading && !completion && (
          <LoaderPinwheel className="animate-spin" color="cornflowerblue" />
        )}
        <pre className="whitespace-pre-wrap">{completion}</pre>
        <Button
          variant="ghost"
          size="icon"
          className="invisible group-hover:visible absolute top-0 right-0 p-0"
          onClick={handleCopy}
          title="copy"
        >
          {isCopied ? <Check /> : <Copy />}
        </Button>
      </div>
    </div>
  )
}
