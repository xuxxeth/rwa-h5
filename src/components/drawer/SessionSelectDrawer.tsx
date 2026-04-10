import { memo, useMemo } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { SessionType } from '@/hooks/useCaCommon'
import { useTradingStartTime } from '@/hooks/useMarketState'
import CheckBlue from '@/components/icons/set/CheckBlue'
import { useTradeStore } from '@/stores/tradeStore'
import { useSupportRegular } from '@/hooks/useSupportRegular'
import { MARKET_STATUS } from '@/config/constants'
import { cn } from '@/utils/tw'

/* ────────────────────────── types ────────────────────────── */

interface SessionSelectDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: SessionType
  onChange: (code: SessionType) => void
}

interface SessionOption {
  code: SessionType
  label: string
  timeLabel: string
  disabled?: boolean
}

/* ────────────────────────── sub-components ───────────────── */

/** Single session row */
const SessionRow = memo(
  ({
    session,
    selected,
    onClick,
  }: {
    session: SessionOption
    selected: boolean
    onClick: () => void
  }) => (
    <div
      className="flex cursor-pointer items-center justify-between gap-1 bg-gray-900 px-5 py-5 active:bg-gray-850"
      onClick={() => {
        if (!session.disabled) {
          onClick()
        }
      }}
    >
      {/* Session label */}
      <span className={cn(
        "text-[16px] font-normal text-white",
        session.disabled ? 'text-gray-400' : 'text-white'
      )}>{session.label}</span>

      {/* Time label + check */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-normal text-gray-400">{session.timeLabel}</span>
        <div className="flex h-5 w-5 items-center justify-center">
          {selected && <CheckBlue size={20} color="var(--color-blue-50)" />}
        </div>
      </div>
    </div>
  ),
)
SessionRow.displayName = 'SessionRow'

/* ────────────────────────── main component ──────────────── */

export const SessionSelectDrawer = memo(
  ({ open, onOpenChange, value, onChange }: SessionSelectDrawerProps) => {
    const { t } = useTranslation()
    const tradingTime = useTradingStartTime()
    const { isSupportRegular } = useSupportRegular()
    const inputToken = useTradeStore(state => state.inputToken)
    const isRegular = useMemo(() => {
      return isSupportRegular(inputToken?.symbol || '') && (tradingTime?.tradeState === MARKET_STATUS.BEFORE || tradingTime?.tradeState === MARKET_STATUS.AFTER)
    }, [inputToken, tradingTime])


    const sessionTypeList = useMemo<SessionOption[]>(
      () => [
        {
          code: SessionType.DEFAULT,
          label: t('v3.t16'),
          timeLabel: tradingTime
            ? `ET ${tradingTime.openTime.H}:${tradingTime.openTime.M} ~ ${tradingTime.closeTime.H}:${tradingTime.closeTime.M}`
            : '--:--',
        },
        {
          code: SessionType.PRE_MARKET_AND_AFTER_HOURS,
          label: t('v3.t17'),
          timeLabel: tradingTime
            ? `ET ${tradingTime.preOpenTime.H}:${tradingTime.preOpenTime.M} ~ ${tradingTime.openTime.H}:${tradingTime.openTime.M} + ET ${tradingTime.closeTime.H}:${tradingTime.closeTime.M} ~ ${tradingTime.afterCloseTime.H}:${tradingTime.afterCloseTime.M}`
            : '--:--',
          disabled: isRegular
        },
      ],
      [t, tradingTime, isRegular],
    )


    return (
      <Drawer open={open} onOpenChange={onOpenChange} title={t('v3.t18')}>
        <div className="flex flex-col bg-gray-900">
          {sessionTypeList.map((session) => (
            <SessionRow
              key={session.code}
              session={session}
              selected={session.code === value}
              onClick={() => {
                onChange(session.code)
                onOpenChange(false)
              }}
            />
          ))}
        </div>
      </Drawer>
    )
  },
)

SessionSelectDrawer.displayName = 'SessionSelectDrawer'
