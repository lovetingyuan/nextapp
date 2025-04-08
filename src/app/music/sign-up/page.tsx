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
import { useRouter } from 'next/navigation'
import LoggedIn from '../_components/LoggedIn'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  // why the session is always null?
  const {
    data: session,
    isPending, //loading state
    // error, //error object
    refetch, //refetch the session
  } = useSession()

  const router = useRouter()

  console.log('session', session)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          router.replace('/music/verify-email?email=' + values.email)
        },
        onError: ctx => {
          if (ctx.error.status === 422) {
            form.setError('root', {
              type: 'custom',
              message: `用户已存在，您可以点击下方login直接登录`,
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
  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {session ? (
        <LoggedIn email={session.user.email} tip="或者您想注册新账号吗？" refetch={refetch} />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
                          <Input type="password" className="pl-10" {...field} />
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
                  {isLoading ? 'Loading...' : 'Sign Up'}
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
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
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
              Already have an account?{' '}
              <Link href="/music/sign-in" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
