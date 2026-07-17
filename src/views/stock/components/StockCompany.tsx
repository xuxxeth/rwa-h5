import { useI18nLanguage, useTranslation } from '@/hooks/useTranslation'
import { memo, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useTradeStore } from '@/stores/tradeStore'
import { baseApi } from '@/service/base/api'
import type { IProfile } from '@/service/base/types'
import { formatDateToShortEN } from '@/utils/format'
import { TopTen } from './TopTen'

const StockCompany = memo(({ from }: { from?: string }) => {
  const { t, i18n } = useTranslation()
  const lang = useI18nLanguage(i18n)
  const itemClass = from === 'market' ? 'text-[16px] py-4' : ''
  const inputToken = useTradeStore(state => state.inputToken)
  const initRef = useRef(false)
  const [profileData, setProfileData] = useState<IProfile>()

  useEffect(() => {
    // token 或语言变化时重置初始化标记
    initRef.current = false
  }, [inputToken?.stockId, i18n.language])

  useEffect(() => {
    if (!inputToken?.stockId) return

    if (!initRef.current) {
      initRef.current = true // 标记已经初始化过
      baseApi.getProfile(inputToken.stockId).then(res => {
        setProfileData(res?.data || {})
      })
    }
  }, [inputToken?.stockId, i18n.language])

  const _id = useId()

  return (
    <div className='pb-[100px]'>
      <div className='p-4 rounded-[4px] mt-2'
        
      >
        <div className='text-[12px] font-normal mb-2'>{t('companyProfile.profile')}</div>
        <div className='gap-4'>
          {[
            { title: 'name', value: profileData?.companyName },
            {
              title: 'industry',
              value: profileData?.industry,
            },
            {
              title: 'ipoDate',
              value: profileData?.listingDate && formatDateToShortEN(profileData?.listingDate),
            },
            { title: 'chairman', value: profileData?.chairman },
          ].map(({ title, value }, idx) => {
            return (
              <div
                 key={`profile-${_id}-${idx}`}
                className={cn(
                  'w-full flex items-center justify-between font-normal py-[6px] ',
                )}
              >
                <div className='text-[#737A87] text-[12px]'>{t(`companyProfile.${title}`)}</div>
                <div className='text-white text-[12px]'>{value ?? '--'}</div>
              </div>
            )
          })}
        </div>
        <div className='mt-1 text-[12px] font-normal break-words leading-[150%]'>{profileData?.introduction}</div>
      </div>
      <div className='p-4 mt-2'>
        <TopTen topTen={profileData?.topTenShareholders || []} />
      </div>
    </div>
  )
})

export { StockCompany }
