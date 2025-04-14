'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
// import { signInAction } from './actions'
// import { useToast } from '@/hooks/use-toast'
import { Lock, Mail } from 'lucide-react'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { redirect, useRouter } from 'next/navigation'
import Loading from '../_components/Loading'
// import LoggedIn from '../_components/LoggedIn'

// const userSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// })

const formSchema = z.object({
  email: z.string().email({
    message: '请输入有效的邮箱地址。',
  }),
  password: z
    .string()
    .min(8, {
      message: '密码必须至少8个字符。',
    })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message: '密码必须至少8个字符，并且必须有字母和数字。',
    }),
})

export default function LoginPage() {
  // const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()

  const {
    data: session,
    isPending, //loading state
    // error, //error object
    // refetch, //refetch the session
  } = useSession()
  if (isPending) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  if (session) {
    redirect('/music/app')
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    form.clearErrors()
    await authClient.signIn.email(
      {
        /**
         * The user email
         */
        email: values.email,
        /**
         * The user password
         */
        password: values.password,
        /**
         * a url to redirect to after the user verifies their email (optional)
         */
        callbackURL: '/music/app',
      },
      {
        //callbacks
        onSuccess: () => {
          toast.success('登录成功')
        },
        onError: ctx => {
          console.log('sign-in page ctx.error', ctx)
          if (ctx.error.status === 403) {
            toast.warning('请验证您的邮箱')
            router.replace('./sign-up?email=' + encodeURIComponent(values.email))
          } else {
            form.setError('root', {
              message: `登录失败：${ctx.error.message ?? '未知错误'} (${ctx.error.status})`,
            })
            // toast.error(`Failed to sign in: ${ctx.error.message} (${ctx.error.status})`)
          }
        },
        onFinish: () => {
          console.log('Sign in finished')
        },
      }
    )
    // .catch(err => {
    //   form.setError('root', {
    //     message: `登录失败：${err?.message}`,
    //   })
    //   // toast.error(`Failed to sign in: ${err?.message}`)
    // })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">欢迎回来</CardTitle>
          <CardDescription>输入邮箱密码或者点击第三方账号登录</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="your@email.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input type="password" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-red-500">{form.formState.errors.root.message}</div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或者使用三方账号登录</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={async () => {
                const data = await authClient.signIn.social({
                  provider: 'google',
                })
                console.log('google', data)
              }}
            >
              Google
            </Button>
            <Button variant="outline" disabled={isLoading}>
              GitHub
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            还没有账号吗？{' '}
            <Link href="/music/sign-up" className="text-primary hover:underline">
              点击注册 🎉
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
