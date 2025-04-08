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
import { useRouter } from 'next/navigation'
import LoggedIn from '../_components/LoggedIn'

// const userSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// })

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
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
    refetch, //refetch the session
  } = useSession()
  if (isPending) {
    return <div>loading...</div>
  }

  console.log('sign-in page session', session)

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
          // console.log('Signed in successfully')
          toast.success('Signed in successfully')
        },
        onError: ctx => {
          console.log('sign-in page ctx.error', ctx)
          if (ctx.error.status === 403) {
            toast.error('请验证您的邮箱')
            router.replace('./verify-email?email=' + values.email)
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
      {session ? (
        <LoggedIn email={session.user.email} tip="或者您想切换账号吗？" refetch={refetch} />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
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
                      <FormLabel>Password</FormLabel>
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
                  {isLoading ? 'Loading...' : 'Login'}
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
              Don&apos;t have an account?{' '}
              <Link href="/music/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
