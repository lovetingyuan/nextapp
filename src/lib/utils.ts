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
  return (_: string, { arg }: { arg: Parameters<T>[0] }) => {
    return fn(arg).then(res => {
      if (res === undefined) {
        throw new Error('发生了错误')
      }
      return res
    })
  }
}

export function ensureString(value: unknown, msg?: string): string {
  if (typeof value !== 'string') {
    throw new Error(msg || '参数必须为字符串')
  }
  return value
}

export function isValidS3KeyName(keyName: string) {
  // S3对象键长度限制(1-1024字节)
  if (!keyName || keyName.length === 0 || keyName.length > 800) {
    return false
  }

  // 检查不允许的字符
  // 这些包括控制字符和一些可能导致问题的特殊字符
  const forbiddenChars = /[\x00-\x1F\x7F"'&<>^`|#\\\/]/
  if (forbiddenChars.test(keyName)) {
    return false
  }

  return true
}

/**
 * 将秒数转换为mm:ss格式
 * @param {number} seconds - 要转换的秒数
 * @return {string} - 格式化为mm:ss的时间字符串
 */
export function secondsToMMSS(seconds: number) {
  // 确保输入是有效的数字
  if (isNaN(seconds) || seconds < 0) {
    return '00:00'
  }

  // 计算分钟和剩余秒数
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  // 格式化为两位数
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  // 返回格式化的时间字符串
  return `${formattedMinutes}:${formattedSeconds}`
}
