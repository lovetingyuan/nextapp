import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ResendButton from './_components/ResendButton'

export default async function EmailVerify(params: { searchParams: Promise<{ email: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const { email } = await params.searchParams
  if (!session) {
    if (!email) {
      redirect('/music/sign-in')
    }
  } else if (session.user.emailVerified) {
    redirect('/music/app')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold">请按照以下步骤完成邮箱验证</CardTitle>
            {/* <CardDescription className="text-gray-500">请按照以下步骤完成邮箱验证</CardDescription> */}
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
                    在邮件中点击&quot;验证邮箱&quot;按钮完成验证<br></br>ok, 完成！
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
