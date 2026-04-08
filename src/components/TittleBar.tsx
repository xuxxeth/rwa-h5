import ArrowLeft from '@/components/icons/set/ArrowLeft'
import { useRouter } from '@/hooks/useRouter'
import { cn } from '@/utils'

interface TittleBarProps {
  /** 页面标题 */
  title: string
  /** 自定义返回行为，不传则默认 router.back() */
  onBack?: () => void
  /** 右侧自定义内容 */
  right?: React.ReactNode
  className?: string
}

export const TittleBar = ({ title, onBack, right, className }: TittleBarProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className={cn('relative flex items-center py-[14px] bg-gray-975', className)}>
      {/* 返回按钮 */}
      <button className='flex items-center px-4 justify-center' onClick={handleBack}>
        <ArrowLeft size={20} />
      </button>

      {/* 标题居中 */}
      <span className='absolute left-1/2 -translate-x-1/2 text-[16px] font-medium text-white'>
        {title}
      </span>

      {/* 右侧插槽 */}
      {right && <div className='ml-auto'>{right}</div>}
    </div>
  )
}
