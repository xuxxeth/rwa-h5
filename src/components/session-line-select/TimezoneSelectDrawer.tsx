import { memo, useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { Drawer } from '@/components/drawer'

type TimezoneOption = {
  value: string
  timezone: string
  label: { en: string; zh: string }
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
  { value: 'Etc/UTC', timezone: 'Etc/UTC', label: { en: 'UTC', zh: '世界統一時' }, offset: 'UTC+0', group: 'common' },
  { value: 'exchange', timezone: 'America/New_York', label: { en: 'Exchange Time', zh: '交易所時間' }, offset: 'UTC-4', group: 'common' },
  { value: 'America/New_York', timezone: 'America/New_York', label: { en: 'New York, Washington (US East)', zh: '紐約，華盛頓（美東）' }, offset: 'UTC-4', group: 'global' },
  { value: 'Pacific/Auckland', timezone: 'Pacific/Auckland', label: { en: 'Wellington', zh: '惠靈頓' }, offset: 'UTC+12', group: 'global' },
  { value: 'Australia/Sydney', timezone: 'Australia/Sydney', label: { en: 'Sydney, Melbourne', zh: '悉尼，墨爾本' }, offset: 'UTC+10', group: 'global' },
  { value: 'Asia/Tokyo', timezone: 'Asia/Tokyo', label: { en: 'Tokyo, Seoul', zh: '東京，首爾' }, offset: 'UTC+9', group: 'global' },
  { value: 'Asia/Shanghai', timezone: 'Asia/Shanghai', label: { en: 'Beijing, Hong Kong, Singapore', zh: '北京，香港，新加坡' }, offset: 'UTC+8', group: 'global' },
  { value: 'Europe/Paris', timezone: 'Europe/Paris', label: { en: 'Paris, Berlin, Rome', zh: '巴黎，柏林，羅馬' }, offset: 'UTC+1', group: 'global' },
  { value: 'America/Sao_Paulo', timezone: 'America/Sao_Paulo', label: { en: 'São Paulo', zh: '聖保羅' }, offset: 'UTC-3', group: 'global' },
  { value: 'America/Chicago', timezone: 'America/Chicago', label: { en: 'Chicago, Houston (US Central)', zh: '芝加哥，休斯頓（美中）' }, offset: 'UTC-5', group: 'global' },
  { value: 'America/Los_Angeles', timezone: 'America/Los_Angeles', label: { en: 'Los Angeles, San Francisco (US West)', zh: '洛杉磯，舊金山（美西）' }, offset: 'UTC-7', group: 'global' },
  { value: 'Pacific/Honolulu', timezone: 'Pacific/Honolulu', label: { en: 'Honolulu (Hawaii)', zh: '檀香山（夏威夷）' }, offset: 'UTC-10', group: 'global' },
]

const groupedOptions = [
  { title: '常用选项', items: TIMEZONE_OPTIONS.filter(item => item.group === 'common') },
  { title: '全球主要时区', items: TIMEZONE_OPTIONS.filter(item => item.group === 'global') },
]

const TimezoneSelectDrawer = memo(({ open, onOpenChange, value, onChange }: TimezoneSelectDrawerProps) => {
  const [currentValue, setCurrentValue] = useState(value)
  const { i18n } = useTranslation()
  const isEnglish = i18n.language === 'en'

  const currentLabel = useMemo(() => {
    const selected = TIMEZONE_OPTIONS.find(item => item.value === currentValue)
    if (!selected) return ''
    return `${selected.offset} ${isEnglish ? selected.label.en : selected.label.zh}`
  }, [currentValue, isEnglish])

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
      title='时区设置'
      className='h-auto max-h-[72vh] rounded-t-[24px] border-none bg-[#1A1B1E]'
      overlayClassName='bg-[rgba(19,20,22,0.72)]'
    >
      <div className='px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
        {groupedOptions.map(group => (
          <div key={group.title} className='mt-2 first:mt-0'>
            <div className='px-1 py-2 text-[14px] font-medium text-white'>
              {isEnglish ? (group.title === '常用选项' ? 'Common' : 'Global Timezones') : group.title}
            </div>
            <div className='border-t border-white/5' />
            <div className='flex flex-col gap-1 pt-2'>
              {group.items.map(item => {
                const selected = item.value === currentValue
                return (
                  <button
                    key={`${group.title}-${item.value}-${item.label}`}
                    type='button'
                    className={cn(
                      'flex items-center justify-between rounded-[8px] px-1 py-3 text-[14px] transition-colors',
                      selected ? 'text-white' : 'text-white/80'
                    )}
                    onClick={() => handleSelect(item.value)}
                  >
                    <span>{isEnglish ? item.label.en : item.label.zh}</span>
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
