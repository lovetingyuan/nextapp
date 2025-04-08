import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function track(...args: unknown[]) {
  if (typeof window !== 'object') {
    return
  }
  // @ts-expect-error ignore amplitude
  window.amplitude?.track(...args)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mutation<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return (_: string, { arg }: { arg: Parameters<T>[0] }) => fn(arg)
}
