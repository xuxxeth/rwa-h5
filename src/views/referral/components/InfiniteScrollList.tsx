import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { type ErrorHandlers } from '@/config/constants'
import NoRecord from '@/components/no-record'
import SignatureVerify from '@/components/signature-verify'
import { WalletNotConnectedSmallVersion } from '@/components/wallet-not-connected'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils'

const DEFAULT_PAGE_LIMIT = 10

type BaseFilter = {
  after?: string
  limit?: number
}

type PageData<T> = {
  data: T[]
  nextPage: string | undefined
}

export interface InfiniteScrollListProps<
  T extends { id: string },
  F extends BaseFilter = BaseFilter,
> {
  chainId: number | null
  account: string | undefined
  queryKey: string
  api: (filters?: F, errorHandlers?: ErrorHandlers) => Promise<{ data?: T[] }>
  filter?: F
  pageLimit?: number
  signatureSubTitle?: string
  className?: string
  listClassName?: string
  footerClassName?: string
  emptyFallback?: ReactNode
  walletFallback?: ReactNode
  getNextCursor?: (item: T) => string
  getItemKey?: (item: T, index: number) => string | number
  renderItem: (item: T, index: number) => ReactNode
}

type InfiniteScrollListContentProps<
  T extends { id: string },
  F extends BaseFilter = BaseFilter,
> = Omit<InfiniteScrollListProps<T, F>, 'chainId' | 'account'> & {
  chainId: number
  account: string
  refreshIsSignatureValid: (_isValid: boolean) => void
}

export default function InfiniteScrollList<
  T extends { id: string },
  F extends BaseFilter = BaseFilter,
>(props: InfiniteScrollListProps<T, F>) {
  const [isSignatureValid, refreshIsSignatureValid] = useSignatureValidStatus()

  if (!props.account || !props.chainId) {
    return (
      props.walletFallback ?? (
        <div className='px-4 py-2'>
          <WalletNotConnectedSmallVersion />
        </div>
      )
    )
  }

  if (!isSignatureValid) {
    return (
      <SignatureVerify
        desc='signatureVerifyDescTop'
        subDesc={props.signatureSubTitle ?? 'rebate.sigSubTitle'}
        className='mt-14'
        refreshIsSignatureValid={refreshIsSignatureValid}
      />
    )
  }

  return (
    <InfiniteScrollListContent<T, F>
      {...props}
      chainId={props.chainId}
      account={props.account}
      refreshIsSignatureValid={refreshIsSignatureValid}
    />
  )
}

function InfiniteScrollListContent<T extends { id: string }, F extends BaseFilter = BaseFilter>(
  props: InfiniteScrollListContentProps<T, F>
) {
  const { t } = useTranslation()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [, , validSignature] = useSignatureValidStatus()

  const pageLimit = props.pageLimit ?? DEFAULT_PAGE_LIMIT
  const getNextCursor = props.getNextCursor ?? ((item: T) => item.id)
  const getItemKey = props.getItemKey ?? ((item: T) => item.id)

  const queryKey = useMemo(
    () => [props.queryKey, props.account, props.chainId, props.filter],
    [props.queryKey, props.account, props.chainId, props.filter]
  )

  const errorHandlers = useMemo<ErrorHandlers>(
    () => ({
      onUnAuthorized: () => {
        props.refreshIsSignatureValid(false)
      },
    }),
    [props.refreshIsSignatureValid]
  )

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PageData<T>, Error>({
      queryKey,
      queryFn: async ({ pageParam }) => {
        const res = await props.api(
          {
            ...(props.filter ?? {}),
            after: pageParam,
            limit: pageLimit,
          } as F,
          errorHandlers
        )

        const list = res?.data ?? []

        return {
          data: list,
          nextPage: list.length >= pageLimit ? getNextCursor(list[list.length - 1]) : undefined,
        }
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: lastPage => lastPage.nextPage,
      enabled: !!validSignature(),
    })

  const list = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetching && !isFetchingNextPage) {
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
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <span className='text-[14px] text-gray-400 font-normal'>{t('assets.loading')}...</span>
      </div>
    )
  }

  if (list.length === 0) {
    return props.emptyFallback ?? <NoRecord className='mt-14' />
  }

  return (
    <div className={cn('flex flex-col', props.className)}>
      <div className={cn('space-y-3', props.listClassName)}>
        {list.map((item, index) => (
          <div key={getItemKey(item, index)}>{props.renderItem(item, index)}</div>
        ))}
      </div>

      <div
        ref={loadMoreRef}
        className={cn(
          'flex flex-col items-center justify-center gap-2.5 py-4',
          props.footerClassName
        )}
      >
        {isFetchingNextPage ? (
          <span className='text-[14px] text-gray-400'>{t('assets.loading')}...</span>
        ) : hasNextPage ? (
          <button className='text-[14px] font-normal text-gray-400' onClick={() => fetchNextPage()}>
            {t('assets.scrollToLoadMore')}
          </button>
        ) : (
          <span className='text-[14px] text-gray-400 font-normal'>{t('assets.noMoreData')}</span>
        )}
      </div>
    </div>
  )
}
