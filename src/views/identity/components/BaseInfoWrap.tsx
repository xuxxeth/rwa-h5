import { memo, useCallback, useState } from "react";
import { BaseInfo, type IBaseInfo } from "./BaseInfo";
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
    const [title, setTitle] = useState(t('kyc.t2'))
    const [step, setStep] = useState(1)

    const handleNext = useCallback(() => {
      setTitle('图片信息')
      setStep(2)
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }, [])

    const handleBack = useCallback(() => {
      setTitle(t('kyc.t2'))
      setStep(1)
    }, [t])

    return (
      <>
        <NavigatorH5 showBack={step === 2} title={title} onBack={handleBack} />
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
          />
        </div>
        
      </>
    )
  }
)

export { BaseInfoWrap }