'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function UserAvatar(props: { className?: string }) {
  const session = useSession()
  const avatar = session.data?.user.image?.startsWith('avatar/')
    ? 'https://music-cover.tingyuan.in/' + session.data.user.image
    : session.data?.user.image
  return (
    <Link href="/music/app/user">
      <Avatar title={session.data?.user.name} className={cn('size-10 border', props.className)}>
        <AvatarImage
          className="object-cover"
          src={avatar ?? undefined}
          alt={session.data?.user.name || ''}
        />
        <AvatarFallback>
          {session.data?.user.name?.slice(0, 2).toUpperCase() ?? '···'}
        </AvatarFallback>
      </Avatar>
    </Link>
  )
}
