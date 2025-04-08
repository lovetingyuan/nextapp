import { AppSidebar } from './_components/app-sidebar/AppSidebar'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import SearchInput from './_components/SearchInput'
import AddMusic from './_components/AddMusic'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <div id="test"></div>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 justify-between flex-grow">
            <SearchInput />
            <AddMusic />
          </div>
        </header>
        <main className="p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
