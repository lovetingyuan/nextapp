import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore } from '../../_context/context'
import { useGetAllPlayLists } from '../../_swr/usePlayList'
import { Check, Squircle } from 'lucide-react'
import { useGetPlayListIdsBySong } from '../../_swr/useSongs'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { $updateSongPlayList } from '@/actions/songs'
import { toast } from 'sonner'

function SetPlayListDialogInner(props: { open: boolean }) {
  const { setShowSetPlayListDialog, updatePlayListSong } = useAppStore()
  const {
    data: playList,
    isLoading: playListLoading,
    isValidating: playListValidating,
  } = useGetAllPlayLists()
  const {
    data: playListIds,
    isLoading: playListIdsLoading,
    isValidating: playListIdsValidating,
  } = useGetPlayListIdsBySong(updatePlayListSong?.id)
  const [saving, setSaving] = useState(false)
  const loading = playListLoading || playListIdsLoading
  const validating = playListValidating || playListIdsValidating
  const [playListIdsState, setPlayListIdsState] = useState<number[]>([])
  useEffect(() => {
    if (playListIds) {
      setPlayListIdsState(playListIds)
    }
  }, [playListIds])
  const handleSave = async () => {
    if (!updatePlayListSong?.id) {
      return
    }
    setSaving(true)
    try {
      await $updateSongPlayList(updatePlayListSong.id, playListIdsState)
      setShowSetPlayListDialog(false)
      toast.success('保存成功')
    } catch (error) {
      console.error(error)
      toast.error('保存失败')
    } finally {
      setSaving(false)
    }
  }
  return (
    <Dialog open={props.open} onOpenChange={setShowSetPlayListDialog}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>设置歌单</DialogTitle>
          <DialogDescription>
            {validating ? '请稍候...' : `设置歌曲《${updatePlayListSong?.title}》属于哪些歌单`}
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        )}
        {playList && playListIds && (
          <div className="flex flex-wrap gap-3 flex-grow overflow-y-auto p-2">
            {playList.map(item => {
              const isChecked = playListIdsState.includes(item.id)
              return (
                <Button
                  disabled={validating}
                  key={item.id}
                  variant="outline"
                  className={`max-w-full h-max text-left whitespace-break-spaces ${
                    isChecked ? 'border-primary' : ''
                  }`}
                  onClick={() => {
                    if (isChecked) {
                      setPlayListIdsState(playListIdsState.filter(id => id !== item.id))
                    } else {
                      setPlayListIdsState([...playListIdsState, item.id])
                    }
                  }}
                >
                  {isChecked ? <Check className="w-4 h-4" /> : <Squircle className="w-4 h-4" />}
                  {item.title}
                </Button>
              )
            })}
          </div>
        )}
        <DialogFooter>
          <Button disabled={validating || saving} onClick={handleSave}>
            {saving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function SetPlayListDialog() {
  const { showSetPlayListDialog } = useAppStore()
  return <SetPlayListDialogInner open={showSetPlayListDialog} key={showSetPlayListDialog + ''} />
}
