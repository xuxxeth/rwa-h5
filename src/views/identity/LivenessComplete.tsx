import { LazyImage } from '@/components/image/LazyImage'
import { CA_LANGUAGE } from '@/config/constants'
import { useTranslation } from '@/hooks/useTranslation'
import storage from '@/utils/storage'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CircularProgress } from '@/components/loading'

const langPrefix = 'identity.face'

export default function LivenessComplete({
  countdown = 5,
  redirect,
}: {
  countdown?: number
  redirect: () => void
}) {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success') === 'true'
  const failReason = parseInt(searchParams.get('failReason') || '0')

  const lang = searchParams.get('language') || storage.getItem(CA_LANGUAGE) || i18n.language

  const [timeLeft, setTimeLeft] = useState(countdown)

  useEffect(() => {
    if (!success) return
    if (timeLeft <= 0) {
      if (redirect) {
        redirect()
      }
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [success, timeLeft])

  useEffect(() => {
    if (!lang) return
    if (lang === storage.getItem(CA_LANGUAGE)) return
    storage.setItem(CA_LANGUAGE, lang)
  }, [lang, i18n])

  const { icon, title, subTitle } = getIconAndText(success, failReason)

  return (
    <div>
      <div className='p-8'>
        <LazyImage src={`/images/icons/identity/${icon}`} className='w-[195px] h-[192px] m-auto' />
      </div>
      <div className='text-xl text-center text-white font-medium'>
        {t(`${langPrefix}.${title}`)}
      </div>
      {success && (
        <div className='flex flex-col items-center justify-center mt-8 gap-2'>
          <CircularProgress progress={(timeLeft / countdown) * 100} size={40} strokeWidth={4}>
            <span className='absolute text-base font-normal text-white'>{timeLeft}</span>
          </CircularProgress>
          <div className='text-base font-normal text-white'>
            {t('identity.face.redirect', { second: timeLeft })}
          </div>
        </div>
      )}
      {/* <div className='mt-4 text-base text-center text-white font-normal'>{t(`${langPrefix}.${subTitle}`)}</div> */}
    </div>
  )
}

function getIconAndText(success: boolean, failReason: number) {
  if (success) {
    return {
      icon: 'liveness-ok.png',
      title: 'complete',
      subTitle: 'sub0',
    }
  }

  switch (failReason) {
    case 1:
      return {
        icon: 'liveness-interrupt.png',
        title: 'f1',
        subTitle: 'sub1',
      }
    case 2:
      return {
        icon: 'liveness-fail.png',
        title: 'f2',
        subTitle: 'sub2',
      }
    case 3:
      return {
        icon: 'liveness-warn.png',
        title: 'f2',
        subTitle: 'sub3',
      }
  }
  return {
    icon: 'liveness-warn.png',
    title: 'f2',
    subTitle: 'sub3',
  }
}
