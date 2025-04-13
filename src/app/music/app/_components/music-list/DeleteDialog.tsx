'use client'

import { Button } from '@/components/ui/button'

import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useAppStore } from '../../_context/context'
import { useRemoveSong } from '../../_swr/useSongs'
import { toast } from 'sonner'

export default function DeleteDialog() {
  const { deleteSong, getReloadSongList, showDeleteSongDialog, setShowDeleteSongDialog } =
    useAppStore()
  const { trigger: deleteSongAction, isMutating: isDeleting } = useRemoveSong()

  return (
    <AlertDialog open={showDeleteSongDialog} onOpenChange={setShowDeleteSongDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除 &ldquo;{deleteSong?.title}&rdquo;？</AlertDialogTitle>
          <AlertDialogDescription hidden></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={async () => {
              if (deleteSong) {
                try {
                  await deleteSongAction(deleteSong.id)
                  toast.success('删除成功')
                  setShowDeleteSongDialog(false)
                  getReloadSongList()?.()
                } catch {
                  toast.error('删除失败')
                }
              }
            }}
          >
            {isDeleting ? '删除中...' : '删除'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
