import History from '@/components/icons/set/History'
import { Badge } from '@/components/Badge'
import { useRouter } from '@/hooks/useRouter'
import { useTranslation } from '@/hooks/useTranslation'
import { useTradeStore } from '@/stores/tradeStore'
import { TradeType } from '@/hooks/useCaCommon'

export const OrderTypeSelector = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const tradeType = useTradeStore(state => state.tradeType)
  const updateTradeType = useTradeStore(state => state.updateTradeType)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <button
          className={`rounded-[8px] px-4 py-1 text-[14px] ${
            tradeType === TradeType.MARKET
              ? 'bg-gray-850 text-white'
              : 'text-gray-400'
          }`}
          onClick={() => updateTradeType(TradeType.MARKET)}
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
      <button
        className="relative flex items-center justify-center text-gray-400"
        onClick={() => router.push('/orders')}
      >
        <History size={20} />
        <Badge />
      </button>
    </div>
  )
}
