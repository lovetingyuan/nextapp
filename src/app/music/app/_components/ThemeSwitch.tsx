'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="secondary"
      size="icon"
      title={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}
