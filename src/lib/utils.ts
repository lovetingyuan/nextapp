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
