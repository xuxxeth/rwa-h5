import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { TittleBar } from '@/components/TittleBar'
import { OrderCard } from './components/OrderCard'
import { infiniteOpenOrderOptions } from '@/queries'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { useTranslation } from '@/hooks/useTranslation'
import NoRecord from '@/components/no-record'
import { Copy } from '@/components/Copy.tsx'
import { useOrderChanged } from '@/views/assets/v2/shared'
import { WalletNotConnectedSmallVersion } from '@/components/wallet-not-connected'
import SignatureVerify from '@/components/signature-verify'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/utils'

const TIKO_ORDER_URL = 'https://www.tiko.cc/order'

const OedersPageEntry = () => {
  const isWalletConnecting = useAppStore(state => state.isWalletConnecting)

  const { account, chainId } = useActiveWeb3()
  const [isSignatureValid, refreshIsSignatureValid] = useSignatureValidStatus()

  const walltedConnected = account && chainId

  const initialConnectingFinished = useRef(false)

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
      <OrdersPage account={account} chainId={chainId} />
    </OrdersWrapper>
  )
}

function OrdersWrapper(props: { children: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className='flex min-h-main flex-col bg-gray-950'>
      {/* TittleBar */}
      <TittleBar className='sticky top-navbar z-[5]' title={t('assets.order.openOrders')} />
      {props.children}
    </div>
  )
}

const OrdersPage = (props: { account: string; chainId: number }) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3()
  const [isSignatureValid] = useSignatureValidStatus()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isFetchedAfterMount,
    refetch,
  } = useInfiniteQuery(infiniteOpenOrderOptions(account ?? '', chainId ?? 0, isSignatureValid))

  // WS 订单状态变更时自动刷新，与 OpenOrderTable 保持一致
  const orderChanged = useOrderChanged()
  useEffect(() => {
    if (!isFetchedAfterMount || isLoading || !orderChanged) return
    refetch()
  }, [orderChanged])

  const orders = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])

  /* ── 无限滚动 ── */
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching && !isFetchingNextPage) {
        // 当滚动到加载更多区域且有下一页数据时，触发加载
        fetchNextPage()
      }
    })

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage])

  return (
    <div className='flex flex-1 flex-col px-5'>
      {isLoading ? (
        <div className='flex flex-1 justify-center mt-10'>
          <span className='text-[14px] text-gray-400 font-normal'>{t('assets.loading')}...</span>
        </div>
      ) : orders.length === 0 ? (
        <>
          <NoRecord />
          <SeeMoreOnWeb className='mt-10' />
        </>
      ) : (
        <>
          {orders.map(order => (
            <OrderCard key={order.orderId} order={order} />
          ))}

          {/* 加载更多 / 底部状态 */}
          <div ref={loadMoreRef} className='flex flex-col items-center justify-center gap-2.5 py-4'>
            {isFetchingNextPage ? (
              <span className='text-[14px] text-gray-400'>{t('assets.loading')}...</span>
            ) : hasNextPage ? (
              <button
                className='text-[14px] font-normal text-gray-400'
                onClick={() => fetchNextPage()}
              >
                {t('assets.scrollToLoadMore')}
              </button>
            ) : (
              <>
                <span className='text-[14px] text-gray-400 font-normal'>
                  {t('assets.noMoreData')}
                </span>
              </>
            )}
          </div>
          <SeeMoreOnWeb />
        </>
      )}
    </div>
  )
}

function SeeMoreOnWeb(props: { className?: string }) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'inline-block font-normal mb-10 align-middle text-center text-[12px] text-gray-500',
        props.className
      )}
    >
      {t('portfolio.webHis')}
      {TIKO_ORDER_URL}
      <Copy className={'inline-block ml-[2px] !text-gray-500'} content={TIKO_ORDER_URL} />
    </div>
  )
}

export default OedersPageEntry
