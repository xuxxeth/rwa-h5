import { LazyImage } from "@/components/image/LazyImage";

function Frame23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
        <p className="[word-break:break-word] font-['Google_Sans_Flex:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium leading-none not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
          社群中心
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
        <p className="[word-break:break-word] font-['HarmonyOS_Sans_SC:Regular',sans-serif] leading-[1.3] not-italic relative shrink-0 text-[#9da3af] text-[10px] w-full">加入官方社群中心，获取一手消息</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="[word-break:break-word] capitalize content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px not-italic relative">
      <p className="font-medium leading-none min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">
        Referrals
      </p>
      <p className="font-['HarmonyOS_Sans_SC:Bold',sans-serif] leading-[0] min-w-full relative shrink-0 text-[#9da3af] text-[0px] w-[min-content]">
        <span className="font-['HarmonyOS_Sans_SC:Regular',sans-serif] leading-[1.3] text-[10px]">{`Invite friends to enjoy `}</span>
        <span className="font-['HarmonyOS_Sans_SC:Regular',sans-serif] leading-[1.3] text-[#ffca40] text-[10px]">20% rebate</span>
      </p>
    </div>
  );
}

function ReferralGroup() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative rounded-[10px] shrink-0 w-full" data-name="豆腐块">
      <div className="bg-[#1a1b1e] flex-[1_0_0] min-w-px relative rounded-[8px]">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[16px] relative size-full">
            <div className="h-[32px] mix-blend-lighten relative shrink-0 w-[34px]" data-name="image 93">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <LazyImage alt="" className="absolute h-[101.1%] left-[-8.82%] max-w-none top-[-0.55%] w-[120.59%]" src="/images/v0.4/referral.png" />
              </div>
            </div>
            <Frame4 />
          </div>
        </div>
      </div>
      <div className="bg-[#1a1b1e] flex-[1_0_0] min-w-px relative rounded-[8px] self-stretch">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[16px] relative size-full">
            <div className="h-[36px] mix-blend-lighten relative shrink-0 w-[34px]" data-name="image 92">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <LazyImage alt="" className="absolute h-[120%] left-[-14.18%] max-w-none top-[-10%] w-[128.37%]" src="/images/v0.4/group.png" />
              </div>
            </div>
            <Frame23 />
          </div>
        </div>
      </div>
    </div>
  );
}


function Reward() {
  return (
    <div className="bg-[#1a1b1e] h-[80px] relative rounded-[8px] shrink-0 w-full" data-name="BANNER">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[16px] relative size-full">
          <div className="h-[36px] mix-blend-lighten relative shrink-0 w-[33px]" data-name="image 91">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <LazyImage alt="" className="absolute h-[115.55%] left-[-7.69%] max-w-none top-[-7.77%] w-[115.38%]" src="/images/v0.4/reward.png" />
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] h-[54px] items-start min-w-px overflow-clip relative">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center leading-none min-h-px not-italic relative text-center w-full whitespace-nowrap">
              <p className="font-['Google_Sans_Flex:Medium','Noto_Sans_JP:Medium','Noto_Sans_SC:Medium',sans-serif] font-medium relative shrink-0 text-[14px] text-white" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
                ETH理财宝7天定期达50%APR
              </p>
              <p className="font-['Google_Sans_Flex:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal relative shrink-0 text-[#848e9c] text-[12px]" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
                ETH理财宝7天定期达50%APR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReferraGroupReward() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[16px] relative size-full">
        <div className={"content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full"}>
          <ReferralGroup />
          <Reward />
        </div>
      </div>
    </div>
  );
}