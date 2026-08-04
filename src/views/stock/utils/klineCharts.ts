export type Timeframe = '15m' | '1h' | '4h' | '1d'
export type MainOverlay = 'MA' | 'EMA' | 'BOLL' | 'SAR'
export type SubOverlay = 'MACD' | 'KDJ' | 'SKDJ'

export type KLineData = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  turnover: number
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

export const TIMEFRAMES: Timeframe[] = ['15m', '1h', '4h', '1d']
export const MAIN_OVERLAYS: MainOverlay[] = ['MA', 'EMA', 'BOLL', 'SAR']
export const SUB_OVERLAYS: SubOverlay[] = ['MACD', 'KDJ', 'SKDJ']

function seededRandom(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function getSeed(timeframe: Timeframe) {
  switch (timeframe) {
    case '15m':
      return 20260715
    case '1h':
      return 20260716
    case '4h':
      return 20260717
    case '1d':
      return 20260718
  }
}

function getStepMinutes(timeframe: Timeframe) {
  switch (timeframe) {
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

export function getPeriod(timeframe: Timeframe): KLinePeriod {
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

export function generateMockData(timeframe: Timeframe) {
  const rand = seededRandom(getSeed(timeframe))
  const lengthMap: Record<Timeframe, number> = {
    '15m': 80,
    '1h': 72,
    '4h': 60,
    '1d': 48,
  }
  const length = lengthMap[timeframe]
  const stepMinutes = getStepMinutes(timeframe)
  const now = Date.now()
  const start =
    Math.floor(now / (stepMinutes * 60_000)) * stepMinutes * 60_000 -
    length * stepMinutes * 60_000

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

export function buildSummary(candles: KLineData[]): KLineSummary {
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
