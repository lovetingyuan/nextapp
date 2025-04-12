import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="animate-pulse mt-[30vh] duration-700 flex flex-col items-center justify-center gap-4">
      <Loader2 className={'animate-spin text-primary'} size={48} />
      <p className="text-center text-muted-foreground font-medium">{'加载中...'}</p>
    </div>
  )
}
