import SwapArrow from '@/components/icons/set/SwapArrow'
import EditPencil from '@/components/icons/set/EditPencil'
import { SlippageDrawer } from '@/components/drawer/SlippageDrawer'
import { useTradeStore } from '@/stores/tradeStore'
import { useBaseStore } from '@/stores/baseStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useCalcFee } from '@/hooks/useCalcFee'
import { useOrderBase } from '@/components/markets/TradeBox/useOrderBase'
import { useEffectivePrice } from '@/components/markets/TradeBox/useEffectivePrice'
import { EstimatedFeeAccordion } from './EstimatedFeeAccordion'

interface TradeSummaryProps {
  /** 如 "1 AMZNt" */
  fromAmount?: string
  /** 如 "300 USDT" */
  toAmount?: string
  /** 滑点值，如 "0.3% (推荐)" */
  slippage?: string
}

export const TradeSummary = ({
  fromAmount = '1 AMZNt',
  toAmount = '300 USDT',
  slippage = '0.3% (推荐)',
}: TradeSummaryProps) => {
  const { t } = useTranslation()
  const setSlippageDrawerOpen = useTradeStore((s) => s.setSlippageDrawerOpen)

  const inputToken = useTradeStore((s) => s.inputToken)
  const inputSize = useTradeStore((s) => s.inputSize)
  const limitPrice = useTradeStore((s) => s.limitPrice)
  const activeConvertTab = useTradeStore((s) => s.activeConvertTab)
  const tradeType = useTradeStore((s) => s.tradeType)
  const storeSlippage = useTradeStore((s) => s.slippage)
  const marketInfo = useBaseStore((s) => s.marketInfo)

  const isBuy = activeConvertTab === 'buy'

  const effectivePrice = useEffectivePrice({
    tradeType,
    action: activeConvertTab,
    limitPrice,
    slippage: storeSlippage,
  })

  const orderValue = useOrderBase(effectivePrice, inputSize)

  const { estimatedFee, platformFee, brokerageFee, tradingActivityFee } = useCalcFee(
    orderValue,
    inputSize,
    isBuy,
    inputToken?.feeRate,
  )

  const networkFeeInNative = marketInfo?.networkFeeInNative ?? '0'
  const feeSymbol = 'USDT'

  return (
    <div className="flex flex-col gap-2">
      {/* 兑换比例 */}
      <div className="flex items-center justify-center gap-1">
        <span className="text-[14px] text-gray-400">{fromAmount}</span>
        <SwapArrow size={14} className={'text-brand'} />
        <span className="text-[14px] text-gray-400">{toAmount}</span>
      </div>

      {/* 滑点 */}
      <div className="flex items-center justify-between">
        <span className="border-b border-dashed border-gray-400 text-[14px] text-gray-400">
          {t('v3.t2')}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[14px] text-white">{slippage}</span>
          <button className="text-white" onClick={() => setSlippageDrawerOpen(true)}>
            <EditPencil size={18} />
          </button>
        </div>
      </div>

      {/* 预估交易费用 - Accordion */}
      <EstimatedFeeAccordion
        feeLabel={t('v2.tx.t28')}
        estimatedFee={estimatedFee}
        feeSymbol={feeSymbol}
        items={[
          {
            label: t('v2.tx.t32'),
            value: `${brokerageFee} ${feeSymbol}`,
          },
          {
            label: t('v2.tx.t33'),
            value: `${tradingActivityFee} ${feeSymbol}`,
            visible: !isBuy,
          },
          {
            label: t('v2.tx.t34'),
            value: `${platformFee} ${feeSymbol}`,
          },
          {
            label: t('Network Fee'),
            value: `${networkFeeInNative} BNB`,
          },
        ]}
      />

      {/* 滑点设置抽屉 */}
      <SlippageDrawer />
    </div>
  )
}
