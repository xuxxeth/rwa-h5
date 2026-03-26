import SwapArrow from '@/components/icons/set/SwapArrow'
import EditPencil from '@/components/icons/set/EditPencil'
import ChevronDown from '@/components/icons/set/ChevronDown'

interface TradeSummaryProps {
  /** 如 "1 AMZNt" */
  fromAmount?: string
  /** 如 "300 USDT" */
  toAmount?: string
  /** 滑点值，如 "0.3% (推荐)" */
  slippage?: string
  /** 预估交易费用 */
  estimatedFee?: string
  onSlippageEdit?: () => void
  onFeeExpand?: () => void
}

export const TradeSummary = ({
  fromAmount = '1 AMZNt',
  toAmount = '300 USDT',
  slippage = '0.3% (推荐)',
  estimatedFee = '3.00 USDT',
  onSlippageEdit,
  onFeeExpand,
}: TradeSummaryProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* 兑换比例 */}
      <div className="flex items-center justify-center gap-1">
        <span className="text-[14px] text-gray-400">{fromAmount}</span>
        <SwapArrow size={14} />
        <span className="text-[14px] text-gray-400">{toAmount}</span>
      </div>

      {/* 滑点 */}
      <div className="flex items-center justify-between">
        <span className="border-b border-dashed border-gray-400 text-[14px] text-gray-400">
          滑点
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[14px] text-white">{slippage}</span>
          <button className="p-1" onClick={onSlippageEdit}>
            <EditPencil size={10} />
          </button>
        </div>
      </div>

      {/* 预估交易费用 */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-gray-400">预估交易费用</span>
        <div className="flex items-center gap-1">
          <span className="text-[14px] text-white">{estimatedFee}</span>
          <button onClick={onFeeExpand}>
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
