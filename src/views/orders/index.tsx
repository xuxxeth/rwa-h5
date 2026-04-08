import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { TittleBar } from '@/components/TittleBar'
import { OrderCard } from './components/OrderCard'
import { infiniteOpenOrderOptions } from '@/queries'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { useTradeUtils } from '@/hooks/useTrading'
import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import NoRecord from '@/components/no-record'
import { Copy } from '@/components/Copy.tsx'
import { useOrderChanged } from '@/views/assets/v2/shared'

const TIKO_ORDER_URL = 'https://www.tiko.cc/order'

export const OrdersPage = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3()
  const [isSignatureValid] = useSignatureValidStatus()
  const { cancelOrder } = useTradeUtils()
  const setTxError = useTradeStore(s => s.setTxError)
  const { toastSuccess, toastError } = useToast()

  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
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

  return (
    <div className='flex min-h-main flex-col bg-gray-950'>
      {/* TittleBar */}
      <TittleBar className='sticky top-navbar z-[5]' title={t('assets.order.openOrders')} />

      {/* 订单列表 */}
      <div className='flex flex-1 flex-col px-5'>
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <span className='text-[14px] text-gray-400'>{t('assets.loading')}...</span>
          </div>
        ) : orders.length === 0 ? (
          // <div className="flex flex-1 flex-col items-center justify-center gap-2.5 py-4">
          //   <span className="text-[14px] text-gray-400">{t('noRecord')}</span>
          // </div>
          <div className='mb-10'>
            <NoRecord />
          </div>
        ) : (
          <>
            {orders.map(order => (
              <OrderCard
                key={order.orderId}
                order={order}
                // onCancel={debouncedCancelOrder}
                // canceling={cancelingId === order.orderId}
              />
            ))}

            {/* 加载更多 / 底部状态 */}
            <div
              ref={loadMoreRef}
              className='flex flex-col items-center justify-center gap-2.5 py-4'
            >
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
          </>
        )}
        <div className='inline-block font-normal align-middle text-center text-[12px] text-gray-500'>
          {t('portfolio.webHis')}
          {TIKO_ORDER_URL}
          <Copy className={'inline-block ml-[2px] !text-gray-500'} content={TIKO_ORDER_URL} />
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
