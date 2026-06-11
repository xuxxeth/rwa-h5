import { useTranslation } from "@/hooks/useTranslation";

// 步骤图标
interface StepIconProps {
  stepNumber: string;
  icon: string;
}

function StepIcon({ stepNumber, icon }: StepIconProps) {
  return (
    <div className="relative grid grid-cols-[max-content] grid-rows-[max-content] place-items-start">
      {/* 背景卡片 */}
      <div className="size-[64px] flex items-center justify-center relative">
        <img
          src={icon}
          alt={`Step ${stepNumber}`}
          className="w-full h-full object-cover"
        />
        {/* 步骤编号徽章 */}
        <div className="bg-[#9cff3a] rounded-full size-[20px] flex items-center justify-center absolute -top-[0px] -right-[16px]">
          <p className="font-medium text-[12px] text-[#131416]">{stepNumber}</p>
        </div>
      </div>

      
    </div>
  );
}

// 连接线
function ConnectorLine() {
  return (
    <div className="w-[1px] h-[230px] absolute left-8 top-0 ">
      <svg width="1" height="230" viewBox="0 0 1 230" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0.5" y1="230" x2="0.5" stroke="url(#paint0_linear_11083_4996)" strokeDasharray="2 2"/>
      <defs>
      <linearGradient id="paint0_linear_11083_4996" x1="1.5" y1="230" x2="1.5" y2="0" gradientUnits="userSpaceOnUse">
      <stop stopColor="#1D3604"/>
      <stop offset="0.514423" stopColor="#9CFF3A"/>
      <stop offset="1" stopColor="#1D3604"/>
      </linearGradient>
      </defs>
      </svg>
    </div>
  );
}

// 单个步骤
interface StepProps {
  stepNumber: string;
  title: string;
  description: string;
  icon: string;
}

function Step({ stepNumber, title, description, icon }: StepProps) {
  return (
    <div className="flex gap-[32px] items-center">
      <StepIcon stepNumber={stepNumber} icon={icon} />
      <div className="flex flex-col gap-[8px] ">
        <h3 className="font-medium text-[16px] text-white">{title}</h3>
        <p className="font-normal text-[12px] text-[#9da3af] w-[260px] leading-[18px]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HowToInviteSection() {
  const { t } = useTranslation()
  return (
    <section className="w-full mt-14">
      <div className="mx-auto px-[16px]">
        <div className="rounded-[32px] gradient-border">
          <div className=" ">
            <div className="flex flex-col gap-[32px] items-center">
              {/* 标题 */}
              <h2 className=" font-medium text-[20px] text-white">{t("ref.t8")}</h2>

              {/* 步骤流程 */}
              <div className="flex flex-col items-start gap-y-6 justify-between w-full relative">
                <ConnectorLine />
                <Step
                  stepNumber="01"
                  title={t("ref.t9")}
                  description={t("ref.t91")}
                  icon="/images/referral/step1.png"
                />
                <Step
                  stepNumber="02"
                  title={t("ref.t10")}
                  description={t("ref.t101")}
                  icon="/images/referral/step2.png"
                />
                <Step
                  stepNumber="03"
                  title={t("ref.t11")}
                  description={t("ref.t111")}
                  icon="/images/referral/step3.png"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
