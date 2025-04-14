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

import { Lock, Mail } from 'lucide-react'
import { useSession, authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { redirect, useSearchParams } from 'next/navigation'
import Loading from '../_components/Loading'
import { Separator } from '@/components/ui/separator'
import ResendButton from './_components/ResendButton'

const formSchema = z.object({
  email: z.string().email({
    message: '请输入有效的邮箱地址。',
  }),
  // 至少8位，并且必须有字母和数字
  password: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: '密码必须至少8个字符，并且必须有字母和数字。',
  }),
})

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email'))
  // why the session is always null?
  const {
    data: session,
    isPending, //loading state
    // error, //error object
    // refetch, //refetch the session
  } = useSession()

  if (session) {
    redirect('/music/app')
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (isPending) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  if (email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">完成邮箱验证</CardTitle>
              <CardDescription>这是注册的最后一步，请按照以下步骤完成验证</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 select-none font-semibold">1</span>
                    </div>
                    <div className="ml-4">登录您的邮箱账户：{email}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 select-none font-semibold">2</span>
                    </div>
                    <div className="ml-4">
                      <p>查找来自 &quot;hello@tingyuan.in&quot; 的邮件</p>
                      <p className="text-sm opacity-60">如果没有，请检查垃圾邮件或推广邮件等</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 select-none font-semibold">3</span>
                    </div>
                    <div className="ml-4">
                      在邮件中点击&quot;验证邮箱&quot;按钮完成验证<br></br>ok,{' '}
                      <Link href="/music/app" className="text-blue-600 hover:underline">
                        回到应用
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Separator />
                <ResendButton email={email} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    form.clearErrors()

    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.email.split('@')[0],
        callbackURL: '/music/app',
      },
      {
        onSuccess: () => {
          toast.success('注册成功，请登录邮箱查看验证邮件')
          // router.replace('/music/verify-email?email=' + values.email)
          setEmail(values.email)
        },
        onError: ctx => {
          if (ctx.error.status === 422) {
            form.setError('root', {
              type: 'custom',
              message: `账号已存在，您可以点击下方登录按钮登录`,
            })
          } else {
            form.setError('root', {
              type: 'custom',
              message: `注册失败：${ctx.error.message ?? '未知错误'} (${ctx.error.status})`,
            })
          }
        },
      }
    )

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>注册账号</CardTitle>
          <CardDescription>输入邮箱密码或者点击下方三方账号注册</CardDescription>
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
                        <Mail className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
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
                        <Lock className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="不少于8位"
                          type="password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-red-500">{form.formState.errors.root.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '注册中...' : '注册'}
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
              <span className="bg-background px-2 text-muted-foreground">或者使用三方账号注册</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" disabled={isLoading}>
              Google
            </Button>
            <Button variant="outline" disabled={isLoading}>
              GitHub
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            已经有账号了吗？{' '}
            <Link href="/music/sign-in" className="text-primary hover:underline">
              点击登录 🎉
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
