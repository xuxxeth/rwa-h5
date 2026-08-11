import { useEffect, useRef, useState } from 'react'
import { dispose, init, type Chart, type DataLoaderGetBarsParams, type KLineData } from 'klinecharts'
import { RESPONSE_CODE } from '@/config/constants'
import { MARKET_STATUS } from '@/config/constants'
import { klineApi } from '@/service/kline/api'
import wsService from '@/service/webSocket/service'
import { useBaseStore } from '@/stores/baseStore'
import { truncate } from '@/utils/format'
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
  timezone: string
}

const RIGHT_OFFSET_DISTANCE = 4
const INITIAL_BATCH_SIZE = 100
const getFollowUpBatchSize = () => Math.floor(Math.random() * 51) + 50
const REQUEST_CACHE_WINDOW = 1000
const PULSE_DURATION = 900
const PULSE_RADIUS = 6

type RealtimeSubscription = {
  key: string
  listener: (data: any) => void
}

type PulseState = {
  x: number
  y: number
  key: number
}

type MarkerState = {
  x: number
  y: number
}

function periodToResolution(period: { type: string; span: number }) {
  if (period.type === 'minute') return `${period.span}m`
  if (period.type === 'hour') return period.span === 1 ? '1h' : `${period.span}h`
  if (period.type === 'day') return '1d'
  if (period.type === 'week') return '1w'
  if (period.type === 'month') return '1M'
  return `${period.span}${period.type}`
}

