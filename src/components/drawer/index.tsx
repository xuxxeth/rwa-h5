import * as DialogPrimitive from '@radix-ui/react-dialog'
import CloseX from '@/components/icons/set/CloseX'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  /** 额外的 content className */
  className?: string
  /** 额外的 overlay className */
  overlayClassName?: string
  modal?: boolean
  disableOutsideClose?: boolean
}

export const Drawer = ({
  open,
  onOpenChange,
  title,
  children,
  className,
  overlayClassName,
  modal = true,
  disableOutsideClose,
}: DrawerProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} modal={modal}>
      <DialogPrimitive.Portal>
        {/* 遮罩 */}
        <DialogPrimitive.Overlay className={cn('fixed inset-0 z-[200] bg-[rgba(19,20,22,0.7)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', overlayClassName)} />

        {/* 底部面板 */}
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-[201] flex flex-col bg-gray-900 duration-300',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            className
          )}
          onPointerDownOutside={(e) => {
            const _target = (e.target as HTMLElement)
            if (_target?.closest('#toast-root')) {
              e.preventDefault()
            }
            if (disableOutsideClose && _target.getAttribute('data-state') === 'open') {
              e.preventDefault()
            }
          }}
          onInteractOutside={(e) => {
            const _target = (e.target as HTMLElement)
            if (_target?.closest('#toast-root')) {
              e.preventDefault()
            }
            if (disableOutsideClose && _target.getAttribute('data-state') === 'open') {
              e.preventDefault()
            }
          }}
        >
          {/* 无障碍 */}
          <DialogPrimitive.Title className='sr-only font-normal'>{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className='sr-only font-normal'>{title}</DialogPrimitive.Description>

          {/* 标题栏 */}
          <div className='flex items-center justify-between px-5 py-3 font-normal rounded-t-[24px] border border-[#41464F] '>
            <span className='text-[16px] text-white'>{title}</span>
            {
              !disableOutsideClose && (
                <DialogPrimitive.Close className='flex items-center justify-center text-white'>
                  <CloseX size={20} />
                </DialogPrimitive.Close>
              )
            }
            
          </div>

          {/* 内容 */}
          {children}

          <div className='pb-[24px]' />
          
          {/* 底部安全区 */}
          <div className='pb-[env(safe-area-inset-bottom)]' />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
