import { useEffect, useMemo, useRef, useState } from "react"
import { init, dispose, type Chart } from 'klinecharts'
import { format } from 'date-fns'
import { ChevronDown, ChevronLeft, Copy, Star } from 'lucide-react'
import { cn } from "@/utils/tw"


type Timeframe = '15m' | '1h' | '4h' | '1d'
type MainOverlay = 'VOL' | 'MA' | 'EMA' | 'BOLL' | 'SAR'
type SubOverlay = 'VOL' | 'MACD' | 'KDJ' | 'SKDJ'

type KLineData = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  turnover: number
}

type KLinePeriod = {
  span: number
  type: 'minute' | 'hour' | 'day'
}

const TIMEFRAMES: Timeframe[] = ['15m', '1h', '4h', '1d']
const MAIN_OVERLAYS: MainOverlay[] = ['VOL', 'MA', 'EMA', 'BOLL', 'SAR']
const SUB_OVERLAYS: SubOverlay[] = ['VOL', 'MACD', 'KDJ', 'SKDJ']


function seededRandom(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function getStepMinutes(timeframe: Timeframe) {
  switch (timeframe) {
    case '15m': return 15
    case '1h': return 60
    case '4h': return 240
    case '1d': return 1440
  }
}

function getPeriod(timeframe: Timeframe): KLinePeriod {
  switch (timeframe) {
    case '15m':
      return { span: 15, type: 'minute' }
    case '1h':
      return { span: 1, type: 'hour' }
    case '4h':
      return { span: 4, type: 'hour' }
    case '1d':
      return { span: 1, type: 'day' }
  }
}

function generateMockData(timeframe: Timeframe) {
  const rand = seededRandom(timeframe.length * 999 + 20260716)
  const lengthMap: Record<Timeframe, number> = {
    '15m': 80,
    '1h': 72,
    '4h': 60,
    '1d': 48,
  }
  const length = lengthMap[timeframe]
  const stepMinutes = getStepMinutes(timeframe)
  const now = Date.now()
  const start = Math.floor(now / (stepMinutes * 60_000)) * stepMinutes * 60_000 - length * stepMinutes * 60_000

  const candles: KLineData[] = []
  let close = 226.12

  for (let index = 0; index < length; index += 1) {
    const trend = Math.sin(index / 4) * 1.8 + Math.cos(index / 8) * 0.8
    const noise = (rand() - 0.5) * 3.6
    const open = close
    close = Math.max(40, open + trend + noise)
    const high = Math.max(open, close) + rand() * 2.8 + 0.4
    const low = Math.min(open, close) - rand() * 2.8 - 0.4
    const volume = Math.round(8_000 + Math.abs(close - open) * 4_500 + rand() * 3_500)
    const turnover = ((open + high + low + close) / 4) * volume

    candles.push({
      timestamp: start + index * stepMinutes * 60_000,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      turnover: Number(turnover.toFixed(2)),
    })
  }

  return candles
}

function sma(values: number[], period: number) {
  return values.map((_, index) => {
    if (index + 1 < period) return undefined
    const slice = values.slice(index + 1 - period, index + 1)
    return slice.reduce((sum, item) => sum + item, 0) / period
  })
}

function ema(values: number[], period: number) {
  const multiplier = 2 / (period + 1)
  const result: Array<number | undefined> = []
  let previous: number | undefined

  values.forEach((value, index) => {
    if (index + 1 < period) {
      result.push(undefined)
      return
    }
    if (previous === undefined) {
      previous = values.slice(0, period).reduce((sum, item) => sum + item, 0) / period
      result.push(previous)
      return
    }
    previous = (value - previous) * multiplier + previous
    result.push(previous)
  })

  return result
}

function stddev(values: number[], period: number) {
  return values.map((_, index) => {
    if (index + 1 < period) return undefined
    const slice = values.slice(index + 1 - period, index + 1)
    const mean = slice.reduce((sum, item) => sum + item, 0) / period
    const variance = slice.reduce((sum, item) => sum + (item - mean) ** 2, 0) / period
    return Math.sqrt(variance)
  })
}

function rsv(candles: KLineData[], period: number) {
  return candles.map((candle, index) => {
    if (index + 1 < period) return undefined
    const slice = candles.slice(index + 1 - period, index + 1)
    const high = Math.max(...slice.map(item => item.high))
    const low = Math.min(...slice.map(item => item.low))
    if (high === low) return 50
    return ((candle.close - low) / (high - low)) * 100
  })
}

function buildSummary(candles: KLineData[]) {
  const closes = candles.map(item => item.close)
  const ema5 = ema(closes, 5)
  const ema10 = ema(closes, 10)
  const ema20 = ema(closes, 20)
  const ma5 = sma(closes, 5)
  const ma10 = sma(closes, 10)
  const ma20 = sma(closes, 20)
  const bollMid = sma(closes, 20)
  const bollStd = stddev(closes, 20)
  const last = candles[candles.length - 1]
  const prev = candles[candles.length - 2] ?? last

  return {
    last,
    prev,
    change: last.close - prev.close,
    changePct: prev.close ? ((last.close - prev.close) / prev.close) * 100 : 0,
    ema5: ema5[candles.length - 1],
    ema10: ema10[candles.length - 1],
    ema20: ema20[candles.length - 1],
    ma5: ma5[candles.length - 1],
    ma10: ma10[candles.length - 1],
    ma20: ma20[candles.length - 1],
    bollUpper:
      bollMid[candles.length - 1] !== undefined && bollStd[candles.length - 1] !== undefined
        ? bollMid[candles.length - 1]! + bollStd[candles.length - 1]! * 2
        : undefined,
    bollMid: bollMid[candles.length - 1],
    bollLower:
      bollMid[candles.length - 1] !== undefined && bollStd[candles.length - 1] !== undefined
        ? bollMid[candles.length - 1]! - bollStd[candles.length - 1]! * 2
        : undefined,
  }
}

function formatChange(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}

function KlineCharts() {
  const chartElRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const [timeframe, setTimeframe] = useState<Timeframe>('1h')
  const [mainOverlay, setMainOverlay] = useState<MainOverlay>('EMA')
  const [subOverlay, setSubOverlay] = useState<SubOverlay>('VOL')

  const candles = useMemo(() => generateMockData(timeframe), [timeframe])
  const summary = useMemo(() => buildSummary(candles), [candles])
  const latestTimestampLabel = useMemo(
    () => format(new Date(summary.last.timestamp), timeframe === '1d' ? 'MM/dd' : 'MM/dd HH:mm'),
    [summary.last.timestamp, timeframe]
  )

  useEffect(() => {
    if (!chartElRef.current) return

    const chart = init(chartElRef.current)
    if (!chart) return
    chartRef.current = chart

    chart.setStyles({
      grid: {
        horizontal: { show: true, color: 'rgba(255,255,255,0.06)' },
        vertical: { show: true, color: 'rgba(255,255,255,0.06)' },
      },
      candle: {
        bar: {
          compareRule: 'current_open',
          upColor: '#2BBE63',
          downColor: '#D14C75',
          noChangeColor: '#888888',
          upBorderColor: '#2BBE63',
          downBorderColor: '#D14C75',
          noChangeBorderColor: '#888888',
          upWickColor: '#2BBE63',
          downWickColor: '#D14C75',
          noChangeWickColor: '#888888',
        },
        priceMark: {
          last: {
            line: { color: 'rgba(255,255,255,0.45)' },
            text: { color: '#111214', backgroundColor: '#FFFFFF' },
          },
          high: { text: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.14)' } },
          low: { text: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.14)' } },
        },
      },
      indicator: {
        lastValueMark: {
          line: { color: 'rgba(255,255,255,0.45)' },
          text: { color: '#111214', backgroundColor: '#FFFFFF' },
        },
      },
      xAxis: {
        axisLine: { color: 'rgba(255,255,255,0.08)' },
        tickLine: { color: 'rgba(255,255,255,0.08)' },
        tickText: { color: 'rgba(255,255,255,0.45)' },
      },
      yAxis: {
        axisLine: { color: 'rgba(255,255,255,0.08)' },
        tickLine: { color: 'rgba(255,255,255,0.08)' },
        tickText: { color: 'rgba(255,255,255,0.45)' },
      },
      separator: { color: 'rgba(255,255,255,0.08)' },
      crosshair: {
        horizontal: { line: { color: 'rgba(255,255,255,0.3)' } },
        vertical: { line: { color: 'rgba(255,255,255,0.3)' } },
      },
    } as any)

    return () => {
      dispose(chart as Chart)
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    chart.setDataLoader({
      getBars: ({ callback }) => {
        callback(candles, { forward: false, backward: false })
      },
    })
    chart.setSymbol({ ticker: `NVDA-${timeframe}`, pricePrecision: 2, volumePrecision: 0 })
    chart.setPeriod(getPeriod(timeframe))
    chart.resetData()
  }, [candles, timeframe])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const removeIndicators = () => {
      ;['MA', 'EMA', 'BOLL', 'SAR'].forEach(name => {
        chart.removeIndicator({ paneId: 'candle_pane', name })
      })
      ;['VOL', 'MACD', 'KDJ', 'SKDJ'].forEach(name => {
        chart.removeIndicator({ name })
      })
    }

    removeIndicators()

    if (mainOverlay === 'MA') chart.createIndicator({ name: 'MA', paneId: 'candle_pane' }, true)
    if (mainOverlay === 'EMA') chart.createIndicator({ name: 'EMA', paneId: 'candle_pane' }, true)
    if (mainOverlay === 'BOLL') chart.createIndicator({ name: 'BOLL', paneId: 'candle_pane' }, true)
    if (mainOverlay === 'SAR') chart.createIndicator({ name: 'SAR', paneId: 'candle_pane' }, true)

    if (mainOverlay === 'VOL' || subOverlay === 'VOL') chart.createIndicator('VOL')
    if (subOverlay === 'MACD') chart.createIndicator('MACD')
    if (subOverlay === 'KDJ') chart.createIndicator('KDJ')
    if (subOverlay === 'SKDJ') chart.createIndicator('SKDJ')
  }, [mainOverlay, subOverlay, candles])
  return (
    <div>
      <div className='mt-5 flex items-center justify-between pb-1 text-[12px]'>
        <div className='flex flex-wrap items-center gap-2 text-[#9DA3AF]'>
          <button className='flex items-center gap-1 text-white'>盘中分时 <ChevronDown className='h-4 w-4' /></button>
          {TIMEFRAMES.slice(0, 3).map(item => (
            <button
              key={item}
              className={cn('px-1.5 py-1 transition-colors', timeframe === item ? 'text-white font-medium' : 'text-[#9DA3AF]')}
              onClick={() => setTimeframe(item)}
            >
              {item}
            </button>
          ))}
          <button className='flex items-center gap-1 text-[#9DA3AF]'>More <ChevronDown className='h-4 w-4' /></button>
        </div>
        <button className='flex items-center gap-1 text-[#9DA3AF]'>UTC-4 美东 <ChevronDown className='h-4 w-4' /></button>
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-4 text-[13px] font-medium'>
        <span className='text-[#FFB43B]'>EMA5: {summary.ema5?.toFixed(1) ?? '--'}</span>
        <span className='text-[#FF4D95]'>EMA10: {summary.ema10?.toFixed(1) ?? '--'}</span>
        <span className='text-[#38D8FF]'>EMA20: {summary.ema20?.toFixed(1) ?? '--'}</span>
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