function isRealtimeAllowed(chartMode: 'line' | 'candle', marketTradeState: number, sessionType: number) {
  if (chartMode === 'candle') return true
  if (marketTradeState === MARKET_STATUS.BEFORE && (sessionType === 0 || sessionType === 1)) return true
  if (marketTradeState === MARKET_STATUS.OPEN && (sessionType === 0 || sessionType === 2)) return true
  if (marketTradeState === MARKET_STATUS.AFTER && (sessionType === 0 || sessionType === 3)) return true
  if (marketTradeState === MARKET_STATUS.OVERNIGHT && (sessionType === 0 || sessionType === 5)) return true
  return false
}

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
    tooltip: {
      showRule: 'none',
      showType: 'standard',
      features: [],
      title: {
        show: false,
        template: '',
        color: 'transparent',
        size: 0,
        family: 'inherit',
        weight: 'normal',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
      },
      legend: {
        defaultValue: '',
        color: 'transparent',
        size: 0,
        family: 'inherit',
        weight: 'normal',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
      },
      rect: {
        position: 'fixed',
        offsetLeft: 0,
        offsetTop: 0,
        offsetRight: 0,
        offsetBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 0,
        borderSize: 0,
        borderColor: 'transparent',
        color: 'transparent',
        style: 'solid',
        borderDashedValue: [],
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
  timezone,
}: UseKlineChartOptions) {
  const chartElRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const marketTradeState = useBaseStore(state => state.marketTradeState)
  const requestSeqRef = useRef(0)
  const isFirstLoadRef = useRef(true)
  const oldestTimestampRef = useRef<number | null>(null)
  const newestTimestampRef = useRef<number | null>(null)
  const pendingLoadRef = useRef<PendingLoad | null>(null)
  const recentLoadRef = useRef<{ key: string; result: LoadResult; ts: number } | null>(null)
  const marketTradeStateRef = useRef(marketTradeState)
  const wsListenersRef = useRef(new Map<string, RealtimeSubscription>())
  const wsSubscriptionVersionRef = useRef(new Map<string, number>())
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const syncFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)
  const syncBarRef = useRef<KLineData | null>(null)
  const syncRippleRef = useRef(false)
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const candlesRef = useRef<KLineData[]>([])
  const isInteractingRef = useRef(false)
  const suppressChartActionRef = useRef(false)
  const [rippleState, setRippleState] = useState<PulseState | null>(null)
  const [markerState, setMarkerState] = useState<MarkerState | null>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const optionsRef = useRef({
    stockId,
    symbol,
    pricePrecision,
    timeframe,
    chartMode,
    sessionType,
    timezone,
  })
  const [candles, setCandles] = useState<KLineData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    marketTradeStateRef.current = marketTradeState
  }, [marketTradeState])

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current)
      }
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current)
      }
      if (syncFrameRef.current != null) {
        cancelAnimationFrame(syncFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    candlesRef.current = candles
  }, [candles])

  const syncPointState = (bar: KLineData, animateRipple = false) => {
    syncBarRef.current = bar
    syncRippleRef.current = animateRipple

    if (syncFrameRef.current != null) {
      cancelAnimationFrame(syncFrameRef.current)
    }

    syncFrameRef.current = requestAnimationFrame(() => {
      syncFrameRef.current = null

      const chart = chartRef.current
      const currentBar = syncBarRef.current
      if (!chart || !currentBar) return

      const coordinate = chart.convertToPixel(
        { timestamp: currentBar.timestamp, value: currentBar.close },
        { paneId: 'candle_pane', absolute: true }
      ) as { x?: number; y?: number }

      if (!Number.isFinite(coordinate?.x ?? NaN) || !Number.isFinite(coordinate?.y ?? NaN)) return

      const nextPoint = { x: coordinate.x!, y: coordinate.y! }
      setMarkerState(nextPoint)

      if (!syncRippleRef.current) return

      const pulseKey = Date.now()
      setRippleState({ ...nextPoint, key: pulseKey })
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current)
      }
      pulseTimerRef.current = setTimeout(() => {
        setRippleState(current => (current?.key === pulseKey ? null : current))
      }, PULSE_DURATION)
      syncRippleRef.current = false
    })
  }

  useEffect(() => {
    const lastBar = candles[candles.length - 1]
    if (!lastBar) return
    syncPointState(lastBar, false)
  }, [candles, chartMode, timeframe])

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
      timezone,
    }
  }, [stockId, symbol, pricePrecision, timeframe, chartMode, sessionType, timezone])

  useEffect(() => {
    if (!chartElRef.current) return

    const chart = init(chartElRef.current)
    if (!chart) return

    chartRef.current = chart
    chart.setTimezone(timezone)

    const hiddenIndicatorTooltip = {
      showRule: 'none',
      showType: 'standard',
      features: [],
      title: {
        show: false,
        showName: false,
        showParams: false,
        color: 'transparent',
        size: 0,
        family: 'inherit',
        weight: 'normal',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
      },
      legend: {
        defaultValue: '',
        color: 'transparent',
        size: 0,
        family: 'inherit',
        weight: 'normal',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
      },
    }

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
        tooltip: hiddenIndicatorTooltip as any,
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
        horizontal: { line: { color: 'rgba(255,255,255,0.5)' } },
        vertical: { line: { color: 'rgba(255,255,255,0.5)' } },
      },
    } as any)
    chart.setOffsetRightDistance(RIGHT_OFFSET_DISTANCE)

    const schedulePointRefresh = (hideRipple = false) => {
      isInteractingRef.current = true
      setIsInteracting(true)
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current)
      }
      if (hideRipple) {
        setRippleState(null)
        syncRippleRef.current = false
      }

      interactionTimerRef.current = setTimeout(() => {
        interactionTimerRef.current = null
        isInteractingRef.current = false
        setIsInteracting(false)

        const lastBar = candlesRef.current[candlesRef.current.length - 1]
        if (lastBar) {
          syncPointState(lastBar, false)
        }
      }, 120)
    }

    const handleChartAction = () => {
      if (suppressChartActionRef.current) return
      schedulePointRefresh(true)
    }

    chart.subscribeAction('onScroll', handleChartAction)
    chart.subscribeAction('onZoom', handleChartAction)
    chart.subscribeAction('onVisibleRangeChange', handleChartAction)
    chart.subscribeAction('onPaneDrag', handleChartAction)

    const resolveRealtimeKey = (symbolValue: string, period: { type: string; span: number }) => {
      const resolution = optionsRef.current.chartMode === 'line' ? '1m' : periodToResolution(period)
      return `candle.${symbolValue}_${resolution}`
    }

    const getRealtimeBar = (data: any) => ({
      timestamp: data.t * 1000,
      open: Number(truncate(data.o ?? data.c ?? 0, optionsRef.current.pricePrecision ?? 2)),
      high: Number(truncate(data.h ?? data.c ?? 0, optionsRef.current.pricePrecision ?? 2)),
      low: Number(truncate(data.l ?? data.c ?? 0, optionsRef.current.pricePrecision ?? 2)),
      close: Number(truncate(data.c ?? 0, optionsRef.current.pricePrecision ?? 2)),
      volume: 0,
      turnover: 0,
    })

    const subscribeRealtime = (
      symbolInfo: { ticker: string },
      period: { type: string; span: number },
      onRealtimeCallback: (data: KLineData) => void
    ) => {
      wsService.init({})

      const symbolValue = symbolInfo.ticker
      if (!symbolValue || symbolValue.startsWith('__EMPTY__')) {
        return
      }

      const key = resolveRealtimeKey(symbolValue, period)
      const previous = wsListenersRef.current.get(key)
      if (previous) {
        wsService.off(previous.key as any, previous.listener as any)
        wsListenersRef.current.delete(key)
      }

      const currentVersion = (wsSubscriptionVersionRef.current.get(key) || 0) + 1
      wsSubscriptionVersionRef.current.set(key, currentVersion)

      const listener = (data: any) => {
        if (wsSubscriptionVersionRef.current.get(key) !== currentVersion) return
        if (data?.c == null) return
        if (!isRealtimeAllowed(optionsRef.current.chartMode, marketTradeStateRef.current, optionsRef.current.sessionType)) {
          return
        }

        const nextBar = getRealtimeBar(data)
        suppressChartActionRef.current = true
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            suppressChartActionRef.current = false
          })
        })
        onRealtimeCallback(nextBar)
        setCandles(previousCandles => mergeAndSortBars(previousCandles, [nextBar]))
        syncPointState(nextBar, !isInteractingRef.current)

        if (oldestTimestampRef.current == null || nextBar.timestamp < oldestTimestampRef.current) {
          oldestTimestampRef.current = nextBar.timestamp
        }
        if (newestTimestampRef.current == null || nextBar.timestamp >= newestTimestampRef.current) {
          newestTimestampRef.current = nextBar.timestamp
        }
      }

      wsListenersRef.current.set(key, { key, listener })
      wsService.on(key as any, listener)
    }

    const unsubscribeRealtime = (symbolInfo: { ticker: string }, period: { type: string; span: number }) => {
      const key = resolveRealtimeKey(symbolInfo.ticker, period)
      wsSubscriptionVersionRef.current.set(key, (wsSubscriptionVersionRef.current.get(key) || 0) + 1)
      const previous = wsListenersRef.current.get(key)
      if (previous) {
        wsService.off(previous.key as any, previous.listener as any)
        wsListenersRef.current.delete(key)
      }
    }

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
        subscribeBar: ({ symbol, period, callback }) => {
          subscribeRealtime(symbol, period, callback)
        },
        unsubscribeBar: ({ symbol, period }) => {
          unsubscribeRealtime(symbol, period)
        },
    })

    return () => {
      chart.unsubscribeAction('onScroll', handleChartAction)
      chart.unsubscribeAction('onZoom', handleChartAction)
      chart.unsubscribeAction('onVisibleRangeChange', handleChartAction)
      chart.unsubscribeAction('onPaneDrag', handleChartAction)
      wsListenersRef.current.forEach(subscription => {
        wsService.off(subscription.key as any, subscription.listener as any)
      })
      wsListenersRef.current.clear()
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
  }, [symbol, pricePrecision, timeframe, chartMode, sessionType, timezone])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    chart.setTimezone(timezone)
  }, [timezone])

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
    markerState,
    rippleState,
    isInteracting,
  }
}
