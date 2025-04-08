import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { $addPlayList, $deletePlayList, $getPlayList, $updatePlayList } from '@/actions/playlist'
import { mutation } from '@/lib/utils'

export function useGetPlayList() {
  const { data, error, isLoading, mutate } = useSWR('$/playlist/get', $getPlayList)
  return { data, error, isLoading, mutate }
}

export function useAddPlayList() {
  const { trigger, error, isMutating } = useSWRMutation('$/playlist/add', mutation($addPlayList))
  return { trigger, error, isMutating }
}

export function useDeletePlayList() {
  const { trigger, error, isMutating } = useSWRMutation(
    '$/playlist/delete',
    mutation($deletePlayList)
  )
  return { trigger, error, isMutating }
}

export function useUpdatePlayList() {
  const { trigger, error, isMutating } = useSWRMutation(
    '$/playlist/update',
    mutation($updatePlayList)
  )
  return { trigger, error, isMutating }
}
