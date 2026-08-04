import { useEffect, useRef } from 'react'
import { dispose, init, type Chart } from 'klinecharts'
import {
  getPeriod,
  type ChartMode,
  type KLineData,
  type MainOverlayValue,
  type SubOverlayValue,
  type Timeframe,
} from '../utils/klineCharts'

type UseKlineChartOptions = {
  candles: KLineData[]
  timeframe: Timeframe
  chartMode: ChartMode
  mainOverlay: MainOverlayValue
  subOverlay: SubOverlayValue
}

const RIGHT_OFFSET_DISTANCE = 4

export function useKlineChart({ candles, timeframe, chartMode, mainOverlay, subOverlay }: UseKlineChartOptions) {
  const chartElRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

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
    chart.setStyles({
      candle: {
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
        area: {
          lineSize: 2,
          lineColor: '#9CFF3A',
          value: 'close',
          smooth: true,
          backgroundColor: [
            {
              offset: 0,
              color: chartMode === 'line' ? 'rgba(156, 255, 58, 0)' : 'rgba(156, 255, 58, 0.22)',
            },
            {
              offset: 1,
              color: chartMode === 'line' ? 'rgba(156, 255, 58, 0)' : 'rgba(156, 255, 58, 0.02)',
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
      },
    } as any)
    chart.setOffsetRightDistance(RIGHT_OFFSET_DISTANCE)
    chart.resetData()
  }, [candles, timeframe, chartMode])

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

  return chartElRef
}
