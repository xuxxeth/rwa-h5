import { memo, useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { Drawer } from '@/components/drawer'

export type IItemCode = {
  code: string
  label: string
}

export type SessionLineSelecttProps = {
  defaultValue?: string
  value?: string
  onChange?: (code: IItemCode) => void
  className?: string
  selected?: boolean
  language?: string
  triggerText?: string
}

// 0-全部,1-盘前;2-盘中;3-盘后;5-夜盘
const SessionLineSelectt = memo(
  ({ defaultValue, value, onChange, className, selected, triggerText }: SessionLineSelecttProps) => {
    const { t, i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const [currentCode, setCurrentCode] = useState<string>(defaultValue || value || '0')

    const dataList = useMemo(
      () => [
        { code: '0', label: t('v3.t26') },
        { code: '1', label: t('v3.t27') },
        { code: '2', label: t('v3.t28') },
        { code: '3', label: t('v3.t29') },
        { code: '5', label: t('v3.t34') },
      ],
      [t]
    )

    const currentLabel = useMemo(() => {
      const item = dataList.find(item => item.code === currentCode)
      return item?.label || ''
    }, [dataList, currentCode])

    useEffect(() => {
      setCurrentCode(defaultValue || value || dataList[0].code)
    }, [defaultValue, value, dataList])

    useEffect(() => {
      setCurrentCode(dataList[0].code)
    }, [i18n.language, dataList])

    const handleSelect = (code: string) => {
      setCurrentCode(code)
      const item = dataList.find(entry => entry.code === code)
      if (item) {
        onChange?.(item)
      }
      setOpen(false)
    }

    return (
      <>
        <button
          type='button'
          className={cn(
            'flex h-[14px] items-center gap-1 pl-4 text-white shadow-none',
            className
          )}
          onClick={() => setOpen(true)}
        >
          <div className='flex min-w-0 items-center gap-2 text-[12px]'>
            <span className={cn('truncate font-normal', selected ? 'text-white' : 'text-[#9DA3AF]')}>
              {currentLabel}
            </span>
            <span className='text-[#737A87]'>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.77811 7.56619C4.65802 7.72219 4.42275 7.72219 4.30266 7.56619L1.01508 3.2955C0.863224 3.09823 1.00385 2.8125 1.25281 2.8125L7.82797 2.8125C8.07692 2.8125 8.21755 3.09823 8.06569 3.2955L4.77811 7.56619Z" fill="#737A87"/>
              </svg>
            </span>
          </div>
        </button>

        <Drawer
          open={open}
          onOpenChange={setOpen}
          title={t('v3.t18')}
          className='h-auto max-h-[70vh] rounded-t-[24px] border-none bg-[#1A1B1E]'
          overlayClassName='bg-[rgba(19,20,22,0.72)]'
        >
          <div className='px-4 pt-1 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
            <div className='flex flex-col gap-2 pt-2'>
              {dataList.map(item => (
                <button
                  key={item.code}
                  type='button'
                  className={cn(
                    'flex h-[56px] items-center justify-between rounded-[8px] px-1 text-[13px] transition-colors',
                    item.code === currentCode ? 'text-white' : 'text-white/80'
                  )}
                  onClick={() => handleSelect(item.code)}
                >
                  <span>{item.label}</span>
                  {item.code === currentCode ? <Check className='h-5 w-5 text-[#9CFF3A]' /> : <span className='w-5' />}
                </button>
              ))}
            </div>
          </div>
        </Drawer>
      </>
    )
  }
)

export { SessionLineSelectt }
