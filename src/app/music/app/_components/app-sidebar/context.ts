import { createAtomicContext, useAtomicContext } from 'react-atomic-context'
import { PlayListType } from '@/actions/playlist'

const SidebarContext = createAtomicContext({
  addOpen: false,
  deleteOpen: false,
  deletePlayList: null as PlayListType | null,
  editingPlayList: null as PlayListType | null,
})

export const useSidebarContext = () => useAtomicContext(SidebarContext)
export const AppSidebarProvider = SidebarContext.Provider
