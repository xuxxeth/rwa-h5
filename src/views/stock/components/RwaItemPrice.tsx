import CopyButtonV2 from "@/components/button/CopyButtonV2"
import { LabelWrap } from "@/components/markets/Klinebody"
import { MarketStatus } from "@/components/markets/MarketStatus"
import { RwaSessionStatus } from "@/components/markets/RwaSessionStatus"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"
import { baseApi } from "@/service/base/api"
import type { IStatistic } from "@/service/base/types"
import { useBaseStore } from "@/stores/baseStore"
import { useStockStore } from "@/stores/stockStore"
import { useTradeStore } from "@/stores/tradeStore"
import { divide, multiply, shortenAddress, subtract } from "@/utils"
import { calculateUp, formatLargeNumber, toFixed, truncate } from "@/utils/format"
import { memo, useEffect, useMemo, useRef, useState, type RefObject } from "react"

export function ItemPrice({ from }: { from?: string}) {
  const realtimeData = useTradeStore(state => state.realtimeRwaData)
  const upValue = useMemo(() => realtimeData ? Number(truncate(subtract(realtimeData.p ?? '0', (realtimeData.o ?? '0')), 2)) : 0, [realtimeData?.o, realtimeData?.p])
  const openUp = useMemo(() => realtimeData ? Number(calculateUp(realtimeData.p, realtimeData.o)) : 0, [realtimeData?.o, realtimeData?.p])

  const upWidth = useMemo(() => {
    if (!realtimeData?.p || !realtimeData?.o) return 70
    const upStr = `${Math.abs(upValue).toFixed(2)}${Math.abs(openUp).toFixed(2)}`
    const length = upStr.length + 1
    return from === 'info' ? Math.max(50, length * 4) : Math.max(70, length * 10)
  }, [realtimeData?.p, realtimeData?.o, upValue, openUp, from])

  const inputToken = useTradeStore(state => state.inputToken)
  
  const getMarket = useBaseStore(state => state.getMarket)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        getMarket()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const setStockData = useStockStore(state => state.setStockData)
  const rwaPrice = useTradeStore(state => state.realtimeRwaData)

  const [statisticData, setStatisticData] = useState<IStatistic>()
  const unit = '1000000'

  const capData = useMemo(() => {
    let _data = {
      marketCap: '--',
      circCap: '--',
      peTtm: '--',
      peStatic: '--',
      pb: '--',
    }
    if (statisticData?.totalShare && rwaPrice?.p) {
      // 总市值 = 当前股价 * 总股本
      _data.marketCap = formatLargeNumber(multiply(statisticData.totalShare, rwaPrice.p))
      // 流通市值 = 当前股价 * 流通股本
      _data.circCap = formatLargeNumber(multiply(statisticData.circShare, rwaPrice.p))
      // _data.peTtm = formatLargeNumber(
      //   divide(multiply(statisticData.totalShare, rwaPrice.p), multiply(statisticData.netIncomeLtm, unit))
      // )
      _data.peTtm = toFixed(divide(rwaPrice.p, statisticData.epsTtm))
      // pe(static) = 总市值/ 上一个完整财年的净利润
      // _data.peStatic = formatLargeNumber(
      //   divide(multiply(statisticData.totalShare, rwaPrice.p), multiply(statisticData.netIncomeLastYear, unit))
      // )
      _data.peStatic = toFixed(divide(rwaPrice.p, statisticData.eps))
      // pb = 总市值/净资产
      _data.pb = formatLargeNumber(
        divide(multiply(statisticData.totalShare, rwaPrice.p), multiply(statisticData.netAsset, unit))
      )
    }

    return _data
  }, [statisticData, rwaPrice?.p])

  useEffect(() => {
    setStockData(capData)
  }, [capData])

  useEffect(() => {
    if (inputToken?.stockId ) {
      setStatisticData(undefined)
      baseApi.getStatistic(inputToken.stockId).then(res => {
        setStatisticData(res?.data || {})
      })
    }
  }, [inputToken?.stockId])
  return (
    <div className={cn(
      from === 'info' ? 'flex items-center mt-1' : ''
    )}>
      <div className={cn(
        'font-semibold leading-none text-[#32E0A0]',
        openUp === 0 ? 'text-[#A1A1A1]' : openUp > 0
            ? "text-[#25A750]"
            : "text-[#CA3F64] ",
        from === 'info' ? 'text-[12px]' : 'text-[28px]'
        )}
        style={{ width: upWidth + 'px' }}
      >
        {realtimeData?.p ? '$' + realtimeData?.p : '--'}
      </div>
      <div className={cn(
        'mt-[6px] text-[12px] font-medium text-[#32E0A0]',
        openUp === 0 ? 'text-[#A1A1A1]' : openUp > 0
            ? "text-[#25A750]"
            : "text-[#CA3F64] ",
        from === 'info' ? 'mt-0' : ''
        )}
        style={{ width: upWidth + 'px' }}
      >
        <div className="flex items-center ">
          {
            (Number(realtimeData?.p) && Number(realtimeData?.o)) ? (
              <span
                className={cn(
                  "leading-[100%] font-normal ",
                )
              }
              >
                {upValue !== 0 && (upValue > 0 ? '+' : '-')}
                {Math.abs(Number(upValue || "0")).toFixed(2)}
              </span>
            ) : <span
                className={cn(
                  "leading-[100%] font-normal text-[#A1A1A1]",
                )
                }
              >
                --
              </span>
          }
          {
            (Number(realtimeData?.p) && Number(realtimeData?.o)) ? (
              <>
                <span
                  className={cn(
                    "leading-[100%] font-normal text-[12px]",
                  )
                }
                >
                  ({openUp !== 0 && (openUp > 0 ? '+' : '-')}
                  {Math.abs(Number(openUp || "0")).toFixed(2)}%)
                </span>
              
              </>
            
          ) : <span
              className={cn(
                "leading-[100%] font-normal text-[12px] text-[#A1A1A1]",
              )
              }
            >
              (--)
            </span>
          }
        </div>
      </div>
    </div>
  )
}

