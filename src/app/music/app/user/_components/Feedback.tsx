'use client'

import { $addFeedback } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Feedback() {
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async () => {
    if (!feedback) {
      toast.info('请输入反馈内容')
      return
    }
    setSubmitting(true)
    try {
      await $addFeedback(feedback)
      toast.success('反馈提交成功')
      setFeedback('')
    } catch {
      toast.error('反馈提交失败')
    }
    setSubmitting(false)
  }
  return (
    <div className="flex flex-col max-w-sm gap-2">
      <div className="flex justify-between gap-2">
        <Label>意见反馈</Label>
        <Button
          variant="outline"
          size="sm"
          disabled={submitting || !feedback}
          onClick={handleSubmit}
        >
          {submitting ? '提交中...' : '提交'}
        </Button>
      </div>
      <Textarea
        placeholder="您的意见很重要"
        className="min-h-20"
        value={feedback}
        onChange={e => setFeedback(e.target.value.trim())}
      />
    </div>
  )
}
