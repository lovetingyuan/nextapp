'use client'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useGetAllPlayLists } from '../../../_swr/usePlayList'
import { useDeletePlayList } from '../../../_swr/usePlayList'
import { useAppStore } from '../../../_context/context'
import { Button } from '@/components/ui/button'

export function DeleteDialog() {
  const { mutate } = useGetAllPlayLists()
  const { trigger, isMutating } = useDeletePlayList()
  const { deletePlayListDialogOpen, setDeletePlayListDialogOpen, deletePlayList } = useAppStore()
  return (
    <AlertDialog open={deletePlayListDialogOpen} onOpenChange={setDeletePlayListDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除 “{deletePlayList?.title}“？</AlertDialogTitle>
          <AlertDialogDescription>
            删除歌单后，歌单中的歌曲仍然存在，只是不再属于该歌单。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isMutating}
            onClick={() => {
              if (deletePlayList) {
                trigger(deletePlayList.id).then(
                  () => {
                    mutate()
                    toast.success('删除成功')
                    setDeletePlayListDialogOpen(false)
                  },
                  () => {
                    toast.error('删除失败')
                  }
                )
              }
            }}
          >
            {isMutating ? '删除中...' : '删除'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
