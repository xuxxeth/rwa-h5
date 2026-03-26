import { useState } from 'react'
import { Header } from '@/components/Header.tsx'
import { SessionStatusBar } from './components/SessionStatusBar'
import { BuySellTabs } from './components/BuySellTabs'
import { OrderTypeSelector } from './components/OrderTypeSelector'
import { SessionPicker } from './components/SessionPicker'
import { AmountInput } from './components/AmountInput'
import { TradeSummary } from './components/TradeSummary'
import { Footer } from '@/components/Footer'

export const TradePage = () => {
  const [buySell, setBuySell] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [buyAmount, setBuyAmount] = useState('')
  const [payAmount, setPayAmount] = useState('')

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <div className="flex flex-col gap-3 px-5 py-[10px]">
        {/* 交易时段状态栏 */}
        <SessionStatusBar />

        {/* 交易操作区 */}
        <div className="flex flex-col gap-2">
          {/* 买入/卖出 Tab */}
          <BuySellTabs activeTab={buySell} onChange={setBuySell} />

          {/* 市价/限价 + 历史 */}
          <OrderTypeSelector activeType={orderType} onChange={setOrderType} />

          {/* 交易时段选择 */}
          <SessionPicker />

          {/* 输入区域 */}
          <AmountInput
            label="买入数量"
            value={buyAmount}
            onChange={setBuyAmount}
            tokenSymbol="AMZNt"
            balance="12345 AMZNt"
            showDropdown
          />
          <AmountInput
            label="预计支付"
            value={payAmount}
            onChange={setPayAmount}
            tokenSymbol="USDT"
            balance="12345.34 USDT"
            showDropdown={false}
          />
        </div>

        {/* 操作按钮 + 摘要 */}
        <div className="flex flex-col gap-3">
          <button className="w-full rounded-[8px] bg-brand py-2 text-center text-[14px] font-medium text-black">
            链接钱包
          </button>

          <TradeSummary />
        </div>

        {/* 底部信息 */}
        <Footer />
      </div>
    </div>
  )
}

export default TradePage
