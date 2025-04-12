'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { IAudioMetadata, parseBlob } from 'music-metadata'
import { useRef, useState } from 'react'
import { useAddSong } from '../../_swr/useSongs'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'
import { CircleHelp, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// import { getMusicMp3TempUrl, uploadMusicMp3 } from '@/actions/r2'

const MAX_FILE_SIZE = 1024 * 1024 // 1MB for image
const MAX_AUDIO_FILE_SIZE = 10 * 1024 * 1024 // 10MB for audio
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const ACCEPTED_AUDIO_TYPES = ['audio/mpeg']

export const formSchema = z
  .object({
    tab: z.enum(['third', 'local']).default('third'),
    title: z.string().min(1, '歌曲名称不能为空').max(100, '歌曲名称不能超过100个字符'),
    artist: z.string().min(1, '演唱者不能为空').max(100, '演唱者不能超过100个字符'),
    album: z.string().max(100, '专辑名称不能超过100个字符').optional(),
    rating: z.number().min(1).max(10).default(5),
    cover: z
      .instanceof(globalThis.File || {})
      .refine(file => file && file.size <= MAX_FILE_SIZE, '图片大小不能超过1MB')
      .refine(
        file => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
        '只支持 .jpg, .jpeg, .png 格式'
      )
      .optional(),
    thirdUrl: z.string().url('请输入有效的网址').or(z.literal('')).optional(),
    audioFile: z
      .instanceof(globalThis.File || {})
      .refine(file => file && file.size <= MAX_AUDIO_FILE_SIZE, '音频文件大小不能超过10MB')
      .refine(file => file && ACCEPTED_AUDIO_TYPES.includes(file.type), '只支持 .mp3 格式')
      .optional(),
    lyricist: z.string().max(100, '作词者不能超过100个字符').optional(),
    composer: z.string().max(100, '作曲者不能超过100个字符').optional(),
    year: z
      .string()
      // .regex(/^[1,2]\d{3}$/, '年份不合适')
      // .transform(val => parseInt(val))
      .refine(val => {
        if (val === '') {
          return true
        }
        if (parseInt(val) > new Date().getFullYear()) {
          return false
        }
        return /^[1,2]\d{3}$/.test(val)
      }, '请填入正确的年份')
      .optional(),
    description: z.string().max(500, '描述不能超过500个字符').optional(),
  })
  .refine(
    data => {
      console.log(432432, data)
      // 如果名称和年龄都存在，返回false
      if (data.tab === 'third' && !data.thirdUrl) {
        return false
      }
      return true
    },
    {
      message: '网址必填',
      path: ['thirdUrl'], // 将错误消息关联到名称字段
    }
  )
  .refine(
    data => {
      // 如果名称和年龄都存在，返回false
      if (data.tab === 'local' && !data.audioFile) {
        return false
      }
      return true
    },
    {
      message: '请上传歌曲文件',
      path: ['audioFile'], // 将错误消息关联到名称字段
    }
  )

type FormValueType = z.infer<typeof formSchema>

export function CreateSongForm() {
  const form = useForm<FormValueType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tab: 'third',
      rating: 8,
      title: '',
      artist: '',
      album: '',
      year: '',
      lyricist: '',
      composer: '',
      description: '',
      thirdUrl: '',
    },
  })
  const router = useRouter()
  const { trigger: addSong, error, isMutating } = useAddSong()
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const handleCoverImageChange = (file?: File | null) => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }

    if (file) {
      const url = URL.createObjectURL(file)
      setCoverPreview(url)
      form.setValue('cover', file, { shouldValidate: true })
    } else {
      setCoverPreview(null)
      form.setValue('cover', undefined, { shouldValidate: true })
    }
  }

  const songMetaInfoRef = useRef<IAudioMetadata | null>(null)

  const onSubmit = async (values: FormValueType) => {
    // console.log('submitting', values)
    // return
    let duration = songMetaInfoRef.current?.format.duration
    if (!duration) {
      duration = await new Promise(resolve => {
        if (!values.audioFile) {
          toast.error('请上传歌曲文件')
          return
        }
        const objectURL = URL.createObjectURL(values.audioFile)
        const audio = new Audio(objectURL)
        audio.addEventListener('loadedmetadata', () => {
          resolve(Math.floor(audio.duration))
          URL.revokeObjectURL(objectURL)
        })
      })
    } else {
      duration = Math.floor(duration)
    }
    if (!duration) {
      toast.error('获取歌曲时长失败')
      return
    }

    toast.promise(addSong({ ...values, duration }), {
      loading: '添加中，这需要花一些时间...',
      success: () => {
        router.push('/music/app/songs')
        return `添加成功`
      },
      error: '添加失败',
    })
  }

  const handleAudioFileChange = async (file: File | null) => {
    if (file) {
      const metadata = await parseBlob(file)

      songMetaInfoRef.current = metadata
      if (metadata.common.title) {
        form.setValue('title', metadata.common.title, { shouldValidate: true })
      }
      if (metadata.common.artist) {
        form.setValue('artist', metadata.common.artist, { shouldValidate: true })
      }
      if (metadata.common.album) {
        form.setValue('album', metadata.common.album, { shouldValidate: true })
      }
      if (metadata.common.year) {
        form.setValue('year', metadata.common.year.toString(), { shouldValidate: true })
      } else if (metadata.common.date) {
        form.setValue('year', metadata.common.date.split('-')[0], { shouldValidate: true })
      }
      if (metadata.common.lyricist) {
        form.setValue('lyricist', metadata.common.lyricist.join(', '), { shouldValidate: true })
      }
      if (metadata.common.composer) {
        form.setValue('composer', metadata.common.composer.join(', '), { shouldValidate: true })
      }
      let description = ''
      if (metadata.common.genre) {
        description += `流派: ${metadata.common.genre.join(', ')}\n`
      }
      if (metadata.common.language) {
        description += `语言: ${metadata.common.language}\n`
      }
      if (metadata.common.description) {
        description += metadata.common.description
      }
      if (description) {
        form.setValue('description', description, { shouldValidate: true })
      }
      if (metadata.common.picture) {
        const mimeType = metadata.common.picture[0].format
        let coverFileName = ''
        if (mimeType === 'image/jpeg') {
          coverFileName = 'cover.jpg'
        } else if (mimeType === 'image/png') {
          coverFileName = 'cover.png'
        } else {
          toast.error('不支持的图片格式')
          handleCoverImageChange(null)
          return
        }
        const coverFile = new File([metadata.common.picture[0].data], coverFileName, {
          type: mimeType,
        })
        handleCoverImageChange(coverFile)
      }
    }
  }

  const [tab, setTab] = useState<string>(form.getValues('tab'))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  w-full max-w-2xl">
        <fieldset disabled={isMutating}>
          <Tabs
            value={tab}
            onValueChange={v => {
              form.setValue('tab', v as 'third' | 'local')
              setTab(v)
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="third">从网址导入</TabsTrigger>
              <TabsTrigger value="local">本地上传</TabsTrigger>
            </TabsList>
            <TabsContent value="third" className="px-2">
              <FormField
                control={form.control}
                name="thirdUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex py-1 items-center gap-2">
                      <span>歌曲网址 *</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleHelp className="w-4 h-4 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>目前支持填写Bilibili和Youtube的网址，例如：</p>
                            <p> Bilibili: https://www.bilibili.com/video/BV1GJ411x7h7</p>
                            <p> Youtube: https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="请输入歌曲网址" {...field} />
                    </FormControl>
                    <FormDescription>请输入网址，目前支持Bilibili和Youtube</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="local" className="px-2">
              <FormField
                control={form.control}
                name="audioFile"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <FormItem>
                      <FormLabel>歌曲文件 *</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".mp3"
                          onChange={e => {
                            if (e.target.files?.[0]) {
                              if (e.target.files[0].size > 10 * 1024 * 1024) {
                                toast.error('文件大小不能超过10MB')
                                e.preventDefault()
                                e.target.value = ''
                                onChange(undefined)
                                return
                              }
                              handleAudioFileChange(e.target.files[0])
                              onChange(e.target.files[0])
                            } else {
                              handleAudioFileChange(null)
                              onChange(undefined)
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {value ? '已选择 ' + value.name : '支持 MP3 格式，大小不超过 10MB'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />
          <div className="px-2 space-y-4">
            <div className="flex flex-col xs:flex-row gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>歌曲名称 *</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入歌曲名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>演唱者 *</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入演唱者" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col xs:flex-row gap-4">
              <FormField
                control={form.control}
                name="album"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>专辑名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入专辑名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>发行年份</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="请输入年份" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col xs:flex-row gap-4">
              <FormField
                control={form.control}
                name="lyricist"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>作词者</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入作词者" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="composer"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>作曲者</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入作曲者" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>歌曲评分 (1~10)</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={value => field.onChange(value[0])}
                        className={`w-full ${isMutating ? 'opacity-50' : ''}`}
                        disabled={isMutating}
                      />
                      <span className="w-12 text-center">{field.value}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>封面图片</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          if (file.size > MAX_FILE_SIZE) {
                            toast.error('图片大小不能超过1MB')
                            e.preventDefault()
                            e.target.value = ''
                            handleCoverImageChange(null)
                            return
                          }
                          if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                            toast.error('只支持 JPG, PNG 格式')
                            e.preventDefault()
                            e.target.value = ''
                            handleCoverImageChange(null)
                            return
                          }
                          handleCoverImageChange(file)
                          onChange(file)
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {value ? value.name : '支持 JPG, PNG 格式，大小不超过 1MB'}
                  </FormDescription>
                  {coverPreview && (
                    <div className="mt-2 relative w-fit pr-6">
                      <Image
                        src={coverPreview}
                        width={128}
                        height={128}
                        alt="歌曲封面"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <X
                        className="w-4 h-4 cursor-pointer hover:scale-125 transition-all absolute top-0 right-0"
                        onClick={() => {
                          handleCoverImageChange(null)
                        }}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>详细描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="补充其余的信息"
                      className="resize-y field-sizing-content"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>最多500个字符</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <p className="text-red-500">
              错误：{error instanceof Error ? error.message : (error?.toString() ?? '未知错误')}
            </p>
          )}
          <Button type="submit" className="w-full mt-6" disabled={isMutating}>
            {isMutating ? '保存中...' : '保存（可再次编辑）'}
          </Button>
        </fieldset>
      </form>
    </Form>
  )
}
