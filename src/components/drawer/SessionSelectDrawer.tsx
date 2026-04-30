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
import IconWithTooltip from '../icon-tooltip'

/* ────────────────────────── types ────────────────────────── */

interface SessionSelectDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: SessionType
  onChange: (code: SessionType) => void,
  sessionTypeList: SessionOption[]
}

interface SessionOption {
  code: SessionType
  label: string
  timeLabel: string
  timeLabelLocal: string
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
  }) => {
    const { t } = useTranslation()
    return (
      <IconWithTooltip tooltipClassName=" pr-8" triggerClassName="w-full" 
        tooltip={session.disabled ? (<>
        <div className="text-[12px]">
          <span>{t('v3.t203') + ' '}</span>
          <span className="text-[#9DA3AF]">{session.timeLabel}</span> 
          {session.code === SessionType.PRE_MARKET_AND_AFTER_HOURS ? <br /> : null}
          （<span className="text-[#9DA3AF]">{t('v3.t204') + ' ' + session.timeLabelLocal}</span>）
          <span>{t('v3.t205')}</span>
        </div>
      </>) : undefined}
      >

      <div
        className={cn(
          "flex cursor-pointer items-center justify-between gap-1 bg-gray-900 px-5 py-5 active:bg-gray-850 w-full",
          session.disabled ? 'bg-gray-850' : ''
        )}
        onClick={() => {
          if (!session.disabled) {
            onClick()
          }
        }}
      >
        {/* Session label */}
        <span className={cn(
          "text-[16px] font-normal text-white shrink-0",
          session.disabled ? 'text-gray-400' : 'text-white'
        )}>{session.label}</span>

        {/* Time label + check */}
        <div className="flex items-center gap-2">
          <div className="text-[14px] font-normal text-gray-500 max-w-[160px] text-right">{session.timeLabel}</div>
          <div className="flex h-5 w-5 items-center justify-center">
            {selected && <CheckBlue size={20} color="var(--color-blue-50)" />}
          </div>
        </div>
      </div>
      </IconWithTooltip>

    )
  } ,
)
SessionRow.displayName = 'SessionRow'

/* ────────────────────────── main component ──────────────── */

export const SessionSelectDrawer = memo(
  ({ open, onOpenChange, value, onChange, sessionTypeList }: SessionSelectDrawerProps) => {
    const { t } = useTranslation()
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
