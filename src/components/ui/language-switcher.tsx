import { cn } from '@/utils'

interface LanguageSwitcherProps {
  /** 当前选中的语言 code */
  value: string
  /** 可选语言列表 */
  options: { code: string; label: string }[]
  onChange: (code: string) => void
  className?: string
}

/**
 * 紧凑型语言切换器 —— 类似 Figma 中 TW / EN 胶囊按钮
 */
export const LanguageSwitcher = ({
  value,
  options,
  onChange,
  className,
}: LanguageSwitcherProps) => {
  return (
    <div className={cn('flex items-center rounded bg-[#202129]', className)}>
      {options.map((opt) => {
        const isActive = opt.code === value
        return (
          <button
            key={opt.code}
            className={cn(
              'flex items-center justify-center rounded px-2 py-1 text-[12px] font-medium transition-colors min-w-[34px]',
              isActive
                ? 'bg-brand text-[#1A1B1E]'
                : 'text-[#848E9C]',
            )}
            onClick={() => onChange(opt.code)}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
