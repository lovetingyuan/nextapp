import { Languages } from 'lucide-react'

import type { Metadata } from 'next'
import TranslateForm from './_components/TranslateForm'

export const metadata: Metadata = {
  title: 'Translate', // 设置页面标题
  description: 'translate english helper', // 可选：设置页面描述
}

export default function Translate() {
  return (
    <div className="px-4 pt-4 pb-12 sm:p-10 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-normal">
        中英小翻译
        <Languages className="w-6 h-6 inline-block ml-2" />
      </h2>
      <TranslateForm />
    </div>
  )
}
