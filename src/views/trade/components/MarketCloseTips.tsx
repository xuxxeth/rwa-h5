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

  if (tradeType === TradeType.MARKET && (marketTradeState === MARKET_STATUS.CLOSE)) {
    return <Warning>{t('v2.tx.t23')}</Warning>
  }

  if (tradeType === TradeType.LIMIT && marketTradeState === MARKET_STATUS.CLOSE) {
    return <Warning>{t('v2.tx.t231')}</Warning>
  }

  return null
}

export { MarketCloseTips }
