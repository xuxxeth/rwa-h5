import SwapArrow from '@/components/icons/set/SwapArrow'
import EditPencil from '@/components/icons/set/EditPencil'
import { SlippageDrawer } from '@/components/drawer/SlippageDrawer'
import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
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
      <EstimatedFeeAccordion />

      {/* 滑点设置抽屉 */}
      <SlippageDrawer />
    </div>
  )
}
