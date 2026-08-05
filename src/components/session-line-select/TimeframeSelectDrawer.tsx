import { memo, useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Drawer } from '@/components/drawer'
import type { Timeframe } from '@/views/stock/utils/klineCharts'
import { useTranslation } from '@/hooks/useTranslation'

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1day',
  '1w': '1week',
  '1M': '1month',
}

type TimeframeSelectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: Timeframe
  onChange: (value: Timeframe) => void
  items: Timeframe[]
}

const TimeframeSelectDrawer = memo(({ open, onOpenChange, value, onChange, items }: TimeframeSelectDrawerProps) => {
  const { t } = useTranslation()
  const [currentValue, setCurrentValue] = useState<Timeframe>(value)

  const dataList = useMemo(
    () =>
      items.map(item => ({
        code: item,
        label: TIMEFRAME_LABELS[item],
      })),
    [items]
  )

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleSelect = (nextValue: Timeframe) => {
    setCurrentValue(nextValue)
    onChange(nextValue)
    onOpenChange(false)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={t('v4.t42')}
      className='h-auto max-h-[70vh] rounded-t-[24px] border-none bg-[#1A1B1E]'
      overlayClassName='bg-[rgba(19,20,22,0.72)]'
    >
      <div className='px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
        <div className='grid grid-cols-4 gap-3 pt-2'>
          {dataList.map(item => {
            const selected = item.code === currentValue
            return (
              <button
                key={item.code}
                type='button'
                className={cn(
                  'flex h-[36px] items-center justify-center rounded-[4px] border text-[14px] transition-colors',
                  selected
                    ? 'border-white text-white'
                    : 'border-[#2D3036] text-[#9DA3AF]'
                )}
                onClick={() => handleSelect(item.code)}
              >
                <span className='flex items-center gap-1'>
                  {item.label}
                  {selected ? <Check className='h-4 w-4 text-white' /> : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </Drawer>
  )
})

TimeframeSelectDrawer.displayName = 'TimeframeSelectDrawer'

export { TimeframeSelectDrawer }
