import { useState, useMemo } from 'react'
import { divide, truncate } from '@/utils'
import SwapArrow from '@/components/icons/set/SwapArrow'

export function RateDisplay({
  symbol,
  usdSymbol,
  decimals,
  latestPrice,
}: {
  symbol: string
  usdSymbol: string
  decimals: number
  latestPrice?: number
}) {
  const [isRateReversed, setIsRateReversed] = useState(false)

  // 正向：1 {symbol} = {limitPrice} {usdSymbol}
  // 反向：1 {usdSymbol} = {1/limitPrice} {symbol}
  const { rateFrom, rateTo } = useMemo(() => {
    if (!isRateReversed) {
      return {
        rateFrom: `1 ${symbol}`,
        rateTo: (
          <>
            <div className='max-w-[240px] truncate pr-[2px]'>
              {latestPrice ? truncate(latestPrice, 2) : '--'}
            </div>
            {usdSymbol}
          </>
        ),
      }
    }
    const inversePrice = latestPrice ? truncate(divide(1, latestPrice), decimals) : '--'
    return {
      rateFrom: `1 ${usdSymbol}`,
      rateTo: (
        <>
          <div className='max-w-[240px] truncate pr-[2px]'>{inversePrice}</div> {symbol}
        </>
      ),
    }
  }, [isRateReversed, latestPrice, symbol, usdSymbol, decimals])

  return (
    <div className='flex items-center gap-1'>
      <span className='text-[14px] text-gray-400'>{rateFrom}</span>
      <SwapArrow
        size={14}
        className={'cursor-pointer text-brand'}
        onClick={() => setIsRateReversed(prev => !prev)}
      />
      <div className='text-[14px] text-gray-400 flex items-center'>{rateTo}</div>
    </div>
  )
}
