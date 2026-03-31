import { openScanUrl } from '@/utils/scan'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from './useTranslation'
import ToastSuccess from '@/components/icons/set/ToastSuccess'
import ToastError from '@/components/icons/set/ToastError'
import ToastWarning from '@/components/icons/set/ToastWarning'
import ToastInfo from '@/components/icons/set/ToastInfo'
import OpenOutline from '@/components/icons/set/OpenOutline'
import CloseX from '@/components/icons/set/CloseX'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface CustomToastOptions {
  title: string
  btnText?: string
  duration?: number
  type?: ToastType
  tx?: string
  onClick?: () => void
}

const TOAST_THEME: Record<ToastType, { color: string; icon: ReactNode }> = {
  success: { color: '#2EE4A7', icon: <ToastSuccess size={18} /> },
  error: { color: '#F63C6B', icon: <ToastError size={18} /> },
  warning: { color: '#FFB219', icon: <ToastWarning size={18} /> },
  info: { color: '#009DFF', icon: <ToastInfo size={18} /> },
}

interface ToastItemProps {
  t: string | number
  title: string
  btnText?: string
  duration: number
  color: string
  icon: ReactNode
  tx?: string
  onClick?: () => void
}

export function ToastItem({
  t,
  title,
  btnText,
  duration,
  color,
  icon,
  tx,
  onClick,
}: ToastItemProps) {
  const [paused, setPaused] = useState(false)
  const { t: $t } = useTranslation()
  return (
    <div
      className='relative flex w-[375px] items-center justify-between gap-3 overflow-hidden rounded-[8px] bg-gray-800 p-3 text-white'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 左侧内容 */}
      <div className='flex min-w-0 flex-1 items-center gap-3'>
        <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-850 p-[3px]'>
          {icon}
        </div>
        <div className='w-[220px] text-[12px] font-normal'>{title}</div>
      </div>

      {/* 右侧按钮 */}
      <div className='flex shrink-0 items-center gap-3'>
        {btnText && (
          <button
            className='px-2 py-1.5 text-[14px] font-medium'
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              toast.dismiss(t)
              onClick?.()
            }}
          >
            {btnText}
          </button>
        )}
        {tx && (
          <button
            className='inline-flex items-center gap-1 rounded px-2 py-1.5 text-[14px] text-white'
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              openScanUrl(tx)
            }}
          >
            {$t('v2.tx.t0')}
            <OpenOutline size={14} />
          </button>
        )}
        <button onClick={() => toast.dismiss(t)}>
          <CloseX size={16} />
        </button>
      </div>

      {/* 底部背景条 */}
      <div className='absolute bottom-0 left-0 right-0 h-[3px] rounded-[10px] bg-gray-700' />

      {/* 进度条 */}
      <div
        className='absolute bottom-0 left-0 right-0 h-[3px] origin-left'
        style={{
          backgroundColor: color,
          animation: `toast-progress ${duration}ms linear forwards`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      />
    </div>
  )
}

export function useToast() {
  function toastFun({ title, btnText, duration, type, tx, onClick }: CustomToastOptions) {
    const theme = TOAST_THEME[type ?? 'info']
    toast.custom(
      (t) => (
        <ToastItem
          t={t}
          title={title}
          btnText={btnText}
          duration={duration || 3000}
          color={theme.color}
          icon={theme.icon}
          tx={tx}
          onClick={onClick}
        />
      ),
      { duration: duration || 3000 },
    )
  }

  function toastSuccess(data: CustomToastOptions) {
    toastFun({ ...data, type: 'success' })
  }
  function toastError(data: CustomToastOptions) {
    toastFun({ ...data, type: 'error' })
  }
  function toastWarning(data: CustomToastOptions) {
    toastFun({ ...data, type: 'warning' })
  }
  function toastInfo(data: CustomToastOptions) {
    toastFun({ ...data, type: 'info' })
  }
  function toastShow(data: CustomToastOptions) {
    toastFun({ ...data })
  }

  return { toastSuccess, toastError, toastWarning, toastInfo, toastShow }
}
