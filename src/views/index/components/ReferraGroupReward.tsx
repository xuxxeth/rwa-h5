import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { LazyImage } from '@/components/image/LazyImage'
import { CommunityDrawer } from './CommunityDrawer'
import { useRouter } from '@/hooks/useRouter'

function Frame23() {
  const { t } = useTranslation()

  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative">
      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
        <p
          className="[word-break:break-word] font-medium leading-none not-italic relative shrink-0 text-[14px] text-white"
        >
          {t('v4.t1')}
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
        <p className="[word-break:break-word] leading-[1.3] not-italic relative shrink-0 text-[#9da3af] text-[10px] w-full">
          {t('v4.t2')}
        </p>
      </div>
    </div>
  )
}

function Frame4() {
  const { t } = useTranslation()

  return (
    <div className="[word-break:break-word] capitalize content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px not-italic relative">
      <p className="font-medium leading-none min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">{t('v4.t3')}</p>
      <p className="font-['HarmonyOS_Sans_SC:Bold',sans-serif] leading-[0] min-w-full relative shrink-0 text-[#9da3af] text-[0px] w-[min-content]">
        <span className="leading-[1.3] text-[10px]">{t('v4.t4')}</span>
        <span className="leading-[1.3] text-[#ffca40] text-[10px]">{t('v4.t5')}</span>
      </p>
    </div>
  )
}

function ReferralGroup({ onClick }: { onClick?: (id: number) => void }) {
  return (
    <div
      className="content-stretch flex gap-[10px] items-start relative rounded-[10px] shrink-0 w-full cursor-pointer"
      data-name=""
      
    >
      <div className="bg-[#1a1b1e] flex-[1_0_0] min-w-px relative rounded-[8px] h-full"
        onClick={e => onClick?.(1)}
      >
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[16px] relative size-full">
            <div className="h-[32px] mix-blend-lighten relative shrink-0 w-[34px]" data-name="image 93">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <LazyImage alt="" className="absolute h-[101.1%] left-[-8.82%] max-w-none top-[-0.55%] w-[120.59%]" src="/images/v0.4/referral.png" />
              </div>
            </div>
            <Frame4 />
          </div>
        </div>
      </div>
      <div className="bg-[#1a1b1e] flex-[1_0_0] min-w-px relative rounded-[8px] self-stretch"
        onClick={e => onClick?.(2)}
      >
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[16px] relative size-full">
            <div className="h-[36px] mix-blend-lighten relative shrink-0 w-[34px]" data-name="image 92">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <LazyImage alt="" className="absolute h-[120%] left-[-14.18%] max-w-none top-[-10%] w-[128.37%]" src="/images/v0.4/group.png" />
              </div>
            </div>
            <Frame23 />
          </div>
        </div>
      </div>
    </div>
  )
}

function Reward() {
  const { t } = useTranslation()
  return (
    <div className="bg-[#1a1b1e] h-[80px] relative rounded-[8px] shrink-0 w-full" data-name="BANNER">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[16px] relative size-full">
          <div className="h-[36px] mix-blend-lighten relative shrink-0 w-[33px]" data-name="image 91">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <LazyImage alt="" className="absolute h-[115.55%] left-[-7.69%] max-w-none top-[-7.77%] w-[115.38%]" src="/images/v0.4/reward.png" />
            </div>
          </div>
          <div className="content-stretch  h-[54px] items-start min-w-px overflow-clip relative">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center leading-none min-h-px relative text-center w-full ">
              <p className="font-medium relative shrink-0 text-[14px] text-white text-left" >
                {t('v4.t102')}
              </p>
              <p className=" font-normal relative shrink-0 text-[#848e9c] text-[12px] text-left">
                {t('v4.t103')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReferraGroupReward() {
  const [communityDrawerOpen, setCommunityDrawerOpen] = useState(false)
  const router = useRouter()  
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch w-full flex flex-col gap-[24px] items-start px-[16px] relative size-full">
        <div className={'content-stretch  flex flex-col gap-[10px] items-start relative shrink-0 w-full'}>
          <ReferralGroup onClick={(id) => {
            if (id === 1) {
              router.push('/referral')
              return
            }
            setCommunityDrawerOpen(true)
            
          }} />
          {/* <Reward /> */}
        </div>
      </div>
      <CommunityDrawer open={communityDrawerOpen} onOpenChange={setCommunityDrawerOpen} />
    </div>
  )
}
