import { cn } from '@/lib/utils'
import { memo, useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { SessionType } from '@/hooks/useCaCommon'
import IconWithTooltip from '../icon-tooltip'
import { useBaseStore } from '@/stores/baseStore'
import { MARKET_STATUS } from '@/config/constants'
import { SessionSelectDrawer } from '@/components/drawer/SessionSelectDrawer'

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
    const marketTradeState = useBaseStore((state) => state.marketTradeState)
    const updateSessionType = useTradeStore((state) => state.updateSessionType)
    const [typeItem, setTypeItem] = useState<{ code: SessionType; label: string }>({
      code: SessionType.DEFAULT,
      label: t('v3.t16'),
    })

    const isOpenOrClose =
      marketTradeState === MARKET_STATUS.OPEN || marketTradeState === MARKET_STATUS.CLOSE

    useEffect(() => {
      // - 盘前/盘后时段，两个选项都支持选，默认为盘前+盘后（Extended Hour）
      // - 盘中/闭市时段，组件禁选，固定为盘中
      if (marketTradeState === MARKET_STATUS.CLOSE || marketTradeState === MARKET_STATUS.OPEN) {
        setTypeItem({ code: SessionType.DEFAULT, label: t('v3.t16') })
        updateSessionType(SessionType.DEFAULT)
      } else {
        setTypeItem({ code: SessionType.PRE_MARKET_AND_AFTER_HOURS, label: t('v3.t17') })
        updateSessionType(SessionType.PRE_MARKET_AND_AFTER_HOURS)
      }
    }, [marketTradeState, t])

    const [drawerOpen, setDrawerOpen] = useState(false)

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
            isOpenOrClose ? 'border-[#232427]' : 'border-[#1A1B1E]',
          )}
          onClick={() => {
            if (!isOpenOrClose) {
              setDrawerOpen(true)
            }
          }}
        >
          <div className="flex w-full items-center justify-between gap-2 text-[14px] font-normal text-white">
            <IconWithTooltip
              tooltip={
                <div>
                  <div>
                    <span className="font-semibold">{t('v3.t16') ?? ' '}：</span>
                    <span>{t('v3.t19')}</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">{t('v3.t17') ?? ' '}：</span>
                    <span> {t('v3.t20')}</span>
                  </div>
                </div>
              }
            >
              <div className="cursor-pointer border-b border-dashed border-[#9DA3AF] text-[14px] text-[#9DA3AF]">
                {t('v3.t18') ?? ' '}
              </div>
            </IconWithTooltip>
            <div className="flex items-center">
              <span className="text-[#9DA3AF]">{orderValue ?? ''}</span>
              <span className="ml-2 text-[14px] text-white">{typeItem.label ?? '--'}</span>
              {!isOpenOrClose && <ChevronDown size={20} className="ml-1 text-white" />}
            </div>
          </div>
        </div>

        {/* Drawer */}
        <SessionSelectDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          value={typeItem.code}
          onChange={(code) => {
            const label =
              code === SessionType.DEFAULT ? t('v3.t16') : t('v3.t17')
            setTypeItem({ code, label })
            updateSessionType(code)
          }}
        />
      </>
    )
  },
)

export { SessionTypeSelect }



