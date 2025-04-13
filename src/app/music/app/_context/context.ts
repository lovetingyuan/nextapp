import { createAtomicContext, useAtomicContext } from 'react-atomic-context'
import { SongListType } from '../_swr/useSongs'
import { useMemo } from 'react'
import { PlayListType } from '@/actions/playlist'

const getAppValue = () => {
  return {
    addPlayListDialogOpen: false,
    deletePlayListDialogOpen: false,
    deletePlayList: null as PlayListType | null,
    editingPlayList: null as PlayListType | null,
    // 正在播放的歌曲
    playingSong: null as SongListType[0] | null,
    // 要删除的歌曲
    deleteSong: null as SongListType[0] | null,
    // 是否显示删除歌曲的确认框
    showDeleteSongDialog: false,
    // 重新加载歌曲列表的方法
    reloadSongList: null as null | (() => void),
    // 重新设置歌单的歌曲
    updatePlayListSong: null as null | SongListType[0],
    // 是否显示设置歌单的对话框
    showSetPlayListDialog: false,
  }
}

const AppContext = createAtomicContext(getAppValue())

export const useAppValue = () => {
  return useMemo(() => getAppValue(), [])
}

export const useAppStore = () => useAtomicContext(AppContext)

export const AppContextProvider = AppContext.Provider
