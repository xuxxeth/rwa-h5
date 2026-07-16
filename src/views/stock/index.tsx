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
      <div className='mx-auto flex h-[100%] max-w-[430px] flex-col w-full'>
        <div className='pt-4'>
          <StockInfo inputToken={inputToken} />
          <StockTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className='mt-5 flex gap-2 justify-between px-4 '>
            <div className=''>
              <div className='text-[28px] font-semibold leading-none text-[#32E0A0]'>${234.98}</div>
              <div className='mt-[6px] text-[12px] font-medium text-[#32E0A0]'>
                {23} (0.45%)
              </div>
              <div className='mt-3 flex flex-wrap items-center gap-2 text-[12px]'>
                <span className='rounded-full bg-purple-500/20 px-2.5 py-1 text-purple-300'>盘中时段</span>
              </div>
            </div>

            <div className='w-[60%] space-y-2 pt-2 text-[10px] text-[#9DA3AF] flex justify-end'>
              <div className=' grid grid-cols-2'>
                {[
                  ['市值', '$31.4B'],
                  ['24h最高', '$31.4B'],
                  ['24h最低', '$31.4B'],
                  ['合约地址', '0x334e...Re34'],
                ].map(([label, value]) => (
                  <>
                    <span>{label}</span>
                    <span className='flex items-center gap-1 text-[#CED1D9] justify-end'>
                      {value}
                      {label === '合约地址' ? <CopyButtonV2 svgClassName='text-[#9DA3AF] w-3 h-3' copyText='1111' /> : null}
                    </span>
                  </>
                    
                ))}
              </div>
              
            </div>
          </div>

          
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
