'use client'

import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { resendEmail } from '../actions'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ResendButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)

  const resend = async () => {
    try {
      setLoading(true)
      await resendEmail(email)
      toast.success('邮件发送成功，请检查邮箱')
    } catch (error) {
      toast.error('发送失败 ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="pt-6 flex text-center items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
      <p className="text-sm text-gray-500   shrink-0">没收到邮件？</p>
      <Button disabled={loading} variant="outline" className="w-full" size="lg" onClick={resend}>
        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        重新发送验证邮件
      </Button>
    </div>
  )
}
