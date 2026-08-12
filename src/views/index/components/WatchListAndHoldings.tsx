import { CheckBoxBySVG } from "@/components/check-box";
import { CTokenListV2, NoDataReason } from "@/components/ctoken-list/CtokenList";
import { Button } from "@/components/ui/button";
import { PAGE_FROM } from "@/config/constants";
import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import { useRouter } from "@/hooks/useRouter";
import { useWatchList } from "@/hooks/useWatchList";
import { useTranslation } from "@/hooks/useTranslation";
import type { IRwa } from "@/service/base/types";
import storage from "@/utils/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { CircleLoading } from "@/components/loading";
import { useSignatureValidStatus } from "@/hooks/useSignature";
import SignatureVerify from "@/components/signature-verify";
import useFavorites from "@/hooks/useFavorites";

export type TabType = "watchlist" | "holdings" | "all";
export interface MarketTabsProps {
  activeTab: TabType;
  type?: string;
  onTabChange: (tab: TabType) => void;
}

export function MarketTabs({ activeTab, type, onTabChange }: MarketTabsProps) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-[8px] items-center px-[16px]">
      <button
        onClick={() => onTabChange("watchlist")}
        className="flex h-[28px] items-center justify-center px-[8px] rounded-[6px] transition-colors"
        style={{ background: activeTab === "watchlist" ? "#383a40" : "transparent" }}
      >
        <span
          className="text-[14px] leading-normal whitespace-nowrap"
          style={{
            color: activeTab === "watchlist" ? "#ffffff" : "#9da3af",
            fontWeight: activeTab === "watchlist" ? 500 : 400,
          }}
        >
          {t('v4.t39')}
        </span>
      </button>
      <button
        onClick={() => onTabChange("holdings")}
        className="flex h-[28px] items-center justify-center px-[8px] rounded-[6px] transition-colors"
        style={{ background: activeTab === "holdings" ? "#383a40" : "transparent" }}
      >
        <span
          className="text-[14px] leading-normal whitespace-nowrap"
          style={{
            color: activeTab === "holdings" ? "#ffffff" : "#9da3af",
            fontWeight: activeTab === "holdings" ? 500 : 400,
          }}
        >
          {type === 'all' ? t('v4.t64') : t('v4.t63')}
        </span>
      </button>
    </div>
  );
}
function WatchlistCard({ item, onChecked }: { item: IRwa, onChecked: (rwa: IRwa ,checked: boolean) => void }) {

  const [selected, setSelected] = useState(true)

  return (
    <div className="bg-[#1A1B1E] flex-1 min-w-0 rounded-[8px]">
      <div className="flex items-center justify-between p-[16px]">
        <div className="flex flex-1 gap-[8px] items-center min-w-0">
          <div className="shrink-0 size-[28px] relative">
            <img
              alt={item.symbol}
              className="absolute inset-0 max-w-none object-cover size-full"
              src={item.icon}
            />
          </div>
          <div className="flex flex-col gap-[2px] min-w-0">
            <span
              className="text-white text-[14px] font-medium leading-normal whitespace-nowrap"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.symbol}
            </span>
            <span
              className="text-[#737a87] text-[12px] leading-normal whitespace-nowrap max-w-[80%] truncate"
            >
              {item.name}
            </span>
          </div>
        </div>
        <CheckBoxBySVG checked={selected} onChange={(checked) => {
          setSelected(checked)
          onChecked(item, checked)
        }} />
      </div>
    </div>
  );
}

export function WatchlistTab() {
  const { t } = useTranslation()
  const router = useRouter()
  const { account, chainId } = useActiveWeb3()
  const { isSignatureValid, refreshIsSignatureValid, recommendList, customOptions, handleRefresh } = useWatchList()
  const [hasChecked, setHasChecked] = useState(true)
  const checkedList = useRef<IRwa[]>([])
  const { isFavorite, favorites, toggleFavorite, toggleEnable, addLoading, addFavorites, ...favoritesRest } = useFavorites()

  useEffect(() => {
    checkedList.current = [...recommendList]
  }, [recommendList])

  const handleCheck = useCallback(async (rwa: IRwa, checked: boolean) => {
    if (checked) {
      checkedList.current.push(rwa)
    } else {
      const _index = checkedList.current.findIndex(rwa => rwa.stockId === rwa.stockId)
      checkedList.current.splice(_index, 1)
    }
    if (checkedList.current.length <= 0) {
      setHasChecked(false)
    }
  }, [])

  const handleAddCustom = useCallback(async () => {
    if (account && chainId) {
      const storageKey = account + chainId
      storage.setItem(storageKey, checkedList.current)
      handleRefresh()
    }
    
  }, [account, chainId, handleRefresh])

  if (!customOptions) return (
    <div className=" w-full min-h-[50vh] flex justify-center pt-10 text-white relative"><CircleLoading className='absolute top-[50px] left-1/2 -translate-x-1/2 -translate-y-1/2' /></div>
  )

  if (!isSignatureValid && customOptions.length <= 0) {
    return (<div className="px-8">
        <NoDataReason 
          isFavorites={true}
          {...favoritesRest}
        />
      </div>
    )
  }

  return (
    <>
      {
        customOptions.length <= 0 ? (
          <div className="px-[16px] flex flex-col gap-[16px] items-center w-full">
            <div className=" grid grid-cols-2 gap-[10px] w-full min-h-[156px]">
              {recommendList.map((item) => (
                <WatchlistCard key={item.id + "-top"} item={item} onChecked={handleCheck} />
              ))}
              
            </div>
            {
              recommendList.length > 0 && (
                <Button
                  className="w-full h-[44px]"
                  disabled={!hasChecked || addLoading}
                  loading={addLoading}
                  onClick={e => {
                    addFavorites(checkedList.current.map(rwa => rwa.stockId))
                  }}
                >
                  {t('v4.t40')}
                </Button>
              )
            }
            
            
          </div>
        ) : (
          <CTokenListV2 from="custom" tokenList={customOptions} 
            onClick={(token) => {
              storage.setItem(PAGE_FROM, router.location.pathname)
              router.push('/stock/' + token.symbol)
            }} 
          />
        )
      }
    </>
    
  );
}

function HoldingsTab() {
  const router = useRouter()
  return (
    <CTokenListV2 from="holdings" 
      onClick={(token) => {
        storage.setItem(PAGE_FROM, '/')
        router.push('/stock/' + token.symbol)
      }} 
    />
  );
}

export function WatchListAndHolsings() {
  const [activeTab, setActiveTab] = useState<TabType>("watchlist");

  return (
    <div className="flex flex-col gap-[16px] w-full">
      <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "watchlist" ? <WatchlistTab /> : <HoldingsTab />}
    </div>
  )
}
