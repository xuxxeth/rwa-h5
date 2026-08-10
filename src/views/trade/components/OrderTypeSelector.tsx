import { useTranslation } from '@/hooks/useTranslation'
import { useTradeStore } from '@/stores/tradeStore'
import { SessionType, TradeType } from '@/hooks/useCaCommon'
import { MARKET_STATUS } from '@/config/constants'
import { useBaseStore } from '@/stores/baseStore'

export const OrderTypeSelector = () => {
  const { t } = useTranslation()
  const tradeType = useTradeStore(state => state.tradeType)
  const updateTradeType = useTradeStore(state => state.updateTradeType)
  const marketTradeState = useBaseStore(state => state.marketTradeState)
  const updateSessionType = useTradeStore(state => state.updateSessionType)

  return (
    <div className="flex items-center justify-between font-normal">
      <div className="flex items-center gap-1">
        <button
          className={`rounded-[8px] px-4 py-1 text-[14px] ${
            tradeType === TradeType.MARKET
              ? 'bg-gray-850 text-white'
              : 'text-gray-400'
          }`}
          onClick={() => {
            updateTradeType(TradeType.MARKET)
            // 这里要根据当前市场状态来更新下单的SessionType，暂时先写死
            if (marketTradeState === MARKET_STATUS.BEFORE) {
              updateSessionType(SessionType.PRE_MARKET_AND_AFTER_HOURS)
            }
            if (marketTradeState === MARKET_STATUS.OPEN) {
              updateSessionType(SessionType.DEFAULT)
            }
            if (marketTradeState === MARKET_STATUS.AFTER) {
              updateSessionType(SessionType.PRE_MARKET_AND_AFTER_HOURS)
            }
            if (marketTradeState === MARKET_STATUS.OVERNIGHT) {
              updateSessionType(SessionType.OVERNIGHT)
            }
            if (marketTradeState === MARKET_STATUS.CLOSED || marketTradeState === MARKET_STATUS.CLOSE) {
              updateSessionType(SessionType.DEFAULT)
            }
          }}
        >
          {t('market')}
        </button>
        <button
          className={`rounded-[8px] px-4 py-1 text-[14px] ${
            tradeType === TradeType.LIMIT
              ? 'bg-gray-850 text-white'
              : 'text-gray-400'
          }`}
          onClick={() => updateTradeType(TradeType.LIMIT)}
        >
          {t('limit')}
        </button>
      </div>
    </div>
  )
}
