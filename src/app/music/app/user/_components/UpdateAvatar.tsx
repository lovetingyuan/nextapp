'use client'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { authClient, useSession } from '@/lib/auth-client'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { $uploadUserAvatar } from '@/actions/r2'

export default function UpdateAvatar() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [inputKey, setInputKey] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [updating, setUpdating] = useState(false)
  const session = useSession()

  const userId = session.data?.user.id
  if (!userId) {
    return null
  }
  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setFile(null)
    setInputKey(k => k + 1)
  }
  const updateAvatar = async () => {
    if (!file) {
      toast.info('请先选择图片')
      return
    }
    setUpdating(true)
    try {
      const ret = await $uploadUserAvatar(file)
      if (ret.error) {
        toast.error(ret.error)
        return
      }
      await authClient.updateUser({
        image: ret.fileKey,
      })
      console.log('update avatar success', ret.fileKey)
      toast.success('更新头像成功')
      clearFile()
    } catch (error) {
      console.error(error)
      toast.error('更新头像失败')
    } finally {
      setUpdating(false)
    }
  }
  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          className="w-fit"
          key={inputKey}
          accept=".jpg,.jpeg,.png"
          placeholder="选择图片"
          ref={inputRef}
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) {
              if (file.size > 600 * 1024) {
                toast.error('图片大小不能超过600KB')
                e.target.value = ''
                e.preventDefault()
                clearFile()
                return false
              }
              setFile(file)
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
              }
              setPreviewUrl(URL.createObjectURL(file))
            }
          }}
        />
        <Button variant="outline" size="sm" onClick={updateAvatar} disabled={updating}>
          {updating ? '更新中...' : '更新头像'}
        </Button>
      </div>
      {previewUrl && (
        <div className="relative mt-4 pr-5 flex   overflow-hidden">
          <Image
            width={120}
            height={120}
            src={previewUrl}
            alt="Preview"
            className=" max-w-full object-cover"
          />
          <X
            className="size-5 m-2 cursor-pointer"
            onClick={() => {
              clearFile()
            }}
          />
        </div>
      )}
    </div>
  )
}
