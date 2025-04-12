'use client'

import { AppContextProvider, useAppValue } from './context'

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useAppValue()
  return <AppContextProvider value={value}>{children}</AppContextProvider>
}
