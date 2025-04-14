import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/lib/auth'
import { SquareUserRound } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutBtn from './_components/LogoutBtn'

export default async function UserPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session?.session?.userId) {
    redirect('/music/app/sign-in')
  }
  const user = session.user
  return (
    <div>
      <div className="flex flex-row items-center gap-6">
        <Avatar className="size-12">
          <AvatarImage src={user.image || undefined} alt={user.name || ''} />
          <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{user.name}</h2>
      </div>

      <Separator className="my-8" />
      <ul className="flex flex-col gap-4 px-3">
        <li className="flex flex-row items-center gap-2">
          <SquareUserRound className="size-6" />
          <span className="mr-4 before:content-['账号：']">{user.email}</span>
          <LogoutBtn />
        </li>
      </ul>
    </div>
  )
}
