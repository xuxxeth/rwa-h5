import { memo } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'

interface IdentityExceptionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const IdentityExceptionDrawer = memo(
  ({ open, onOpenChange }: IdentityExceptionDrawerProps) => {
    const { t } = useTranslation()

    return (
      <Drawer open={open} onOpenChange={onOpenChange} title={t('identityException')}>
        <div className="border-t border-gray-700">
          <div className="px-5 py-5">
            <p className="text-[16px] leading-[1.5] text-white">
              {t('identityExceptionDesc')}
            </p>
          </div>
        </div>
      </Drawer>
    )
  },
)

IdentityExceptionDrawer.displayName = 'IdentityExceptionDrawer'
