import { MARKET_STATUS } from "@/config/constants"
import { useTradingStartTime } from "@/hooks/useMarketState"
import { useTranslation } from "@/hooks/useTranslation"
import { useTradeStore } from "@/stores/tradeStore"
import { memo, useMemo } from "react"
import { useBaseStore } from "@/stores/baseStore"
import { LazyImage } from "../image/LazyImage"
import { cn } from "@/lib/utils"
import { useNotSupportSession } from "@/hooks/useNotSupportSession"
import { TradeType } from "ca-common-web"
import IconWithTooltip from "../icon-tooltip"

const RwaSessionStatus = memo(
  ({
    from,
    size
  }: {
    from?: string,
    size?: string
  }) => {
    const { t, i18n } = useTranslation()
    const inputToken = useTradeStore((state) => state.inputToken)
    const marketTradeState = useBaseStore(state => state.marketTradeState)
    const tradeType = useTradeStore(state => state.tradeType)
    const { notSupportBeforeOrAfter, notSupportOvernight } = useNotSupportSession(marketTradeState, inputToken)
    
    // 闭市状态下，
    if (marketTradeState === MARKET_STATUS.CLOSE) {
      if (from === 'lite') {
        return (
          <IconWithTooltip tooltip={t("v3.t35")}>
            <div className="w-[16px] h-[16px] shrink-0 rounded-full bg-[rgba(157,163,175,0.1)] flex items-center justify-center">
              <LazyImage src="/images/v2/icons/close2.png" className="w-[10px] h-[10px]" />
            </div>
          </IconWithTooltip>
        )
      }
      return (
        <>
          <div className={cn(
            "min-h-[34px] flex items-center w-full py-3 px-3 bg-[#131416]",
          )}>
            <div className="w-full bg-[rgba(243,161,63,0.1)] border border-[rgba(243,161,63,0.2)] text-[#FFB219] px-3 py-2 text-[12px] font-normal rounded-[4px] flex  gap-x-[6px]">
              <div className="w-[18px] h-[18px] shrink-0">
                <LazyImage src="/images/v2/icons/close2.png" className="w-[18px] h-[18px]" />
              </div>
              <span className=" relative top-[2px]">{t("v3.t35")}</span>
            </div>
          </div>
        </>
        
        
      )
    }

    // 不支持盘前盘后交易
    if (notSupportBeforeOrAfter.notSupport) {
      if (from === 'lite') {
        return (
          <IconWithTooltip tooltip={t("v3.t36", { session: notSupportBeforeOrAfter.session, tradeType: tradeType === TradeType.MARKET ? t("limit").toLowerCase() : "" })}>
            <div className="w-[16px] h-[16px] shrink-0 rounded-full bg-[rgba(157,163,175,0.1)] flex items-center justify-center">
              <LazyImage src="/images/v2/icons/stop1.png" className="w-[10px] h-[10px]" />
            </div>
          </IconWithTooltip>
        )
      }
      return (
        <>
          <div className={cn(
            "min-h-[34px] flex items-center w-full py-3 px-3 bg-[#131416]",
          )}>
            <div className="w-full bg-[rgba(243,161,63,0.1)] border border-[rgba(243,161,63,0.2))] text-[#FFB219] px-3 py-2 text-[12px] font-normal rounded-[4px] flex  gap-x-[6px]">
              <div className="w-[18px] h-[18px] shrink-0 p-[3px]">
                <LazyImage src="/images/v2/icons/stop1.png" className="w-full h-full" />
              </div>
              <span className=" relative top-[2px]">{t("v3.t36", { session: notSupportBeforeOrAfter.session, tradeType: tradeType === TradeType.MARKET ? t("limit").toLowerCase() : "" })}</span>
            </div>
          </div>
        </>
        
      )
    }
    // 不支持夜盘交易
    if (notSupportOvernight.notSupport) {
      if (from === 'lite') {
        return (
          <IconWithTooltip tooltip={t("v3.t36", { session: notSupportOvernight.session, tradeType: tradeType === TradeType.MARKET ? t("limit").toLowerCase() : "" })}>
            <div className="w-[16px] h-[16px] shrink-0 rounded-full bg-[rgba(157,163,175,0.1)] flex items-center justify-center">
              <LazyImage src="/images/v2/icons/stop2.png" className="w-[10px] h-[10px]" />
            </div>
          </IconWithTooltip>
        )
      }
      return (
        <>
          <div className={cn(
            "min-h-[34px] flex items-center w-full py-3 px-3 bg-[#131416]",
          )}>
            <div className="w-full bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] text-[#A855F7] px-3 py-2 text-[12px] font-normal rounded-[4px] flex  gap-x-[6px]">
              <div className="w-[18px] h-[18px] shrink-0 p-[3px]">
                <LazyImage src="/images/v2/icons/stop2.png" className="w-full h-full" />
              </div>
              <span className=" relative top-[2px]">{t("v3.t36", { session: notSupportOvernight.session, tradeType: tradeType === TradeType.MARKET ? t("limit").toLowerCase() : "" })}</span>
            </div>
          </div>
        </>
        
      )
    }
    return null;  
    
  }
)

export { RwaSessionStatus }