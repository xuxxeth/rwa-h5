import { useEffect, useRef } from 'react'
import storage from '@/utils/storage'
import { CONNECTOR_TYPE, WALLET_UUID } from '@/config/constants'
import { ConnectorType, type WalletConfig } from '@/hooks/useCaCommon'

export type UseReconnectWalletParams = {
  wallets: WalletConfig[]
  account?: string | null
  initialized: boolean
  currentChainId: number | null
  setCurrentWallet: (wallet: WalletConfig) => void
  setIsWalletConnecting: (connecting: boolean) => void
  connect: (connectorType: ConnectorType, chainId: number, wallet: WalletConfig) => Promise<void>
  enabled?: boolean
}

export function useReconnectWallet({
  wallets,
  account,
  initialized,
  currentChainId,
  setCurrentWallet,
  setIsWalletConnecting,
  connect,
  enabled = true,
}: UseReconnectWalletParams) {
  const reconnectingRef = useRef(false)
  const triedReconnectRef = useRef(false)

  useEffect(() => {
    if (!enabled || triedReconnectRef.current || reconnectingRef.current) return
    if (!wallets.length || account || !initialized || !currentChainId) return

    const walletUUID = storage.getItem(WALLET_UUID)
    const connector = storage.getItem(CONNECTOR_TYPE) as ConnectorType | null

    triedReconnectRef.current = true

    if (!walletUUID || !connector) {
      setIsWalletConnecting(false)
      return
    }

    const wallet = wallets.find(item => item.info.name === walletUUID)
    if (!wallet) return

    if (connector === ConnectorType.Injected && !wallet.detected) {
      return
    }

    reconnectingRef.current = true
    setCurrentWallet(wallet)
    setIsWalletConnecting(true)

    void connect(connector, currentChainId, wallet).finally(() => {
      reconnectingRef.current = false
      setIsWalletConnecting(false)
    })
  }, [enabled, wallets, account, initialized, currentChainId, setCurrentWallet, setIsWalletConnecting, connect])

  return {
    isReconnecting: reconnectingRef.current,
  }
}
