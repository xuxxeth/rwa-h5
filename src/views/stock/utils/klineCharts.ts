export type Timeframe = '1m' | '15m' | '1h' | '4h' | '1d'
export type ChartMode = 'line' | 'candle'
export type MainOverlay = 'MA' | 'EMA' | 'BOLL' | 'SAR'
export type SubOverlay = 'MACD' | 'KDJ' | 'SKDJ'
export type MainOverlayValue = MainOverlay | null
export type SubOverlayValue = SubOverlay | null

export type KLineData = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
  turnover?: number
}

export type KLinePeriod = {
  span: number
  type: 'minute' | 'hour' | 'day'
}

export type KLineSummary = {
  last: KLineData
  prev: KLineData
  change: number
  changePct: number
  ema5?: number
  ema10?: number
  ema20?: number
  ma5?: number
  ma10?: number
  ma20?: number
  bollUpper?: number
  bollMid?: number
  bollLower?: number
}

export const TIMEFRAMES: Timeframe[] = ['1m', '15m', '1h', '4h', '1d']
export const CHART_MODES: Array<{ code: ChartMode; label: string }> = [
  { code: 'line', label: '分时线' },
  { code: 'candle', label: 'K线' },
]
export const MAIN_OVERLAYS: MainOverlay[] = ['MA', 'EMA', 'BOLL', 'SAR']
export const SUB_OVERLAYS: SubOverlay[] = ['MACD', 'KDJ', 'SKDJ']

export function timeframeToResolution(timeframe: Timeframe) {
  switch (timeframe) {
    case '1m':
      return 1
    case '15m':
      return 15
    case '1h':
      return 60
    case '4h':
      return 240
    case '1d':
      return 1440
  }
}

export function mapCandlesToKLineData(
  candles: Array<{ t: number; o: number; h: number; l: number; c: number }>
): KLineData[] {
  return candles
    .slice()
    .sort((left, right) => left.t - right.t)
    .map(item => ({
      timestamp: item.t * 1000,
      open: Number(item.o.toFixed(2)),
      high: Number(item.h.toFixed(2)),
      low: Number(item.l.toFixed(2)),
      close: Number(item.c.toFixed(2)),
      volume: 0,
      turnover: 0,
    }))
}

export function mapCandlesToLineKLineData(
  candles: Array<{ t: number; o: number; h: number; l: number; c: number }>
): KLineData[] {
  return candles
    .slice()
    .sort((left, right) => left.t - right.t)
    .map(item => ({
      timestamp: item.t * 1000,
      open: Number(item.c.toFixed(2)),
      high: Number(item.c.toFixed(2)),
      low: Number(item.c.toFixed(2)),
      close: Number(item.c.toFixed(2)),
      volume: 0,
      turnover: 0,
    }))
}

export function mapMinuteToKLineData(
  items: Array<{ close: number; startTime: number }>
): KLineData[] {
  return items
    .map(item => ({
      timestamp: item.startTime * 1000,
      open: Number(item.close.toFixed(2)),
      high: Number(item.close.toFixed(2)),
      low: Number(item.close.toFixed(2)),
      close: Number(item.close.toFixed(2)),
      volume: 0,
      turnover: 0,
    }))
    .sort((left, right) => left.timestamp - right.timestamp)
}

export function getPeriod(timeframe: Timeframe): KLinePeriod {
  switch (timeframe) {
    case '1m':
      return { span: 1, type: 'minute' }
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

export function buildSummary(candles: KLineData[]): KLineSummary {
  if (!candles.length) {
    const emptyBar: KLineData = {
      timestamp: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
      turnover: 0,
    }

    return {
      last: emptyBar,
      prev: emptyBar,
      change: 0,
      changePct: 0,
    }
  }

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

export function formatChange(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}
