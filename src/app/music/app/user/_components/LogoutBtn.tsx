'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth-client'
import { LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

export default function LogoutBtn() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={'sm'} className="select-none">
          退出登录
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            const id = toast.info('退出登录中...')
            signOut().then(() => {
              toast.dismiss(id)
              redirect('/music/sign-in')
            })
          }}
        >
          <LogOut className="size-4 mr-1" />
          点击退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
