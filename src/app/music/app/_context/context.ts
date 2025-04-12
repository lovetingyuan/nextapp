import { createAtomicContext, useAtomicContext } from 'react-atomic-context'
import { SongListType } from '../_swr/useSongs'
import { useMemo } from 'react'

const getAppValue = () => {
  return {
    playingSong: null as SongListType[0] | null,
  }
}

const AppContext = createAtomicContext(getAppValue())

export const useAppValue = () => {
  return useMemo(getAppValue, [])
}

export const useAppStore = () => useAtomicContext(AppContext)

export const AppContextProvider = AppContext.Provider
