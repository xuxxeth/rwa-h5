import { useBaseStore } from '@/stores/baseStore'
import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { MARKET_STATUS } from '@/config/constants'
import { TradeType } from 'ca-common-web'
import { Warning } from '@/components/Warning'

const MarketCloseTips = () => {
  const { t } = useTranslation()
  const marketTradeState = useBaseStore(state => state.marketTradeState)
  const tradeType = useTradeStore(state => state.tradeType)

  if (marketTradeState === MARKET_STATUS.OPEN || tradeType === TradeType.LIMIT) return null

  return <Warning>{t('v2.tx.t23')}</Warning>
}

export { MarketCloseTips }
