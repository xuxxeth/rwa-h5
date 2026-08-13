import { memo, forwardRef, useId, useImperativeHandle, useMemo, useState, useCallback } from "react"
import { useTranslation } from "@/hooks/useTranslation";
import { LazyImage } from "../image/LazyImage"
import { useRwas } from "@/hooks/useRwaBalances";
import type { IRwa } from "@/service/base/types";
import { formatTokenAmountWithCommas, formatWithCommas, textPrefix, truncate } from "@/utils/format";
import { advancedSort, divide, multiply, symbolToLower } from "@/utils";
import { useBaseStore } from "@/stores/baseStore";
import { useRwaPrice, useTokenBalance } from "@/hooks/useTokenBalances";
import { SortButton } from "../sort-button-svg";
import { useTableSort } from "@/hooks/useTableHelper";
import { cn } from "@/lib/utils";
import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import useFavorites from "@/hooks/useFavorites";
import IconWithTooltip from "../icon-tooltip";
import { useWssStore } from "@/stores/wssStore";
import { useWssOn } from "@/hooks/useWssOn";
import { SessionType, TradeState } from "@/views/markets/MarketQuotes";
import { CircleLoading } from "../loading";
import { useViewHistory } from "@/hooks/useViewHistory";
import { useAssetsList, type IAssetItem } from "@/views/assets/assetsList";
import { NoDataReason } from "./CtokenList";

export type CTokenProps = {
  stock: string,
  rwa: string,
  icon: string,
  balance: string,
  price: string,
  up: string,
  lock?: number
  state?: string
}

export type CTokenListRef = {
  handleSearchChange: (value: string) => void
  resetSearch: () => void
}

export function SplitsStockState({ }: { }) {
  const { t } = useTranslation()
  return (
    <IconWithTooltip tooltip={t('events.t41')}>
      <div className='min-h-[23px] py-1 rounded-[4px] flex items-center text-center px-1 bg-[rgba(156,255,58,0.1)] text-[#9CFF3A] text-[12px] ml-2'>
        {t('events.t4')}
      </div>
    </IconWithTooltip>
  )
}

export const CTokenBalance = ({ isSplit, token }: {token: IAssetItem, isSplit: boolean }) => {

  return (
    <div className="text-right text-[12px] pr-1">
      <div className=" font-medium leading-[24px] text-white">
        {token.holdings ? formatWithCommas(truncate(token.holdings, 2), 2) : '--'}
        
      </div>
      {
        isSplit ? <div className=" font-normal text-[#9DA3AF]">-- </div> : <div className=" font-normal text-[#9DA3AF]">
          ≈ {token.value ? textPrefix(formatWithCommas(truncate(token.value, 2), 2), '$') : '--'}
        </div>
      }
      
    </div>
  );
}

export const CTokenItem = 

  ({ token, onClick, account, from }: {
    token: IAssetItem,
    onClick?: (token: IAssetItem) => void,
    account?: string, 
    from?: string,
  }) => {  
    return (
      <div className="h-[48px] flex items-center justify-between mt-2 cursor-pointer hover:bg-[#232427] px-4 pr-2 relative group"
        onClick={() => {
          // updateHistory(token)
          onClick && onClick(token)
        }}
      >
        <div className={cn(
          "flex items-center gap-x-2 w-5/8 shrink-0",
        )}>
          <div className="w-[28px] h-[28px] shrink-0">
            {token.icon && <LazyImage src={token.icon} className="w-[28px] h-[28px] rounded-full" />}
          </div>
          <div>
            <div className=" text-[14px] font-medium ">{token.symbol}</div>
            <div className=" text-[12px] font-normal text-[#9DA3AF] max-w-[80px] truncate">{token.name}</div>
          </div>
          {
            !token.isStableToken && (
              <div className="flex items-center"
                
              >
                {!token.isStableToken && token.splitStatus !== 0 && <SplitsStockState />}
                <TradeState state={token.rwaState ?? 0} />
                <SessionType sessionMask={token.sessionMask ?? 0} />
              </div>
            )
          }
          
        </div>
        
        {
          account && from !== 'search' && <div className="w-2/8 text-right">
            <CTokenBalance token={token} isSplit={!token.isStableToken && token.splitStatus !== 0} />
          </div>
        }
        
      </div>
    )
  }

export type SortableField = 'name' | 'token' | 'price' | 'change' | 'marketCap' | 'dailyHigh'

export type TabItemProps = {
  id: string;
  label: string;
  key: string;
}

