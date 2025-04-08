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
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}
