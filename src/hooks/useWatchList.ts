import type { IRwa } from "@/service/base/types"
import { useAppStore } from "@/stores/appStore"
import { useBaseStore } from "@/stores/baseStore"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useActiveWeb3 } from "./useActiveWe3"
import useFavorites from "./useFavorites"
import { useRwas } from "./useRwaBalances"
import { useSignatureValidStatus } from "./useSignature"

// 获取推荐自迁
export function useRwaRecommendList() {
  const rwaList = useBaseStore(state => state.rwaList)
  const currentChainId = useAppStore(state => state.currentChainId)

  return useMemo(() => {
    return rwaList.filter(rwa => rwa.state !== 2 && rwa.chainId === currentChainId).slice(0, 4)
  }, [rwaList, currentChainId])
}

export function useWatchList() {
  const [isSignatureValid, refreshIsSignatureValid] = useSignatureValidStatus()
  const recommendList = useRwaRecommendList()
  const currentChainId = useAppStore(state => state.currentChainId)
  const { account } = useActiveWeb3()
  const [customOptions, setCustomOptions] = useState<IRwa[] | null>(null)
  const { favorites, isLoading } = useFavorites()
  const rwaList = useRwas()

  const handleRefresh = useCallback(async () => {
    if (currentChainId && account && rwaList.length > 0) {
      const newList = rwaList.filter(rwa => favorites.includes(rwa.stockId))
      setCustomOptions(newList)
    } else {
      setCustomOptions([])
    }
  }, [account, currentChainId, rwaList])

  const loadingRef = useRef(false)

  useEffect(() => {
    if (currentChainId && account) { 
      loadingRef.current = false
    }
    if ((currentChainId && account && favorites.length === 0 && !isLoading && recommendList.length > 0) || !isSignatureValid) { 
      setCustomOptions([])
    }
    if (currentChainId && account && rwaList.length > 0 && favorites.length > 0 && !loadingRef.current && !isLoading && recommendList.length > 0 && isSignatureValid) {
      loadingRef.current = true
      handleRefresh()
    }
  }, [favorites.length, currentChainId, account, rwaList.length, isLoading, recommendList, isSignatureValid])

  return {
    isSignatureValid,
    refreshIsSignatureValid,
    customOptions,
    recommendList,
    handleRefresh
  }

}