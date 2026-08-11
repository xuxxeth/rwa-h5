import { useAppStore } from '@/stores/appStore'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { AssetSection } from '../index/components/AssetSection';
import { Suspense, useState } from 'react';
import { AssetsPageTop } from '../index/components/PageTop';
import { SecurityWrap } from '../index/components/SecurityWrap';
import KycState from '@/components/kyc-state';
import { CTokenListV2 } from '@/components/ctoken-list/CtokenList';
import { useTranslation } from '@/hooks/useTranslation'
import { CTokenListInAssets } from '@/components/ctoken-list/CtokenListInAssets';


function NoAccountOrSign({ from }: {from?: string}) {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative rounded-bl-[8px] rounded-br-[8px] max-w-[680px]">
      <AssetsPageTop />
      <SecurityWrap />
    </div>
  )
}

function AccountAndSign() {
  const { t } = useTranslation()
  
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative rounded-bl-[8px] rounded-br-[8px] max-w-[680px] w-full">
      <AssetSection from='assets' />
      <div className=" w-full px-4">
        <Suspense fallback={null} >
          <KycState />
        </Suspense>
      </div>
      <div className='text-[18px] font-bold text-white px-4 mt-2'>{t('v4.t41')}</div>
      <div className=' w-full'>
        <CTokenListInAssets from='assets' />
      </div>
    </div>
  )
}

function Assets() {
  const isWalletConnecting = useAppStore(state => state.isWalletConnecting)
  const { account } = useActiveWeb3()
  
    const showMainContent = !isWalletConnecting
  
    return (
      <div className="bg-[#131416] relative size-full min-h-screen flex pb-[100px]" >
        {showMainContent ? (
          <>
            {(!account ) && <NoAccountOrSign from="assets" />}
            {account && <AccountAndSign />}
          </>
        ) : null}
  
      </div>
    )
}

export default Assets
