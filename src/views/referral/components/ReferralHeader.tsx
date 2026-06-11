import { Trans } from "@/components/trans";
import { REFERRAL_INFO } from "@/config/constants";
import { useTranslation } from "@/hooks/useTranslation";

// 标题区域组件
export default function ReferralHeader() {
  const { t } = useTranslation()
  return (
    <div className="flex items-end justify-center w-full">
      {/* 左侧标题 */}
      <div className="flex flex-col gap-[12px]">
        <div className="text-white">
          <p className=" font-medium text-[40px] leading-[120%] text-center">
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
    </div>
  );
}