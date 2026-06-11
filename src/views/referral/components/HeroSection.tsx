import { ConnectButton } from "@/components/button/ConnectButton";
import { Trans } from "@/components/trans";
import { REFERRAL_INFO } from "@/config/constants";
import { useTranslation } from "@/hooks/useTranslation";

export default function HeroSection() {
  const { t } = useTranslation()
  return (
    <section className="w-full font-normal">
      <div className=" mx-auto px-[20px]">
        <div className="flex flex-col items-center justify-center">
          {/* 左侧文案 */}
          <div className="flex flex-col gap-[32px]">
            {/* 标题和说明 */}
            <div className="flex flex-col gap-[4px]">
              <div className="text-white">
                <p className=" font-medium text-[40px] leading-[120%] px-4 text-center">
                  <Trans 
                    i18nKey="ref.t2" 
                    values={{ r1: '50%' }} 
                    components={{
                      r1: <span className="font-semibold text-[#9cff3a]" />
                    }}
                  />
                  
                </p>
              </div>
              <div className="flex items-center justify-center text-[14px] leading-[120%]">
                <a href={REFERRAL_INFO} target="_blank" rel="noopener noreferrer ">
                  <p className="font-normal text-white text-center">
                    {t("ref.t3")}
                    <span className="font-medium text-[#9cff3a] cursor-pointer hover:underline pl-2 whitespace-nowrap inline-block">
                      {t("ref.t31")}
                    </span>
                  </p>
                </a>
              </div>
            </div>

            {/* CTA按钮 */}
            <div className="flex justify-center">
              <ConnectButton connectBtnClassName="w-[200px] justify-center h-[44px] text-[16px] font-semibold" />
            </div>
            
          </div>

          {/* 右侧3D视觉效果 */}
          <div className="relative w-full mt-6">
            <img
              src={'/images/referral/referral.png'}
              alt="Tiko 3D"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
