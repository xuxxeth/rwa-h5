import { useAppStore } from "@/stores/appStore";
import { PageTop } from "./components/PageTop";
import { ReferraGroupReward } from "./components/ReferraGroupReward";
import { SecurityWrap } from "./components/SecurityWrap";
import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import { useSignatureValidStatus } from "@/hooks/useSignature";
import { lazy, useState } from "react";
import { AssetSection } from "./components/AssetSection";
import { WatchListAndHolsings } from "./components/WatchListAndHoldings";
const KycState = lazy(() => import("@/components/kyc-state"));

function NoAccountOrSign() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative rounded-bl-[8px] rounded-br-[8px] max-w-[680px]">
      <PageTop />
      <ReferraGroupReward />
      <SecurityWrap />
    </div>
  )
}


function AccountAndSign() {
  const [isHidden, setIsHidden] = useState(true);
  
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative rounded-bl-[8px] rounded-br-[8px] max-w-[680px] w-full">
      <AssetSection isHidden={isHidden} onToggleHidden={() => setIsHidden((h) => !h)} />
      <div className=" w-full px-4">
        <KycState />
      </div>
      <ReferraGroupReward />
      <WatchListAndHolsings />
    </div>
  )
}


function IndexPage() {
  const isWalletConnecting = useAppStore(state => state.isWalletConnecting)
  const [isSignatureValid] = useSignatureValidStatus()
  const { account } = useActiveWeb3()

  if (isWalletConnecting) return null

  return (
    <div className="bg-[#131416] relative size-full flex justify-center pb-[100px]" >
      {
        !account || !isSignatureValid && <NoAccountOrSign />
      }
      {
        isSignatureValid && <AccountAndSign />
      }
      
    </div>
  )
}

export default IndexPage