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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, secondsToMMSS } from '@/lib/utils'
import { useAppStore } from '../_context/context'
import { useSongAudioUrl, useUpdatePlayTime } from '../_swr/useSongs'
import { SongListType } from '../_swr/useSongs'

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
  const updatePlayTime = useUpdatePlayTime()
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
    <Card className="w-full p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <audio
        ref={audioRef}
        src={audioUrl?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay={true}
        onEnded={handleEnded}
        onPlaying={() => {
          updatePlayTime(playingSong.id)
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
      <div className="flex items-center gap-6">
        {/* Cover Image and Song Info Group */}
        <div className="flex items-center gap-4  shrink-0 pr-6 border-r">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-lg shrink-0">
            <img src={coverUrl} alt="Album Cover" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight mb-2 line-clamp-2">{title}</h2>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
          </div>
        </div>

        {/* Controls and Progress */}
        <div className="flex-1 flex flex-col gap-3 min-w-[400px]">
          {/* Progress Bar */}
          <div className="flex items-center gap-4 w-full">
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={handleSliderChange}
            />
            <span className="text-sm text-muted-foreground min-w-[4.5rem] text-right">
              {duration
                ? secondsToMMSS(currentTime) + ' / ' + secondsToMMSS(duration)
                : '加载中...'}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setPlayMode(mode => (mode === 'repeat' ? 'shuffle' : 'repeat'))}
            >
              {playMode === 'repeat' ? (
                <Repeat className="h-5 w-5" />
              ) : (
                <Shuffle className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <SkipBack className="h-5 w-5" />
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
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <List className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleMuteToggle}>
              {volume === 0 || isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="w-[100px]"
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export function MusicPlayer() {
  const { playingSong } = useAppStore()
  if (!playingSong) {
    return null
  }
  return <MusicPlayerInner key={playingSong.id} song={playingSong} />
}
