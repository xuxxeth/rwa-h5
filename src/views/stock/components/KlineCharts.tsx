import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/tw'
import { useKlineChart } from '../hooks/useKlineChart'
import {
  MAIN_OVERLAYS,
  SUB_OVERLAYS,
  TIMEFRAMES,
  buildSummary,
  generateMockData,
  type MainOverlay,
  type SubOverlay,
  type Timeframe,
} from '../utils/klineCharts'

function KlineCharts() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1h')
  const [mainOverlay, setMainOverlay] = useState<MainOverlay>('EMA')
  const [subOverlay, setSubOverlay] = useState<SubOverlay>('MACD')

  const candles = useMemo(() => generateMockData(timeframe), [timeframe])
  const summary = useMemo(() => buildSummary(candles), [candles])
  const latestTimestampLabel = useMemo(
    () => format(new Date(summary.last.timestamp), timeframe === '1d' ? 'MM/dd' : 'MM/dd HH:mm'),
    [summary.last.timestamp, timeframe]
  )

  const chartElRef = useKlineChart({
    candles,
    timeframe,
    mainOverlay,
    subOverlay,
  })

  return (
    <div>
      <div className='mt-5 flex items-center justify-between pb-1 text-[12px]'>
        <div className='flex flex-wrap items-center gap-2 text-[#9DA3AF]'>
          <button className='flex items-center gap-1 text-white'>
            盘中分时 <ChevronDown className='h-4 w-4' />
          </button>
          {TIMEFRAMES.slice(0, 3).map(item => (
            <button
              key={item}
              className={cn(
                'px-1.5 py-1 transition-colors',
                timeframe === item ? 'font-medium text-white' : 'text-[#9DA3AF]'
              )}
              onClick={() => setTimeframe(item)}
            >
              {item}
            </button>
          ))}
          <button className='flex items-center gap-1 text-[#9DA3AF]'>
            More <ChevronDown className='h-4 w-4' />
          </button>
        </div>
        <button className='flex items-center gap-1 text-[#9DA3AF]'>
          UTC-4 美东 <ChevronDown className='h-4 w-4' />
        </button>
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-4 text-[13px] font-medium'>
        <span className='text-[#FFB43B]'>EMA5: {summary.ema5?.toFixed(1) ?? '--'}</span>
        <span className='text-[#FF4D95]'>EMA10: {summary.ema10?.toFixed(1) ?? '--'}</span>
        <span className='text-[#38D8FF]'>EMA20: {summary.ema20?.toFixed(1) ?? '--'}</span>
        <span className='text-white/40'>更新时间：{latestTimestampLabel}</span>
      </div>

      <div className='rounded-[18px] border border-white/5 bg-[#111214] px-1 pb-2 pt-1 shadow-[0_24px_80px_rgba(0,0,0,0.35)]'>
        <div ref={chartElRef} className='h-[430px] w-full overflow-hidden rounded-[14px] bg-[#111214]' />
        <div className='mb-2 flex items-center justify-between px-2 text-[12px] font-medium text-white/70'>
          <div className='flex flex-wrap items-center gap-3'>
            {MAIN_OVERLAYS.map(item => (
              <button
                key={item}
                className={cn('transition-colors', mainOverlay === item ? 'text-white' : 'text-white/55')}
                onClick={() => setMainOverlay(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            {SUB_OVERLAYS.map(item => (
              <button
                key={item}
                className={cn('transition-colors', subOverlay === item ? 'text-white' : 'text-white/55')}
                onClick={() => setSubOverlay(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { KlineCharts }
