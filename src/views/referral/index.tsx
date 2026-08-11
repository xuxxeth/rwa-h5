import { useActiveWeb3 } from "@/hooks/useActiveWe3"

import { NoAccountPage } from "./NoAccountPage"
import AccountPage from "./AccountPage"
import { AutoBindDialog } from "./components/AutoBindDialog"
import { useAppStore } from "@/stores/appStore"
import { useSwitchChainSync } from "@/hooks/useSwitchChainSync"
import { TittleBar } from "@/components/TittleBar"
import { useTranslation } from "@/hooks/useTranslation"
export const Referral = () => {
  
  const isWalletConnecting = useAppStore(state => state.isWalletConnecting)
  const { account } = useActiveWeb3()
  const { t } = useTranslation()

  useSwitchChainSync()

  if (isWalletConnecting) {
    return null
  }

  return (
    <div className="pb-[24px] relative min-h-main">
      <TittleBar
        className='sticky top-0 z-10'
        title={t('v4.t57')}
      />
      <div className="h-6"></div>
      { !account ? <NoAccountPage /> : <AccountPage /> }
      <AutoBindDialog />
      
    </div>
  )
}

export default Referral