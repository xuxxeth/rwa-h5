import { useEffect } from 'react'
import storage from '@/utils/storage'
import { LAST_CONNECTED_CHAIN_ID } from '@/config/storage'
import { useBaseStore } from '@/stores/baseStore'
import { useAppStore } from '@/stores/appStore'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'

export function useSwitchChainSync() {
  const { handleSwitchChain, isChainSupported, chainId } = useActiveWeb3()
  const chains = useBaseStore(state => state.chainList)
  const setCurrentChain = useBaseStore(state => state.setCurrentChain)
  const setCurrentChainId = useAppStore(state => state.setCurrentChainId)

  useEffect(() => {
    if (!chains[0]) {
      return
    }

    const lastChainId = Number(storage.getItem(LAST_CONNECTED_CHAIN_ID) || chains[0].id)
    const chain = chains.filter(chain => chain.state === 1).find(chain => chain.id === lastChainId)

    handleSwitchChain(chain?.id || chains[0].id)
  }, [chains, handleSwitchChain])

  useEffect(() => {
    if (!chainId || !isChainSupported || !chains[0]) {
      return
    }

    const chain = chains.filter(chain => chain.state === 1).find(chain => chain.id === chainId) || chains[0]

    storage.setItem(LAST_CONNECTED_CHAIN_ID, String(chain.id))
    setCurrentChainId(chainId)
    setCurrentChain(chain)
  }, [chains, chainId, isChainSupported, setCurrentChain, setCurrentChainId])
}
