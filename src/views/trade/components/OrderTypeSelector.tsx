import History from '@/components/icons/set/History'
import { Badge } from '@/components/Badge'
import { useRouter } from '@/hooks/useRouter'
import { useTranslation } from '@/hooks/useTranslation'
import { useTradeStore } from '@/stores/tradeStore'
import { SessionType, TradeType } from '@/hooks/useCaCommon'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { MARKET_STATUS } from '@/config/constants'
import { useBaseStore } from '@/stores/baseStore'

export const OrderTypeSelector = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { account } = useActiveWeb3()
  const [isSignatureValid] = useSignatureValidStatus()
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
      
      {!!account && isSignatureValid && (
        <button
          className="relative flex items-center justify-center text-gray-400"
          onClick={() => router.push('/orders')}
        >
          <History size={20} />
          {/*<Badge />*/}
        </button>
      )}
    </div>
  )
}
