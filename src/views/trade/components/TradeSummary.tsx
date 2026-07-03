import { useState, useMemo } from 'react'
import SwapArrow from '@/components/icons/set/SwapArrow'
import EditPencil from '@/components/icons/set/EditPencil'
import { SlippageDrawer } from '@/components/drawer/SlippageDrawer'
import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { DEFAULT_SLIPPAGE } from '@/config/constants'
import { TradeType } from '@/hooks/useCaCommon'
import { EstimatedFeeAccordion } from './EstimatedFeeAccordion'
import { divide, toFixed, truncate } from '@/utils'
import IconWithTooltip from '@/components/icon-tooltip'
import { Row } from '@/components/drawer/OrderConfirmDrawer'


interface TradeSummaryProps {
  /** 最新价格 */
  latestPrice?: number
  /** 兑换来源数量，如 "1 AMZNt" */
  fromAmount: string
  /** 兑换目标数量，如 "300 USDT" */
  toAmount: string
  /** 滑点数值 */
  slippage: number
  /** 限价/市价，用于兑换比例展示 */
  limitPrice: string
  /** RWA token symbol，如 "AMZNt" */
  symbol: string
  /** 计价 token symbol，如 "USDT" */
  usdSymbol: string
  /** 预估手续费(总) */
  estimatedFee: string
  /** 平台费 */
  platformFee: string
  /** 经纪费 */
  brokerageFee: string
  feeRate: string,
  /** 网络费(原生币) */
  networkFeeInNative: string
  /** 是否买入 */
  isBuy: boolean
  /** RWA token 精度 */
  decimals: number
}

export const TradeSummary = ({
  latestPrice,
  fromAmount,
  toAmount,
  slippage,
  limitPrice,
  symbol,
  usdSymbol,
  estimatedFee,
  platformFee,
  brokerageFee,
  feeRate,
  networkFeeInNative,
  isBuy,
  decimals,
}: TradeSummaryProps) => {
  const { t } = useTranslation()
  const setSlippageDrawerOpen = useTradeStore((s) => s.setSlippageDrawerOpen)
  const tradeType = useTradeStore((s) => s.tradeType)

  // 兑换比例 toggle 状态
  const feeConfig = useTradeStore(state => state.feeConfig)
  const feeRateConfig = useMemo(() => {
      if (!feeConfig) return null
      return isBuy ? feeConfig.buyFeeRate : feeConfig.sellFeeRate
    },[feeConfig, isBuy])

  // 滑点展示，与 EstimatedInfo 保持一致
  const slippageDisplay = `${slippage}%${slippage === DEFAULT_SLIPPAGE ? ` (${t('v3.t3')})` : ''}`

  const feeSymbol = usdSymbol

  return (
    <div className="flex flex-col gap-2">
      {/* 兑换比例 */}
      {/* <div className="flex items-center gap-1">
        <span className="text-[14px] text-gray-400">{rateFrom}</span>
        <SwapArrow
          size={14}
          className={'cursor-pointer text-brand'}
          onClick={() => setIsRateReversed((prev) => !prev)}
        />
        <div className="text-[14px] text-gray-400 flex items-center">{rateTo}</div>
      </div> */}

      {/* 滑点 (仅市价单显示) */}
      {tradeType === TradeType.MARKET && (
        <div className="flex items-center justify-between">
          <IconWithTooltip
            tooltip={
              <div className="text-xs">
                <div className="text-white mt-1">{t('v3.t2')}</div>
                <div className="text-[#C7CCD6] mt-1">{t('v3.t6')}</div>
              </div>
            }
          >
            <span className="border-b border-dashed border-gray-400 text-[14px] text-gray-400 cursor-pointer">
              {t('v3.t2')}
            </span>
          </IconWithTooltip>
          <div className="flex items-center gap-1">
            <span className="text-[14px] text-white">{slippageDisplay}</span>
            <button className="text-white" onClick={() => setSlippageDrawerOpen(true)}>
              <EditPencil size={18} />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="border-b border-dashed border-gray-400 text-[14px] text-gray-400 cursor-pointer">
          {t('Network Fee')}
        </span>
        <div className="flex items-center gap-1 text-white">
          <div className='max-w-[140px] truncate text-[14px]' >{networkFeeInNative}</div> BNB
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
            value: <><div className='max-w-[140px] truncate'>{brokerageFee} </div> {feeSymbol}</>,
          },
          {
            label: t('v2.tx.t34'),
            value: <><div className='max-w-[140px] truncate'>{platformFee} </div> {feeSymbol}</>,
          },
          
        ]}
      />

      {/* 滑点设置抽屉 */}
      <SlippageDrawer />
    </div>
  )
}
