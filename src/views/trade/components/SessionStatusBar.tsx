import { MARKET_STATUS } from '@/config/constants'
import { useTradingStartTime } from '@/hooks/useMarketState'
import { useTranslation } from '@/hooks/useTranslation'
import AfterHours from '@/components/icons/set/AfterHours'
import Closed from '@/components/icons/set/Closed'
import MarketOpen from '@/components/icons/set/MarketOpen'
import PreMarket from '@/components/icons/set/PreMarket'
import { memo, useMemo, type ComponentType } from 'react'
import type { SvgIconProps } from '@/components/icons/types'

interface SessionConfig {
  /** 当前时段标签, e.g. "盘前" */
  t1: string
  /** 距下一时段描述, e.g. "距盘中" */
  t2: string
  /** 主题色 */
  color: string
  /** 对应 SVG Icon 组件 */
  Icon: ComponentType<SvgIconProps>
}

export const SessionStatusBar = memo(() => {
  const { t } = useTranslation()
  const tradingTime = useTradingStartTime()

  const sessionConfig = useMemo<SessionConfig | null>(() => {
    if (!tradingTime) return null

    switch (tradingTime.tradeState) {
      case MARKET_STATUS.BEFORE:
        return {
          t1: t('v3.t11'),
          t2: t('v3.t15') + t('v3.t12') + t('Trade'),
          color: '#F59E0B',
          Icon: PreMarket,
        }
      case MARKET_STATUS.OPEN:
        return {
          t1: t('v3.t12'),
          t2: t('v3.t15') + t('v3.t13') + t('Trade'),
          color: '#10B981',
          Icon: MarketOpen,
        }
      case MARKET_STATUS.AFTER:
        return {
          t1: t('v3.t13'),
          t2: t('v3.t15') + t('v3.t14'),
          color: '#6366F1',
          Icon: AfterHours,
        }
      default:
        // CLOSE
        return {
          t1: t('v3.t14'),
          t2: t('v3.t15') + t('v3.t11') + t('Trade'),
          color: '#94A3B8',
          Icon: Closed,
        }
    }
  }, [t, tradingTime])

  if (!sessionConfig || !tradingTime) return null

  const { t1, t2, color, Icon } = sessionConfig
  const { countdown } = tradingTime

  return (
    <div className="flex items-center justify-center rounded-[8px] border border-gray-850 bg-gray-900 px-5 py-3">
      <div className="flex items-center gap-2">
        <Icon size={18} />
        <span className="text-[12px] text-white">{t1} | {t2}</span>
        <span className="text-[14px] font-mono" style={{ color }}>
          {countdown.H}H:{countdown.M}M:{countdown.S}S
        </span>
      </div>
    </div>
  )
})
