import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LazyImage } from '../image/LazyImage'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { TooltipArrow } from '@radix-ui/react-tooltip'
import { useState, useCallback, useRef, useEffect } from 'react'

interface IconWithTooltipProps {
  icon?: string
  text?: string
  children?: React.ReactNode
  tooltip: React.ReactNode | string
  triggerClassName?: string
  iconOrTextClassName?: string
  tooltipClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function IconWithTooltip({
  icon,
  text,
  tooltip,
  children,
  triggerClassName,
  iconOrTextClassName,
  tooltipClassName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: IconWithTooltipProps) {
  const { t } = useTranslation()
  const [internalOpen, setInternalOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        controlledOnOpenChange?.(nextOpen)
      } else {
        setInternalOpen(nextOpen)
      }
    },
    [isControlled, controlledOnOpenChange]
  )

  const handleTriggerClick = useCallback(() => {
    handleOpenChange(!isOpen)
  }, [isOpen, handleOpenChange])

  // Close tooltip when tapping outside
  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (e: PointerEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        handleOpenChange(false)
      }
    }
    document.addEventListener('pointerdown', handleOutsideClick)
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
    }
  }, [isOpen, handleOpenChange])

  const renderTrigger = () => {
    if (children) {
      return children
    }
    return (
      <>
        {text && (
          <span className={cn('text-xs font-medium text-white', iconOrTextClassName)}>
            {t(text)}
          </span>
        )}
        {icon && <LazyImage src={icon} className={cn('w-6 h-6', iconOrTextClassName)} />}
      </>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0} open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <div
            ref={triggerRef}
            className={cn('cursor-pointer flex items-center justify-center', triggerClassName)}
            onClick={handleTriggerClick}
          >
            {renderTrigger()}
          </div>
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            'px-4 py-2 rounded-[8px] bg-gray-700 text-white font-normal text-xs duration-0 animate-none max-w-[250px]',
            tooltipClassName
          )}
          onPointerDownOutside={(e) => {
            e.preventDefault()
          }}
        >
          {typeof tooltip === 'string' ? t(tooltip) : tooltip}
          <TooltipArrow className='fill-gray-700' />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function TooltipWithBorder({
  text,
  tooltip,
  children,
  className
}: {
  text?: string,
  tooltip?: string,
  children?: React.ReactNode
  className?: string
}) {
  return (
    <IconWithTooltip tooltip={tooltip}>
      <div className={cn(
        'border-b border-dashed border-[#9DA3AF] text-[#9DA3AF] text-[12px]',
        className
      )}>
        { text || children }
      </div>
    </IconWithTooltip>
  )
}

export default IconWithTooltip
