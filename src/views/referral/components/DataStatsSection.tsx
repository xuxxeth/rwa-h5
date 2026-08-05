import { LazyImage } from '@/components/image/LazyImage'
import InviteCard from './InviteCard'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import SignButton from '@/components/button/SignButton'
import { AutoBindDialog } from './AutoBindDialog'
import { Suspense } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import type { IInviteCodeInfo } from '@/service/referral/types'
import { RebateStats } from './RebateStats'

// 待领取返佣卡片
function PendingRewardsCard() {
  const { t } = useTranslation()
  return (
    <div className='flex-1 flex flex-col h-[217px] justify-between rounded-[16px]'>
      {/* 上部分 - 待领取返佣金额 */}
      <div className='flex flex-col gap-[8px] pt-[8px] w-full'>
        <p className='font-normal text-[16px] text-[#9da3af] leading-normal whitespace-nowrap'>{t('v4.t86')}</p>
        <div className='flex gap-[8px] items-baseline w-[146px]'>
          <p className='font-bold text-[32px] text-[#9cff3a] leading-none'>--</p>
          <p className='font-medium text-[18px] text-[#9da3af] leading-normal'>USD</p>
        </div>
      </div>

      {/* 下部分 - 领取按钮 */}
      <button className='bg-[#1a1b1e] h-[48px] rounded-[8px] w-full flex items-center justify-center disabled:cursor-not-allowed'>
        <p className='font-semibold text-[16px] text-[#737a87] whitespace-nowrap'>{t('v4.t87')}</p>
      </button>
    </div>
  )
}

// 单个数据项
interface DataItemProps {
  label: string
  value: string
  unit: string
}

function DataItem({ label, value, unit }: DataItemProps) {
  return (
    <div className='bg-[#1a1b1e] h-[60px] rounded-[8px] w-full flex items-center justify-between px-[16px] py-[8px]'>
      <p className='font-normal text-[16px] text-[#9da3af] leading-normal whitespace-nowrap'>
        {label}
      </p>
      <div className='flex gap-[8px] items-baseline'>
        <p className='font-bold text-[20px] text-white'>{value}</p>
        <p className='font-medium text-[18px] text-[#9da3af]'>{unit}</p>
      </div>
    </div>
  )
}

// 右侧数据列表
function DataList() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col h-[217px] justify-between w-[338px]'>
      <DataItem label={t('v4.t88')} value='--' unit='USD' />
      <DataItem label={t('v4.t89')} value='--' unit='USD' />
      <DataItem label={t('v4.t90')} value='--' unit={t('v4.t112')} />
    </div>
  )
}

// 授权签名卡片
function AuthorizationCard({ refreshIsSignatureValid }: { refreshIsSignatureValid: () => void }) {
  const { t } = useTranslation()
  return (
    <div className='bg-[#1a1b1e] h-full rounded-[16px] w-full flex flex-col items-center justify-center px-[32px] py-[24px]'>
      <div className='flex flex-col gap-[16px] items-center justify-center w-full'>
        {/* 图标 */}
        <div className='h-[112px] w-[160px] overflow-hidden relative flex items-center justify-center'>
          <LazyImage src='/images/referral/sign.png' className='160px' />
        </div>

        {/* 文字说明 */}
        <p className='font-normal text-[16px] text-white text-center w-[377px] leading-normal'>
          {t('ref.t20')}
        </p>

        <SignButton
          refreshIsSignatureValid={refreshIsSignatureValid}
          className='bg-[#9cff3a] h-[48px] w-[305px] font-semibold text-[16px] '
        />
        {/* 授权按钮 */}
        {/* <button className="bg-[#9cff3a] h-[48px] w-[305px] rounded-[8px] flex items-center justify-center px-[24px] py-[8px] hover:bg-[#8ee62a] transition-colors">
          <p className="font-semibold text-[16px] text-black whitespace-nowrap">
            {t('v4.t119')}
          </p>
        </button> */}
      </div>
    </div>
  )
}

// 主组件
export default function DataStatsSection(props: {
  inviteCodeInfo: IInviteCodeInfo | null
  refreshCodeInfo: () => Promise<any>
  account: string
}) {
  const { inviteCodeInfo, refreshCodeInfo, account } = props
  const [isSignatureValid, refreshIsSignatureValid] = useSignatureValidStatus()

  return (
    <div className='flex flex-col gap-[32px] w-full'>
      <div className=' min-h-[283px]'>
        <Suspense fallback={null}>
          {isSignatureValid ? (
            <InviteCard code={inviteCodeInfo?.code} ratio={inviteCodeInfo?.ratio} />
          ) : (
            <AuthorizationCard refreshIsSignatureValid={refreshIsSignatureValid} />
          )}
        </Suspense>
      </div>
      <div className='flex-1 h-full rounded-[16px] border border-[#232427] bg-[#131416]'>
        <RebateStats
          inviteCodeInfo={inviteCodeInfo}
          isSignatureValid={isSignatureValid}
          refreshCodeInfo={refreshCodeInfo}
          account={account}
        />
      </div>
    </div>
  )
}
