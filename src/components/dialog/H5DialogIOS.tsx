'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'

export interface IH5DialogIOSProps {
  trigger?: string | React.ReactNode
  title?: string | React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  rightAction?: React.ReactNode
  hideDefaultClose?: boolean
}

export function H5DialogIOS({
  trigger,
  title,
  children,
  onClose,
  onOpenChange,
  rightAction,
  hideDefaultClose = false,
}: IH5DialogIOSProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    onOpenChange?.(nextOpen)
    if (!nextOpen) {
      onClose?.()
    }
  }, [onClose, onOpenChange])

  const handleClose = useCallback((event?: React.SyntheticEvent) => {
    event?.stopPropagation()
    event?.preventDefault()
    handleOpenChange(false)
  }, [handleOpenChange])

  return (
    <>
      <div className='cursor-pointer' onClick={() => handleOpenChange(true)}>
        {trigger}
      </div>
      {mounted && open && createPortal(
        <div className='fixed inset-0 z-50'>
          <div
            className='fixed inset-0 bg-black/80'
            onClick={() => handleOpenChange(false)}
          />
          <div
            className={cn(
              'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[24px] border border-[#41464F] bg-[#1A1B1E] text-white',
              'animate-in slide-in-from-bottom duration-200'
            )}
          >
            <div>
              <div className='px-6 text-center sm:text-left border-b border-solid border-[#41464F] flex justify-between items-center'>
                <div className='text-[16px] font-normal leading-none tracking-tight py-4'>
                  {title}
                </div>
                {rightAction ||
                  (!hideDefaultClose && (
                    <button
                      type='button'
                      aria-label='Close dialog'
                      className='cursor-pointer outline-none ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:outline-none w-8 flex justify-end h-[34px] items-center'
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                      onClick={handleClose}
                      onTouchEnd={handleClose}
                    >
                      <img
                        src='/images/v2/icons/close_light.png'
                        className='w-3 h-3'
                        alt=''
                      />
                    </button>
                  ))}
              </div>
              {children}
            </div>

            <div className='mx-auto mt-4 mb-4 h-[5px] w-[100px] rounded-full ' />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
