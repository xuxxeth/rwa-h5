import { LazyImage } from "@/components/image/LazyImage";

function Security1({ className }: { className?: string }) {
  return (
    <div className={className || "content-stretch flex gap-[12px] items-center relative shrink-0 w-full"}>
      <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[1.5] min-w-px not-italic relative">
        <p className="font-['HarmonyOS_Sans_SC:Medium',sans-serif] relative shrink-0 text-[14px] text-white w-full">SlowMist 顶级安全审计</p>
        <p className="font-['HarmonyOS_Sans_SC:Regular',sans-serif] relative shrink-0 text-[#9da3af] text-[12px] w-full">智能合约由全球领先区块链安全机构慢雾 (SlowMist) 全链路严格审计，保障资金全链路安全。</p>
        <p className="font-['HarmonyOS_Sans_SC:Medium',sans-serif] relative shrink-0 text-[#9cff3a] text-[12px] w-full">{`查看审计报告 >`}</p>
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
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[1.5] min-w-px not-italic relative">
      <p className="font-['HarmonyOS_Sans_SC:Medium',sans-serif] relative shrink-0 text-[14px] text-white w-full">1:1 持牌托管</p>
      <p className="font-['HarmonyOS_Sans_SC:Regular',sans-serif] relative shrink-0 text-[#9da3af] text-[12px] w-full">底仓资产由新加坡 MAS 持牌机构 uSMART 独立清算与托管。平台实现资金物理隔离，确保交易 1:1 对应实盘股票，杜绝衍生合成资产风险。</p>
      <p className="font-['HarmonyOS_Sans_SC:Medium',sans-serif] relative shrink-0 text-[#9cff3a] text-[12px] w-full">{`了解更多 >`}</p>
    </div>
  );
}

function Security3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[1.5] min-w-px not-italic relative">
      <p className="font-['HarmonyOS_Sans_SC:Medium',sans-serif] relative shrink-0 text-[14px] text-white w-full">双重牌照合规</p>
      <p className="font-['HarmonyOS_Sans_SC:Regular',sans-serif] relative shrink-0 text-[#9da3af] text-[12px] w-full">Tiko 实体持有毛里求斯 FSC 颁发的 Investment Dealer (投资交易商) 与 VASP (虚拟资产服务提供商) 双重金融牌照，在监管框架下合规运营。</p>
      <p className="font-['HarmonyOS_Sans_SC:Medium',sans-serif] relative shrink-0 text-[#9cff3a] text-[12px] w-full">{`了解更多 >`}</p>
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
  return (
    <div className="relative shrink-0 w-full" data-name="市场">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center px-[16px] relative size-full">
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="标题">
            <p className="[word-break:break-word] leading-none not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">保障与服务</p>
          </div>
          <SecurityList />
        </div>
      </div>
    </div>
  );
}