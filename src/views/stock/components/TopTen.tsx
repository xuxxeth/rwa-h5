import type { IToptenshareholder } from '@/service/base/types'
import { memo } from 'react'
import { formatLargeNumber, toFixed } from '@/utils/format'
import { useTranslation } from '@/hooks/useTranslation'

const TopItem = ({ top, className }: { top: IToptenshareholder; className?: string }) => {
  const { t } = useTranslation()
  return (
    <div className=' text-[12px]'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex-1 text-[#737A87]'>{t('companyProfile.h1')}</div>
          <div className='flex-1 mt-1'>{top.investor}</div>
        </div>
        <div className='mt-3'>
          <div className='w-[94px] text-right text-[#737A87]'>{t('companyProfile.h3')}</div>
          <div className='flex-1 text-right mt-1'>{toFixed(top.proportion)}%</div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex-1 text-[#737A87]'>{t('companyProfile.h4')}</div>
          <div className='flex-1 mt-1'>{formatLargeNumber(top.shareHoldingChange)}</div>
        </div>
        <div>
          <div className='w-[94px] text-right text-[#737A87]'>{t('companyProfile.h2')}</div>
          <div className='flex-1 text-right mt-1'>{formatLargeNumber(top.heldSharesVolume)}</div>
        </div>
      </div>
        <div className='bg-[#232427] h-px mt-4 mb-2'></div>
      
    </div>
    
  )
}

const TopTen = memo(({ topTen }: { topTen: IToptenshareholder[] }) => {
  const { t } = useTranslation()

  return (
    <div>
      <div className='text-sm/5 font-semibold mb-2'>{t('companyProfile.top10')}</div>
      <div className=''>
        {/* <TopHeader /> */}
        {topTen.map((top, index) => {
          return (
            <TopItem
              key={top.investor}
              top={top}
              className={`${index % 2 === 0 ? 'bg-gray-850' : ''}`}
            />
          )
        })}
      </div>
    </div>
  )
})

export { TopTen }
