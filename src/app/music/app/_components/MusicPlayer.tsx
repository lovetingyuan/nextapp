'use client'
import { useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  List,
  Shuffle,
  VolumeX,
  Volume1,
  Volume2,
  Loader,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, secondsToMMSS } from '@/lib/utils'
import { useAppStore } from '../_context/context'
import { useSongAudioUrl } from '../_swr/useSongs'
import { SongListType } from '../_swr/useSongs'
import { $updatePlayTime } from '@/actions/songs'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

function MusicPlayerInner({ song: playingSong }: { song: SongListType[0] }) {
  const [isPlaying, _setIsPlaying] = useState(false)
  const [playMode, setPlayMode] = useState<'repeat' | 'shuffle'>('repeat')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, _setVolume] = useState(1)
  const [prevVolume, setPrevVolume] = useState(1)
  const [isMuted, _setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { data: audioUrl } = useSongAudioUrl(playingSong?.fileName)

  const setIsMuted = (value: boolean) => {
    _setIsMuted(value)
    if (audioRef.current) {
      audioRef.current.muted = value
    }
  }
  const setVolume = (value: number) => {
    _setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
    if (value === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const setIsPlaying = (value: boolean) => {
    _setIsPlaying(value)
    if (value) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (playMode === 'repeat' && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    setPrevVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolume)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      setIsMuted(true)
    }
  }

  const { cover, title, artist } = playingSong
  const coverUrl = 'https://music-cover.tingyuan.in/' + cover
  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl?.url}
        onTimeUpdate={handleTimeUpdate}
        hidden
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay={true}
        onEnded={handleEnded}
        onPlaying={() => {
          $updatePlayTime(playingSong.id)
          if (!isPlaying) {
            setIsPlaying(true)
          }
        }}
        onPause={() => {
          if (isPlaying) {
            setIsPlaying(false)
          }
        }}
      />
      <Card className="w-full p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center @2xl:gap-6 gap-4 @container">
          {/* Cover Image and Song Info Group */}
          <div className="flex items-center gap-4 shrink-0 @2xl:max-w-80 max-w-30">
            <div className="relative size-22 hidden @2xl:block rounded-lg overflow-hidden shadow-lg shrink-0">
              <Image
                src={coverUrl}
                width={88}
                height={88}
                alt="封面"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight mb-2 line-clamp-2">{title}</h2>
              <p className="text-sm text-muted-foreground truncate">{artist}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="!h-auto self-stretch @2xl:block hidden" />
          {/* Controls and Progress */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-4 w-full">
              <Slider
                value={[duration ? (currentTime / duration) * 100 : 0]}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={handleSliderChange}
              />
              <span className="text-sm text-muted-foreground min-w-[4.5rem] ">
                {duration
                  ? secondsToMMSS(currentTime) + ' / ' + secondsToMMSS(duration)
                  : '加载中...'}
              </span>
            </div>
            {/* Control Buttons */}
            <div className="flex items-center justify-center  @2xl:gap-3 gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setPlayMode(mode => (mode === 'repeat' ? 'shuffle' : 'repeat'))}
              >
                {playMode === 'repeat' ? (
                  <Repeat className="size-5" />
                ) : (
                  <Shuffle className="size-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <SkipBack className="size-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  'h-12 w-12 rounded-full',
                  isPlaying && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {!duration ? (
                  <Loader className="size-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="size-6" />
                ) : (
                  <Play className="size-6" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <SkipForward className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <List className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8" onClick={handleMuteToggle}>
                {volume === 0 || isMuted ? (
                  <VolumeX className="size-5" />
                ) : volume < 0.5 ? (
                  <Volume1 className="size-5" />
                ) : (
                  <Volume2 className="size-5" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                className="w-25"
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

export function MusicPlayer() {
  const { playingSong } = useAppStore()
  if (!playingSong) {
    return null
  }
  return <MusicPlayerInner key={playingSong.id} song={playingSong} />
}
