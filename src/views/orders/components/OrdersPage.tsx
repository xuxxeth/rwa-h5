import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { OrderCard } from './OrderCard'
import { infiniteOpenOrderOptions } from '@/queries'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { useTranslation } from '@/hooks/useTranslation'
import NoRecord from '@/components/no-record'
import { Copy } from '@/components/Copy.tsx'
import { useOrderChangedV2 } from '@/views/assets/v2/shared'
import { cn } from '@/utils'

export const TIKO_ORDER_URL = 'https://www.tiko.cc/order'

export function SeeMoreOnWeb(props: { className?: string }) {
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

const OrdersPage = ({ account, chainId }: { account: string; chainId: number }) => {
  const { t } = useTranslation()
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
  } = useInfiniteQuery(infiniteOpenOrderOptions(account, chainId, isSignatureValid))

  const isRefetchEnabled = isFetchedAfterMount && !isLoading
  useOrderChangedV2(() => refetch(), isRefetchEnabled)

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
            <OrderCard key={order.orderId} order={order} from='open' />
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

export { OrdersPage }