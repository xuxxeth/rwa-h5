import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { TxHashCell, AddressCell } from '@/views/assets/Shared'
import type { IRebate, IRebateFilter, IClaim } from '@/service/scan/types'
import { scanApi } from '@/service/scan/api'
import { referralApi } from '@/service/referral/api'
import { type IInvitee } from '@/service/referral/types'
import InfiniteScrollList from './InfiniteScrollList'
import { useAccount, useChainId } from 'ca-common-web'
import ChevronDown from '@/components/icons/set/ChevronDown'
import { formatTimestamp, multiply, textSuffix, cn, sum } from '@/utils'
import { AmountDisplay, TokenCell } from './RebateStats'

type TabType = 'invite' | 'rebate' | 'withdraw'

const TABS: Array<{ key: TabType; label: string }> = [
  { key: 'invite', label: 'referralHis' },
  { key: 'rebate', label: 'rebateHis' },
  { key: 'withdraw', label: 'claimHis' },
]

interface TabButtonProps {
  tabKey: TabType
  label: string
  active: boolean
  onClick: () => void
  t: (key: string) => string
}

function TabButton({ tabKey, label, active, onClick, t }: TabButtonProps) {
  return (
    <button
      data-tab={tabKey}
      onClick={onClick}
      className={`shrink-0 px-[8px] cursor-pointer py-[4px] rounded-[6px] transition-colors ${
        active ? 'bg-[#282a2f] text-white' : 'text-[#9da3af]'
      }`}
    >
      <p className='font-normal text-sm/4.5 leading-normal whitespace-nowrap'>
        {t(`rebate.${label}`)}
      </p>
    </button>
  )
}

