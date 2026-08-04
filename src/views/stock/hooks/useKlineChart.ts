import { useEffect, useRef, useState } from 'react'
import { dispose, init, type Chart, type DataLoaderGetBarsParams, type KLineData } from 'klinecharts'
import { RESPONSE_CODE } from '@/config/constants'
import { klineApi } from '@/service/kline/api'
import type { MainOverlayValue, SubOverlayValue, Timeframe } from '../utils/klineCharts'
import {
  getPeriod,
  mapCandlesToKLineData,
  mapCandlesToLineKLineData,
  mapMinuteToKLineData,
  timeframeToResolution,
} from '../utils/klineCharts'

type UseKlineChartOptions = {
  stockId?: number | null
  symbol: string
  pricePrecision?: number
  timeframe: Timeframe
  chartMode: 'line' | 'candle'
  sessionType: number
  mainOverlay: MainOverlayValue
  subOverlay: SubOverlayValue
}

const RIGHT_OFFSET_DISTANCE = 4
const INITIAL_BATCH_SIZE = 100
const getFollowUpBatchSize = () => Math.floor(Math.random() * 51) + 50
const REQUEST_CACHE_WINDOW = 1000

function createCandleStyle(chartMode: 'line' | 'candle') {
  return {
    type: chartMode === 'line' ? 'area' : 'candle_solid',
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
        show: true,
        compareRule: 'previous_close',
        line: { show: true, color: 'rgba(255,255,255,0.45)' },
        text: {
          show: true,
          color: '#111214',
          backgroundColor: '#FFFFFF',
          size: 12,
          family: 'inherit',
          weight: 'normal',
          paddingLeft: 6,
          paddingRight: 6,
          paddingTop: 3,
          paddingBottom: 3,
          borderStyle: 'solid',
          borderDashedValue: [],
          borderSize: 0,
          borderColor: 'transparent',
          borderRadius: 4,
        },
        upColor: '#2BBE63',
        downColor: '#D14C75',
        noChangeColor: '#888888',
      },
      high: {
        show: true,
        color: '#FFFFFF',
        textSize: 12,
        textFamily: 'inherit',
        textWeight: 'normal',
        textMargin: 6,
      },
      low: {
        show: true,
        color: '#FFFFFF',
        textSize: 12,
        textFamily: 'inherit',
        textWeight: 'normal',
        textMargin: 6,
      },
    },
    area: {
      lineSize: 2,
      lineColor: '#25A750',
      value: 'close',
      smooth: true,
      backgroundColor: [
        {
          offset: 0,
          color: 'rgba(37, 167, 80, 0.42)',
        },
        {
          offset: 1,
          color: 'rgba(37, 167, 80, 0)',
        },
      ],
      point: {
        show: false,
        color: '#9CFF3A',
        radius: 0,
        rippleColor: '#9CFF3A',
        rippleRadius: 0,
        animation: false,
        animationDuration: 0,
      },
    },
  }
}

type LoadResult = {
  bars: KLineData[]
  meta: { backward: boolean; forward: boolean }
}

type PendingLoad = {
  key: string
  controller: AbortController
  callbacks: Array<(bars: KLineData[], meta: LoadResult['meta']) => void>
}

