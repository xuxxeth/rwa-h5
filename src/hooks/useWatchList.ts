import type { IRwa } from "@/service/base/types"
import { useAppStore } from "@/stores/appStore"
import { useBaseStore } from "@/stores/baseStore"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useActiveWeb3 } from "./useActiveWe3"
import storage from "@/utils/storage"

// 获取推荐自迁
export function useRwaRecommendList() {
  const rwaList = useBaseStore(state => state.rwaList)
  const currentChainId = useAppStore(state => state.currentChainId)

  return useMemo(() => {
    return rwaList.filter(rwa => rwa.state !== 2 && rwa.chainId === currentChainId).slice(0, 4)
  }, [rwaList, currentChainId])
}

export function useWatchList() {
  const recommendList = useRwaRecommendList()
  const currentChainId = useAppStore(state => state.currentChainId)
  const { account } = useActiveWeb3()
  const [customOptions, setCustomOptions] = useState<IRwa[] | null>(null)


  const handleRefresh = useCallback(async () => {
    if (currentChainId && account) {
      const storageKey = account + currentChainId
      const localeList = storage.getItem(storageKey) || []
      setCustomOptions(localeList)
    }
  }, [account, currentChainId])

  useEffect(() => {
    handleRefresh()
  }, [handleRefresh])

  return {
    customOptions,
    recommendList,
    handleRefresh
  }

}