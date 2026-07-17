import { useRef, useState } from "react";
import { MarketTabs, WatchlistTab, type TabType } from "../index/components/WatchListAndHoldings";
import { CTokenListV2, type CTokenListRef } from "@/components/ctoken-list/CtokenList";
import { LazyImage } from "@/components/image/LazyImage";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { MarketStatus } from "@/components/markets/MarketStatus";
import { useRouter } from "@/hooks/useRouter";

function KLine() {
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>("watchlist");

  const listRef = useRef<CTokenListRef>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  return (
    <div className="flex flex-col gap-[16px] w-full">
      <div className=" px-4 mt-4">
        <div className="bg-[#1A1B1E] rounded-[4px] overflow-hidden flex items-center px-2 h-[42px]">
          <LazyImage src="/images/v2/icons/search.png" className="w-[14px] " />
          <Input className="pl-1 h-[40px] placeholder:text-[#737A87] text-[14px] text-white font-normal " placeholder={t('v2.tx.t36')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              listRef.current?.handleSearchChange(e.target.value)
            }}
          />
        </div>
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