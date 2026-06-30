import { memo, useCallback, useMemo, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useToast } from '@/hooks/useToast'
import { useAppStore } from '@/stores/appStore'
import { useBaseStore } from '@/stores/baseStore'
import { LazyImage } from '../image/LazyImage'
import storage from '@/utils/storage'
import { LAST_CONNECTED_CHAIN_ID } from '@/config/storage'

interface SwitchChainDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ChainListDrawer = memo(({ open, onOpenChange }: SwitchChainDrawerProps) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const setCurrentChain = useBaseStore(state => state.setCurrentChain)
  const setCurrentChainId = useAppStore(state => state.setCurrentChainId)
  const currentChainId = useAppStore(state => state.currentChainId)
  const chainList = useBaseStore(state => state.chainList)
  const { handleSwitchChain } = useActiveWeb3()

  const supportedChains = useMemo(
    () =>
      chainList.filter(chain => chain.state === 1),
    [chainList]
  )

  const chains = useMemo(() => {
    return supportedChains
  }, [supportedChains])

  const networkText = useMemo(() => chains.map(chain => chain.displayName).join(' / '), [chains])

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

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} title={t('multiChain.t1')}>
        <div className='flex flex-col pb-11'>
          {
            chains.map(chain => (
              <div key={chain.id} className='flex items-center justify-between px-4 py-4'
                onClick={e => {
                  e.stopPropagation()
                  handleSwitch(chain.id)
                    
                }}
              >
            
                <div className=' text-white font-normal text-[14px] flex items-center gap-x-[4px]'>
                  <div className='w-[24px] h-[24px]'>
                    {chain?.icon && <LazyImage src={chain?.icon} className='w-full h-full' />}
                  </div>
                  
                  {chain?.displayName ?? '--'}
                </div>
                {
                  currentChainId === chain.id && <LazyImage src='/images/referral/chain_check.png' className='w-5 h-5' />
                }
              </div>
            ))
          }
          


          
        </div>
      </Drawer>

    </>
  )
})

ChainListDrawer.displayName = 'ChainListDrawer'
