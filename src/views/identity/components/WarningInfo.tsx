import { LazyImage } from "@/components/image/LazyImage"
import { useTranslation } from "@/hooks/useTranslation"
import { memo } from "react"

const WarningInfo = memo(
  ({
    text
  }: {
    text?: string
  }) => {
    const { t } = useTranslation()
    
    return (
      <div className="bg-[#361604] min-h-[48px] rounded-[4px] flex text-white font-normal text-[14px] px-6 py-3">
        <LazyImage src="/images/kyc/warning.png" className="w-5 h-5 mr-[2px]" />
        {text || t('kyc.t1')}
      </div>
    )
  }
)

export { WarningInfo }