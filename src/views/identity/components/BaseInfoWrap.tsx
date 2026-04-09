import { memo, useCallback, useState } from "react";
import { BaseInfo, type BaseInfoFormData, type IBaseInfo } from "./BaseInfo";
import { NavigatorH5 } from "@/components/navigator";
import { useTranslation } from "@/hooks/useTranslation";
import { ImageInfo } from "./ImageInfo";

const BaseInfoWrap = memo(
  ({
    rejectReason,
    userInfo,
    refresh,
    onResetRetry,
  }: IBaseInfo) => {
    const { t } = useTranslation()
    const [step, setStep] = useState(1)
    const [baseInfoSnapshot, setBaseInfoSnapshot] = useState<Partial<BaseInfoFormData>>({})

    const handleNext = useCallback((data: BaseInfoFormData) => {
      setBaseInfoSnapshot(data)
      setStep(2)
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }, [])

    const handleBack = useCallback(() => {
      setStep(1)
    }, [t])

    return (
      <>
        <NavigatorH5 showBack={step === 2} title={step === 1 ? t('kyc.t2') : t('kyc.t69')} onBack={handleBack} />
        <div style={{
          display: step === 1 ? 'block' : 'none'
        }}>
          <BaseInfo 
            onResetRetry={onResetRetry}
            refresh={refresh}
            userInfo={userInfo}
            rejectReason={rejectReason}
            next={handleNext}
          />
        </div>
        
        <div style={{
          display: step === 2 ? 'block' : 'none'
        }}>
          <ImageInfo 
            onResetRetry={onResetRetry}
            refresh={refresh}
            userInfo={userInfo}
            rejectReason={rejectReason}
            baseInfoSnapshot={baseInfoSnapshot}
          />
        </div>
        
      </>
    )
  }
)

export { BaseInfoWrap }
