import { LazyImage } from "@/components/image/LazyImage";
import { Drawer } from '@/components/drawer'
import { useState } from "react";
import type { IRiskControlAsset } from "@/views/assets/assetsList";
import { formatWithCommas, truncate } from "@/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Trans } from "@/components/trans";

function RiskControlAssets({
  riskControlledAssets
}: {
  riskControlledAssets: IRiskControlAsset[]
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="w-[18px] h-[18px]"
        onClick={e => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <LazyImage src="/images/v0.4/risk.png" className="w-[18px] h-[18px]" />
      </button>
      <Drawer open={open} onOpenChange={(open) => {
        setOpen(open)
      }} title={t('portfolio.lockDetail')}>
        <div className=" text-white p-4">
          <div className='flex flex-row justify-between text-sm/4.5 mb-2 text-gray-400'>
            <span>{t('portfolio.name')}</span>
            <span>{t('portfolio.frozen')}</span>
          </div>
          {riskControlledAssets.map(item => {
            return (
              <div
                className='flex flex-row justify-between text-sm/4.5 py-2 [@media(min-height:900px)]:py-4'
                key={item.token}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7">
                    {item.icon && <LazyImage src={item.icon} className="w-7 h-7" />}
                  </div>
                  <div>
                    <span>{item.symbol}</span>
                    <div className="text-[#9DA3AF] text-[12px] mt-[2px]">{item.name}</div>
                  </div>
                </div>
                
                <span>{formatWithCommas(truncate(item.quantity, 2), 2)}</span>
              </div>
            )
          })}
          <div className='bg-gray-900 py-4 rounded-[4px] text-[12px] font-normal border-t border-[#232427]'>
            <div className='text-yellow-50 '>{t('portfolio.riskTitle')}</div>
            <div className='text-yellow-50 mt-1'>
              <Trans
                i18nKey='portfolio.email'
                values={{ email: 'contact@tiko.cc' }}
                components={[<span className='text-blue-50 font-normal' key='email' />]}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export { RiskControlAssets }