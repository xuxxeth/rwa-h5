import { memo, forwardRef, useId, useImperativeHandle, useMemo, useState } from "react"
import { useTranslation } from "@/hooks/useTranslation";
import { LazyImage } from "../image/LazyImage"
import { useRwas } from "@/hooks/useRwaBalances";
import type { IRwa } from "@/service/base/types";
import { formatTokenAmountWithCommas } from "@/utils/format";
import { multiply, symbolToLower } from "@/utils";
import { useBaseStore } from "@/stores/baseStore";
import { useRwaPrice, useTokenBalance } from "@/hooks/useTokenBalances";
import { SortButton } from "../sort-button-svg";
import { useTableSort } from "@/hooks/useTableHelper";
import { cn } from "@/lib/utils";
import { NoData } from "../markets/NoData";
import { Input } from "../ui/input";
import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import { WalletNotConnectedSmallVersion } from "../wallet-not-connected";
import useFavorites from "@/hooks/useFavorites";
import SignatureVerify from '@/components/signature-verify'
import IconWithTooltip from "../icon-tooltip";
import { useWssStore } from "@/stores/wssStore";
import { useWssOn } from "@/hooks/useWssOn";
import { SessionType, TradeState } from "@/views/markets/MarketQuotes";

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

export const CTokenPrice = memo(({ symbol }: { symbol: string;}) => {
  const tokenPrice = useRwaPrice(symbol);
  const up = useMemo(() => Number(tokenPrice?.up), [tokenPrice?.up])
  return (
    <div className="text-[12px]">
      <span className=" font-medium">${tokenPrice?.price ?? '--'}</span>
      <div className=" font-normal flex items-center gap-x-[4px]">
        {/* {
          up !== 0 &&
            <img
              src={up > 0 ? "/images/convert/price_up.png" : "/images/convert/price_down.png"}
              className="w-[6px]"
            />
        } */}
        
        <span
          className={
            up === 0 ? 'text-[#A1A1A1]' : up > 0
              ? "text-[#50E3C2] text-[12px]"
              : "text-[rgba(227,80,122,1)] text-[12px]"
          }
        >
          {up !== 0 && (up > 0 ? '+' : '-')}
          {Math.abs(Number(tokenPrice?.up || "0"))}%
        </span>
      </div>
    </div>
  );
});
export const CTokenBalance = memo(({ symbol, pricePrecision }: { symbol: string; pricePrecision: number }) => {
  const tokenBalance = useTokenBalance(symbol)?.balance ?? "0";
  const tokenPrice = useRwaPrice(symbol)?.price ?? "0";

  const total = multiply(tokenBalance, tokenPrice);

  return (
    <div className="text-right text-[12px] pr-1">
      <div className=" font-medium leading-[24px] text-white">
        {formatTokenAmountWithCommas(tokenBalance)}
      </div>
      <div className=" font-normal text-[#9DA3AF]">
        ≈ ${formatTokenAmountWithCommas(total, pricePrecision)}
      </div>
    </div>
  );
});

export const CTokenItem = memo(

  ({ token, onClick, account, from }: {token: IRwa, onClick?: (token: IRwa) => void, account?: string, from?: string}) => {  
    
    return (
      <div className="h-[48px] flex items-center justify-between mt-2 cursor-pointer hover:bg-[#232427] px-4 pr-2 relative group"
        onClick={() => {
          onClick && onClick(token)
        }}
      >
        <div className={cn(
          "flex items-center gap-x-2 w-5/8 shrink-0",
          account ? "w-4/8" : ""
        )}>
          <div className="w-[28px] h-[28px] shrink-0">
            <LazyImage src={token.icon} className="w-[28px] h-[28px] rounded-full" />
          </div>
          <div>
            <div className=" text-[14px] font-medium ">{token.symbol}</div>
            <div className=" text-[12px] font-normal text-[#9DA3AF] max-w-[80px] truncate">{token.name}</div>
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
        {
          from !== 'assets' && (
            <div className={cn(
              "w-3/8 flex items-center ",
              account ? "w-2/8 justify-start" : ""
            )}>
              <CTokenPrice symbol={token.symbol} />
            </div>
          )
        }
        
        {
          account && from !== 'search' && <div className="w-2/8 text-right">
            <CTokenBalance symbol={token.symbol} pricePrecision={token.precision} />
          </div>
        }
        
      </div>
    )
  }
)

