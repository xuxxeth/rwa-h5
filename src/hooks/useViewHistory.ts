import type { IRwa } from "@/service/base/types"
import storage from "@/utils/storage"
import { CONNECT_STATE_KEY } from "./useCaCommon"

function useViewHistory() {

  const updateHistory = (rwa: IRwa) => {
    const chainId = storage.getItem(CONNECT_STATE_KEY)?.chainId || '97'
    const localeList: IRwa[] = storage.getItem(`search_history_${chainId}`) || []
    const index = localeList.findIndex(item => item.address === rwa.address)
    if (index !== -1) {
      localeList.splice(index, 1)
    }
    localeList.push(rwa)
    // 最多20条，如果超过20条，删除最早的一条
    if (localeList.length > 20) {
      localeList.shift()
    }
    storage.setItem(`search_history_${chainId}`, localeList)
  }

  const removeHistoryAll = () => {
    const chainId = storage.getItem(CONNECT_STATE_KEY)?.chainId || '97'
    storage.removeItem(`search_history_${chainId}`)
  }

  const getHistoryList = (): IRwa[] => {
    const chainId = storage.getItem(CONNECT_STATE_KEY)?.chainId || '97'
    const localeList: IRwa[] = storage.getItem(`search_history_${chainId}`) || []
    return localeList.slice(0, 8).reverse()
  }

  return {
    updateHistory,
    removeHistoryAll,
    getHistoryList
  }


}

export { useViewHistory }