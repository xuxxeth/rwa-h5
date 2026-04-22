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
        <span className=" font-medium text-[16px]">{token?.price ? ('$' + token?.price) : '--'}</span>
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
        <span className="text-right text-[16px] font-normal text-white">
          {formatTokenAmountWithCommas(tokenBalance)}
        </span>
        <span className="text-right text-[14px] font-normal text-[#9DA3AF]">
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
            <span className="truncate text-[16px] font-normal text-white">{token.symbol}</span>
            
          </div>
          <span className="truncate text-[14px] font-normal text-[#9DA3AF]">{token.name}</span>
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
    const { account } = useActiveWeb3()
    const { sort, onSortChange } = useTableSort<SortableField>()
    const marketTradeState = useBaseStore(state => state.marketTradeState)
    const tokenWithBalance = useBaseStore((s) => s.tokenWithBalance)
    const tokenWithPrice = useBaseStore((s) => s.tokenWithPrice)

    const _id = useId()
    const rwaList = useRwas()

    /* ── merge balance + price ── */
    const rwaListWithBalance = useMemo(() => {
      return rwaList.filter(rwa => rwa.state !== 2).map(rwa => {
        const newRwa = {
          ...rwa,
          ...tokenWithBalance[symbolToLower(rwa.symbol)],
          ...tokenWithPrice[symbolToLower(rwa.symbol)],
        }
        newRwa.balanceValue = multiply(newRwa?.balance ?? '0', tokenWithPrice[symbolToLower(rwa.symbol)]?.price ?? '0')
        return newRwa
      }).sort((a, b) => Number(b.balanceValue) - Number(a.balanceValue))
    }, [rwaList, tokenWithBalance, tokenWithPrice])

    /* ── search ── */
    const [searchTerm, setSearchTerm] = useState('')

    const filteredTokens = useMemo(() => {
      if (!searchTerm.trim()) return rwaListWithBalance
      const term = searchTerm.toLowerCase().trim()
      return rwaListWithBalance.filter(
        (token) =>
          token.name.toLowerCase().includes(term) ||
          token.symbol.toLowerCase().includes(term),
      )
    }, [rwaListWithBalance, searchTerm])

    /* ── sort ── */
    const sortedTokens = useMemo(() => {
      if (!sort?.field || !sort?.order) return filteredTokens
      const list = [...filteredTokens]
      return list.sort((a, b) => {
        switch (sort.field) {
          case 'name': {
            const nameA = a.symbol?.toLowerCase() || ''
            const nameB = b.symbol?.toLowerCase() || ''
            return sort.order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
          }
          case 'change': {
            const upA = Number(a.up) || 0
            const upB = Number(b.up) || 0
            return sort.order === 'asc'
              ? upA - upB
              : upB - upA
          }
          case 'marketCap': {
            const totalA = Number(a.balance ?? '0') || 0
            const totalB = Number(b.balance ?? '0') || 0
            return sort.order === 'asc' ? totalA - totalB : totalB - totalA
          }
          default:
            return 0
        }
      })
    }, [filteredTokens, sort])

    /* ── websocket price sync ── */
    const setTokenWithPriceByWebSocketData = useBaseStore(
      (s) => s.setTokenWithPriceByWebSocketData,
    )
    const setStockWithPriceByWebSocketData = useBaseStore(
      (s) => s.setStockWithPriceByWebSocketData,
    )
    const stableTokenWithPrice = useWssStore((s) => s.setStableTokenWithPrice)
    const updateOriginSummary = useWssStore((s) => s.updateOriginSummary)

    useWssOn('aggregate', (data: any) => {
      const _data = data?.items || []
      setTokenWithPriceByWebSocketData(_data)
      setStockWithPriceByWebSocketData(_data)
      stableTokenWithPrice(_data)
      updateOriginSummary(_data)
    })
    const tradeStateLabel = useMemo(() => {
      let stateLabel = t("v3.t25")
      if (marketTradeState) {
        if (marketTradeState === MARKET_STATUS.BEFORE) {
          stateLabel = t("v3.t23")
        } else if (marketTradeState === MARKET_STATUS.OPEN) {
          stateLabel = t("v3.t24")
        } else if (marketTradeState === MARKET_STATUS.AFTER) {
          stateLabel = t("v3.t22")
        } else {
          stateLabel = t("v3.t25")
        }
      }
      console.log('marketTradeState', marketTradeState, stateLabel)
      return stateLabel
    }, [
      t,
      marketTradeState
    ])

    return (
      <Drawer open={open} onOpenChange={(open) => {
        
        onOpenChange(open)
        setTimeout(() => {
          if (!open) {
            setSearchTerm('')
            // @ts-ignore
            onSortChange(null)
          }
        }, 800)
      }} title={t('Select a token')}>
        <div className="flex flex-col gap-4 bg-[#1A1B1E] pt-4">
          {/* ── Search ── */}
          <div className="px-5 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-[4px] bg-[#131416] p-2 flex-1">
              <Search size={18} color="#737A87" className="shrink-0" />
              <Input
                className="h-auto pl-0 text-[16px] font-normal text-white placeholder:text-[#737A87]"
                placeholder={t('v2.tx.t36')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <MarketStatus />
          </div>

          {/* ── Column headers + list ── */}
          <div className="flex flex-col gap-2">
            {/* Column headers */}
            <div className="flex items-center gap-1 px-5 text-[14px] font-normal text-[#9DA3AF]">
              <div
                className={cn(
                  "flex w-[164px] shrink-0 cursor-pointer items-center gap-1",
                  account ? 'w-[164px]' : 'flex-1'
                )}
                onClick={() => onSortChange('name')}
              >
                {t('Name')}
                <SortButton order={sort?.field === 'name' ? sort?.order : undefined} />
              </div>
              <div
                className={cn(
                  'flex shrink-0 cursor-pointer items-center gap-0.5',
                  account ? 'w-[126px]' : 'flex-1',
                )}
                onClick={() => onSortChange('change')}
              >
                {t('Change')}
                <SortButton order={sort?.field === 'change' ? sort?.order : undefined} />
              </div>
              {account && (
                <div
                  className="flex flex-1 cursor-pointer items-center justify-end"
                  onClick={() => onSortChange('marketCap')}
                >
                  {t('Holdings')}
                  <SortButton
                    order={sort?.field === 'marketCap' ? sort?.order : undefined}
                  />
                </div>
              )}
            </div>

            {/* Token list */}
            <div className="scroll-box h-[60vh] overflow-y-auto">
              {sortedTokens.map((token, index) => (
                <TokenRow
                  key={`${_id}-${index}`}
                  token={token}
                  account={account}
                  onClick={(t) => {
                    onOpenChange(false)
                    onClick?.(t)
                  }}
                  marketOpen={marketTradeState === MARKET_STATUS.OPEN}
                  state={tradeStateLabel}
                />
              ))}
              {sortedTokens.length <= 0 && (
                <div className="py-[100px]">
                  <NoData />
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    )
  },
)

SymbolSelectDrawer.displayName = 'SymbolSelectDrawer'
