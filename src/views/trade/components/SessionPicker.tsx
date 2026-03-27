import { SessionTypeSelect } from '@/components/session-type-select'
import { useTradeStore } from '@/stores/tradeStore'
import { TradeType } from '@/hooks/useCaCommon'

export const SessionPicker = () => {
  const tradeType = useTradeStore(state => state.tradeType)
  const isMarket = tradeType === TradeType.MARKET

  // Session type selection is only available for limit orders
  if (isMarket) return null

  return (
    <SessionTypeSelect from="lite-trade" />
  )
}
