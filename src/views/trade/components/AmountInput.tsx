import ChevronDown from '@/components/icons/set/ChevronDown'

interface AmountInputProps {
  /** 标签: "买入数量" 或 "预计支付" */
  label: string
  /** 输入值 */
  value: string
  onChange: (value: string) => void
  /** 代币符号 */
  tokenSymbol: string
  /** 代币 logo */
  tokenLogo?: string
  /** 余额信息 */
  balance?: string
  /** 是否显示下拉箭头 */
  showDropdown?: boolean
  /** 点击代币选择器 */
  onTokenClick?: () => void
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
}: AmountInputProps) => {
  const logoSrc = tokenLogo || (tokenSymbol === 'USDT' ? '/images/tokens/usdt.png' : '/images/tokens/AMZN.png')

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
            className="min-w-0 flex-1 bg-transparent text-[32px] font-medium text-gray-400 outline-none placeholder:text-gray-400"
            placeholder="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
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
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {balance && (
          <span className="text-[14px] text-gray-400">{balance}</span>
        )}
      </div>
    </div>
  )
}
