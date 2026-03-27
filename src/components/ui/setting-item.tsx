import { cn } from '@/utils'

interface SettingItemProps {
  /** 左侧标签 */
  label: string
  /** 右侧自定义内容 */
  children: React.ReactNode
  className?: string
}

/**
 * 通用设置行：左侧标签 + 右侧控件
 */
export const SettingItem = ({ label, children, className }: SettingItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-4',
        className,
      )}
    >
      <span className="text-[14px] font-medium text-[#9DA3AF]">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  )
}