export function useKlineChart({
  stockId,
  symbol,
  pricePrecision = 2,
  timeframe,
  chartMode,
  sessionType,
  mainOverlay,
  subOverlay,
}: UseKlineChartOptions) {
  const chartElRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const requestSeqRef = useRef(0)
  const isFirstLoadRef = useRef(true)
  const oldestTimestampRef = useRef<number | null>(null)
  const newestTimestampRef = useRef<number | null>(null)
  const pendingLoadRef = useRef<PendingLoad | null>(null)
  const recentLoadRef = useRef<{ key: string; result: LoadResult; ts: number } | null>(null)
  const optionsRef = useRef({
    stockId,
    symbol,
    pricePrecision,
    timeframe,
    chartMode,
    sessionType,
  })
  const [candles, setCandles] = useState<KLineData[]>([])
  const [loading, setLoading] = useState(false)

  const mergeAndSortBars = (prevBars: KLineData[], nextBars: KLineData[]) => {
    const barMap = new Map<number, KLineData>()
    prevBars.forEach(bar => barMap.set(bar.timestamp, bar))
    nextBars.forEach(bar => barMap.set(bar.timestamp, bar))
    return Array.from(barMap.values()).sort((left, right) => left.timestamp - right.timestamp)
  }

  useEffect(() => {
    optionsRef.current = {
      stockId,
      symbol,
      pricePrecision,
      timeframe,
      chartMode,
      sessionType,
    }
  }, [stockId, symbol, pricePrecision, timeframe, chartMode, sessionType])

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
      candle: createCandleStyle(chartMode),
      technicalIndicator: {
        line: {
          styles: {
            color: '#9CFF3A',
          },
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
    chart.setOffsetRightDistance(RIGHT_OFFSET_DISTANCE)

    chart.setDataLoader({
      getBars: async ({ type, timestamp, callback }: DataLoaderGetBarsParams) => {
        const current = optionsRef.current
        if (!current.stockId) {
          callback([], { backward: false, forward: false })
          return
        }

        const requestKey = [
          current.stockId,
          current.symbol,
          current.pricePrecision,
          current.timeframe,
          current.chartMode,
          current.sessionType,
          type,
          timestamp ?? '',
          oldestTimestampRef.current ?? '',
          newestTimestampRef.current ?? '',
        ].join('|')

        const recentLoad = recentLoadRef.current
        if (recentLoad && recentLoad.key === requestKey && Date.now() - recentLoad.ts < REQUEST_CACHE_WINDOW) {
          callback(recentLoad.result.bars, recentLoad.result.meta)
          return
        }

        const pendingLoad = pendingLoadRef.current
        if (pendingLoad && pendingLoad.key === requestKey) {
          pendingLoad.callbacks.push(callback)
          return
        }

        if (pendingLoad && pendingLoad.key !== requestKey) {
          pendingLoad.controller.abort()
        }

        const controller = new AbortController()
        const requestSeq = ++requestSeqRef.current
        pendingLoadRef.current = {
          key: requestKey,
          controller,
          callbacks: [callback],
        }
        setLoading(true)

        const flushCallbacks = (result: LoadResult) => {
          if (pendingLoadRef.current?.key === requestKey) {
            pendingLoadRef.current.callbacks.forEach(cb => cb(result.bars, result.meta))
          }
        }

        const finishLoad = (result: LoadResult) => {
          setCandles(previous => mergeAndSortBars(previous, result.bars))
          recentLoadRef.current = {
            key: requestKey,
            result,
            ts: Date.now(),
          }
          flushCallbacks(result)
          if (pendingLoadRef.current?.key === requestKey) {
            pendingLoadRef.current = null
          }
        }

        const finishEmpty = () => {
          finishLoad({ bars: [], meta: { backward: false, forward: false } })
        }

        try {
          const isFirstLoad = isFirstLoadRef.current
          const batchSize = isFirstLoad ? INITIAL_BATCH_SIZE : getFollowUpBatchSize()

          if (current.chartMode === 'line' && current.sessionType === 0) {
            const limit = batchSize
            const endTime =
              type === 'forward' && (oldestTimestampRef.current || timestamp)
                ? Math.max(0, Math.floor((oldestTimestampRef.current || timestamp || 0) / 1000) - 1)
                : type === 'backward' && (newestTimestampRef.current || timestamp)
                  ? Math.floor((newestTimestampRef.current || timestamp || 0) / 1000)
                  : Math.floor(Date.now() / 1000)

            const res = await klineApi.getCandles(
              {
                stock: current.stockId,
                interval: 1,
                endTime,
                limit,
              },
              { signal: controller.signal }
            )

            if (requestSeq !== requestSeqRef.current) return

            if (res.code !== RESPONSE_CODE.SUCCESS) {
              setCandles([])
              finishEmpty()
              return
            }

          const rawData = res.data || []
            const data = mapCandlesToLineKLineData(rawData).slice(-limit)
            oldestTimestampRef.current = data[0]?.timestamp ?? oldestTimestampRef.current
            newestTimestampRef.current = data[data.length - 1]?.timestamp ?? newestTimestampRef.current
            isFirstLoadRef.current = false
            const hasMore = rawData.length >= limit
            const hasMoreBackward = type === 'backward' ? hasMore : false
            const hasMoreForward = type === 'init' || type === 'forward' ? hasMore : false
            finishLoad({ bars: data, meta: { backward: hasMoreBackward, forward: hasMoreForward } })
            return
          }

          if (current.chartMode === 'line') {
            const res = await klineApi.getMinute(
              { stock: current.stockId, sessionType: current.sessionType, limit: batchSize },
              { signal: controller.signal }
            )
            if (requestSeq !== requestSeqRef.current) return

            if (res.code !== RESPONSE_CODE.SUCCESS) {
              setCandles([])
              finishEmpty()
              return
            }

            const data = mapMinuteToKLineData(res.data.items || []).slice(-batchSize)
            oldestTimestampRef.current = data[0]?.timestamp ?? null
            newestTimestampRef.current = data[data.length - 1]?.timestamp ?? newestTimestampRef.current
            isFirstLoadRef.current = false
            finishLoad({ bars: data, meta: { backward: false, forward: false } })
            return
          }

          const limit = batchSize
          const endTime =
            type === 'forward' && (oldestTimestampRef.current || timestamp)
              ? Math.max(0, Math.floor((oldestTimestampRef.current || timestamp || 0) / 1000) - 1)
              : type === 'backward' && (newestTimestampRef.current || timestamp)
                ? Math.floor((newestTimestampRef.current || timestamp || 0) / 1000)
              : Math.floor(Date.now() / 1000)

          const res = await klineApi.getCandles(
            {
              stock: current.stockId,
              interval: timeframeToResolution(current.timeframe),
              endTime,
              limit,
            },
            { signal: controller.signal }
          )

          if (requestSeq !== requestSeqRef.current) return

          if (res.code !== RESPONSE_CODE.SUCCESS) {
            setCandles([])
            finishEmpty()
            return
          }

          const rawData = res.data || []
          const data = mapCandlesToKLineData(rawData).slice(-limit)
          oldestTimestampRef.current = data[0]?.timestamp ?? oldestTimestampRef.current
          newestTimestampRef.current = data[data.length - 1]?.timestamp ?? newestTimestampRef.current
          isFirstLoadRef.current = false
          const hasMore = rawData.length >= limit
          const hasMoreBackward = type === 'backward' ? hasMore : false
          const hasMoreForward = type === 'init' || type === 'forward' ? hasMore : false
          finishLoad({ bars: data, meta: { backward: hasMoreBackward, forward: hasMoreForward } })
        } catch (error) {
          if (requestSeq !== requestSeqRef.current) return
          if (!controller.signal.aborted) {
            setCandles([])
            finishEmpty()
          }
        } finally {
          if (requestSeq === requestSeqRef.current) {
            setLoading(false)
            if (pendingLoadRef.current?.key === requestKey) {
              pendingLoadRef.current = null
            }
          }
        }
      },
    })

    return () => {
      pendingLoadRef.current?.controller.abort()
      pendingLoadRef.current = null
      dispose(chart as Chart)
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    chart.setStyles({
      candle: createCandleStyle(chartMode),
    } as any)
  }, [chartMode])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    isFirstLoadRef.current = true
    oldestTimestampRef.current = null
    newestTimestampRef.current = null
    pendingLoadRef.current?.controller.abort()
    pendingLoadRef.current = null
    recentLoadRef.current = null
    chart.setSymbol({ ticker: symbol || `__EMPTY__${timeframe}`, pricePrecision, volumePrecision: 0 })
    chart.setPeriod(chartMode === 'line' ? { span: 1, type: 'minute' } : getPeriod(timeframe))
    chart.resetData()
  }, [symbol, pricePrecision, timeframe, chartMode, sessionType])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    chart.setScrollEnabled(!loading)
    chart.setZoomEnabled(!loading)
  }, [loading])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const removeIndicators = () => {
      ;['MA', 'EMA', 'BOLL', 'SAR'].forEach(name => {
        chart.removeIndicator({ paneId: 'candle_pane', name })
      })
      ;['MACD', 'KDJ', 'SKDJ'].forEach(name => {
        chart.removeIndicator({ name })
      })
    }

    removeIndicators()

    if (mainOverlay) chart.createIndicator({ name: mainOverlay, paneId: 'candle_pane' }, true)
    if (subOverlay) chart.createIndicator(subOverlay)
  }, [mainOverlay, subOverlay])

  return {
    chartElRef,
    candles,
    loading,
  }
}
