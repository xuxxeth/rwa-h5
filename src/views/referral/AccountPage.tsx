import { RESPONSE_CODE } from '@/config/constants'
import DataStatsSection from './components/DataStatsSection'
import RecordsSection from './components/RecordsSection'
import ReferralHeader from './components/ReferralHeader'
import { referralApi } from '@/service/referral/api'
import type { IInviteCodeInfo } from '@/service/referral/types'
import { useRequest } from '@/hooks/useRequest'
import { useAccount } from '@/hooks/useCaCommon'
import { useSignatureValidStatus } from '@/hooks/useSignature'

export const AccountPage = () => {
  const [isSignatureValid, _, validSignature] = useSignatureValidStatus()
  const account = useAccount()

  const {
    data: inviteCodeInfo,
    loading: inviteCodeInfoLoading,
    error: inviteCodeInfoError,
    run: refreshCodeInfo,
  } = useRequest<IInviteCodeInfo>(
    async () => {
      if (!account || !validSignature()) {
        return null
      }

      const res = await referralApi.getInviteCodeInfo()
      if (res?.code === RESPONSE_CODE.SUCCESS) {
        return res.data
      }
      return null
    },
    [account, isSignatureValid],
    { immediate: Boolean(account) && isSignatureValid, initialData: null }
  )

  return (
    <div className='bg-[#131416] min-h-screen '>
      <div className='mx-auto px-[16px]'>
        <div className='flex flex-col gap-6 w-full pb-[40px]'>
          {/* 1. 标题区域 */}
          <ReferralHeader />

          <DataStatsSection
            inviteCodeInfo={inviteCodeInfo}
            account={account}
            refreshCodeInfo={refreshCodeInfo}
          />

          {/* 3. 记录表格 */}
          <RecordsSection />
        </div>
      </div>
    </div>
  )
}

export default AccountPage
