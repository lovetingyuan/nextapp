import { Info, MoreHorizontal, Play } from 'lucide-react'
import { SongListType, useGetSongAudioUrl, useRemoveSong } from '../_swr/useSongs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import Image from 'next/image'
import { secondsToMMSS } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { useAppStore } from '../_context/context'

export default function MusicList(props: { list?: SongListType; reload?: () => void }) {
  const { list, reload } = props
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteSong, setDeleteSong] = useState<SongListType[0] | null>(null)
  const { trigger: deleteSongAction, isMutating: isDeleting } = useRemoveSong()
  const { setPlayingSong } = useAppStore()
  const getAudioUrl = useGetSongAudioUrl()

  const playSong = (song: SongListType[0]) => {
    setPlayingSong(song)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Track</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="w-[100px]">Duration</TableHead>
            <TableHead className="w-[80px]">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map(song => (
            <TableRow key={song.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={'https://music-cover.tingyuan.in/' + song.cover || '/public/music.svg'}
                      alt={'cover'}
                      width={64}
                      height={64}
                      className="object-cover"
                    ></Image>
                    <Play
                      onClick={() => playSong(song)}
                      className="absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground text-white w-8 h-8 drop-shadow-[0_0_1px_8px_rgba(0,0,0,1)] filter hover:scale-125 transition-all duration-300"
                    />
                  </div>
                  <span className="font-medium">{song.title}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{song.publishDate}发布</p>
                        <p>{song.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{secondsToMMSS(song.duration)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>编辑</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setDeleteSong(song)
                        setDeleteOpen(true)
                      }}
                    >
                      删除
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        getAudioUrl(song.fileName).then(res => {
                          if (res.error !== null) {
                            toast.error(res.error)
                          } else {
                            const a = document.createElement('a')
                            a.href = res.url
                            a.target = '_blank'
                            a.download = song.fileName
                            a.click()
                          }
                        })
                      }}
                    >
                      下载
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!list?.length && (
        <p className="text-center my-10 text-muted-foreground font-medium">暂无数据</p>
      )}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除 &ldquo;{deleteSong?.title}&rdquo;？</AlertDialogTitle>
            <AlertDialogDescription hidden></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button
              disabled={isDeleting}
              onClick={async () => {
                if (deleteSong) {
                  try {
                    const success = await deleteSongAction(deleteSong.id)
                    if (success) {
                      toast.success('删除成功')
                      setDeleteOpen(false)
                      reload?.()
                    } else {
                      toast.error('删除失败')
                    }
                  } catch {
                    toast.error('删除失败')
                  }
                }
              }}
            >
              {isDeleting ? '删除中...' : '删除'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
