import { useEffect, useState } from 'react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useTranslation } from '@/hooks/useTranslation'
import { LazyImage } from '../image/LazyImage'
import { Button } from '../ui/button'
import { CheckBox } from '../check-box'
import { kycApi } from '@/service/kyc/api'
import { RESPONSE_CODE } from '@/config/constants'
import { useToast } from '@/hooks/useToast'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { PRIVACY_SERVICE } from '@/config/privacyService'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { H5PdfLink } from '@/components/H5PdfLink'
import { validateInviteCode } from '@/utils'
import { useRouter } from '@/hooks/useRouter'

function getReferralCode(path: string) {
  const match = path.match(/^\/referral\/([^/]+)$/)

  return match ? match[1] : null
}

export const openExternal = (url: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
  const normalizedUrl = url.replace(/\+/g, '%20')
  const isMobile = (() => {
    const uaMobile = (navigator as Navigator & { userAgentData?: { mobile?: boolean } })
      .userAgentData?.mobile
    if (typeof uaMobile === 'boolean') return uaMobile

    const hasTouch = navigator.maxTouchPoints > 0
    const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false
    if (hasTouch && coarsePointer) return true

    return /Mobi|Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Windows Phone|Opera Mini|Kindle|Silk|CriOS|FxiOS/i.test(
      navigator.userAgent
    )
  })()

  const isAndroid = /android/i.test(navigator.userAgent)
  console.log('isMobile', isMobile)
  console.log('isAndroid', isAndroid)
  console.log('navigator.userAgent', navigator.userAgent)

  const isGenericAndroidWebView = isAndroid && /wv|WebView/i.test(navigator.userAgent)
  console.log('isGenericAndroidWebView', isGenericAndroidWebView)

  // 1. 匹配明确的钱包 UA
  const isExplicitWallet =
    /MetaMask|OKX|Binance|Trust|TokenPocket|imToken|Bitget|Bybit|CoinbaseWallet|Coin98|Rainbow|Phantom|SafePal|MathWallet|ONTO|1inch|Klever/i.test(
      navigator.userAgent
    )
  console.log('isExplicitWallet', isExplicitWallet)

  // 2. 匹配通用的 Android WebView 特征 (很多钱包包括 Binance 安卓版隐藏了自身名字，但保留了系统 WebView 的通用标识)
  const isWalletWebView = isExplicitWallet || isGenericAndroidWebView
  console.log('isWalletWebView', isWalletWebView)

  const isPdf = /\.pdf(?:$|\?)/i.test(normalizedUrl)
  const mobileTargetUrl =
    isWalletWebView && isPdf
      ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(normalizedUrl)}`
      : normalizedUrl
  if (isMobile) {
    window.location.href = mobileTargetUrl
    return
  }
  const opened = window.open(normalizedUrl, '_blank', 'noopener,noreferrer')
  if (!opened) {
    window.location.href = normalizedUrl
  }
}

const Compliance = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { account } = useActiveWeb3()
  const [isSignatureValid] = useSignatureValidStatus()
  const { toastError } = useToast()
  const { unlock, lock } = useBodyScrollLock()
  const [show, setShow] = useState(false)
  const [aggree, setAggreee] = useState(false)
  const [loading, setLoading] = useState(false)

  const getAgreementsAccepted = async () => {
    // setLoading(true)
    const res = await kycApi.getAgreementsAccepted()
    // setLoading(false)
    if (res && res.data && !res.data.privacy) {
      setShow(true)
      lock()
    } else {
      setShow(false)
      unlock()
    }
    return res
  }

  const handleAggree = async () => {
    setLoading(true)
    const res = await kycApi.postAgreementsAccept(
      PRIVACY_SERVICE.privacy.version,
      PRIVACY_SERVICE.userService.version
    )
    setLoading(false)
    if (res?.code === RESPONSE_CODE.SUCCESS) {
      setShow(false)
      const resGet = await getAgreementsAccepted()
      if (resGet?.data?.privacy) {
        setShow(false)
        unlock()
      }
    } else {
      toastError({ title: res?.message || '' })
    }
  }

  useEffect(() => {
    const inviteCode = getReferralCode(router.location.pathname)
    
    if (account && isSignatureValid && !validateInviteCode(inviteCode || '')) {
      getAgreementsAccepted()
    } else {
      setShow(false)
    }
  }, [account, isSignatureValid, router.location?.pathname])

  useEffect(() => {
    if(!show) {
      unlock()
    } else {
      lock()
    }
  }, [show])

  return (
    <>
      {show && (
        <Drawer
          open={show}
          dismissible={false}
          modal={true}
          onOpenChange={open => {
            if (open) {
              setShow(true)
            }
          }}
        >
          <DrawerContent
            overlayClassName='z-[9998] bg-[rgba(0,0,0,0.5)] backdrop-blur-[12px]'
            className='z-[9999] border border-[#232427] bg-[#131416] text-white max-h-[90vh] rounded-t-[16px]'
          >
            <DrawerHeader className='justify-center border-b border-[#232427] px-6 pt-4 pb-3'>
              <DrawerTitle className='text-base/5 text-center'>{t('compliance.t1')}</DrawerTitle>
            </DrawerHeader>
            <div className='text-sm/4.5 font-normal overflow-auto px-6 py-4 max-h-[calc(90vh-82px)]'>
              <div className='mb-5 text-base/5'>{t('compliance.t2')}</div>
              <div className='mb-5'>{t('compliance.t3')}</div>
              <div className='space-y-2 text-sm/4.5'>
                <div className='flex items-center gap-x-1'>
                  <LazyImage src='/images/country/us.png' className='w-[24px]' />
                  {t('compliance.t4')}
                </div>
                <div className='flex items-center gap-x-1'>
                  <LazyImage src='/images/country/canada.png' className='w-[24px]' />
                  {t('compliance.t5')}
                </div>
                <div className='flex items-center gap-x-1'>
                  <LazyImage src='/images/country/ru.png' className='w-[24px]' />
                  {t('compliance.t7')}
                </div>
                <div>{t('compliance.t8')}</div>
              </div>
              <div className='mt-5'>
                <div>{t('compliance.t9')}</div>
                <div>• {t('compliance.t10')}</div>
                <div>• {t('compliance.t11')}</div>
                <div>• {t('compliance.t12')}</div>
                <div className='mt-5'>{t('compliance.t13')}</div>
              </div>
              <Button
                disabled={!aggree || loading}
                loading={loading}
                className='w-full mt-8 mb-4'
                onClick={handleAggree}
              >
                {t('compliance.t14')}
              </Button>
              <div className='flex gap-x-2 items-start'>
                <div className=' shrink-0 relative top-[2px]'>
                  <CheckBox
                    onChange={check => {
                      setAggreee(check)
                    }}
                  />
                </div>
                <div className='text-[rgba(255,255,255,0.6)] text-sm/4.5'>
                  {t('identity.aggree1')}
                  <H5PdfLink
                    href={PRIVACY_SERVICE.userService.url}
                    className='text-[rgba(26,133,255,1)]'
                  >
                    《{t('compliance.t15')}》
                  </H5PdfLink>
                  {t('compliance.t17')}
                  <H5PdfLink
                    href={PRIVACY_SERVICE.privacy.url}
                    className='text-[rgba(26,133,255,1)]'
                  >
                    《{t('compliance.t16')}》
                  </H5PdfLink>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export default Compliance
