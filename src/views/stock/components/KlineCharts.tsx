import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/tw'
import { useTradeStore } from '@/stores/tradeStore'
import { useKlineChart } from '../hooks/useKlineChart'
import {
  CHART_MODES,
  MAIN_OVERLAYS,
  SUB_OVERLAYS,
  TIMEFRAMES,
  buildSummary,
  type ChartMode,
  type MainOverlay,
  type MainOverlayValue,
  type SubOverlay,
  type SubOverlayValue,
  type Timeframe,
} from '../utils/klineCharts'
import { SessionLineSelectt, type IItemCode } from '@/components/session-line-select'
import type { SessionType } from 'ca-common-web'

function KlineCharts() {
  const inputToken = useTradeStore(state => state.inputToken)
  const sessionType = useTradeStore(state => state.sessionType)
  const updateSessionType = useTradeStore(state => state.updateSessionType)
  const [timeframe, setTimeframe] = useState<Timeframe>('1m')
  const [chartMode, setChartMode] = useState<ChartMode>('line')
  const [mainOverlay, setMainOverlay] = useState<MainOverlayValue>(null)
  const [subOverlay, setSubOverlay] = useState<SubOverlayValue>('MACD')

  const { chartElRef, candles, loading } = useKlineChart({
    stockId: inputToken?.stockId,
    symbol: inputToken?.symbol || '',
    pricePrecision: inputToken?.precision || 2,
    timeframe,
    chartMode,
    sessionType,
    mainOverlay,
    subOverlay,
  })

  const summary = useMemo(() => buildSummary(candles), [candles])
  const latestTimestampLabel = useMemo(
    () => format(new Date(summary.last.timestamp), timeframe === '1d' ? 'MM/dd' : 'MM/dd HH:mm'),
    [summary.last.timestamp, timeframe]
  )

  const handleSessionChange = useCallback((data: IItemCode) => {
    updateSessionType(Number(data.code) as SessionType)
    setChartMode('line')
    setTimeframe('1m')
  }, [updateSessionType])

  const handleTimeframeChange = useCallback((item: Timeframe) => {
    setTimeframe(item)
    setChartMode('candle')
  }, [])

  const handleMainOverlayToggle = useCallback((item: MainOverlay) => {
    setMainOverlay(current => (current === item ? null : item))
  }, [])

  const handleSubOverlayToggle = useCallback((item: SubOverlay) => {
    setSubOverlay(current => (current === item ? null : item))
  }, [])

  useEffect(() => {
    setSubOverlay(current => current ?? 'MACD')
  }, [chartMode])

  return (
    <div>
      <div className='mt-5 flex items-center justify-between pb-1 text-[12px]'>
        <div className='flex flex-wrap items-center gap-2 text-[#9DA3AF]'>
          <SessionLineSelectt
            onChange={handleSessionChange}
            selected={chartMode === 'line'}
            triggerText={CHART_MODES.find(item => item.code === chartMode)?.label}
            className='w-[120px] justify-between'
          />
          {TIMEFRAMES.slice(0, 4).map(item => (
            <button
              key={item}
              className={cn(
                'px-1.5 py-1 transition-colors',
                timeframe === item ? 'font-medium text-white' : 'text-[#9DA3AF]'
              )}
              onClick={() => handleTimeframeChange(item)}
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
        {chartMode === 'candle' ? (
          <>
            <span className='text-[#FFB43B]'>EMA5: {summary.ema5?.toFixed(1) ?? '--'}</span>
            <span className='text-[#FF4D95]'>EMA10: {summary.ema10?.toFixed(1) ?? '--'}</span>
            <span className='text-[#38D8FF]'>EMA20: {summary.ema20?.toFixed(1) ?? '--'}</span>
          </>
        ) : (
          <>
            <span className='text-[#9CFF3A]'>最新价: {summary.last.close.toFixed(2)}</span>
            <span className={cn(summary.change >= 0 ? 'text-[#2BBE63]' : 'text-[#D14C75]')}>
              涨跌: {summary.change >= 0 ? '+' : ''}{summary.change.toFixed(2)} ({summary.changePct.toFixed(2)}%)
            </span>
          </>
        )}
        <span className='text-white/40'>更新时间：{latestTimestampLabel}</span>
      </div>

      <div className='rounded-[18px] border border-white/5 bg-[#111214] px-1 pb-2 pt-1 shadow-[0_24px_80px_rgba(0,0,0,0.35)]'>
        <div ref={chartElRef} className='h-[430px] w-full overflow-hidden rounded-[14px] bg-[#111214]' />
        <div className='mb-2 flex items-center justify-between px-2 text-[12px] font-medium text-white/70'>
          {chartMode === 'candle' ? (
            <>
              <div className='flex flex-wrap items-center gap-3'>
                {MAIN_OVERLAYS.map(item => (
                  <button
                    key={item}
                    className={cn('transition-colors', mainOverlay === item ? 'text-white' : 'text-white/55')}
                    onClick={() => handleMainOverlayToggle(item)}
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
                    onClick={() => handleSubOverlayToggle(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className='text-white/55'>{loading ? '加载中...' : '分时模式'}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export { KlineCharts }
