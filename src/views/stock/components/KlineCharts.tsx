import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/tw'
import { useTradeStore } from '@/stores/tradeStore'
import { CircleLoading } from '@/components/loading'
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
import { SessionLineSelectt, TimeframeSelectDrawer, type IItemCode } from '@/components/session-line-select/index'
import type { SessionType } from 'ca-common-web'

function KlineCharts() {
  const inputToken = useTradeStore(state => state.inputToken)
  const sessionType = useTradeStore(state => state.sessionType)
  const updateSessionType = useTradeStore(state => state.updateSessionType)
  const [timeframe, setTimeframe] = useState<Timeframe>('1m')
  const [chartMode, setChartMode] = useState<ChartMode>('line')
  const [mainOverlay, setMainOverlay] = useState<MainOverlayValue>(null)
  const [subOverlay, setSubOverlay] = useState<SubOverlayValue>('MACD')
  const [timeframeDrawerOpen, setTimeframeDrawerOpen] = useState(false)

  const { chartElRef, candles, loading, markerState, rippleState, isInteracting } = useKlineChart({
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
    setTimeframeDrawerOpen(false)
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
      <div className='mt-5 flex flex-wrap items-center justify-between pb-1 text-[12px]'>
        <div className='flex flex-wrap items-center gap-2 text-[#9DA3AF]'>
          <SessionLineSelectt
            onChange={handleSessionChange}
            selected={chartMode === 'line'}
            triggerText={CHART_MODES.find(item => item.code === chartMode)?.label}
            className='justify-between'
          />
          <div className='flex items-center'>
            {(['15m', '1h', '4h'] as Timeframe[]).map(item => (
              <button
                key={item}
                className={cn(
                  'px-1.5 py-1 transition-colors text-[12px]',
                  timeframe === item ? 'font-medium text-white' : 'text-[#9DA3AF]'
                )}
                onClick={() => handleTimeframeChange(item)}
              >
                {item}
              </button>
            ))}
            <button
              type='button'
              className='flex items-center gap-1 text-[#9DA3AF] px-1.5'
              onClick={() => setTimeframeDrawerOpen(true)}
            >
              More 
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.77811 7.56619C4.65802 7.72219 4.42275 7.72219 4.30266 7.56619L1.01508 3.2955C0.863224 3.09823 1.00385 2.8125 1.25281 2.8125L7.82797 2.8125C8.07692 2.8125 8.21755 3.09823 8.06569 3.2955L4.77811 7.56619Z" fill="#737A87"/>
              </svg>
            </button>
          </div>
        </div>
        <button className='flex items-center gap-1 text-[#9DA3AF] px-4'>
          UTC-4 美东 
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.77811 7.56619C4.65802 7.72219 4.42275 7.72219 4.30266 7.56619L1.01508 3.2955C0.863224 3.09823 1.00385 2.8125 1.25281 2.8125L7.82797 2.8125C8.07692 2.8125 8.21755 3.09823 8.06569 3.2955L4.77811 7.56619Z" fill="#737A87"/>
          </svg>
        </button>
      </div>

      <TimeframeSelectDrawer
        open={timeframeDrawerOpen}
        onOpenChange={setTimeframeDrawerOpen}
        value={timeframe}
        onChange={handleTimeframeChange}
        items={TIMEFRAMES}
      />

      {chartMode === 'candle' ? (
        <div className='mt-3 flex flex-wrap items-center gap-4 text-[13px] font-medium'>
          <span className='text-[#FFB43B]'>EMA5: {summary.ema5?.toFixed(1) ?? '--'}</span>
          <span className='text-[#FF4D95]'>EMA10: {summary.ema10?.toFixed(1) ?? '--'}</span>
          <span className='text-[#38D8FF]'>EMA20: {summary.ema20?.toFixed(1) ?? '--'}</span>
        </div>
      ) : null}

      <div className=' bg-[#131416] px-1 pb-2'>
        <div className='relative h-[430px] w-full overflow-hidden rounded-[14px] bg-[#111214]'>
          <div ref={chartElRef} className='h-full w-full' />
          {!isInteracting && markerState ? (
            <div
              className='pointer-events-none absolute z-20'
              style={{
                left: markerState.x,
                top: markerState.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className='absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25A750] shadow-[0_0_16px_rgba(37,167,80,0.9)]' />
            </div>
          ) : null}
          {!isInteracting && rippleState ? (
            <div
              key={rippleState.key}
              className='pointer-events-none absolute z-20'
              style={{
                left: markerState?.x ?? rippleState.x,
                top: markerState?.y ?? rippleState.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className='absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#25A750]/70 animate-ping' />
            </div>
          ) : null}
          {loading ? (
            <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/30'>
              <CircleLoading size={28} className='text-white' />
            </div>
          ) : null}
        </div>
        <div className='mb-2 flex items-center justify-between px-2 text-[12px] font-medium text-white/70'>
          {chartMode === 'candle' ? (
            <>
              <div className='flex flex-wrap items-center gap-3'>
                {MAIN_OVERLAYS.map(item => (
                  <button
                    key={item}
                    className={cn('transition-colors', mainOverlay === item ?  'text-white' : 'text-white/55')}
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
          ) : null}
        </div>
      </div>
    </div>
  )
}

export { KlineCharts }
