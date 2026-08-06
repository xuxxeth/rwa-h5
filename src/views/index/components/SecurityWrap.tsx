import { LazyImage } from "@/components/image/LazyImage";
import { useTranslation } from "@/hooks/useTranslation";

function Security1({ className }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <div className={className || "content-stretch flex gap-[12px] items-center relative shrink-0 w-full"}>
      <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[1.5] min-w-px not-italic relative">
        <p className="relative shrink-0 text-[14px] text-white w-full">{t('v4.t75')}</p>
        <p className="font-['HarmonyOS_Sans_SC:Regular',sans-serif] relative shrink-0 text-[#9da3af] text-[12px] w-full">{t('v4.t76')}</p>
        <a className="relative shrink-0 text-[#9cff3a] text-[12px] w-full"
          href="https://ca-public-s3.s3.ap-southeast-1.amazonaws.com/web/Cyberalpha+Protocol+Phase3+-+SlowMist+Audit+Report+(2).pdf"
          target="_blank"
          rel="noopener noreferrer"
        >{t('v4.t77')}</a>
      </div>
      <div className="h-[60px] mix-blend-lighten relative shrink-0 w-[64px]" data-name="image 134">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <LazyImage alt="" className="absolute h-[112.7%] left-[-4.05%] max-w-none top-[-9.51%] w-[108.11%]" src="/images/v0.4/security.png" />
        </div>
      </div>
    </div>
  );
}

function Security2() {
  const { t } = useTranslation()
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[1.5] min-w-px not-italic relative">
      <p className="relative shrink-0 text-[14px] text-white w-full">{t('v4.t78')}</p>
      <p className="font-['HarmonyOS_Sans_SC:Regular',sans-serif] relative shrink-0 text-[#9da3af] text-[12px] w-full">{t('v4.t79')}</p>
      <a className="relative shrink-0 text-[#9cff3a] text-[12px] w-full"
        href="https://tiko.gitbook.io/tiko-docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('v4.t80')}
      </a>
    </div>
  );
}

function Security3() {
  const { t } = useTranslation()
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[1.5] min-w-px not-italic relative">
      <p className="relative shrink-0 text-[14px] text-white w-full">{t('v4.t81')}</p>
      <p className="relative shrink-0 text-[#9da3af] text-[12px] w-full">{t('v4.t82')}</p>
      <a className="relative shrink-0 text-[#9cff3a] text-[12px] w-full"
        href="https://tiko.gitbook.io/tiko-docs"
        target="_blank"
        rel="noopener noreferrer"
      >{t('v4.t80')}</a>
    </div>
  );
}

function SecurityList() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Security1 />
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
        <Security2 />
        <div className="h-[65px] relative shrink-0 w-[56px]" data-name="image 138">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <LazyImage alt="" className="absolute h-[119.15%] left-[-20%] max-w-none top-[-9.21%] w-[140%]" src="/images/v0.4/security2.png" />
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
        <Security3 />
        <div className="h-[63px] relative shrink-0 w-[52px]" data-name="image 137">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <LazyImage alt="" className="absolute h-[132.61%] left-[-30.26%] max-w-none top-[-16.3%] w-[160.53%]" src="/images/v0.4/security3.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SecurityWrap() {
  const { t } = useTranslation()
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center px-[16px] relative size-full">
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="">
            <p className="[word-break:break-word] leading-none not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">{t('v4.t53')}</p>
          </div>
          <SecurityList />
        </div>
      </div>
    </div>
  );
}
