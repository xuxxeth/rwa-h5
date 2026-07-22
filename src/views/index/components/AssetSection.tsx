import { LazyImage } from "@/components/image/LazyImage";
import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import { useTranslation } from "@/hooks/useTranslation";
import { formatWithCommas, truncate } from "@/utils";
import { useAssetsList, useRiskControlAssets } from "@/views/assets/assetsList";
import { useState } from "react";
import { RiskControlAssets } from "./RiskControlAssets";

interface AssetSectionProps {
  isHidden: boolean;
  onToggleHidden: () => void;
}
function EyeHideIcon() {
  return (
    <div className="overflow-clip shrink-0 size-[16px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4.8265 3.58398C5.84231 3.21974 6.91606 3.03721 7.99739 3.04492C11.1879 3.04495 13.7945 4.47502 15.8167 7.33203C16.0576 7.67324 16.0597 8.12269 15.8206 8.46387C14.9455 9.71875 13.9505 10.6958 12.8382 11.3994L14.1742 12.7051L13.4495 13.4121L2.89974 3.11816L3.62532 2.41211L4.8265 3.58398ZM5.17904 6.73438C5.01521 7.09094 4.9242 7.48404 4.92415 7.89648C4.92415 9.50429 6.30093 10.8076 7.99935 10.8076C8.40222 10.8076 8.78822 10.7345 9.1429 10.5996L10.8968 12.3115C9.96185 12.6084 8.9825 12.7548 7.99935 12.749C4.78189 12.749 2.17527 11.3208 0.178059 8.46387C-0.060988 8.12265 -0.0590017 7.6713 0.181965 7.33008C1.00129 6.16953 1.92286 5.24192 2.94075 4.55176L5.17904 6.73438ZM7.99544 4.9834C7.4885 4.9834 7.01231 5.09945 6.59017 5.30566L7.78743 6.47559L9.51302 8.16113L10.6888 9.30371C10.9335 8.88739 11.0706 8.4072 11.0706 7.89648C11.0705 6.28883 9.69372 4.98344 7.99544 4.9834Z" fill="#737A87"/>
      </svg>
    </div>
  );
}

function EyeShowIcon() {
  return (
    <div className="overflow-clip shrink-0 size-[16px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M7.64468 12.7615C4.56443 12.7615 2.07001 11.3467 0.163277 8.51879C-0.055952 8.19455 -0.0541098 7.76899 0.166961 7.44475C2.09949 4.61505 4.59206 3.2002 7.64468 3.2002C10.6973 3.2002 13.1899 4.61505 15.1242 7.44475C15.3453 7.76899 15.3453 8.19455 15.1279 8.51879C13.2194 11.3467 10.7249 12.7615 7.64468 12.7615ZM7.64468 10.8492C9.26587 10.8492 10.5794 9.56519 10.5794 7.98085C10.5794 6.39651 9.26587 5.11246 7.64468 5.11246C6.0235 5.11246 4.70997 6.39651 4.70997 7.98085C4.70997 9.56519 6.0235 10.8492 7.64468 10.8492ZM7.64837 9.43623C6.83777 9.43623 6.18009 8.79513 6.18009 8.00112C6.18009 7.2071 6.83777 6.566 7.64837 6.566C8.45896 6.566 9.1148 7.20895 9.1148 8.00112C9.1148 8.79329 8.45896 9.43623 7.64837 9.43623Z" fill="#737A87"/>
      </svg>
    </div>
  );
}

export function AssetSection({ isHidden, onToggleHidden }: AssetSectionProps) {
  const [showChart, setShowChart] = useState(false)

  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3()
  const { assetsList, estimatedBalance, estimatedRwaTotalValue, estimatedStableTokenTotalValue } =
    useAssetsList(chainId ?? 97)
  const riskControlledAssets = useRiskControlAssets(chainId ?? 97, account)

  const isRiskControlled = riskControlledAssets.length > 0

  return (
    <div className="px-[16px] flex flex-col gap-[4px] items-start w-full shrink-0 mt-2">
      {/* Label row */}
      <div className=" flex items-center justify-between w-full">
        <button
          onClick={onToggleHidden}
          className="flex gap-[8px] items-center"
        >
          <span
            className="text-[#737a87] text-[14px] leading-normal whitespace-nowrap"
          >
            {t('portfolio.total')}
          </span>
          {isHidden ? <EyeHideIcon /> : <EyeShowIcon />}
        </button>
        <div className="flex items-center gap-x-[10px]">
          {
            isRiskControlled && <RiskControlAssets riskControlledAssets={riskControlledAssets} />
          }
          
          <button className="w-[18px] h-[18px]"
            onClick={e => {
              setShowChart(!showChart)
            }}
          >
            <LazyImage src={showChart ? "/images/v0.4/chart_show.png" : "/images/v0.4/chart_hide.png"} className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
      


      {/* Amount row */}
      <div className="flex gap-[4px] items-center w-full">
        <span
          className="text-white text-[28px] font-semibold leading-normal"
        >
          {isHidden ? "****" : estimatedBalance !== undefined
                  ? formatWithCommas(truncate(estimatedBalance, 2), 2)
                  : '--'}
        </span>
        <span
          className="text-white text-[14px] font-medium leading-none"
        >
          USD
        </span>
      </div>
    </div>
  );
}