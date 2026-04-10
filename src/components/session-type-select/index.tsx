import { cn } from '@/lib/utils'
import { memo, useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { SessionType } from '@/hooks/useCaCommon'
import IconWithTooltip from '../icon-tooltip'
import { useBaseStore } from '@/stores/baseStore'
import { MARKET_STATUS } from '@/config/constants'
import { SessionSelectDrawer } from '@/components/drawer/SessionSelectDrawer'
import { useTradingStartTime } from '@/hooks/useMarketState'
import { useSupportRegular } from '@/hooks/useSupportRegular'

export type ISessionTypeItem = {
  code: string
  label: string
}

export type SessionTypeSelectProps = {
  value?: string
  onChange?: (code: ISessionTypeItem) => void
  className?: string
  label?: string
  orderValue?: string
  from?: string
}

const SessionTypeSelect = memo(
  ({ className, orderValue, from }: SessionTypeSelectProps) => {
    const { t } = useTranslation()
    const { isSupportRegular } = useSupportRegular()
    const inputToken = useTradeStore(state => state.inputToken)
    const tradingTime = useTradingStartTime()
    const marketTradeState = useBaseStore((state) => state.marketTradeState)
    const updateSessionType = useTradeStore((state) => state.updateSessionType)
    const [typeItem, setTypeItem] = useState<{ code: SessionType; label: string }>({
      code: SessionType.DEFAULT,
      label: t('v3.t16'),
    })

    const [drawerOpen, setDrawerOpen] = useState(false)
    const isRegular = useMemo(() => {
      return isSupportRegular(inputToken?.symbol || '') && (tradingTime?.tradeState === MARKET_STATUS.BEFORE || tradingTime?.tradeState === MARKET_STATUS.AFTER)
    }, [inputToken, tradingTime])
    const isOpenOrClose =
      marketTradeState === MARKET_STATUS.OPEN || marketTradeState === MARKET_STATUS.CLOSE

    useEffect(() => {
      // - 盘前/盘后时段，两个选项都支持选，默认为盘前+盘后（Extended Hour）
      // - 盘中/闭市时段，组件禁选，固定为盘中
      if (isRegular) {
        setTypeItem({
          code: SessionType.DEFAULT,
          label: t('v3.t16'),
        })
        updateSessionType(SessionType.DEFAULT)
        return
      }
      if (marketTradeState === MARKET_STATUS.CLOSE || marketTradeState === MARKET_STATUS.OPEN) {
        setTypeItem({ code: SessionType.DEFAULT, label: t('v3.t16') })
        updateSessionType(SessionType.DEFAULT)
      } else {
        setTypeItem({ code: SessionType.PRE_MARKET_AND_AFTER_HOURS, label: t('v3.t17') })
        updateSessionType(SessionType.PRE_MARKET_AND_AFTER_HOURS)
      }
    }, [marketTradeState, t, isRegular,])


    const sessionTypeList = useMemo(() => {
      return [
        {
          code: SessionType.PRE_MARKET_AND_AFTER_HOURS,
          label: t('v3.t17'),
          timeLabel: tradingTime ? `${tradingTime.preOpenTime.H}:${tradingTime.preOpenTime.M} ~ ${tradingTime.openTime.H}:${tradingTime.openTime.M} (${t('v3.t31')}) + ${tradingTime.closeTime.H}:${tradingTime.closeTime.M} ~ ${tradingTime.afterCloseTime.H}:${tradingTime.afterCloseTime.M} (${t('v3.t31')})` : '--:--',
          disabled: isRegular
        },
        {
          code: SessionType.DEFAULT,
          label: t('v3.t16'),
          timeLabel: tradingTime ? `${tradingTime.openTime.H}:${tradingTime.openTime.M} ~  ${tradingTime.closeTime.H}:${tradingTime.closeTime.M} (${t('v3.t31')})` : '--:--',
        }
      ]
    }, [t, tradingTime, isRegular])

    return (
      <>
        {/* Trigger bar */}
        <div
          className={cn(
            'flex h-[38px] cursor-pointer items-center justify-between rounded-[4px] bg-[#1A1B1E] px-3 py-0',
            className,
            from === 'lite-trade'
              ? 'bg-[#1A1B1E]'
              : 'border border-solid border-[rgba(35,36,39,1)]',
            isOpenOrClose ? 'border-[#232427]' : 'border-[#1A1B1E]'
          )}
        >
          <div className='flex w-full items-center justify-between gap-2 text-[14px] font-normal text-white'>
            <IconWithTooltip
              tooltip={
                <div>
                  <div>
                    <span className='font-semibold'>{t('v3.t16') ?? ' '}：</span>
                    <span>{t('v3.t19', {duration: sessionTypeList[1]?.timeLabel})}</span>
                  </div>
                  <div className='mt-2'>
                    <span className='font-semibold'>{t('v3.t17') ?? ' '}：</span>
                    <span>{t('v3.t20', {duration: sessionTypeList[0]?.timeLabel})}</span>
                  </div>
                </div>
              }
            >
              <div className='cursor-pointer border-b border-dashed border-[#9DA3AF] text-[14px] text-[#9DA3AF]'>
                {t('v3.t18') ?? ' '}
              </div>
            </IconWithTooltip>
            <div
              className='flex items-center'
              onClick={() => {
                if (!isOpenOrClose) {
                  setDrawerOpen(true)
                }
              }}
            >
              <span className='text-[#9DA3AF]'>{orderValue ?? ''}</span>
              <span className='ml-2 text-[14px] text-white'>{typeItem.label ?? '--'}</span>
              {!isOpenOrClose && <ChevronDown size={20} className='ml-1 text-white' />}
            </div>
          </div>
        </div>

        {/* Drawer */}
        <SessionSelectDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          value={typeItem.code}
          onChange={code => {
            const label = code === SessionType.DEFAULT ? t('v3.t16') : t('v3.t17')
            setTypeItem({ code, label })
            updateSessionType(code)
          }}
        />
      </>
    )
  },
)

export { SessionTypeSelect }