const CTokenListInAssets = memo(
  forwardRef<CTokenListRef, { from?: string, tokenList?: IRwa[], onClick?: (token: IAssetItem) => void}>(({ from, tokenList, onClick }, ref) => {
    const { t } = useTranslation()
    const { account, chainId } = useActiveWeb3()
    const { sort, onSortChange } = useTableSort<SortableField>()
    const allTokensLoading = useBaseStore(state => state.allTokensLoading)
    const { isFavorite, favorites, toggleFavorite, toggleEnable, ...favoritesRest } = useFavorites()
    const { assetsList } =
        useAssetsList(chainId ?? 97)

    const _id = useId()
    const defaultSort = useCallback((item1: IAssetItem, item2: IAssetItem) => {
      const isItem1Rwa = Boolean(item1.rwaId)
      const isItem2Rwa = Boolean(item2.rwaId)

      if (!isItem1Rwa && isItem2Rwa) return -1
      if (isItem1Rwa && !isItem2Rwa) return 1

      if (item1.holdings !== item2.holdings) {
        return advancedSort(item1.holdings, item2.holdings, 'desc')
      } else {
        return advancedSort(item1.weight, item2.weight, 'desc')
      }
    }, [])

    const sortTokens = useMemo(() => {
      if (!favoritesRest.isSignatureValid) return []
      if (!sort?.field || !sort?.order) {
        return assetsList.sort(defaultSort)
      }

      const list = [...assetsList]

      return list.sort((a, b) => {
        switch (sort.field) {
          case 'name': {
            const nameA = a.symbol?.toLowerCase() || ''
            const nameB = b.symbol?.toLowerCase() || ''
            return sort.order === 'asc'
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA)
          }

          case 'marketCap': {
            const balanceA = a.holdings ?? '0'
            const balanceB = b.holdings ?? '0'

            const totalA = Number(balanceA) || 0
            const totalB = Number(balanceB) || 0

            return sort.order === 'asc'
              ? totalA - totalB
              : totalB - totalA
          }

          default:
            return 0
        }
      })
    }, [assetsList, sort, favoritesRest.isSignatureValid])

    const setTokenWithPriceByWebSocketData = useBaseStore(
      state => state.setTokenWithPriceByWebSocketData
    )
    const setStockWithPriceByWebSocketData = useBaseStore(
      state => state.setStockWithPriceByWebSocketData
    )
    const stableTokenWithPrice = useWssStore(state => state.setStableTokenWithPrice)
    const updateOriginSummary = useWssStore(state => state.updateOriginSummary)

    useWssOn('aggregate', (data: any) => {
      const _data = data?.items || []
      setTokenWithPriceByWebSocketData(_data)
      setStockWithPriceByWebSocketData(_data)
      stableTokenWithPrice(_data)
      updateOriginSummary(_data)
    })

    return (
      <div className="border-t border-[#232427] relative text-white">
        <div className=" absolute w-2 top-0 -right-1 h-[1px] bg-[#232427]"></div>
        <div className="mt-2">
          <div className=" flex items-center justify-between text-[12px] font-normal px-4">
            <div className={cn(
              "w-5/8 flex items-center cursor-pointer",
            )}
              onClick={() => {
                onSortChange('name')
              }}
            >
              {t("Name")}
              <div className="text-[rgba(255,255,255,0.6)]">
                <SortButton order={sort?.field === 'name' ? sort?.order : undefined} />
              </div>
            </div>
            
            <div className="w-2/8 text-right flex items-center justify-end cursor-pointer"
              onClick={() => {
                onSortChange('marketCap')
              }}
            >
              {t("Holdings")}
              <div className="text-[rgba(255,255,255,0.6)]">
                <SortButton order={sort?.field === 'marketCap' ? sort?.order : undefined} />
              </div>
            </div>
            
          </div>
          
          <div className={cn(
            "scroll-box h-[65vh] overflow-y-auto mt-2 pr-0 text-white",
            from === "StockSelect" ? "h-[50vh]" : ""
          )}>
            {
              sortTokens.map((token, index) => <CTokenItem from={from}  account={account} key={`${_id}-${index}`} token={token} onClick={onClick} />)
            }
           
            {!allTokensLoading && sortTokens.length <= 0 && (
              <div className="px-8">
                <NoDataReason
                  isFavorites={true}
                  {...favoritesRest}
                />
              </div>
            )}
            {
              allTokensLoading && <div className=" w-full min-h-[50vh] flex justify-center pt-10"><CircleLoading className='absolute top-[50px] left-1/2 -translate-x-1/2 -translate-y-1/2' /></div>
            }
          </div>
          
        </div>

      </div>
    )
  }))


export { CTokenListInAssets }
