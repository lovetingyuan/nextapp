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

/**
 * 验证S3对象名称是否合法
 * @param {string} keyName - 要验证的S3对象名称
 * @returns {object} - 包含验证结果与错误信息的对象
 */
export function validateS3KeyName(keyName: string) {
  // 检查参数是否为字符串
  if (typeof keyName !== 'string') {
    return {
      isValid: false,
      error: '名称必须是字符串',
    }
  }

  // 检查名称长度
  if (keyName.length === 0) {
    return {
      isValid: false,
      error: '名称不能为空',
    }
  }

  if (keyName.length > 1024) {
    return {
      isValid: false,
      error: '名称长度不能超过1024',
    }
  }

  // 检查是否以点(.)或双点(..)开头（技术上允许但不推荐）
  if (keyName === '.' || keyName === '..') {
    return {
      isValid: true,
      warning: '不推荐使用"."或".."作为名称',
    }
  }

  // 检查有效字符
  // S3允许的字符集比较宽松，但有些字符在使用时可能需要URL编码
  // 此处检查常见的不推荐使用的字符
  const potentiallyProblematicChars = /[\\:*?"<>|]/
  if (potentiallyProblematicChars.test(keyName)) {
    return {
      isValid: true,
      warning: '名称包含可能导致问题的字符 (\\, :, *, ?, ", <, >, |)，建议避免使用',
    }
  }

  // 检查名称中是否有控制字符
  for (let i = 0; i < keyName.length; i++) {
    const code = keyName.charCodeAt(i)
    if (code < 32) {
      return {
        isValid: false,
        error: `名称包含无效的控制字符(ASCII码: ${code})`,
      }
    }
  }

  // 检查UTF-8编码的字节长度是否超过1024
  const utf8Length = new TextEncoder().encode(keyName).length
  if (utf8Length > 1024) {
    return {
      isValid: false,
      error: `名称编码后超过长度限制`,
    }
  }

  // 所有检查都通过
  return {
    isValid: true,
  }
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