const RwaItemPrice = memo(
  ({ is24H }: { is24H?: boolean}) => {
    const { t } = useTranslation()
    const stockData = useStockStore(state => state.stockData)
    const realtimeData = useTradeStore(state => state.realtimeRwaData)
    const inputToken = useTradeStore(state => state.inputToken)

    return (
      <div className='mt-4 flex gap-2 justify-between px-4 '>
        <div className=''>
          <ItemPrice />
          <div className='mt-3 flex flex-wrap items-center gap-1 text-[12px]'>
            <RwaSessionStatus from="lite" />
            <MarketStatus from="lite" />
          </div>
        </div>

        <div className='w-[45%] space-y-2 text-[10px] text-[#9DA3AF] flex justify-end shrink-0'>
          <div className=' grid grid-cols-2 gap-x-1'>
            <span className="flex items-center">{t('v2.tx.t16')}</span>
            <span className='flex items-center gap-1 text-[#CED1D9] justify-end'>{stockData?.marketCap || '--'}</span>
            <span className="flex items-center">{t('v4.t2')}</span>
            <span className='flex items-center gap-1 text-[#CED1D9] justify-end'>{realtimeData?.h ? '$' + realtimeData?.h : '--'}</span>
            <span className="flex items-center">{t('v4.t3')}</span>
            <span className='flex items-center gap-1 text-[#CED1D9] justify-end'>{realtimeData?.l ? '$' + realtimeData?.l : '--'}</span>
            <span className="flex items-center">{t('v4.t1')}</span>
            <span className='flex items-center gap-1 text-[#9DA3AF] justify-end'>
              {shortenAddress(inputToken?.address || '')}
              <CopyButtonV2 svgClassName='text-[#9DA3AF] w-3 h-3' copyText={inputToken?.address || ''} />
            </span>
          </div>
          
        </div>
      </div>
    )
  }
)

export { RwaItemPrice }

