'use client'

import * as React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

export interface IH5DialogProps {
  trigger?: string | React.ReactNode
  title?: string | React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  rightAction?: React.ReactNode
  hideDefaultClose?: boolean
}

export function H5Dialog({
  trigger,
  title,
  children,
  onClose,
  onOpenChange,
  rightAction,
  hideDefaultClose = false,
}: IH5DialogProps) {
  const stopDrawerDrag = (event: React.SyntheticEvent) => {
    event.stopPropagation()
  }
  return (
    <Drawer onOpenChange={open => onOpenChange?.(open)} onClose={() => onClose?.()}>
      <DrawerTrigger asChild>
        <div className=' cursor-pointer'>{trigger}</div>
      </DrawerTrigger>
      <DrawerContent>
        <div className=''>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {rightAction ||
              (!hideDefaultClose && (
                <DrawerClose asChild>
                  <button
                    type='button'
                    aria-label='Close dialog'
                    data-vaul-no-drag
                    onPointerDown={stopDrawerDrag}
                    onTouchStart={stopDrawerDrag}
                    className='cursor-pointer'
                  >
                    <img
                      src='/images/v2/icons/close_light.png'
                      className='w-3 h-3'
                      alt=''
                    />
                  </button>
                </DrawerClose>
              ))}
          </DrawerHeader>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
