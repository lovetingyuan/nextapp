import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function UserProfile() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session?.session?.userId) {
    redirect('/music/sign-in')
  }
  return (
    <Link href="/music/app/user">
      <Avatar className="size-9 border">
        <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
        <AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    </Link>
  )
}
