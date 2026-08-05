import { memo, useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { Drawer } from '@/components/drawer'

type TimezoneOption = {
  value: string
  timezone: string
  labelKey: string
  offset: string
  group: 'common' | 'global'
}

type TimezoneSelectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onChange: (value: string) => void
}

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: 'Etc/UTC', timezone: 'Etc/UTC', labelKey: 'v4.t13', offset: 'UTC+0', group: 'common' },
  { value: 'exchange', timezone: 'America/New_York', labelKey: 'v4.t14', offset: 'UTC-4', group: 'common' },
  { value: 'America/New_York', timezone: 'America/New_York', labelKey: 'v4.t15', offset: 'UTC-4', group: 'global' },
  { value: 'Pacific/Auckland', timezone: 'Pacific/Auckland', labelKey: 'v4.t16', offset: 'UTC+12', group: 'global' },
  { value: 'Australia/Sydney', timezone: 'Australia/Sydney', labelKey: 'v4.t17', offset: 'UTC+10', group: 'global' },
  { value: 'Asia/Tokyo', timezone: 'Asia/Tokyo', labelKey: 'v4.t18', offset: 'UTC+9', group: 'global' },
  { value: 'Asia/Shanghai', timezone: 'Asia/Shanghai', labelKey: 'v4.t19', offset: 'UTC+8', group: 'global' },
  { value: 'Europe/Paris', timezone: 'Europe/Paris', labelKey: 'v4.t20', offset: 'UTC+1', group: 'global' },
  { value: 'America/Sao_Paulo', timezone: 'America/Sao_Paulo', labelKey: 'v4.t21', offset: 'UTC-3', group: 'global' },
  { value: 'America/Chicago', timezone: 'America/Chicago', labelKey: 'v4.t22', offset: 'UTC-5', group: 'global' },
  { value: 'America/Los_Angeles', timezone: 'America/Los_Angeles', labelKey: 'v4.t23', offset: 'UTC-7', group: 'global' },
  { value: 'Pacific/Honolulu', timezone: 'Pacific/Honolulu', labelKey: 'v4.t24', offset: 'UTC-10', group: 'global' },
]

const groupedOptions = [
  { titleKey: 'v4.t11', items: TIMEZONE_OPTIONS.filter(item => item.group === 'common') },
  { titleKey: 'v4.t12', items: TIMEZONE_OPTIONS.filter(item => item.group === 'global') },
]

const TimezoneSelectDrawer = memo(({ open, onOpenChange, value, onChange }: TimezoneSelectDrawerProps) => {
  const [currentValue, setCurrentValue] = useState(value)
  const { t } = useTranslation()

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleSelect = (nextValue: string) => {
    setCurrentValue(nextValue)
    onChange(nextValue)
    onOpenChange(false)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={t('v4.t10')}
      className='h-auto max-h-[72vh] rounded-t-[24px] border-none bg-[#1A1B1E]'
      overlayClassName='bg-[rgba(19,20,22,0.72)]'
    >
      <div className='px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
        {groupedOptions.map(group => (
          <div key={group.titleKey} className='mt-2 first:mt-0'>
            <div className='px-1 py-2 text-[14px] font-medium text-white'>{t(group.titleKey)}</div>
            <div className='border-t border-white/5' />
            <div className='flex flex-col gap-1 pt-2'>
              {group.items.map(item => {
                const selected = item.value === currentValue
                return (
                  <button
                    key={`${group.titleKey}-${item.value}-${item.labelKey}`}
                    type='button'
                    className={cn(
                      'flex items-center justify-between rounded-[8px] px-1 py-3 text-[14px] transition-colors',
                      selected ? 'text-white' : 'text-white/80'
                    )}
                    onClick={() => handleSelect(item.value)}
                  >
                    <span>{t(item.labelKey)}</span>
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
