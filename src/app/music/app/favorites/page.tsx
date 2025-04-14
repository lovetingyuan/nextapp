'use client'

import MusicList from '../_components/music-list/MusicList'
import { useGetFavoriteSongs } from '../_swr/useSongs'
import Loading from '../../_components/Loading'
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'

export default function FavoritesPage() {
  const { data, error, isLoading } = useGetFavoriteSongs()
  let content = null

  if (!data && isLoading) {
    content = <Loading />
  } else if (error) {
    content = <div className="text-left m-8 text-red-500">抱歉，出错了：{error.message}</div>
  } else if (data) {
    content = <MusicList list={data} />
  }
  return (
    <div>
      <h2 className="text-xl mb-4 animate-in slide-in-from-left-72 flex items-center gap-3">
        我的最爱
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent>评分达到最高10分的歌曲</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h2>
      {content}
    </div>
  )
}
