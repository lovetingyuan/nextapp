'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useGetPlayList } from '../../../_swr/usePlayList'
import { useDeletePlayList } from '../../../_swr/usePlayList'
import { useSidebarContext } from '../context'

export function DeleteDialog() {
  const { mutate } = useGetPlayList()
  const { trigger } = useDeletePlayList()
  const { deleteOpen, setDeleteOpen, deletePlayList } = useSidebarContext()
  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除 “{deletePlayList?.title}“？</AlertDialogTitle>
          <AlertDialogDescription>
            删除歌单后，歌单中的歌曲仍然存在，只是不再属于该歌单。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (deletePlayList) {
                trigger(deletePlayList.id).then(
                  () => {
                    mutate()
                    toast.success('删除成功')
                  },
                  () => {
                    toast.error('删除失败')
                  }
                )
              }
            }}
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
