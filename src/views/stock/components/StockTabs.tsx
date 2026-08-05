import { useTranslation } from '@/hooks/useTranslation'

export type TabType = "chart" | "info" | "fi";
export interface MarketTabsProps {
  activeTab: TabType;
  type?: string;
  onTabChange: (tab: TabType) => void;
}

export function StockTabs({ activeTab, type, onTabChange }: MarketTabsProps) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-[20px] items-center px-[16px] h-[34px] border-b border-[#232427] mt-4">
      <button
        onClick={() => onTabChange("chart")}
        className="flex h-[28px] items-center justify-center "
      >
        <span
          className="text-[14px] leading-normal whitespace-nowrap"
          style={{
            color: activeTab === "chart" ? "#ffffff" : "#9da3af",
            fontWeight: activeTab === "chart" ? 500 : 400,
          }}
        >
          {t('v4.t99')}
        </span>
      </button>
      <button
        onClick={() => onTabChange("info")}
        className="flex h-[28px] items-center justify-center "
      >
        <span
          className="text-[14px] leading-normal whitespace-nowrap"
          style={{
            color: activeTab === "info" ? "#ffffff" : "#9da3af",
            fontWeight: activeTab === "info" ? 500 : 400,
          }}
        >
          {t('v4.t100')}
        </span>
      </button>
      <button
        onClick={() => onTabChange("fi")}
        className="flex h-[28px] items-center justify-center "
      >
        <span
          className="text-[14px] leading-normal whitespace-nowrap"
          style={{
            color: activeTab === "fi" ? "#ffffff" : "#9da3af",
            fontWeight: activeTab === "fi" ? 500 : 400,
          }}
        >
          {t('v4.t101')}
        </span>
      </button>
    </div>
  );
}
