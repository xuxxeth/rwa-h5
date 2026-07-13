import { useCallback } from 'react'
import storage from '@/utils/storage'
import { LAST_CONNECTED_CHAIN_ID } from '@/config/storage'
import { useBaseStore } from '@/stores/baseStore'
import { useAppStore } from '@/stores/appStore'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'

export function useSwitchChainAction() {
  const { handleSwitchChain } = useActiveWeb3()
  const chains = useBaseStore(state => state.chainList)
  const setCurrentChain = useBaseStore(state => state.setCurrentChain)
  const setCurrentChainId = useAppStore(state => state.setCurrentChainId)

  const switchToChain = useCallback(
    async (targetChainId: number) => {
      const isSupported = chains.some(chain => chain.id === targetChainId && chain.state === 1)
      console.log('===>isSupported', isSupported)
      if (!isSupported) return false
      console.log('===> switchToChain targetChainId', targetChainId)
      const ok = await handleSwitchChain(targetChainId)
      console.log('===>ok', ok)
      if (!ok) {
        const nextChain = chains.find(chain => chain.id === targetChainId)
        if (nextChain) {
          storage.setItem(LAST_CONNECTED_CHAIN_ID, String(nextChain.id))
          setCurrentChainId(nextChain.id)
          setCurrentChain(nextChain)
        }
        return false
      }
      return true
    },
    [chains, handleSwitchChain, setCurrentChain, setCurrentChainId]
  )

  return { switchToChain }
}
