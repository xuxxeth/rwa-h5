import { memo, useEffect, useId, useMemo, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { useRwas } from '@/hooks/useRwaBalances'
import { useRwaPrice, useTokenBalance } from '@/hooks/useTokenBalances'
import { useBaseStore } from '@/stores/baseStore'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useTableSort } from '@/hooks/useTableHelper'
import { useWssStore } from '@/stores/wssStore'
import { useWssOn } from '@/hooks/useWssOn'
import { LazyImage } from '@/components/image/LazyImage'
import { Search } from '@/components/icons'
import { SortButton } from '@/components/sort-button-svg'
import { NoData } from '@/components/markets/NoData'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatTokenAmountWithCommas } from '@/utils/format'
import { multiply, symbolToLower } from '@/utils'
import type { IRwa } from '@/service/base/types'
import IconWithTooltip from '@/components/icon-tooltip'
import { MARKET_STATUS } from '@/config/constants'
import { MarketStatus } from '../markets/MarketStatus'
import { SessionType, TradeState } from '@/views/markets/MarketQuotes'
import { CTokenListV2 } from '../ctoken-list/CtokenList'

/* ────────────────────────── types ────────────────────────── */

interface SymbolSelectDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClick?: (token: IRwa) => void
}

type SortableField = 'name' | 'change' | 'marketCap'

/* ────────────────────────── sub-components ───────────────── */

/** Price + change% column */
const TokenPrice = memo(({ token }: { token: IRwa }) => {
  const nup = useMemo(() => Number(token?.up), [token?.up])

  return (
    <div className="text-[14px]">
      <div 
        className={
          nup === 0 ? 'text-[#A1A1A1]' : nup > 0
            ? "text-[#50E3C2] text-[12px]"
            : "text-[rgba(227,80,122,1)] text-[12px]"
        }
      >
        <span className=" font-medium text-[14px]">{token?.price ? ('$' + token?.price) : '--'}</span>
        <div className=" font-normal flex items-center gap-x-[4px] mt-1">
          <span
            
          >
            {nup !== 0 && (nup > 0 ? '+' : '-')}
            {Math.abs(Number( nup || "0")) || '0.00'}%
          </span>
        </div>
      </div>
      
      
    </div>
  );
})
TokenPrice.displayName = 'TokenPrice'

/** Holdings column */
const TokenHoldings = memo(
  ({ symbol, pricePrecision }: { symbol: string; pricePrecision: number }) => {
    const tokenBalance = useTokenBalance(symbol)?.balance ?? '0'
    const tokenPrice = useRwaPrice(symbol)?.price ?? '0'
    const total = multiply(tokenBalance, tokenPrice)

    return (
      <div className="flex flex-col items-stretch shrink-0">
        <span className="text-right text-[14px] font-normal text-white">
          {formatTokenAmountWithCommas(tokenBalance)}
        </span>
        <span className="text-right text-[12px] font-normal text-[#9DA3AF]">
          ≈ ${formatTokenAmountWithCommas(total, pricePrecision)}
        </span>
      </div>
    )
  },
)
TokenHoldings.displayName = 'TokenHoldings'

/** Single token row */
const TokenRow = memo(
  ({ token, onClick, account, marketOpen, state }: { token: IRwa; onClick?: (t: IRwa) => void; account?: string, marketOpen?: boolean, state?: string, }) => (
    <div
      className="flex cursor-pointer items-center gap-1 px-5 py-2 active:bg-[#232427]"
      onClick={() => onClick?.(token)}
    >
      {/* Name section – fixed 140px */}
      <div className={cn(
        "flex w-[164px] shrink-0 items-center gap-2",
          account ? 'w-[164px]' : 'flex-1'
        )
      }>
        <LazyImage src={token.icon} className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex items-center gap-1">
            <span className="truncate text-[14px] font-normal text-white">{token.symbol}</span>
            
          </div>
          <span className="truncate text-[12px] font-normal text-[#9DA3AF]">{token.name}</span>
        </div>

        <div className="flex items-center"
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onTouchEnd={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <TradeState state={token.state} />
          <SessionType sessionMask={token.sessionMask} />
        </div>
      </div>

      {/* Price / change – hug width */}
      <div className={cn('shrink-0', account ? 'w-[106px]' : 'flex-1')}>
        <TokenPrice token={token} />
      </div>

      {/* Holdings – fill */}
      {account && (
        <div className="flex-1">
          <TokenHoldings symbol={token.symbol} pricePrecision={token.precision} />
        </div>
      )}
    </div>
  ),
)
TokenRow.displayName = 'TokenRow'

/* ────────────────────────── main component ──────────────── */

export const SymbolSelectDrawer = memo(
  ({ open, onOpenChange, onClick }: SymbolSelectDrawerProps) => {
    const { t } = useTranslation()
    return (
      <Drawer open={open} onOpenChange={(open) => {
        
        onOpenChange(open)
        setTimeout(() => {
          if (!open) {
            // @ts-ignore
            onSortChange(null)
          }
        }, 800)
      }} title={t('Select a token')}>
        <CTokenListV2 from='trade' onClick={onClick} />
      </Drawer>
    )
  },
)

SymbolSelectDrawer.displayName = 'SymbolSelectDrawer'
