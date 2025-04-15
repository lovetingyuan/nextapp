import { AppSidebar } from './_components/app-sidebar/AppSidebar'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import SearchInput from './_components/SearchInput'
import AddMusic from './_components/AddMusic'
import { MusicPlayer } from './_components/MusicPlayer'
import AppProvider from './_context/provider'
import UserAvatar from './_components/UserAvatar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <SidebarProvider className="flex-1">
        <AppSidebar />

        <SidebarInset className="h-dvh overflow-hidden relative">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 justify-between flex-grow">
              <SearchInput />
              <div className="flex items-center gap-4">
                <AddMusic />
                <UserAvatar />
              </div>
            </div>
          </header>
          <main className="p-5 overflow-auto flex-grow">{children}</main>
          <footer className="shrink-0">
            <MusicPlayer />
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
