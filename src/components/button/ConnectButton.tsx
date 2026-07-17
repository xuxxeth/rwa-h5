import { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import storage from '@/utils/storage'
import { CONNECT_ACCOUNT } from '@/config/constants'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { ConnectorType, type WalletConfig } from '@/hooks/useCaCommon'
import { useBaseStore } from '@/stores/baseStore'
import { useAppStore } from '@/stores/appStore'

import { LazyImage } from '../image/LazyImage'
import { shortenAddress } from '@/utils'
import { WalletDrawer } from '@/components/drawer/WalletDrawer.tsx'
import { SwitchChainDrawer } from '../drawer/SwitchChainDrawer'

const WalletStatus = {
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  WRONG_NETWORK: 'WRONG_NETWORK',
} as const

type WalletStatus = (typeof WalletStatus)[keyof typeof WalletStatus]

export function ConnectButton(props: { connectBtnClassName?: string }) {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const {
    wallets,
    account,
    chainId,
    handleConnect: rwaHandleConnect,
    isChainSupported,
    initialized,
  } = useActiveWeb3()

  const chains = useBaseStore(s => s.chainList)
  const setShowConnect = useBaseStore(s => s.setShowConnect)
  const setCurrentWallet = useBaseStore(s => s.setCurrentWallet)
  const currentChainId = useAppStore(s => s.currentChainId)
  const setIsWalletConnecting = useAppStore(s => s.setIsWalletConnecting)

  const [status, setStatus] = useState<WalletStatus>(WalletStatus.IDLE)
  const prevStatusRef = useRef<WalletStatus>(WalletStatus.IDLE)

  const [connectorType, setConnectorType] = useState<ConnectorType | undefined>(undefined)

  const isManualConnect = useRef(false)
  const isMobile = useMemo(() => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent), [])

  const networkText = useMemo(() => chains.filter(c => c.state === 1).map(c => c.displayName).join(' / '), [chains])

  const [walletSheetOpen, setWalletSheetOpen] = useState(false)
  const [switchSheetOpen, setSwitchSheetOpen] = useState(false)

  const currentChain = useMemo(() => {
    return chains.find(chain => chain.id === currentChainId)
  }, [chains, currentChainId])

  const handleConnect = useCallback(
    async (connectorType: ConnectorType, chainId: number, wallet: WalletConfig, retry?: boolean) => {
      try {
        await rwaHandleConnect(connectorType, chainId, wallet)
      } catch {
        if (retry) {
          for (const chain of chains) {
            if (chain.id === chainId) continue

            try {
              await rwaHandleConnect(connectorType, chain.id, wallet)
              return
            } catch {
              continue
            }
          }
        }

        toastError({
          title: t('switchNetwork', { network: networkText }),
        })
        throw new Error('wallet reconnect failed')
      } finally {
        setIsWalletConnecting(false)
      }
    },
    [rwaHandleConnect, networkText, chains, setIsWalletConnecting, toastError, t]
  )
  useEffect(() => {
    if (!account || !chainId) {
      setStatus(WalletStatus.IDLE)
      return
    }
    // const supported = chains.some(c => c.id === chainId)
    setStatus(isChainSupported ? WalletStatus.CONNECTED : WalletStatus.WRONG_NETWORK)
  }, [account, chainId, isChainSupported])

  useEffect(() => {
    const prevStatus = prevStatusRef.current

    switch (status) {
      case WalletStatus.CONNECTED:
        setIsWalletConnecting(false)
        setShowConnect(false)
        setSwitchSheetOpen(false)
        storage.setItem(CONNECT_ACCOUNT, account!)

        if (isManualConnect.current) {
          toastSuccess({ title: t('connectSuccess') })
          isManualConnect.current = false
        }
        break

      case WalletStatus.WRONG_NETWORK:
        setSwitchSheetOpen(true)
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

  const connectWallet = async (wallet: WalletConfig, chainId: number | null) => {
    
    if (!chainId) return
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

      await handleConnect(ConnectorType.Injected, chainId, wallet, true)
      return
    }

    setConnectorType(ConnectorType.WalletConnect)

    await handleConnect(ConnectorType.WalletConnect, chainId, wallet, true)
  }

  return (
    <>
      {!account ? (
        <div
          className={cn(
            'bg-brand px-3 rounded-[8px] text-sm/4.5 font-medium h-9 flex items-center justify-center',
            props.connectBtnClassName
          )}
          onClick={() => {
            const injectedWallet = wallets.find(w => w.detected)
            if (!injectedWallet) {
              toastError({ title: t('noInjectedWallet') })
              return
            }
            connectWallet(injectedWallet, currentChainId)
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
          <div className='w-5 h-5'>
            {currentChain?.icon && <LazyImage src={currentChain?.icon} className='w-5 h-5' />}
          </div>
          
          <span>{shortenAddress(account)}</span>
          <LazyImage src='/images/h5/arrow-down.svg' />
        </button>
      )}
      <WalletDrawer open={walletSheetOpen} onOpenChange={open => setWalletSheetOpen(open)} />
      <SwitchChainDrawer open={switchSheetOpen} onOpenChange={open => setSwitchSheetOpen(open)} disableOutsideClose={true} />
    </>
  )
}
