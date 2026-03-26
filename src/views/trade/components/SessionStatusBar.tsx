import PreMarket from '@/components/icons/set/PreMarket'

interface SessionStatusBarProps {
  /** 当前交易时段，如 "盘前" "盘中" "盘后" */
  sessionLabel?: string
  /** 距离下个时段的倒计时文本 */
  countdown?: string
}

export const SessionStatusBar = ({
  sessionLabel = '盘前',
  countdown = '12H : 20M : 30S',
}: SessionStatusBarProps) => {
  return (
    <div className="flex items-center justify-center rounded-[8px] border border-gray-850 bg-gray-900 px-5 py-3">
      <div className="flex items-center gap-2">
        <PreMarket size={18} />
        <span className="text-[12px] text-white">{sessionLabel} | 距开盘</span>
        <span className="text-[12px] text-white">{countdown}</span>
      </div>
    </div>
  )
}
