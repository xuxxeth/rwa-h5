import ChevronDown from '@/components/icons/set/ChevronDown'

interface SessionPickerProps {
  value?: string
  onClick?: () => void
}

export const SessionPicker = ({
  value = '仅盘中',
  onClick,
}: SessionPickerProps) => {
  return (
    <div
      className="flex items-center justify-between rounded-[6px] border border-gray-850 bg-gray-900 px-4 py-2 cursor-pointer"
      onClick={onClick}
    >
      <span className="border-b border-dashed border-gray-400 text-[14px] text-gray-400">
        交易时段
      </span>
      <div className="flex items-center gap-[2px]">
        <span className="text-[14px] text-white">{value} </span>
        <ChevronDown size={20} />
      </div>
    </div>
  )
}
