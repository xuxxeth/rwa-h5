import { useRef, useState } from "react";
import { MarketTabs, WatchlistTab, type TabType } from "../index/components/WatchListAndHoldings";
import { CTokenListV2, type CTokenListRef } from "@/components/ctoken-list/CtokenList";
import { MarketStatus } from "@/components/markets/MarketStatus";
import { useRouter } from "@/hooks/useRouter";
import { SearchInput } from "@/components/search";

function KLine() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("watchlist");

  const listRef = useRef<CTokenListRef>(null)
  
  return (
    <div className="flex flex-col gap-[16px] w-full">
      <div className=" px-4 mt-4">
        <SearchInput onChange={e => {
          listRef.current?.handleSearchChange(e.target.value)
        }} />
      </div>
      <div className=" flex items-center justify-between pr-4">
        <MarketTabs type="all" activeTab={activeTab} onTabChange={setActiveTab} />
        <MarketStatus from="trade" />
      </div>
      {
        activeTab === "watchlist" ? <WatchlistTab /> : 
        <CTokenListV2 from="kline" ref={listRef} onClick={(token) => {
          router.push('/stock/' + token.symbol)
        }}  />
      }
    </div>
  )
}

export default KLine