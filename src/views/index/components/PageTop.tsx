import { ConnectButton } from "@/components/button/ConnectButton";
import SignButton from "@/components/button/SignButton";
import { LazyImage } from "@/components/image/LazyImage";
import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import { useSignatureValidStatus } from "@/hooks/useSignature";

function Banner() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center overflow-clip relative shrink-0 w-full">
      <div className="h-[216px] mix-blend-lighten relative shrink-0 w-[375px]" data-name="image 139">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <LazyImage alt="" className="absolute h-[130.21%] left-0 max-w-none top-[-13.95%] w-full" src="/images/v0.4/banner.png" />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(19,20,22,0)] h-[75px] left-[-2px] to-[#131416] to-[60.804%] w-[379px]" />
    </div>
  );
}

function ConnectSign() {
  const { account } = useActiveWeb3()
  const [isSignatureValid, refreshIsSignatureValid] = useSignatureValidStatus()

  return (
    <div className="relative shrink-0 w-full px-4">
      {
        !account && (
          <ConnectButton connectBtnClassName=" h-[44px] font-bold bg-[#ffffff]" />
        )
      }
      {
        account && !isSignatureValid && (
          <SignButton
            refreshIsSignatureValid={refreshIsSignatureValid}
            className='h-[44px] w-full font-semibold text-[16px] '
          />
        )
      }
      
    </div>
  );
}

export function PageTop() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Banner />
      <ConnectSign />
    </div>
  );
}