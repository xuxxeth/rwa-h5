interface BuySellTabsProps {
  activeTab: 'buy' | 'sell'
  onChange: (tab: 'buy' | 'sell') => void
}

export const BuySellTabs = ({ activeTab, onChange }: BuySellTabsProps) => {
  return (
    <div className="flex items-center rounded-[6px] bg-gray-900">
      <button
        className={`flex-1 rounded-[6px] px-4 py-[10px] text-center text-[14px] font-medium transition-colors ${
          activeTab === 'buy'
            ? 'bg-[rgba(37,167,80,0.2)] text-green-100'
            : 'text-gray-400'
        }`}
        onClick={() => onChange('buy')}
      >
        买入
      </button>
      <button
        className={`flex-1 rounded-[6px] px-4 py-[10px] text-center text-[14px] font-medium transition-colors ${
          activeTab === 'sell'
            ? 'bg-[rgba(202,63,100,0.2)] text-red-100'
            : 'text-gray-400'
        }`}
        onClick={() => onChange('sell')}
      >
        卖出
      </button>
    </div>
  )
}
