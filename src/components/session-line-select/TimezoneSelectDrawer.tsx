import { memo, useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Drawer } from '@/components/drawer'

type TimezoneOption = {
  timezone: string
  label: string
  offset: string
  group: 'common' | 'global'
}

type TimezoneSelectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onChange: (timezone: string) => void
}

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { timezone: 'Etc/UTC', label: '世界统一时', offset: 'UTC+0', group: 'common' },
  { timezone: 'America/New_York', label: '交易所时间', offset: 'UTC-4', group: 'common' },
  { timezone: 'Pacific/Auckland', label: '惠灵顿', offset: 'UTC+12', group: 'global' },
  { timezone: 'Australia/Sydney', label: '悉尼，墨尔本', offset: 'UTC+10', group: 'global' },
  { timezone: 'Asia/Tokyo', label: '东京，首尔', offset: 'UTC+9', group: 'global' },
  { timezone: 'Asia/Shanghai', label: '北京，香港，新加坡', offset: 'UTC+8', group: 'global' },
  { timezone: 'Europe/Paris', label: '巴黎，柏林，罗马', offset: 'UTC+1', group: 'global' },
  { timezone: 'America/Sao_Paulo', label: '圣保罗', offset: 'UTC-3', group: 'global' },
  { timezone: 'America/New_York', label: '纽约，华盛顿（美东）', offset: 'UTC-4', group: 'global' },
  { timezone: 'America/Chicago', label: '芝加哥，休斯顿（美中）', offset: 'UTC-5', group: 'global' },
  { timezone: 'America/Los_Angeles', label: '洛杉矶，旧金山（美西）', offset: 'UTC-7', group: 'global' },
  { timezone: 'Pacific/Honolulu', label: '檀香山（夏威夷）', offset: 'UTC-10', group: 'global' },
]

const groupedOptions = [
  { title: '常用选项', items: TIMEZONE_OPTIONS.filter(item => item.group === 'common') },
  { title: '全球主要时区', items: TIMEZONE_OPTIONS.filter(item => item.group === 'global') },
]

const TimezoneSelectDrawer = memo(({ open, onOpenChange, value, onChange }: TimezoneSelectDrawerProps) => {
  const [currentValue, setCurrentValue] = useState(value)

  const currentLabel = useMemo(() => {
    const selected = TIMEZONE_OPTIONS.find(item => item.timezone === currentValue)
    if (!selected) return ''
    return `${selected.offset} ${selected.label}`
  }, [currentValue])

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleSelect = (timezone: string) => {
    setCurrentValue(timezone)
    onChange(timezone)
    onOpenChange(false)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title='时区设置'
      className='h-auto max-h-[72vh] rounded-t-[24px] border-none bg-[#1A1B1E]'
      overlayClassName='bg-[rgba(19,20,22,0.72)]'
    >
      <div className='px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
        {groupedOptions.map(group => (
          <div key={group.title} className='mt-2 first:mt-0'>
            <div className='px-1 py-2 text-[14px] font-medium text-white'>{group.title}</div>
            <div className='border-t border-white/5' />
            <div className='flex flex-col gap-1 pt-2'>
              {group.items.map(item => {
                const selected = item.timezone === currentValue
                return (
                  <button
                    key={`${group.title}-${item.timezone}-${item.label}`}
                    type='button'
                    className={cn(
                      'flex items-center justify-between rounded-[8px] px-1 py-3 text-[14px] transition-colors',
                      selected ? 'text-white' : 'text-white/80'
                    )}
                    onClick={() => handleSelect(item.timezone)}
                  >
                    <span>{item.label}</span>
                    <span className='flex items-center gap-2'>
                      <span className='text-white/60'>{item.offset}</span>
                      {selected ? <Check className='h-5 w-5 text-[#9CFF3A]' /> : <span className='w-5' />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  )
})

TimezoneSelectDrawer.displayName = 'TimezoneSelectDrawer'

export { TimezoneSelectDrawer, TIMEZONE_OPTIONS }
