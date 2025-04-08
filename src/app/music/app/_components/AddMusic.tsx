import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function AddMusic() {
  return (
    <div>
      <Button asChild>
        <Link href={'/music/app/add-song'}>
          <Plus /> <span className="hidden md:block">添加歌曲</span>
        </Link>
      </Button>
    </div>
  )
}
