import { memo } from 'react'
import { cn, shortenAddress } from '@/utils'
import { toFixed, formatTimestamp, textSuffix } from '@/utils/format'
import { useTranslation } from '@/hooks/useTranslation'
import { useRwaByStockId } from '@/hooks/useRwaBalances'
import CopyButton from '@/components/button/copyButton'
import { LazyImage } from '@/components/image/LazyImage'
import type { IOpenOrder, OrderType, SessionType } from '@/service/scan/types'
import { OrderSide, OrderState } from '@/service/scan/types'
import { Address } from '@/components/Address.tsx'

import { CancelOrderButton } from '@/views/assets/v2/OpenOrder'

/* ── 状态映射 ── */
const STATUS_CONFIG: Record<number, { textKey: string; className: string }> = {
  [OrderState.PendingSubmit]: { textKey: 'assets.order.state.open', className: 'text-white' },
  [OrderState.PartialFilled]: {
    textKey: 'assets.order.state.partiallyFilled',
    className: 'text-orange-50',
  },
  [OrderState.Failed]: { textKey: 'assets.order.state.orderFailed', className: 'text-red-50' },
  [OrderState.Cancelled]: { textKey: 'assets.order.state.cancelled', className: 'text-gray-400' },
  [OrderState.Filled]: { textKey: 'assets.order.state.filled', className: 'text-white' },
  [OrderState.PendingCancel]: {
    textKey: 'assets.order.state.pendingCancel',
    className: 'text-gray-400',
  },
  [OrderState.PendingFill]: { textKey: 'assets.order.state.open', className: 'text-white' },
}

/* ── 子组件 ── */

/** 买入 / 卖出 Tag */
function SideTag({ side }: { side: OrderSide }) {
  const { t } = useTranslation()
  const isBuy = side === OrderSide.Buy
  return (
    <span
      className={cn(
        'rounded px-1 py-0.5 text-[12px] font-normal leading-[1.25em] border',
        isBuy
          ? 'bg-[rgba(37,167,80,0.1)] border-[rgba(37,167,80,0.2)] text-green-100'
          : 'bg-[rgba(37,167,80,0.1)] border-[rgba(202,63,100,0.2)] text-red-50'
      )}
    >
      {isBuy ? t('assets.order.buy') : t('assets.order.sell')}
    </span>
  )
}

/** 市价 / 限价 Tag */
function OrderTypeTag({ orderType }: { orderType: OrderType }) {
  const { t } = useTranslation()
  return (
    <span className='rounded font-normal px-1 py-0.5 text-[12px] leading-[1.25em] border border-gray-850 text-gray-400'>
      {orderType === 1 ? t('market') : t('limit')}
    </span>
  )
}

/** 数据行：label + value，三列等分 */
function DataCell({
  label,
  value,
  align = 'left',
  valueClassName,
}: {
  label: string
  value: string
  align?: 'left' | 'center' | 'right'
  valueClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        align === 'right' && 'items-end',
        align === 'center' && 'items-center'
      )}
    >
      <span className='text-[12px] font-normal leading-[1em] text-gray-400'>{label}</span>
      <span className={cn('text-[12px] font-normal leading-[1.25em] text-white', valueClassName)}>
        {value}
      </span>
    </div>
  )
}

/* ── 主组件 ── */

interface OrderCardProps {
  order: IOpenOrder
  onCancel?: (orderId: string) => void
  canceling?: boolean
}

export const OrderCard = memo(({ order, onCancel, canceling }: OrderCardProps) => {
  const { t } = useTranslation()
  const rwa = useRwaByStockId(order.stockId)
  const statusConfig = STATUS_CONFIG[order.state] ?? STATUS_CONFIG[0]

  return (
    <div className='flex flex-col gap-5 border-b border-gray-875 py-5'>
      {/* Row 1: Token info + Cancel button */}
      <div className='flex items-center justify-between'>
        {/* Left: icon + name + tags */}
        <div className='flex items-center gap-2'>
          {/* Token icon stack */}
          <div className='flex items-end -space-x-2'>
            {rwa?.icon && <LazyImage src={rwa.icon} className='h-8 w-8 rounded-full' />}
          </div>
          {/* Name + tags */}
          <div className='flex flex-col justify-center gap-1'>
            <span className='text-[16px] font-medium leading-[1.25em] text-white'>
              {rwa?.symbol ?? '--'}
            </span>
            <div className='flex items-center gap-1.5'>
              <SideTag side={order.side} />
              <OrderTypeTag orderType={order.orderType} />
            </div>
          </div>
        </div>

        {/* Right: Cancel + time */}
        <div className='flex flex-col items-end justify-center gap-1'>
          <CancelOrderButton
            className='text-[14px] font-medium leading-[1.25em] text-brand'
            orderId={order.orderId}
            disabled={order.state === 8}
          />
          <span className='text-[12px] font-normal leading-[1.25em] text-gray-400'>
            {formatTimestamp(order.txTime)}
          </span>
        </div>
      </div>

      {/* Row 2: 委托价格 / 成交数量 / 成交均价 */}
      <div className='flex items-center justify-between'>
        <DataCell
          label={`${t('portfolio.orderTable.orderPrice')}（${order.currency ?? 'USDT'}）`}
          value={order.orderType === 1 ? t('market') : toFixed(order.price)}
        />
        <DataCell
          label={t('portfolio.orderTable.filledAmount')}
          value={`${toFixed(order.settledSize, 0)}/${toFixed(order.size, 0)}`}
        />
        <DataCell
          label={t('portfolio.orderTable.avgPrice')}
          value={
            Number(order.settledSize) > 0
              ? toFixed(String(Number(order.settledAmount) / Number(order.settledSize)))
              : '--'
          }
          align='right'
        />
      </div>

      {/* Row 3: 成交金额 / 状态 / 交易时段 */}
      <div className='flex items-center justify-between'>
        <DataCell
          label={`${t('portfolio.orderTable.filledValue')}（${order.currency ?? 'USDT'}）`}
          value={textSuffix(toFixed(order.settledAmount), order.currency ?? 'USDT')}
        />
        <DataCell
          label={t('portfolio.orderTable.status')}
          value={t(statusConfig.textKey)}
          valueClassName={statusConfig.className}
        />
        <DataCell
          label={t('portfolio.orderTable.session')}
          value={order.sessionType === 0 ? t('portfolio.rthOnly') : t('portfolio.preAfter')}
          align='right'
        />
      </div>

      {/* Row 4: 哈希 */}
      <div className='flex items-center justify-between'>
        <span className='text-[12px] font-normal leading-[1em] text-gray-450'>
          {t('portfolio.orderTable.txHash')}
        </span>
        {/* <div className='flex items-center gap-1.5'>
          <span className='text-[12px] leading-[1.25em] text-blue-50'>
            {shortenAddress(order.txHash ?? '', 4, 4)}
          </span>
          <CopyButton copyText={order.txHash ?? ''} />
        </div>*/}
        <Address
          className='text-[12px] font-mono leading-[1.25em] text-blue-50'
          address={order.txHash ?? ''}
        />
      </div>
    </div>
  )
})

OrderCard.displayName = 'OrderCard'
