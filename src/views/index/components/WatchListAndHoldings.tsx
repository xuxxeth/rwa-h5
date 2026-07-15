import { useState } from "react";

interface StockHolding {
  id: string;
  ticker: string;
  name: string;
  price: string;
  change: string;
  holdings: string;
  holdingsUsd: string;
  isDown: boolean;
}

interface WatchlistItem {
  id: string;
  ticker: string;
  name: string;
}

const holdingsData: StockHolding[] = [
  { id: "1", ticker: "APPLc", name: "Apple", price: "100.03", change: "-2.98%", holdings: "100.03", holdingsUsd: "≈ $100.03", isDown: true },
  { id: "2", ticker: "APPLc", name: "Apple", price: "100.03", change: "-2.98%", holdings: "100.03", holdingsUsd: "≈ $100.03", isDown: true },
  { id: "3", ticker: "APPLc", name: "Apple", price: "100.03", change: "-2.98%", holdings: "100.03", holdingsUsd: "≈ $100.03", isDown: true },
  { id: "4", ticker: "APPLc", name: "Apple", price: "100.03", change: "-2.98%", holdings: "100.03", holdingsUsd: "≈ $100.03", isDown: true },
  { id: "5", ticker: "APPLc", name: "Apple", price: "100.03", change: "-2.98%", holdings: "100.03", holdingsUsd: "≈ $100.03", isDown: true },
];

const watchlistData: WatchlistItem[] = [
  { id: "1", ticker: "NVDAt", name: "英偉達" },
  { id: "2", ticker: "NVDAt", name: "英偉達" },
  { id: "3", ticker: "NVDAt", name: "英偉達" },
  { id: "4", ticker: "NVDAt", name: "英偉達" },
];

type TabType = "watchlist" | "holdings";
interface MarketTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

function MarketTabs({ activeTab, onTabChange }: MarketTabsProps) {
  return (
    <div className="flex gap-[8px] items-center px-[16px] shrink-0 w-full">
      <button
        onClick={() => onTabChange("watchlist")}
        className="flex h-[28px] items-center justify-center px-[8px] rounded-[6px] transition-colors"
        style={{ background: activeTab === "watchlist" ? "#383a40" : "transparent" }}
      >
        <span
          className="text-[14px] leading-normal whitespace-nowrap"
          style={{
            fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
            color: activeTab === "watchlist" ? "#ffffff" : "#9da3af",
            fontWeight: activeTab === "watchlist" ? 500 : 400,
          }}
        >
          自选
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
            fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
            color: activeTab === "holdings" ? "#ffffff" : "#9da3af",
            fontWeight: activeTab === "holdings" ? 500 : 400,
          }}
        >
          持有
        </span>
      </button>
    </div>
  );
}
function WatchlistCard({ item }: { item: WatchlistItem }) {
  return (
    <div className="bg-[#1A1B1E] flex-1 min-w-0 rounded-[8px]">
      <div className="flex items-center justify-between p-[16px]">
        <div className="flex flex-1 gap-[8px] items-center min-w-0">
          <div className="shrink-0 size-[28px] relative">
            <img
              alt={item.ticker}
              className="absolute inset-0 max-w-none object-cover size-full"
              src={''}
            />
          </div>
          <div className="flex flex-col gap-[2px] min-w-0">
            <span
              className="text-white text-[14px] font-medium leading-normal whitespace-nowrap"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.ticker}
            </span>
            <span
              className="text-[#737a87] text-[12px] leading-normal whitespace-nowrap"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.name}
            </span>
          </div>
        </div>
        {/* <CheckboxIcon /> */}
      </div>
    </div>
  );
}

function WatchlistTab() {
  return (
    <div className="px-[16px] flex flex-col gap-[16px] items-center w-full">
      <div className="flex flex-col gap-[10px] w-full">
        {/* 2x2 grid */}
        <div className="flex gap-[10px] items-start w-full">
          {watchlistData.slice(0, 2).map((item) => (
            <WatchlistCard key={item.id + "-top"} item={item} />
          ))}
        </div>
        <div className="flex gap-[10px] items-start w-full">
          {watchlistData.slice(2, 4).map((item) => (
            <WatchlistCard key={item.id + "-bot"} item={item} />
          ))}
        </div>
      </div>
      {/* Add watchlist button */}
      <div className="bg-white rounded-[8px] h-[44px] w-full">
        <button className="flex items-center justify-center size-full px-[24px] py-[8px]">
          <span
            className="text-black text-[14px] font-medium leading-normal whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif" }}
          >
            添加自选
          </span>
        </button>
      </div>
    </div>
  );
}

function HoldingsTab() {
  return (
    <div className="flex flex-col w-full">
      
    </div>
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