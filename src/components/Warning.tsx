import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import InfoWarning from '@/components/icons/set/InfoWarning'

interface WarningProps {
  children: ReactNode
  className?: string
}

const Warning = ({ children, className }: WarningProps) => {
  return (
    <div
      className={cn(
        'flex gap-1.5 rounded-[6px] bg-gray-900 p-3',
        className,
      )}
    >
      <InfoWarning size={18} className="shrink-0" />
      <div className="text-[12px] leading-[1.25em] text-yellow-50">
        {children}
      </div>
    </div>
  )
}

export { Warning }
