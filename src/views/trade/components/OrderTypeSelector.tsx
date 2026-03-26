import History from '@/components/icons/set/History'

interface OrderTypeSelectorProps {
  activeType: 'market' | 'limit'
  onChange: (type: 'market' | 'limit') => void
}

export const OrderTypeSelector = ({ activeType, onChange }: OrderTypeSelectorProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <button
          className={`rounded-[8px] px-4 py-1 text-[14px] ${
            activeType === 'market'
              ? 'bg-gray-850 text-white'
              : 'text-gray-400'
          }`}
          onClick={() => onChange('market')}
        >
          市价
        </button>
        <button
          className={`rounded-[8px] px-4 py-1 text-[14px] ${
            activeType === 'limit'
              ? 'bg-gray-850 text-white'
              : 'text-gray-400'
          }`}
          onClick={() => onChange('limit')}
        >
          限价
        </button>
      </div>
      <button className="flex items-center justify-center">
        <History size={20} />
      </button>
    </div>
  )
}
