import { signOut } from '@/lib/auth-client'

import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function LoggedIn(props: { email: string; tip: string; refetch: () => void }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>您已登录</CardTitle>
        <CardDescription>账号：{props.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <span>您可以直接访问 </span>
        <Link
          href="/music/app"
          onClick={props.refetch}
          className={buttonVariants({ variant: 'outline' })}
        >
          音乐应用
        </Link>
        <Separator orientation="horizontal" className="my-6" />
        <span>{props.tip}</span>
        <Button size={'sm'} onClick={() => signOut()}>
          退出登录
        </Button>
      </CardContent>
      <CardFooter>
        {/* <Link className={buttonVariants({ variant: 'outline' })} href="/">
          回到首页
        </Link> */}
      </CardFooter>
    </Card>
  )
}
