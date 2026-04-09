import CheckmarkCircle from '@/components/icons/set/CheckmarkCircle'
import googlLogo from '@/assets/trade/googl-logo.png'
import aaplLogo from '@/assets/trade/aapl-logo.png'
import amznLogo from '@/assets/trade/amzn-logo-24.png'
import nvdaLogo from '@/assets/trade/nvda-logo.png'
import nflxLogo from '@/assets/trade/nflx-logo.png'
import metaLogo from '@/assets/trade/meta-logo.png'
import coinLogo from '@/assets/trade/coin-logo.png'
import { useMemo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { i } from 'node_modules/framer-motion/dist/types.d-BJcRxCew'

const assetLogos = [
  { src: googlLogo, alt: 'GOOGL' },
  { src: aaplLogo, alt: 'AAPL' },
  { src: amznLogo, alt: 'AMZN' },
  { src: nvdaLogo, alt: 'NVDA' },
  { src: nflxLogo, alt: 'NFLX' },
  { src: metaLogo, alt: 'META' },
  { src: coinLogo, alt: 'COIN' },
]



export const Footer = () => {
  const { t, i18n } = useTranslation()
  const features = useMemo(() => {
    return [
      { label: t('home.t21') },
      { label: t('home.t22') },
      { label: t('home.t23') },
    ]
  }, [t, i18n.language])

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 可交易资产展示 */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-[12px] text-gray-400">{t('home.t20')}</span>
        <div className="flex items-center">
          {assetLogos.map((logo, index) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="h-6 w-6 rounded-full border-[3px] border-gray-950 object-cover"
              style={{ marginLeft: index === 0 ? 0 : -6 }}
            />
          ))}
        </div>
      </div>

      {/* 合规 / 安全 / 透明 */}
      <div className="flex w-full items-center justify-between">
        {features.map((feature) => (
          <div key={feature.label} className="flex items-center gap-1">
            <CheckmarkCircle size={16} className="text-green-50" />
            <span className="text-[12px] text-gray-400">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
