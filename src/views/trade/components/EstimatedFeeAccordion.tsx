import * as Accordion from '@radix-ui/react-accordion'
import ChevronDown from '@/components/icons/set/ChevronDown'
import { useTranslation } from '@/hooks/useTranslation'
import { useCalcFee } from '@/hooks/useCalcFee'
import { useBaseStore } from '@/stores/baseStore'
import { useTradeStore } from '@/stores/tradeStore'
import { useOrderBase } from '@/components/markets/TradeBox/useOrderBase'
import { useEffectivePrice } from '@/components/markets/TradeBox/useEffectivePrice'

interface EstimatedFeeAccordionProps {
  className?: string
}

export const EstimatedFeeAccordion = ({ className }: EstimatedFeeAccordionProps) => {
  const { t } = useTranslation()

  const inputToken = useTradeStore((s) => s.inputToken)
  const inputSize = useTradeStore((s) => s.inputSize)
  const limitPrice = useTradeStore((s) => s.limitPrice)
  const activeConvertTab = useTradeStore((s) => s.activeConvertTab)
  const tradeType = useTradeStore((s) => s.tradeType)
  const slippage = useTradeStore((s) => s.slippage)
  const marketInfo = useBaseStore((s) => s.marketInfo)

  const isBuy = activeConvertTab === 'buy'

  const effectivePrice = useEffectivePrice({
    tradeType,
    action: activeConvertTab,
    limitPrice,
    slippage,
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
    <Accordion.Root type='single' collapsible className={className}>
      <Accordion.Item value='fee-details'>
        {/* Header trigger */}
        <Accordion.Trigger className='group flex w-full items-center justify-between'>
          <span className='text-[14px] text-gray-400'>{t('v2.tx.t28')}</span>
          <div className='flex items-center gap-1'>
            <span className='text-[14px] text-white'>
              {estimatedFee} {feeSymbol}
            </span>
            <ChevronDown
              size={20}
              className='text-white transition-transform duration-200 group-data-[state=open]:rotate-180'
            />
          </div>
        </Accordion.Trigger>

        {/* Expandable content */}
        <Accordion.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
          <div className='flex flex-col items-start self-stretch pl-4 pr-6'>
            {/* 券商手续费 */}
            <div className='flex w-full mt-[8px] items-center justify-between'>
              <span className='text-[12px] text-gray-400'>{t('v2.tx.t32')}</span>
              <span className='text-[12px] text-white'>
                {brokerageFee} {feeSymbol}
              </span>
            </div>

            {/* 交易活动费 (仅卖出) */}
            {!isBuy && (
              <div className='flex w-full mt-[8px] items-center justify-between'>
                <span className='text-[12px] text-gray-400'>{t('v2.tx.t33')}</span>
                <span className='text-[12px] text-white'>
                  {tradingActivityFee} {feeSymbol}
                </span>
              </div>
            )}

            {/* 平台服务费 */}
            <div className='flex w-full mt-[8px] items-center justify-between'>
              <span className='text-[12px] text-gray-400'>{t('v2.tx.t34')}</span>
              <span className='text-[12px] text-white'>
                {platformFee} {feeSymbol}
              </span>
            </div>

            {/* 网络费 */}
            <div className='flex w-full mt-[8px] items-center justify-between'>
              <span className='text-[12px] text-gray-400'>{t('Network Fee')}</span>
              <span className='text-[12px] text-white'>{networkFeeInNative} BNB</span>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
