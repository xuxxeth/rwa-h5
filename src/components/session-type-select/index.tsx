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
import { useNotSupportSession } from '@/hooks/useNotSupportSession'
import { useDisabledNight10 } from '@/hooks/useLimitNight10'

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
    const isOpenOrClose =
      marketTradeState === MARKET_STATUS.OPEN || marketTradeState === MARKET_STATUS.CLOSE
    const isRegular = useMemo(() => {
      return isSupportRegular(inputToken?.symbol || '') && (tradingTime?.tradeState === MARKET_STATUS.BEFORE || tradingTime?.tradeState === MARKET_STATUS.AFTER || tradingTime?.tradeState === MARKET_STATUS.OVERNIGHT)
    }, [inputToken, tradingTime])

    const { notSupportBeforeOrAfter, notSupportOvernight } = useNotSupportSession(marketTradeState, inputToken)
    const { disabled: disabledNight10 } = useDisabledNight10()

    const sessionTypeList = useMemo(() => {
      return [
        {
          code: SessionType.PRE_MARKET_AND_AFTER_HOURS,
          label: t('v3.t17'),
          timeLabel: tradingTime ? `${t('v3.t31')}: ${tradingTime.preOpenTime.H}:${tradingTime.preOpenTime.M} ~ ${tradingTime.openTime.H}:${tradingTime.openTime.M} + ${t('v3.t31')}: ${tradingTime.closeTime.H}:${tradingTime.closeTime.M} ~ ${tradingTime.afterCloseTime.H}:${tradingTime.afterCloseTime.M}` : '--:--',
          timeLabelLocal: tradingTime ? `${tradingTime.preOpenTimeLocal.H}:${tradingTime.preOpenTimeLocal.M} ~ ${tradingTime.openTimeLocal.H}:${tradingTime.openTimeLocal.M} + ${tradingTime.closeTimeLocal.H}:${tradingTime.closeTimeLocal.M} ~ ${tradingTime.afterCloseTimeLocal.H}:${tradingTime.afterCloseTimeLocal.M}` : '--:--',
          disabled: isRegular || tradingTime?.tradeState === MARKET_STATUS.OVERNIGHT || tradingTime?.tradeState === MARKET_STATUS.OPEN || tradingTime?.tradeState === MARKET_STATUS.CLOSE || notSupportBeforeOrAfter.notSupport, // 盘前盘后时间段，在夜盘、盘中和闭市状态下不可选
        },
        {
          code: SessionType.DEFAULT,
          label: t('v3.t16'),
          timeLabel: tradingTime ? `${t('v3.t31')}: ${tradingTime.openTime.H}:${tradingTime.openTime.M} ~ ${tradingTime.closeTime.H}:${tradingTime.closeTime.M}` : '--:--',
          timeLabelLocal: tradingTime ? `${tradingTime.openTimeLocal.H}:${tradingTime.openTimeLocal.M} ~ ${tradingTime.closeTimeLocal.H}:${tradingTime.closeTimeLocal.M}` : '--:--'
        },
        {
          code: SessionType.OVERNIGHT,
          label: t('v3.t171'),
          timeLabel: tradingTime ? `${t('v3.t31')}: ${tradingTime.nightTradingStartTime.H}:${tradingTime.nightTradingStartTime.M} ~ ${tradingTime.nightTradingEndTime.H}:${tradingTime.nightTradingEndTime.M}` : '--:--',
          timeLabelLocal: tradingTime ? `${tradingTime.nightTradingStartTimeLocal.H}:${tradingTime.nightTradingStartTimeLocal.M} ~ ${tradingTime.nightTradingEndTimeLocal.H}:${tradingTime.nightTradingEndTimeLocal.M}` : '--:--',
          // 夜盘时间段，仅在夜盘状态下可选
          disabled: tradingTime?.tradeState !== MARKET_STATUS.OVERNIGHT || notSupportOvernight.notSupport || disabledNight10
        }
      ]
    }, [t, tradingTime, isRegular, notSupportBeforeOrAfter.notSupport, notSupportOvernight.notSupport, disabledNight10])

    useEffect(() => {
      // 盘前盘后，只支持盘中交易的股票，在盘前盘后和夜盘状态，默认显示盘中
      if (isRegular) {
        setTypeItem({
          code: SessionType.DEFAULT,
          label: t('v3.t16'),
        })
        updateSessionType(SessionType.DEFAULT)
      }
      // 闭闹和盘中
      else if (marketTradeState === MARKET_STATUS.CLOSE || marketTradeState === MARKET_STATUS.OPEN) {
        setTypeItem({
          code: SessionType.DEFAULT,
          label: t('v3.t16'),
        })
        updateSessionType(SessionType.DEFAULT)
      }
      // 夜盘
      else if (marketTradeState === MARKET_STATUS.OVERNIGHT) {
        // 如果当前是夜盘时间，但不支持夜盘交易，则默认选中仅盘中
        if (notSupportOvernight.notSupport || disabledNight10) {
          setTypeItem({
            code: SessionType.DEFAULT,
            label: t('v3.t16'),
          })
          updateSessionType(SessionType.DEFAULT)
        } else {
            setTypeItem({
            code: SessionType.OVERNIGHT,
            label: t('v3.t171'),
          })
          updateSessionType(SessionType.OVERNIGHT)
        }
        
      } else {
        // 如果不支持盘前或盘后单，则默认选中仅盘中
        if (notSupportBeforeOrAfter.notSupport) {
          setTypeItem({
            code: SessionType.DEFAULT,
            label: t('v3.t16'),
          })
          updateSessionType(SessionType.DEFAULT)
        }  else {
          // 其他情况默认选中盘前盘后 
          setTypeItem({
            code: SessionType.PRE_MARKET_AND_AFTER_HOURS,
            label: t('v3.t17'),
          })
          updateSessionType(SessionType.PRE_MARKET_AND_AFTER_HOURS)
        }
      }
    }, [marketTradeState, isRegular, t, notSupportBeforeOrAfter.notSupport, notSupportOvernight.notSupport, updateSessionType, disabledNight10])


    return (
      <>
        {/* Trigger bar */}
        <div
          className={cn(
            'flex h-[38px] cursor-pointer items-center justify-between rounded-[4px] bg-[#1A1B1E] px-3 py-0',
            className,
            from === 'lite-trade'
              ? 'bg-[#1A1B1E]'
              : 'border border-solid border-[#1A1B1E]',
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
                  <div className="mt-2">
                    <span className=" font-semibold">{t('marketQuotes.overnight') ?? ' '}：</span>
                    <span> {t('v3.t201', {duration: sessionTypeList[2]?.timeLabel})}</span>
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
                setDrawerOpen(true)
              }}
            >
              <span className='text-[#9DA3AF]'>{orderValue ?? ''}</span>
              <span className='ml-2 text-[14px] text-white'>{typeItem.label ?? '--'}</span>
              {<ChevronDown size={20} className='ml-1 text-white' />}
            </div>
          </div>
        </div>

        {/* Drawer */}
        <SessionSelectDrawer
          sessionTypeList={sessionTypeList}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          value={typeItem.code}
          onChange={code => {
            const label = code === SessionType.OVERNIGHT ? t('v3.t171') : code === SessionType.DEFAULT ? t('v3.t16') : t('v3.t17')
            setTypeItem({ code, label })
            updateSessionType(code)
          }}
        />
      </>
    )
  },
)

export { SessionTypeSelect }



