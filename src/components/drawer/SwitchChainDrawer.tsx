import { memo, useCallback, useMemo, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useToast } from '@/hooks/useToast'
import { useAppStore } from '@/stores/appStore'
import { useBaseStore } from '@/stores/baseStore'
import storage from '@/utils/storage'
import { LAST_CONNECTED_CHAIN_ID } from '@/config/storage'
import { cn } from '@/utils/tw'
import { LazyImage } from '../image/LazyImage'
import { Button } from '@/components/ui/button'

interface SwitchChainDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disableOutsideClose?: boolean
}

function ChainItem({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: string
  label: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-[56px] w-full items-center justify-between gap-3 bg-[#232427] px-4 text-left transition-opacity rounded-[8px] group',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-90'
      )}
    >
      <div className='flex items-center space-x-3'>
        <div className='flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full bg-[#1B1B1B]'>
          <LazyImage src={icon} className='h-[36px] w-[36px] object-cover' />
        </div>
        <span className='text-[16px] font-medium text-white'>{label}</span>
      </div>
      <div className='hidden group-hover:block'>
        <LazyImage src='/images/referral/chain_selected.png' className='w-6 h-6 ' />
      </div>
    </button>
  )
}

export const SwitchChainDrawer = memo(({ open, onOpenChange, disableOutsideClose }: SwitchChainDrawerProps) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const setCurrentChain = useBaseStore(state => state.setCurrentChain)
  const setCurrentChainId = useAppStore(state => state.setCurrentChainId)
  const chainList = useBaseStore(state => state.chainList)
  const { handleSwitchChain, handleDisConnect } = useActiveWeb3()
  const [loadingChainId, setLoadingChainId] = useState<number | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)

  const supportedChains = useMemo(
    () =>
      chainList.filter(chain => chain.state === 1),
    [chainList]
  )

  const chains = useMemo(() => {
    return supportedChains
  }, [supportedChains])

  const networkText = useMemo(() => chains.filter(c => c.state === 1).map(chain => chain.displayName).join(' / '), [chains])

  const handleSwitch = useCallback(
    async (targetChainId: number) => {

      try {
        const ok = await handleSwitchChain(targetChainId)
        if (ok) {
          onOpenChange(false)
        } else {
          const chain = chains.find(chain => chain.id === targetChainId)
          if (chain) {
            storage.setItem(LAST_CONNECTED_CHAIN_ID, String(chain.id))
            setCurrentChain(chain)
            setCurrentChainId(chain.id)
          }
          toastError({ title: t('switchNetwork', { network: networkText }) })
        }
      } catch (error) {

        toastError({ title: t('switchNetwork', { network: networkText }) })
      } finally {
      }
    }, [chains]
  ) 

  const handleDisconnect = async () => {
    if (disconnecting) return
    try {
      setDisconnecting(true)
      await handleDisConnect()
      onOpenChange(false)
    } catch (error) {
      toastError({ title: t('walletDisconnect') })
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} title={t('multiChain.t1')} disableOutsideClose={true}>
        <div className='text-[14px] font-normal text-[#C7CCD6] py-6 px-4'>{t('multiChain.t2')}</div>
        <div className='flex flex-col px-4'>
          <div className='flex flex-col gap-5'>
            {chains.map(chain => (
              <ChainItem
                key={chain.id}
                icon={chain.icon}
                label={chain.displayName}
                disabled={loadingChainId === chain.id}
                onClick={() => handleSwitch(chain.id)}
              />
            ))}
          </div>
          <div className='mt-3 flex items-center gap-4'>
            <div className='h-px flex-1 bg-[#232427]' />
            <span className='text-[14px] font-medium text-[#737A87]'>{t('multiChain.t3')}</span>
            <div className='h-px flex-1 bg-[#232427]' />
          </div>

          <div className='mt-3'>
            <Button
              type='button'
              variant='default'
              outline
              className='h-[64px] w-full rounded-[8px] bg-[#232427] border-[#232427] text-[16px] font-medium text-white hover:bg-[#232427]'
              onClick={handleDisconnect}
              loading={disconnecting}
            >
              {t('Disconnect')}
            </Button>
          </div>
        </div>
      </Drawer>

    </>
  )
})

SwitchChainDrawer.displayName = 'SwitchChainDrawer'
