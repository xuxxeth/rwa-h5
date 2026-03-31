import { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import storage from '@/utils/storage'
import { CONNECT_ACCOUNT, CONNECTOR_TYPE, WALLET_UUID } from '@/config/constants'
import { useTranslation } from '@/hooks/useTranslation'
import { useRouter } from '@/hooks/useRouter'
import { useToast } from '@/hooks/useToast'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { ConnectorType, useQrCodeData, type WalletConfig } from '@/hooks/useCaCommon'
import { useBaseStore } from '@/stores/baseStore'
import { useAppStore } from '@/stores/appStore'
import { DialogController } from '@/components/dialog/DialogController'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Divide } from '../divide'
import { LazyImage } from '../image/LazyImage'
import CopyButton from './copyButton'
import { shortenAddress } from '@/utils'
import { useVerifyTip } from '../market-trading/VerifyIdentity'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { CircleLoading } from '@/components/loading'
import QRCode from '@/components/qrcode'
import { useKycStatus } from '@/hooks/useKycStatus'
import { KYC_OVERALL_STATUS } from '@/service/kyc/types'
import { usePendingStep } from '@/hooks/usePendingStep'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { WalletDrawer } from '@/components/drawer/WalletDrawer.tsx'

const WalletStatus = {
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  WRONG_NETWORK: 'WRONG_NETWORK',
} as const

type WalletStatus = (typeof WalletStatus)[keyof typeof WalletStatus]