export type SortableField = 'name' | 'token' | 'price' | 'change' | 'marketCap' | 'dailyHigh'

export type TabItemProps = {
  id: string;
  label: string;
  key: string;
}

const FilterTabItem = memo(({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => {
  return (
    <div  className={cn(
      "px-[10px] h-[23px] flex items-center rounded-[2px] text-[12px] font-normal text-[#9DA3AF] cursor-pointer",
      active ? "bg-[#383A40] text-[#FFFFFF]" : ""
    )}
      onClick={onClick}
    >
      {label}
    </div>
  )
})

const FilterTabs = memo(({ onTabChange }: { onTabChange?: (tab: TabItemProps) => void }) => {  

  const { t } = useTranslation()
  const filteredTabs = useMemo(() => {
    return [
      {id: '1', label: t('v2.tx.t37'), key: 'all'},
      {id: '2', label: t('v2.tx.t38'), key: 'stared'},
    ]
  }, [t])
  const [currentTab, setCurrentTab] = useState<string>(filteredTabs[0].key)

  return (
    <div className="flex items-center gap-x-2 px-4 my-2">
      {
        filteredTabs.map((tab, index) => (
          <FilterTabItem 
            key={index}
            label={tab.label}
            active={currentTab === tab.key}
            onClick={() => {
              setCurrentTab(tab.key)
              onTabChange && onTabChange(tab)
            }}
          />
        ))
      }
    </div>
  )
})

const CTokenListV2 = memo(
  forwardRef<CTokenListRef, { from?: string, tokenList?: IRwa[], onClick?: (token: IRwa) => void}>(({ from, tokenList, onClick }, ref) => {
    const { t } = useTranslation()
    const { account } = useActiveWeb3()
    const { sort, onSortChange } = useTableSort<SortableField>()
    
    const tokenWithBalance = useBaseStore(state => state.tokenWithBalance)
    const tokenWithPrice = useBaseStore(state => state.tokenWithPrice)

    const [selectTab, setSelectTab] = useState('all')

    const { isFavorite, favorites, toggleFavorite, toggleEnable, ...favoritesRest } = useFavorites()

    const _id = useId()
    const rwaList = useRwas()

    const rwaMap = useMemo(() => {
      return new Map(rwaList.map(rwa => [rwa.stockId, rwa]))
    }, [rwaList])

    const newRwaList = useMemo(() => {
      if (from === 'custom' && tokenList) return tokenList;
      if(selectTab === 'all') return rwaList

      return [...favorites].reverse().map(favorite => rwaMap.get(favorite)).filter(rwa => rwa !== undefined)
    }, [rwaList, favorites, selectTab, from, tokenList])

    const rwaListWithBalance = useMemo(() => {
      let _newRwaList = newRwaList.filter(rwa => rwa.state !== 2).map(rwa => {
        const newRwa = {
          ...rwa,
          ...tokenWithBalance[symbolToLower(rwa.symbol)],
          ...tokenWithPrice[symbolToLower(rwa.symbol)],
        }
        newRwa.balanceValue = multiply(newRwa?.balance ?? '0', tokenWithPrice[symbolToLower(rwa.symbol)]?.price ?? '0')
        return newRwa
      }).sort((a, b) => {
          const nameA = a.symbol?.toLowerCase() || ''
          const nameB = b.symbol?.toLowerCase() || ''
          return nameA.localeCompare(nameB) 
        })
        .sort((a, b) => Number(b.weight) - Number(a.weight))
        .sort((a, b) => Number(b.balanceValue) - Number(a.balanceValue))
      // 如果是持有的，则通过balanceValue过滤
      if (from === 'holdings' || from === 'assets') {
        _newRwaList = _newRwaList.filter(rwa => Number(rwa.balanceValue) > 0)
      }
      return _newRwaList
    }, [newRwaList, tokenWithBalance, tokenWithPrice, from])

    const [searchTerm, setSearchTerm] = useState("")
    
    const handleSearchChange = (value: string) => {
      setSearchTerm(value)
    }

    useImperativeHandle(
      ref,
      () => ({
        handleSearchChange,
        resetSearch: () => setSearchTerm(''),
      }),
      []
    )

    const filterTokens = useMemo(() => {
      let tokens = rwaListWithBalance
      // 添加搜索过滤
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()
        tokens = tokens.filter(token => 
          token.name.toLowerCase().includes(term) ||
          token.symbol.toLowerCase().includes(term)
        )
      }
      
      return tokens
    }, [rwaListWithBalance, searchTerm, selectTab])

    const sortTokens = useMemo(() => {
      if (!sort?.field || !sort?.order) {
        return filterTokens
      }

      const list = [...filterTokens]

      return list.sort((a, b) => {
        switch (sort.field) {
          case 'name': {
            const nameA = a.symbol?.toLowerCase() || ''
            const nameB = b.symbol?.toLowerCase() || ''
            return sort.order === 'asc'
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA)
          }

          case 'change': {
            const upA = Number(a.up) || 0
            const upB = Number(b.up) || 0
            return sort.order === 'asc'
              ? upA - upB
              : upB - upA
          }

          case 'marketCap': {
            const balanceA = a.balance ?? '0'
            const balanceB = b.balance ?? '0'
            // const priceA = a.price ?? '0'
            // const priceB = b.price ?? '0'

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
    }, [filterTokens, sort])

    // useEffect(() => {
    //   onSortChange('marketCap')
    // }, [])


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
        {
          from === 'trade' && (
            <div className=" px-4 mt-4 mb-3">
              <div className="bg-[#232427] rounded-[4px] overflow-hidden flex items-center px-2 h-[42px]">
                <LazyImage src="/images/v2/icons/search.png" className="w-[12px] h-[12px]" />
                <Input className="pl-1 h-[40px] placeholder:text-[#737A87] text-[12px] font-normal " placeholder={t('v2.tx.t36')}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
          )
        }
        
        <div className="mt-2">
          <div className=" flex items-center justify-between text-[12px] font-normal px-4">
            <div className={cn(
              "w-5/8 flex items-center cursor-pointer",
              account ? "w-4/8" : ""
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
            {
              from !== 'assets' && (
                <div className={cn(
                  "flex items-center w-3/8 cursor-pointer",
                  account ? "w-2/8 justify-start" : ""
                )}
                  onClick={() => {
                    onSortChange('change')
                  }}
                  >{t("Change")}
                  <div className="text-[rgba(255,255,255,0.6)]">
                    <SortButton order={sort?.field === 'change' ? sort?.order : undefined} />
                  </div>
                </div>
              )
            }
            
            {
              account && from !== 'search' && 
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
            }
            
          </div>
          {/* {
            from === 'trade' && (
              <FilterTabs 
                onTabChange={tab => {
                  setSelectTab(tab.key)
                }}
              />
            )
          } */}
          
          <div className={cn(
            "scroll-box h-[65vh] overflow-y-auto mt-2 pr-0 text-white",
            from === "StockSelect" ? "h-[50vh]" : ""
          )}>
            {
              sortTokens.map((token, index) => <CTokenItem from={from}  account={account} key={`${_id}-${index}`} token={token} onClick={onClick} />)
            }
           
            {sortTokens.length <= 0 && <NoDataReason
              isFavorites={selectTab === 'stared'}
              {...favoritesRest}
            />}
          </div>
          
        </div>

      </div>
    )
  }))

export function NoDataReason(props: {
  isFavorites: boolean
  account?: string
  chainId: number | null
  isSignatureValid: boolean
  isWalletConnecting: boolean
  refreshIsSignatureValid: () => void
}) {
  if (!props.isFavorites) {
    return <NoData />
  }
  if (!props.account && props.isWalletConnecting) return null
  if (!props.account) return <WalletNotConnectedSmallVersion />
  if (!props.isSignatureValid)
    return (
      <SignatureVerify
        desc='signatureVerifyDescTop'
        subDesc='signatureVerifyDescBottom'
        className='mt-9'
        refreshIsSignatureValid={props.refreshIsSignatureValid}
      />
    )
  return <NoData />
}

export { CTokenListV2 }
