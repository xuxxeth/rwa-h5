import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

// 单个功能卡片
interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imagePosition: 'right' | 'left';
  glowColor: string;
}

function FeatureCard({ title, description, imageSrc, imagePosition, glowColor }: FeatureCardProps) {
  return (
    <div className={cn(
      "relative rounded-[16px] w-full border border-[#383A40] overflow-hidden",
    )}>
      <div className="flex items-center gap-2 pl-4">
        {/* 文字内容 */}
        <div className="flex-1 flex flex-col gap-[4px] py-6">
          <h3 className=" font-medium text-[16px] text-white leading-[120%]">{title}</h3>
          <p className="font-normal text-[12px] text-[#9da3af] leading-[18px]">
            {description}
          </p>
        </div>

        {/* 图片 */}
        {imagePosition === 'right' && (
          <div className="relative h-[126px] w-[126px] flex-shrink-0">
            <img
              src={imageSrc}
              alt={title}
              className=" w-full"
            />
          </div>
        )}
      </div>

      {/* 底部发光效果 */}
      <div
        className="absolute bottom-[-5px] left-[2px] h-[6px] w-full blur-[20px]"
        style={{ backgroundColor: glowColor }}
      />
    </div>
  );
}
function FeatureCard2({ title, description, imageSrc, imagePosition, glowColor }: FeatureCardProps) {
  return (
    <div className={cn(
      "relative rounded-[16px] w-full border border-[#383A40] overflow-hidden",
    )}>
      <div className="flex items-center gap-2 pl-4">
        {/* 文字内容 */}
        <div className="flex-1 flex flex-col gap-[4px] py-6">
          <h3 className=" font-medium text-[16px] text-white leading-[120%]">{title}</h3>
          <p className="font-normal text-[12px] text-[#9da3af] leading-[18px]">
            {description}
          </p>
        </div>

        {/* 图片 */}
        {imagePosition === 'right' && (
          <div className="relative h-[126px] w-[126px] flex-shrink-0">
            <img
              src={imageSrc}
              alt={title}
              className=" w-full"
            />
          </div>
        )}
      </div>

      {/* 底部发光效果 */}
      <div
        className="absolute bottom-[-5px] left-[2px] h-[6px] w-full blur-[20px]"
        style={{ backgroundColor: glowColor }}
      />
    </div>
  );
}

// 大卡片（链上结算）
function TransparencyCard() {
  const { t } = useTranslation()
  return (
    <div className="flex-1 relative rounded-[16px] border border-[#383a40] h-full overflow-hidden ">
      <div className="flex flex-col h-full">
        {/* 文字内容 */}
        <div className="flex flex-col gap-[4px] p-4 pb-0 py-6">
          <h3 className=" font-medium text-[16px] text-white leading-[120%]">{t("ref.t7")}</h3>
          <p className="font-normal text-[12px] text-[#9da3af] leading-[18px]">
            {t("ref.t71")}
          </p>
        </div>

        {/* 图片 */}
        <div className="flex-1 relative">
          <img
            src={'/images/referral/feature3.webp'}
            alt="链上结算"
            className="w-full"
          />
        </div>

        {/* 底部渐变发光 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[106px] bg-gradient-to-b from-[rgba(156,255,58,0)] to-[#9cff3a] opacity-20 blur-[40px]" />
      </div>
    </div>
  );
}

export default function WhyJoinSection() {
  const { t } = useTranslation()
  return (
    <section className="w-full pb-6">
      <div className="max-w-[1440px] mx-auto px-[16px]">
        <div className="flex flex-col gap-[32px]">
          {/* 标题 */}
          <h2 className="text-center font-medium text-[20px] text-white">
            {t("ref.t4")}
          </h2>

          {/* 功能卡片网格 */}
          <div className="flex gap-[24px] items-stretch">
            {/* 左侧两个小卡片 */}
            <div className="flex flex-col gap-[12px]">
              <FeatureCard
                title={t("ref.t5")}
                description={t("ref.t51")}
                imageSrc={'/images/referral/feature12.png'}
                imagePosition="right"
                glowColor="#2ee4a7"
              />
              <FeatureCard2
                title={t("ref.t6")}
                description={t("ref.t61")}
                imageSrc={'/images/referral/feature23.png'}
                imagePosition="right"
                glowColor="#F0B90B"
              />
              <TransparencyCard />
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
