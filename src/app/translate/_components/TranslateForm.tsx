'use client'

import { useCompletion } from 'ai/react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Check, Copy, Languages, LoaderPinwheel, Volume2 } from 'lucide-react'
import { track } from '@/lib/utils'

export default function TranslateForm() {
  const [isCopied, setIsCopied] = React.useState(false)
  const { completion, input, handleInputChange, error, handleSubmit, isLoading } = useCompletion({
    api: '/api/completion',
  })

  const formRef = React.useRef<HTMLFormElement>(null)

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
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [loadingAudio, setLoadingAudio] = React.useState(false)
  const [loadAudioError, setLoadAudioError] = React.useState('')
  const [audioUrl, setAudioUrl] = React.useState('')
  return (
    <>
      <form
        onSubmit={evt => {
          track('action-translate-submit-click')
          handleSubmit(evt)
          setLoadAudioError('')
          setLoadingAudio(false)
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
            setAudioUrl('')
          }
        }}
        ref={formRef}
      >
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
          {isLoading ? (
            <span>Translating...</span>
          ) : (
            <span>
              <Languages className="inline-block mr-1 align-middle" />
              Translate (<kbd>Ctrl</kbd>+<kbd>Enter</kbd>)
            </span>
          )}
        </Button>
      </form>

      {isLoading || completion || error ? (
        <div className="group border border-gray-200 rounded-md p-4 mt-8 flow-root relative">
          {isLoading && !completion && (
            <LoaderPinwheel className="animate-spin" color="cornflowerblue" />
          )}
          <pre className="whitespace-pre-wrap">{completion}</pre>
          {error ? <p className="text-red-600 italic">Error: {error.message}</p> : null}
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
      ) : null}
      {!isLoading && completion && (
        <div>
          <Button
            variant={'secondary'}
            className={`mt-6 w-full ${audioUrl ? 'hidden' : ''}`}
            size="lg"
            onClick={async () => {
              if (loadingAudio) {
                return
              }
              setLoadingAudio(true)
              const response = await fetch('/api/play-sound', {
                method: 'POST',
                body: JSON.stringify({ text: completion }),
              }).catch(() => {
                return null
              })
              if (!response) {
                setLoadAudioError('Failed to load audio')
                setLoadingAudio(false)
                return
              }
              if (!response.ok) {
                setLoadAudioError('Failed to load audio, ' + response.status)
                setLoadingAudio(false)
                return
              }
              const audioBlob = await response.blob()
              // 创建临时的URL
              const audioUrl = URL.createObjectURL(audioBlob)
              setAudioUrl(audioUrl)
              // 设置到audio标签
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play()
                }
              }, 100)
              setLoadingAudio(false)
              setLoadAudioError('')
            }}
          >
            {loadingAudio ? (
              'Loading...'
            ) : (
              <>
                <Volume2 />
                Play (English Only)
              </>
            )}
          </Button>
          {loadAudioError && <p className="text-red-500 text-sm mt-3">{loadAudioError}</p>}
          {audioUrl ? (
            <audio className="mt-5 w-[500px]" ref={audioRef} src={audioUrl} controls></audio>
          ) : null}
        </div>
      )}
    </>
  )
}
