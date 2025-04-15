'use client'

import { Separator } from '@/components/ui/separator'
import { SquareUserRound } from 'lucide-react'
import LogoutBtn from './_components/LogoutBtn'
import UpdateAvatar from './_components/UpdateAvatar'
import ChangeUsername from './_components/ChangeUsername'
import UserAvatar from '../_components/UserAvatar'
import { useSession } from '@/lib/auth-client'
import Loading from '../../_components/Loading'
import { redirect } from 'next/navigation'

export default function UserPage() {
  const session = useSession()
  const user = session.data?.user
  if (session.isPending) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  if (!user) {
    redirect('/music/app/sign-in')
  }
  return (
    <div>
      <div className="flex flex-row items-center gap-6">
        <UserAvatar className="size-12" />
        <h2 className="text-xl font-bold">{user.name}</h2>
      </div>

      <Separator className="my-6" />
      <ul className="flex flex-col gap-6 px-3">
        <li className="flex flex-row items-center gap-2">
          <SquareUserRound className="size-6" />
          <span className="mr-4 before:content-['账号：']">{user.email}</span>
          <LogoutBtn />
        </li>
        <li className="flex flex-row items-center gap-2">
          <ChangeUsername />
        </li>
        <li className="flex flex-row items-center gap-2">
          <UpdateAvatar />
        </li>
      </ul>
    </div>
  )
}
