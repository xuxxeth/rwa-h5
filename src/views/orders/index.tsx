import { useEffect, useMemo, useRef, useState } from 'react'
import { TittleBar } from '@/components/TittleBar'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { useTranslation } from '@/hooks/useTranslation'
import { WalletNotConnectedSmallVersion } from '@/components/wallet-not-connected'
import SignatureVerify from '@/components/signature-verify'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from '@/hooks/useRouter'
import storage from '@/utils/storage'
import OrderTabs from './components/OrderTabs'
import { OrdersPage } from './components/OrdersPage'
import { HistoryOrdersPage } from './components/HistoryOrdersPage'
import { TradeHistory } from './components/TradeHistory'


const OedersPageEntry = () => {
  const isWalletConnecting = useAppStore(state => state.isWalletConnecting)

  const { account, chainId } = useActiveWeb3()
  const [isSignatureValid, refreshIsSignatureValid] = useSignatureValidStatus()

  const walltedConnected = account && chainId

  const initialConnectingFinished = useRef(false)

  const [currentTab, setCurrentTab] = useState("current");

  useEffect(() => {
    if (!isWalletConnecting) {
      initialConnectingFinished.current = true
    }
  }, [isWalletConnecting])

  if (!walltedConnected && isWalletConnecting && !initialConnectingFinished.current) {
    return null
  }

  if (!account || !chainId) {
    return (
      <OrdersWrapper>
        <div className='px-5'>
          <WalletNotConnectedSmallVersion />
        </div>
      </OrdersWrapper>
    )
  }

  if (!isSignatureValid) {
    return (
      <OrdersWrapper>
        <SignatureVerify
          desc='signatureVerifyDescTop'
          subDesc='signatureVerifyDescBottom'
          className='mt-9 px-5'
          refreshIsSignatureValid={refreshIsSignatureValid}
        />
      </OrdersWrapper>
    )
  }

  return (
    <OrdersWrapper>
      <OrderTabs onChange={setCurrentTab} />
      { currentTab === 'current' && <OrdersPage account={account} chainId={chainId} /> }
      { currentTab === 'history' && <HistoryOrdersPage account={account} chainId={chainId} /> }
      { currentTab === 'trade' && <TradeHistory account={account} chainId={chainId} /> }
      
    </OrdersWrapper>
  )
}

function OrdersWrapper(props: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className='flex min-h-main flex-col bg-gray-950'>
      {/* TittleBar */}
      <TittleBar
        onBack={() => {
          storage.setItem('fromPage', 'orders')
          router.back()
        }}
        className='sticky top-navbar z-[5]'
        title={t('v4.t50')}
      />
      {props.children}
    </div>
  )
}


export default OedersPageEntry
