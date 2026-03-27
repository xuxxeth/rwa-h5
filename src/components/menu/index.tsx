import { ConnectButton } from '@/components/button/ConnectButton'
import { MenusItem } from './MenuItem'
import { LngSubMenus } from '../button/LangSubMenus'
import { useTranslation } from '@/hooks/useTranslation'
import { SwitchButton } from '../button/SwitchChainButton'
import { useRouter } from '@/hooks/useRouter'
import { SubMenus } from './SubMenus'
import { SettingSubMenus } from '../button/SettingSubMenus'
import { cn } from '@/utils/tw'
import { useMemo } from 'react'
import { LazyImage } from '@/components/image/LazyImage'

export function Menus() {
  const { t } = useTranslation()
  const router = useRouter()
  const className = useMemo(() => {
    return router.location.pathname === '/lite-trade' ? 'bg-[#1A1B1E]' : ''
  }, [router.location.pathname])

  return (
    <div className='px-5 flex h-13 flex-row justify-between items-center'>
      <div className='flex flex-row gap-2'>
        <LazyImage src='/images/h5/icon.svg' />
        <LazyImage src='/images/h5/logo.svg' />
      </div>
      <SwitchButton />
      <ConnectButton />
    </div>
  )
}
