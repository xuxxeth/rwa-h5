import { LazyImage } from "@/components/image/LazyImage";
import { PageTop } from "./components/PageTop";
import { ReferraGroupReward } from "./components/ReferraGroupReward";
import { SecurityWrap } from "./components/SecurityWrap";







function IndexPage() {
  return (
    <div className="bg-[#131416] relative size-full flex justify-center pb-[100px]" >
      <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative rounded-bl-[8px] rounded-br-[8px] max-w-[680px]">
        <PageTop />
        <ReferraGroupReward />
        <SecurityWrap />
      </div>
      
    </div>
  )
}

export default IndexPage