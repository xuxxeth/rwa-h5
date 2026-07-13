import { memo, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Drawer } from '@/components/drawer'
import { Button } from '@/components/ui/button'
import { LazyImage } from '@/components/image/LazyImage'
import { CheckBox } from '@/components/v2/check-box'
import { cn } from '@/utils/tw'
import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useSettingStore } from '@/stores/settingStore'
import { TooltipWithBorder } from '@/components/icon-tooltip'
import { useBaseStore } from '@/stores/baseStore'
import { TradeType, SessionType } from 'ca-common-web'
import { EstimatedFeeAccordion } from '@/views/trade/components/EstimatedFeeAccordion'

type OrderConfirmDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  networkFeeInNative?: string
  orderValue?: string
  platformFee: string
  brokerageFee: string
  estimatedFee: string
  action: string
  tradeType: TradeType
  sessionType: SessionType
  slippage: number
  feeRate: string
  onClick?: () => void
}

export const OrderConfirmDrawer = memo(
  ({
    open,
    onOpenChange,
    action,
    tradeType,
    sessionType,
    slippage,
    orderValue,
    platformFee,
    brokerageFee,
    estimatedFee,
    networkFeeInNative,
    feeRate,
    onClick,
  }: OrderConfirmDrawerProps) => {
    const { t } = useTranslation()
    const inputToken = useTradeStore((state) => state.inputToken)
    const outputToken = useTradeStore((state) => state.outputToken)
    const limitPrice = useTradeStore((state) => state.limitPrice)
    const inputSize = useTradeStore((state) => state.inputSize)
    const setShowConfirm = useSettingStore((state) => state.setShowConfirm)
    const [innerShow, setInnerShow] = useState(false)
    const feeSymbol = outputToken?.symbol || 'USDT'

    const symbol = outputToken?.symbol || 'USDT'

    const value = new BigNumber(orderValue || 0)
    const fee = new BigNumber(estimatedFee || 0)

    const total = action === 'buy' ? value.plus(fee) : value.minus(fee)

    const allFee = `${total.toFixed(2)} ${symbol}`
    const feeConfig = useTradeStore(state => state.feeConfig)

    const feeRateConfig = useMemo(() => {
      if (!feeConfig) return null
      return action === 'buy' ? feeConfig.buyFeeRate : feeConfig.sellFeeRate
    },[feeConfig, action])

    const feeRatePercent = useMemo(() => {
      return Number(feeRate) > 0 ? 
        `${(Number(feeRate) * 100).toFixed(2).replace(/\.?0+$/, '')}%` : 
        feeRateConfig ? `${(Number(feeRateConfig.platformFeeRate?.value) * 100).toFixed(2).replace(/\.?0+$/, '')}%` : '--'
    }, [feeRate, feeRateConfig?.platformFeeRate?.value]);
    
    const isMarketOrder = tradeType === TradeType.MARKET

    return (
      <Drawer open={open} onOpenChange={onOpenChange} title={t('v2.tx.t29')}>
        <div className="flex flex-col gap-4 px-5 py-4">
          {/* Token amounts section */}
          <div
            className={cn(
              'flex flex-col gap-1',
              action === 'buy' ? 'flex-col-reverse' : '',
            )}
          >
            {/* Input token row */}
            <div className="flex items-center justify-between py-1">
              <span className="text-[20px] font-normal text-white">
                {inputSize}&nbsp;{inputToken?.symbol}
              </span>
              {inputToken?.icon && (
                <LazyImage
                  src={inputToken.icon}
                  className="h-8 w-8 rounded-full"
                />
              )}
            </div>

            {/* Arrow down */}
            <div className="py-0.5">
              <LazyImage
                src="/images/v2/icons/arrow-down2.png"
                className="h-[18px] w-[18px]"
              />
            </div>

            {/* Output token row */}
            <div className="flex items-center justify-between py-1">
              <span className="text-[20px] font-normal text-white">
                {orderValue ?? ''} {outputToken?.symbol}
              </span>
              {outputToken?.icon && (
                <LazyImage
                  src={outputToken.icon}
                  className="h-8 w-8 rounded-full"
                />
              )}
            </div>
          </div>

          {/* Order details */}
          <div className="flex flex-col gap-1">
            <Row
              label={t('v2.tx.t30')}
              value={isMarketOrder ? t('market') : t('limit')}
            />
            <Row
              label={t('v3.t18')}
              value={
                sessionType === SessionType.OVERNIGHT ? t('v3.t171') :
                sessionType === SessionType.PRE_MARKET_AND_AFTER_HOURS
                  ? t('v3.t17')
                  : t('v3.t16')
              }
            />
            {!isMarketOrder && (
              <Row label={t('Limit price')} value={`${limitPrice}`} />
            )}
            {isMarketOrder && (
              <Row label={t('v3.t2')} value={`${slippage}%`} />
            )}
            
            
            <Row
              label={
                <TooltipWithBorder tooltip={t('v2.tx.t311')}>
                  {t('v2.tx.t31')}
                </TooltipWithBorder>
              }
              value={`${orderValue} ${feeSymbol}`}
            />
            <Row
              label={t('Network Fee')}
              value={`${networkFeeInNative}`}
            />

            {/* Estimated fee with expand */}
            <EstimatedFeeAccordion
              variant="confirm"
              feeLabel={t('v2.tx.t28')}
              estimatedFee={estimatedFee}
              feeSymbol={feeSymbol}
              items={[
                {
                  label: (
                    <TooltipWithBorder tooltip={t('v2.tx.t321', {r1: feeRateConfig?.brokerageFeeRate?.value || '--', r2: feeRateConfig?.brokerageFeeRate?.minValue || '--'})}>
                      {t('v2.tx.t32')}
                    </TooltipWithBorder>
                  ),
                  value: `${brokerageFee} ${feeSymbol}`,
                },
                {
                  label: (
                    <TooltipWithBorder
                      tooltip={t('v2.tx.t341', { r1: feeRatePercent })}
                    >
                      {t('v2.tx.t34')}
                    </TooltipWithBorder>
                  ),
                  value: `${platformFee} ${feeSymbol}`,
                },
              ]}
            />
          </div>

          {/* Separator */}
          <div className="h-px bg-gray-750" />

          {/* Total + confirm */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-1">
              <span className="text-[16px] font-normal text-white">
                {action === 'buy' ? t('v2.tx.t26') : t('v2.tx.t27')}
              </span>
              <span className="text-[16px] font-normal text-white">
                {allFee}
              </span>
            </div>

            <Button
              className="h-[48px] w-full rounded-[8px] bg-white text-[14px] font-medium text-black hover:bg-white/90"
              onClick={() => {
                setShowConfirm(!innerShow)
                onClick?.()
              }}
            >
              {t('Confirm')}
            </Button>

            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setInnerShow((prev) => !prev)}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <CheckBox checked={innerShow} onChange={(e) => setInnerShow(e)} />
              </div>
              <span className="relative top-[-1px] text-[14px] font-normal text-gray-400">
                {t('v2.tx.t35')}
              </span>
            </div>
          </div>
        </div>
      </Drawer>
    )
  },
)

OrderConfirmDrawer.displayName = 'OrderConfirmDrawer'

/* ── Helper: single row ── */
export function Row({
  label,
  value,
}: {
  label: React.ReactNode
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="text-[14px] font-normal text-gray-400">{label}</div>
      <div className="text-[14px] font-normal text-white">{value}</div>
    </div>
  )
}
