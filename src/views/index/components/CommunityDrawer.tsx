import { memo } from 'react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { Drawer } from '@/components/drawer'
import { DISCORD_URL, TG_URL, X_URL } from '@/config/constants'
import { cn } from '@/lib/utils'

type CommunityDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type CommunityItem = {
  labelKey: string
  icon: string
  href: string
}

const COMMUNITY_ITEMS: CommunityItem[] = [
  { labelKey: 'v4.t6', icon: '/images/icons/x.png', href: X_URL },
  { labelKey: 'v4.t7', icon: '/images/icons/tg.png', href: TG_URL },
  { labelKey: 'v4.t8', icon: '/images/icons/discord.png', href: DISCORD_URL },
  { labelKey: 'v4.t9', icon: '/images/icons/e_mail.png', href: 'mailto:contact@tiko.cc' },
]

const CommunityDrawer = memo(({ open, onOpenChange }: CommunityDrawerProps) => {
  const { t } = useTranslation()

  const handleOpen = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={t('v4.t1')}
      className='h-auto rounded-t-[24px] border-none bg-[#1A1B1E]'
      overlayClassName='bg-[rgba(19,20,22,0.72)]'
    >
      <div className='px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-2'>
        <div className='flex flex-col gap-3'>
          {COMMUNITY_ITEMS.map(item => (
            <button
              key={item.labelKey}
              type='button'
              className={cn(
                'flex w-full items-center justify-between rounded-[12px] bg-[#232427] px-4 py-[14px] text-left transition-colors',
                'active:bg-white/10'
              )}
              onClick={() => handleOpen(item.href)}
            >
              <div className='flex items-center gap-3'>
                <div className='flex '>
                  <img src={item.icon} alt='' className='h-9 w-9 object-contain' />
                </div>
                <span className='text-[16px] text-white font-medium'>{t(item.labelKey)}</span>
              </div>
              <ChevronRight className='h-5 w-5 text-white/45' />
            </button>
          ))}
        </div>
      </div>
    </Drawer>
  )
})

CommunityDrawer.displayName = 'CommunityDrawer'

export { CommunityDrawer }
