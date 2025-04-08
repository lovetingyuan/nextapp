import { Info } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SongListType } from '@/app/api/music/songs/db'
import Image from 'next/image'

export default function MusicList(props: { list: SongListType }) {
  const { list } = props
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
          {list.map(track => (
            <TableRow key={track.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={track.cover}
                      alt={'cover'}
                      width={64}
                      height={64}
                      className="object-cover"
                    ></Image>
                  </div>
                  <span className="font-medium">{track.title}</span>
                </div>
              </TableCell>
              <TableCell>{track.artist}</TableCell>
              <TableCell>{track.duration}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{track.published}发布</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
