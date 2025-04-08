'use client'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { SidebarMenu, SidebarMenuAction } from '@/components/ui/sidebar'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { SidebarMenuBadge } from '@/components/ui/sidebar'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { SidebarMenuItem } from '@/components/ui/sidebar'
import Link from 'next/link'
import { useGetPlayList } from '../../../_swr/usePlayList'

import { useSidebarContext } from '../context'

export default function PlayList() {
  const { data, error, isLoading } = useGetPlayList()
  const { setDeletePlayList, setDeleteOpen, setEditingPlayList, setAddOpen } = useSidebarContext()

  if (!data && isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }
  if (!data) {
    return <div>No data</div>
  }

  return (
    <SidebarMenu>
      {!data.length && <p className="m-4">暂无歌单，点击➕新建</p>}
      {data.map(playList => {
        return (
          <SidebarMenuItem key={playList.id}>
            <SidebarMenuButton asChild isActive={true}>
              <Link href={`/music/app/playlist/${playList.id}`} className="text-lg">
                {playList.title}
              </Link>
            </SidebarMenuButton>
            <SidebarMenuBadge className="mr-8"></SidebarMenuBadge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingPlayList(playList)
                    setAddOpen(true)
                  }}
                >
                  <span>修改</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeletePlayList(playList)
                    setDeleteOpen(true)
                  }}
                >
                  <span>删除</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
