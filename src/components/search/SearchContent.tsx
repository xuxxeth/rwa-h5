import { useWssOn } from "@/hooks/useWssOn"
import { LazyImage } from "../image/LazyImage"
import { useBaseStore } from "@/stores/baseStore"
import { useWssStore } from "@/stores/wssStore"
import { forwardRef, memo, useEffect, useId, useImperativeHandle, useMemo, useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { useActiveWeb3 } from "@/hooks/useActiveWe3"
import { useTableSort } from "@/hooks/useTableHelper"
import { CTokenItem, NoDataReason, type SortableField } from "../ctoken-list/CtokenList"
import useFavorites from "@/hooks/useFavorites"
import { useRwas } from "@/hooks/useRwaBalances"
import { cn, divide, multiply, symbolToLower } from "@/utils"
import type { IRwa } from "@/service/base/types"
import { useRouter } from "@/hooks/useRouter"
import { useViewHistory } from "@/hooks/useViewHistory"
import { useToast } from "@/hooks/useToast"
import { SortButton } from "../sort-button-svg"

export type SearchContentRef = {
  handleSearchChange: (value: string) => void
  resetSearch: () => void
  handleGetHistory: () => void
}

export function HistoryItem({ rwa, onClick }: {rwa: IRwa, onClick?: (rwa: IRwa) => void}) {
  return (
    <div className="flex gap-x-1 items-center px-3 h-[32px] bg-[#1A1B1E] rounded-[6px]" onClick={() => onClick?.(rwa)}>
      <div className="w-[16px] h-[16px]">
        <LazyImage src={rwa?.icon} className="w-[16px] h-[16px] rounded-full" />
      </div>
      <span className="text-[#C7CCD6] text-[12px] font-medium">{rwa?.symbol}</span>
    </div>
  )
}

const SearchContent = memo(
  forwardRef<SearchContentRef, {
    show: boolean,
    top: number,
    height: number
    listHeight: number
  }>((props, ref) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { toastError } = useToast()
  const { account } = useActiveWeb3()
  const { sort, onSortChange } = useTableSort<SortableField>()
  
  const tokenWithPrice = useBaseStore(state => state.tokenWithPrice)
  const { updateHistory, removeHistoryAll, getHistoryList } = useViewHistory()

  const [selectTab, setSelectTab] = useState('all')

  const { isFavorite, favorites, toggleFavorite, toggleEnable, ...favoritesRest } = useFavorites()
  const _id = useId()
  const rwaList = useRwas()

  const rwaMap = useMemo(() => {
    return new Map(rwaList.map(rwa => [rwa.stockId, rwa]))
  }, [rwaList])

  const newRwaList = useMemo(() => {
    if(selectTab === 'all') return rwaList

    return [...favorites].reverse().map(favorite => rwaMap.get(favorite)).filter(rwa => rwa !== undefined)
  }, [rwaList, favorites, selectTab])

  const rwaListWithBalance = useMemo(() => {
    let _newRwaList = newRwaList.filter(rwa => rwa.state !== 2).map(rwa => {
      const newRwa = {
        ...rwa,
        ...tokenWithPrice[symbolToLower(rwa.symbol)],
      }
      return newRwa
    }).sort((a, b) => {
        const nameA = a.symbol?.toLowerCase() || ''
        const nameB = b.symbol?.toLowerCase() || ''
        return nameA.localeCompare(nameB) 
      })
      .sort((a, b) => Number(b.weight) - Number(a.weight))
      .sort((a, b) => Number(b.balanceValue) - Number(a.balanceValue))

    return _newRwaList
  }, [newRwaList, tokenWithPrice])

  const [searchTerm, setSearchTerm] = useState("")
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }
  const [historyList, setHistoryList] = useState<IRwa[] | null>(null)
  const handleGetHistory = () => {
    const localeList: IRwa[] = getHistoryList() || []
    setHistoryList(localeList)
  }
  useImperativeHandle(
    ref,
    () => ({
      handleGetHistory,
      handleSearchChange,
      resetSearch: () => setSearchTerm(''),
    }),
    []
  )

  const filterTokens = useMemo(() => {
    let tokens = rwaListWithBalance
    if (!searchTerm) return []
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

  const stableTokenWithPrice = useWssStore(state => state.setStableTokenWithPrice)
  const updateOriginSummary = useWssStore(state => state.updateOriginSummary)

  useWssOn('aggregate', (data: any) => {
    const _data = data?.items || []
    stableTokenWithPrice(_data)
    updateOriginSummary(_data)
  })


  // 搜索结果点击处理
  const handleClick = (rwa: IRwa) => {
    console.log(rwaList)
    // 这里要判断当前保存的rwa有没有在rwaList中，如果没有则toast提示“该资产已下架”，并且不跳转
    const isRwaExist = rwaList.some(item => item.address.toLowerCase() === rwa.address.toLowerCase())
    if (!isRwaExist) {
      toastError({title: t('v4.t124')})
      return
    }
    updateHistory(rwa)
    router.push('/stock/' + rwa.symbol)
  }

  if (!props.show) return null



  return (
    <div className=" fixed w-full bg-[#131416] left-0 right-0 z-[99] text-[#737A87] pt-5"
      style={{
        top: props.top,
        height: props.height
      }}
    >
      {
        searchTerm.length <= 0 && (
          <div className=" px-4">
            <div className="flex items-center justify-between">
              <span className="text-[#FFFFFF] text-[16px] font-semibold">{t('v4.t33')}</span>
              <button onClick={e => {
                e.stopPropagation()
                setHistoryList([])
                removeHistoryAll()
              }}>
                <LazyImage src="/images/h5/icons/delete2.png" className="w-[14px]" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-1"
            >
              {
                historyList?.map(rwa => {
                  return (
                    <HistoryItem key={rwa.address} rwa={rwa} onClick={handleClick} />
                  )
                })
              }
              {historyList && historyList.length <= 0 && (
                <div className="mt-10 flex justify-center w-full">
                  <NoDataReason
                    isFavorites={selectTab === 'stared'}
                    {...favoritesRest}
                  />
                </div>
              )}
            </div>
          </div>
        )
      }
      {
        searchTerm.length > 0 && (
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
              
              
            </div>
            
            <div className={cn(
              "scroll-box overflow-y-auto mt-2 pr-0 text-white pb-[60px]",
            )}
              style={{
                height: props.listHeight
              }}
            >
              {
                sortTokens.map((token, index) => <CTokenItem from={'search'}  account={account} key={`${_id}-${index}`} token={token} 
                  toggleEnable={toggleEnable} toggleFavorite={toggleFavorite} isFavorite={isFavorite(token.stockId)}
                  onClick={(rwa) => {
                    handleClick(rwa)
                  }} />)
              }
              
              {sortTokens.length <= 0 && (
                <div className="mt-10">
                  <NoDataReason
                    isFavorites={selectTab === 'stared'}
                    {...favoritesRest}
                  />
                </div>
              )}
            </div>
            
          </div>
        )
      }
      
    </div>
  )
}
)) 

export { SearchContent }
