import { useCallback, useRef } from 'react'

export function useLatestFn<T>(value: T extends null ? never : T) {
  if (value === null) {
    throw new Error('useLatest value cannot be null')
  }
  const ref = useRef<T>(value)
  if (ref.current !== null) {
    ref.current = value
  }

  return useCallback(() => ref.current, [])
}
