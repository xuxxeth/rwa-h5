import { memo, useEffect, useMemo, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { Button } from '@/components/ui/button'
import { NumberInput } from '@/components/v2/input/NumberInput'
import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { SLIPPAGE_INPUT_REGEX } from '@/utils/regex'
import { cn } from '@/lib/utils'
import { DEFAULT_SLIPPAGE, MARKET_STATUS } from "@/config/constants"
import { LazyImage } from "../image/LazyImage"
import { useBaseStore } from "@/stores/baseStore"


const MAX_SLIPPAGE = 3

export const SlippageDrawer = memo(() => {
  const { t } = useTranslation()
  const marketTradeState = useBaseStore(state => state.marketTradeState)
  const open = useTradeStore((s) => s.slippageDrawerOpen)
  const setOpen = useTradeStore((s) => s.setSlippageDrawerOpen)
  const slippage = useTradeStore((s) => s.slippage)
  const updateSlippage = useTradeStore((s) => s.updateSlippage)

  const sessionLabel = useMemo(() => {
    if (marketTradeState === MARKET_STATUS.OPEN || MARKET_STATUS.CLOSE) return ''
    return marketTradeState === MARKET_STATUS.OVERNIGHT ? t("marketQuotes.overnight")
      : marketTradeState === MARKET_STATUS.AFTER ? t("v3.t29") : t("v3.t27")
  }, [marketTradeState, t])

  // 0 = 推荐, 1 = 自定义
  const [current, setCurrent] = useState(0)
  const [currentValue, setCurrentValue] = useState(DEFAULT_SLIPPAGE)
  const [customValue, setCustomValue] = useState('')

  // 打开时同步当前 slippage 到本地状态
  useEffect(() => {
    if (!open) return
    if (slippage !== DEFAULT_SLIPPAGE) {
      setCurrent(1)
      setCurrentValue(DEFAULT_SLIPPAGE)
      setCustomValue(String(slippage))
    } else {
      setCurrent(0)
      setCurrentValue(DEFAULT_SLIPPAGE)
      setCustomValue('')
    }
  }, [open, slippage])

  const customNum = Number(customValue)
  const isCustomInvalid =
    current === 1 && (customNum <= 0 || customNum > MAX_SLIPPAGE)

  const handleConfirm = () => {
    const value = current === 0 ? currentValue || DEFAULT_SLIPPAGE : customNum
    updateSlippage(value)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} title={t('调整滑点')}>
      <div className='flex flex-col border-t border-gray-700'>
        <div className='flex flex-col gap-3 px-5 py-3'>
          {/* 推荐选项 */}
          <div className='flex items-center justify-between gap-x-2'>
            <div
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-[8px] border px-4 py-3 flex-1',
                current === 0 && currentValue === 0.5 ? 'border-green-50 bg-[rgba(37,167,80,0.2)] text-green-100' : 'border-gray-750 text-white'
              )}
              onClick={() => {
                setCurrent(0)
                setCurrentValue(0.5)
              }}
            >
              <span className={cn('text-[16px]')}>
                {t('v3.t3')}
              </span>
              <span className={cn('text-[16px]')}>
                {DEFAULT_SLIPPAGE}%
              </span>
            </div>
            <div
              className={cn(
                'flex cursor-pointer items-center justify-center rounded-[8px] border px-4 py-3 flex-1',
                current === 0 && currentValue === 0.1 ? 'border-green-50 bg-[rgba(37,167,80,0.2)] text-green-100' : 'border-gray-750 text-white'
              )}
              onClick={() => {
                setCurrent(0)
                setCurrentValue(0.1)
              }}
            >
              <span className={cn('text-[16px]')}>
                0.1%
              </span>
            </div>
            <div
              className={cn(
                'flex cursor-pointer items-center justify-center rounded-[8px] border px-4 py-3 flex-1',
                current === 0 && currentValue === 0.3 ? 'border-green-50 bg-[rgba(37,167,80,0.2)] text-green-100' : 'border-gray-750 text-white'
              )}
              onClick={() => {
                setCurrent(0)
                setCurrentValue(0.3)
              }}
            >
              <span className={cn('text-[16px]')}>
                0.3%
              </span>
            </div>
          </div>
          

          {/* 自定义输入 */}
          <div
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-[8px] border px-4 py-3',
              current === 1 ? 'border-green-50 bg-[rgba(37,167,80,0.2)]' : 'border-gray-750'
            )}
            onClick={() => setCurrent(1)}
          >
            <span className={cn('text-[16px]', current === 1 ? 'text-green-100' : 'text-white')}>
              {t('v3.t4')}
            </span>
            <div className='flex items-center gap-4'>
              <NumberInput
                className='h-auto w-[80px] text-center text-[16px]'
                placeholder={`0.1～${MAX_SLIPPAGE}`}
                regex={SLIPPAGE_INPUT_REGEX}
                value={customValue}
                onInput={v => {
                  setCustomValue(v)
                  setCurrent(1)
                }}
                onFocus={() => setCurrent(1)}
              />
              <span className={cn('text-[16px]', current === 1 ? 'text-green-100' : 'text-white')}>
                %
              </span>
            </div>
          </div>
          {
            sessionLabel && (
              <div className="pb-3 px-1  text-[12px] text-[#FFB219] flex">
                <div className="w-[18px] h-[18px] shrink-0 mr-2 relative -top-[1px]">
                  <LazyImage src="/images/v2/icons/warning.png" className="w-[18px] h-[18px]" />
                </div>
                
                <div>
                  {t('v3.t40', {session: sessionLabel})}
                </div>
              </div>
            )
          }
        </div>

        {/* 确认按钮 */}
        <div className='px-5 pb-3'>
          {/* Figma disabled 背景为 #282A2F (gray-800)，覆盖全局 Button 的 disabled:bg-gray-900 */}
          <Button
            disabled={isCustomInvalid}
            className='h-[48px] w-full rounded-[8px] disabled:bg-gray-800'
            onClick={handleConfirm}
          >
            {t('Confirm')}
          </Button>
        </div>
      </div>
    </Drawer>
  )
})

SlippageDrawer.displayName = 'SlippageDrawer'
