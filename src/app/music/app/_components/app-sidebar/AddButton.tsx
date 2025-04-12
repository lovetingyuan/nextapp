import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Plus } from 'lucide-react'
import { useSidebarContext } from './context'

export default function AddButton() {
  const { setAddOpen } = useSidebarContext()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Plus
            onClick={() => {
              setAddOpen(true)
            }}
            className="scale-125"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>添加歌单</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
