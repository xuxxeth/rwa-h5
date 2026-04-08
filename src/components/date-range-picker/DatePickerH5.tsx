import * as React from 'react'
import Picker from 'react-mobile-picker'
import { format, getYear, getMonth, getDate, getDaysInMonth, startOfDay, endOfDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { H5Dialog } from '@/components/dialog/H5Dialog'
import { DrawerClose } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'

export const FormatStr = 'yyyy-MM-dd'

type PickerValue = {
  year: string
  month: string
  day: string
}

export function DatePickerH5({
  userSelectedDate,
  onUserSelectedDateChanged,
  placeholder,
  className,
  activeColor,
  minDate,
  maxDate,
}: {
  userSelectedDate: number
  onUserSelectedDateChanged: (date?: number) => void
  placeholder?: string
  className?: string
  activeColor?: string
  minDate?: number | Date
  maxDate?: number | Date
}) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const isZh = React.useMemo(() => i18n.language.toLowerCase().startsWith('zh'), [i18n.language])

  const min = React.useMemo(
    () =>
      startOfDay(
        minDate instanceof Date
          ? minDate
          : typeof minDate === 'number'
            ? new Date(minDate)
            : new Date(1900, 0, 1)
      ),
    [minDate]
  )

  const max = React.useMemo(
    () =>
      endOfDay(
        maxDate instanceof Date
          ? maxDate
          : typeof maxDate === 'number'
            ? new Date(maxDate)
            : new Date()
      ),
    [maxDate]
  )

  const [rangeMin, rangeMax] = React.useMemo(
    () => (min.getTime() <= max.getTime() ? [min, max] : [max, min]),
    [min, max]
  )

  const clampedSelectedDate = React.useMemo(() => {
    if (userSelectedDate === undefined || userSelectedDate === null) return undefined
    const clampedTs = Math.min(Math.max(userSelectedDate, rangeMin.getTime()), rangeMax.getTime())
    return new Date(clampedTs)
  }, [userSelectedDate, rangeMin, rangeMax])

  const initial = React.useMemo(() => {
    return clampedSelectedDate ?? rangeMax
  }, [clampedSelectedDate, rangeMax])

  const [value, setValue] = React.useState<PickerValue>({
    year: String(getYear(initial)),
    month: String(getMonth(initial) + 1),
    day: String(getDate(initial)),
  })

  React.useEffect(() => {
    const d = clampedSelectedDate ?? rangeMax

    setValue({
      year: String(getYear(d)),
      month: String(getMonth(d) + 1),
      day: String(getDate(d)),
    })
  }, [clampedSelectedDate, rangeMax])

  const years = React.useMemo(() => {
    const start = getYear(rangeMin)
    const end = getYear(rangeMax)
    return Array.from({ length: end - start + 1 }, (_, i) => String(end - i))
  }, [rangeMin, rangeMax])

  const months = React.useMemo(() => {
    const y = Number(value.year)
    const minYear = getYear(rangeMin)
    const maxYear = getYear(rangeMax)

    let start = 1
    let end = 12

    if (y === minYear) start = getMonth(rangeMin) + 1
    if (y === maxYear) end = getMonth(rangeMax) + 1

    return Array.from({ length: end - start + 1 }, (_, i) => String(start + i))
  }, [value.year, rangeMin, rangeMax])

  const monthLabels = React.useMemo(() => {
    if (isZh) {
      return months.reduce<Record<string, string>>((acc, item) => {
        acc[item] = `${item}月`
        return acc
      }, {})
    }

    return months.reduce<Record<string, string>>((acc, item) => {
      acc[item] = format(new Date(2000, Number(item) - 1, 1), 'MMMM', { locale: enUS })
      return acc
    }, {})
  }, [isZh, months])

  const days = React.useMemo(() => {
    const y = Number(value.year)
    const m = Number(value.month)
    const total = getDaysInMonth(new Date(y, m - 1, 1))

    let start = 1
    let end = total

    if (y === getYear(rangeMin) && m === getMonth(rangeMin) + 1) {
      start = getDate(rangeMin)
    }

    if (y === getYear(rangeMax) && m === getMonth(rangeMax) + 1) {
      end = getDate(rangeMax)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => String(start + i))
  }, [value.year, value.month, rangeMin, rangeMax])

  React.useEffect(() => {
    if (!months.includes(value.month)) {
      setValue(prev => ({ ...prev, month: months[months.length - 1] }))
      return
    }

    if (!days.includes(value.day)) {
      setValue(prev => ({ ...prev, day: days[days.length - 1] }))
    }
  }, [months, days, value.month, value.day])

  const displayText = clampedSelectedDate
    ? isZh
      ? format(clampedSelectedDate, FormatStr)
      : format(clampedSelectedDate, 'MMM dd, yyyy', { locale: enUS })
    : ''

  const stopDrawerDrag = (event: React.SyntheticEvent) => {
    event.stopPropagation()
  }

  return (
    <H5Dialog
      onOpenChange={setOpen}
      title={placeholder}
      rightAction={
        <DrawerClose asChild>
          <button
            type='button'
            data-vaul-no-drag
            onPointerDown={stopDrawerDrag}
            onTouchStart={stopDrawerDrag}
            className="text-[#009DFF] text-[14px] font-normal relative before:content-[''] before:absolute before:-inset-2 before:bg-transparent"
            onClick={event => {
              const picked = new Date(
                Number(value.year),
                Number(value.month) - 1,
                Number(value.day)
              )
              const clampedTs = Math.min(
                Math.max(picked.getTime(), rangeMin.getTime()),
                rangeMax.getTime()
              )
              onUserSelectedDateChanged(clampedTs)
            }}
          >
            {t('Confirm')}
          </button>
        </DrawerClose>
      }
      trigger={
        <div
          className={cn(
            'w-full h-[56px] rounded-sm border border-white/10 text-white bg-transparent flex items-center justify-between px-3',
            className,
            open ? 'border-[rgba(156,255,58,0.5)]' : ''
          )}
          style={{ borderColor: open ? activeColor || '' : '' }}
        >
          <div className='text-[14px]'>
            {displayText ? (
              displayText
            ) : (
              <span className='text-[rgba(255,255,255,0.3)]'>{placeholder ?? ''}</span>
            )}
          </div>
          <CalendarIcon className='w-4 h-4' />
        </div>
      }
    >
      <div className='px-4 pb-4'>
        <div
          className='h-[220px]'
          onPointerDown={stopDrawerDrag}
          onPointerMove={stopDrawerDrag}
          onTouchStart={stopDrawerDrag}
          onTouchMove={stopDrawerDrag}
        >
          <Picker value={value} onChange={next => setValue(next as PickerValue)}>
            <Picker.Column name='year'>
              {years.map(item => (
                <Picker.Item key={item} value={item}>
                  {({ selected }) => (
                    <div
                      className={cn(
                        'text-center font-normal',
                        selected ? 'text-white text-[18px]' : 'text-[#9DA3AF] text-[16px]'
                      )}
                    >
                      {item}
                      {isZh ? '年' : ''}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
            <Picker.Column name='month'>
              {months.map(item => (
                <Picker.Item key={item} value={item}>
                  {({ selected }) => (
                    <div
                      className={cn(
                        'text-center font-normal',
                        selected ? 'text-white text-[18px]' : 'text-[#9DA3AF] text-[16px]'
                      )}
                    >
                      {monthLabels[item]}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
            <Picker.Column name='day'>
              {days.map(item => (
                <Picker.Item key={item} value={item}>
                  {({ selected }) => (
                    <div
                      className={cn(
                        'text-center font-normal',
                        selected ? 'text-white text-[18px]' : 'text-[#9DA3AF] text-[16px]'
                      )}
                    >
                      {item}
                      {isZh ? '日' : ''}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
        </div>
      </div>
    </H5Dialog>
  )
}