export function ConnectButton(props: { connectBtnClassName?: string }) {
  const { t } = useTranslation()
  const router = useRouter()
  const { toastSuccess, toastError, toastWarning, toastInfo } = useToast()
  const {
    wallets,
    account,
    chainId,
    handleConnect: rwaHandleConnect,
    handleDisConnect,
    handleSwitchChain,
    initialized,
    isSameChain,
  } = useActiveWeb3()

  const chains = useBaseStore(s => s.chainList)
  const setShowConnect = useBaseStore(s => s.setShowConnect)
  const setCurrentWallet = useBaseStore(s => s.setCurrentWallet)

  const setIsWalletConnecting = useAppStore(s => s.setIsWalletConnecting)

  const [status, setStatus] = useState<WalletStatus>(WalletStatus.IDLE)
  const prevStatusRef = useRef<WalletStatus>(WalletStatus.IDLE)

  const [connectorType, setConnectorType] = useState<ConnectorType | undefined>(undefined)
  const [hoverOpen, setHoverOpen] = useState(false)

  const isManualConnect = useRef(false)
  const isMobile = useMemo(() => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent), [])

  const networkText = useMemo(() => chains.map(c => c.displayName).join(' / '), [chains])

  const { verifyTip } = useVerifyTip()
  const [isSignatureValid] = useSignatureValidStatus()

  const { kycStatus } = useKycStatus()
  const pendingStep = usePendingStep()

  const [walletSheetOpen, setWalletSheetOpen] = useState(false)

  const handleConnect = useCallback(
    async (connectorType: ConnectorType, wallet: WalletConfig) => {
      try {
        await rwaHandleConnect(connectorType, wallet)
      } catch (error) {
      } finally {
        setIsWalletConnecting(false)
      }
    },
    [rwaHandleConnect]
  )

  useEffect(() => {
    if (!account || !chainId) {
      setStatus(WalletStatus.IDLE)
      return
    }

    const supported = chains.some(c => c.id === chainId)

    setStatus(supported ? WalletStatus.CONNECTED : WalletStatus.WRONG_NETWORK)
  }, [account, chainId, chains])

  const hasInitializedRef = useRef(false)
  useEffect(() => {
    if (initialized && account && chainId) {
      hasInitializedRef.current = true
    }
  }, [initialized, account, chainId])

  useEffect(() => {
    const prevStatus = prevStatusRef.current

    switch (status) {
      case WalletStatus.CONNECTED:
        setIsWalletConnecting(false)
        setShowConnect(false)
        storage.setItem(CONNECT_ACCOUNT, account!)

        if (isManualConnect.current) {
          toastSuccess({ title: t('connectSuccess') })
          isManualConnect.current = false
        }
        break

      case WalletStatus.WRONG_NETWORK:
        console.log('===>Enter WRONG_NETWORK')
        if (chains[0]) {
          handleSwitchChain(chains[0].id).then(res => {
            if (res) {
              // window.location.reload()
            } else {
              toastError({
                title: t('switchNetwork', { network: networkText }),
              })
            }
          })
        } else {
          toastError({
            title: t('switchNetwork', { network: networkText }),
          })
        }

        // handleDisConnect()
        break

      // case WalletStatus.IDLE:
      //   if (!isRestoringRef.current && hasInitializedRef.current && prevStatus === WalletStatus.CONNECTED) {
      //     toastError({
      //       title: t('walletDisconnect'),
      //     })
      //   }
      //   break
    }

    prevStatusRef.current = status
  }, [status])

  useEffect(() => {
    if (!wallets.length || account || !initialized) return

    const walletUUID = storage.getItem(WALLET_UUID)
    const connector = storage.getItem(CONNECTOR_TYPE) as ConnectorType | null

    // 默认 isWalletConnecting 为 true, 如果发现不需要重连，把 isWalletConnecting 设为 false
    if (!walletUUID || !connector) {
      setIsWalletConnecting(false)
      return
    }

    const wallet = wallets.find(w => w.info.name === walletUUID)
    if (!wallet) return

    if (connector === ConnectorType.Injected && !wallet.detected) {
      return
    }
    setCurrentWallet(wallet)
    setStatus(WalletStatus.CONNECTING)
    setIsWalletConnecting(true)

    handleConnect(connector, wallet)
  }, [wallets, initialized])

  const connectWallet = async (wallet: WalletConfig) => {
    isManualConnect.current = true
    setCurrentWallet(wallet)
    setIsWalletConnecting(true)
    setStatus(WalletStatus.CONNECTING)

    if (wallet.detected || isMobile) {
      if (!wallet.provider) {
        setIsWalletConnecting(false)
        return
      }

      setConnectorType(ConnectorType.Injected)

      await handleConnect(ConnectorType.Injected, wallet)
      return
    }

    setConnectorType(ConnectorType.WalletConnect)

    await handleConnect(ConnectorType.WalletConnect, wallet)
  }

  const goTo = (path: string) => {
    setHoverOpen(false)
    router.push(path)
  }

  // const isShowingQrCode = connectorType === ConnectorType.WalletConnect

  // const dialogTitle =
  //   isShowingQrCode && currentWallet ? (
  //     <div className='flex items-center justify-center relative'>
  //       <LazyImage
  //         onClick={() => setConnectorType(undefined)}
  //         className='w-6 h-6 absolute left-0 top-0 cursor-pointer'
  //         src='/images/icons/back.png'
  //       />
  //       <span className='text-base font-semibold'>{currentWallet.info.name}</span>
  //     </div>
  //   ) : (
  //     <span className='text-base font-semibold'>{t('Connect Wallet')}</span>
  //   )

  return (
    <>
      {!account || !isSameChain ? (
        <div
          className={cn(
            'bg-brand px-3 rounded-[8px] text-sm/4.5 font-medium h-9 flex items-center justify-center',
            props.connectBtnClassName
          )}
          onClick={() => {
            const injectedWallet = wallets.find(w => w.detected)
            if (!injectedWallet) {
              toastError({ title: 'NO Injected Wallet' })
              return
            }
            connectWallet(injectedWallet)
          }}
        >
          {t('Connect Wallet')}
        </div>
      ) : (
        <button
          type='button'
          className='flex flex-row items-center gap-1 text-white text-sm/4.5 font-medium'
          onClick={() => setWalletSheetOpen(true)}
        >
          <LazyImage src='/images/h5/bsc.svg' />
          <span>{shortenAddress(account)}</span>
          <span>chainID-{chainId}</span>
          <LazyImage src='/images/h5/arrow-down.svg' />
        </button>
      )}
      <WalletDrawer open={walletSheetOpen} onOpenChange={open => setWalletSheetOpen(open)} />

      {/*<Dialog open={walletSheetOpen} onOpenChange={setWalletSheetOpen}>
        <DialogContent
          overlayClassName='bg-[#131416B2]'
          className='left-0 bg-gray-900 gap-0 px-0 border border-gray-700  bottom-0 top-auto translate-x-0 translate-y-0 w-full min-w-0 rounded-t-[24px] rounded-b-none pb-[calc(env(safe-area-inset-bottom)+16px)] pt-0'
          closeClassName='right-5 top-5'
        >
          <DialogTitle className='px-5 py-4 border-b border-b-gray-700 text-base/5 font-normal'>
            {t('wallet')}
          </DialogTitle>
          <div className='flex flex-row items-center text-base/5 font-medium justify-between px-5 py-5'>
            <div>{t('addr')}</div>
            <div className='flex flex-row items-center gap-1'>
              {shortenAddress(account!)}
              <CopyButton copyText={account!} />
            </div>
          </div>
          <div
            onClick={async () => {
              await handleDisConnect()
              setWalletSheetOpen(false)
            }}
            className='flex flex-row items-center justify-center py-4 gap-2'
          >
            <LazyImage src='/images/h5/disconnect.svg' />
            <span className='text-base/4.5 font-medium'>{t('Disconnect')}</span>
          </div>
        </DialogContent>
      </Dialog>*/}
    </>
  )
}
