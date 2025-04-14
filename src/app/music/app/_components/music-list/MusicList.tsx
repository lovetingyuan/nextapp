import { Info, MoreHorizontal, Play } from 'lucide-react'
import { SongListType } from '../../_swr/useSongs'
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
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useAppStore } from '../../_context/context'
import DeleteDialog from './DeleteDialog'
import SetPlayListDialog from './SetPlayListDialog'
import { $getMusicMp3TempUrl } from '@/actions/r2'

export default function MusicList(props: { list?: SongListType }) {
  const { list } = props
  const {
    setPlayingSong,
    setDeleteSong,
    setShowDeleteSongDialog,
    setShowSetPlayListDialog,
    setUpdatePlayListSong,
  } = useAppStore()

  return (
    <div className="animate-in duration-700 fade-in-25">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">歌曲</TableHead>
            <TableHead>演唱者</TableHead>
            <TableHead className="w-[100px]">时长</TableHead>
            <TableHead className="w-[80px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map(song => (
            <TableRow key={song.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="relative size-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        song.cover ? 'https://music-cover.tingyuan.in/' + song.cover : '/music.svg'
                      }
                      alt={'cover'}
                      width={64}
                      height={64}
                      className="object-cover"
                    ></Image>
                    <Play
                      onClick={() => setPlayingSong(song)}
                      className="absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   text-white size-8 drop-shadow-[0_0_1px_8px_rgba(0,0,0,1)] filter hover:scale-125 transition-all duration-300"
                    />
                  </div>
                  <span className="font-medium">{song.title}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
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
                        setShowSetPlayListDialog(true)
                        setUpdatePlayListSong(song)
                      }}
                    >
                      设置歌单
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setDeleteSong(song)
                        setShowDeleteSongDialog(true)
                      }}
                    >
                      删除
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        $getMusicMp3TempUrl(song.fileName)
                          .then(res => {
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
                          .catch(err => {
                            toast.error('无法下载 ' + err)
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
      <DeleteDialog />
      <SetPlayListDialog />
    </div>
  )
}
