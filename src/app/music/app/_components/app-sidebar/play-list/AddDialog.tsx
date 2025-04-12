'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormMessage,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import * as z from 'zod'
import { useAddPlayList, useGetPlayList, useUpdatePlayList } from '../../../_swr/usePlayList'
import { Loader2 } from 'lucide-react'
import { useSidebarContext } from '../context'
import { toast } from 'sonner'

export const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: '名称是必填项' })
    .max(50, { message: '名称不能超过50个字符' }),
  description: z.string().max(200, { message: '描述不能超过200个字符' }).default(''),
})

type FormValues = z.infer<typeof formSchema>

export function AddDialog() {
  const { addOpen, setAddOpen, editingPlayList, setEditingPlayList } = useSidebarContext()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editingPlayList?.title || '',
      description: editingPlayList?.description || '',
    },
  })
  const value = form.getValues()
  if (!value.title && editingPlayList?.title) {
    form.setValue('title', editingPlayList.title)
  }
  if (!value.description && editingPlayList?.description) {
    form.setValue('description', editingPlayList.description)
  }

  const handleOpenChange = (open: boolean) => {
    setAddOpen(open)
    form.reset()
    if (!open && editingPlayList) {
      setEditingPlayList(null)
    }
  }
  const { trigger: addPlayList, isMutating } = useAddPlayList()
  const { trigger: updatePlayList, isMutating: isUpdating } = useUpdatePlayList()
  const { mutate } = useGetPlayList()
  const onSubmit = (data: FormValues) => {
    if (editingPlayList) {
      updatePlayList({
        playListId: editingPlayList.id,
        title: data.title,
        description: data.description,
      }).then(
        () => {
          toast.success('更新成功')
          handleOpenChange(false)
          mutate()
        },
        err => {
          form.setError('root', { message: '修改失败: ' + err.message })
        }
      )
    } else {
      addPlayList(data).then(
        () => {
          toast.success('添加成功')
          handleOpenChange(false)
          mutate()
        },
        err => {
          form.setError('root', { message: '添加失败: ' + err.message })
        }
      )
    }
  }
  const loading = editingPlayList ? isUpdating : isMutating
  return (
    <Dialog open={addOpen} onOpenChange={handleOpenChange}>
      {/* <DialogTrigger asChild>{props.children}</DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingPlayList ? '修改歌单' : '添加歌单'}</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="add-play-list-form"
            className="w-full max-w-md space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    名称 <sub>必填</sub>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="请输入名称(50字以内)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入描述(200字以内)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.root?.message}</FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button disabled={loading} type="submit" form="add-play-list-form">
            {loading && <Loader2 className="animate-spin" />}
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
