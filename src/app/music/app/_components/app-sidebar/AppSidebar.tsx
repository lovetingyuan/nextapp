'use client'

import { useMemo } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Crown, Headphones, ListMusic } from 'lucide-react'

import Image from 'next/image'
import PlayList from './play-list/PlayList'
import ThemeSwitch from '../ThemeSwitch'
import { AddDialog } from './play-list/AddDialog'

import { DeleteDialog } from './play-list/DeleteDialog'
import { PlayListType } from '@/actions/playlist'
import { AppSidebarProvider } from './context'
import AddButton from './AddButton'
import { usePathname } from 'next/navigation'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const value = useMemo(() => {
    return {
      addOpen: false,
      deleteOpen: false,
      deletePlayList: null as PlayListType | null,
      editingPlayList: null as PlayListType | null,
    }
  }, [])
  const pathname = usePathname()

  return (
    <AppSidebarProvider value={value}>
      <Sidebar {...props}>
        <SidebarHeader className="p-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2 ">
            <Image
              src={'/music.svg'}
              alt="music"
              className="text-red-500 dark:invert"
              width={38}
              height={38}
            />
            <span className="text-xl font-bold select-none">庭院音乐</span>
          </div>
          <ThemeSwitch />
        </SidebarHeader>
        <SidebarContent style={{ scrollbarWidth: 'thin' }}>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size={'lg'}
                    className="text-base"
                    asChild
                    isActive={pathname === '/music/app/songs'}
                  >
                    <Link data-aaa href={'/music/app/songs'}>
                      <ListMusic className="!w-5 !h-5" />
                      所有歌曲
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size={'lg'}
                    className="text-base"
                    asChild
                    isActive={pathname === '/music/app/favorites'}
                  >
                    <Link href={'/music/app/favorites'}>
                      <Crown className="!w-5 !h-5" />
                      我的最爱
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size={'lg'}
                    className="text-base"
                    asChild
                    isActive={pathname === '/music/app/recent-play'}
                  >
                    <Link href={'/music/app/recent-play'}>
                      <Headphones className="!w-5 !h-5" />
                      最近听过
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* We create a SidebarGroup for each parent. */}
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold mb-4">
              <span>我的歌单</span>
            </SidebarGroupLabel>
            <SidebarGroupAction>
              <AddButton />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <PlayList />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <AddDialog />
      <DeleteDialog />
    </AppSidebarProvider>
  )
}
