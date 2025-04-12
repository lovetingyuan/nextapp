'use client'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { SidebarMenu, SidebarMenuAction, SidebarMenuSkeleton } from '@/components/ui/sidebar'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { SidebarMenuBadge } from '@/components/ui/sidebar'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { SidebarMenuItem } from '@/components/ui/sidebar'
import Link from 'next/link'
import { useGetPlayList } from '../../../_swr/usePlayList'

import { useSidebarContext } from '../context'
import { usePathname } from 'next/navigation'

export default function PlayList() {
  const { data, error, isLoading } = useGetPlayList()
  const { setDeletePlayList, setDeleteOpen, setEditingPlayList, setAddOpen } = useSidebarContext()
  const pathname = usePathname()

  if (!data && isLoading) {
    return (
      <SidebarMenu>
        {Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    )
  }
  if (error) {
    return <div className="text-red-500 m-3">错误：{error.message}</div>
  }
  if (!data) {
    return <div>No data</div>
  }

  return (
    <SidebarMenu>
      {!data.length && <p className="m-4">暂无歌单，点击➕新建</p>}
      {data.map(playList => {
        const href = `/music/app/playlist/${playList.id}`
        const isActive = pathname === href
        return (
          <SidebarMenuItem key={playList.id}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={href} className="text-lg !pl-3 !h-10">
                {playList.title}
              </Link>
            </SidebarMenuButton>
            <SidebarMenuBadge className="mr-8 "></SidebarMenuBadge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction className="!h-7">
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
