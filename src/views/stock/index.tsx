import { Suspense, useEffect, useState } from 'react'

import { BackButton } from '@/components/menu/BackButton'
import { LazyImage } from '@/components/image/LazyImage'
import CopyButtonV2 from '@/components/button/CopyButtonV2'
import { KlineCharts } from './components/KlineCharts'
import { StockTabs, type TabType } from './components/StockTabs'
import { useRouter } from '@/hooks/useRouter'
import { useAppStore } from '@/stores/appStore'
import { useTradeStore } from '@/stores/tradeStore'
import { useRwas } from '@/hooks/useRwaBalances'
import { StockInfo } from './components/StockInfo'
import { useRealtimeRwa } from '@/hooks/useRealtimeRwa'
import TVChartContainer from '@/components/TVChart/TVChartContainer'
import { TradingChart } from '@/components/TVChart/TradingChart'
import { SwitchButton } from '@/components/button/SwitchChainButton'
import { RwaItemPrice } from './components/RwaItemPrice'


function StockChartPage() {
  const [activeTab, setActiveTab] = useState<TabType>("chart");
  const router = useRouter()
  const currentChainId = useAppStore(state => state.currentChainId)
  const inputToken = useTradeStore(state => state.inputToken)
  const updateInputToken = useTradeStore(state => state.updateInputToken)
  const rwaList = useRwas()

  useEffect(() => {
    // 当前链和rwaList里的数据chainId一致，才进行更新操作
    if (!rwaList[0] || !currentChainId) return
    if (rwaList[0] && currentChainId) {
      if (rwaList[0].chainId !== currentChainId) return
    }
    if (!router.params.symbol) return
    const _rwa = rwaList.find(rwa => rwa.symbol.toLowerCase() === router.params.symbol?.toLowerCase())
    // 切换链的时候，找到了正常更新，未找到，则返回到市场页
    if (_rwa) {
      updateInputToken(_rwa)
    } 
  }, [rwaList.length, router.params, currentChainId])


  useRealtimeRwa(inputToken ?? null)


  return (
    <div className='h-screen flex flex-col justify-between bg-[#0E0F12] text-white'>
      <SwitchButton />
      <div className='mx-auto flex h-[100%] max-w-[430px] flex-col w-full'>
        <div className='pt-4'>
          <StockInfo inputToken={inputToken} />
          <StockTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <RwaItemPrice />
          
        </div>

        <div className='mt-3'>
          {/* <KlineCharts /> */}
          <TradingChart from={'market'} mode="tv" />
        </div>

      </div>
      <div className='mt-auto grid grid-cols-2 gap-3 border-t border-[#1A1B1E] p-4 fixed left-0 right-0 bottom-0'>
        <button className='h-11 rounded-full bg-[#2BAE58] text-[14px] font-semibold text-white active:scale-95'>买入</button>
        <button className='h-11 rounded-full bg-[#D24C73] text-[14px] font-semibold text-white active:scale-95'>卖出</button>
      </div>
    </div>
  )
}

export default StockChartPage
