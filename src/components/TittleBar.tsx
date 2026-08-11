import { useEffect, useRef } from 'react'
import ArrowLeft from '@/components/icons/set/ArrowLeft'
import { PAGE_FROM } from '@/config/constants'
import { useRouter } from '@/hooks/useRouter'
import { cn } from '@/utils'
import storage from '@/utils/storage'

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
  const backTimerRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (backTimerRef.current) {
        window.clearTimeout(backTimerRef.current)
      }
    }
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    const pageFrom = storage.getItem(PAGE_FROM)
    if (pageFrom) {
      storage.removeItem(PAGE_FROM)
      router.push(pageFrom)
    } else {
      if (backTimerRef.current) {
        window.clearTimeout(backTimerRef.current)
      }

      backTimerRef.current = window.setTimeout(() => {
        router.replace('/')
      }, 500)

      router.back()
    }
  }

  return (
    <div className={cn('relative flex items-center py-[16px] bg-gray-975', className)}>
      {/* 返回按钮 */}
      <button className='flex items-center px-4 justify-center outline-0' onClick={handleBack}>
        <ArrowLeft size={20} />
      </button>

      {/* 标题居中 */}
      <span className='absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-white'>
        {title}
      </span>

      {/* 右侧插槽 */}
      {right && <div className='ml-auto'>{right}</div>}
    </div>
  )
}
