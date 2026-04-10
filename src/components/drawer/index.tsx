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
}

export const Drawer = ({ open, onOpenChange, title, children, className }: DrawerProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* 遮罩 */}
        <DialogPrimitive.Overlay className='fixed inset-0 z-[200] bg-[rgba(19,20,22,0.7)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />

        {/* 底部面板 */}
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-[201] flex flex-col rounded-t-[24px] border-t border-gray-700 bg-gray-900 shadow-[0px_-2px_3px_0px_rgba(0,0,0,0.05)] duration-300',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            className
          )}
        >
          {/* 无障碍 */}
          <DialogPrimitive.Title className='sr-only font-normal'>{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className='sr-only font-normal'>{title}</DialogPrimitive.Description>

          {/* 标题栏 */}
          <div className='flex items-center justify-between px-5 py-3 font-normal'>
            <span className='text-[16px] text-white'>{title}</span>
            <DialogPrimitive.Close className='flex items-center justify-center text-white'>
              <CloseX size={20} />
            </DialogPrimitive.Close>
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
