import { memo } from 'react'
import { ChevronRight } from 'lucide-react'
import { Drawer } from '@/components/drawer'
import { DISCORD_URL, TG_URL, X_URL } from '@/config/constants'
import { cn } from '@/lib/utils'

type CommunityDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type CommunityItem = {
  label: string
  icon: string
  href: string
}

const COMMUNITY_ITEMS: CommunityItem[] = [
  { label: 'X', icon: '/images/v0.4/x.png', href: X_URL },
  { label: 'Telegram', icon: '/images/v0.4/tg.png', href: TG_URL },
  { label: 'Discord', icon: '/images/v0.4/discord.png', href: DISCORD_URL },
  { label: 'Contact@tiko.cc', icon: '/images/v0.4/e_mail.png', href: 'mailto:contact@tiko.cc' },
]

const CommunityDrawer = memo(({ open, onOpenChange }: CommunityDrawerProps) => {
  const handleOpen = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title='社群中心'
      className='h-auto rounded-t-[24px] border-none bg-[#1A1B1E]'
      overlayClassName='bg-[rgba(19,20,22,0.72)]'
    >
      <div className='px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-2'>
        <div className='flex flex-col gap-3'>
          {COMMUNITY_ITEMS.map(item => (
            <button
              key={item.label}
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
                <span className='text-[16px] text-white font-medium'>{item.label}</span>
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
