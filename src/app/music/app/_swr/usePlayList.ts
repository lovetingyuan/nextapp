import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  $addPlayList,
  $deletePlayList,
  $getAllPlayLists,
  // $getThePlayList,
  $updatePlayList,
} from '@/actions/playlist'
import { mutation } from '@/lib/utils'

export function useGetAllPlayLists() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '$/playlist/get',
    $getAllPlayLists
  )
  return { data, error, isLoading, isValidating, mutate }
}

// export function useGetThePlayList(playListId?: number) {
//   const { data, error, isLoading, isValidating, mutate } = useSWR(
//     playListId ? [`$/playlist/getThePlayList/`, playListId] : null,
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     ([_, id]) => $getThePlayList(id)
//   )
//   return { data, error, isLoading, isValidating, mutate }
// }

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
