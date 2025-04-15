'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Signature } from 'lucide-react'

export default function ChangeUsername() {
  const [showInput, setShowInput] = useState(false)
  const [name, setName] = useState('')
  const session = useSession()
  const [updating, setUpdating] = useState(false)
  const updateUserName = async () => {
    if (!name) return
    if (name.length > 100) {
      toast.warning('昵称长度不能超过100个字符')
      return
    }

    if (/^[\p{C}\p{Z}\p{M}]+$/u.test(name) || /\s/.test(name)) {
      toast.warning('昵称不能包含特殊及空白字符')
      return
    }
    setUpdating(true)
    try {
      await authClient.updateUser({
        name,
      })
      toast.success('昵称修改成功')
      setShowInput(false)
      setName('')
    } catch {
      toast.error('昵称修改失败')
    }
    setUpdating(false)
  }
  if (!session) {
    return null
  }
  return (
    <div className="flex flex-row items-center gap-2">
      <Signature />
      {showInput ? (
        <div className="flex flex-row items-center gap-3">
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.trim())}
            autoFocus
            placeholder="输入昵称"
            maxLength={100}
          />
          <Button
            variant="default"
            size="sm"
            disabled={!name || session.data?.user.name === name || updating}
            onClick={updateUserName}
          >
            {updating ? '保存中...' : '保存'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={updating}
            onClick={() => {
              setShowInput(false)
              setName('')
            }}
          >
            取消
          </Button>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2">
          <span className="mr-4 before:content-['昵称：'] min-w-30">{session.data?.user.name}</span>
          <Button variant="outline" size="sm" onClick={() => setShowInput(true)}>
            修改
          </Button>
        </div>
      )}
    </div>
  )
}
