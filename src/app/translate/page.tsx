import { Languages } from 'lucide-react'

import TranslateForm from './_components/TranslateForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Translate',
  description: 'translate helper made by tingyuan',
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