export default function RecordsSection() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('invite')
  const account = useAccount()
  const chainId = useChainId()
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeTabElement = tabsRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab="${activeTab}"]`
    )

    activeTabElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [activeTab])

  return (
    <div className='min-h-[480px] w-full'>
      <div className='flex flex-col h-full'>
        <div ref={tabsRef} className='overflow-x-auto scrollbar-hide'>
          <div className='flex min-w-max gap-2 items-center'>
            {TABS.map(tab => (
              <TabButton
                key={tab.key}
                tabKey={tab.key}
                label={tab.label}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                t={t}
              />
            ))}
          </div>
        </div>
        <div>
          {activeTab === 'invite' && <InviteeHistoryTable chainId={chainId} account={account} />}
          {activeTab === 'rebate' && <RebateHistoryTable chainId={chainId} account={account} />}
          {activeTab === 'withdraw' && <WithdrawHistoryTable chainId={chainId} account={account} />}
        </div>
      </div>
    </div>
  )
}

const PAGE_LIMIT = 10
const EMPTY_FILTER = {}

function InviteeHistoryTable(props: { chainId: number | null; account: string | undefined }) {
  const { t } = useTranslation()

  return (
    <InfiniteScrollList<IInvitee, IRebateFilter>
      chainId={props.chainId}
      account={props.account}
      queryKey='inviteeHistory'
      api={referralApi.getInvitees}
      pageLimit={PAGE_LIMIT}
      filter={EMPTY_FILTER}
      signatureSubTitle='rebate.sigSubTitle'
      renderItem={item => (
        <HistoryCard>
          <HistoryRow
            label={t('rebate.inviteTime')}
            value={formatTimestamp(item.createTime / 1000)}
          />
          <HistoryRow label={t('rebate.ratio')} value={textSuffix(item.ratio.toString(), '%', 0)} />
          <HistoryRow
            label={t('rebate.totalContributed')}
            value={
              <>
                <AmountDisplay amount={item.contribute} />
                <span className='ml-1'>USD</span>
              </>
            }
          />
          <HistoryRow
            label={t('rebate.inviteeAddr')}
            value={<AddressCell address={item.referee} />}
          />
        </HistoryCard>
      )}
    />
  )
}

function WithdrawHistoryTable(props: { chainId: number | null; account: string | undefined }) {
  const { t } = useTranslation()

  return (
    <InfiniteScrollList<IClaim, IRebateFilter>
      chainId={props.chainId}
      account={props.account}
      queryKey='claimHistory'
      api={scanApi.getClaims}
      pageLimit={PAGE_LIMIT}
      filter={EMPTY_FILTER}
      signatureSubTitle='rebate.sigSubTitle'
      renderItem={item => {
        try {
          const data = JSON.parse(item.data) as { [token: string]: string }
          const total = sum(...Object.values(data))
          return (
            <HistoryCard>
              <HistoryRow label={t('rebate.claimTime')} value={formatTimestamp(item.claimTime)} />
              <ClaimAmountRow label={t('rebate.claimAmount')} total={total} data={data} />
              <HistoryRow label={t('rebate.tx')} value={<TxHashCell hash={item.txHash} />} />
            </HistoryCard>
          )
        } catch {
          return (
            <HistoryCard>
              <HistoryRow label={t('rebate.claimTime')} value={formatTimestamp(item.claimTime)} />
              <HistoryRow label={t('rebate.claimAmount')} value={textSuffix('--', 'USD')} />
              <HistoryRow label={t('rebate.tx')} value={<TxHashCell hash={item.txHash} />} />
            </HistoryCard>
          )
        }
      }}
    />
  )
}

function RebateHistoryTable(props: { chainId: number | null; account: string | undefined }) {
  const { t } = useTranslation()

  return (
    <InfiniteScrollList<IRebate, IRebateFilter>
      chainId={props.chainId}
      account={props.account}
      queryKey='rebateHistory'
      api={scanApi.getRebates}
      pageLimit={PAGE_LIMIT}
      filter={EMPTY_FILTER}
      signatureSubTitle='rebate.sigSubTitle'
      renderItem={item => (
        <HistoryCard>
          <HistoryRow label={t('rebate.rebateTime')} value={formatTimestamp(item.rebateTime)} />
          <HistoryRow
            label={t('rebate.ratio')}
            value={textSuffix(multiply(item.ratio, 100), '%', 0)}
          />
          <HistoryRow
            label={t('rebate.amount')}
            value={
              <>
                <AmountDisplay amount={item.amount} />
                <span className='ml-1'>{item.token}</span>
              </>
            }
          />
          <HistoryRow
            label={t('rebate.inviteeAddr')}
            value={<AddressCell address={item.referee} />}
          />
          <HistoryRow label={t('rebate.tx')} value={<TxHashCell hash={item.txHash} />} />
        </HistoryCard>
      )}
    />
  )
}

function ClaimAmountRow(props: {
  label: string
  total: string
  data: { [token: string]: string }
}) {
  const [expanded, setExpanded] = useState(false)
  const entries = Object.entries(props.data).sort((a, b) => (a[0] > b[0] ? -1 : 1))

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-start font-normal justify-between'>
        <span className='text-xs/4 text-gray-400'>{props.label}</span>
        <button
          type='button'
          className='flex flex-row items-center text-white text-xs/4 cursor-pointer'
          onClick={() => setExpanded(prev => !prev)}
        >
          <AmountDisplay amount={props.total} showTooltip={false} />
          <span className='ml-1'>USD</span>
          <ChevronDown
            size={16}
            className={cn('ml-1 text-gray-400 transition-transform', expanded && 'rotate-180')}
          />
        </button>
      </div>
      {expanded && (
        <div className='flex w-full flex-col gap-1 rounded-[8px] bg-gray-900 p-2'>
          {entries.map(([token, amount]) => (
            <div key={token} className='flex flex-row justify-end text-white font-normal'>
              <AmountDisplay amount={amount} showTooltip={false} />
              <TokenCell token={token} className='w-8 ml-1' />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function HistoryCard(props: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-3 border-b border-gray-850 py-5 px-2'>{props.children}</div>
  )
}

function HistoryRow(props: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex items-start font-normal justify-between'>
      <span className='text-xs/4 text-gray-400'>{props.label}</span>
      <div className='text-xs/4 text-white text-right break-all'>{props.value}</div>
    </div>
  )
}

function HistoryDataCell(props: {
  label: string
  value: React.ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-[6px]',
        props.className,
        props.align === 'right' && 'items-end',
        props.align === 'center' && 'items-center'
      )}
    >
      <span
        className={cn(
          'text-[12px] font-normal leading-[1em] text-gray-400 text-center',
          props.align === 'right' ? 'text-right' : 'text-left'
        )}
      >
        {props.label}
      </span>
      <div className='text-[12px] font-normal leading-[1.25em] text-white'>{props.value}</div>
    </div>
  )
}
