'use server'

import { verifySession } from '@/lib/dal'
// import { getRequestContext } from '@cloudflare/next-on-pages'

// import S3 from "@/lib/r2";
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client } from '@aws-sdk/client-s3'
import { ensureString, validateS3KeyName } from '@/lib/utils'

const ACCOUNT_ID = ensureString(process.env.R2_ACCOUNT_ID, 'R2_ACCOUNT_ID 不能为空')
const ACCESS_KEY_ID = ensureString(process.env.R2_ACCESS_KEY_ID, 'R2_ACCESS_KEY_ID 不能为空')
const SECRET_ACCESS_KEY = ensureString(
  process.env.R2_SECRET_ACCESS_KEY,
  'R2_SECRET_ACCESS_KEY 不能为空'
)

const R2Endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`

const S3 = new S3Client({
  region: 'auto',
  endpoint: R2Endpoint,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
})

const MusicBucket = 'music-test'
const MusicCoverBucket = 'music-cover'

export async function uploadMusicMp3(file: File, fileName: string) {
  const { userId } = await verifySession()

  if (!file) {
    return { error: '请选择文件' }
  }
  if (!fileName) {
    return { error: '请输入文件路径' }
  }
  if (!fileName.endsWith('.mp3')) {
    return { error: '文件路径必须以.mp3结尾' }
  }
  const { isValid, error } = validateS3KeyName(fileName)
  if (!isValid) {
    return { error: '文件路径不合法, ' + error }
  }
  const fileKey = `mp3/${userId}/${fileName}`
  const url = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: MusicBucket,
      Key: fileKey,
    }),
    {
      expiresIn: 600,
    }
  )
  console.log('pre signed url', fileName, url)

  try {
    const uploadRes = await fetch(url, {
      method: 'PUT',
      body: file,
    })
    if (!uploadRes.ok) {
      return { error: '上传响应失败 ' + uploadRes.status }
    }
    console.log('upload music mp3 success', file, fileKey)
    return { error: null, fileKey }
  } catch (error) {
    return { error: '上传请求失败 ' + (error?.toString() || '') }
  }
}

export async function uploadMusicCover(file: File, fileName: string) {
  const { userId } = await verifySession()

  if (!file) {
    return { error: '请选择文件' }
  }
  if (!fileName) {
    return { error: '请输入文件路径' }
  }
  if (!fileName.endsWith('.png') && !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
    return { error: '文件路径必须以.png, .jpg, .jpeg结尾' }
  }
  const { isValid, error } = validateS3KeyName(fileName)
  if (!isValid) {
    return { error: '文件路径不合法, ' + error }
  }
  const fileKey = `cover/${userId}/${fileName}`
  const url = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: MusicCoverBucket,
      Key: fileKey,
    }),
    {
      expiresIn: 600,
    }
  )
  console.log('pre cover url', fileName, url, file)
  try {
    const uploadRes = await fetch(url, {
      method: 'PUT',
      body: file,
    })
    if (!uploadRes.ok) {
      return { error: '上传响应失败 ' + uploadRes.status + '--' + (await uploadRes.text()) }
    }
    return { error: null, fileKey }
  } catch (error) {
    return { error: '上传请求失败 ' + (error?.toString() || '') }
  }
}

export async function $getMusicMp3TempUrl(fileKey: string) {
  const { userId } = await verifySession()
  if (!fileKey.startsWith(`mp3/${userId}/`)) {
    return { error: '文件路径不合法' }
  }

  const command = new GetObjectCommand({
    Bucket: 'music-test',
    Key: fileKey,
  })
  const url = await getSignedUrl(S3, command, { expiresIn: 3600 })
  return { error: null, url }
}
