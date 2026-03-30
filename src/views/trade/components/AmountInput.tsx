import ChevronDown from '@/components/icons/set/ChevronDown'
import { cn } from '@/lib/utils'

interface AmountInputProps {
  /** label text */
  label: string
  /** input value */
  value: string
  onChange: (value: string) => void
  /** token symbol */
  tokenSymbol?: string
  /** token logo */
  tokenLogo?: string
  /** balance display */
  balance?: string
  /** whether dropdown arrow is shown */
  showDropdown?: boolean
  /** click token selector */
  onTokenClick?: () => void
  /** whether this field is read-only */
  readOnly?: boolean
  /** input placeholder */
  placeholder?: string
  /** regex for input validation */
  regex?: RegExp
  /** whether balance is insufficient */
  isInsufficient?: boolean
}

export const AmountInput = ({
  label,
  value,
  onChange,
  tokenSymbol,
  tokenLogo,
  balance,
  showDropdown = true,
  onTokenClick,
  readOnly = false,
  placeholder = '0',
  regex,
  isInsufficient = false,
}: AmountInputProps) => {
  const logoSrc = tokenLogo || (tokenSymbol === 'USDT' ? '/images/tokens/usdt.png' : '/images/tokens/AMZN.png')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (regex && !regex.test(val)) return
    onChange(val)
  }

  return (
    <div className="flex flex-col gap-2 rounded-[8px] border border-gray-850 bg-gray-900 px-4 py-3">
      <div className="flex items-center">
        <span className="flex-1 text-[16px] text-gray-400">{label}</span>
      </div>
      <div className="flex flex-col items-end gap-0">
        <div className="flex w-full items-center justify-between gap-[6px]">
          <input
            type="text"
            inputMode="decimal"
            className={cn(
              "min-w-0 flex-1 bg-transparent text-[32px] font-medium outline-none placeholder:text-gray-400",
              readOnly ? 'text-gray-400' : 'text-white'
            )}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
          />
          {tokenSymbol && (
            <button
              className="flex items-center gap-[2px] rounded-full border border-gray-850 bg-gray-900 py-[2px] pl-1 pr-[2px]"
              onClick={onTokenClick}
            >
              <img
                src={logoSrc}
                alt={tokenSymbol}
                className="h-4 w-4 rounded-full object-cover"
              />
              <span className="text-[14px] text-white">{tokenSymbol}</span>
              {showDropdown && (
                <ChevronDown size={16} className={'text-white'} />
              )}
            </button>
          )}
        </div>
        {balance && (
          <span className={cn(
            "text-[14px]",
            isInsufficient ? 'text-[#CA3F64]' : 'text-gray-400'
          )}>{balance}</span>
        )}
      </div>
    </div>
  )
}
