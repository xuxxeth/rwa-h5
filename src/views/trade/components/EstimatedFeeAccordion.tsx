import * as Accordion from '@radix-ui/react-accordion'
import ChevronDown from '@/components/icons/set/ChevronDown'
import { cn } from '@/utils/tw'

export type FeeItem = {
  label: React.ReactNode
  value: React.ReactNode
  /** Whether this item is visible. Defaults to true. */
  visible?: boolean
}

interface EstimatedFeeAccordionProps {
  className?: string
  /** Label text for the estimated fee header */
  feeLabel: string
  /** Total estimated fee amount */
  estimatedFee: string
  /** Fee currency symbol, e.g. 'USDT' */
  feeSymbol: string
  /** Fee breakdown items */
  items: FeeItem[]
  /**
   * Visual variant:
   * - 'trade': Trade page style (chevron on the right, 12px detail text, no background)
   * - 'confirm': Order confirm drawer style (chevron on the left, 14px detail text, dark background)
   */
  variant?: 'trade' | 'confirm'
}

export const EstimatedFeeAccordion = ({
  className,
  feeLabel,
  estimatedFee,
  feeSymbol,
  items,
  variant = 'trade',
}: EstimatedFeeAccordionProps) => {
  const isConfirm = variant === 'confirm'

  return (
    <Accordion.Root type='single' collapsible className={className}>
      <Accordion.Item value='fee-details'>
        {/* Header trigger */}
        <Accordion.Trigger
          className={cn(
            'group flex w-full items-center justify-between',
            isConfirm ? 'py-0.5' : '',
          )}
        >
          {isConfirm ? (
            <>
              <div className='flex items-center gap-1'>
                <span className='text-[14px] font-normal text-gray-400'>
                  {feeLabel}
                </span>
                <ChevronDown
                  size={12}
                  className='text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180'
                />
              </div>
              <div className='text-[14px] text-white flex items-center'>
                <div className=' max-w-[140px] truncate'>
                  {estimatedFee}
                </div>
                  {feeSymbol}
              </div>
            </>
          ) : (
            <>
              <span className='text-[14px] text-gray-400'>{feeLabel}</span>
              <div className='flex items-center gap-1'>
                <div className='text-[14px] text-white flex items-center'>
                  <div className=' max-w-[140px] truncate'>
                    {estimatedFee}
                  </div>
                   {feeSymbol}
                </div>
                <ChevronDown
                  size={20}
                  className='text-white transition-transform duration-200 group-data-[state=open]:rotate-180'
                />
              </div>
            </>
          )}
        </Accordion.Trigger>

        {/* Expandable content */}
        <Accordion.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
          <div
            className={cn(
              'flex flex-col',
              isConfirm
                ? 'gap-1 rounded-[4px] bg-gray-850 px-2 py-1.5'
                : 'items-start self-stretch pl-4 pr-6',
            )}
          >
            {items
              .filter((item) => item.visible !== false)
              .map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex w-full items-center justify-between',
                    isConfirm ? 'py-0.5' : 'mt-[8px]',
                  )}
                >
                  <div
                    className={cn(
                      isConfirm ? 'text-[14px] font-normal' : 'text-[12px]',
                      'text-gray-400',
                    )}
                  >
                    {item.label}
                  </div>
                  <div
                    className={cn(
                      isConfirm ? 'text-[14px] font-normal' : 'text-[12px]',
                      'text-white flex items-center',
                    )}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
