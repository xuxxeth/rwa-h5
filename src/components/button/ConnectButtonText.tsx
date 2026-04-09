import { memo } from 'react'
import { Button } from '../ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import storage from '@/utils/storage'
import { LATEST_WALLET_UUID } from '@/config/constants'
import { useBaseStore } from '@/stores/baseStore'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { ConnectorType } from '@/hooks/useCaCommon'

const ConnectButtonText = memo(({ className }: { className?: string }) => {
  const { wallets, handleConnect } = useActiveWeb3()
  const { toastError } = useToast()
  const { t } = useTranslation()

  const connectWallet = async () => {
    try {
      const injectedWallet = wallets.find(w => w.detected)
      if (!injectedWallet) {
        toastError({ title: t('noInjectedWallet') })
        return
      }
      await handleConnect(ConnectorType.Injected, injectedWallet)
    } catch (error) {
      toastError({ title: 'Connect Wallet Failed' })
    }
  }

  const setShowConnect = useBaseStore(state => state.setShowConnect)

  return (
    <Button
      className={cn('bg-brand text-black w-full h-[40px] text-[14px]', className)}
      onClick={async () => {
        setShowConnect(true)
        await connectWallet()
        // const latestWalletUUID = storage.getItem(LATEST_WALLET_UUID)
        // let wallet = wallets[0]
        // if (latestWalletUUID) {
        //   const _wallet = wallets.find(wallet => wallet.info.name === latestWalletUUID)
        //   if (_wallet) {
        //     wallet = _wallet
        //   }
        // }
        // // @ts-ignore
        // await handleConnect(ConnectorType.Injected, wallet)
      }}
    >
      {t('Connect Wallet')}
    </Button>
  )
})

export { ConnectButtonText }
